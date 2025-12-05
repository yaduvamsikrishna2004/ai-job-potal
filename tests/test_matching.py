def test_matching_placeholder():
    from backend.models.match_model import match_score
    assert match_score({}, {}) == 0.0
