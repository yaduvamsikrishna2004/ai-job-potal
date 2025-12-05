# backend/models/embedding_model.py
"""
Embeddings helper using sentence-transformers.
Provides:
 - load_model()
 - embed_texts(texts) -> np.array
 - get_job_embeddings(job_list) -> caches job embeddings in memory
 - cosine_similarity (wrapper)
"""

from sentence_transformers import SentenceTransformer, util
import numpy as np
import threading

_MODEL = None
_MODEL_LOCK = threading.Lock()
_JOB_EMBEDDINGS_CACHE = {
    # "job_cache_version": 0,    # optional versioning
    # job_id_list tuple -> embeddings (np.array)
}
_JOB_EMBEDDINGS_INDEX = {}  # map job_id -> index in cached array
_CACHE_META = {"job_ids": None, "embeddings": None}

def load_model(name="all-MiniLM-L6-v2"):
    global _MODEL
    with _MODEL_LOCK:
        if _MODEL is None:
            _MODEL = SentenceTransformer(name)
        return _MODEL

def embed_texts(texts, convert_to_numpy=True, batch_size=32):
    """Return embeddings for a list of texts (list[str])."""
    model = load_model()
    embs = model.encode(texts, batch_size=batch_size, show_progress_bar=False, convert_to_numpy=True)
    if convert_to_numpy:
        return np.array(embs)
    return embs

def ensure_job_embeddings(job_list):
    """
    Prepare cached job embeddings for the provided job_list. If job_list
    (by job_id order) changes from last cached set, cache is rebuilt.
    Returns (job_ids, embeddings_np) where embeddings_np shape = (n_jobs, dim)
    """
    global _CACHE_META, _JOB_EMBEDDINGS_INDEX

    job_ids = tuple([int(j["job_id"]) for j in job_list])
    cached_ids = _CACHE_META.get("job_ids")

    # rebuild cache if job list changed
    if cached_ids != job_ids:
        texts = [ (j.get("description") or "") for j in job_list ]
        embeddings = embed_texts(texts)
        _CACHE_META["job_ids"] = job_ids
        _CACHE_META["embeddings"] = embeddings
        # rebuild index mapping
        _JOB_EMBEDDINGS_INDEX = {job_id: idx for idx, job_id in enumerate(job_ids)}
    return job_ids, _CACHE_META["embeddings"]

def compute_resume_vs_jobs(resume_text, job_list, top_n=5):
    """
    Compute similarity scores between resume_text and each job description using embeddings.
    Returns top_n jobs with similarity score in 0..100.
    """
    if not job_list or not resume_text:
        return []

    # Ensure job embeddings cached
    job_ids, job_embs = ensure_job_embeddings(job_list)

    resume_emb = embed_texts([resume_text])[0]  # shape (dim,)
    # Use sentence_transformers util.cos_sim for numerical stability (returns tensor)
    cos_scores = util.cos_sim(resume_emb, job_embs)[0].cpu().numpy()  # shape (n_jobs,)

    scored = []
    for idx, score in enumerate(cos_scores):
        job = job_list[idx]
        scored.append({
            "job_id": job["job_id"],
            "title": job.get("title"),
            "description": job.get("description"),
            "skills": job.get("skills", []),
            "embedding_score": round(float(score) * 100, 2)
        })

    # sort by score desc
    scored.sort(key=lambda x: -x["embedding_score"])
    return scored[:top_n]
