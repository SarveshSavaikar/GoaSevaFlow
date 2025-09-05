import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path
from datetime import datetime
# Only initialize once
if not firebase_admin._apps:
    cred_path = Path(__file__).resolve().parent.parent.parent / "serviceAccountKey.json"
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()

def load_firestore_conversations(uid: str):
    chat_threads_ref = (
        db.collection("users")
          .document(uid)
          .collection("chatThreads")
    )
    
    docs = chat_threads_ref.stream()
    all_conversations = {}

    for doc in docs:
        data = doc.to_dict()
        all_conversations[data["conversation_id"]] = data["messages"]

    return all_conversations

def save_conversation_db(uid: str, conversation_id: str, messages: dict):
    print("\ntype:-",type(messages))
    conversation_ref = (
        db.collection("users")
          .document(uid)
          .collection("conversations")
          .document(conversation_id)
    )
        # 🔽 1. Get existing messages (or empty list)
    existing_doc = conversation_ref.get()
    existing_messages = existing_doc.to_dict().get("messages", []) if existing_doc.exists else []

    # 🔽 2. Append the new message
    existing_messages.append(messages)

    # 🔽 3. Set the updated list
    conversation_ref.set({
        "conversation_id": conversation_id,
        "messages": existing_messages,
        "created_at": datetime.utcnow()
    })

def get_service(key: str):
    service_ref = db.collection("services").document(key)
    doc = service_ref.get()

    if doc.exists:
        print("Caught the intent")
        return doc.to_dict()
    else:
        print("Caught Nothing !")
        return None
    