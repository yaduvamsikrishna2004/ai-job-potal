from flask import Blueprint, request, jsonify
from models.resume_parser import extract_text, parse_resume
from temp_db import resumes
from utils.auth_middleware import token_required, role_required

recruiter_resume_bp = Blueprint("recruiter_resume", __name__)

@recruiter_resume_bp.route("/upload-resume", methods=["POST"])
@token_required
@role_required("recruiter")
def upload_resume(current_user):
    try:
        if "job_id" not in request.form:
            return jsonify({"error": "job_id is required"}), 400
        try:
            job_id = int(request.form["job_id"])
        except Exception:
            return jsonify({"error": "job_id must be an integer"}), 400

        if "resumes" not in request.files:
            return jsonify({"error": "No resumes part in request"}), 400

        files = request.files.getlist("resumes")
        if not files or len(files) == 0:
            return jsonify({"error": "No resumes uploaded"}), 400

        uploaded = []
        for file in files:
            try:
                text = extract_text(file)
                parsed = parse_resume(text)
                resume_entry = {
                    "resume_id": len(resumes) + 1,
                    "job_id": job_id,
                    "parsed": parsed
                }
                resumes.append(resume_entry)
                uploaded.append({"filename": file.filename, "parsed": parsed})
            except Exception as parse_exc:
                uploaded.append({"filename": file.filename, "error": str(parse_exc)})

        return jsonify({"message": "Resumes processed!", "results": uploaded}), 201
    except Exception as exc:
        return jsonify({"error": "Internal server error: " + str(exc)}), 500
