# backend/utils/helpers.py
from functools import wraps
from flask import request, jsonify
from .jwt_tokens import decode_token

def token_required(allowed_roles=None):
    """
    Decorator to protect endpoints.
    allowed_roles: list like ["candidate"] or ["recruiter"] or None (allow any role)
    """
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            auth = request.headers.get("Authorization", "")
            if not auth:
                return jsonify({"error": "Missing Authorization header"}), 401

            # Expect header: "Bearer <token>"
            parts = auth.split()
            if len(parts) != 2 or parts[0].lower() != "bearer":
                return jsonify({"error": "Invalid Authorization header format. Use: Bearer <token>"}), 401

            token = parts[1]
            payload = decode_token(token)
            if isinstance(payload, dict) and payload.get("error"):
                return jsonify({"error": payload.get("error")}), 401

            # role check
            if allowed_roles and payload.get("role") not in allowed_roles:
                return jsonify({"error": "Forbidden: role not allowed"}), 403

            # attach user info to request context by returning payload in kwargs
            # We pass through as kwarg `_token_payload`
            kwargs["_token_payload"] = payload
            return f(*args, **kwargs)
        return wrapped
    return decorator
