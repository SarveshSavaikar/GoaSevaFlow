from fastapi import FastAPI
from pydantic import BaseModel
import requests
import json
from app.logic.fetch_documents import extract_missing_documents

app = FastAPI()

class QueryRequest(BaseModel):
    query: str

OLLAMA_URL = "http://localhost:11434/api/generate"

@app.post("/process-query/")
def ask_gemma3(req: QueryRequest):
    payload = {
        "model": "gemma3:1b",
        "prompt": f"""
You are a chatbot that helps users access government services in Goa.

Given the user query: "{req.query}"

Extract and return the following information in JSON format:
{{
  "intent": "...",
  "missing_documents": ["..."],
  "location": "..."
}}

• "intent" is the main service or document the user is requesting.
• "missing_documents" are any documents the user says they do not have (excluding the one they're requesting) this are the once specified after the word without.
• "location" is any place name mentioned in the query.

Return only the JSON object with no additional text, no labels, and no slashes.
Do not include extra context or reasoning — just the JSON output."""
    }

    response = requests.post(OLLAMA_URL, json=payload)
    string_respose = ""
    for line in response.iter_lines():
        if line:
            try:
                chunk = json.loads(line.decode('utf-8'))
                string_respose += chunk["response"]  # or access other keys
            except json.JSONDecodeError as e:
                print("Invalid JSON:", e)
    
    json_start = string_respose.find('{')
    json_end = string_respose.find('}')
    string_respose = string_respose[json_start:json_end+1]
    data = json.loads(string_respose)
    # full_reply = ""
    # for line in response.iter_lines():
    #     if line:
    #         data = json.loads(line.decode("utf-8"))
    #         full_reply += data.get("response", "")

    # json_str = full_reply[json_start:]

    # parsed = json.loads(json_str)
    
    return data
