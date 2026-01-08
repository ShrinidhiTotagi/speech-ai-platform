# database.py
import os
from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017")
DB_NAME = os.environ.get("MONGO_DBNAME", "stutter_ai")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db["users"]
history_collection = db["analysis_results"]
contact_collection = db["contact_queries"]

