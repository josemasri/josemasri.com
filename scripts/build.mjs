// Genera index.html (en) y es/index.html (es) desde content/site.mjs.
// Sin dependencias: `node scripts/build.mjs`. El resultado es HTML estático que se commitea.
// El contenido es nuestro y puede llevar HTML en línea (<strong>), así que no se escapa.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, meta, ui, hero, experience, work, stack, openSource, archive, contact } from '../content/site.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const LANGS = {
  en: { dir: '', base: './', htmlLang: 'en', ogLocale: 'en_US', other: 'es', otherHref: './es/', otherLang: 'es-MX', otherLabel: 'ES' },
  es: { dir: 'es', base: '../', htmlLang: 'es-MX', ogLocale: 'es_MX', other: 'en', otherHref: '../', otherLang: 'en', otherLabel: 'EN' },
};

const pageUrl = (lang) => (lang === 'en' ? `${site.url}/` : `${site.url}/es/`);
const list = (items, fn) => items.map(fn).join('\n');
const chips = (items, cls = 'chip') => `<ul class="chips">${items.map((t) => `<li class="${cls}">${t}</li>`).join('')}</ul>`;
const ext = (href, body, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${href}" target="_blank" rel="noopener">${body}</a>`;
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';

function render(lang) {
  const L = LANGS[lang];
  const t = (v) => (v && typeof v === 'object' && lang in v ? v[lang] : v);
  const base = L.base;

  // ---------- Experiencia: trace waterfall ----------
  const years = [];
  for (let y = experience.axisStart; y <= Math.floor(site.now); y++) years.push(y);
  const roles = [...experience.roles].sort((a, b) => a.start - b.start);
  const totalYears = site.now - experience.axisStart;
  const totalLabel = `${Math.floor(totalYears)}y ${Math.round((totalYears % 1) * 12)}m`;

  const spans = list(roles, (r) => {
    const end = r.end ?? site.now;
    const period = `${r.start} – ${r.end ?? t(ui.present)}`;
    const kind = r.company === 'Freelance' ? 'span--parallel' : '';
    const live = r.end === null ? 'span--live' : '';
    return `
          <li>
            <details class="span ${kind} ${live}" style="--start:${r.start}; --end:${end}"${r.end === null ? ' open' : ''}${r.end === null ? ' data-live' : ''}>
              <summary class="span__row">
                <span class="span__label">
                  <span class="span__role">${r.role}</span>
                  <span class="span__co">${r.company} <span class="span__client">· ${t(r.client)}</span></span>
                </span>
                <span class="span__track" aria-hidden="true"><span class="span__bar"><span class="span__time">${period}</span></span></span>
                <span class="visually-hidden">${period}</span>
              </summary>
              <div class="span__detail">
                <ul class="span__points">
                  ${t(r.points).map((p) => `<li>${p}</li>`).join('\n                  ')}
                </ul>
                ${chips(r.stack)}
              </div>
            </details>
          </li>`;
  });

  // ---------- Proyectos ----------
  const statusBadge = (s) => `<span class="status status--${s}"><span class="status__dot" aria-hidden="true"></span>${t(ui.status[s])}</span>`;
  const flow = (nodes) =>
    `<ol class="flow" aria-label="${nodes.join(' → ')}">${nodes.map((n) => `<li>${n}</li>`).join('')}</ol>`;

  const projects = list(work.projects, (p) => `
        <article class="card project${p.size ? ` project--${p.size}` : ''}">
          <header class="project__head">
            <p class="project__domain">${t(p.domain)}${p.org ? ` <span class="project__org">· ${t(p.org)}</span>` : ''}</p>
            ${statusBadge(p.status)}
          </header>
          <h3 class="project__name">${p.url ? ext(p.url, `${p.name} ${arrow}`) : p.name}</h3>
          ${p.flow ? flow(p.flow) : ''}
          <p class="project__text">${t(p.text)}</p>
          ${chips(p.stack)}
        </article>`);

  // ---------- Stack ----------
  const groups = list(stack.groups, (g) => `
          <div class="stack__row">
            <dt>${t(g.label)}</dt>
            <dd><span class="stack__primary">${g.primary.join(', ')}</span><span class="stack__rest">${g.rest.join(', ')}</span></dd>
          </div>`);

  const connected = list(stack.connected, (c) => `
          <li class="link-row">
            <span class="link-row__pair"><span>${c.a}</span><span class="link-row__wire" aria-hidden="true"></span><span>${c.b}</span></span>
            <span class="link-row__note">${t(c.note)}</span>
          </li>`);

  // ---------- Open source / archivo ----------
  const oss = list(openSource.items, (o) => `
        <article class="card oss">
          <h3 class="oss__name">${ext(o.url, `${o.name} ${arrow}`)}</h3>
          <p class="oss__tech">${o.tech}</p>
          <p class="oss__text">${t(o.text)}</p>
        </article>`);

  const archiveItems = list(archive.items, (a) => {
    const inner = `<span class="log__name">${a.name}${a.url ? ` ${arrow}` : ''}</span><span class="log__what">${t(a.what)}</span><span class="log__tech">${a.tech}</span>`;
    return `          <li class="log__item">${a.url ? ext(a.url, inner, 'log__link') : `<span class="log__link">${inner}</span>`}</li>`;
  });

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'José Masri Salame',
    alternateName: site.name,
    jobTitle: 'Senior Backend Engineer',
    url: site.url,
    email: `mailto:${site.email}`,
    sameAs: [site.github],
    address: { '@type': 'PostalAddress', addressLocality: 'Mexico City', addressCountry: 'MX' },
    knowsAbout: ['Node.js', 'TypeScript', 'NestJS', 'Laravel', 'Java', 'Python', 'PostgreSQL', 'Kubernetes', 'API design', 'Systems integration'],
  });

  return `<!DOCTYPE html>
<!-- Generado por scripts/build.mjs desde content/site.mjs. No editar a mano. -->
<html lang="${L.htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${t(meta.title)}</title>
  <meta name="description" content="${t(meta.description)}" />
  <meta name="author" content="${site.name}" />
  <meta name="color-scheme" content="light dark" />
  <meta name="theme-color" content="#F3F4F1" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#0D1014" media="(prefers-color-scheme: dark)" />
  <link rel="canonical" href="${pageUrl(lang)}" />
  <link rel="alternate" hreflang="en" href="${pageUrl('en')}" />
  <link rel="alternate" hreflang="es-MX" href="${pageUrl('es')}" />
  <link rel="alternate" hreflang="x-default" href="${pageUrl('en')}" />
  <link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl(lang)}" />
  <meta property="og:title" content="${t(meta.title)}" />
  <meta property="og:description" content="${t(meta.ogDescription)}" />
  <meta property="og:locale" content="${L.ogLocale}" />
  <meta property="og:locale:alternate" content="${LANGS[L.other].ogLocale}" />
  <meta property="og:image" content="${site.url}/assets/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${t(meta.title)}" />
  <meta name="twitter:description" content="${t(meta.ogDescription)}" />
  <meta name="twitter:image" content="${site.url}/assets/og-image.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Geist:wght@400..600&family=Geist+Mono:wght@400..500&display=swap" />
  <link rel="stylesheet" href="${base}styles/site.css" />

  <!-- Aplica el tema guardado antes de pintar, para que no parpadee. -->
  <script>try{var s=localStorage.getItem('theme');if(s==='light'||s==='dark')document.documentElement.dataset.theme=s}catch(e){}</script>
  <script type="application/ld+json">${jsonLd}</script>
</head>

<body>
  <a class="skip-link" href="#content">${t(ui.skip)}</a>

  <header class="bar">
    <a class="bar__mark" href="#top" aria-label="${site.name}">jm<span class="bar__cursor" aria-hidden="true"></span></a>
    <nav class="bar__nav" aria-label="${lang === 'en' ? 'Sections' : 'Secciones'}">
      <a href="#experience">${t(ui.nav.experience)}</a>
      <a href="#work">${t(ui.nav.work)}</a>
      <a href="#stack">${t(ui.nav.stack)}</a>
      <a href="#contact">${t(ui.nav.contact)}</a>
    </nav>
    <div class="bar__actions">
      <a class="bar__btn" href="${L.otherHref}" hreflang="${L.otherLang}" lang="${L.otherLang}" title="${t(ui.langSwitch)}">${L.otherLabel}</a>
      <button class="bar__btn bar__theme" id="theme" type="button" aria-label="${t(ui.themeToggle)}" title="${t(ui.themeToggle)}">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg>
      </button>
    </div>
  </header>

  <main id="content">
    <section class="hero" id="top">
      <p class="hero__meta"><span class="status status--live"><span class="status__dot" aria-hidden="true"></span>${t(hero.location)}</span></p>
      <h1 class="hero__title">
        <span class="hero__name">${site.name} <span class="hero__role">Senior Backend Engineer</span></span>
        <span class="hero__thesis">${t(hero.thesis)}</span>
      </h1>
      <p class="hero__lede">${t(hero.lede)}</p>
      <div class="actions">
        <a class="btn btn--solid" href="${base}${site.cv}" download>${t(ui.downloadCv)}</a>
        <a class="btn" href="mailto:${site.email}">${t(ui.emailMe)}</a>
        ${ext(site.github, `GitHub ${arrow}`, 'btn btn--quiet')}
      </div>
    </section>

    <section class="section" id="experience" aria-labelledby="experience-h">
      <div class="section__head">
        <p class="eyebrow">${t(experience.eyebrow)}</p>
        <h2 class="section__title" id="experience-h">${t(experience.heading)}</h2>
        <p class="section__intro">${t(experience.intro)}</p>
      </div>

      <div class="trace" style="--axis-start:${experience.axisStart}; --axis-end:${site.now}">
        <div class="trace__meta" aria-hidden="true">
          <span>trace <b>josemasri.career</b></span>
          <span>${roles.length} spans</span>
          <span>${totalLabel}</span>
          <span class="trace__legend"><i class="key key--solid"></i>${lang === 'en' ? 'full-time' : 'tiempo completo'} <i class="key key--hatch"></i>${lang === 'en' ? 'in parallel' : 'en paralelo'}</span>
        </div>
        <div class="trace__axis" aria-hidden="true">
          <span class="trace__axis-spacer"></span>
          <span class="trace__ticks">${years.map((y) => `<span style="--y:${y}">’${String(y).slice(2)}</span>`).join('')}</span>
        </div>
        <ol class="trace__spans">${spans}
        </ol>
      </div>
      <p class="section__foot"><a class="text-link" href="${base}${site.cv}" download>${lang === 'en' ? 'Full history in the CV' : 'Historial completo en el CV'} <span aria-hidden="true">↓</span></a></p>
    </section>

    <section class="section" id="work" aria-labelledby="work-h">
      <div class="section__head">
        <p class="eyebrow">${t(work.eyebrow)}</p>
        <h2 class="section__title" id="work-h">${t(work.heading)}</h2>
        <p class="section__intro">${t(work.intro)}</p>
      </div>
      <div class="bento">${projects}
        <a class="card project project--more" href="#archive">
          <p class="project__domain">${t(archive.eyebrow)}</p>
          <p class="project__name">${lang === 'en' ? `${archive.items.length} more systems in production` : `${archive.items.length} sistemas más en producción`}&nbsp;<span aria-hidden="true">↓</span></p>
        </a>
      </div>
    </section>

    <section class="section" id="stack" aria-labelledby="stack-h">
      <div class="section__head">
        <p class="eyebrow">${t(stack.eyebrow)}</p>
        <h2 class="section__title" id="stack-h">${t(stack.heading)}</h2>
      </div>
      <div class="stack">
        <dl class="stack__groups">${groups}
        </dl>
        <div class="card links">
          <h3 class="links__title">${t(stack.connectedHeading)}</h3>
          <ul class="links__list">${connected}
          </ul>
        </div>
      </div>
    </section>

    <section class="section" id="open-source" aria-labelledby="oss-h">
      <div class="section__head">
        <p class="eyebrow">${t(openSource.eyebrow)}</p>
        <h2 class="section__title" id="oss-h">${t(openSource.heading)}</h2>
      </div>
      <div class="oss-grid">${oss}
      </div>
    </section>

    <section class="section" id="archive" aria-labelledby="archive-h">
      <div class="section__head">
        <p class="eyebrow">${t(archive.eyebrow)}</p>
        <h2 class="section__title" id="archive-h">${t(archive.heading)}</h2>
        <p class="section__intro">${t(archive.intro)}</p>
      </div>
      <ul class="log">
${archiveItems}
      </ul>
    </section>

    <section class="section contact" id="contact" aria-labelledby="contact-h">
      <p class="eyebrow">${t(contact.eyebrow)}</p>
      <h2 class="contact__title" id="contact-h">${t(contact.heading)}</h2>
      <p class="contact__text">${t(contact.text)}</p>
      <a class="contact__email" href="mailto:${site.email}">${site.email}</a>
      <div class="actions">
        <a class="btn btn--solid" href="${base}${site.cv}" download>${t(ui.downloadCv)}</a>
        ${ext(site.github, `GitHub ${arrow}`, 'btn')}
      </div>
    </section>
  </main>

  <footer class="footer">
    <span>© <span id="year">2026</span> ${site.name} · ${t(contact.footer)}</span>
    <a href="${L.otherHref}" hreflang="${L.otherLang}" lang="${L.otherLang}">${t(ui.langSwitch)}</a>
  </footer>

  <script src="${base}src/site.js" defer></script>
</body>
</html>
`;
}

for (const lang of Object.keys(LANGS)) {
  const out = join(root, LANGS[lang].dir, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(lang));
  console.log(`✓ ${lang} → ${out.replace(root + '/', '')}`);
}
