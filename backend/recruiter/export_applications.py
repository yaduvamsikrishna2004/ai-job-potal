# backend/recruiter/export_applications.py

import io
import csv
from flask import Blueprint, request, jsonify, Response
from temp_db import jobs, applications, users, resumes
from utils.helpers import token_required

recruiter_export_bp = Blueprint("recruiter_export", __name__)

# Default columns
DEFAULT_FIELDS = [
    "application_id",
    "job_id",
    "job_title",
    "candidate_name",
    "candidate_email",
    "resume_id",
    "resume_skills",
    "resume_snippet",
    "fit_score",
    "status",
    "applied_at"
]

def iter_csv_rows(job_id, selected_fields, include_resume_snippet=True):
    """Yield CSV rows for streaming."""
    # Header row
    yield selected_fields

    # find job
    job = next((j for j in jobs if j.get("job_id") == int(job_id)), None)
    if not job:
        return

    # get relevant applications sorted by score
    job_apps = [a for a in applications if a.get("job_id") == int(job_id)]
    job_apps.sort(key=lambda a: (-(a.get("fit_score") or 0), a.get("applied_at") or ""))

    for a in job_apps:
        candidate_email = a.get("candidate_email")
        candidate = next((u for u in users if u.get("email", "").lower() == (candidate_email or "").lower()), {})
        cand_name = candidate.get("name") if candidate else ""

        resume_id = a.get("resume_id")
        resume_skills = ""
        resume_snippet = ""
        if resume_id is not None:
            r = next((r for r in resumes if r.get("resume_id") == resume_id), None)
            if r:
                resume_skills = ";".join(r.get("parsed", {}).get("skills", []))
                raw = r.get("parsed", {}).get("raw_text", "") or ""
                resume_snippet = (raw[:200] + "...") if include_resume_snippet and len(raw) > 200 else raw

        # Build all available values
        full_row = {
            "application_id": a.get("application_id"),
            "job_id": job.get("job_id"),
            "job_title": job.get("title"),
            "candidate_name": cand_name,
            "candidate_email": candidate_email,
            "resume_id": resume_id,
            "resume_skills": resume_skills,
            "resume_snippet": resume_snippet,
            "fit_score": a.get("fit_score"),
            "status": a.get("status"),
            "applied_at": a.get("applied_at")
        }

        # Filter by selected fields
        row = [full_row.get(field, "") for field in selected_fields]
        yield row


@recruiter_export_bp.route("/export/<int:job_id>", methods=["GET"])
@token_required(allowed_roles=["recruiter"])
def export_applications(job_id, _token_payload=None):
    """
    Export job applications to CSV with customizable fields.
    Query params:
        fields=application_id,candidate_email,fit_score
        OR fields=all
        include_snippet=true|false (default true)
    """
    recruiter_email = _token_payload.get("email")
    include_snippet = request.args.get("include_snippet", "true").lower() != "false"

    # Determine selected fields
    fields_param = request.args.get("fields", "all")
    if fields_param.lower() == "all":
        selected_fields = DEFAULT_FIELDS
    else:
        selected_fields = [f.strip() for f in fields_param.split(",") if f.strip()]

        # Validate fields
        invalid = [f for f in selected_fields if f not in DEFAULT_FIELDS]
        if invalid:
            return jsonify({"error": "Invalid field(s): " + ", ".join(invalid)}), 400

    # Ensure job exists
    job = next((j for j in jobs if j.get("job_id") == int(job_id)), None)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    # Enforce ownership if present
    posted_by = job.get("posted_by")
    if posted_by and posted_by.lower() != recruiter_email.lower():
        return jsonify({"error": "Forbidden: you do not own this job"}), 403

    # Stream CSV
    def generate():
        buffer = io.StringIO()
        writer = csv.writer(buffer)

        for row in iter_csv_rows(job_id, selected_fields, include_resume_snippet=include_snippet):
            writer.writerow(row)
            buffer.seek(0)
            data = buffer.read()
            yield data
            buffer.truncate(0)
            buffer.seek(0)

    filename = f"applications_job_{job_id}.csv"
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "Content-Type": "text/csv; charset=utf-8"
    }

    return Response(generate(), headers=headers)
