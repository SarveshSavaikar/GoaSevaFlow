# main.py
from fastapi import FastAPI , HTTPException ,Depends ,Request
from pydantic import BaseModel
from typing import List
import os
import json
from pathlib import Path
from fastapi import FastAPI
# from app.gemini_integration import ask_gemini
# from app.gamma_integration import ask_gemma
# from firebase_auth import verify_token
from app.gemma3_integration import ask_gemma3
from app.logic.request_resolver import resolve_request
from app.logic.fetch_intent import fetch_service
from app.logic.fetch_documents import extract_missing_documents
from app.logic.newconvo import create_conversation
from app.logic.firebase_utlts import save_conversation_db
from app.logic.model_utlty import ask_sementic_intent_matching_model
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List , Optional , Any
from firebase_admin import auth as firebase_auth
from firebase_auth import get_current_user
from app.logic.firebase_utlts import db
app = FastAPI()


    

    

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Use specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CONVO_FILE = Path("C:/Users/Sarvesh/Documents/infipre internship/govt-servies-chatbot-api/app/data/conversations.json")



# Load & Save logic
def load_conversations() -> Dict:
    if os.path.exists(CONVO_FILE):
        with open(CONVO_FILE, "r") as f:
            return json.load(f)
    return {}

def save_conversations(data: Dict):
    with open(CONVO_FILE, "w") as f:
        json.dump(data, f, indent=2)

# Pydantic models
class Message(BaseModel):
    from_: str = Field(..., alias="from")  # alias for reserved word
    text: str
    type: str
    data: Optional[Dict[str, Any]] = None

class UpdateRequest(BaseModel):
    intent: str
    message: Message
    
class CreateConversationRequest(BaseModel):
    intent: str


@app.get("/")
def home():
    return {"status": "API is running"}

class UserQuery(BaseModel):
    query: str

@app.post("/load_services_FB/")
def load_services_to_FDB(data: UserQuery):

    # If JSON is in a file
    service_path = Path(__file__).resolve().parent / "app" / "data" / "services.json"
    with open(service_path) as f:
        data = json.load(f)
    
    # Write each top-level key as a separate document
    for key, value in data.items():
        if key.strip():  # Skip empty keys like 'zzz' if needed
            db.collection("services").document(key).set(value)

@app.post("/process-query/")
def process_query(data: UserQuery):
    # return {"message": "Received!", "query": data.query}
    result = ask_gemma3(data) # to return the user intent , missing doc , location etc from the users query using gemma3
    return result 

@app.post("/get-roadmap/")
def get_service_roadmap( data: UserQuery):
    intent = ""
    # parsed = ask_gemma3(data)
    objective = ask_sementic_intent_matching_model(data)
    # print("\nGemma 3 O/p , Missing documents :- ",parsed["missing_documents"])
    # if(len(parsed["missing_documents"]) != 0):
    #     print("Missing Doucment = ",parsed["missing_documents"])
    intent = fetch_service(objective,extract_missing_documents(str(data)))
    return resolve_request(
        intent=intent,
        missing_docs=extract_missing_documents(str(data)),
        location="Goa"
    )

@app.post("/update-conversation/")
def update_conversation(data: UpdateRequest,uid: str = Depends(get_current_user)):
    print(uid['uid'])
    conversations = load_conversations()
    # print(conversations)
    print("_____________________________________\n",data.intent)
    if data.intent not in conversations:
        conversations[data.intent] = []
    conversations[data.intent].append(data.message.dict(by_alias=True))
    # print("\n\n-->Data being stored in firebase:- ",data.message)
    save_conversation_db(uid['uid'],data.intent,data.message.dict())
    save_conversations(conversations)
    return {"status": "updated", "intent": data.intent}
    
@app.post("/new-conversation/")
def new_conversation(req: CreateConversationRequest):
    return create_conversation(req=req)

@app.get("/get-all-conversations/")
def get_all_conversations():
    with open(CONVO_FILE, "r") as file:
        data = json.load(file)
    return data

# ✅ GET conversation by ID
@app.get("/get-conversation/{conversation_id}")
def get_conversation(conversation_id: str):
    if not os.path.exists(CONVO_FILE):
        raise HTTPException(status_code=404, detail="File not found")

    with open(CONVO_FILE, "r") as file:
        data = json.load(file)

    if conversation_id not in data:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return data[conversation_id]

@app.get("/secure-data")
async def secure_data(user=Depends(get_current_user)):
    # print(user['uid'])
    return {"message": f"Welcome {user['email']}", "uid": f"{user['uid']}"}