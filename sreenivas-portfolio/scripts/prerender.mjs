/**
 * Build-time prerender: gives every route real, readable HTML.
 *
 * ── Why ─────────────────────────────────────────────────────────────────
 * This is a client-rendered React app, so the HTML it ships is an empty
 * <div id="root">. Google runs the JavaScript eventually; most AI crawlers
 * (GPTBot, ClaudeBot, PerplexityBot) do not, and saw only "You need to enable
 * JavaScript to run this app." Every route also shared one <title>.
 *
 * ── What it does ────────────────────────────────────────────────────────
 * Runs after `react-scripts build`. For each route it takes build/index.html
 * (which carries the hashed JS/CSS tags), rewrites the head with that page's
 * title, description, canonical URL and social tags, and fills #root with the
 * page's content as plain semantic HTML. Output, served by Firebase's cleanUrls:
 *
 *   build/index.html               → /
 *   build/projects/<slug>.html     → /projects/<slug>
 *   build/tuk.html                 → /tuk
 *   build/404.html                 → any other URL, with a real 404 status
 *
 * It also writes the files crawlers and AI agents look for, from the same data:
 *
 *   build/sitemap.xml      every indexable page
 *   build/llms.txt         a short Markdown index for LLMs (llmstxt.org)
 *   build/llms-full.txt    the whole site's content as one Markdown file
 *
 * ── Why it doesn't flash ────────────────────────────────────────────────
 * The snapshot sits in a `.prerender` wrapper that an inline script in
 * index.html hides as soon as the page starts, before first paint. React's
 * createRoot then replaces it with the real UI. Crawlers that don't run
 * scripts read the snapshot; browsers never show it. It is generated from the
 * same src/data files the components render, so the two can't drift.
 *
 * No dependencies and no headless browser, so CI stays fast. The data files are
 * plain ES modules with no imports; they are copied to .mjs so Node loads them
 * as modules regardless of package.json's module type.
 */

import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = join(ROOT, 'build');

/** Load src modules as ESM from a temp dir (they are .js without "type": "module"). */
async function loadSources(files) {
  const dir = await mkdtemp(join(tmpdir(), 'prerender-'));
  const out = {};
  try {
    for (const [name, rel] of Object.entries(files)) {
      const target = join(dir, `${name}.mjs`);
      await copyFile(join(ROOT, rel), target);
      out[name] = await import(pathToFileURL(target).href);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
  return out;
}

const { profile: profileMod, experience, projects, skills, seo } = await loadSources({
  profile: 'src/data/profile.js',
  experience: 'src/data/experience.js',
  projects: 'src/data/projects.js',
  skills: 'src/data/skills.js',
  seo: 'src/utils/seo.js'
});

const { profile } = profileMod;
const { experienceData, educationData, achievementsData } = experience;
const { projectsData } = projects;
const { skillsData, skillsIntro, languages } = skills;
const { SITE_URL, homeMeta, projectMeta, tukMeta, notFoundMeta, plainText } = seo;

// ── HTML helpers ───────────────────────────────────────────────────────

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Same grammar as src/utils/richText.jsx, emitted as HTML. */
const rich = (text = '') =>
  esc(text).replace(/\*\*([^*]+?)\*\*|\*([^*]+?)\*/g, (_, b, i) =>
    b !== undefined ? `<strong>${b}</strong>` : `<em>${i}</em>`
  );

const list = (items, fn = rich) => `<ul>${items.map((x) => `<li>${fn(x)}</li>`).join('')}</ul>`;

const formatLabel = (key) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();

// ── Page bodies ────────────────────────────────────────────────────────

const header = () => `
<header>
  <h1>${esc(profile.name)}</h1>
  <p><em>${esc(profile.role)}</em> · ${esc(profile.focus)}</p>
  <p>${rich(profile.bio)}</p>
  <ul>${profile.facts.map((f) => `<li><strong>${esc(f.label)}:</strong> ${esc(f.value)}</li>`).join('')}</ul>
</header>`;

const experienceSection = () => `
<section id="experience">
  <h2>Experience</h2>
  ${experienceData
    .map(
      (job) => `
  <article>
    <h3>${esc(job.title)}, ${esc(job.company)}</h3>
    <p>${esc(job.location)} · ${esc(job.duration)} · ${esc(job.type)}</p>
    <p>${rich(job.description)}</p>
    ${list(job.achievements)}
    <p><strong>Stack:</strong> ${esc(job.technologies.join(', '))}</p>
  </article>`
    )
    .join('')}
  <h3>Education</h3>
  ${educationData
    .map(
      (ed) => `
  <article>
    <h4>${esc(ed.degree)}, ${esc(ed.institution)}</h4>
    <p>${esc(ed.location)} · ${esc(ed.duration)} · CGPA ${esc(ed.cgpa)}</p>
  </article>`
    )
    .join('')}
</section>`;

const projectsSection = () => `
<section id="projects">
  <h2>Projects</h2>
  ${projectsData
    .map(
      (p) => `
  <article>
    <h3><a href="/projects/${esc(p.slug)}">${esc(p.title)}: ${esc(p.subtitle)}</a></h3>
    <p>${esc(p.tagline)}</p>
    <p>${rich(p.description)}</p>
  </article>`
    )
    .join('')}
</section>`;

const achievementsSection = () => `
<section id="achievements">
  <h2>Achievements</h2>
  ${achievementsData
    .map(
      (a) => `
  <article>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.issuer)} · ${esc(a.date)}</p>
    <p>${rich(a.description)}</p>
    ${a.link ? `<p><a href="${esc(a.link.url)}">${esc(a.link.label)}</a></p>` : ''}
  </article>`
    )
    .join('')}
</section>`;

const skillsSection = () => `
<section id="skills">
  <h2>Skills</h2>
  <p>${rich(skillsIntro)}</p>
  <dl>
    ${Object.values(skillsData)
      .map((g) => `<dt>${esc(g.title)}</dt><dd>${esc(g.skills.join(', '))}</dd>`)
      .join('')}
    <dt>Spoken languages</dt>
    <dd>${esc(languages.map((l) => `${l.name} (${l.level})`).join(', '))}</dd>
  </dl>
</section>`;

const contactSection = () => `
<section id="contact">
  <h2>Contact</h2>
  <p>${rich(profile.contactIntro)}</p>
  <p>Email: <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a> · Based in ${esc(profile.location)}</p>
  <ul>${profile.socials.map((s) => `<li><a href="${esc(s.url)}">${esc(s.label)}</a></li>`).join('')}</ul>
</section>`;

const homeBody = () =>
  [
    header(),
    '<main>',
    experienceSection(),
    projectsSection(),
    achievementsSection(),
    skillsSection(),
    contactSection(),
    '</main>',
    `<footer><p>Also on this site: <a href="/tuk">Tuk, at home</a>.</p></footer>`
  ].join('\n');

const projectBody = (p) => `
<nav><a href="/">${esc(profile.name)}</a></nav>
<main>
  <article>
    <header>
      <p>${esc(p.tagline)}</p>
      <h1>${esc(p.title)}</h1>
      <p>${esc(p.subtitle)}</p>
    </header>
    <p>${rich(p.description)}</p>
    <h2>Overview</h2>
    <p>${rich(p.detailedDescription)}</p>
    <h2>What I built</h2>
    ${list(p.features)}
    <h2>Highlights</h2>
    <dl>${Object.entries(p.metrics)
      .map(([k, v]) => `<dt>${esc(formatLabel(k))}</dt><dd>${esc(v)}</dd>`)
      .join('')}</dl>
    <h2>Stack</h2>
    <p>${esc(p.technologies.join(', '))}</p>
    ${p.paper ? `<p><a href="${esc(p.paper.url)}">Read the published paper: ${esc(p.paper.title)}</a> (${esc(p.paper.venue)}, pp. ${esc(p.paper.pages)})</p>` : ''}
    ${p.demo ? `<p><a href="${esc(p.demo)}">Watch the demo</a></p>` : ''}
    ${p.github ? `<p><a href="${esc(p.github)}">Source on GitHub</a></p>` : ''}
  </article>
</main>
<footer><p>Built by <a href="/">${esc(profile.name)}</a>, ${esc(profile.role)}.</p></footer>`;

const notFoundBody = () => `
<nav><a href="/">${esc(profile.name)}</a></nav>
<main>
  <h1>Page not found</h1>
  <p>There is nothing at this address. It may have moved, or the link may be mistyped.</p>
  <ul>
    <li><a href="/">Back to the portfolio</a></li>
    ${projectsData.map((p) => `<li><a href="/projects/${esc(p.slug)}">${esc(p.title)}: ${esc(p.subtitle)}</a></li>`).join('')}
  </ul>
</main>`;

const tukBody = (meta) => `
<nav><a href="/">${esc(profile.name)}</a></nav>
<main>
  <h1>Tuk, at home</h1>
  <p>${esc(meta.description)}</p>
</main>`;

// ── Structured data (schema.org JSON-LD) ───────────────────────────────
// One graph per page. Every page carries the WebSite and Person nodes so the
// project pages can credit their author by @id. `sameAs` is what lets search
// engines and AI systems tie LinkedIn, GitHub and X to this one person.

const ID = {
  website: `${SITE_URL}/#website`,
  person: `${SITE_URL}/#person`
};

const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': ID.website,
  url: `${SITE_URL}/`,
  name: profile.name,
  inLanguage: 'en',
  publisher: { '@id': ID.person }
});

const personNode = () => ({
  '@type': 'Person',
  '@id': ID.person,
  name: profile.name,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}${profile.photo}`,
  jobTitle: profile.role,
  description: profile.summary,
  email: `mailto:${profile.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Bangalore', addressCountry: 'IN' },
  worksFor: { '@type': 'Organization', name: profile.employer.name, url: profile.employer.url },
  alumniOf: educationData.map((ed) => ({ '@type': 'CollegeOrUniversity', name: ed.institution })),
  // Only real awards: a publication in this list would be read literally as one.
  award: achievementsData.filter((a) => a.kind === 'award').map((a) => a.title),
  knowsAbout: profile.knowsAbout,
  sameAs: profile.sameAs
});

const breadcrumb = (url, name) => ({
  '@type': 'BreadcrumbList',
  '@id': `${url}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: profile.name, item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name, item: url }
  ]
});

/** A published paper, so search engines and AI systems can verify the publication itself. */
const paperNode = (p) => ({
  '@type': 'ScholarlyArticle',
  '@id': `${p.paper.url}#article`,
  headline: p.paper.title,
  url: p.paper.url,
  datePublished: p.paper.published,
  pagination: p.paper.pages,
  isPartOf: { '@type': 'Periodical', name: p.paper.venue },
  author: p.paper.authors.map((name) => (name === profile.name ? { '@id': ID.person } : { '@type': 'Person', name })),
  about: { '@id': `${SITE_URL}/projects/${p.slug}#work` }
});
const papers = () => projectsData.filter((p) => p.paper).map(paperNode);

const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': [websiteNode(), personNode(), ...nodes] });

const homeGraph = (meta) =>
  graph({
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#profilepage`,
    url: `${SITE_URL}/`,
    name: meta.title,
    isPartOf: { '@id': ID.website },
    mainEntity: { '@id': ID.person }
  }, ...papers());

const projectGraph = (p, meta) => {
  const url = `${SITE_URL}${meta.path}`;
  return graph(
    {
      '@type': 'CreativeWork',
      '@id': `${url}#work`,
      name: p.title,
      alternativeHeadline: p.subtitle,
      description: plainText(p.detailedDescription || p.description),
      url,
      ...(p.image && { image: `${SITE_URL}${p.image}` }),
      genre: p.category,
      keywords: p.technologies.join(', '),
      author: { '@id': ID.person },
      creator: { '@id': ID.person },
      ...(p.paper && { subjectOf: { '@id': `${p.paper.url}#article` } })
    },
    ...(p.paper ? [paperNode(p)] : []),
    {
      '@type': 'WebPage',
      '@id': url,
      url,
      name: meta.title,
      isPartOf: { '@id': ID.website },
      mainEntity: { '@id': `${url}#work` },
      breadcrumb: { '@id': `${url}#breadcrumb` }
    },
    breadcrumb(url, p.title)
  );
};

const tukGraph = (meta) => {
  const url = `${SITE_URL}${meta.path}`;
  return graph(
    { '@type': 'WebPage', '@id': url, url, name: meta.title, description: meta.description, isPartOf: { '@id': ID.website }, breadcrumb: { '@id': `${url}#breadcrumb` } },
    breadcrumb(url, 'Tuk, at home')
  );
};

// ── Head rewriting ─────────────────────────────────────────────────────

/** Replace the content of a meta tag, failing loudly if the template changed. */
function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`prerender: <meta ${attr}="${key}"> not found in build/index.html`);
  return html.replace(re, `$1${esc(value)}$2`);
}

function render(template, meta, body, { noindex = false, image = null, jsonLd = null } = {}) {
  const url = `${SITE_URL}${meta.path === '/' ? '/' : meta.path}`;
  let html = template;
  if (noindex) html = html.replace('</head>', '<meta name="robots" content="noindex"></head>');
  if (jsonLd) {
    // `<` escaped so no string in the data can close the script tag early.
    const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
    html = html.replace('</head>', `<script type="application/ld+json">${json}</script></head>`);
  }
  if (image) {
    // A page's own photo replaces the default card. Its pixel size is unknown
    // here, so drop the card's 1200x630 hints rather than state wrong ones.
    html = setMeta(html, 'property', 'og:image', image.url);
    html = setMeta(html, 'property', 'og:image:alt', image.alt);
    html = setMeta(html, 'name', 'twitter:image', image.url);
    html = setMeta(html, 'name', 'twitter:image:alt', image.alt);
    html = html.replace(/<meta property="og:image:(width|height)" content="[^"]*"\s*\/?>/g, '');
  }
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  html = setMeta(html, 'name', 'description', meta.description);
  html = setMeta(html, 'property', 'og:title', meta.title);
  html = setMeta(html, 'property', 'og:description', meta.description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'name', 'twitter:title', meta.title);
  html = setMeta(html, 'name', 'twitter:description', meta.description);
  const canonical = /(<link rel="canonical" href=")[^"]*(")/;
  if (!canonical.test(html)) throw new Error('prerender: <link rel="canonical"> not found in build/index.html');
  html = html.replace(canonical, `$1${url}$2`);
  if (!html.includes('<div id="root"></div>')) throw new Error('prerender: empty #root not found');
  return html.replace('<div id="root"></div>', `<div id="root"><div class="prerender">${body}</div></div>`);
}

// ── Markdown for LLMs ──────────────────────────────────────────────────
// The data's **bold** / *italic* markup is already Markdown, so prose passes
// through untouched.

const mdHome = () =>
  [
    `# ${profile.name}`,
    `> ${profile.summary}`,
    `**${profile.role}** · ${profile.focus}`,
    profile.bio,
    profile.facts.map((f) => `- **${f.label}:** ${f.value}`).join('\n'),
    '## Experience',
    ...experienceData.map((job) =>
      [
        `### ${job.title}, ${job.company}`,
        `${job.location} · ${job.duration} · ${job.type}`,
        job.description,
        job.achievements.map((a) => `- ${a}`).join('\n'),
        `Stack: ${job.technologies.join(', ')}`
      ].join('\n\n')
    ),
    '## Education',
    ...educationData.map((ed) => `### ${ed.degree}, ${ed.institution}\n\n${ed.location} · ${ed.duration} · CGPA ${ed.cgpa}`),
    '## Achievements',
    ...achievementsData.map((a) => `### ${a.title}\n\n${a.issuer} · ${a.date}\n\n${a.description}${a.link ? `\n\n${a.link.label}: ${a.link.url}` : ''}`),
    '## Skills',
    skillsIntro,
    Object.values(skillsData).map((g) => `- **${g.title}:** ${g.skills.join(', ')}`).join('\n'),
    `- **Spoken languages:** ${languages.map((l) => `${l.name} (${l.level})`).join(', ')}`,
    '## Contact',
    profile.contactIntro,
    [`- Email: ${profile.email}`, `- Based in: ${profile.location}`, ...profile.socials.map((s) => `- ${s.label}: ${s.url}`)].join('\n')
  ].join('\n\n');

const mdProject = (p) =>
  [
    `## Project: ${p.title}, ${p.subtitle}`,
    `URL: ${SITE_URL}/projects/${p.slug}`,
    p.tagline,
    p.description,
    '### Overview',
    p.detailedDescription,
    '### What I built',
    p.features.map((f) => `- ${f}`).join('\n'),
    '### Highlights',
    Object.entries(p.metrics).map(([k, v]) => `- **${formatLabel(k)}:** ${v}`).join('\n'),
    `### Stack\n\n${p.technologies.join(', ')}`,
    [p.paper && `Published paper: ${p.paper.url}`, p.demo && `Demo: ${p.demo}`, p.github && `Source: ${p.github}`].filter(Boolean).join('\n')
  ]
    .filter(Boolean)
    .join('\n\n');

const llmsTxt = () =>
  [
    `# ${profile.name}`,
    `> ${profile.summary}`,
    `This site is the portfolio of ${profile.name}, ${profile.role} based in ${profile.location}. ` +
      `Everything on it is also available as one Markdown file: ${SITE_URL}/llms-full.txt`,
    '## Pages',
    [
      `- [Home](${SITE_URL}/): experience, projects, achievements, skills and contact`,
      ...projectsData.map((p) => `- [${p.title}](${SITE_URL}/projects/${p.slug}): ${p.subtitle}. ${p.tagline}`),
      `- [Tuk, at home](${SITE_URL}/tuk): ${tukMeta(profile).description}`
    ].join('\n'),
    '## Full content',
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): the whole site as Markdown`,
    '## Contact',
    [`- Email: ${profile.email}`, ...profile.socials.map((s) => `- [${s.label}](${s.url})`)].join('\n')
  ].join('\n\n') + '\n';

const llmsFullTxt = () => [mdHome(), ...projectsData.map(mdProject)].join('\n\n') + '\n';

// ── Write ──────────────────────────────────────────────────────────────

const template = await readFile(join(BUILD, 'index.html'), 'utf8');

const pages = [
  { file: 'index.html', meta: homeMeta(profile), body: homeBody(), jsonLd: homeGraph(homeMeta(profile)) },
  { file: 'tuk.html', meta: tukMeta(profile), body: null, jsonLd: tukGraph(tukMeta(profile)) },
  ...projectsData.map((p) => ({
    file: `projects/${p.slug}.html`,
    meta: projectMeta(p, profile),
    body: projectBody(p),
    jsonLd: projectGraph(p, projectMeta(p, profile)),
    image: p.image ? { url: `${SITE_URL}${p.image}`, alt: p.imageAlt } : null
  }))
];

for (const page of pages) {
  const body = page.body ?? tukBody(page.meta);
  const target = join(BUILD, page.file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, render(template, page.meta, body, { jsonLd: page.jsonLd, image: page.image }));
  console.log(`prerender: ${page.meta.path.padEnd(18)} → build/${page.file}`);
}

// Served by Firebase with a 404 status for any URL that matches no file or rewrite.
await writeFile(join(BUILD, '404.html'), render(template, notFoundMeta(profile), notFoundBody(), { noindex: true }));
console.log('prerender: (not found)          → build/404.html');

const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map(
    ({ meta }) =>
      `  <url><loc>${SITE_URL}${meta.path}</loc><lastmod>${today}</lastmod><priority>${
        meta.path === '/' ? '1.0' : '0.8'
      }</priority></url>`
  ),
  '</urlset>',
  ''
].join('\n');
await writeFile(join(BUILD, 'sitemap.xml'), sitemap);
await writeFile(join(BUILD, 'llms.txt'), llmsTxt());
await writeFile(join(BUILD, 'llms-full.txt'), llmsFullTxt());
console.log('prerender: sitemap.xml, llms.txt, llms-full.txt');
