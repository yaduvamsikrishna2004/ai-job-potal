# backend/candidate/resume_management.py

from flask import Blueprint, request, jsonify
from temp_db import resumes
from utils.helpers import token_required

candidate_resume_mgmt_bp = Blueprint("candidate_resume_mgmt", __name__)

@candidate_resume_mgmt_bp.route("/resumes", methods=["GET"])
@token_required(allowed_roles=["candidate"])
def list_resumes(_token_payload=None):
    """
    Return list of resumes that belong to the authenticated candidate.
    """
    owner_email = _token_payload.get("email")
    user_resumes = [
        {
            "resume_id": r["resume_id"],
            "uploaded_at": r.get("uploaded_at"),
            "parsed": r.get("parsed")
        }
        for r in resumes if r.get("owner_email") == owner_email
    ]
    return jsonify({"count": len(user_resumes), "resumes": user_resumes})


@candidate_resume_mgmt_bp.route("/resumes/<int:resume_id>", methods=["GET"])
@token_required(allowed_roles=["candidate"])
def get_resume(resume_id, _token_payload=None):
    """
    Return a single resume if it belongs to the authenticated candidate.
    """
    owner_email = _token_payload.get("email")
    r = next((r for r in resumes if r.get("resume_id") == resume_id), None)
    if not r:
        return jsonify({"error": "resume_id not found"}), 404
    if r.get("owner_email") != owner_email:
        return jsonify({"error": "Forbidden: resume does not belong to you"}), 403

    return jsonify({
        "resume_id": r["resume_id"],
        "uploaded_at": r.get("uploaded_at"),
        "parsed": r.get("parsed")
    })


@candidate_resume_mgmt_bp.route("/resumes/<int:resume_id>", methods=["DELETE"])
@token_required(allowed_roles=["candidate"])
def delete_resume(resume_id, _token_payload=None):
    """
    Delete a candidate's resume (in-memory). Returns success message.
    """
    owner_email = _token_payload.get("email")
    idx = next((i for i, r in enumerate(resumes) if r.get("resume_id") == resume_id), None)
    if idx is None:
        return jsonify({"error": "resume_id not found"}), 404

    r = resumes[idx]
    if r.get("owner_email") != owner_email:
        return jsonify({"error": "Forbidden: resume does not belong to you"}), 403

    # remove resume
    resumes.pop(idx)
    return jsonify({"message": "Resume deleted", "resume_id": resume_id})
