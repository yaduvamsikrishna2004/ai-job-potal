# backend/models/recommender.py

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

# -----------------------------
# HELPER FUNCTIONS
# -----------------------------

def extract_years_experience(text):
    """
    Extract years of experience from a resume using regex.
    Returns integer if found, else 0.
    """
    match = re.findall(r'(\d+)\s+years?', text.lower())
    if match:
        return int(match[0])
    return 0


def compute_skill_overlap(resume_skills, job_skills):
    """
    Computes skill overlap percentage between resume and job skills.
    """
    if not job_skills:
        return 0

    resume_set = set([s.lower() for s in resume_skills])
    job_set = set([s.lower() for s in job_skills])

    matched = resume_set.intersection(job_set)
    return round((len(matched) / len(job_set)) * 100, 2)


# -----------------------------
# HYBRID RECOMMENDATION MODEL
# -----------------------------

def compute_job_recommendations(resume_text, resume_skills, job_list, top_n=5):
    """
    Compute hybrid job recommendations combining:
        - Skill overlap score
        - TF-IDF similarity score
    Returns top_n jobs sorted by final hybrid score.
    """

    if not job_list or not resume_text:
        return []

    documents = [resume_text] + [job["description"] for job in job_list]

    # TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(documents)

    resume_vec = tfidf_matrix[0:1]
    job_vecs = tfidf_matrix[1:]

    tfidf_scores = cosine_similarity(resume_vec, job_vecs)[0]

    results = []

    for i, job in enumerate(job_list):
        tfidf_score = float(tfidf_scores[i] * 100)

        job_skills = job.get("skills", [])
        skill_overlap = compute_skill_overlap(resume_skills, job_skills)

        # Hybrid Score (weights adjustable)
        final_score = round((0.6 * tfidf_score) + (0.4 * skill_overlap), 2)

        results.append({
            "job_id": job["job_id"],
            "title": job["title"],
            "description": job["description"],
            "skills": job_skills,
            "tfidf_score": round(tfidf_score, 2),
            "skill_overlap": skill_overlap,
            "final_score": final_score
        })

    results.sort(key=lambda x: -x["final_score"])
    return results[:top_n]
