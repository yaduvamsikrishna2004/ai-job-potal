# backend/utils/jwt_tokens.py
import jwt
import datetime
from functools import wraps
from flask import request, jsonify, current_app

# Use an environment variable or config later. For dev, simple secret here:
SECRET_KEY = "dev_secret_replace_in_prod"

def generate_token(email, role, expires_hours=6):
    payload = {
        "email": email,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=expires_hours),
        "iat": datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    # PyJWT >=2 returns str, <2 returns bytes
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}
