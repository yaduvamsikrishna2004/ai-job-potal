# View candidate's job applications
from flask import Blueprint, jsonify
from database.db import applications_col
from utils.auth_middleware import token_required

candidate_applications_bp = Blueprint("candidate_applications", __name__)

@candidate_applications_bp.route("/applications", methods=["GET"])
@token_required(allowed_roles=["candidate"])
def get_applications(current_user):
    """
    Return all job applications for the authenticated candidate.
    """
    try:
        email = current_user.get("email")
        apps = list(applications_col.find({"candidate_email": email}))
        for app in apps:
            app["_id"] = str(app["_id"])
            if "job_id" in app:
                app["job_id"] = str(app["job_id"])
        return jsonify({"count": len(apps), "applications": apps})
    except Exception as exc:
        return jsonify({"error": "Internal server error: " + str(exc)}), 500
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

    try:
        data = request.json
        job_id = data.get("job_id")
        resume_id = data.get("resume_id")
        cover_letter = data.get("cover_letter", "")

        if not job_id or not resume_id:
            return jsonify({"error": "job_id and resume_id are required"}), 400

        # 1️⃣ Fetch job
        try:
            job = jobs_col.find_one({"_id": ObjectId(job_id)})
        except Exception:
            return jsonify({"error": "Invalid job_id"}), 400
        if not job:
            return jsonify({"error": "Job not found"}), 404

        # 2️⃣ Fetch resume (must belong to this user)
        try:
            resume = resumes_col.find_one({
                "_id": ObjectId(resume_id),
                "candidate_email": current_user["email"]
            })
        except Exception:
            return jsonify({"error": "Invalid resume_id"}), 400
        if not resume:
            return jsonify({"error": "Resume not found for this user"}), 404

        try:
            resume_text = resume.get("parsed_text") or resume.get("parsed", {}).get("raw_text", "")
            job_text = job.get("description", "")
            job = dict(job)
            job["job_id"] = str(job["_id"])
            tfidf = compute_resume_job_score(resume_text, job_text)
            embed = compute_resume_vs_jobs(resume_text, [job], top_n=1)[0]["embedding_score"]
            fit_score = round(0.6 * embed + 0.4 * tfidf, 2)
        except Exception as model_exc:
            return jsonify({"error": "Scoring error: " + str(model_exc)}), 500

        # 4️⃣ Insert into Applications Collection
        try:
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
        except Exception as db_exc:
            return jsonify({"error": "Database error: " + str(db_exc)}), 500

        return jsonify({
            "message": "Application submitted successfully",
            "application": application
        }), 201
    except Exception as exc:
        return jsonify({"error": "Internal server error: " + str(exc)}), 500
