# backend/recruiter/notify_candidates.py

from flask import Blueprint, jsonify
from temp_db import resumes, users, notifications
from utils.helpers import token_required
import datetime

notify_bp = Blueprint("notify_candidates", __name__)

@notify_bp.route("/notify-matched", methods=["POST"])
@token_required(allowed_roles=["recruiter"])
def notify_matched_candidates(_token_payload=None):
    """
    Notify candidates whose resumes were reconciled (i.e., owner_email is set).
    This is a placeholder notification system:
      - No real email is sent.
      - A 'notification' entry is stored in temp_db.notifications.
    """

    recruiter_email = _token_payload.get("email")

    now = datetime.datetime.utcnow().isoformat() + "Z"
    created_notifications = []

    for r in resumes:
        owner = r.get("owner_email")
        if not owner:
            continue  # not reconciled yet, skip

        # Find user
        user = next((u for u in users if u["email"].lower() == owner.lower()), None)
        if not user:
            continue  # Should not happen after reconciliation

        message = (
            f"Hello {user.get('name', '').title()}, "
            f"your resume (ID {r.get('resume_id')}) has been reviewed by recruiter {recruiter_email}."
        )

        entry = {
            "candidate_email": owner,
            "resume_id": r.get("resume_id"),
            "message": message,
            "notified_at": now,
            "notified_by": recruiter_email
        }

        notifications.append(entry)
        created_notifications.append(entry)

    return jsonify({
        "message": "Notification simulation complete",
        "count": len(created_notifications),
        "notifications": created_notifications
    }), 200
