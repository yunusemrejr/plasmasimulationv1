// Pseudo-3D Canvas Renderer with depth sorting and glow effects

import * as C from './constants.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.W = 0;
    this.H = 0;
    this.CX = 0;
    this.CY = 0;
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  }

  resize() {
    this.W = this.canvas.width = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
    this.CX = this.W / 2;
    this.CY = this.H / 2;
  }

  project(obj) {
    const depth = C.PROJECTION_PLANE / (C.PROJECTION_PLANE + obj.z);
    return {
      sx: this.CX + obj.x * depth,
      sy: this.CY + obj.y * depth,
      size: (obj.radius || 2) * depth,
      alpha: Math.max(0.3, (obj.z + C.BOX) / (C.BOX * 2))
    };
  }

  draw(world) {
    const ctx = this.ctx;

    // Motion trail / fade
    ctx.fillStyle = 'rgba(13, 17, 23, 0.20)';
    ctx.fillRect(0, 0, this.W, this.H);

    // Depth-sort particles (far to near)
    const projected = world.particles.map(p => ({ p, proj: this.project(p) }));
    projected.sort((a, b) => b.p.z - a.p.z);

    ctx.shadowBlur = 12;
    for (const item of projected) {
      const { p, proj } = item;

      ctx.shadowColor = p.color;
      ctx.globalAlpha = proj.alpha;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.arc(proj.sx, proj.sy, proj.size, 0, Math.PI * 2);
      ctx.fill();

      // Extra highlight for neutrons and helium
      if (p.type === 'n' || p.type === 'He') {
        ctx.shadowBlur = 22;
        ctx.globalAlpha *= 0.7;
        ctx.fillStyle = '#fff';
        ctx.fillRect(proj.sx - 1.2, proj.sy - 1.2, 2.4, 2.4);
        ctx.shadowBlur = 12;
      }
    }
    ctx.globalAlpha = 1;

    // Fusion sparks (short-lived bright dots)
    ctx.shadowBlur = 18;
    for (const s of world.sparks) {
      const pr = this.project(s);
      const fade = s.life / 30;
      ctx.globalAlpha = fade * 0.9;
      ctx.fillStyle = '#ff8';
      ctx.fillRect(pr.sx - 2, pr.sy - 2, 4, 4);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}