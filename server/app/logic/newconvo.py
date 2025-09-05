from datetime import datetime
from fastapi import FastAPI
from pydantic import BaseModel
import json, os

CONVO_FILE = "data/conversations.json"  # Ensure this exists

def load_conversations():
    if os.path.exists(CONVO_FILE):
        with open(CONVO_FILE, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {}
    return {}

def save_conversations(data):
    os.makedirs(os.path.dirname(CONVO_FILE), exist_ok=True)
    with open(CONVO_FILE, "w") as f:
        json.dump(data, f, indent=2)
        
class CreateConversationRequest(BaseModel):
    intent: str
    
    
def create_conversation(req: CreateConversationRequest):
    conversations = load_conversations()
    timestamp = datetime.now().isoformat(timespec='seconds')
    convo_id = f"{req.intent} - {timestamp}"
    conversations[convo_id] = []
    save_conversations(conversations)
    return {"conversation_id": convo_id}