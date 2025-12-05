from flask import Blueprint, request, jsonify
from models.resume_parser import extract_text, parse_resume
from temp_db import resumes

recruiter_resume_bp = Blueprint("recruiter_resume", __name__)

@recruiter_resume_bp.route("/upload-resume", methods=["POST"])
def upload_resume():
    file = request.files["resume"]
    job_id = int(request.form["job_id"])

    text = extract_text(file)
    parsed = parse_resume(text)

    resumes.append({
        "resume_id": len(resumes) + 1,
        "job_id": job_id,
        "parsed": parsed
    })

    return jsonify({"message": "Resume uploaded!", "parsed": parsed})
