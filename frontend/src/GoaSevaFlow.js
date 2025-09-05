/* global webkitSpeechRecognition */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { getAuth, signOut } from 'firebase/auth';
import logo from './assets/goasevaflow-logo.png';
import './index.css';
import GraphNode from './components/GraphNode';
import { useBeforeRender } from "./hooks/useBeforeRender";
import { auth } from './auth/firebase';
import { ReactFlowProvider } from 'reactflow';


const GoaSevaFlow = () => {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const [conversationId, setConversationId] = useState(null);

  const [showGraphModal, setShowGraphModal] = useState(false);
  const [chosen_canvas, setCanvasId] = useState();
  const [graphSize] = useState({ width: '100%', height: '90%' });
  const [modalReady, setModalReady] = useState(false);
  const [conversationKeys, setConversationKeys] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;


  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const originalError = window.console.error;
    window.console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('ResizeObserver loop completed')) {
        return;
      }
      originalError(...args);
    };
    return () => {
      window.console.error = originalError;
    };
  }, []);

  useEffect(() => {
    setChatHistory([
      { from: 'bot', text: 'Hi! I’m GoaSevaFlow 🤖. How can I assist you today?', type: 'text' },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const updateConversation = async (intent, from, type, graph, text) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("❌ No user is currently signed in.");
      // return;
    }
    
    const token = await user.getIdToken();
    console.log("is the token valid :- ",token )
    try {
      const response = await fetch('http://localhost:8000/update-conversation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        // body: JSON.stringify({
        //   intent: intent,
        //   message: message,
        // }),
        body: JSON.stringify({
          intent,
          message: {
            from: from,
            text: text,
            type: type,
            data: graph
          }
        })
      });
      console.log("New Conversation ID = ",intent)
      const data = await response.json();
      console.log("✅ Conversation updated:", data);
    } catch (error) {
      console.error("❌ Error updating conversation:", error);
    }
  };



  const handleSend = useCallback((message) => {
    if (!message.trim()) return;

    const userMsg = { from: 'user', text: message, type: 'text' };
    setChatHistory((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    fetch('http://localhost:8000/get-roadmap/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: message }),
    })
      .then((res) => res.json())
      .then((data) => {
        const graphNode = { from: 'bot', type: 'graph', data };
        const botReply = { from: 'bot', text: 'Here is the service roadmap:', type: 'text' };
        const newMessages = [botReply, graphNode];

        setChatHistory((prev) => {
          const updated = [...prev, ...newMessages];

          // Extract first user message as intent label (optional fallback)
          const intent = updated[1]?.text || "unknown";
          const proceed = async (conversationId) => {
            await updateConversation(conversationId, "user", "text", {}, userMsg.text);
            console.log(conversationId)
            // Call API with last message
            // fetch('http://localhost:8000/update-conversation/', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     intent,
            //     message: {
            //       from: "bot",
            //       text: botReply.text,
            //       type: botReply.type,
            //       graph: {}
            //     }
            //   }),
            // })
            await updateConversation(conversationId, "bot", botReply.type, {}, botReply.text);
            console.log(conversationId)

            // fetch('http://localhost:8000/update-conversation/', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     intent,
            //     message: {
            //       from: "bot",
            //       text: "",
            //       type: "graph",
            //       graph: data
            //     }
            //   }),
            // })
            //   .then((res) => res.json())
            //   .then(console.log)
            //   .catch(console.error);
            await updateConversation(conversationId, "bot", "graph", data, "");
          }
          if (!conversationId) {
            // First message – create a new conversation
            fetch('http://localhost:8000/new-conversation/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ intent: intent }),
            })
              .then((res) => res.json())
              .then((data) => {
                setConversationId(data.conversation_id);
                proceed(data.conversation_id);
              });
          } else {
            proceed(conversationId);
          }



          return updated;
        });

        setTyping(false);
      })
      .catch((error) => {
        console.error('Error fetching roadmap:', error);
        setChatHistory((prev) => [
          ...prev,
          { from: 'bot', text: 'Sorry, there was an error processing your request.', type: 'text' },
        ]);
        setTyping(false);
      });

    // updateConversation(chatHistory[1]['text'], chatHistory[chatHistory.length - 1])
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, [handleSend]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }
    if (recognitionRef.current && !listening) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setListening(true);
          recognitionRef.current.start();
        })
        .catch((err) => {
          console.error('Microphone permission denied:', err);
        });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token"); // Optional: remove token used by FastAPI
      window.location.href = "/"; // or use navigate("/login")
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNewChat = () => {
    setChatHistory([
      { from: 'bot', text: 'Hi! I’m GoaSevaFlow 🤖. How can I assist you today?', type: 'text' },
    ]);
    setInput('');
    setTyping(false);
    setConversationId(null);


    fetchConversationKeys();

  };

  const fetchConversationKeys = async () => {
    try {
      const response = await fetch('http://localhost:8000/get-all-conversations/');
      const data = await response.json();

      setConversationKeys(Object.keys(data));
    } catch (error) {
      console.error("Error fetching conversation keys:", error);
    }
  };

  useEffect(() => {
    if (showGraphModal) {
      const id = requestAnimationFrame(() => setModalReady(true));
      return () => {
        cancelAnimationFrame(id);
        setModalReady(false);
      };
    } else {
      setModalReady(false);
    }
  }, [showGraphModal]);

  useEffect(() => {
    const fetchConversationKeys = async () => {
      try {
        const response = await fetch('http://localhost:8000/get-all-conversations/');
        const data = await response.json();

        setConversationKeys(Object.keys(data));
      } catch (error) {
        console.error("Error fetching conversation keys:", error);
      }
    };

    fetchConversationKeys();
  }, []);

  const switch_convo = async (key) => {
    try {
      const response = await fetch(`http://localhost:8000/get-conversation/${key}`);
      const data = await response.json();
      console.log("Original Chat history :- ", chatHistory)
      setConversationId(key)
      setChatHistory(data || []);
      console.log("Changed chat history :- ", data)

    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  }

  useBeforeRender(() => {
    window.addEventListener("error", (e) => {
      if (e) {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div"
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr) {
          resizeObserverErr.className = "hide-resize-observer";
          console.log("Caught the error message")
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.className = "hide-resize-observer";
          console.log("Caught the error message")

        }
      }
    });
  }, []);

  return (
    <div className='goasevaflow-layout'>
      {/* Sidebar */}
      <div className='goasevaflow-sidebar'>
        <div className='sidebar-header'>GoaSevaFlow</div>
        <button className='sidebar-btn' onClick={handleNewChat}><h4>+ New Chat</h4></button>
        {/* <div className='sidebar-section'>⚙ Settings</div> */}
        <div className="sidebar-section">Past conversations</div>
        <div className='sidebar-chats'>
          {/* You can replace this with a dynamic chat list */}
          {[...conversationKeys].reverse().map((key) => { 
            const trimmedKey = key.slice(0, -21);
            const time_stemp = key.slice(-19);
            const date = new Date(time_stemp).toLocaleString();
            return (
              <div
              key={key}
              className="sidebar-chat-item"
              onClick={() => {
                setConversationId(key)
                console.log("Changed to :- ", key)
                switch_convo(key);
              }}
              style={{ cursor: 'pointer' }} // optional for better UX
            >
              <div>
                <h4>{trimmedKey}</h4>
                <div className='time_stemp_holder'>{date}</div>
              </div>
            </div>
            )
          })}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className='goasevaflow-container'>
        <div className='goasevaflow-header'>
          <img src={logo} alt='GoaSevaFlow Logo' className='goasevaflow-logo' />
          <h1 className='goasevaflow-title'>GoaSevaFlow</h1>
          <button className='new-chat-btn' onClick={handleLogout}>Sign Out</button>
        </div>

        <div className='goasevaflow-chatbox'>
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={msg.from === 'user' ? 'goasevaflow-user-bubble' : msg.type ==='graph' ? 'goasevaflow-bot-canvas-bubble': 'goasevaflow-bot-bubble'}
            >
              {msg.type === 'graph' ? (
                <div className='bot-canvas-box'>
                  {!(showGraphModal && chosen_canvas === index) && (
                    <GraphNode
                      key={`inline-${index}`}
                      nodes={(msg.data == null) ? [] : msg.data.nodes}
                      edges={(msg.data == null) ? [] : msg.data.edges}
                      width={graphSize.width}
                      height={graphSize.height}
                    />
                  )}
                  <button
                    className='view-full-graph-btn'
                    onClick={() => {
                      setCanvasId(index);
                      setShowGraphModal(true);
                    }}
                  >
                    View Full Graph
                  </button>
                </div>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {typing && <div className='goasevaflow-bot-bubble typing-indicator'>Typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <div className='goasevaflow-input-section'>
          <input
            type='text'
            placeholder='Ask me about Goa services...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='goasevaflow-input'
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          />
          <button onClick={() => handleSend(input)} className='goasevaflow-send-btn'>Send</button>
          <button onClick={startListening} className='goasevaflow-mic-btn'>
            <FaMicrophone style={{ color: 'white' }} />
          </button>
        </div>
      </div>

      {showGraphModal && (
        <div className='graph-modal-overlay'>
          <div className='graph-modal-content'>
            <button className='graph-modal-close' onClick={() => setShowGraphModal(false)}>Close</button>
            {modalReady && (
              <GraphNode
                key={`modal-${chosen_canvas}`}
                nodes={chatHistory[chosen_canvas]?.data?.nodes}
                edges={chatHistory[chosen_canvas]?.data?.edges}
                width='200%'
                height='100%'
                
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoaSevaFlow;
