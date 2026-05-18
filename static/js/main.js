// PlasmaSim Main Entry - wires renderer, physics, UI and runs the animation loop

import { Renderer } from './renderer.js';
import { initParticles, updatePhysics } from './physics.js';
import { initUI } from './ui.js';
import { initEducation } from './education.js';

const canvas = document.getElementById('c');

// Create subsystems
const renderer = new Renderer(canvas);

// Simulation world state (single source of truth)
const world = {
  particles: initParticles(148),
  sparks: [],
  paused: false,
  fusions: 0,
  totalEnergy: 0,
  last: performance.now()
};

// Control actions passed to UI
const actions = {
  togglePause() {
    world.paused = !world.paused;
  },
  resetSim() {
    world.fusions = 0;
    world.totalEnergy = 0;
    world.particles = initParticles(148);
    world.sparks = [];
  }
};

// Initialize UI (buttons, stats, input handlers)
const ui = initUI(world, actions, canvas, renderer);

// Initialize the bilingual educational modal system
initEducation();

// Main animation loop (~60 fps physics when not paused)
function loop() {
  const now = performance.now();

  // Throttled physics step (~60 Hz)
  if (!world.paused && now - world.last > 16) {
    updatePhysics(world);
    world.last = now;
  }

  // Render frame
  renderer.draw(world);

  // Update DOM stats every frame (cheap)
  ui.updateStats();

  requestAnimationFrame(loop);
}

// Kick off
loop();

// Optional: expose for debugging in console
window.PlasmaSim = { world, renderer, actions };