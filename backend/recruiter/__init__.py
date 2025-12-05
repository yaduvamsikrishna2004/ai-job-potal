"""Recruiter package."""

from .post_job import recruiter_job_bp
from .upload_resumes import recruiter_resume_bp
from .screening import recruiter_screen_bp

__all__ = ["recruiter_job_bp", "recruiter_resume_bp", "recruiter_screen_bp"]
