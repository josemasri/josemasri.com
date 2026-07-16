// postfx.js — Post-procesado: bloom por umbral sobre emisivos brillantes + OutputPass.
// Se usa el umbral (no swap de materiales por layers) por robustez: los emisivos
// (ojos, sol, cristales, toro, riel) son los únicos elementos muy brillantes y son
// los que "estallan", dejando el toon mate del mundo intacto.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export function makePostFX(renderer, scene, camera, { enabled = true } = {}) {
  let composer = null;
  let bloom = null;
  let renderPass = null;
  let useBloom = enabled;

  // Solo construimos el pipeline (y sus ~13 render targets HalfFloat) si el bloom está activo.
  if (enabled) {
    const size = renderer.getSize(new THREE.Vector2());
    composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    composer.setSize(size.x, size.y);

    renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // strength, radius, threshold — umbral alto y fuerza contenida: el glow debe insinuarse
    // en los emisivos, no derramarse sobre las tarjetas de contenido.
    bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.34, 0.4, 0.85);
    composer.addPass(bloom);

    composer.addPass(new OutputPass());
  }

  function render() {
    if (useBloom && composer) composer.render();
    else renderer.render(scene, camera);
  }

  function setSize(w, h) {
    if (composer) composer.setSize(w, h);
    if (bloom) bloom.setSize(w, h);
  }

  function setEnabled(v) { useBloom = v && !!composer; }
  function setCamera(cam) { if (renderPass) renderPass.camera = cam; }

  return { composer, bloom, render, setSize, setEnabled, setCamera };
}
