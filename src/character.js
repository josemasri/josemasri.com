// character.js — "Pixel", robot-mascota guía 100% procedural y cel-shaded.
// main.js posiciona el grupo y lo orienta hacia la cámara; aquí se anima todo lo demás:
// flotación idle, seguimiento del cursor (cabeza + ojos), parpadeo, antena con resorte,
// base flotante, estela y cambio de matiz por lenguaje.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toonMat, glowMat, addOutline, blobTexture, dotTexture } from './toon.js';

const damp = (a, b, lambda, dt) => THREE.MathUtils.damp(a, b, lambda, dt);
const clamp = THREE.MathUtils.clamp;

export function buildPixel(scene) {
  const group = new THREE.Group();
  group.name = 'pixel';

  const core = new THREE.Group(); // recibe bob / breathing / lean
  group.add(core);

  // --- Cuerpo ---
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(0.92, 1.05, 0.7, 5, 0.24),
    toonMat('#2D4EF5')
  );
  body.position.y = 0.1;
  addOutline(body, 0.035, '#16182E');
  core.add(body);

  // Panel de pecho (emisivo, JM)
  const chest = new THREE.Mesh(
    new THREE.CircleGeometry(0.16, 24),
    glowMat('#FFD23F', { transparent: true, opacity: 0.9 })
  );
  chest.position.set(0, 0.12, 0.36);
  core.add(chest);

  // --- Cabeza ---
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.95;
  core.add(headGroup);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 24), toonMat('#3D5BFF'));
  head.scale.y = 0.86;
  addOutline(head, 0.035, '#16182E');
  headGroup.add(head);

  // Visor (franja-pantalla oscura para máximo contraste con los ojos)
  const visorMat = toonMat('#191c38', { emissive: new THREE.Color('#2B2350'), emissiveIntensity: 0.4 });
  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.515, 32, 24, 0, Math.PI * 2, Math.PI * 0.22, Math.PI * 0.34),
    visorMat
  );
  visor.scale.y = 0.86;
  visor.position.z = 0.02;
  headGroup.add(visor);

  // Ojos (emisivos -> bloom). Van FUERA del visor (z > radio del visor) para que se vean.
  const eyeGeo = new THREE.SphereGeometry(0.185, 22, 18);
  // Color HDR (>1) + sin depthTest para que SIEMPRE se dibujen sobre el visor y brillen con bloom.
  const eyeMatL = glowMat('#FFE34D'); eyeMatL.color.multiplyScalar(1.5); eyeMatL.toneMapped = false; eyeMatL.depthTest = false;
  const eyeMatR = glowMat('#FFE34D'); eyeMatR.color.multiplyScalar(1.5); eyeMatR.toneMapped = false; eyeMatR.depthTest = false;
  const eyeL = new THREE.Mesh(eyeGeo, eyeMatL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMatR);
  eyeL.position.set(-0.2, 0.11, 0.52);
  eyeR.position.set(0.2, 0.11, 0.52);
  eyeL.renderOrder = 6; eyeR.renderOrder = 6;
  eyeL.scale.z = 0.7; eyeR.scale.z = 0.7; // lentes ligeramente achatados
  // Brillo blanco en los ojos
  const glintGeo = new THREE.SphereGeometry(0.035, 10, 10);
  const glintMat = glowMat('#FFFFFF'); glintMat.color.multiplyScalar(2.0); glintMat.toneMapped = false;
  const glintL = new THREE.Mesh(glintGeo, glintMat); glintL.position.set(0.04, 0.04, 0.07);
  const glintR = new THREE.Mesh(glintGeo, glintMat); glintR.position.set(0.04, 0.04, 0.07);
  eyeL.add(glintL); eyeR.add(glintR);
  const eyes = new THREE.Group();
  eyes.add(eyeL, eyeR);
  headGroup.add(eyes);

  // --- Antena con resorte ---
  const antennaPivot = new THREE.Group();
  antennaPivot.position.set(0, 0.42, 0);
  headGroup.add(antennaPivot);
  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.34, 8),
    toonMat('#16182E')
  );
  stick.position.y = 0.17;
  antennaPivot.add(stick);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), glowMat('#FF5C7A'));
  bulb.position.y = 0.36;
  antennaPivot.add(bulb);

  // --- Brazos ---
  function makeArm(side) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.55, 0.35, 0);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.36, 6, 12), toonMat('#2D4EF5'));
    arm.position.y = -0.26;
    addOutline(arm, 0.03, '#16182E');
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 14), toonMat('#3D5BFF'));
    hand.position.y = -0.5;
    addOutline(hand, 0.03, '#16182E');
    pivot.add(arm, hand);
    core.add(pivot);
    return pivot;
  }
  const armL = makeArm(-1);
  const armR = makeArm(1);

  // --- Base flotante (toro emisivo) ---
  const baseTorus = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.07, 14, 28),
    glowMat('#FFD23F')
  );
  baseTorus.rotation.x = Math.PI / 2;
  baseTorus.position.y = -0.55;
  core.add(baseTorus);

  // --- Sombra blob ---
  const blob = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 1.7),
    new THREE.MeshBasicMaterial({ map: blobTexture(), transparent: true, depthWrite: false, opacity: 0.5 })
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = -1.25;
  group.add(blob);

  // --- Estela (Points en espacio mundo) ---
  const TRAIL = 26;
  const trailPos = new Float32Array(TRAIL * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  const trailMat = new THREE.PointsMaterial({
    color: new THREE.Color('#FFD23F'),
    size: 0.22, map: dotTexture(), transparent: true, opacity: 0.6, alphaTest: 0.01,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  const trail = new THREE.Points(trailGeo, trailMat);
  trail.frustumCulled = false;
  if (scene) scene.add(trail);

  // ---- Estado de animación ----
  let t = 0;
  let blinkTimer = 2 + Math.random() * 2;
  let blinkPhase = 0; // 0 abierto, >0 cerrando
  let wave = 0;       // intensidad del saludo (0..1)
  let waveTimer = 0;
  let spin = 0;       // rotación extra (easter egg)
  let spinTarget = 0;
  let trailInited = false;
  const hue = new THREE.Color('#FFD23F');
  const _v = new THREE.Vector3();
  const _eyeTarget = new THREE.Vector2();
  const _worldPos = new THREE.Vector3();

  // API de gestos
  function gesture(name) {
    if (name === 'wave') { wave = 1; waveTimer = 1.6; }
    else if (name === 'spin') { spinTarget += Math.PI * 2; }
    else if (name === 'arrive') { wave = Math.max(wave, 0.6); waveTimer = Math.max(waveTimer, 0.9); }
  }

  function setHue(color) { hue.set(color); }

  function update(dt, ctx) {
    t += dt;
    const { headTarget, scrollVel = 0, active = true } = ctx;
    const moving = clamp(Math.abs(scrollVel) * 6, 0, 1);

    // Lerp de matiz hacia el color de la estación (base y estela).
    // El visor queda oscuro constante para que los ojos amarillos resalten.
    baseTorus.material.color.lerp(hue, 1 - Math.exp(-3 * dt));
    trailMat.color.lerp(hue, 1 - Math.exp(-3 * dt));

    // Flotación idle + respiración
    const bob = Math.sin(t * 1.7) * 0.07 + moving * Math.sin(t * 9) * 0.04;
    core.position.y = bob;
    const breathe = 1 + Math.sin(t * 1.7) * 0.02;
    core.scale.set(1, breathe, 1);

    // Lean / banking al avanzar
    core.rotation.x = damp(core.rotation.x, moving * 0.18, 6, dt);
    core.rotation.z = damp(core.rotation.z, Math.sin(t * 2.2) * 0.04 * moving, 6, dt);

    // Base flotante gira
    baseTorus.rotation.z += dt * (1.2 + moving * 4);

    // Antena: resorte suave reaccionando al bob
    antennaPivot.rotation.z = damp(antennaPivot.rotation.z, Math.sin(t * 3.0) * 0.12 + moving * 0.2, 5, dt);
    antennaPivot.rotation.x = damp(antennaPivot.rotation.x, -core.rotation.x * 0.6, 5, dt);

    // ---- Seguimiento del cursor (cabeza + ojos) ----
    if (headTarget) {
      _v.copy(headTarget);
      group.worldToLocal(_v);
      const dx = _v.x;
      const dy = _v.y - (headGroup.position.y + core.position.y);
      const dz = _v.z;
      let yaw = Math.atan2(dx, Math.max(0.2, dz));
      let pitch = Math.atan2(dy, Math.hypot(dx, dz));
      yaw = clamp(yaw, -0.55, 0.55);
      pitch = clamp(pitch, -0.32, 0.4);
      const lambda = active ? 9 : 4;
      headGroup.rotation.y = damp(headGroup.rotation.y, yaw, lambda, dt);
      headGroup.rotation.x = damp(headGroup.rotation.x, -pitch * 0.55, lambda, dt);
      // micro-offset de ojos
      _eyeTarget.set(clamp(yaw * 0.12, -0.05, 0.05), clamp(pitch * 0.12, -0.05, 0.05));
      eyes.position.x = damp(eyes.position.x, _eyeTarget.x, 10, dt);
      eyes.position.y = damp(eyes.position.y, _eyeTarget.y, 10, dt);
    }

    // ---- Parpadeo ----
    blinkTimer -= dt;
    if (blinkTimer <= 0 && blinkPhase === 0) blinkPhase = 1;
    if (blinkPhase > 0) {
      blinkPhase += dt * 14;
      const s = blinkPhase < 1 ? 1 - blinkPhase : Math.min(1, blinkPhase - 1);
      eyeL.scale.y = eyeR.scale.y = clamp(s, 0.08, 1);
      if (blinkPhase >= 2) { blinkPhase = 0; blinkTimer = 2.5 + Math.random() * 3; eyeL.scale.y = eyeR.scale.y = 1; }
    }

    // ---- Saludo ----
    if (waveTimer > 0) { waveTimer -= dt; } else { wave = damp(wave, 0, 5, dt); }
    const waveUp = wave * 1.9;
    armR.rotation.z = damp(armR.rotation.z, -waveUp, 8, dt) + (wave > 0.05 ? Math.sin(t * 16) * 0.35 * wave : 0);
    armR.rotation.x = damp(armR.rotation.x, moving * 0.5, 6, dt);
    armL.rotation.x = damp(armL.rotation.x, -moving * 0.5, 6, dt);
    armL.rotation.z = damp(armL.rotation.z, moving * 0.15, 6, dt);

    // ---- Spin easter egg ----
    spin = damp(spin, spinTarget, 7, dt);
    core.rotation.y = spin;

    // Sombra blob
    blob.material.opacity = 0.5 - bob * 0.4;

    // ---- Estela ----
    group.getWorldPosition(_worldPos);
    if (!trailInited) {
      for (let i = 0; i < TRAIL; i++) {
        trailPos[i * 3] = _worldPos.x;
        trailPos[i * 3 + 1] = _worldPos.y - 0.5;
        trailPos[i * 3 + 2] = _worldPos.z;
      }
      trailInited = true;
    }
    for (let i = TRAIL - 1; i > 0; i--) {
      trailPos[i * 3] = trailPos[(i - 1) * 3];
      trailPos[i * 3 + 1] = trailPos[(i - 1) * 3 + 1];
      trailPos[i * 3 + 2] = trailPos[(i - 1) * 3 + 2];
    }
    trailPos[0] = _worldPos.x;
    trailPos[1] = _worldPos.y - 0.5;
    trailPos[2] = _worldPos.z;
    trailGeo.attributes.position.needsUpdate = true;
    // Casi invisible en reposo: la estela solo se insinúa mientras hay scroll.
    trailMat.opacity = moving * 0.35;
  }

  return { group, trail, update, gesture, setHue };
}
