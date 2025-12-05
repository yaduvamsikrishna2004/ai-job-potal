from flask import Blueprint, request, jsonify
from temp_db import jobs, resumes
from models.match_model import compute_resume_job_score
from models.embedding_model import compute_resume_vs_jobs

candidate_recommend_bp = Blueprint("candidate_recommend", __name__)

@candidate_recommend_bp.route("/recommend", methods=["POST"])
def recommend_jobs():
    """
    Input JSON:
      {
        "resume_id": 1,
        "top_n": 5
      }
    """

    data = request.json
    resume_id = data.get("resume_id")
    top_n = data.get("top_n", 5)

    # Validate resume exists
    resume_obj = next((r for r in resumes if r["resume_id"] == resume_id), None)
    if not resume_obj:
        return jsonify({"error": "Resume not found"}), 404

    resume_text = resume_obj["parsed"]["raw_text"]

    if not jobs:
        return jsonify({"error": "No jobs available"}), 404

    # -------------------------
    # 1️⃣ TF-IDF based scoring
    # -------------------------
    tfidf_scores = []
    for job in jobs:
        score = compute_resume_job_score(resume_text, job["description"])
        tfidf_scores.append({
            "job_id": job["job_id"],
            "title": job["title"],
            "score_tfidf": score
        })

    # -------------------------
    # 2️⃣ Embedding similarity
    # -------------------------
    embed_scores = compute_resume_vs_jobs(resume_text, jobs, top_n=len(jobs))

    # Convert embedding list to map for fast lookup
    embed_map = {item["job_id"]: item["embedding_score"] for item in embed_scores}

    # -------------------------
    # 3️⃣ Combine scores
    # -------------------------
    final_scores = []
    for item in tfidf_scores:
        job_id = item["job_id"]

        tfidf_score = item["score_tfidf"]
        embed_score = embed_map.get(job_id, 0)

        # Weighted hybrid score
        final = round(0.6 * embed_score + 0.4 * tfidf_score, 2)

        # Add job info
        job = next(j for j in jobs if j["job_id"] == job_id)

        final_scores.append({
            "job_id": job_id,
            "title": job["title"],
            "description": job["description"],
            "skills": job["skills"],
            "tfidf_score": tfidf_score,
            "embedding_score": embed_score,
            "final_score": final
        })

    # Sort by final hybrid score
    final_scores.sort(key=lambda x: -x["final_score"])

    return jsonify({
        "resume_id": resume_id,
        "top_n": top_n,
        "recommendations": final_scores[:top_n]
    })
