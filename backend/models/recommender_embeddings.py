# backend/models/recommender_embeddings.py

from .embedding_model import compute_resume_vs_jobs

def recommend_with_embeddings(resume_text, job_list, top_n=5):
    """
    Thin wrapper that returns top_n jobs with embedding-based scores.
    """
    return compute_resume_vs_jobs(resume_text, job_list, top_n=top_n)
