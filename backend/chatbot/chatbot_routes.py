from flask import Blueprint, request, jsonify
from chatbot.model.chatbot_model import ChatbotModel
from chatbot.llm import generate_llm_reply, get_llm_status
from database.db import jobs_col, resumes_col, applications_col
from utils.auth_middleware import token_required

chatbot_bp = Blueprint("chatbot", __name__)

# Health check for Gemini configuration
@chatbot_bp.route("/health", methods=["GET"])
def chatbot_health():
    return jsonify(get_llm_status())

# Load model once, with safe fallback
try:
    model = ChatbotModel()
except Exception as model_exc:
    model = None
    model_load_error = str(model_exc)
else:
    model_load_error = None

@chatbot_bp.route("/ask", methods=["POST"])
@token_required  # Allow both candidate and recruiter
def ask_chatbot(current_user):
    try:
        data = request.json or {}
        message = (data.get("message") or "").strip()
        role = (data.get("role") or "").strip() or current_user.get("role", "")
        history = data.get("history") or []

        if not message:
            return jsonify({"error": "Message is required"}), 400

        # Build lightweight context from DB (best-effort)
        context = {
            "user_email": current_user.get("email"),
            "role": role or "unknown",
            "jobs": [],
            "resume_count": None,
            "application_count": None,
            "resumes": [],
        }
        try:
            jobs = list(jobs_col.find())
            context["jobs"] = [
                {
                    "job_id": str(j.get("_id")),
                    "title": j.get("title"),
                    "skills": j.get("skills", []),
                    "experience_required": j.get("experience_required", 0),
                }
                for j in jobs[:10]
            ]
        except Exception:
            context["jobs"] = []

        try:
            context["resume_count"] = resumes_col.count_documents({})
        except Exception:
            context["resume_count"] = None

        # Candidate-specific resumes for personalized recommendations
        if context["role"] == "candidate" and context.get("user_email"):
            try:
                resume_docs = list(resumes_col.find({"candidate_email": context["user_email"]}).limit(3))
                context["resumes"] = [
                    {
                        "resume_id": str(r.get("_id")),
                        "skills": (r.get("parsed", {}) or {}).get("skills", []),
                        "summary": (r.get("parsed", {}) or {}).get("raw_text", ""),
                    }
                    for r in resume_docs
                ]
            except Exception:
                context["resumes"] = []

        try:
            context["application_count"] = applications_col.count_documents({})
        except Exception:
            context["application_count"] = None

        # Prefer LLM (Gemini). If not configured, return an error.
        llm_reply, llm_error = generate_llm_reply(
            message=message,
            role=context["role"],
            context=context,
            history=history,
        )
        if llm_reply:
            return jsonify({
                "intent": "llm",
                "response": llm_reply
            })
        return jsonify({"error": llm_error or "Gemini is not configured or unavailable."}), 503
    except Exception as exc:
        return jsonify({"error": "Internal server error: " + str(exc)}), 500
