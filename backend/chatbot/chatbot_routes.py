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

    tag = model.predict_intent(message)
    response = model.get_response(tag)

    return jsonify({
        "intent": tag,
        "response": response
    })
