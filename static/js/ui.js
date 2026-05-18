// UI wiring: stats panel, pause/reset controls, touch & mouse rotation input
//
// Design: scientific instrument panel — no emoji, no glow, precise data display

import { rotateParticles } from './physics.js';

export function initUI(world, actions, canvas, renderer) {
  // DOM element references
  const elCount    = document.getElementById('count');
  const elFusions  = document.getElementById('fusions');
  const elEnergy   = document.getElementById('energy');
  const elTemp     = document.getElementById('temp');
  const elTempBar  = document.getElementById('tempbar');
  const btnPause   = document.getElementById('pause-btn');
  const btnReset   = document.getElementById('reset-btn');

  // Wire pause button
  if (btnPause) {
    btnPause.addEventListener('click', () => {
      actions.togglePause();
      btnPause.textContent = world.paused ? 'Resume' : 'Pause';
    });
  }

  // Wire reset button
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      actions.resetSim();
      if (btnPause) btnPause.textContent = 'Pause';
    });
  }

  // Stats updater — called every frame from the main loop
  function updateStats() {
    const n = world.particles.length;

    if (elCount)   elCount.textContent   = n;
    if (elFusions) elFusions.textContent = world.fusions ?? 0;
    if (elEnergy)  elEnergy.textContent  = (world.totalEnergy || 0).toFixed(0) + ' MeV';

    // Temperature with gentle oscillation + slight noise (visual only)
    const t = Math.round(150 + Math.sin(Date.now() / 800) * 12);
    if (elTemp)    elTemp.textContent    = t + ' MK';
    if (elTempBar) elTempBar.style.width = (65 + Math.random() * 25) + '%';
  }

  // === ROTATION INPUT (mouse + touch) ===
  // Drag horizontally to rotate the entire particle cloud around Y axis
  let dragging = false;
  let lastX = 0;

  function onPointerDown(e) {
    dragging = true;
    lastX = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
    canvas.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    if (!dragging) return;

    const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? lastX;
    const dx = clientX - lastX;
    lastX = clientX;

    // Scale matches original feel: ~0.0008 per pixel
    const angle = dx * 0.0008;
    rotateParticles(world.particles, angle);
  }

  function onPointerUp() {
    dragging = false;
    canvas.style.cursor = 'grab';
  }

  // Pointer Events (unifies mouse + touch + pen)
  canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });

  // Fallbacks for older touch devices
  canvas.addEventListener('touchstart', onPointerDown, { passive: true });
  canvas.addEventListener('touchmove', onPointerMove, { passive: true });
  canvas.addEventListener('touchend', onPointerUp, { passive: true });

  // Desktop cursor hint
  canvas.style.cursor = 'grab';

  return { updateStats };
}
