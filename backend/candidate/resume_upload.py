from datetime import datetime
from flask import Blueprint, request, jsonify
from database.db import resumes_col
from models.resume_parser import parse_resume, extract_text
from utils.auth_middleware import token_required, role_required

candidate_resume_upload_bp = Blueprint("candidate_resume_upload", __name__)

@candidate_resume_upload_bp.route("/upload-resume", methods=["POST"])
@token_required
@role_required("candidate")
def upload_resume(current_user):
    # Check if file exists
    if "resume" not in request.files:
        return jsonify({"error": "No resume file found"}), 400

    file = request.files["resume"]

    # Validate file extension
    allowed_ext = ["pdf", "doc", "docx", "txt"]
    ext = file.filename.rsplit(".", 1)[-1].lower()

    if ext not in allowed_ext:
        return jsonify({"error": "Unsupported file type"}), 400

    try:
        text = extract_text(file)
        if not text.strip():
            return jsonify({"error": "Could not extract text from resume. Please upload a valid file."}), 400
        parsed_content = parse_resume(text)
    except Exception as e:
        return jsonify({"error": "Failed to parse resume: " + str(e)}), 400

    # Insert into DB
    result = resumes_col.insert_one({
        "filename": file.filename,
        "candidate_email": current_user["email"],  # <-- IMPORTANT
        "parsed": parsed_content,
        "uploaded_at": datetime.utcnow()
    })

    return jsonify({
        "message": "Resume uploaded successfully!",
        "resume_id": str(result.inserted_id)
    }), 201
