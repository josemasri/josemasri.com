// content.js — Datos que consume la escena 3D.
//
// El contenido visible (textos, proyectos, enlaces) NO vive aquí: vive como HTML semántico
// en index.html (es) y en/index.html (en), que es el canónico para SEO y accesibilidad.
// Aquí solo están las estaciones del recorrido y los colores que la escena necesita.

// Acentos de la escena. Los de familia de lenguaje tiñen la base y la estela de Pixel
// según la estación; los neutros los usa el mundo (riel, partículas, luz de contra).
export const HUES = {
  azul: '#2D4EF5',      // TypeScript / Node — también el riel del path
  cian: '#1BE7FF',      // React
  verde: '#42d392',     // Vue
  ambar: '#E76F00',     // Java
  rojo: '#FF2D20',      // Laravel
  naranja: '#FF6A1A',   // Swift
  amarillo: '#FFD23F',  // acento cálido / partículas
  magenta: '#FF2D95',   // luz de contra
  coral: '#FF5C7A',     // contacto
};

// Estaciones del recorrido, en orden. Cada una mapea a una <section> del overlay y a un punto
// del path 3D. Los id son los mismos en ambos idiomas: son los anchors de las <section>.
// kind = comportamiento de cámara/Pixel en main.js.
export const STATIONS = [
  { id: 'hero',          hue: HUES.amarillo, kind: 'hero' },
  { id: 'sobre-mi',      hue: HUES.azul,     kind: 'about' },
  { id: 'experiencia',   hue: HUES.magenta,  kind: 'grid' },
  { id: 'skills',        hue: HUES.cian,     kind: 'skills' },
  { id: 'erp-ecommerce', hue: HUES.azul,     kind: 'project' },
  { id: 'bebank',        hue: HUES.ambar,    kind: 'project' },
  { id: 'motofinancia',  hue: HUES.rojo,     kind: 'project' },
  { id: 'driveaway',     hue: HUES.azul,     kind: 'project' },
  { id: 'mas',           hue: HUES.verde,    kind: 'grid' },
  { id: 'side',          hue: HUES.naranja,  kind: 'grid' },
  { id: 'contacto',      hue: HUES.coral,    kind: 'contact' },
];
