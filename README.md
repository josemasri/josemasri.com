# josemasri.com

Portafolio personal de **José Masri** (Full-Stack Software Engineer), en español e inglés.

El contenido vive en HTML semántico y es legible sin JavaScript. Sobre él corre una escena 3D
con [three.js](https://threejs.org) —un mundo low-poly y un personaje procedural— que funciona
como fondo: si compite con el texto, gana el texto.

**Bilingüe:** inglés en `/` (`index.html`) y español en `/es/` (`es/index.html`). El inglés es el
predeterminado porque la mayoría de los reclutadores que llegan al dominio leen en inglés. Ambas
páginas comparten CSS, módulos 3D y assets; se enlazan con el botón `EN`/`ES` de la barra y con
`hreflang` para que cada idioma se indexe por separado (`x-default` apunta a la raíz).

`/en/` quedó como stub de redirección a la raíz, para que los enlaces antiguos no den 404. Es
`noindex` y su `canonical` apunta a `/`.

## Cómo correrlo en local

Necesita servirse por HTTP (los módulos ES no cargan con `file://`):

```bash
python3 -m http.server 8099   # o: npx serve .
```

Luego abre `http://localhost:8099`.

## Despliegue

100% estático, sin build step. Súbelo tal cual a GitHub Pages, Netlify, Vercel o Cloudflare Pages.

> Las dependencias (three.js, Lenis, Google Fonts) se cargan por CDN, así que el modo 3D
> necesita conexión a internet. Sin ella, el contenido igual se lee sobre el gradiente CSS.

## Editar el contenido

- **Textos, proyectos y enlaces:** todo lo visible está en `index.html` (en) y `es/index.html` (es)
  como HTML semántico. **Al tocar uno, actualiza el otro:** son documentos independientes.
  Ojo con las rutas relativas: la raíz usa `./`, y `/es/` usa `../`.
- **Estaciones del recorrido 3D:** `src/content.js`. Es lo único que consume la escena.
- **Paleta y tipografías:** variables CSS al inicio de `styles/main.css`.
- **CV:** `assets/cv-jose-masri.pdf`, enlazado desde hero, experiencia y contacto.

> **Al agregar o quitar secciones**, mantén sincronizados el arreglo `STATIONS` de
> `src/content.js` y los `data-station` del HTML: deben ser índices consecutivos desde 0, en el
> mismo orden, y los `id` de las `<section>` son la llave contra `STATIONS` (no los traduzcas).
> El path 3D, las islas y las nubes se dimensionan solos a partir de `STATIONS.length`.

## Estructura

```
index.html          Documento raíz (en): import map, contenido semántico, fallback
es/index.html       Misma página en español; reutiliza ../styles, ../src y ../assets
en/index.html       Stub de redirección a / (compatibilidad con enlaces antiguos)
styles/main.css     Overlay: tipografía, tarjetas, timeline, rejillas, responsive
assets/
  cv-jose-masri.pdf CV descargable
  og-image.png      Preview 1200x630 para redes
src/
  main.js           Orquestador: renderer, cámara por el path, scroll (Lenis), loop, fallbacks
  character.js      "Pixel": robot procedural cel-shaded (sigue el cursor, antena, estela)
  world.js          Mundo: cielo, luna, niebla, path, islas, nubes, partículas, luces
  toon.js           Helpers cel-shading: materiales toon, contorno inverted-hull, cielo
  postfx.js         Bloom por umbral (UnrealBloomPass) + OutputPass
  content.js        Estaciones del recorrido y colores de la escena
```

## Accesibilidad y rendimiento

- **Sin WebGL / sin JS:** el contenido se muestra sobre un gradiente CSS, totalmente legible.
- **`prefers-reduced-motion`:** sin scroll suave ni animación de entrada; layout estático.
- **Móvil / equipos lentos:** se reduce el pixel ratio y se apaga el bloom automáticamente.
- Un watchdog revela el contenido a los 6s si un CDN falla, para que el loader nunca se cuelgue.
- El render se pausa con la pestaña oculta, y el botón `3D` lo pausa a voluntad.

## Stack

three.js `0.169` · Lenis `1.1` · Space Grotesk / Inter / Space Mono.
Sin assets 3D externos: el personaje y el mundo se generan proceduralmente.
