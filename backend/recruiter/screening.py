from flask import Blueprint, request, jsonify
from bson import ObjectId

from database.db import resumes_col, jobs_col
from utils.auth_middleware import token_required, role_required
from models.match_model import compute_resume_job_score
from models.embedding_model import compute_resume_vs_jobs

recruiter_screen_bp = Blueprint("recruiter_screen", __name__)


@recruiter_screen_bp.route("/screen", methods=["POST"])
@token_required
@role_required("recruiter")
def screen_resumes(current_user):
    """
    Input JSON:
      {
        "job_id": "<mongodb_job_id>",
        "top_n": 5
      }
    """

    try:
        data = request.json or {}
        job_id = data.get("job_id")
        try:
            top_n = int(data.get("top_n", 10))
        except Exception:
            return jsonify({"error": "top_n must be an integer"}), 400

        if not job_id:
            return jsonify({"error": "job_id is required"}), 400

        # 1️⃣ Fetch Job
        try:
            job_obj = jobs_col.find_one({"_id": ObjectId(job_id)})
        except Exception:
            return jsonify({"error": "Invalid job_id"}), 400
        if not job_obj:
            return jsonify({"error": "Job not found"}), 404
        # Ensure job_id exists for embedding model
        job_obj["job_id"] = str(job_obj.get("_id"))
        job_description = job_obj.get("description", "")

        # 2️⃣ Fetch all resumes
        try:
            resume_list = list(resumes_col.find({}))
        except Exception as db_exc:
            return jsonify({"error": "Database error: " + str(db_exc)}), 500
        if not resume_list:
            return jsonify({"error": "No resumes uploaded"}), 404
        for r in resume_list:
            r["_id"] = str(r["_id"])

        # 3️⃣ TF-IDF scoring
        tfidf_scores = []
        for res in resume_list:
            try:
                resume_text = res.get("parsed_text") or res.get("parsed", {}).get("raw_text", "")
                score = compute_resume_job_score(resume_text, job_description)
            except Exception as tfidf_exc:
                return jsonify({"error": "TF-IDF scoring error: " + str(tfidf_exc)}), 500
            tfidf_scores.append({
                "resume_id": res["_id"],
                "tfidf_score": score
            })

        # 4️⃣ Embedding scoring
        embed_scores = []
        for res in resume_list:
            try:
                resume_text = res.get("parsed_text") or res.get("parsed", {}).get("raw_text", "")
                embed_result = compute_resume_vs_jobs(resume_text, [job_obj], top_n=1)
                embed_score = embed_result[0]["embedding_score"]
            except Exception as embed_exc:
                return jsonify({"error": "Embedding scoring error: " + str(embed_exc)}), 500
            embed_scores.append({
                "resume_id": res["_id"],
                "embedding_score": embed_score
            })

        embed_map = {item["resume_id"]: item["embedding_score"] for item in embed_scores}

        # 5️⃣ Final hybrid scoring
        final_scores = []
        for item in tfidf_scores:
            rid = item["resume_id"]
            try:
                final = round(
                    0.6 * embed_map.get(rid, 0) +
                    0.4 * item["tfidf_score"],
                2)
            except Exception as final_exc:
                return jsonify({"error": "Scoring error: " + str(final_exc)}), 500
            final_scores.append({
                "resume_id": rid,
                "tfidf_score": item["tfidf_score"],
                "embedding_score": embed_map.get(rid, 0),
                "final_score": final
            })

        final_scores.sort(key=lambda x: -x["final_score"])

        return jsonify({
            "job_id": job_id,
            "ranked_candidates": final_scores[:top_n],
            "total_resumes_evaluated": len(resume_list)
        })
    except Exception as exc:
        return jsonify({"error": "Internal server error: " + str(exc)}), 500
