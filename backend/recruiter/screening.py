from flask import Blueprint, request, jsonify
from temp_db import resumes, jobs
from models.match_model import compute_resume_job_score
from models.embedding_model import compute_resume_vs_jobs

recruiter_screen_bp = Blueprint("recruiter_screen", __name__)

@recruiter_screen_bp.route("/screen", methods=["POST"])
def screen_resumes():
    """
    Input JSON:
      {
        "job_id": 1,
        "top_n": 5
      }
    """

    data = request.json
    job_id = data.get("job_id")
    top_n = data.get("top_n", 10)

    # Validate job
    job_obj = next((j for j in jobs if j["job_id"] == job_id), None)
    if not job_obj:
        return jsonify({"error": "Job not found"}), 404

    job_text = job_obj["description"]

    if not resumes:
        return jsonify({"error": "No resumes uploaded"}), 404

    # -------------------------
    # 1️⃣ TF-IDF scoring
    # -------------------------
    tfidf_scores = []
    for res in resumes:
        score = compute_resume_job_score(res["parsed"]["raw_text"], job_text)
        tfidf_scores.append({
            "resume_id": res["resume_id"],
            "tfidf_score": score
        })

    # -------------------------
    # 2️⃣ Embedding scoring
    # -------------------------
    embed_scores = []
    resume_texts = [r["parsed"]["raw_text"] for r in resumes]
    
    # Compare each resume to the job
    for res in resumes:
        embed = compute_resume_vs_jobs(res["parsed"]["raw_text"], [job_obj], top_n=1)[0]["embedding_score"]
        embed_scores.append({
            "resume_id": res["resume_id"],
            "embedding_score": embed
        })

    embed_map = {e["resume_id"]: e["embedding_score"] for e in embed_scores}

    # -------------------------
    # 3️⃣ Final hybrid score
    # -------------------------
    final_scores = []
    for item in tfidf_scores:
        resume_id = item["resume_id"]
        final = round(
            0.6 * embed_map.get(resume_id, 0) +
            0.4 * item["tfidf_score"], 
        2)

        final_scores.append({
            "resume_id": resume_id,
            "tfidf_score": item["tfidf_score"],
            "embedding_score": embed_map.get(resume_id, 0),
            "final_score": final
        })

    final_scores.sort(key=lambda x: -x["final_score"])

    return jsonify({
        "job_id": job_id,
        "ranked_candidates": final_scores[:top_n]
    })
