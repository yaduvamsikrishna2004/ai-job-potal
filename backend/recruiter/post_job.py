from flask import Blueprint, request, jsonify
from temp_db import jobs

recruiter_job_bp = Blueprint("recruiter_job", __name__)

@recruiter_job_bp.route("/post-job", methods=["POST"])
def post_job():
    data = request.json

    job = {
        "job_id": len(jobs) + 1,
        "title": data["title"],
        "skills": data["skills"],
        "description": data["description"],
        "experience_required": data["experience_required"]
    }

    jobs.append(job)
    return jsonify({"message": "Job posted!", "job": job})
