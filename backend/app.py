from flask import Flask
from flask_cors import CORS

# Import blueprints
from auth.auth_routes import auth_bp

# Recruiter blueprints
from recruiter.post_job import recruiter_job_bp
from recruiter.upload_resumes import recruiter_resume_bp
from recruiter.screening import recruiter_screen_bp
from recruiter.bulk_screening import recruiter_bulk_bp
from recruiter.export_applications import recruiter_export_bp
from recruiter.reconcile_resumes import reconcile_bp
from recruiter.unreconciled_resumes import unreconciled_bp
from recruiter.notify_candidates import notify_bp

# Candidate blueprints
from candidate.search_jobs import candidate_search_bp
from candidate.apply_job import candidate_apply_bp
from candidate.resume_score import candidate_resume_bp
from candidate.recommendation import candidate_recommend_bp
from candidate.resume_upload import candidate_resume_upload_bp
from candidate.resume_management import candidate_resume_mgmt_bp

# Chatbot
from chatbot.chatbot_routes import chatbot_bp


app = Flask(__name__)
CORS(app)

# ---------- REGISTER ROUTES ---------- #

# Auth
app.register_blueprint(auth_bp, url_prefix="/auth")

# Recruiter
app.register_blueprint(recruiter_job_bp, url_prefix="/recruiter")
app.register_blueprint(recruiter_resume_bp, url_prefix="/recruiter")
app.register_blueprint(recruiter_screen_bp, url_prefix="/recruiter")  # ONLY ONCE
app.register_blueprint(recruiter_bulk_bp, url_prefix="/recruiter")
app.register_blueprint(recruiter_export_bp, url_prefix="/recruiter")
app.register_blueprint(reconcile_bp, url_prefix="/recruiter")
app.register_blueprint(unreconciled_bp, url_prefix="/recruiter")
app.register_blueprint(notify_bp, url_prefix="/recruiter")

# Candidate
app.register_blueprint(candidate_search_bp, url_prefix="/candidate")
app.register_blueprint(candidate_apply_bp, url_prefix="/candidate")
app.register_blueprint(candidate_resume_bp, url_prefix="/candidate")
app.register_blueprint(candidate_recommend_bp, url_prefix="/candidate")
app.register_blueprint(candidate_resume_upload_bp, url_prefix="/candidate")
app.register_blueprint(candidate_resume_mgmt_bp, url_prefix="/candidate")

# Chatbot
app.register_blueprint(chatbot_bp, url_prefix="/chatbot")


@app.route("/")
def home():
    return {"message": "Backend Running Successfully (DB not connected yet)"}


if __name__ == "__main__":
    app.run(debug=True)
