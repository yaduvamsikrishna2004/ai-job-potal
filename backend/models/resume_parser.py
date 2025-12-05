import pdfplumber
import docx
import spacy
import en_core_web_sm

# Load spaCy model safely (Python 3.12 compatible)
nlp = en_core_web_sm.load()

# ----------------------------
# EXTRACT TEXT FROM PDF
# ----------------------------
def extract_pdf_text(file):
    try:
        with pdfplumber.open(file) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
            return "\n".join(pages)
    except Exception:
        return ""


# ----------------------------
# EXTRACT TEXT FROM DOCX
# ----------------------------
def extract_docx_text(file):
    try:
        doc = docx.Document(file)
        return "\n".join([p.text for p in doc.paragraphs])
    except Exception:
        return ""


# ----------------------------
# GENERIC TEXT EXTRACTOR
# ----------------------------
def extract_text(uploaded_file):
    filename = uploaded_file.filename.lower()

    if filename.endswith(".pdf"):
        return extract_pdf_text(uploaded_file)

    elif filename.endswith(".docx"):
        return extract_docx_text(uploaded_file)

    else:
        # Try reading as plain text
        try:
            uploaded_file.seek(0)
            return uploaded_file.read().decode("utf-8", errors="ignore")
        except Exception:
            return ""


# ----------------------------
# SKILL LIST (Expand anytime)
# ----------------------------
SKILL_KEYWORDS = [
    "python", "java", "javascript", "html", "css", "react",
    "node", "sql", "mysql", "mongodb", "flask", "django",
    "c++", "c", "c#", "machine learning", "deep learning",
    "nlp", "data analysis", "data science", "cloud",
    "aws", "azure", "gcp", "linux"
]


# ----------------------------
# EXTRACT SKILLS USING NLP
# ----------------------------
def extract_skills(text):
    text_low = text.lower()
    found = []

    for skill in SKILL_KEYWORDS:
        if skill in text_low:
            found.append(skill)

    return list(set(found))  # unique skills


# ----------------------------
# PARSE RESUME MAIN FUNCTION
# ----------------------------
def parse_resume(text):
    doc = nlp(text)

    skills = extract_skills(text)
    entities = []

    for ent in doc.ents:
        entities.append({"text": ent.text, "label": ent.label_})

    parsed = {
        "raw_text": text,
        "entities": entities,
        "skills": skills
    }

    return parsed
