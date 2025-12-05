def test_auth_placeholder():
    from backend.auth.auth_routes import login
    # login is a view function; ensure it's present
    assert callable(login)
