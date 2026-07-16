// world.js — Archipiélago low-poly al atardecer: cielo, niebla, path de vuelo,
// islas por estación, nubes (InstancedMesh), partículas, sol y luces.
import * as THREE from 'three';
import { toonMat, glowMat, addOutline, skyMaterial, dotTexture } from './toon.js';
import { PALETTE, STATIONS } from './content.js';

export function buildWorld(scene) {
  const group = new THREE.Group();
  scene.add(group);

  // ---- Paleta nocturna (local; los acentos neón siguen usando PALETTE) ----
  const NIGHT_TOP = '#1c2a66';   // cima del cielo, azul profundo
  const NIGHT_MID = '#321f63';   // horizonte púrpura
  const NIGHT_BOT = '#06060e';   // base casi negra
  const NIGHT_FOG = '#0f1230';   // niebla índigo oscuro

  // ---- Fondo + niebla ----
  scene.background = new THREE.Color('#0a0c1e');
  scene.fog = new THREE.FogExp2(NIGHT_FOG, 0.05);

  // ---- Rig celeste: cielo + luna viajan con la cámara ----
  // Son cuerpos "al infinito": mantenerlos a distancia constante evita que la cámara
  // los alcance al final del recorrido (el path crece con el número de estaciones).
  const skyRig = new THREE.Group();
  scene.add(skyRig);

  // ---- Cielo ----
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 32, 24),
    skyMaterial(NIGHT_TOP, NIGHT_MID, NIGHT_BOT)
  );
  skyRig.add(sky);

  // ---- Luna-núcleo (emisivo frío, bloom) ----
  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(24, 48),
    glowMat('#dCEBFF', { transparent: true, opacity: 0.95, fog: false })
  );
  sun.position.set(44, 30, -260);
  skyRig.add(sun);
  const sunGlow = new THREE.Mesh(
    new THREE.CircleGeometry(54, 48),
    glowMat(PALETTE.cian ?? '#1BE7FF', { transparent: true, opacity: 0.3, fog: false, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  sunGlow.position.copy(sun.position);
  sunGlow.position.z -= 1;
  skyRig.add(sunGlow);

  // ---- Path de vuelo (CatmullRom ascendente y serpenteante) ----
  const N = STATIONS.length;
  const pts = [];
  for (let i = 0; i < N; i++) {
    pts.push(new THREE.Vector3(
      Math.sin(i * 0.85) * (5 + i * 0.5),
      i * 2.3,
      -i * 15
    ));
  }
  // punto extra al final para que getTangentAt no se rompa cerca de 1
  pts.push(new THREE.Vector3(Math.sin(N * 0.85) * (5 + N * 0.5), N * 2.3 + 2, -N * 15));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);

  // ---- Riel de luz (tube sobre el path) ----
  const tubeGeo = new THREE.TubeGeometry(curve, 220, 0.07, 8, false);
  const tubeMat = glowMat(PALETTE.azulCobalto, {
    transparent: true, opacity: 0.3, depthWrite: false, fog: true,
  });
  const rail = new THREE.Mesh(tubeGeo, tubeMat);
  scene.add(rail);

  // ---- Islas por estación ----
  const _tmp = new THREE.Vector3();
  const crystals = [];
  const stations = [];

  STATIONS.forEach((st, i) => {
    const tAt = N <= 1 ? 0 : i / N; // las estaciones quedan ligeramente "adelante" en el path
    curve.getPointAt(Math.min(tAt, 0.999), _tmp);

    const side = (i % 2 === 0 ? -1 : 1) * (8 + (i % 3) * 1.5);
    const center = new THREE.Vector3(_tmp.x + side, _tmp.y - 3.6, _tmp.z + (i % 2 ? -2 : 2));

    const island = new THREE.Group();
    island.position.copy(center);

    const r = 2.6 + (i % 3) * 0.5;
    // Tapa (lavanda fría: lit pero acorde a la noche)
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.92, 0.7, 7), toonMat('#9aa3d8'));
    addOutline(cap, 0.04, '#0a0c1e');
    island.add(cap);
    // Base cónica invertida (índigo profundo)
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r * 0.95, 2.4, 7), toonMat('#171a3e'));
    cone.position.y = -1.5;
    cone.rotation.y = Math.PI / 7;
    addOutline(cone, 0.04, '#16182E');
    island.add(cone);

    // Decoración: pequeños prismas / árboles toon según tipo
    const deco = (st.kind === 'project') ? 'pillar' : 'crystal';
    if (deco === 'pillar') {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 1.1, 6), toonMat('#3D5BFF'));
      pillar.position.set(r * 0.3, 0.9, -r * 0.2);
      addOutline(pillar, 0.03, '#16182E');
      island.add(pillar);
    } else {
      // un par de "rocas" toon
      for (let k = 0; k < 2; k++) {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4 + k * 0.2, 0), toonMat('#7a83b8'));
        rock.position.set((k ? 1 : -1) * r * 0.4, 0.45, (k ? -1 : 1) * r * 0.3);
        addOutline(rock, 0.03, '#0a0c1e');
        island.add(rock);
      }
    }

    // Cristal/prop emisivo (bloom) con el color de la estación
    const crystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.62, 0),
      glowMat(st.hue, { transparent: true, opacity: 0.95 })
    );
    crystal.position.y = 1.7;
    island.add(crystal);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.04, 10, 28),
      glowMat(st.hue, { transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })
    );
    ring.position.y = 1.7;
    ring.rotation.x = Math.PI / 2.4;
    island.add(ring);
    crystals.push({ crystal, ring, phase: i * 0.7 });

    group.add(island);
    stations.push({ index: i, position: center.clone(), hue: st.hue });
  });

  // ---- Nubes (InstancedMesh, parallax) ----
  // Viven en carriles laterales: la cámara serpentea por |x| <= ~13 y Pixel se aparta
  // hasta ~6 más, así que una nube (radio hasta 6) dentro de ese pasillo lo envolvería
  // y velaría las tarjetas. Cada nube se mantiene fuera de CLOUD_LANE, a su lado.
  const CLOUD_LANE = 24;
  const CLOUD_FAR = 60;
  const cloudCount = 34;
  const cloudGeo = new THREE.IcosahedronGeometry(1, 0);
  const clouds = new THREE.InstancedMesh(cloudGeo, toonMat('#5c64a0', { transparent: true, opacity: 0.5 }), cloudCount);
  const cloudData = [];
  const _m = new THREE.Matrix4();
  const _q = new THREE.Quaternion();
  const _s = new THREE.Vector3();
  const _p = new THREE.Vector3();
  for (let i = 0; i < cloudCount; i++) {
    const band = i % 3;
    const z = -10 - Math.random() * (N * 15);
    const y = -2 + (z / (-N * 15)) * (N * 2.3) + (Math.random() - 0.5) * 12;
    const sx = 2 + Math.random() * 4;
    const side = i % 2 ? 1 : -1;
    const ax = CLOUD_LANE + sx + Math.random() * (14 + band * 8);
    cloudData.push({ ax, side, y, z, sx, sy: sx * 0.55, sz: sx * 0.8, speed: 0.2 + Math.random() * 0.4, off: Math.random() * 10 });
    _p.set(side * ax, y, z); _s.set(sx, sx * 0.55, sx * 0.8);
    _m.compose(_p, _q, _s);
    clouds.setMatrixAt(i, _m);
  }
  clouds.instanceMatrix.needsUpdate = true;
  group.add(clouds);

  // ---- Partículas "polen tech" ----
  const pCount = 1100;
  const pPos = new Float32Array(pCount * 3);
  const spanZ = N * 15;
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 90;
    pPos[i * 3 + 1] = (Math.random() - 0.2) * (N * 2.6);
    pPos[i * 3 + 2] = 5 - Math.random() * (spanZ + 20);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: new THREE.Color(PALETTE.amarilloChispa),
    size: 0.2, map: dotTexture(), alphaTest: 0.01, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true, fog: true,
  }));
  group.add(particles);

  // ---- Luces (noche: key de luna fría + rim neón magenta) ----
  const key = new THREE.DirectionalLight(new THREE.Color('#aab6ff'), 1.15);
  key.position.set(44, 34, -60);
  scene.add(key);
  const hemi = new THREE.HemisphereLight(new THREE.Color('#46599c'), new THREE.Color('#120e2c'), 0.6);
  scene.add(hemi);
  const rim = new THREE.PointLight(new THREE.Color(PALETTE.magentaKi), 0.9, 70);
  rim.position.set(-22, 12, -30);
  scene.add(rim);
  const rim2 = new THREE.PointLight(new THREE.Color('#1BE7FF'), 0.5, 70);
  rim2.position.set(20, 6, -10);
  scene.add(rim2);
  const fill = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(fill);

  // ---- Update ----
  let t = 0;
  function update(dt, progress, camPos) {
    t += dt;
    // El rig celeste sigue a la cámara: la luna nunca se "alcanza".
    if (camPos) skyRig.position.copy(camPos);
    // niebla se disuelve con el avance
    scene.fog.density = THREE.MathUtils.lerp(0.05, 0.012, THREE.MathUtils.smoothstep(progress, 0, 1));

    // cristales rotan y laten
    for (const c of crystals) {
      c.crystal.rotation.y += dt * 0.8;
      c.crystal.rotation.x += dt * 0.3;
      const pulse = 0.9 + Math.sin(t * 2 + c.phase) * 0.12;
      c.crystal.scale.setScalar(pulse);
      c.ring.rotation.z += dt * 0.5;
    }

    // sol pulsa
    sun.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);

    // riel de luz parpadea suave
    tubeMat.opacity = 0.22 + Math.sin(t * 1.5) * 0.08;

    // nubes derivan hacia afuera y reaparecen en el borde interior de su carril
    for (let i = 0; i < cloudCount; i++) {
      const d = cloudData[i];
      d.ax += d.speed * dt;
      if (d.ax > CLOUD_FAR) d.ax = CLOUD_LANE + d.sx;
      const yy = d.y + Math.sin(t * 0.5 + d.off) * 0.5;
      _p.set(d.side * d.ax, yy, d.z); _s.set(d.sx, d.sy, d.sz);
      _m.compose(_p, _q, _s);
      clouds.setMatrixAt(i, _m);
    }
    clouds.instanceMatrix.needsUpdate = true;

    // partículas giran lento
    particles.rotation.y += dt * 0.02;
  }

  function dispose() {
    [group, skyRig].forEach((root) => root.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => m.dispose());
      }
    }));
  }

  return { group, curve, stations, sun, skyRig, update, dispose };
}
