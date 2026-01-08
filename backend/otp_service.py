# backend/otp_service.py
import random, smtplib, ssl
from email.message import EmailMessage
from datetime import datetime, timedelta

from .database import users_collection
from dotenv import load_dotenv
import os

load_dotenv()

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = os.getenv("SMTP_PORT")

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(target_email, otp):
    msg = EmailMessage()
    msg["Subject"] = "Your Verification Code - Stutter AI"
    msg["From"] = SMTP_EMAIL
    msg["To"] = target_email
    msg.set_content(f"Your OTP is: {otp}\n\nExpires in 5 minutes.")

    context = ssl.create_default_context()

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)

def store_otp(email, otp):
    users_collection.update_one(
        {"email": email},
        {"$set": {"otp": otp, "otp_expiry": datetime.utcnow() + timedelta(minutes=5)}},
        upsert=True
    )

def verify_otp(email, otp_input):
    user = users_collection.find_one({"email": email})

    if not user or "otp" not in user:
        return False, "No OTP request found."

    if datetime.utcnow() > user.get("otp_expiry"):
        return False, "OTP expired."

    if str(user.get("otp")) != str(otp_input):
        return False, "Invalid OTP."

    # Clear OTP after success
    users_collection.update_one({"email": email}, {"$unset": {"otp": "", "otp_expiry": ""}})

    return True, "OTP Verified."
