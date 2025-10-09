from pathlib import Path
from flask import Flask, jsonify, send_from_directory, request
import requests

# Import helper to read sites from .env without running the CLI main
from app import get_sites

ROOT = Path(__file__).parent
STATIC_DIR = ROOT / "static"

app = Flask(__name__, static_folder=str(STATIC_DIR), static_url_path="/static")


def _check_site(site: str) -> dict:
    """Perform a single HTTP GET and return a small status dict.

    This helper is intentionally self-contained so the web UI can display
    results without modifying the existing logging behavior in app.py.
    """
    try:
        r = requests.get(site, timeout=7, headers={"User-Agent": "up-down-monitor/1.0"})
        status = "UP" if r.status_code == 200 else f"DOWN ({r.status_code})"
        return {"site": site, "status": status, "code": r.status_code}
    except requests.RequestException as e:
        return {"site": site, "status": f"DOWN (Error: {e})", "code": None}


@app.route("/api/sites", methods=["GET"])
def api_sites():
    """Return the list of configured sites from .env (same as the CLI uses)."""
    sites = get_sites()
    return jsonify(sites)


@app.route("/api/check", methods=["GET", "POST"])
def api_check():
    """Check sites and return JSON results.

    If the client POSTs JSON with a `sites` list, those will be used. Otherwise
    the server reads sites from .env via get_sites().
    """
    payload = None
    if request.method == "POST" and request.is_json:
        payload = request.get_json()

    if payload and isinstance(payload.get("sites"), list):
        sites = payload.get("sites")
    else:
        sites = get_sites()

    results = [_check_site(s) for s in sites]
    return jsonify(results)


@app.route("/")
def index():
    """Serve the single-page frontend."""
    return send_from_directory(str(STATIC_DIR), "index.html")


if __name__ == "__main__":
    # Development server. For production, run behind a WSGI server.
    app.run(host="0.0.0.0", port=5000, debug=True)
