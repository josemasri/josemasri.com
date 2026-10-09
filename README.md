# josemasri.com

Portafolio personal de **José Masri** (Senior Backend Engineer), en inglés y español.

Una sola página estática, sin frameworks ni dependencias en el navegador: HTML semántico, un CSS y
~40 líneas de JS opcional. La pieza central es la sección de experiencia dibujada como un
**trace waterfall** (como en las herramientas de tracing distribuido): cada rol es un span cuya
posición y largo son sus fechas reales.

**Bilingüe:** inglés en `/` y español en `/es/`. `/en/` es un stub que redirige a `/` para que los
enlaces antiguos no den 404 (`noindex`, canonical a `/`).

## Editar el contenido

Todo el texto vive en **`content/site.mjs`**, con cada cadena en `{ en, es }`. Después de editar:

```bash
node scripts/build.mjs   # regenera index.html y es/index.html
```

`index.html` y `es/index.html` son **generados**: no los edites a mano, se sobrescriben.
El generador no tiene dependencias (solo Node 18+).

- **Experiencia:** `experience.roles`. `start`/`end` en años; `end: null` es el rol actual, y su
  barra se estira hasta la fecha de hoy en el navegador.
- **Proyectos destacados:** `work.projects`. `size: 'lg'` ocupa dos columnas; `status` es
  `live`, `building` o `private`; `flow` dibuja el diagrama de sistemas conectados.
- **Archivo, stack, open source, contacto:** sus respectivos bloques en el mismo archivo.
- **Colores y tipografía:** tokens al inicio de `styles/site.css` (claro y oscuro).
- **CV:** `assets/cv-jose-masri.pdf`.
- **Imagen para redes:** `assets/og-image.png` (1200×630) se renderiza desde `scripts/og.html`.

## Correr en local

```bash
python3 -m http.server 8099   # o: npx serve .
```

## Despliegue

100% estático. Se publica copiando estos archivos a la raíz del sitio:

```
index.html  es/  en/  assets/  styles/  src/
```

`content/`, `scripts/` y el README no hacen falta en el servidor.

## Estructura

```
content/site.mjs   Todo el contenido, en/es
scripts/build.mjs  Genera index.html y es/index.html
scripts/og.html    Plantilla de la imagen Open Graph
styles/site.css    Estilos: tokens, layout, trace, bento, responsive
src/site.js        Selector de tema y fecha de hoy para el trace (opcional)
assets/            CV, favicon, og-image
```

## Detalles

- **Sin JS** la página se ve y funciona completa; JS solo agrega el botón de tema.
- **Tema:** sigue al sistema; el botón lo fija y lo recuerda (`localStorage`).
- **Movimiento:** las barras del trace se dibujan al hacer scroll con CSS scroll-driven
  animations; con `prefers-reduced-motion` no hay animaciones.
- **SEO:** `hreflang`, canonical, Open Graph y JSON-LD `Person`.
- Tipografías: Bricolage Grotesque, Geist y Geist Mono (Google Fonts).
