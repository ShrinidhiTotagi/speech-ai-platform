from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime
from database import contact_collection

router = APIRouter()

class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str

@router.post("/contact")
def submit_contact(payload: ContactIn):
    doc = {
        "name": payload.name,
        "email": payload.email,
        "message": payload.message,
        "created_at": datetime.utcnow(),
        "status": "new"
    }

    contact_collection.insert_one(doc)

    return {
        "success": True,
        "message": "Your message has been sent successfully"
    }
