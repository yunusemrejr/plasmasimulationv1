// Particle model for D, T, He, and neutrons

import * as C from './constants.js';

export class Particle {
  constructor(type) {
    this.type = type; // 'D' | 'T' | 'He' | 'n'
    this.x = (Math.random() - 0.5) * C.BOX * 1.6;
    this.y = (Math.random() - 0.5) * C.BOX * 1.6;
    this.z = (Math.random() - 0.5) * C.BOX * 1.6;

    this.vx = (Math.random() - 0.5) * 9;
    this.vy = (Math.random() - 0.5) * 9;
    this.vz = (Math.random() - 0.5) * 9;

    this.mass = type === 'D' ? 2 : type === 'T' ? 3 : type === 'He' ? 4 : 1;
    this.charge = (type === 'n') ? 0 : (type === 'He') ? 2 : 1;
    this.radius = (type === 'n') ? C.PARTICLE_RADII.n :
                  (type === 'He') ? C.PARTICLE_RADII.He : C.PARTICLE_RADII.default;

    this.color = C.PARTICLE_COLORS[type] || '#fff';
    this.life = (type === 'n') ? C.NEUTRON_LIFETIME : 9999;
  }
}