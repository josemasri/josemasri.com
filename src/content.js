// content.js — Fuente única de verdad del contenido (español MX / inglés) y datos para la escena 3D.
// El HTML semántico de index.html (es) y en/index.html (en) es el contenido canónico para
// SEO/accesibilidad; aquí viven los datos estructurados que consume la escena
// (estaciones, colores por lenguaje, HUD).
//
// Los proyectos de Blazt/Overcloud están verificados contra la API de GitHub: solo aparecen
// repos con commits reales de José (identidades: ae_jmsalame@contractor.indeed.com,
// josemasri222@gmail.com, 58571583+josemasri@users.noreply.github.com).

// Idioma activo: lo define el atributo lang del documento (es-MX en /, en en /en/).
export const LOCALE = (document.documentElement.lang || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';

export const PALETTE = {
  cieloMenta: '#7FE3D4',
  duraznoAtardecer: '#FFB17A',
  indigoCrepusculo: '#2B2350',
  azulCobalto: '#2D4EF5',
  coralPop: '#FF5C7A',
  amarilloChispa: '#FFD23F',
  magentaKi: '#FF2D95',
  cremaHueso: '#FFF6EC',
  tintaProfunda: '#16182E',
};

// Color de "energía" por familia de lenguaje — tiñe el visor/aura/estela de Pixel en cada estación.
export const LANG_COLORS = {
  swift: '#FF6A1A',
  python: '#FFD23F',
  node: '#FFD23F',
  ts: '#2D4EF5',
  react: '#1BE7FF',
  vue: '#42d392',
  dart: '#29B6F6',
  java: '#E76F00',
  laravel: '#FF2D20',
  brand: '#2D4EF5',
  contact: '#FF5C7A',
};

// Estaciones del recorrido, en orden. Cada una mapea a una <section> del overlay y a un punto del path 3D.
// hud = etiqueta por idioma, resuelta contra LOCALE al exportar; hue = color de energía que adopta
// Pixel; kind = comportamiento de cámara/Pixel en main.js.
// Los id son los mismos en ambos idiomas: son los anchors de las <section> de las dos páginas.
const STATION_DEFS = [
  { id: 'hero',          hud: { es: 'INICIO',      en: 'START' },      hue: PALETTE.amarilloChispa, kind: 'hero' },
  { id: 'sobre-mi',      hud: { es: 'PERFIL',      en: 'PROFILE' },    hue: LANG_COLORS.brand,   kind: 'about' },
  { id: 'experiencia',   hud: { es: 'TRAYECTORIA', en: 'TRACK' },      hue: PALETTE.magentaKi,   kind: 'grid' },
  { id: 'skills',        hud: { es: 'STACK',       en: 'STACK' },      hue: '#1BE7FF',           kind: 'skills' },
  { id: 'erp-ecommerce', hud: { es: 'PROYECTO 01', en: 'PROJECT 01' }, hue: LANG_COLORS.ts,      kind: 'project' },
  { id: 'bebank',        hud: { es: 'PROYECTO 02', en: 'PROJECT 02' }, hue: LANG_COLORS.java,    kind: 'project' },
  { id: 'motofinancia',  hud: { es: 'PROYECTO 03', en: 'PROJECT 03' }, hue: LANG_COLORS.laravel, kind: 'project' },
  { id: 'driveaway',     hud: { es: 'PROYECTO 04', en: 'PROJECT 04' }, hue: LANG_COLORS.ts,      kind: 'project' },
  { id: 'ototo',         hud: { es: 'PROYECTO 05', en: 'PROJECT 05' }, hue: LANG_COLORS.vue,     kind: 'project' },
  { id: 'keishejad',     hud: { es: 'PROYECTO 06', en: 'PROJECT 06' }, hue: LANG_COLORS.laravel, kind: 'project' },
  { id: 'kosherbot',     hud: { es: 'PROYECTO 07', en: 'PROJECT 07' }, hue: LANG_COLORS.laravel, kind: 'project' },
  { id: 'merkaz',        hud: { es: 'PROYECTO 08', en: 'PROJECT 08' }, hue: LANG_COLORS.laravel, kind: 'project' },
  { id: 'inventive-erp', hud: { es: 'PROYECTO 09', en: 'PROJECT 09' }, hue: LANG_COLORS.java,    kind: 'project' },
  { id: 'kinor',         hud: { es: 'PROYECTO 10', en: 'PROJECT 10' }, hue: LANG_COLORS.vue,     kind: 'project' },
  { id: 'side',          hud: { es: 'OPEN SOURCE', en: 'OPEN SOURCE' }, hue: LANG_COLORS.swift,  kind: 'grid' },
  { id: 'mas',           hud: { es: 'ARCHIVO',     en: 'ARCHIVE' },    hue: LANG_COLORS.react,   kind: 'grid' },
  { id: 'contacto',      hud: { es: 'CONTACTO',    en: 'CONTACT' },    hue: LANG_COLORS.contact, kind: 'contact' },
];

export const STATIONS = STATION_DEFS.map((s) => ({ ...s, hud: s.hud[LOCALE] }));

export const PROFILE = {
  name: 'José Masri',
  role: 'Full-Stack Software Engineer',
  location: 'Ciudad de México, México',
  years: '7+',
  github: 'https://github.com/josemasri',
  email: 'josemasri222@gmail.com',
  cv: './assets/cv-jose-masri.pdf',
};

// Historial laboral (fuente: CV).
export const EXPERIENCE = [
  {
    company: 'AgileEngine', role: 'Senior Backend Engineer', period: '2022 — Presente',
    note: 'Equipo de JavaScript Ecosystem de Indeed: tooling interno, librerías y el runtime de Node.js sobre el que construyen los demás equipos.',
  },
  {
    company: 'Jellyfish', role: 'Full Stack Engineering Manager', period: '2021 — 2022',
    note: 'Arquitectura backend y liderazgo de equipo en tres productos fintech: onboarding bancario, transacciones contactless y centro de métodos de pago.',
  },
  {
    company: 'Máscara de Látex', role: 'Backend / Integrations Engineer', period: '2020 — 2021',
    note: 'Integraciones de la plataforma admin con Netsuite, Shopify GraphQL y Amazon API.',
  },
  {
    company: 'Printogo', role: 'Full Stack Engineer', period: '2018 — 2019',
    note: 'Arquitectura de una plataforma de impresión y entrega: backend en tiempo real, web y móvil.',
  },
  {
    company: 'Freelance / Startups', role: 'Software Engineer', period: '2016 — 2020',
    note: 'JMatch (app de citas) y Yad LaKala Raffles (e-commerce con MercadoPago).',
  },
];

export const SKILLS = {
  lenguajes: ['TypeScript', 'JavaScript', 'Node.js', 'Python', 'PHP', 'Java', 'Swift', 'Dart'],
  frameworks: ['NestJS', 'Express', 'Laravel', 'Spring', 'React', 'Next.js', 'Vue', 'React Native'],
  datos: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'MariaDB', 'Firebase'],
  cloud: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'GitLab CI', 'GitHub Actions'],
};

// Proyectos destacados (orden = recorrido). commits = commits verificados de José; share = % del repo.
export const PROJECTS = [
  {
    id: 'erp-ecommerce', name: 'ERP E-commerce', tech: 'TypeScript · Node · PostgreSQL',
    hue: LANG_COLORS.ts, org: 'Blazt', commits: 432, share: 36,
    url: 'https://ecommerce.blazt.dev',
  },
  {
    id: 'bebank', name: 'Bebank', tech: 'Java · Spring · React',
    hue: LANG_COLORS.java, org: 'Blazt', commits: 336, share: 88,
    url: 'https://bebank.mx',
  },
  {
    id: 'motofinancia', name: 'MotoFinancia', tech: 'Laravel · React · PHP',
    hue: LANG_COLORS.laravel, org: 'Overcloud', commits: 233, share: 70,
    url: 'https://motofinancia.devgeai.com',
  },
  {
    id: 'driveaway', name: 'Drive Away', tech: 'TypeScript · Node · React',
    hue: LANG_COLORS.ts, org: 'Overcloud', commits: 127, share: 99,
    url: null,
  },
  {
    id: 'ototo', name: 'Ototo Rifas', tech: 'Laravel · Vue · WhatsApp',
    hue: LANG_COLORS.vue, org: 'Overcloud', commits: 88, share: 43,
    url: 'https://mrwin.com.mx',
  },
  {
    id: 'keishejad', name: 'Keish Ejad', tech: 'PHP · Blade',
    hue: LANG_COLORS.laravel, org: 'Overcloud', commits: 79, share: 13,
    url: null,
  },
  {
    id: 'kosherbot', name: 'KosherBot 2.0', tech: 'Laravel · PHP · Docker',
    hue: LANG_COLORS.laravel, org: 'Overcloud', commits: 62, share: 68,
    url: 'https://kosherbot.overcloud.us',
  },
  {
    id: 'merkaz', name: 'Merkaz', tech: 'Laravel · PHP',
    hue: LANG_COLORS.laravel, org: 'Overcloud', commits: 52, share: 24,
    url: 'https://merkaz.mx',
  },
  {
    id: 'inventive-erp', name: 'Inventive ERP', tech: 'Java · React · PostgreSQL',
    hue: LANG_COLORS.java, org: 'Blazt', commits: 45, share: 35,
    url: 'https://erp.blazt.dev',
  },
  {
    id: 'kinor', name: 'Kinor', tech: 'Laravel · Vue · TypeScript',
    hue: LANG_COLORS.vue, org: 'Overcloud', commits: 38, share: 100,
    url: 'https://kinor.s2.devgeai.com',
  },
];

// Side projects open source (públicos en GitHub).
export const SIDE_PROJECTS = [
  { name: 'ClipSync', tech: 'Swift', github: 'https://github.com/josemasri/ClipSync' },
  { name: 'cmux', tech: 'Swift · Ghostty', github: 'https://github.com/josemasri/cmux' },
  { name: 'petlyApp', tech: 'Flutter · Dart', github: 'https://github.com/josemasri/petlyApp' },
];

// Archivo: resto de proyectos con commits verificados + OSS adicional.
export const MORE_PROJECTS = [
  { name: 'OneKosher', tech: 'Laravel', commits: 37, url: 'https://onekosher.overcloud.us' },
  { name: 'Javerim', tech: 'Laravel', commits: 28, url: null },
  { name: 'Taxonomy PoC', tech: 'Java', commits: 21, url: 'https://taxonomy.blazt.dev' },
  { name: 'TailyHub API', tech: 'TypeScript', commits: 20, url: 'https://tailyhub.overcloud.us' },
  { name: 'Be Inventory', tech: 'Laravel', commits: 19, url: 'https://inventory.blazt.dev' },
  { name: 'Pushka', tech: 'Laravel', commits: 18, url: 'https://pushka.overcloud.us' },
  { name: 'Overcloud CRM', tech: 'Laravel · Voice', commits: 18, url: null },
  { name: 'JoeTV', tech: 'Node · React', commits: 17, url: 'https://admin-joetv.blazt.dev' },
  { name: 'Algoritmia', tech: 'Landing', commits: 16, url: 'https://algoritmia-trading.com' },
  { name: 'BeStore', tech: 'Laravel', commits: 16, url: 'https://bestore.blazt.dev' },
  { name: 'Be ERP', tech: 'Node · React', commits: 12, url: 'https://be-erp.blazt.dev' },
  { name: 'Cartise', tech: 'Node', commits: 10, url: 'https://cartise.app' },
  { name: 'ChevraSMS', tech: 'Laravel', commits: 9, url: 'https://chevrasms.overcloud.us' },
  { name: 'playlist-simplifier', tech: 'Node', commits: 8, url: 'https://github.com/josemasri/playlist-simplifier' },
  { name: 'Cotizador D2D', tech: 'Node', commits: 6, url: null },
  { name: 'Parking Reserve', tech: 'Java', commits: 5, url: 'https://parking.blazt.dev' },
];

// Nota corta por estación, mostrada en el HUD (decorativo, aria-hidden).
const STATION_NOTES_BY_LOCALE = {
  es: {
    hero: 'Full-Stack Software Engineer · CDMX',
    'sobre-mi': '7+ años en backend, APIs e integraciones',
    experiencia: '5 posiciones · 2016 — presente',
    skills: 'Node · TypeScript · Laravel · Java · Python',
    'erp-ecommerce': 'Arbitraje Amazon ↔ MercadoLibre · 432 commits',
    bebank: 'Core bancario en Java · 88% del repo',
    motofinancia: 'Financiamiento de motos · 6 repos',
    driveaway: 'Gestión de flotilla · 99% del repo',
    ototo: 'Rifas digitales en producción · 88 commits',
    keishejad: 'Plataforma comunitaria · 79 commits',
    kosherbot: 'Bot de certificación kosher · 68% del repo',
    merkaz: 'merkaz.mx · en producción',
    'inventive-erp': 'ERP en Java + React · 45 commits',
    kinor: 'Vue + Laravel · 100% del repo',
    side: 'Proyectos propios en GitHub',
    mas: '39 repos con commits verificados',
    contacto: 'josemasri222@gmail.com',
  },
  en: {
    hero: 'Full-Stack Software Engineer · Mexico City',
    'sobre-mi': '7+ years in backend, APIs and integrations',
    experiencia: '5 roles · 2016 — present',
    skills: 'Node · TypeScript · Laravel · Java · Python',
    'erp-ecommerce': 'Amazon ↔ MercadoLibre arbitrage · 432 commits',
    bebank: 'Java core banking · 88% of the repo',
    motofinancia: 'Motorcycle financing · 6 repos',
    driveaway: 'Fleet management · 99% of the repo',
    ototo: 'Digital raffles in production · 88 commits',
    keishejad: 'Community platform · 79 commits',
    kosherbot: 'Kosher certification bot · 68% of the repo',
    merkaz: 'merkaz.mx · live in production',
    'inventive-erp': 'Java + React ERP · 45 commits',
    kinor: 'Vue + Laravel · 100% of the repo',
    side: 'Personal projects on GitHub',
    mas: '39 repos with verified commits',
    contacto: 'josemasri222@gmail.com',
  },
};

export const STATION_NOTES = STATION_NOTES_BY_LOCALE[LOCALE];
