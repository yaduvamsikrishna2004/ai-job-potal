import os
import textwrap
from typing import List, Dict, Optional

try:
    from google import genai
except Exception:
    genai = None

_CLIENT = None
_LAST_ERROR = None


def _get_client():
    global _CLIENT
    global _LAST_ERROR
    if _CLIENT is not None:
        return _CLIENT
    if genai is None:
        _LAST_ERROR = "google-genai is not installed."
        return None
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        _LAST_ERROR = "GEMINI_API_KEY is not set."
        return None
    try:
        _CLIENT = genai.Client(api_key=api_key)
        _LAST_ERROR = None
        return _CLIENT
    except Exception as exc:
        _LAST_ERROR = f"Failed to initialize Gemini client: {exc}"
        return None


def _get_last_error() -> Optional[str]:
    return _LAST_ERROR


def get_llm_status() -> Dict:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    if genai is None:
        return {
            "configured": False,
            "model": model_name,
            "error": "google-genai is not installed.",
        }
    if not api_key:
        return {
            "configured": False,
            "model": model_name,
            "error": "GEMINI_API_KEY is not set.",
        }
    # Try initializing client to validate configuration
    client = _get_client()
    if client is None:
        return {
            "configured": False,
            "model": model_name,
            "error": _get_last_error() or "Gemini client not available.",
        }
    return {
        "configured": True,
        "model": model_name,
        "error": None,
    }


def _format_history(history: List[Dict]) -> str:
    lines = []
    for msg in history[-10:]:
        sender = msg.get("sender", "user")
        text = (msg.get("text") or "").strip()
        if not text:
            continue
        label = "User" if sender == "user" else "Assistant"
        lines.append(f"{label}: {text}")
    return "\n".join(lines)

def _format_resumes(resumes: List[Dict]) -> str:
    if not resumes:
        return "No resumes on file for this user."
    lines = []
    for r in resumes[:3]:
        rid = r.get("resume_id")
        skills = ", ".join(r.get("skills") or [])
        summary = (r.get("summary") or "").strip()
        if summary:
            summary = summary.replace("\n", " ")
            if len(summary) > 280:
                summary = summary[:280] + "..."
        lines.append(f"- resume_id: {rid} | skills: {skills or 'unknown'} | summary: {summary or 'n/a'}")
    return "\n".join(lines)


def _build_prompt(message: str, role: str, context: Dict, history: List[Dict]) -> str:
    job_lines = []
    for j in context.get("jobs", [])[:10]:
        job_lines.append(
            f"- {j.get('title')} (job_id: {j.get('job_id')}, skills: {', '.join(j.get('skills') or [])})"
        )
    jobs_text = "\n".join(job_lines) if job_lines else "No jobs available."

    prompt = f"""
You are the AI assistant for an AI Job Portal. Be concise, friendly, and actionable.
Role: {role or "unknown"}
User: {context.get("user_email") or "unknown"}
Resumes in system: {context.get("resume_count")}
Applications in system: {context.get("application_count")}

User resumes (for recommendations):
{_format_resumes(context.get("resumes", []))}

Available jobs (top 10):
{jobs_text}

UI steps and required fields (use these when asked "how to"):
- Post a job (Recruiter):
  1) Go to Recruiter Dashboard.
  2) Open "Post Job" screen.
  3) Fill fields: Title, Description, Skills (comma-separated), Experience Required (years).
  4) Submit to create the job.
- Upload resume (Candidate):
  1) Go to Candidate Dashboard.
  2) Open "Upload Resume".
  3) Choose a file (pdf/doc/docx/txt).
  4) Submit to save it.
- Get job recommendations (Candidate):
  1) Go to Candidate Dashboard.
  2) Open "Recommendations".
  3) Select a resume (resume_id) and request recommendations.
- Apply to a job (Candidate):
  1) Browse Jobs or Recommendations.
  2) Open a job and click "Apply".
  3) Select resume_id and optionally add a cover letter, then submit.

Scoring insights (explain when recommending):
- We combine two signals: Embedding similarity (~60%) and TF-IDF similarity (~40%).
- Mention key matched skills from the resume vs job skills.
- If scores are low, suggest how to improve the resume or target roles.

Guidelines:
- If the user asks for jobs, recommend from the available jobs with job_id.
- If the user asks for recommendations, use the user's resume skills/summary and match with available jobs.
- If the user asks how to apply or screen, give UI steps and required fields.
- If information is missing, ask a clarifying question.
- Avoid fabricating data not in the context.

Conversation so far:
{_format_history(history)}

User: {message}
Assistant:
"""
    return textwrap.dedent(prompt).strip()


def generate_llm_reply(
    message: str,
    role: str,
    context: Dict,
    history: List[Dict],
) -> (Optional[str], Optional[str]):
    client = _get_client()
    if client is None:
        return None, _get_last_error()

    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    prompt = _build_prompt(message=message, role=role, context=context, history=history)
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config={
                "temperature": 0.4,
                "max_output_tokens": 512,
            },
        )
    except Exception as exc:
        return None, f"Gemini request failed: {exc}"

    text = getattr(response, "text", None)
    if text:
        return text.strip(), None
    return None, "Gemini returned an empty response."
