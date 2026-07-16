// toon.js — Helpers de cel-shading compartidos: gradientMap, materiales toon,
// contorno inverted-hull, aura de fresnel, sombra blob y cielo de gradiente.
import * as THREE from 'three';

// --- Gradient map de 3 bandas para el look anime (sombras duras) ---
let _gradientMap = null;
export function gradientMap() {
  if (_gradientMap) return _gradientMap;
  const colors = new Uint8Array([90, 175, 255]); // 3 bandas: sombra / medio / luz
  const tex = new THREE.DataTexture(colors, colors.length, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  _gradientMap = tex;
  return tex;
}

// --- Material toon (cel-shaded) ---
export function toonMat(color, opts = {}) {
  return new THREE.MeshToonMaterial({
    color: new THREE.Color(color),
    gradientMap: gradientMap(),
    ...opts,
  });
}

// --- Material emisivo "brillante" (capta el bloom) ---
export function glowMat(color, opts = {}) {
  return new THREE.MeshBasicMaterial({ color: new THREE.Color(color), ...opts });
}

// --- Contorno inverted-hull: mesh hijo que desplaza vértices por su normal ---
const OUTLINE_VERT = /* glsl */`
  uniform float thickness;
  void main() {
    vec3 p = position + normal * thickness;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const OUTLINE_FRAG = /* glsl */`
  uniform vec3 uColor;
  void main() { gl_FragColor = vec4(uColor, 1.0); }
`;

export function addOutline(mesh, thickness = 0.03, color = '#16182E') {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      thickness: { value: thickness },
      uColor: { value: new THREE.Color(color) },
    },
    vertexShader: OUTLINE_VERT,
    fragmentShader: OUTLINE_FRAG,
    side: THREE.BackSide,
  });
  const outline = new THREE.Mesh(mesh.geometry, mat);
  outline.name = 'outline';
  outline.frustumCulled = false;
  mesh.add(outline);
  return outline;
}

// --- Textura radial para sombra blob ---
let _blobTex = null;
export function blobTexture() {
  if (_blobTex) return _blobTex;
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(22,24,46,0.85)');
  g.addColorStop(0.55, 'rgba(22,24,46,0.4)');
  g.addColorStop(1, 'rgba(22,24,46,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _blobTex = tex;
  return tex;
}

// --- Textura de punto redondo para partículas (evita cuadrados) ---
let _dotTex = null;
export function dotTexture() {
  if (_dotTex) return _dotTex;
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _dotTex = tex;
  return tex;
}

// --- Cielo de gradiente vertical (esfera invertida) ---
const SKY_VERT = /* glsl */`
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const SKY_FRAG = /* glsl */`
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uBottom;
  varying vec3 vWorld;
  void main() {
    float h = normalize(vWorld).y;            // -1 (abajo) .. 1 (arriba)
    float t = smoothstep(-0.15, 0.55, h);     // horizonte cálido
    float b = smoothstep(-0.6, -0.05, h);
    vec3 col = mix(uBottom, uMid, b);
    col = mix(col, uTop, t);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function skyMaterial(top, mid, bottom) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTop: { value: new THREE.Color(top) },
      uMid: { value: new THREE.Color(mid) },
      uBottom: { value: new THREE.Color(bottom) },
    },
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
}
