# josemasri.com — Landing 3D "Pixel: El Arranque"

Portafolio personal interactivo de **José Masri** (Full-Stack Software Engineer).
Una experiencia _scrollytelling_ 3D con [three.js](https://threejs.org): **Pixel**, un robot-guía
cel-shaded estilo caricatura/anime, te sigue con la mirada y te lleva por un archipiélago
nocturno de neón descubriendo la experiencia, los proyectos y la info de José conforme haces scroll.

**17 estaciones:** hero · sobre mí · experiencia · skills · 10 proyectos destacados ·
side projects · archivo · contacto.

Todo el contenido vive en **HTML semántico**, así que es legible e indexable aun sin WebGL.

**Bilingüe:** español en `/` (`index.html`) e inglés en `/en/` (`en/index.html`). Ambas páginas
comparten CSS, módulos 3D y assets; se enlazan entre sí con el botón `ES`/`EN` de la barra y con
`hreflang` para que Google indexe cada idioma por separado.

## Cómo correrlo en local

Necesita servirse por HTTP (los módulos ES no cargan con `file://`). Cualquiera de estas:

```bash
# opción 1: Python
python3 -m http.server 8099
# opción 2: Node
npx serve .
```

Luego abre `http://localhost:8099`.

## Despliegue

Es 100% estático (HTML + CSS + JS + CDNs). Súbelo tal cual a:
**GitHub Pages, Netlify, Vercel o Cloudflare Pages**. No hay build step.
> Las dependencias (three.js, Lenis, Google Fonts) se cargan por CDN, así que el sitio
> necesita conexión a internet para el modo 3D.

## Editar tu contenido

- **Textos, proyectos y enlaces:** todo el contenido visible vive en `index.html` (español) y
  `en/index.html` (inglés), como HTML semántico real. Edita ahí títulos, descripciones y los
  `href` de GitHub/email. **Al tocar uno, actualiza el otro:** son documentos independientes.
- **Datos para la escena 3D** (colores por lenguaje, estaciones, notas del HUD): `src/content.js`.
  Las etiquetas y notas del HUD son bilingües: `content.js` lee `document.documentElement.lang`
  y resuelve `LOCALE` (`es` | `en`) solo. Los `id` de las `<section>` son los mismos en ambos
  idiomas — son la llave contra `STATIONS`, así que no los traduzcas.
- **Paleta y tipografías:** variables CSS al inicio de `styles/main.css`.
- **CV:** `assets/cv-jose-masri.pdf`. Se enlaza desde el hero, la sección de experiencia y contacto.

> **Al agregar o quitar estaciones**, mantén sincronizados el arreglo `STATIONS` de
> `src/content.js` y los `data-station` de `index.html` (deben ser índices consecutivos
> desde 0). El path 3D, las islas y las nubes se dimensionan solos a partir de
> `STATIONS.length`; el cielo y la luna viven en un rig que sigue a la cámara, así que
> el recorrido puede crecer sin que la cámara los alcance.

## Los proyectos son datos verificados

Los proyectos de **Blazt** y **Overcloud** se seleccionaron consultando la API de Coolify de
ambas instancias (para obtener repos y URLs desplegadas) y cruzándolos contra la API de GitHub,
contando solo commits de José. Sus tres identidades de commit son:

```
Jose Masri <ae_jmsalame@contractor.indeed.com>          (la mayoría — no vinculada a su cuenta GitHub)
Jose Masri <58571583+josemasri@users.noreply.github.com>
Jose Masri <josemasri222@gmail.com>
```

> Ojo: filtrar por `?author=josemasri` en la API de GitHub **no basta** — la mayoría de sus
> commits usan un email no vinculado a su cuenta y quedan fuera. Hay que filtrar por email.

Resultado: **39 repos con commits suyos, 1,763 commits en total**. Las cifras que aparecen en
cada tarjeta (`commits míos`, `% del repo`) salen de ahí. 25 repos más quedaron fuera por no
tener acceso de lectura desde su cuenta.

## Estructura

```
index.html          Documento raíz (es-MX): import map, overlay semántico (contenido real), HUD, fallback
en/index.html       Misma página en inglés (lang="en"); reutiliza ../styles, ../src y ../assets
styles/main.css     Diseño del overlay, tipografías, glass cards, timeline, rejillas, HUD, responsive
assets/
  cv-jose-masri.pdf CV descargable (enlazado desde hero, experiencia y contacto)
  og-image.png      Preview 1200x630 para redes
src/
  main.js           Orquestador: renderer, cámara por el path, scroll (Lenis), cursor, loop, fallbacks
  character.js      "Pixel": robot procedural cel-shaded (ojos que siguen el cursor, antena, estela)
  world.js          Archipiélago: rig de cielo/luna, niebla, path, islas, nubes, partículas, luces
  toon.js           Helpers cel-shading: gradientMap, contorno inverted-hull, cielo
  postfx.js         Bloom selectivo (UnrealBloomPass) + OutputPass
  content.js        Datos: estaciones, colores, experiencia, proyectos verificados, notas del HUD
```

## Accesibilidad y rendimiento

- **Sin WebGL / sin JS:** el contenido se muestra sobre un gradiente CSS, totalmente legible.
- **`prefers-reduced-motion`:** se desactiva el scroll-jacking y la animación; layout estático.
- **Móvil / equipos lentos:** se reduce el pixel ratio y se apaga el bloom automáticamente.
- El render se pausa cuando la pestaña está oculta.

## Stack

three.js `0.169` · Lenis `1.1` · Space Grotesk / Inter / Space Mono.
Sin assets 3D externos: el personaje y el mundo se generan proceduralmente.
