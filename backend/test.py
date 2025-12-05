from models.resume_parser import extract_text, parse_resume

text = "Hello, I am a Python developer with experience in Flask and AWS."
parsed = parse_resume(text)
print(parsed)
