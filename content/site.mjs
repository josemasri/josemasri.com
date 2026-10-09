// Todo el contenido del sitio, en inglés y español, en un solo lugar.
// `node scripts/build.mjs` genera index.html (en) y es/index.html (es) a partir de aquí.
// Cada texto bilingüe es { en, es }; los nombres propios y las tecnologías van tal cual.

export const site = {
  url: 'https://josemasri.com',
  name: 'José Masri',
  email: 'josemasri222@gmail.com',
  github: 'https://github.com/josemasri',
  cv: 'assets/cv-jose-masri.pdf',
  // Fin del eje del trace: "hoy" en años decimales. Se recalcula en el navegador.
  now: 2026.8,
};

export const meta = {
  title: { en: 'José Masri — Senior Backend Engineer', es: 'José Masri — Senior Backend Engineer' },
  description: {
    en: 'José Masri, Senior Backend Engineer in Mexico City. 7+ years building APIs, integrations and production systems with Node.js/TypeScript, Laravel, Java and Python.',
    es: 'José Masri, Senior Backend Engineer en Ciudad de México. 7+ años construyendo APIs, integraciones y sistemas en producción con Node.js/TypeScript, Laravel, Java y Python.',
  },
  ogDescription: {
    en: 'I build the backends other systems depend on. 7+ years of APIs, integrations and production systems.',
    es: 'Construyo los backends de los que dependen otros sistemas. 7+ años de APIs, integraciones y sistemas en producción.',
  },
};

export const ui = {
  skip: { en: 'Skip to content', es: 'Saltar al contenido' },
  nav: {
    work: { en: 'Work', es: 'Proyectos' },
    experience: { en: 'Experience', es: 'Experiencia' },
    stack: { en: 'Stack', es: 'Stack' },
    contact: { en: 'Contact', es: 'Contacto' },
  },
  langSwitch: { en: 'Leer en español', es: 'Read in English' },
  themeToggle: { en: 'Switch color theme', es: 'Cambiar tema de color' },
  downloadCv: { en: 'Download CV', es: 'Descargar CV' },
  emailMe: { en: 'Email me', es: 'Escríbeme' },
  present: { en: 'present', es: 'hoy' },
  visit: { en: 'Visit', es: 'Visitar' },
  source: { en: 'Source', es: 'Código' },
  status: {
    live: { en: 'In production', es: 'En producción' },
    building: { en: 'In development', es: 'En desarrollo' },
    private: { en: 'Private', es: 'Privado' },
  },
};

export const hero = {
  location: { en: 'Mexico City · open to new roles', es: 'Ciudad de México · abierto a nuevas oportunidades' },
  thesis: {
    en: 'I build the backends other systems depend on.',
    es: 'Construyo los backends de los que dependen otros sistemas.',
  },
  lede: {
    en: 'Senior Backend Engineer with 7+ years shipping APIs, integrations and platforms that stay up in production. Right now I work on <strong>Indeed’s JavaScript Ecosystem team</strong> through AgileEngine, maintaining the Node.js runtime, libraries and images other engineering teams build on.',
    es: 'Senior Backend Engineer con 7+ años lanzando APIs, integraciones y plataformas que aguantan producción. Hoy trabajo en el <strong>equipo de JavaScript Ecosystem de Indeed</strong> vía AgileEngine, manteniendo el runtime de Node.js, las librerías y las imágenes sobre las que construyen otros equipos.',
  },
};

// Experiencia: cada rol es un span del trace. start/end en años; end: null = presente.
export const experience = {
  eyebrow: { en: 'Experience', es: 'Experiencia' },
  heading: { en: 'Career, as a trace', es: 'Trayectoria, como un trace' },
  intro: {
    en: 'Each bar is a role, placed on a real timeline. Open one to see what I shipped there.',
    es: 'Cada barra es un rol, colocado en su línea de tiempo real. Abre uno para ver qué entregué ahí.',
  },
  axisStart: 2016,
  roles: [
    {
      company: 'AgileEngine',
      client: { en: 'for Indeed and other clients', es: 'para Indeed y otros clientes' },
      role: 'Senior Backend Engineer',
      start: 2022, end: null,
      stack: ['Node.js', 'TypeScript', 'Docker', 'GitLab CI', 'Jest', 'Shopify GraphQL', 'MySQL', 'MSSQL'],
      points: {
        en: [
          '<strong>Indeed · JavaScript Ecosystem:</strong> core Node.js libraries, Docker images and project templates used across internal teams to standardize how services are set up and shipped.',
          'Migrated production services to newer Node.js versions, removing deprecated dependencies and closing security gaps.',
          'NPM and Bash automation for CI/CD that cut manual release steps and build times.',
          '<strong>Moran Family of Brands:</strong> integration that keeps the Shopify stores of multiple franchise locations in sync with Shopmonkey.',
          '<strong>Guardian Bikes:</strong> custom Shopify Liquid storefront sections and Shopify API work.',
        ],
        es: [
          '<strong>Indeed · JavaScript Ecosystem:</strong> librerías core de Node.js, imágenes Docker y plantillas de proyecto que usan los equipos internos para estandarizar cómo se crean y despliegan servicios.',
          'Migré servicios en producción a versiones nuevas de Node.js, quitando dependencias obsoletas y cerrando huecos de seguridad.',
          'Automatización con NPM y Bash para CI/CD que redujo pasos manuales de release y tiempos de build.',
          '<strong>Moran Family of Brands:</strong> integración que mantiene sincronizadas las tiendas Shopify de varias franquicias con Shopmonkey.',
          '<strong>Guardian Bikes:</strong> secciones de storefront a la medida en Shopify Liquid y trabajo con la API de Shopify.',
        ],
      },
    },
    {
      company: 'Jellyfish',
      client: { en: 'fintech products', es: 'productos fintech' },
      role: 'Full Stack Engineering Manager',
      start: 2021, end: 2022,
      stack: ['NestJS', 'MongoDB', 'PostgreSQL', 'Redis', 'Next.js', 'Kubernetes', 'Looker'],
      points: {
        en: [
          'Led backend architecture and a small team across three fintech products, from requirements to production, including code review and mentoring.',
          '<strong>Bank onboarding platform:</strong> designed the architecture, built the CMS and admin backend, and moved the infrastructure to Docker and Kubernetes.',
          '<strong>Contactless transactions</strong> and a <strong>payment methods center</strong>: backend APIs, admin panels, Amazon Gift Card API and reporting.',
          '<strong>Prosa Analytics:</strong> embedded Looker dashboards for one of Mexico’s largest payment processors, with signed, row-level access so each role sees only its own transactions.',
        ],
        es: [
          'Lideré la arquitectura backend y un equipo pequeño en tres productos fintech, del requerimiento a producción, incluyendo code review y mentoría.',
          '<strong>Plataforma de onboarding bancario:</strong> diseñé la arquitectura, construí el CMS y el backend administrativo, y migré la infraestructura a Docker y Kubernetes.',
          '<strong>Transacciones contactless</strong> y un <strong>centro de métodos de pago</strong>: APIs, paneles administrativos, Amazon Gift Card API y reportes.',
          '<strong>Prosa Analytics:</strong> dashboards de Looker embebidos para uno de los procesadores de pagos más grandes de México, con acceso firmado row-level para que cada rol vea solo sus transacciones.',
        ],
      },
    },
    {
      company: 'Máscara de Látex',
      client: { en: 'e-commerce', es: 'e-commerce' },
      role: 'Backend / Integrations Engineer',
      start: 2020, end: 2021,
      stack: ['Node.js', 'Express', 'MongoDB', 'MySQL', 'Netsuite', 'Docker'],
      points: {
        en: [
          'Connected the storefront to ERP and marketplace systems: <strong>Netsuite, Shopify GraphQL and the Amazon API</strong>.',
          'Moved the integration service to Docker and improved its stability.',
        ],
        es: [
          'Conecté el storefront con sistemas ERP y de marketplace: <strong>Netsuite, Shopify GraphQL y la API de Amazon</strong>.',
          'Migré el servicio de integraciones a Docker y lo estabilicé.',
        ],
      },
    },
    {
      company: 'Printogo',
      client: { en: 'print & delivery', es: 'impresión y entrega' },
      role: 'Full Stack Engineer',
      start: 2018, end: 2019,
      stack: ['NestJS', 'PostgreSQL', 'Redis', 'Socket.io', 'React Native', 'Kubernetes'],
      points: {
        en: [
          'Designed the architecture of a printing-and-delivery platform spanning backend, web and mobile.',
          'Built the real-time API (Socket.io) and its integrations, hardened it, and deployed it on Docker and Kubernetes.',
        ],
        es: [
          'Diseñé la arquitectura de una plataforma de impresión y entrega con backend, web y móvil.',
          'Construí la API en tiempo real (Socket.io) y sus integraciones, la endurecí y la desplegué en Docker y Kubernetes.',
        ],
      },
    },
    {
      company: 'Freelance',
      client: { en: 'startups', es: 'startups' },
      role: 'Software Engineer',
      start: 2016, end: 2020,
      stack: ['Node.js', 'MongoDB', 'Next.js', 'Strapi', 'Ionic', 'MercadoPago'],
      points: {
        en: [
          'Led development and small teams on startup products: <strong>JMatch</strong>, a community dating app, and <strong>Yad LaKala Raffles</strong>, e-commerce with MercadoPago payments.',
        ],
        es: [
          'Lideré el desarrollo y equipos pequeños en productos de startups: <strong>JMatch</strong>, una app de citas comunitaria, y <strong>Yad LaKala Raffles</strong>, e-commerce con pagos de MercadoPago.',
        ],
      },
    },
  ],
};

// Proyectos destacados. size: 'lg' ocupa dos columnas en el bento.
export const work = {
  eyebrow: { en: 'Selected work', es: 'Proyectos destacados' },
  heading: { en: 'Systems I designed and shipped', es: 'Sistemas que diseñé y entregué' },
  intro: {
    en: 'Products I designed and built end to end, most of them outside my day job. Each one runs real operations: money, inventory, classrooms, listings.',
    es: 'Productos que diseñé y construí de punta a punta, la mayoría fuera de mi trabajo principal. Cada uno sostiene operación real: dinero, inventario, salones, inmuebles.',
  },
  projects: [
    {
      name: 'ERP E-commerce',
      org: 'Blazt',
      size: 'lg',
      status: 'live',
      url: 'https://ecommerce.blazt.dev',
      domain: { en: 'Marketplace arbitrage', es: 'Arbitraje entre marketplaces' },
      flow: ['Amazon US', 'ERP', 'MercadoLibre MX'],
      text: {
        en: 'Finds price gaps between Amazon US and MercadoLibre MX, syncs catalog and inventory, and publishes to both. A TypeScript monorepo with the API, admin panel and its own storefront on PostgreSQL.',
        es: 'Detecta diferencias de precio entre Amazon US y MercadoLibre MX, sincroniza catálogo e inventario y publica en ambos. Monorepo TypeScript con API, panel administrativo y storefront propio sobre PostgreSQL.',
      },
      stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'React'],
    },
    {
      name: 'Bebank',
      org: 'Blazt',
      status: 'live',
      url: 'https://bebank.mx',
      domain: { en: 'Core banking', es: 'Core bancario' },
      text: {
        en: 'Accounts, transactions, back-office and customer onboarding. I was the primary author of the repository.',
        es: 'Cuentas, transacciones, back-office y onboarding de clientes. Fui el autor principal del repositorio.',
      },
      stack: ['Java', 'Spring', 'React', 'TypeScript'],
    },
    {
      name: 'Jambo',
      org: 'Jambo Kids',
      status: 'building',
      domain: { en: 'B2B education', es: 'Educación B2B' },
      text: {
        en: 'Schools load their own curriculum; kids play it on iPad, offline-first. A shared JSON activity contract is validated by the API and parsed by the app, so a mismatch fails CI instead of a tablet in a classroom.',
        es: 'Cada escuela carga su propio currículum y los niños lo juegan en iPad, offline-first. Un contrato JSON compartido lo valida la API y lo parsea la app, así que una divergencia rompe el CI y no una tablet en el salón.',
      },
      stack: ['Laravel 13', 'Filament', 'Flutter', 'PostgreSQL'],
    },
    {
      name: 'MotoFinancia',
      org: 'Overcloud',
      status: 'live',
      url: 'https://motofinancia.devgeai.com',
      domain: { en: 'Consumer lending', es: 'Crédito al consumo' },
      text: {
        en: 'Motorcycle financing end to end: loan origination, collections and the dealer network, across an API, admin panel, dealer portal and public site.',
        es: 'Financiamiento de motos de punta a punta: originación de crédito, cobranza y red de distribuidores, entre API, panel administrativo, portal de dealers y sitio público.',
      },
      stack: ['Laravel', 'React', 'MySQL'],
    },
    {
      name: 'Living Patrimonial',
      status: 'building',
      domain: { en: 'Real estate marketplace', es: 'Marketplace inmobiliario' },
      text: {
        en: 'Verified apartments for rent and sale. Owners publish through a 4-step wizard, admins approve from a review queue, buyers search on a map with geo filters. OTP login over SMS and WhatsApp.',
        es: 'Departamentos verificados en renta y venta. Los dueños publican con un wizard de 4 pasos, un admin aprueba desde una cola de revisión y la gente busca en un mapa con filtros geográficos. Login con OTP por SMS y WhatsApp.',
      },
      stack: ['Laravel 13', 'Vue 3', 'PostGIS', 'Meilisearch'],
    },
    {
      name: 'JoeTV',
      org: 'Blazt',
      size: 'lg',
      status: 'private',
      domain: { en: 'Streaming platform', es: 'Plataforma de streaming' },
      flow: ['Android TV', 'Node API', 'TMDB'],
      text: {
        en: 'A native Android TV client in Kotlin and Jetpack Compose (Xtream Codes / M3U), a Node.js API enriched with TMDB metadata, an admin panel to manage users and content, and a landing page to distribute the APK.',
        es: 'Cliente nativo para Android TV en Kotlin y Jetpack Compose (Xtream Codes / M3U), API en Node.js enriquecida con metadatos de TMDB, panel administrativo para usuarios y contenido, y landing para distribuir el APK.',
      },
      stack: ['Kotlin', 'Jetpack Compose', 'Node.js', 'TypeScript', 'Docker'],
    },
  ],
};

export const stack = {
  eyebrow: { en: 'Stack', es: 'Stack' },
  heading: { en: 'What I work with', es: 'Con qué trabajo' },
  groups: [
    { label: { en: 'Backend', es: 'Backend' }, primary: ['Node.js', 'TypeScript', 'NestJS', 'PHP · Laravel'], rest: ['Express', 'Fastify', 'Java · Spring', 'Python · Django', 'Go'] },
    { label: { en: 'APIs & architecture', es: 'APIs y arquitectura' }, primary: ['REST', 'GraphQL', 'WebSockets'], rest: ['Event-driven', 'Microservices', 'Webhooks', 'RBAC'] },
    { label: { en: 'Data', es: 'Datos' }, primary: ['PostgreSQL', 'MySQL', 'Redis'], rest: ['MongoDB', 'PostGIS', 'Meilisearch', 'MSSQL'] },
    { label: { en: 'Infra & delivery', es: 'Infra y entrega' }, primary: ['Docker', 'Kubernetes', 'AWS'], rest: ['GCP', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Nginx'] },
    { label: { en: 'Clients', es: 'Clientes' }, primary: ['React', 'Next.js', 'Vue 3'], rest: ['Inertia', 'Flutter', 'Kotlin · Compose', 'Swift', 'React Native'] },
    { label: { en: 'AI tooling', es: 'Herramientas de IA' }, primary: ['MCP servers', 'Agent workflows'], rest: ['Claude Code', 'Whisper', 'LLM extraction'] },
  ],
  connectedHeading: { en: 'Systems I’ve connected', es: 'Sistemas que he conectado' },
  connected: [
    { a: 'Shopify', b: 'Shopmonkey', note: { en: 'multi-location franchise sync', es: 'sync entre franquicias' } },
    { a: 'Amazon US', b: 'MercadoLibre MX', note: { en: 'catalog, price & inventory', es: 'catálogo, precio e inventario' } },
    { a: 'Storefront', b: 'Netsuite', note: { en: 'orders into the ERP', es: 'pedidos hacia el ERP' } },
    { a: 'Looker', b: 'RBAC', note: { en: 'signed row-level embeds', es: 'embeds firmados row-level' } },
    { a: 'WhatsApp Business', b: 'Strapi', note: { en: 'invitations & RSVPs', es: 'invitaciones y confirmaciones' } },
    { a: 'Checkout', b: 'MercadoPago', note: { en: 'payments', es: 'pagos' } },
  ],
};

export const openSource = {
  eyebrow: { en: 'Open source', es: 'Open source' },
  heading: { en: 'Things I build for myself', es: 'Lo que construyo para mí' },
  items: [
    {
      name: 'ClipSync',
      tech: 'Swift · Kotlin',
      url: 'https://github.com/josemasri/ClipSync',
      text: {
        en: 'Universal clipboard between macOS and Android over the local network. Text and images, both directions, no cloud.',
        es: 'Portapapeles universal entre macOS y Android por la red local. Texto e imágenes, en ambos sentidos, sin nube.',
      },
    },
    {
      name: 'WhatsApp MCP',
      tech: 'Go · Python',
      url: 'https://github.com/josemasri/whatsapp-mcp',
      text: {
        en: 'An extended build of lharries/whatsapp-mcp that lets AI agents work in WhatsApp: voice-note transcription with local Whisper, @-mentions, group admin tools and multi-node coordination.',
        es: 'Versión extendida de lharries/whatsapp-mcp para que agentes de IA trabajen en WhatsApp: transcripción de notas de voz con Whisper local, @-menciones, administración de grupos y coordinación entre varios nodos.',
      },
    },
    {
      name: 'Petly',
      tech: 'Ionic · Angular · NestJS',
      url: 'https://github.com/josemasri/petlyApp',
      text: {
        en: 'Pet care app for iOS and Android with a NestJS users backend and an admin panel.',
        es: 'App de cuidado de mascotas para iOS y Android con backend de usuarios en NestJS y panel administrativo.',
      },
    },
  ],
};

export const archive = {
  eyebrow: { en: 'Archive', es: 'Archivo' },
  heading: { en: 'More systems in production', es: 'Más sistemas en producción' },
  intro: {
    en: 'Built or maintained at Blazt and Overcloud, most with real users.',
    es: 'Construidos o mantenidos en Blazt y Overcloud, la mayoría con usuarios reales.',
  },
  items: [
    { name: 'Drive Away', what: { en: 'Fleet & transfers', es: 'Flotilla y traslados' }, tech: 'Node · React' },
    { name: 'Inventive ERP', what: { en: 'ERP', es: 'ERP' }, tech: 'Java · React', url: 'https://erp.blazt.dev' },
    { name: 'Be ERP', what: { en: 'ERP', es: 'ERP' }, tech: 'Node · React', url: 'https://be-erp.blazt.dev' },
    { name: 'Be Inventory', what: { en: 'Inventory', es: 'Inventario' }, tech: 'Laravel', url: 'https://inventory.blazt.dev' },
    { name: 'BeStore', what: { en: 'Storefront', es: 'Tienda en línea' }, tech: 'Laravel', url: 'https://bestore.blazt.dev' },
    { name: 'Ototo Raffles', what: { en: 'Raffles & payments', es: 'Rifas y pagos' }, tech: 'Laravel · Vue', url: 'https://mrwin.com.mx' },
    { name: 'Merkaz', what: { en: 'Marketplace', es: 'Marketplace' }, tech: 'Laravel', url: 'https://merkaz.mx' },
    { name: 'Kinor', what: { en: 'Platform', es: 'Plataforma' }, tech: 'Laravel · Vue', url: 'https://kinor.s2.devgeai.com' },
    { name: 'KosherBot 2.0', what: { en: 'Bot', es: 'Bot' }, tech: 'Laravel · Docker', url: 'https://kosherbot.overcloud.us' },
    { name: 'OneKosher', what: { en: 'Directory', es: 'Directorio' }, tech: 'Laravel', url: 'https://onekosher.overcloud.us' },
    { name: 'TailyHub API', what: { en: 'API', es: 'API' }, tech: 'TypeScript', url: 'https://tailyhub.overcloud.us' },
    { name: 'Pushka', what: { en: 'Donations', es: 'Donativos' }, tech: 'Laravel', url: 'https://pushka.overcloud.us' },
    { name: 'ChevraSMS', what: { en: 'SMS messaging', es: 'Mensajería SMS' }, tech: 'Laravel', url: 'https://chevrasms.overcloud.us' },
    { name: 'Overcloud CRM', what: { en: 'CRM with voice', es: 'CRM con voz' }, tech: 'Laravel' },
    { name: 'Cartise', what: { en: 'Commerce', es: 'Comercio' }, tech: 'Node', url: 'https://cartise.app' },
    { name: 'Taxonomy PoC', what: { en: 'Proof of concept', es: 'Prueba de concepto' }, tech: 'Java', url: 'https://taxonomy.blazt.dev' },
    { name: 'Parking Reserve', what: { en: 'Reservations', es: 'Reservaciones' }, tech: 'Java', url: 'https://parking.blazt.dev' },
    { name: 'Javerim', what: { en: 'Community', es: 'Comunidad' }, tech: 'Laravel' },
    { name: 'Keish Ejad', what: { en: 'Community', es: 'Comunidad' }, tech: 'PHP · Blade' },
    { name: 'Algoritmia', what: { en: 'Landing', es: 'Landing' }, tech: 'Web', url: 'https://algoritmia-trading.com' },
  ],
};

export const contact = {
  eyebrow: { en: 'Contact', es: 'Contacto' },
  heading: { en: 'Need someone to own the backend?', es: '¿Necesitas a alguien que se haga cargo del backend?' },
  text: {
    en: 'I’m open to senior backend and full-stack roles, remote or in Mexico City. Email is the fastest way to reach me.',
    es: 'Estoy abierto a roles senior de backend y full-stack, remotos o en Ciudad de México. El correo es la forma más rápida de contactarme.',
  },
  footer: { en: 'Mexico City', es: 'Ciudad de México' },
};
