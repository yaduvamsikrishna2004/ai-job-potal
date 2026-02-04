import os
import json
import random

class ChatbotModel:
    def __init__(self):
        base_dir = os.path.dirname(__file__)
        intents_path = os.path.join(base_dir, "training_data.json")
        try:
            with open(intents_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            self.intents = data.get("intents", [])
        except Exception as exc:
            self.intents = []
            self.load_error = str(exc)

    def get_response(self, user_message: str):
        if hasattr(self, "load_error") and self.load_error:
            return "Sorry, the chatbot is currently unavailable. Please try again later."
        user_message = user_message.lower()
        for intent in self.intents:
            for pattern in intent.get("patterns", []):
                if pattern.lower() in user_message:
                    return random.choice(intent.get("responses", ["I'm here to help!"]))
        return "Sorry, I didn’t understand that. Can you rephrase?"
