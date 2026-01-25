from flask import Blueprint, request, jsonify
from chatbot.model.chatbot_model import ChatbotModel

chatbot_bp = Blueprint("chatbot", __name__)

# Load model once
model = ChatbotModel()

@chatbot_bp.route("/ask", methods=["POST"])
def ask_chatbot():
    data = request.json
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "Message is required"}), 400

    response = model.get_response(message)
    # Try to extract intent name if matched, else 'unknown'
    matched_intent = None
    user_message = message.lower()
    for intent in model.intents:
        for pattern in intent["patterns"]:
            if pattern.lower() in user_message:
                matched_intent = intent["tag"] if "tag" in intent else None
                break
        if matched_intent:
            break
    return jsonify({
        "intent": matched_intent or "unknown",
        "response": response
    })
