# backend/candidate/resume_upload.py

from flask import Blueprint, request, jsonify
from models.resume_parser import extract_text, parse_resume
from temp_db import resumes
from utils.helpers import token_required
import datetime

candidate_resume_upload_bp = Blueprint("candidate_resume_upload", __name__)

@candidate_resume_upload_bp.route("/upload-resume", methods=["POST"])
@token_required(allowed_roles=["candidate"])
def upload_resume(_token_payload=None):
    """
    Authenticated candidate uploads a resume file.
    Returns: resume_id and parsed content.
    """
    if "resume" not in request.files:
        return jsonify({"error": "No resume file found"}), 400

    file = request.files["resume"]
    text = extract_text(file)
    if not text:
        return jsonify({"error": "Unable to read resume"}), 400

    parsed = parse_resume(text)
    owner_email = _token_payload.get("email")

    resume_entry = {
        "resume_id": len(resumes) + 1,
        "owner_email": owner_email,
        "parsed": parsed,
        "uploaded_at": datetime.datetime.utcnow().isoformat() + "Z"
    }
    resumes.append(resume_entry)

    return jsonify({
        "message": "Resume uploaded successfully",
        "resume_id": resume_entry["resume_id"],
        "parsed": parsed,
        "uploaded_at": resume_entry["uploaded_at"]
    }), 201
