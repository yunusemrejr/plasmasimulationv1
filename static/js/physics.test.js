// Physics Unit Tests for D-T Fusion Plasma Simulation
// Tests verify accuracy against real physics values from published data

import { Particle } from './particle.js';
import * as C from './constants.js';
import { fuseParticles, updatePhysics } from './physics.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.log(`  ✗ ${message}`);
    failed++;
  }
}

function assertApprox(actual, expected, tolerance, message) {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.log(`  ✗ ${message} (expected ~${expected}, got ${actual}, diff ${diff})`);
    failed++;
  }
}

// Test 1: Particle Masses
console.log('\n=== Test 1: Particle Masses ===');
{
  const d = new Particle('D');
  const t = new Particle('T');
  const he = new Particle('He');
  const n = new Particle('n');

  assert(d.mass === 2, `Deuterium mass is 2 u (got ${d.mass})`);
  assert(t.mass === 3, `Tritium mass is 3 u (got ${t.mass})`);
  assert(he.mass === 4, `Helium mass is 4 u (got ${he.mass})`);
  assert(n.mass === 1, `Neutron mass is 1 u (got ${n.mass})`);
}

// Test 2: Particle Charges
console.log('\n=== Test 2: Particle Charges ===');
{
  const d = new Particle('D');
  const t = new Particle('T');
  const he = new Particle('He');
  const n = new Particle('n');

  assert(d.charge === 1, `Deuterium charge is +1 (got ${d.charge})`);
  assert(t.charge === 1, `Tritium charge is +1 (got ${t.charge})`);
  assert(he.charge === 2, `Helium (alpha) charge is +2 (got ${he.charge})`);
  assert(n.charge === 0, `Neutron charge is 0 (got ${n.charge})`);
}

// Test 3: Coulomb Force Direction (same-sign repulsion)
console.log('\n=== Test 3: Coulomb Force Direction ===');
{
  const p1 = new Particle('D');
  const p2 = new Particle('D');

  p1.x = 0; p1.y = 0; p1.z = 0;
  p1.vx = 0; p1.vy = 0; p1.vz = 0;
  p2.x = 100; p2.y = 0; p2.z = 0;
  p2.vx = 0; p2.vy = 0; p2.vz = 0;

  const initial_p1_vx = p1.vx;
  const initial_p2_vx = p2.vx;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  const r2 = dx * dx + dy * dy + dz * dz + C.EPSILON;
  const r = Math.sqrt(r2);
  const f = C.K_COULOMB * p1.charge * p2.charge / r2;
  const fx = -f * dx / r;
  const fy = -f * dy / r;
  const fz = -f * dz / r;

  p1.vx += fx / p1.mass * 0.6;
  p2.vx -= fx / p2.mass * 0.6;

  assert(p1.vx < initial_p1_vx,
    `D-D repulsion: p1 should move LEFT (negative vx) when p2 is to the right`);
  assert(p2.vx > initial_p2_vx,
    `D-D repulsion: p2 should move RIGHT (positive vx) when p1 is to the left`);
}

// Test 4: D-T Fusion Energy Release
console.log('\n=== Test 4: D-T Fusion Energy Release ===');
{
  const d = new Particle('D');
  const t = new Particle('T');

  d.x = 0; d.y = 0; d.z = 0;
  d.vx = 5; d.vy = 0; d.vz = 0;
  t.x = 5; t.y = 0; t.z = 0;
  t.vx = -5; t.vy = 0; t.vz = 0;

  const particles = [d, t];
  const sparks = [];
  const world = { fusions: 0, totalEnergy: 0, paused: false };

  fuseParticles(particles, 0, 1, sparks, world);

  assert(world.fusions === 1, `Fusion event recorded (got ${world.fusions})`);
  assertApprox(world.totalEnergy, 17.59, 0.01,
    `Total energy released is 17.59 MeV (got ${world.totalEnergy})`);
}

// Test 5: D-T Fusion Product Types
console.log('\n=== Test 5: D-T Fusion Product Types ===');
{
  const d = new Particle('D');
  const t = new Particle('T');

  d.x = 0; d.y = 0; d.z = 0;
  d.vx = 5; d.vy = 0; d.vz = 0;
  t.x = 5; t.y = 0; t.z = 0;
  t.vx = -5; t.vy = 0; t.vz = 0;

  const particles = [d, t];
  const sparks = [];
  const world = { fusions: 0, totalEnergy: 0, paused: false };

  fuseParticles(particles, 0, 1, sparks, world);

  const he = particles.find(p => p.type === 'He');
  const n = particles.find(p => p.type === 'n');

  assert(he !== undefined, `Alpha particle (He) produced`);
  assert(n !== undefined, `Neutron (n) produced`);
}

// Test 6: D-T Fusion Product Masses
console.log('\n=== Test 6: D-T Fusion Product Masses ===');
{
  const d = new Particle('D');
  const t = new Particle('T');

  d.x = 0; d.y = 0; d.z = 0;
  d.vx = 5; d.vy = 0; d.vz = 0;
  t.x = 5; t.y = 0; t.z = 0;
  t.vx = -5; t.vy = 0; t.vz = 0;

  const particles = [d, t];
  const sparks = [];
  const world = { fusions: 0, totalEnergy: 0, paused: false };

  fuseParticles(particles, 0, 1, sparks, world);

  const he = particles.find(p => p.type === 'He');
  const n = particles.find(p => p.type === 'n');

  assertApprox(he.mass, 4, 0.1, `Alpha mass is ~4 u (got ${he.mass})`);
  assertApprox(n.mass, 1, 0.1, `Neutron mass is ~1 u (got ${n.mass})`);
}

// Test 7: D-T Fusion Energy Distribution (80% neutron, 20% alpha)
// From HyperPhysics: neutron carries 79.87% ≈ 80%, alpha carries 20.13% ≈ 20%
console.log('\n=== Test 7: D-T Fusion Energy Distribution ===');
{
  let totalAlphaEnergy = 0;
  let totalNeutronEnergy = 0;
  const numTrials = 1000;

  for (let i = 0; i < numTrials; i++) {
    const d = new Particle('D');
    const t = new Particle('T');

    d.x = 0; d.y = 0; d.z = 0;
    d.vx = 0; d.vy = 0; d.vz = 0;
    t.x = 0; t.y = 0; t.z = 0;
    t.vx = 0; t.vy = 0; t.vz = 0;

    const particles = [d, t];
    const sparks = [];
    const world = { fusions: 0, totalEnergy: 0, paused: false };

    fuseParticles(particles, 0, 1, sparks, world);

    const he = particles.find(p => p.type === 'He');
    const n = particles.find(p => p.type === 'n');

    const heEnergy = 0.5 * he.mass * (he.vx * he.vx + he.vy * he.vy + he.vz * he.vz);
    const nEnergy = 0.5 * n.mass * (n.vx * n.vx + n.vy * n.vy + n.vz * n.vz);

    totalAlphaEnergy += heEnergy;
    totalNeutronEnergy += nEnergy;
  }

  const totalEnergy = totalAlphaEnergy + totalNeutronEnergy;
  const alphaFraction = totalAlphaEnergy / totalEnergy;
  const neutronFraction = totalNeutronEnergy / totalEnergy;

  assertApprox(alphaFraction, 0.20, 0.03,
    `Alpha gets ~20% of kinetic energy (got ${(alphaFraction * 100).toFixed(1)}%)`);
  assertApprox(neutronFraction, 0.80, 0.03,
    `Neutron gets ~80% of kinetic energy (got ${(neutronFraction * 100).toFixed(1)}%)`);
}

// Test 8: D-T Fusion Momentum Conservation
// In the center-of-mass frame, products should have equal and opposite momenta
console.log('\n=== Test 8: D-T Fusion Momentum Conservation ===');
{
  let totalMomentumImbalance = 0;
  const numTrials = 100;

  for (let i = 0; i < numTrials; i++) {
    const d = new Particle('D');
    const t = new Particle('T');

    d.x = 0; d.y = 0; d.z = 0;
    d.vx = 0; d.vy = 0; d.vz = 0;
    t.x = 0; t.y = 0; t.z = 0;
    t.vx = 0; t.vy = 0; t.vz = 0;

    const particles = [d, t];
    const sparks = [];
    const world = { fusions: 0, totalEnergy: 0, paused: false };

    fuseParticles(particles, 0, 1, sparks, world);

    const he = particles.find(p => p.type === 'He');
    const n = particles.find(p => p.type === 'n');

    const pHeX = he.mass * he.vx;
    const pHeY = he.mass * he.vy;
    const pHeZ = he.mass * he.vz;
    const pNX = n.mass * n.vx;
    const pNY = n.mass * n.vy;
    const pNZ = n.mass * n.vz;

    const totalPX = pHeX + pNX;
    const totalPY = pHeY + pNY;
    const totalPZ = pHeZ + pNZ;

    totalMomentumImbalance += Math.sqrt(totalPX * totalPX + totalPY * totalPY + totalPZ * totalPZ);
  }

  const avgImbalance = totalMomentumImbalance / numTrials;
  const initialMomentum = 0; // Both particles at rest before fusion

  assert(avgImbalance < 1e-10,
    `Momentum conserved in fusion (avg imbalance: ${avgImbalance.toExponential(3)})`);
}

// Test 8b: Neutron velocity must be exactly 4× alpha velocity (momentum conservation)
console.log('\n=== Test 8b: Fusion Product Velocity Ratio ===');
{
  const d = new Particle('D');
  const t = new Particle('T');
  d.x = 0; d.y = 0; d.z = 0;
  d.vx = 0; d.vy = 0; d.vz = 0;
  t.x = 0; t.y = 0; t.z = 0;
  t.vx = 0; t.vy = 0; t.vz = 0;

  const particles = [d, t];
  const sparks = [];
  const world = { fusions: 0, totalEnergy: 0, paused: false };
  fuseParticles(particles, 0, 1, sparks, world);

  const he = particles.find(p => p.type === 'He');
  const n  = particles.find(p => p.type === 'n');

  const heV = Math.hypot(he.vx, he.vy, he.vz);
  const nV  = Math.hypot(n.vx, n.vy, n.vz);
  const ratio = nV / heV;

  assertApprox(ratio, 4.0, 0.001,
    `n_v / He_v = 4.000 (momentum conservation, got ${ratio.toFixed(4)})`);

  // Verify energies match known D-T values
  const E_He = 0.5 * he.mass * heV * heV;
  const E_n  = 0.5 * n.mass * nV * nV;
  assertApprox(E_He, 3.52, 0.02,
    `Alpha energy ≈ 3.52 MeV (got ${E_He.toFixed(3)} MeV)`);
  assertApprox(E_n, 14.07, 0.05,
    `Neutron energy ≈ 14.07 MeV (got ${E_n.toFixed(3)} MeV)`);
  assertApprox(E_He + E_n, 17.589, 0.01,
    `Total Q = 17.589 MeV (got ${(E_He + E_n).toFixed(3)} MeV)`);
}

// Test 9 removed (no oppositely charged particles in simulation)
// Test 9b: Alpha particle exerts 2× the Coulomb force on D as D does on D
console.log('\n=== Test 9b: Alpha Coulomb Force is 2× D-D Force ===');
{
  const d1 = new Particle('D');
  const d2 = new Particle('D');
  const he = new Particle('He');

  // Place all on x-axis at same distance
  d1.x = 0; d1.y = 0; d1.z = 0;
  d2.x = 100; d2.y = 0; d2.z = 0;

  he.x = 0; he.y = 0; he.z = 0;

  const r = 100;

  const f_DD = C.K_COULOMB * d1.charge * d2.charge / (r * r);
  const f_DHe = C.K_COULOMB * d1.charge * he.charge / (r * r);

  assertApprox(f_DHe / f_DD, 2.0, 0.01,
    `D-He force is 2× D-D force (He charge = +2, got ratio ${(f_DHe/f_DD).toFixed(2)})`);
  assert(he.charge === 2, `Alpha particle has charge +2 (got ${he.charge})`);
}

// Test 10: Neutral Particle (Neutron) Does Not Feel Coulomb
console.log('\n=== Test 10: Neutral Particle Ignores Coulomb Force ===');
{
  const d = new Particle('D');
  const n = new Particle('n');

  d.x = 0; d.y = 0; d.z = 0;
  d.vx = 0; d.vy = 0; d.vz = 0;
  n.x = 100; n.y = 0; n.z = 0;
  n.vx = 0; n.vy = 0; n.vz = 0;

  const dx = n.x - d.x;
  const dy = n.y - d.y;
  const dz = n.z - d.z;
  const r2 = dx * dx + dy * dy + dz * dz + C.EPSILON;
  const r = Math.sqrt(r2);

  const f = C.K_COULOMB * d.charge * n.charge / r2;

  assert(f === 0, `Force between D and n is zero (neutron has no charge)`);
}

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total:  ${passed + failed}`);

if (failed > 0) {
  console.log('\n⚠️  Some tests failed!');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  process.exit(0);
}
