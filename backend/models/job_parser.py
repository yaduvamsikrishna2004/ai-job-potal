"""Placeholder job parser."""
def parse_job(job_json):
    return {"title": job_json.get('title'), "description": job_json.get('description')}
