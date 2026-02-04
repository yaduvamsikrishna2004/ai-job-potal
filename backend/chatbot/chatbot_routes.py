from flask import Blueprint, request, jsonify
from chatbot.model.chatbot_model import ChatbotModel
from utils.auth_middleware import token_required

chatbot_bp = Blueprint("chatbot", __name__)

# Load model once, with safe fallback
try:
    model = ChatbotModel()
except Exception as model_exc:
    model = None
    model_load_error = str(model_exc)
else:
    model_load_error = None

@chatbot_bp.route("/ask", methods=["POST"])
@token_required  # Allow both candidate and recruiter
def ask_chatbot(current_user):
    try:
        if model is None:
            return jsonify({"error": "Chatbot model unavailable: " + (model_load_error or "unknown error")}), 500
        data = request.json or {}
        message = data.get("message", "")
        if not message:
            return jsonify({"error": "Message is required"}), 400
        try:
            response = model.get_response(message)
        except Exception as resp_exc:
            response = "Sorry, I couldn't process your request. Please try again later."
        # Try to extract intent name if matched, else 'unknown'
        matched_intent = None
        user_message = message.lower()
        try:
            for intent in getattr(model, "intents", []):
                for pattern in intent.get("patterns", []):
                    if pattern.lower() in user_message:
                        matched_intent = intent.get("tag")
                        break
                if matched_intent:
                    break
        except Exception:
            matched_intent = None
        return jsonify({
            "intent": matched_intent or "unknown",
            "response": response
        })
    except Exception as exc:
        return jsonify({"error": "Internal server error: " + str(exc)}), 500
