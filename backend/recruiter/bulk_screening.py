# backend/recruiter/bulk_screening.py
import io
import re
import datetime
from flask import Blueprint, request, jsonify
from bson import ObjectId
from models.resume_parser import extract_text, parse_resume
from models.resume_score_model import compute_resume_job_score
from temp_db import resumes, applications, jobs
from database.db import jobs_col, resumes_col
from utils.helpers import token_required

recruiter_bulk_bp = Blueprint("recruiter_bulk", __name__)

EMAIL_RE = re.compile(r"[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+")

def extract_email(text):
    if not text:
        return None
    m = EMAIL_RE.search(text)
    return m.group(0).lower() if m else None

@recruiter_bulk_bp.route("/bulk-upload", methods=["POST"])
@token_required(allowed_roles=["recruiter"])
def bulk_upload(_token_payload=None):
    """
    Bulk upload resumes for screening.
    Form-data:
      - job_id (required)
      - resume (file) - can appear multiple times
    Header:
      - Authorization: Bearer <token> (recruiter)
    
    For each uploaded resume:
      - parse it
      - try to extract candidate email
      - save resume in temp_db.resumes with owner_email = None (since recruiter uploaded)
      - compute fit_score vs job description (if job exists)
      - create application entry with candidate_email from extracted email OR placeholder
    Returns created application summaries.
    """
    recruiter_email = _token_payload.get("email")
    job_id_raw = request.form.get("job_id")
    if not job_id_raw:
        return jsonify({"error": "job_id is required in form data"}), 400
    job = None
    job_id = job_id_raw

    # Try MongoDB ObjectId job id first
    if ObjectId.is_valid(job_id_raw):
        job = jobs_col.find_one({"_id": ObjectId(job_id_raw)})
    else:
        # Fallback to in-memory temp_db jobs using integer job_id
        try:
            job_id_int = int(job_id_raw)
        except ValueError:
            return jsonify({"error": "job_id must be a valid ObjectId or integer"}), 400
        job = next((j for j in jobs if j.get("job_id") == int(job_id_int)), None)
        job_id = job_id_int
    if not job:
        return jsonify({"error": "Job not found"}), 404

    # gather uploaded files (Flask's request.files can hold multiple with same name)
    files = request.files.getlist("resume")
    if not files:
        return jsonify({"error": "No resume files uploaded. Use form field name 'resume'."}), 400

    created = []
    now = datetime.datetime.utcnow().isoformat() + "Z"
    for f in files:
        # read & parse
        try:
            text = extract_text(f)
        except Exception:
            # fallback: try reading raw bytes
            try:
                f.stream.seek(0)
                text = f.stream.read().decode("utf-8", errors="ignore")
            except Exception:
                text = ""

        parsed = parse_resume(text)
        extracted_email = extract_email(text)  # candidate email if present

        # persist resume (in-memory)
        resume_entry = {
            "resume_id": len(resumes) + 1,
            "owner_email": None,              # uploaded by recruiter, not candidate
            "parsed": parsed,
            "extracted_email": extracted_email,
            "uploaded_at": now,
            "uploaded_by": recruiter_email
        }
        resumes.append(resume_entry)

        # persist resume to Mongo (so /recruiter/screen can find it)
        try:
            resumes_col.insert_one({
                "filename": getattr(f, "filename", None),
                "candidate_email": extracted_email,
                "parsed": parsed,
                "parsed_text": parsed.get("raw_text", "") or text or "",
                "uploaded_at": datetime.datetime.utcnow(),
                "uploaded_by": recruiter_email,
                "source": "bulk_upload"
            })
        except Exception as db_exc:
            return jsonify({"error": "Database error: " + str(db_exc)}), 500

        # compute fit score
        resume_text = parsed.get("raw_text", "") or text or ""
        job_desc = job.get("description", "") if job else ""
        fit_score = compute_resume_job_score(resume_text, job_desc)

        # candidate_email: use extracted email if present, else placeholder
        candidate_email = extracted_email if extracted_email else f"unknown_{resume_entry['resume_id']}@uploaded.local"

        # create application record
        application = {
            "application_id": len(applications) + 1,
            "job_id": job_id,
            "candidate_email": candidate_email,
            "resume_id": resume_entry["resume_id"],
            "cover_letter": None,
            "fit_score": fit_score,
            "status": "screened",
            "applied_at": now,
            "uploaded_by": recruiter_email
        }
        applications.append(application)

        created.append({
            "application_id": application["application_id"],
            "resume_id": resume_entry["resume_id"],
            "candidate_email": candidate_email,
            "fit_score": fit_score
        })

    return jsonify({
        "message": f"Processed {len(created)} resumes",
        "job_id": job_id,
        "created": created
    }), 201
