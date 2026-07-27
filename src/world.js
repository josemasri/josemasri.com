// world.js — Archipiélago low-poly al atardecer: cielo, niebla, path de vuelo,
// islas por estación, nubes (InstancedMesh), partículas, sol y luces.
import * as THREE from 'three';
import { toonMat, glowMat, addOutline, skyMaterial, dotTexture } from './toon.js';
import { HUES, STATIONS } from './content.js';

export function buildWorld(scene, camera) {
  const group = new THREE.Group();
  scene.add(group);

  // ---- Paleta nocturna del cielo (local; los acentos de estación vienen de HUES) ----
  // Noche azul, no negra: si la base baja de ~#0d0e1c las islas y nubes se vuelven
  // siluetas planas y la escena deja de leerse como un mundo.
  const NIGHT_TOP = '#26326b';   // cima del cielo, azul profundo
  const NIGHT_MID = '#3a2a6b';   // horizonte púrpura
  const NIGHT_BOT = '#121430';   // base: azul oscuro, nunca negro
  const NIGHT_FOG = '#1d2350';   // niebla índigo

  // ---- Fondo + niebla ----
  scene.background = new THREE.Color('#161a3d');
  // Densidad contenida: con 0.05 la niebla se comía las islas lejanas por completo.
  scene.fog = new THREE.FogExp2(NIGHT_FOG, 0.028);

  // ---- Rig celeste: el cielo viaja con la cámara ----
  // Es un cuerpo "al infinito": mantenerlo a distancia constante evita que la cámara
  // lo alcance al final del recorrido (el path crece con el número de estaciones).
  // Solo copia la POSICIÓN, no la orientación: el horizonte del gradiente debe quedar quieto.
  const skyRig = new THREE.Group();
  scene.add(skyRig);

  // ---- Cielo ----
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 32, 24),
    skyMaterial(NIGHT_TOP, NIGHT_MID, NIGHT_BOT)
  );
  skyRig.add(sky);

  // ---- Luna (emisiva, capta el bloom) ----
  // Cuelga de la CÁMARA, no del skyRig: así su posición en pantalla es realmente fija.
  // Con un offset en mundo se arrastraría al centro cada vez que el path gira, y un cuerpo
  // brillante detrás de una tarjeta o de la barra de nav mata el contraste del texto.
  // Coordenadas locales a la cámara: +x derecha, +y arriba, -z al frente.
  const moonRig = new THREE.Group();
  moonRig.position.set(153, 101, -300);   // cuadrante superior derecho, despejado de la nav
  camera.add(moonRig);
  // La cámara tiene que estar en el grafo para que sus hijos se rendericen.
  scene.add(camera);

  const moon = new THREE.Mesh(
    new THREE.CircleGeometry(11, 48),
    glowMat('#d6e4ff', { transparent: true, opacity: 0.88, fog: false })
  );
  moonRig.add(moon);
  // El halo va con textura radial, no como disco plano: un CircleGeometry aditivo
  // se ve como una dona de borde duro en vez de un resplandor.
  const moonGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshBasicMaterial({
      map: dotTexture(), color: new THREE.Color('#9fc6ff'),
      transparent: true, opacity: 0.3, fog: false,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  moonGlow.position.z = -1;
  moonRig.add(moonGlow);

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
  const tubeMat = glowMat(HUES.azul, {
    transparent: true, opacity: 0.2, depthWrite: false, fog: true,
  });
  const rail = new THREE.Mesh(tubeGeo, tubeMat);
  scene.add(rail);

  // ---- Islas por estación ----
  const _tmp = new THREE.Vector3();
  const crystals = [];

  STATIONS.forEach((st, i) => {
    const tAt = N <= 1 ? 0 : i / N; // las estaciones quedan ligeramente "adelante" en el path
    curve.getPointAt(Math.min(tAt, 0.999), _tmp);

    const side = (i % 2 === 0 ? -1 : 1) * (8 + (i % 3) * 1.5);
    const center = new THREE.Vector3(_tmp.x + side, _tmp.y - 3.6, _tmp.z + (i % 2 ? -2 : 2));

    const island = new THREE.Group();
    island.position.copy(center);

    const r = 2.6 + (i % 3) * 0.5;
    // Tapa (lavanda fría: lit pero acorde a la noche)
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.92, 0.7, 7), toonMat('#b3bce8'));
    addOutline(cap, 0.04, '#141838');
    island.add(cap);
    // Base cónica invertida. Es la superficie más grande de cada isla: si va demasiado
    // oscura, la mitad inferior de la escena se convierte en triángulos negros.
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r * 0.95, 2.4, 7), toonMat('#3b4177'));
    cone.position.y = -1.5;
    cone.rotation.y = Math.PI / 7;
    addOutline(cone, 0.04, '#141838');
    island.add(cone);

    // Decoración: pequeños prismas / árboles toon según tipo
    const deco = (st.kind === 'project') ? 'pillar' : 'crystal';
    if (deco === 'pillar') {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 1.1, 6), toonMat('#4E6BFF'));
      pillar.position.set(r * 0.3, 0.9, -r * 0.2);
      addOutline(pillar, 0.03, '#141838');
      island.add(pillar);
    } else {
      // un par de "rocas" toon
      for (let k = 0; k < 2; k++) {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4 + k * 0.2, 0), toonMat('#8f98cd'));
        rock.position.set((k ? 1 : -1) * r * 0.4, 0.45, (k ? -1 : 1) * r * 0.3);
        addOutline(rock, 0.03, '#141838');
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
      new THREE.TorusGeometry(0.95, 0.03, 10, 28),
      glowMat(st.hue, { transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false, fog: true })
    );
    ring.position.y = 1.7;
    ring.rotation.x = Math.PI / 2.4;
    island.add(ring);
    crystals.push({ crystal, ring, phase: i * 0.7 });

    group.add(island);
  });

  // ---- Nubes (InstancedMesh, parallax) ----
  // Viven en carriles laterales: la cámara serpentea por |x| <= ~13 y Pixel se aparta
  // hasta ~6 más, así que una nube (radio hasta 6) dentro de ese pasillo lo envolvería
  // y velaría las tarjetas. Cada nube se mantiene fuera de CLOUD_LANE, a su lado.
  const CLOUD_LANE = 24;
  const CLOUD_FAR = 60;
  const cloudCount = 34;
  const cloudGeo = new THREE.IcosahedronGeometry(1, 0);
  const clouds = new THREE.InstancedMesh(cloudGeo, toonMat('#7c86c4', { transparent: true, opacity: 0.45 }), cloudCount);
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

  // ---- Partículas de fondo ----
  const pCount = 420;
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
    color: new THREE.Color('#c8d4ff'),
    size: 0.16, map: dotTexture(), alphaTest: 0.01, transparent: true, opacity: 0.42,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true, fog: true,
  }));
  group.add(particles);

  // ---- Luces ----
  // key = luna fría; hemi + ambient dan el relleno que evita las siluetas negras;
  // los dos rim (cálido y frío) separan los volúmenes del fondo por los costados.
  const key = new THREE.DirectionalLight(new THREE.Color('#c2ccff'), 1.35);
  key.position.set(44, 34, -60);
  scene.add(key);
  const hemi = new THREE.HemisphereLight(new THREE.Color('#7183c9'), new THREE.Color('#241f4d'), 1.0);
  scene.add(hemi);
  const rim = new THREE.PointLight(new THREE.Color(HUES.magenta), 0.5, 80);
  rim.position.set(-22, 12, -30);
  scene.add(rim);
  const rimCool = new THREE.PointLight(new THREE.Color('#7fb4ff'), 0.4, 80);
  rimCool.position.set(20, 6, -10);
  scene.add(rimCool);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

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

    // luna pulsa
    moon.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);

    // riel de luz parpadea suave
    tubeMat.opacity = 0.16 + Math.sin(t * 1.5) * 0.05;

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

  return { curve, update };
}
