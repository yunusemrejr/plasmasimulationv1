# Plasma Simulation v1

**Real-time 3D Deuterium-Tritium Fusion Plasma Simulator**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A interactive, real-time particle simulation of fusion plasma in a magnetic confinement environment. Built with a lightweight Python Flask backend serving a modular vanilla JavaScript + HTML5 Canvas frontend.

Originally prototyped as a monolithic `index.html`, the project has been cleanly refactored for maintainability, extensibility, and to bypass browser security restrictions on local file access.

## Overview

This simulator models charged particles (Deuterium, Tritium, fusion products) under the influence of:

- Coulomb interactions
- Thermal motion
- Probabilistic nuclear fusion (D-T reactions)
- Simplified magnetic confinement boundaries

It provides an intuitive visual window into plasma behavior and fusion events at extreme time dilation, allowing observation of nuclear-scale phenomena in real time.

## Key Features

- **Real-time 3D Visualization**: Pseudo-3D rendering with depth sorting, particle glows, trails, and spark effects on fusion
- **Interactive Controls**: Mouse/touch drag to rotate the view; pause, resume, and reset simulation
- **Live Diagnostics**: Particle count, fusion events, total energy released, and visual temperature feedback
- **One-Click Launch**: `run.sh` handles virtual environment, dependencies, random free port selection, and auto-opens browser
- **Modular Architecture**: Separated concerns across physics, rendering, UI, and constants for easy extension
- **Future-Ready Backend**: Flask server enables WebSockets, REST APIs, logging, and ML integration without CORS issues

## Quick Start

### Prerequisites

- Python 3.8 or higher
- A modern browser (Chrome, Firefox, or Edge recommended)

### Launch the Simulation

```bash
git clone https://github.com/yunusemrejr/plasmasimulationv1.git
cd plasmasimulationv1
./run.sh
```

The launcher script (`run.sh`) will:
1. Create a local virtual environment (`.venv`) if needed
2. Activate the environment
3. Install dependencies from `requirements.txt` (with robust fallback logic)
4. Verify Flask installation
5. Start `app.py`, which selects a random free port, prints connection info, and automatically opens the simulation in your default browser

Stop the server anytime with **Ctrl + C**.

## Controls

| Control              | Action                                      |
|----------------------|---------------------------------------------|
| -------------------- | ------------------------------------------- |
| **Drag** (mouse/touch) | Rotate the 3D plasma view horizontally     |
| **Pause / Resume**   | Toggle the simulation animation            |
| **Reset**            | Restore initial 148 particles and clear stats |

All key metrics update live in the on-screen panel.

## Project Structure

```
plasmasimulationv1/
├── run.sh              # One-click launcher (venv, deps, random port, browser)
├── app.py              # Flask server + auto browser launch
├── requirements.txt    # Python dependencies
├── .gitignore
├── README.md
└── static/
    ├── index.html      # Main HTML shell
    ├── css/
    │   └── style.css   # Glassmorphic UI styling
    └── js/
        ├── constants.js   # Physical constants, colors, thresholds
        ├── particle.js    # Particle class (D, T, He, n)
        ├── physics.js     # Forces, fusion logic, boundaries
        ├── renderer.js    # Canvas drawing, projection, effects
        ├── ui.js          # Controls and live stats
        └── main.js        # Animation loop and orchestration
```

## Technical Notes

- **Physics**: Soft Coulomb repulsion + thermal velocity perturbations + tunneling-inspired fusion probability. Momentum is conserved on fusion.
- **Time Scaling**: ~10¹²× dilation so nuclear events (10⁻¹² s) are observable.
- **Performance**: Throttled to ~60 Hz update rate for visual stability.
- **Neutron Handling**: Limited lifetime; particles eventually exit the viewport.
- **Visual Fidelity**: All original behaviors (depth sort, shadow glow, trail fade, fusion burst) preserved.

## Roadmap & Extensions

Because of the clean frontend/backend split, adding features is straightforward:

- REST API endpoint for live fusion event data
- WebSocket streaming to external visualizers or dashboards
- CSV export of simulation statistics
- Sliders for real-time parameter tuning (temperature, density, etc.)
- Upgrade renderer to Three.js / WebGL for full 3D
- Integration with machine learning models for surrogate physics

## Contributing

Pull requests and issues are welcome. Please open a discussion for major changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*"Watching the stars in a bottle."*
