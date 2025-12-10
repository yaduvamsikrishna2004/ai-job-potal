from flask import Blueprint, request, jsonify
from bson import ObjectId

from database.db import resumes_col, jobs_col
from models.match_model import compute_resume_job_score
from models.embedding_model import compute_resume_vs_jobs

candidate_recommend_bp = Blueprint("candidate_recommend", __name__)

@candidate_recommend_bp.route("/recommend", methods=["POST"])
def recommend_jobs():
    """
    Input JSON:
    {
      "resume_id": "<mongodb_id>",
      "top_n": 5
    }
    """
    data = request.json
    resume_id = data.get("resume_id")
    top_n = data.get("top_n", 5)

    if not resume_id:
        return jsonify({"error": "resume_id is required"}), 400

    # ------------------------------------
    # 1️⃣ Fetch resume from MongoDB
    # ------------------------------------
    try:
        resume_doc = resumes_col.find_one({"_id": ObjectId(resume_id)})
    except:
        return jsonify({"error": "Invalid resume_id"}), 400

    if not resume_doc:
        return jsonify({"error": "Resume not found"}), 404

    resume_text = resume_doc.get("parsed_text") or resume_doc.get("parsed", {}).get("raw_text")
    if not resume_text:
        return jsonify({"error": "Resume has no parsed text"}), 400

    # ------------------------------------
    # 2️⃣ Get all jobs from MongoDB
    # ------------------------------------
    job_list = []
    for job in jobs_col.find():
        job["_id"] = str(job["_id"])
        job["job_id"] = job["_id"]   # unify field so model code stays unchanged
        job_list.append(job)

    if len(job_list) == 0:
        return jsonify({"error": "No jobs available"}), 404

    # ------------------------------------
    # 3️⃣ TF-IDF based scoring
    # ------------------------------------
    tfidf_scores = []
    for job in job_list:
        description = job.get("description", "")
        tfidf_score = compute_resume_job_score(resume_text, description)

        tfidf_scores.append({
            "job_id": job["job_id"],
            "title": job["title"],
            "tfidf_score": tfidf_score
        })

    # ------------------------------------
    # 4️⃣ Embedding similarity scoring
    # ------------------------------------
    embed_scores = compute_resume_vs_jobs(resume_text, job_list, top_n=len(job_list))
    embed_map = {item["job_id"]: item["embedding_score"] for item in embed_scores}

    # ------------------------------------
    # 5️⃣ Combine TF-IDF + Embeddings
    # ------------------------------------
    final_list = []
    for item in tfidf_scores:
        job_id = item["job_id"]

        tfidf_score = item["tfidf_score"]
        embed_score = embed_map.get(job_id, 0)

        final_score = round(0.6 * embed_score + 0.4 * tfidf_score, 2)

        job = next(j for j in job_list if j["job_id"] == job_id)

        final_list.append({
            "job_id": job_id,
            "title": job["title"],
            "description": job.get("description", ""),
            "skills": job.get("skills", []),
            "tfidf_score": tfidf_score,
            "embedding_score": embed_score,
            "final_score": final_score
        })

    # Sort & return only top_n
    final_list.sort(key=lambda x: -x["final_score"])

    return jsonify({
        "resume_id": resume_id,
        "top_n": top_n,
        "recommendations": final_list[:top_n]
    })
