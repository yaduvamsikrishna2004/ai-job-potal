from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from database.db import applications_col, resumes_col, jobs_col
from models.match_model import compute_resume_job_score
from models.embedding_model import compute_resume_vs_jobs
from utils.auth_middleware import token_required        # <-- IMPORTANT

candidate_apply_bp = Blueprint("candidate_apply", __name__)

@candidate_apply_bp.route("/apply", methods=["POST"])
@token_required   # <-- Protect this API
def apply_job(current_user):
    """
    Input JSON:
    {
        "job_id": "<job_id>",
        "resume_id": "<resume_id>",
        "cover_letter": "optional"
    }
    """

    data = request.json
    job_id = data.get("job_id")
    resume_id = data.get("resume_id")
    cover_letter = data.get("cover_letter", "")

    if not job_id or not resume_id:
        return jsonify({"error": "job_id and resume_id are required"}), 400

    # --------------------------------------------------
    # 1️⃣ Fetch job
    # --------------------------------------------------
    try:
        job = jobs_col.find_one({"_id": ObjectId(job_id)})
    except:
        return jsonify({"error": "Invalid job_id"}), 400

    if not job:
        return jsonify({"error": "Job not found"}), 404

    # --------------------------------------------------
    # 2️⃣ Fetch resume (must belong to this user)
    # --------------------------------------------------
    try:
        resume = resumes_col.find_one({
            "_id": ObjectId(resume_id),
            "candidate_email": current_user["email"]   # SECURITY
        })
    except:
        return jsonify({"error": "Invalid resume_id"}), 400

    if not resume:
        return jsonify({"error": "Resume not found for this user"}), 404

    resume_text = resume.get("parsed_text") or resume.get("parsed", {}).get("raw_text", "")
    job_text = job.get("description", "")

    # --------------------------------------------------
    # 3️⃣ Compute hybrid fit score
    # --------------------------------------------------
    tfidf = compute_resume_job_score(resume_text, job_text)
    embed = compute_resume_vs_jobs(resume_text, [job], top_n=1)[0]["embedding_score"]

    fit_score = round(0.6 * embed + 0.4 * tfidf, 2)

    # --------------------------------------------------
    # 4️⃣ Insert into Applications Collection
    # --------------------------------------------------
    application = {
        "job_id": str(job["_id"]),
        "resume_id": str(resume["_id"]),
        "candidate_email": current_user["email"],
        "cover_letter": cover_letter,
        "fit_score": fit_score,
        "status": "applied",
        "applied_at": datetime.utcnow()
    }

    result = applications_col.insert_one(application)
    application["_id"] = str(result.inserted_id)

    return jsonify({
        "message": "Application submitted successfully",
        "application": application
    }), 201
