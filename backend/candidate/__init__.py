"""Candidate package."""

from .search_jobs import candidate_search_bp
from .apply_job import candidate_apply_bp
from .resume_score import candidate_resume_bp
from .recommendation import candidate_recommend_bp

__all__ = ["candidate_search_bp", "candidate_apply_bp", "candidate_resume_bp", "candidate_recommend_bp"]
