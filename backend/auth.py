# backend/auth.py
print("******** USING THIS AUTH.PY ********")

import os
import hashlib
import base64
import hmac
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, EmailStr
import jwt

from dotenv import load_dotenv
from database import users_collection

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

load_dotenv()
router = APIRouter()

# ================= CONFIG =================
JWT_SECRET = os.environ.get("JWT_SECRET")
JWT_ALGO = "HS256"
JWT_EXP_MINUTES = 60 * 24 * 7
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")

# ================= MODELS =================
class SignupIn(BaseModel):
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthIn(BaseModel):
    token: str

# ================= HELPERS =================
def hash_password(password: str) -> str:
    salt = base64.urlsafe_b64encode(os.urandom(16)).decode()
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return f"{salt}${base64.urlsafe_b64encode(dk).decode()}"

def verify_password(password: str, stored: str) -> bool:
    salt, hashed = stored.split("$")
    check = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return hmac.compare_digest(check, base64.urlsafe_b64decode(hashed))

def create_token(email: str):
    return jwt.encode(
        {"email": email, "exp": datetime.utcnow() + timedelta(minutes=JWT_EXP_MINUTES)},
        JWT_SECRET,
        algorithm=JWT_ALGO,
    )

# ================= AUTH DEP =================
def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.split(" ")[1]
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ================= AUTH =================
@router.post("/signup")
def signup(payload: SignupIn):
    if users_collection.find_one({"email": payload.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    users_collection.insert_one({
        "email": payload.email,
        "password": hash_password(payload.password),
        "created_at": datetime.utcnow(),
        "settings": {
            "darkMode": False,
            "emailAlerts": True,
            "aiTips": True,
            "language": "en-US"
        }
    })

    return {"token": create_token(payload.email)}

@router.post("/login")
def login(payload: LoginIn):
    user = users_collection.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "token": create_token(payload.email),
        "settings": user.get("settings", {})
    }

@router.post("/google")
def google_auth(payload: GoogleAuthIn):
    try:
        info = id_token.verify_oauth2_token(
            payload.token,
            google_requests.Request(),
            audience=None
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    if info.get("aud") != GOOGLE_CLIENT_ID and info.get("azp") != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=401, detail="Client ID mismatch")

    email = info.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="No email from Google")

    users_collection.update_one(
        {"email": email},
        {"$setOnInsert": {
            "email": email,
            "created_at": datetime.utcnow(),
            "settings": {
                "darkMode": False,
                "emailAlerts": True,
                "aiTips": True,
                "language": "en-US"
            }
        }},
        upsert=True
    )

    user = users_collection.find_one({"email": email})

    return {
        "token": create_token(email),
        "settings": user.get("settings", {})
    }

# ================= SETTINGS =================
@router.get("/settings")
def get_settings(user=Depends(get_current_user)):
    u = users_collection.find_one({"email": user["email"]})
    return {"settings": u.get("settings", {})}

@router.put("/settings")
def update_settings(settings: dict, user=Depends(get_current_user)):
    users_collection.update_one(
        {"email": user["email"]},
        {"$set": {"settings": settings}}
    )
    return {"success": True}
