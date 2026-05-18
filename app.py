#!/usr/bin/env python3
"""
PlasmaSim - D-T Fusion Plasma Simulation Server
Flask backend that serves the modular frontend on a randomly chosen free port.
This allows the simulation to run under http:// instead of file://, bypassing
CORS, module loading restrictions, and other browser security policies for local files.
"""

import os
import socket
import webbrowser
from flask import Flask, send_from_directory, abort

# -----------------------------------------------------------------------------
# Flask app configuration
# -----------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app = Flask(
    __name__,
    static_folder=STATIC_DIR,
    static_url_path=""
)

# Disable aggressive caching for local development / simulation
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


# -----------------------------------------------------------------------------
# Free port discovery (guarantees we never collide with 5000 or anything else)
# -----------------------------------------------------------------------------
def find_free_port() -> int:
    """Ask the OS for an ephemeral free TCP port."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("", 0))
        return s.getsockname()[1]


# -----------------------------------------------------------------------------
# Routes
# -----------------------------------------------------------------------------
@app.route("/")
def index():
    """Serve the main simulation page."""
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(STATIC_DIR, "index.html")
    abort(404)


@app.route("/<path:path>")
def serve_static(path):
    """Serve any asset under static/ (css/, js/, images if added later)."""
    full_path = os.path.join(STATIC_DIR, path)
    if os.path.exists(full_path) and os.path.isfile(full_path):
        return send_from_directory(STATIC_DIR, path)
    abort(404)


# -----------------------------------------------------------------------------
# Health / info endpoint (useful for debugging)
# -----------------------------------------------------------------------------
@app.route("/api/status")
def status():
    return {
        "status": "running",
        "simulation": "D-T Fusion Plasma 3D",
        "particles": 148,
        "backend": "Flask",
        "purpose": "bypass file:// browser restrictions"
    }


# -----------------------------------------------------------------------------
# Main entry
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    port = find_free_port()
    url = f"http://127.0.0.1:{port}"

    print("\n" + "=" * 56)
    print("  DT FUSION • REAL-TIME 3D PLASMA SIMULATOR")
    print("=" * 56)
    print(f"  Serving at:   {url}")
    print(f"  Local files:  {STATIC_DIR}")
    print("  Press CTRL+C to stop the server")
    print("=" * 56 + "\n")

    # Open the user's default browser automatically
    try:
        webbrowser.open(url, new=2, autoraise=True)
    except Exception:
        print(f"[info] Could not auto-open browser. Please visit: {url}\n")

    # Start the development server (reloader disabled to avoid port re-binding)
    app.run(
        host="127.0.0.1",
        port=port,
        debug=False,
        use_reloader=False,
        threaded=True
    )