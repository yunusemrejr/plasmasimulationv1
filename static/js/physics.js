// Physics engine: Coulomb repulsion, thermal motion, D-T fusion, boundary, damping, lifetime

import { Particle } from './particle.js';
import * as C from './constants.js';

export function initParticles(count) {
  const particles = [];
  const half = Math.floor(count / 2);
  for (let i = 0; i < half; i++) particles.push(new Particle('D'));
  for (let i = 0; i < half; i++) particles.push(new Particle('T'));
  return particles;
}

function createNeutronSpark(x, y, z) {
  return {
    x, y, z,
    vx: (Math.random() - 0.5) * C.SPARK_VEL,
    vy: (Math.random() - 0.5) * C.SPARK_VEL,
    vz: (Math.random() - 0.5) * C.SPARK_VEL,
    life: C.SPARK_LIFE_MIN + Math.random() * C.SPARK_LIFE_VAR,
    color: '#ff0'
  };
}

export function fuseParticles(particles, i1, i2, sparks, world) {
  const p1 = particles[i1];
  const p2 = particles[i2];

  const totalMass = p1.mass + p2.mass;
  const vx_cm = (p1.vx * p1.mass + p2.vx * p2.mass) / totalMass;
  const vy_cm = (p1.vy * p1.mass + p2.vy * p2.mass) / totalMass;
  const vz_cm = (p1.vz * p1.mass + p2.vz * p2.mass) / totalMass;

  const fusionX = (p1.x + p2.x) * 0.5;
  const fusionY = (p1.y + p2.y) * 0.5;
  const fusionZ = (p1.z + p2.z) * 0.5;

  // D-T fusion: D + T → He-4 + n + 17.589 MeV
  // Derive velocities from Q value with exact momentum conservation:
  //   m_He * v_He = m_n * v_n            (momentum conservation)
  //   ½ m_He v_He² + ½ m_n v_n² = Q     (energy conservation)
  // Solving: v_He = sqrt(Q * m_n / (m_He * (m_He + m_n)))
  //          v_n  = (m_He / m_n) * v_He  = 4 * v_He
  const Q_MeV = 17.589;
  const m_He = 4.0;
  const m_n = 1.0;
  const He_v = Math.sqrt(2.0 * Q_MeV * m_n / (m_He * (m_He + m_n)));
  const n_v = (m_He / m_n) * He_v;  // exactly 4× He_v (momentum conservation)

  const phi = Math.random() * 2.0 * Math.PI;
  const cosTheta = 2.0 * Math.random() - 1.0;
  const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
  const dirX = sinTheta * Math.cos(phi);
  const dirY = sinTheta * Math.sin(phi);
  const dirZ = cosTheta;

  const he = new Particle('He');
  he.x = fusionX;
  he.y = fusionY;
  he.z = fusionZ;
  he.vx = vx_cm + He_v * dirX;
  he.vy = vy_cm + He_v * dirY;
  he.vz = vz_cm + He_v * dirZ;

  const neu = new Particle('n');
  neu.x = fusionX;
  neu.y = fusionY;
  neu.z = fusionZ;
  neu.vx = vx_cm - n_v * dirX;
  neu.vy = vy_cm - n_v * dirY;
  neu.vz = vz_cm - n_v * dirZ;

  // Safe removal order
  if (i1 > i2) {
    particles.splice(i1, 1);
    particles.splice(i2, 1);
  } else {
    particles.splice(i2, 1);
    particles.splice(i1, 1);
  }

  particles.push(he);
  particles.push(neu);

  // Record stats
  world.fusions = (world.fusions || 0) + 1;
  world.totalEnergy = (world.totalEnergy || 0) + 17.59;

  // Spawn fusion sparks
  for (let i = 0; i < C.SPARK_COUNT_ON_FUSION; i++) {
    sparks.push(createNeutronSpark(he.x, he.y, he.z));
  }
}

export function updatePhysics(world) {
  if (world.paused) return;

  const particles = world.particles;
  const sparks = world.sparks;
  const len = particles.length;

  for (let i = 0; i < len; i++) {
    const p1 = particles[i];
    for (let j = i + 1; j < len; j++) {
      const p2 = particles[j];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dz = p2.z - p1.z;
      const r2 = dx * dx + dy * dy + dz * dz + C.EPSILON;
      const r = Math.sqrt(r2);

      // Coulomb interaction: F = K * q1 * q2 / r^2
      // Direction: r_hat = (p2 - p1) / r points from p1 toward p2
      // - For same-sign charges (f > 0): repulsive force along +r_hat on p1, -r_hat on p2
      // - For opposite-sign charges (f < 0): attractive force along -r_hat on p1, +r_hat on p2
      // The sign of f already encodes charge product, so we negate for proper direction
      if (p1.charge && p2.charge) {
        const f = C.K_COULOMB * p1.charge * p2.charge / r2;
        const fx = -f * dx / r;
        const fy = -f * dy / r;
        const fz = -f * dz / r;

        p1.vx += fx / p1.mass * 0.6;
        p1.vy += fy / p1.mass * 0.6;
        p1.vz += fz / p1.mass * 0.6;

        p2.vx -= fx / p2.mass * 0.6;
        p2.vy -= fy / p2.mass * 0.6;
        p2.vz -= fz / p2.mass * 0.6;
      }

      // Random thermal kicks (simplified)
      if (Math.random() < C.THERMAL_KICK_PROB) {
        const kick = C.THERMAL_KICK_SCALE;
        p1.vx += (Math.random() - 0.5) * kick;
        p1.vy += (Math.random() - 0.5) * kick;
        p1.vz += (Math.random() - 0.5) * kick;
      }

      // Fusion check: D + T only
      const isFusionPair =
        ((p1.type === 'D' && p2.type === 'T') || (p1.type === 'T' && p2.type === 'D'));

      if (isFusionPair && r < C.FUSION_DIST) {
        // Check radial approach speed (positive = approaching, negative = separating)
        const dvx = p1.vx - p2.vx;
        const dvy = p1.vy - p2.vy;
        const dvz = p1.vz - p2.vz;
        const approachSpeed = (dvx * dx + dvy * dy + dvz * dz) / r;
        if (approachSpeed > 11 && Math.random() < C.FUSION_PROB_BASE) {
          fuseParticles(particles, i, j, sparks, world);
          return; // restart physics step after structural change (matches original)
        }
      }
    }
  }

  // Integrate motion + boundary + damping + lifetime
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    // Soft spherical boundary
    const distFromCenter = Math.hypot(p.x, p.y, p.z) || 1e-10;
    if (distFromCenter > C.BOX) {
      const f = (distFromCenter - C.BOX) * C.BOUNDARY_SPRING;
      const nx = p.x / distFromCenter;
      const ny = p.y / distFromCenter;
      const nz = p.z / distFromCenter;
      p.vx -= nx * f;
      p.vy -= ny * f;
      p.vz -= nz * f;
    }

    // Velocity damping (friction / cooling)
    p.vx *= C.DAMPING_FACTOR;
    p.vy *= C.DAMPING_FACTOR;
    p.vz *= C.DAMPING_FACTOR;

    // Neutron decay
    if (p.type === 'n') {
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  // Integrate & cull sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.z += s.vz;

    s.vx *= 0.94;
    s.vy *= 0.94;
    s.vz *= 0.94;

    s.life--;
    if (s.life <= 0) sparks.splice(i, 1);
  }
}

// Utility: rotate the entire particle cloud around vertical axis (used by input)
export function rotateParticles(particles, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  for (let p of particles) {
    const x = p.x;
    const z = p.z;
    p.x = x * cos - z * sin;
    p.z = x * sin + z * cos;
  }
}