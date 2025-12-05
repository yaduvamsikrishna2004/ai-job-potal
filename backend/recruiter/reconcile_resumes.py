# backend/recruiter/reconcile_resumes.py

from flask import Blueprint, jsonify
from temp_db import resumes, users, applications
from utils.helpers import token_required

reconcile_bp = Blueprint("reconcile_resumes", __name__)

@reconcile_bp.route("/reconcile", methods=["POST"])
@token_required(allowed_roles=["recruiter"])
def reconcile_resumes(_token_payload=None):
    """
    Reconcile recruiter-uploaded resumes with registered users by extracted email.
    Also attach reconciled resumes to candidate's resume list.
    """

    recruiter_email = _token_payload.get("email")

    # map of registered users
    user_map = {u["email"].lower(): u for u in users}

    reconciled = []
    unreconciled = []

    for r in resumes:
        # already owned resumes → skip
        if r.get("owner_email"):
            continue

        extracted = r.get("extracted_email")

        # Case 1: missing extracted email
        if not extracted:
            unreconciled.append({
                "resume_id": r.get("resume_id"),
                "reason": "no_extracted_email"
            })
            continue

        email = extracted.lower()

        # Case 2: extracted email not a registered user
        if email not in user_map:
            unreconciled.append({
                "resume_id": r.get("resume_id"),
                "extracted_email": extracted,
                "reason": "no_matching_user"
            })
            continue

        # MATCH FOUND — attach resume to candidate permanently
        candidate = user_map[email]
        r["owner_email"] = candidate["email"]

        # Update placeholder emails in applications
        placeholder_email = f"unknown_{r['resume_id']}@uploaded.local"
        updated_apps = 0

        for a in applications:
            if a.get("resume_id") == r["resume_id"]:
                if a.get("candidate_email") == placeholder_email:
                    a["candidate_email"] = candidate["email"]
                    updated_apps += 1

        reconciled.append({
            "resume_id": r["resume_id"],
            "owner_email": candidate["email"],
            "candidate_name": candidate.get("name"),
            "updated_applications": updated_apps
        })

    return jsonify({
        "message": "Reconciliation complete",
        "reconciled_count": len(reconciled),
        "unreconciled_count": len(unreconciled),
        "reconciled": reconciled,
        "unreconciled": unreconciled
    }), 200
