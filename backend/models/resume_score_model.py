# backend/models/resume_score_model.py

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import numpy as np

# Global TF-IDF vectorizer (can be trained on dataset later)
vectorizer = TfidfVectorizer(stop_words="english")

def compute_resume_job_score(resume_text, job_description):
    """
    Computes similarity score using TF-IDF vectors.
    Returns score between 0 and 100.
    """

    try:
        texts = [resume_text, job_description]

        # Fit vectorizer on the two documents
        tfidf_matrix = vectorizer.fit_transform(texts)

        # Compute cosine similarity
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

        score = round(float(sim) * 100, 2)
        return score

    except Exception as e:
        print("Error in compute_resume_job_score:", e)
        return 0.0
