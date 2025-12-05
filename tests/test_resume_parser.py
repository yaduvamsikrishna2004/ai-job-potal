def test_parse_resume_placeholder():
    from backend.models.resume_parser import parse_resume
    res = parse_resume(None)
    assert isinstance(res, dict)
