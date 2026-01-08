import os
import smtplib
import ssl
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

SMTP_EMAIL = os.environ["SMTP_EMAIL"]
SMTP_PASSWORD = os.environ["SMTP_PASSWORD"]
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))

def send_otp_email(to_email, otp):
    try:
        msg = EmailMessage()
        msg["Subject"] = "Your Stutter AI Verification Code"
        msg["From"] = SMTP_EMAIL
        msg["To"] = to_email

        msg.set_content(f"Your verification code is: {otp}")

        context = ssl.create_default_context()

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)

        return True

    except Exception as e:
        print("EMAIL ERROR:", e)
        return False
