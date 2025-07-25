/* global webkitSpeechRecognition */
import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import logo from './assets/goasevaflow-logo.png';
import './index.css';
import GraphNode from './components/GraphNode';

const GoaSevaFlow = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [graphSize, setGraphSize] = useState({ width: '100%', height: '200px' });

  // Initial welcome message
  useEffect(() => {
    setChatHistory([
      {
        from: 'bot',
        text: 'Hi! I’m GoaSevaFlow 🤖. How can I assist you today?',
        type: 'text',
      },
    ]);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Set up speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
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
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = (message) => {
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
      
      const graphNode = {
        from: 'bot',
        type: 'graph',
        data: data,
      };

      const botReply = {
        from: 'bot',
        text: 'Here is the service roadmap:',
        type: 'text',
      };

      
      setChatHistory((prev) => {
        const updated = [...prev, botReply, graphNode];
        console.log("Graph Data Added:", graphNode.data);
        // console.log("🧪 typeof edges:", typeof msg.data?.edges);
        return updated;
      });

      setTyping(false);
    })
    .catch((error) => {
      console.error('Error fetching roadmap:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          from: 'bot',
          text: 'Sorry, there was an error processing your request.',
          type: 'text',
        },
      ]);
      setTyping(false);
    });
};


  const handleNewChat = () => {
    setChatHistory([
      {
        from: 'bot',
        text: 'Hi! I’m GoaSevaFlow 🤖. How can I assist you today?',
        type: 'text',
      },
    ]);
    setInput('');
    setTyping(false);
  };

  return (
    <div className='goasevaflow-container'>
      <div className='goasevaflow-header'>
        <img src={logo} alt='GoaSevaFlow Logo' className='goasevaflow-logo' />
        <h1 className='goasevaflow-title'>GoaSevaFlow</h1>
        <button className='new-chat-btn' onClick={handleNewChat}>
          New Chat
        </button>
      </div>

      <div className='goasevaflow-chatbox'>
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={
              msg.from === 'user'
                ? 'goasevaflow-user-bubble'
                : 'goasevaflow-bot-bubble'
            }
          >
            {msg.type === 'graph' ? (
              <div className='bot-canvas-box'>
                <GraphNode
                  nodes={msg.data.nodes}
                  edges={msg.data.edges}
                  width={graphSize.width}
                  height={graphSize.height}
                />
                <button
                  className='view-full-graph-btn'
                  onClick={() => {
                    setGraphSize({ width: '100vw', height: '1000px' });
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
        {typing && (
          <div className='goasevaflow-bot-bubble typing-indicator'>
            Typing...
          </div>
        )}
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
        <button
          onClick={() => handleSend(input)}
          className='goasevaflow-send-btn'
        >
          Send
        </button>
        <button onClick={startListening} className='goasevaflow-mic-btn'>
          <FaMicrophone style={{ color: 'white' }} />
        </button>
      </div>

      {showGraphModal && (
        <div className='graph-modal-overlay'>
          <div className='graph-modal-content'>
            <button
              className='graph-modal-close'
              onClick={() => {
                setShowGraphModal(false);
                setGraphSize({ width: '100%', height: '250px' });
              }}
            >
              Close
            </button>
            <GraphNode
              nodes={
                chatHistory.find((msg) => msg.type === 'graph')?.data.nodes
                  
              }
              edges={
                chatHistory.find((msg) => msg.type === 'graph')?.data.edges
              }
              width='100%'
              height='1000px'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoaSevaFlow;
