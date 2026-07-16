// main.js — Orquestador de la experiencia "Pixel: El Arranque".
import * as THREE from 'three';
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.mjs';
import { buildWorld } from './world.js';
import { buildPixel } from './character.js';
import { makePostFX } from './postfx.js';
import { STATIONS, STATION_NOTES } from './content.js';

const damp = THREE.MathUtils.damp;
const clamp = THREE.MathUtils.clamp;

// ---------------------------------------------------------------------------
// Utilidades de arranque
// ---------------------------------------------------------------------------
function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

// Degrada a contenido estático legible (sin 3D). Usado por el branch inicial,
// el catch de startExperience y la pérdida de contexto WebGL.
function revealStatic(noWebgl) {
  document.body.classList.add('static-mode');
  if (noWebgl) document.body.classList.add('no-webgl');
  document.querySelectorAll('.card').forEach((c) => c.classList.add('is-in'));
  document.body.classList.remove('is-loading', 'anim-on');
  if (window.__pixelWatchdog) clearTimeout(window.__pixelWatchdog);
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowTier = window.matchMedia('(max-width: 820px)').matches || (navigator.hardwareConcurrency || 8) <= 4;

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Modo estático (sin WebGL o reduce-motion): el contenido HTML ya es legible.
// Si el 3D falla al iniciar, también caemos a estático (no pantalla en blanco/loader infinito).
// ---------------------------------------------------------------------------
if (!webglOK() || reduceMotion) {
  revealStatic(!webglOK());
} else {
  try {
    startExperience();
  } catch (err) {
    console.error('Pixel 3D no pudo iniciar; modo estático.', err);
    revealStatic(true);
  }
}

// ---------------------------------------------------------------------------
function startExperience() {
  document.body.classList.add('anim-on');
  const canvas = document.getElementById('scene');

  // ---- Renderer ----
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowTier, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowTier ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // Si el contexto WebGL se pierde tras el arranque, degradamos a estático.
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); running = false; revealStatic(true); }, false);

  // ---- Escena + cámara ----
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 600);
  camera.position.set(0, 2, 8);

  // ---- Mundo + personaje ----
  const world = buildWorld(scene);
  const pixel = buildPixel(scene);
  scene.add(pixel.group);

  // ---- Post-procesado ----
  const postfx = makePostFX(renderer, scene, camera, { enabled: !lowTier });

  // ---- Lenis (scroll suave) ----
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });

  // ---- Cursor ----
  const ndc = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();
  const headTarget = new THREE.Vector3(0, 2, 0);
  const plane = new THREE.Plane();
  let lastPointer = performance.now();
  window.addEventListener('pointermove', (e) => {
    ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    lastPointer = performance.now();
  }, { passive: true });

  // ---- Easter egg: click hace girar a Pixel ----
  canvas.addEventListener('pointerdown', () => pixel.gesture('spin'));

  // ---- Activación de secciones (IntersectionObserver) ----
  const sections = Array.from(document.querySelectorAll('.panel'));
  const hudNum = document.getElementById('hud-num');
  const hudLabel = document.getElementById('hud-label');
  const hudPixel = document.getElementById('hud-pixel');
  let activeIndex = -1;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const card = entry.target.querySelector('.card');
      if (entry.isIntersecting) {
        if (card) card.classList.add('is-in');
        const idx = parseInt(entry.target.dataset.station, 10);
        if (entry.intersectionRatio > 0.5 && idx !== activeIndex) setActive(idx, entry.target);
      }
    });
  }, { threshold: [0.25, 0.55] });
  sections.forEach((s) => io.observe(s));

  function setActive(idx, sectionEl) {
    activeIndex = idx;
    const st = STATIONS[idx] || STATIONS[0];
    if (hudNum) hudNum.textContent = String(idx).padStart(2, '0');
    if (hudLabel) hudLabel.textContent = st.hud;
    if (hudPixel) hudPixel.textContent = STATION_NOTES[st.id] || '';
    pixel.setHue(st.hue);
    pixel.gesture('arrive');
    if (st.kind === 'hero' || st.kind === 'contact') pixel.gesture('wave');
    sections.forEach((s) => s.classList.toggle('is-active', s === sectionEl && s.classList.contains('project')));
  }

  // ---- Progreso de scroll ----
  function scrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
  }

  // ---- Estado del loop ----
  const clock = new THREE.Clock();
  let smoothP = 0;
  let prevP = 0;
  let scrollVel = 0;
  let running = false;          // ¿el rAF loop está activo?
  let paused = false;           // ¿pausado por el usuario (botón)?
  let rafId = 0;                // id del requestAnimationFrame en curso
  let needsPausedRender = true; // re-render único al entrar a pausa / tras resize

  // Arranque idempotente del loop: nunca deja dos rAF encolados a la vez.
  function start() {
    if (running) return;
    running = true;
    clock.getDelta();           // descarta el delta acumulado durante la pausa/oculto
    rafId = requestAnimationFrame(frame);
  }

  // vectores reutilizables (cero asignaciones por frame)
  const camPos = new THREE.Vector3();
  const aheadPos = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const pixelPos = new THREE.Vector3();
  const lookFlat = new THREE.Vector3();
  const camDir = new THREE.Vector3();
  const camDirNeg = new THREE.Vector3();
  const idleTarget = new THREE.Vector3();
  const camFinal = new THREE.Vector3();
  let pixOffY = -1.1;   // offset vertical de Pixel
  let pixOffX = 0;      // offset lateral (en hero/contacto se hace a un lado)
  let pixDist = 6.0;    // distancia frente a la cámara

  function frame(time) {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    lenis.raf(time);              // Lenis sigue vivo aun en pausa (el usuario puede leer/scroll)

    if (paused) {
      // Escena estática: renderiza una sola vez (al pausar o tras resize), no cada frame.
      if (needsPausedRender) { postfx.render(); needsPausedRender = false; }
      return;
    }

    const dt = Math.min(clock.getDelta(), 0.05);

    // progreso suavizado + velocidad
    const target = scrollProgress();
    smoothP = damp(smoothP, target, 8, dt);
    const inst = (smoothP - prevP) / Math.max(dt, 0.0001);
    scrollVel = damp(scrollVel, inst, 6, dt);
    prevP = smoothP;

    // ---- Cámara a lo largo del path ----
    // baseT acotado a 0.985 para que forward nunca degenere a cero ni la mira colapse al tope.
    const baseT = clamp(smoothP, 0, 0.985);
    world.curve.getPointAt(baseT, camPos);
    world.curve.getPointAt(baseT + 0.012, aheadPos);
    forward.copy(aheadPos).sub(camPos).normalize();
    right.copy(forward).cross(up).normalize();

    // parallax de cursor sobre la cámara
    const px = ndc.x * 0.8;
    const py = ndc.y * 0.5;
    camFinal.copy(camPos)
      .addScaledVector(right, px)
      .addScaledVector(up, 1.45 + py);
    camFinal.y += Math.sin(time * 0.0006) * 0.15;
    camera.position.lerp(camFinal, 1 - Math.exp(-10 * dt));
    // Mira a un punto adelante en el path, más nivelado (encuadre estable de frente).
    camera.lookAt(aheadPos.x, aheadPos.y + 0.95, aheadPos.z);

    // ---- Pixel frente a la cámara, mirándola ----
    // En hero/contacto (tarjeta centrada) Pixel se hace a un lado para no quedar tapado.
    // En las secciones de tarjeta ancha (grid) se aparta más y se aleja, porque la
    // tarjeta ocupa casi todo el ancho.
    const kind = (STATIONS[activeIndex] || {}).kind;
    const centered = kind === 'hero' || kind === 'contact';
    const wide = kind === 'grid';
    pixOffY = damp(pixOffY, wide ? -1.45 : -0.85, 4, dt);
    pixOffX = damp(pixOffX, wide ? 5.8 : (centered ? 4.1 : 0), 3.5, dt);
    pixDist = damp(pixDist, wide ? 8.6 : (centered ? 7.6 : 6.8), 4, dt);
    camera.getWorldDirection(camDir);
    pixelPos.copy(camera.position)
      .addScaledVector(camDir, pixDist)
      .addScaledVector(up, pixOffY)
      .addScaledVector(right, pixOffX);
    pixel.group.position.lerp(pixelPos, 1 - Math.exp(-12 * dt));
    // orientar: que su frente (+Z) mire a la cámara
    lookFlat.set(
      pixel.group.position.x + (pixel.group.position.x - camera.position.x),
      pixel.group.position.y,
      pixel.group.position.z + (pixel.group.position.z - camera.position.z)
    );
    pixel.group.lookAt(lookFlat);

    // ---- Punto objetivo del cursor (para la mirada) ----
    const idle = performance.now() - lastPointer > 3000;
    raycaster.setFromCamera(ndc, camera);
    plane.setFromNormalAndCoplanarPoint(camDirNeg.copy(camDir).negate(), pixel.group.position);
    const hit = raycaster.ray.intersectPlane(plane, headTarget);
    if (idle || !hit) {
      // Sin mouse reciente: Pixel mira al espectador (la cámara) -> cara de frente.
      idleTarget.copy(camera.position);
      idleTarget.y += 0.25;
      headTarget.copy(idleTarget);
    }
    const active = !idle;

    pixel.update(dt, { headTarget, scrollVel, active });
    world.update(dt, smoothP, camera.position);

    postfx.render();
  }

  // ---- Resize ----
  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    postfx.setSize(w, h);
    needsPausedRender = true; // si está en pausa, re-renderiza con el nuevo tamaño
  }
  window.addEventListener('resize', onResize);

  // ---- Pausa en pestaña oculta (cancela el rAF para no duplicar el loop al volver) ----
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
    } else if (!paused) {
      start();
    }
  });

  // ---- Botón toggle 3D ----
  const toggle = document.getElementById('toggle-motion');
  if (toggle) {
    toggle.addEventListener('click', () => {
      paused = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      if (paused) {
        needsPausedRender = true; // un render final del estado estático
      } else {
        start();                  // reanuda aunque el loop estuviera detenido
      }
    });
  }

  // ---- Loader → arranque ----
  const fill = document.querySelector('.loader__fill');
  let p = 0;
  const fillTimer = setInterval(() => {
    p = Math.min(100, p + 8 + Math.random() * 14);
    if (fill) fill.style.width = p + '%';
    if (p >= 100) clearInterval(fillTimer);
  }, 90);

  function boot() {
    onResize();                 // primer ajuste de tamaño
    setActive(0, sections[0]);  // activa la primera sección
    start();                    // arranca el loop
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      if (fill) fill.style.width = '100%';
      if (window.__pixelWatchdog) clearTimeout(window.__pixelWatchdog);
    }, 600);
  }

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
}
