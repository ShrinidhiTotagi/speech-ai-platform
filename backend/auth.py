# backend/auth.py
import os
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import jwt
from database import users_collection
import hashlib, base64, hmac

router = APIRouter()
JWT_SECRET = os.environ.get("JWT_SECRET", "super_secret")
JWT_ALGO = "HS256"
JWT_EXP_MINUTES = 60 * 24 * 7  # 7 days

class SignupIn(BaseModel):
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

def hash_password(password: str):
    salt = base64.urlsafe_b64encode(os.urandom(16)).decode()
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return f"{salt}${base64.urlsafe_b64encode(dk).decode()}"

def verify_password(password: str, stored: str):
    try:
        salt, b64 = stored.split("$")
        dk = base64.urlsafe_b64decode(b64.encode())
        check = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
        return hmac.compare_digest(check, dk)
    except:
        return False

@router.post("/signup")
def signup(user: SignupIn):
    exists = users_collection.find_one({"email": user.email})
    if exists:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed = hash_password(user.password)
    users_collection.insert_one({
        "email": user.email,
        "password": hashed,
        "created_at": datetime.utcnow()
    })
    return {"message": "Signup successful"}

@router.post("/login")
def login(payload: LoginIn):
    user = users_collection.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode(
        {"email": user["email"], "exp": datetime.utcnow() + timedelta(minutes=JWT_EXP_MINUTES)},
        JWT_SECRET,
        algorithm=JWT_ALGO
    )
    return {"token": token}

def get_current_user(authorization: str = Header(None)):
    if not authorization:  
        raise HTTPException(status_code=401, detail="Missing token")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = authorization.split(" ")[1]

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        return {"email": decoded.get("email")}
    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
