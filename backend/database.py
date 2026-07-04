# database.py
import os
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017")
DB_NAME = os.environ.get("MONGO_DBNAME", "stutter_ai")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")
except ConnectionFailure as e:
    print(f"[ERROR] Could not connect to MongoDB: {e}")
    sys.exit(1)

db = client[DB_NAME]

users_collection = db["users"]
history_collection = db["analysis_results"]
contact_collection = db["contact_queries"]

