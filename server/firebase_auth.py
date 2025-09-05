# firebase_auth.py
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Request, HTTPException, Depends
from pathlib import Path

if not firebase_admin._apps:
    servicesAccountKey_path = Path(__file__).parent / "serviceAccountKey.json"
    cred = credentials.Certificate(servicesAccountKey_path)
    firebase_admin.initialize_app(cred)
def get_current_user(request: Request):
    auth_header = request.headers.get("authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or malformed")

    id_token = auth_header.split(" ")[1]

    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print("🔥 Token verification failed:", e)
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
