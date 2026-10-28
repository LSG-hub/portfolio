/**
 * Page titles and descriptions, shared by the running app (usePageMeta) and the
 * build-time prerender (scripts/prerender.mjs), so a crawler reading the static
 * HTML and a visitor's browser tab always agree.
 *
 * Plain JavaScript with no imports: the prerender loads this file directly in
 * Node, outside webpack. Keep it that way.
 */

export const SITE_URL = 'https://sreenivasgurram.com';

/** Strip the **bold** / *italic* markup that utils/richText renders. */
export const plainText = (text = '') =>
  text.replace(/\*\*([^*]+?)\*\*|\*([^*]+?)\*/g, (_, bold, italic) => bold ?? italic);

/** Trim to a search-snippet length on a word boundary. */
const clip = (text, max = 158) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

export const homeMeta = (profile) => ({
  path: '/',
  title: `${profile.name} · ${profile.role}`,
  description: profile.summary
});

export const projectMeta = (project, profile) => ({
  path: `/projects/${project.slug}`,
  title: `${project.title}: ${project.subtitle} · ${profile.name}`,
  description: clip(plainText(project.description))
});

export const notFoundMeta = (profile) => ({
  path: '/404',
  title: `Page not found · ${profile.name}`,
  description: 'There is nothing at this address.'
});

export const tukMeta = (profile) => ({
  path: '/tuk',
  title: `Tuk, at home · ${profile.name}`,
  description:
    'Tuk is the small robot who lives on this site. Watch his five-minute day at home: he boils a kettle he has no use for, waters a plant, sweeps, watches television and goes back to bed.'
});
