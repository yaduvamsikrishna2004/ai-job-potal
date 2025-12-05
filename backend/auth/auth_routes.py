# backend/auth/auth_routes.py
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from temp_db import users
from utils.jwt_tokens import generate_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "candidate")

    if not name or not email or not password:
        return jsonify({"error": "name, email and password are required"}), 400

    # duplicate check
    if any(u for u in users if u["email"].lower() == email.lower()):
        return jsonify({"error": "Email already exists"}), 400

    user = {
        "name": name,
        "email": email.lower(),
        "password_hashed": generate_password_hash(password),
        "role": role
    }
    users.append(user)

    # For convenience return token on registration
    token = generate_token(user["email"], user["role"])
    return jsonify({"message": "Registration successful", "token": token, "role": role}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = next((u for u in users if u["email"].lower() == email.lower()), None)
    if not user or not check_password_hash(user["password_hashed"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token(user["email"], user["role"])
    return jsonify({"message": "Login successful", "token": token, "role": user["role"]})
