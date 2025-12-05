# backend/candidate/apply_job.py

from flask import Blueprint, request, jsonify
from temp_db import jobs, users, applications, resumes
from utils.helpers import token_required
from models.resume_score_model import compute_resume_job_score
import datetime

candidate_apply_bp = Blueprint("candidate_apply", __name__)

@candidate_apply_bp.route("/apply", methods=["POST"])
@token_required(allowed_roles=["candidate"])
def apply_job(_token_payload=None):
    """
    Candidate must be authenticated.
    Body JSON:
      {
        "job_id": 1,
        "resume_id": 2,   # optional - must belong to candidate if provided
        "cover_letter": "..."
      }
    """
    data = request.json or {}
    job_id = data.get("job_id")
    resume_id = data.get("resume_id", None)
    cover_letter = data.get("cover_letter", "")

    candidate_email = _token_payload.get("email")
    if not candidate_email:
        return jsonify({"error": "Invalid token payload"}), 400

    if job_id is None:
        return jsonify({"error": "job_id is required"}), 400

    # find job
    job = next((j for j in jobs if j["job_id"] == int(job_id)), None)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    # check duplicate application
    existing = next((a for a in applications if a["job_id"] == int(job_id) and a["candidate_email"] == candidate_email), None)
    if existing:
        return jsonify({"error": "Already applied"}), 400

    # if resume_id provided -> verify it belongs to candidate
    resume_obj = None
    if resume_id is not None:
        try:
            resume_id = int(resume_id)
        except ValueError:
            return jsonify({"error": "resume_id must be an integer"}), 400

        resume_obj = next((r for r in resumes if r.get("resume_id") == resume_id), None)
        if not resume_obj:
            return jsonify({"error": "resume_id not found"}), 400
        if resume_obj.get("owner_email") != candidate_email:
            return jsonify({"error": "resume_id does not belong to authenticated candidate"}), 403

    # ---------------------------------------------------------
    # ⭐⭐ COMPUTE RESUME FIT SCORE ⭐⭐
    # ---------------------------------------------------------
    score = 0.0
    if resume_obj is not None:
        resume_text = resume_obj["parsed"]["raw_text"]
        job_description = job["description"]

        # compute TF-IDF similarity-based score
        score = compute_resume_job_score(resume_text, job_description)
    # ---------------------------------------------------------

    # create application entry
    application = {
        "application_id": len(applications) + 1,
        "job_id": int(job_id),
        "candidate_email": candidate_email,
        "resume_id": resume_id if resume_id is not None else None,
        "cover_letter": cover_letter,
        "fit_score": score,
        "status": "applied",
        "applied_at": datetime.datetime.utcnow().isoformat() + "Z"
    }
    applications.append(application)

    return jsonify({
        "message": "Application submitted",
        "application_id": application["application_id"],
        "fit_score": score,
        "job_title": job.get("title")
    }), 201
