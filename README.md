# DT Fusion Plasma Simulator

Real-time 3D particle simulation of Deuterium-Tritium fusion inside a magnetic confinement reactor.

Originally a single 300-line `index.html`. Now decomposed into a clean, maintainable frontend architecture served by a Python Flask backend.

## Why the Flask backend?

Running the simulation via `file://` has many browser restrictions:
- ES modules often blocked or require special flags
- No proper MIME types for `.js` modules
- Future plans (WebSockets, API calls, recording, ML inference) would hit CORS / security walls

The Flask server solves this by serving everything over `http://127.0.0.1:<random>`.

## Project Structure

```
plasmasim/
├── run.sh              # One-click launcher (handles venv + deps + random port)
├── app.py              # Flask server - finds free port, serves static/, auto-opens browser
├── requirements.txt    # Python deps (Flask)
├── .gitignore
├── README.md
└── static/
    ├── index.html      # Clean shell
    ├── css/
    │   └── style.css   # All UI styling (glassmorphic panel, glows, etc.)
    └── js/
        ├── constants.js   # Physical constants (K, fusion thresholds, colors…)
        ├── particle.js    # Particle class (D, T, He, n) with mass/charge/radius/life
        ├── physics.js     # Coulomb, thermal kicks, fusion detection, momentum conservation, boundary
        ├── renderer.js    # Pseudo-3D projection, depth sorting, canvas drawing + sparks + glow
        ├── ui.js          # Buttons, live stats, pointer (mouse+touch) rotation
        └── main.js        # Orchestration, animation loop, world state
```

## How to Run

### Recommended (double-click or terminal)

```bash
cd plasmasim
./run.sh
```

What `run.sh` does:
1. Creates a local `.venv` (if missing)
2. Activates it
3. Runs `pip install -r requirements.txt` with **multiple fallback strategies** if the first attempt fails (upgrade pip, no-cache, direct Flask, even system `apt` packages)
4. Verifies Flask can be imported
5. Executes `app.py`

`app.py` will:
- Pick a completely random free TCP port (never collides with 5000 or anything)
- Print a nice banner with the URL
- Automatically open your default browser
- Serve the entire modular frontend

Press **Ctrl+C** in the terminal to stop the server.

## Controls (in the simulation)

- **Drag** (mouse or touch) horizontally on the canvas → rotate the plasma
- **Pause** / **Resume** button
- **Reset** button (restores 148 particles, clears energy & fusion count)
- Live updating: particle count, fusions, total energy released, temperature (visual)

## Technical Notes

- Physics timestep is intentionally throttled to ~60 Hz for stability
- 10¹²× time dilation so you can watch 10⁻¹² s nuclear events
- Simple but physically inspired model (soft Coulomb + thermal + tunneling prob)
- Neutron lifetime limited (they eventually leave the viewport)
- All original visual behavior preserved exactly (depth sort, shadow glow, trail fade, spark burst on fusion)

## Future Extensions (easy because of clean split)

- Add a `/api/fusion_events` endpoint returning live JSON
- WebSocket live particle streaming to another visualizer
- Record fusion statistics to CSV
- Parameter sliders that call into the physics module
- Three.js upgrade path (renderer is already isolated)

Enjoy watching the stars in a bottle!
