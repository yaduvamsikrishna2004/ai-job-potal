# backend/recruiter/unreconciled_resumes.py

from flask import Blueprint, jsonify
from temp_db import resumes, users
from utils.helpers import token_required

unreconciled_bp = Blueprint("unreconciled_resumes", __name__)

@unreconciled_bp.route("/unreconciled", methods=["GET"])
@token_required(allowed_roles=["recruiter"])
def get_unreconciled_resumes(_token_payload=None):
    """
    Returns all resumes that:
      - have owner_email = None (uploaded by recruiter)
      - AND either do not have extracted_email OR extracted_email does not match any user
    """

    # Build lookup map of registered users
    user_emails = {u["email"].lower() for u in users}

    unreconciled = []

    for r in resumes:
        if r.get("owner_email"):
            # Already reconciled or owned by candidate → skip
            continue

        extracted = r.get("extracted_email")

        # Case 1: No email extracted
        if not extracted:
            unreconciled.append({
                "resume_id": r.get("resume_id"),
                "reason": "no_extracted_email",
                "skills": r.get("parsed", {}).get("skills", []),
                "uploaded_at": r.get("uploaded_at"),
            })
            continue

        # Case 2: Extracted email does not match any registered user
        if extracted.lower() not in user_emails:
            unreconciled.append({
                "resume_id": r.get("resume_id"),
                "extracted_email": extracted,
                "reason": "no_matching_user",
                "skills": r.get("parsed", {}).get("skills", []),
                "uploaded_at": r.get("uploaded_at")
            })

    return jsonify({
        "count": len(unreconciled),
        "unreconciled_resumes": unreconciled
    }), 200
