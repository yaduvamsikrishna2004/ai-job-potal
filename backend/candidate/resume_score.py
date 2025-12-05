from flask import Blueprint, request, jsonify
from temp_db import resumes, jobs
from models.match_model import compute_resume_job_score

candidate_resume_bp = Blueprint("candidate_resume_score", __name__)

@candidate_resume_bp.route("/score", methods=["POST"])
def score_resume():
    data = request.json

    resume_id = data.get("resume_id")
    job_id = data.get("job_id")

    # Validate
    resume_obj = next((r for r in resumes if r["resume_id"] == resume_id), None)
    if not resume_obj:
        return jsonify({"error": "Resume not found"}), 404

    job_obj = next((j for j in jobs if j["job_id"] == job_id), None)
    if not job_obj:
        return jsonify({"error": "Job not found"}), 404

    resume_text = resume_obj["parsed"]["raw_text"]
    job_text = job_obj["description"]

    # Compute score
    score = compute_resume_job_score(resume_text, job_text)

    return jsonify({
        "resume_id": resume_id,
        "job_id": job_id,
        "fit_score": score
    })
