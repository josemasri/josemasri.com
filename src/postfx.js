// postfx.js — Post-procesado: bloom por umbral sobre emisivos brillantes + OutputPass.
// Se usa el umbral (no swap de materiales por layers) por robustez: los emisivos
// (ojos, luna, cristales, toro, riel) son los únicos elementos muy brillantes y son
// los que "estallan", dejando el toon mate del mundo intacto.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export function makePostFX(renderer, scene, camera, { enabled = true } = {}) {
  // Sin bloom no construimos el pipeline (ni sus ~13 render targets HalfFloat):
  // render() cae directo al renderer y setSize() no tiene nada que redimensionar.
  if (!enabled) {
    return {
      render: () => renderer.render(scene, camera),
      setSize: () => {},
    };
  }

  const size = renderer.getSize(new THREE.Vector2());
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  composer.setSize(size.x, size.y);
  composer.addPass(new RenderPass(scene, camera));

  // strength, radius, threshold — umbral alto y fuerza contenida: el glow debe insinuarse
  // en los emisivos, no derramarse sobre las tarjetas de contenido.
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.18, 0.35, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  return {
    render: () => composer.render(),
    setSize: (w, h) => { composer.setSize(w, h); bloom.setSize(w, h); },
  };
}
