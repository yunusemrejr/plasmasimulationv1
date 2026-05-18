// Physical and rendering constants for the D-T fusion plasma simulation

export const K_COULOMB = 420;
export const EPSILON = 4;
export const FUSION_DIST = 7.5;
export const FUSION_PROB_BASE = 0.12;
export const TEMP = 150;
export const BOX = 220;

export const PROJECTION_PLANE = 420;
export const DAMPING_FACTOR = 0.982;
export const BOUNDARY_SPRING = 0.018;
export const THERMAL_KICK_PROB = 0.03;
export const THERMAL_KICK_SCALE = TEMP / 80;

export const NEUTRON_LIFETIME = 280;
export const SPARK_COUNT_ON_FUSION = 24;
export const SPARK_LIFE_MIN = 18;
export const SPARK_LIFE_VAR = 12;
export const SPARK_VEL = 38;

export const PARTICLE_COLORS = {
  D: '#0ff',
  T: '#0f8',
  He: '#ff0',
  n: '#fff'
};

export const PARTICLE_RADII = {
  n: 2.2,
  He: 3.8,
  default: 3.2
};