# backend/candidate/resume_management.py

from flask import Blueprint, request, jsonify

from database.db import resumes_col
from utils.auth_middleware import token_required

candidate_resume_mgmt_bp = Blueprint("candidate_resume_mgmt", __name__)

@candidate_resume_mgmt_bp.route("/resumes", methods=["GET"])
@token_required(allowed_roles=["candidate"])
def list_resumes(current_user):
    """
    Return list of resumes that belong to the authenticated candidate.
    """
    try:
        owner_email = current_user.get("email")
        from bson import ObjectId
        user_resumes = []
        for r in resumes_col.find({"candidate_email": owner_email}):
            user_resumes.append({
                "resume_id": str(r["_id"]),
                "uploaded_at": r.get("uploaded_at"),
                "parsed": r.get("parsed")
            })
        return jsonify({"count": len(user_resumes), "resumes": user_resumes})
    except Exception as exc:
        return jsonify({"error": "Internal server error: " + str(exc)}), 500


@candidate_resume_mgmt_bp.route("/resumes/<resume_id>", methods=["GET"])
@token_required(allowed_roles=["candidate"])
def get_resume(current_user, resume_id):
    """
    Return a single resume if it belongs to the authenticated candidate.
    """
    try:
        from bson import ObjectId
        owner_email = current_user.get("email")
        try:
            r = resumes_col.find_one({"_id": ObjectId(resume_id), "candidate_email": owner_email})
        except Exception:
            return jsonify({"error": "Invalid resume_id"}), 400
        if not r:
            return jsonify({"error": "resume_id not found or not owned by user"}), 404
        return jsonify({
            "resume_id": str(r["_id"]),
            "uploaded_at": r.get("uploaded_at"),
            "parsed": r.get("parsed")
        })
    except Exception as exc:
        return jsonify({"error": "Internal server error: " + str(exc)}), 500



# MongoDB-based delete endpoint
from bson import ObjectId
@candidate_resume_mgmt_bp.route("/delete-resume/<resume_id>", methods=["DELETE"])
@token_required(allowed_roles=["candidate"])
def delete_resume(current_user, resume_id):
    """
    Delete a candidate's resume from MongoDB. Returns success message.
    """
    try:
        from bson import ObjectId
        owner_email = current_user.get("email")
        try:
            result = resumes_col.delete_one({"_id": ObjectId(resume_id), "candidate_email": owner_email})
        except Exception:
            return jsonify({"error": "Invalid resume_id"}), 400
        if result.deleted_count == 0:
            return jsonify({"error": "Resume not found or not owned by user"}), 404
        return jsonify({"message": "Resume deleted", "resume_id": resume_id})
    except Exception as exc:
        return jsonify({"error": "Internal server error: " + str(exc)}), 500
