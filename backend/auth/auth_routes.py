from flask import Blueprint, request, jsonify
from database.db import users_col
from utils.jwt_tokens import generate_token
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if users_col.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    users_col.insert_one({
        "email": email,
        "password": generate_password_hash(password),
        "role": role
    })

    token = generate_token(email, role)

    return jsonify({"message": "Registration successful", "token": token, "role": role}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password"}), 400

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 400

    token = generate_token(email, user["role"])

    return jsonify({
        "message": "Login successful",
        "role": user["role"],
        "token": token
    })
