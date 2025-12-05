from flask import Blueprint, request, jsonify
from temp_db import jobs
from models.match_model import compute_resume_job_score
import re

candidate_search_bp = Blueprint("candidate_search", __name__)

def match_score(required_skills, job_skills):
    """Compute percentage overlap between required skills and job skills."""
    if not required_skills or not job_skills:
        return 0.0

    req = set([s.lower() for s in required_skills])
    job = set([s.lower() for s in job_skills])

    overlap = req.intersection(job)
    score = (len(overlap) / len(req)) * 100
    return round(score, 2)

def text_score(query, text):
    """Simple text-match score: fraction of query tokens present in text."""
    if not query or not text:
        return 0.0
    q_tokens = [t for t in re.findall(r"\w+", query.lower()) if len(t) > 2]
    if not q_tokens:
        return 0.0
    text_lower = text.lower()
    found = sum(1 for t in q_tokens if t in text_lower)
    return found / len(q_tokens)

@candidate_search_bp.route("/search", methods=["GET"])
def search_jobs():
    q = request.args.get("q", "").strip()
    skills = request.args.getlist("skill")
    min_exp = request.args.get("min_exp", None)
    try:
        min_exp = int(min_exp) if min_exp else None
    except ValueError:
        min_exp = None
    limit = int(request.args.get("limit", 20))

    results = []
    for job in jobs:
        if min_exp is not None and job.get("experience_required", 0) < min_exp:
            continue

        if skills:
            job_skills = set([s.lower() for s in job.get("skills", [])])
            req_skills = set([s.lower() for s in skills])
            if not req_skills.issubset(job_skills):
                continue

        if skills:
            skill_match = match_score(skills, job.get("skills", [])) / 100.0
        else:
            skill_match = match_score(q.split(), job.get("skills", [])) / 100.0

        text_match = text_score(q, job.get("title", "") + " " + job.get("description", ""))
        final_score = round((0.6 * skill_match + 0.4 * text_match) * 100, 2)

        results.append({
            "job_id": job["job_id"],
            "title": job.get("title"),
            "description": job.get("description"),
            "skills": job.get("skills", []),
            "experience_required": job.get("experience_required", 0),
            "score": final_score
        })

    results.sort(key=lambda x: (-x["score"], x["job_id"]))
    return jsonify({"count": len(results), "results": results[:limit]})
