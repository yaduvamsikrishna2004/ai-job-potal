import os
import json
import random

class ChatbotModel:
    def __init__(self):
        base_dir = os.path.dirname(__file__)
        intents_path = os.path.join(base_dir, "training_data.json")

        with open(intents_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # store ONLY the intents list
        self.intents = data.get("intents", [])

    def get_response(self, user_message: str):
        user_message = user_message.lower()

        for intent in self.intents:
            for pattern in intent["patterns"]:
                if pattern.lower() in user_message:
                    return random.choice(intent["responses"])

        return "Sorry, I didn’t understand that. Can you rephrase?"
