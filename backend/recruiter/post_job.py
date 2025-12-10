from flask import Blueprint, request, jsonify
from database.db import jobs_col
from utils.auth_middleware import token_required, role_required
from datetime import datetime

recruiter_job_bp = Blueprint("recruiter_job", __name__)

@recruiter_job_bp.route("/post-job", methods=["POST"])
@token_required
@role_required("recruiter")
def post_job(current_user):
    data = request.json or {}

    title = data.get("title")
    description = data.get("description")
    skills = data.get("skills", [])
    experience_required = data.get("experience_required", 0)

    # -------------------------
    # Validate fields
    # -------------------------
    if not title or not description:
        return jsonify({"error": "title and description are required"}), 400

    if not isinstance(skills, list):
        return jsonify({"error": "skills must be a list"}), 400

    # -------------------------
    # Create job entry
    # -------------------------
    new_job = {
        "title": title,
        "description": description,
        "skills": skills,
        "experience_required": experience_required,
        "created_by": current_user["email"],
        "created_at": datetime.utcnow(),
    }

    result = jobs_col.insert_one(new_job)
    new_job["_id"] = str(result.inserted_id)

    return jsonify({
        "message": "Job posted!",
        "job": new_job
    }), 201
