from flask import Blueprint, jsonify
from database.db import jobs_col

list_jobs_bp = Blueprint("list_jobs", __name__)

@list_jobs_bp.route("/jobs", methods=["GET"])
def list_jobs():
    jobs = []
    for job in jobs_col.find():
        jobs.append({
            "job_id": str(job["_id"]),
            "title": job.get("title"),
            "description": job.get("description"),
            "skills": job.get("skills", []),
            "experience_required": job.get("experience_required", 0),
            "created_at": job.get("created_at")
        })

    return jsonify({"count": len(jobs), "jobs": jobs})
