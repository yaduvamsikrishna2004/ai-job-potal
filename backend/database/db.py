from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_col = db["users"]
jobs_col = db["jobs"]
resumes_col = db["resumes"]
applications_col = db["applications"]
embeddings_col = db["embeddings"]