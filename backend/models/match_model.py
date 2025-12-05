from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_resume_job_score(resume_text, job_desc):
    if not resume_text or not job_desc:
        return 0

    docs = [resume_text, job_desc]
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf = vectorizer.fit_transform(docs)

    score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    
    return round(score * 100, 2)
