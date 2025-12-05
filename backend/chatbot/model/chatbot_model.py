import random
import json
import numpy as np
import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

class ChatbotModel:
    def __init__(self):
        self.intents = json.load(open("chatbot/model/training_data.json"))
        self.vectorizer = CountVectorizer()
        self.model = MultinomialNB()

        self.train()

    def clean_text(self, text):
        text = text.lower()
        text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
        return text

    def train(self):
        patterns = []
        labels = []

        for intent in self.intents["intents"]:
            for pattern in intent["patterns"]:
                patterns.append(self.clean_text(pattern))
                labels.append(intent["tag"])

        X = self.vectorizer.fit_transform(patterns)
        self.model.fit(X, labels)

    def predict_intent(self, message):
        cleaned = self.clean_text(message)
        X = self.vectorizer.transform([cleaned])
        return self.model.predict(X)[0]

    def get_response(self, tag):
        for intent in self.intents["intents"]:
            if intent["tag"] == tag:
                return random.choice(intent["responses"])
        return "I’m not sure I understand. Can you rephrase?"
