"""Lunet Labz API tests — projects + waitlist."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://code-ghost-portal.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

EXPECTED_PROJECT_IDS = {"ghostpad", "lanternfm", "atlas-cli", "lumenboard", "tinybrew", "mothlamp"}


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Health / root ----
class TestRoot:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()


# ---- Projects ----
class TestProjects:
    def test_list_projects_returns_six(self, session):
        r = session.get(f"{API}/projects")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 6

    def test_project_ids_match(self, session):
        r = session.get(f"{API}/projects")
        ids = {p["id"] for p in r.json()}
        assert ids == EXPECTED_PROJECT_IDS

    def test_project_shape(self, session):
        r = session.get(f"{API}/projects")
        for p in r.json():
            assert "title" in p and isinstance(p["title"], str)
            assert "tagline" in p
            assert "description" in p
            assert "image" in p
            assert isinstance(p.get("tags", []), list)


# ---- Waitlist ----
class TestWaitlist:
    def test_count_endpoint_returns_numeric(self, session):
        r = session.get(f"{API}/waitlist/count")
        assert r.status_code == 200
        data = r.json()
        assert "count" in data
        assert isinstance(data["count"], int)

    def test_join_valid_email(self, session):
        email = f"test_{uuid.uuid4().hex[:10]}@example.com"
        r = session.post(f"{API}/waitlist", json={"email": email})
        assert r.status_code in (200, 201)
        data = r.json()
        assert data["email"] == email.lower()
        assert "id" in data
        assert "created_at" in data

    def test_duplicate_returns_409(self, session):
        email = f"dup_{uuid.uuid4().hex[:10]}@example.com"
        r1 = session.post(f"{API}/waitlist", json={"email": email})
        assert r1.status_code in (200, 201)
        r2 = session.post(f"{API}/waitlist", json={"email": email})
        assert r2.status_code == 409
        assert "detail" in r2.json()

    def test_duplicate_case_insensitive(self, session):
        email = f"Case_{uuid.uuid4().hex[:10]}@Example.com"
        r1 = session.post(f"{API}/waitlist", json={"email": email})
        assert r1.status_code in (200, 201)
        r2 = session.post(f"{API}/waitlist", json={"email": email.upper()})
        assert r2.status_code == 409

    def test_invalid_email_returns_422(self, session):
        r = session.post(f"{API}/waitlist", json={"email": "not-an-email"})
        assert r.status_code == 422

    def test_count_increments_after_signup(self, session):
        before = session.get(f"{API}/waitlist/count").json()["count"]
        email = f"inc_{uuid.uuid4().hex[:10]}@example.com"
        r = session.post(f"{API}/waitlist", json={"email": email})
        assert r.status_code in (200, 201)
        after = session.get(f"{API}/waitlist/count").json()["count"]
        assert after >= before + 1
