# backend/utils/auth_middleware.py

from functools import wraps
from flask import request, jsonify
from utils.jwt_tokens import decode_token


# Enhanced token_required: supports @token_required or @token_required(allowed_roles=[...])
def token_required(f=None, allowed_roles=None):
    def decorator(func):
        @wraps(func)
        def decorated(*args, **kwargs):
            token = None
            auth_header = request.headers.get("Authorization", None)
            if auth_header:
                parts = auth_header.split()
                if len(parts) == 2 and parts[0] == "Bearer":
                    token = parts[1]
            if not token:
                return jsonify({"error": "Token missing"}), 401
            payload = decode_token(token)
            if "error" in payload:
                if payload["error"] == "Token expired":
                    return jsonify({"error": "Token expired"}), 401
                return jsonify({"error": "Invalid token"}), 401
            current_user = {
                "email": payload["email"],
                "role": payload["role"]
            }
            # Role check if allowed_roles specified
            if allowed_roles and current_user["role"] not in allowed_roles:
                return jsonify({"error": f"Access denied. Allowed roles: {allowed_roles}"}), 403
            return func(current_user, *args, **kwargs)
        return decorated
    # If used as @token_required
    if f and callable(f):
        return decorator(f)
    # If used as @token_required(...)
    return decorator

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def wrapper(current_user, *args, **kwargs):
            if current_user["role"] != required_role:
                return jsonify({"error": f"Access denied. Only {required_role} allowed"}), 403
            return f(current_user, *args, **kwargs)
        return wrapper
    return decorator
