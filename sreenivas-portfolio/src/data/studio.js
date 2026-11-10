/**
 * Pocket Studio: free tools that run entirely in the visitor's browser.
 *
 * It lives on this domain but is not part of the portfolio, so it has its own
 * header and footer (App.jsx). Everything sits under /studio/ so photo, video,
 * audio or PDF tools can join later without moving any URL:
 *
 *   /studio/                      home (for now, the photo picker)
 *   /studio/photo/<purpose>/      one page per photo purpose
 *
 * Copy lives here, not in the components, because scripts/prerender.mjs reads it
 * to write each page's crawlable HTML. Same **bold** / *italic* markup as the rest
 * of src/data.
 */

export const studio = {
  name: 'Pocket Studio',
  home: '/studio/',
  title: 'Photos for every application',
  lede: 'Passport size, stamp size, profile or any custom size. Free, no sign-up, and nothing leaves your device.',
  metaTitle: 'Pocket Studio: free passport size, stamp size and profile photos',
  metaDescription: 'Make passport size, stamp size, profile and custom size photos with your camera or an existing photo. Free, no sign-up, no watermark. Your photo never leaves your device.'
};

/**
 * Where the face should sit, as fractions of the photo's height: the crown line,
 * and the range the chin may land in. The passport-size numbers come from ICAO
 * 9303's 32–36 mm head height on a 45 mm photo; other portrait sizes scale them.
 */
const PORTRAIT_GUIDE = { kind: 'portrait', crown: 4 / 45, headMin: 32 / 45, headMax: 36 / 45 };
const CIRCLE_GUIDE = { kind: 'circle' };

export const photoPurposes = [
  {
    slug: 'passport-size',
    group: 'Applications and forms',
    name: 'Passport size photo',
    size: { width: 35, height: 45, unit: 'mm' },
    use: 'For applications, forms and ID cards.',
    guide: PORTRAIT_GUIDE,
    printable: true,
    metaTitle: 'Passport size photo maker, 35×45 mm, free · Pocket Studio',
    metaDescription: 'Make a 35×45 mm passport size photo for any application, form or ID card, with your camera or an existing photo. Free, no sign-up. Download it or a 4×6 print sheet. Your photo never leaves your device.'
  },
  {
    slug: 'stamp-size',
    group: 'Applications and forms',
    name: 'Stamp size photo',
    size: { width: 20, height: 25, unit: 'mm' },
    use: 'For forms with a small photo box.',
    guide: PORTRAIT_GUIDE,
    printable: true,
    metaTitle: 'Stamp size photo maker, 20×25 mm, free · Pocket Studio',
    metaDescription: 'Make a 20×25 mm stamp size photo with your camera or an existing photo. Free, no sign-up. Download it or a 4×6 print sheet of 18. Your photo never leaves your device.'
  },
  {
    slug: 'profile',
    group: 'Profiles',
    name: 'Profile photo',
    size: { width: 1080, height: 1080, unit: 'px' },
    use: 'Square, shown as a circle. Works on any app or site.',
    guide: CIRCLE_GUIDE,
    printable: false,
    metaTitle: 'Profile photo maker, square and circle, free · Pocket Studio',
    metaDescription: 'Make a sharp square profile photo for any app or site, previewed as the circle they show. Free, no sign-up. Your photo never leaves your device.'
  },
  {
    slug: 'custom',
    group: 'Applications and forms',
    name: 'Custom size',
    size: { width: 35, height: 45, unit: 'mm' },
    use: 'Any size in mm, inches or pixels, with an optional file size limit.',
    guide: PORTRAIT_GUIDE,
    printable: true,
    editable: true,
    metaTitle: 'Custom size photo maker, any mm, px or KB · Pocket Studio',
    metaDescription: 'Make a photo in exactly the size a form asks for: any width and height in mm, inches or pixels, under a file size limit in KB. Free, no sign-up. Your photo never leaves your device.'
  }
];

export const getPhotoPurpose = (slug) => photoPurposes.find((p) => p.slug === slug);

/** The print sheet: a standard 6 × 4 inch photo print, landscape. */
export const printSheet = {
  label: '4 × 6 inch print sheet',
  widthIn: 6,
  heightIn: 4,
  dpi: 300
};

export const camera = {
  permission: 'Pocket Studio needs your camera. Nothing is recorded or uploaded.',
  hint: 'Plain, light wall behind you. Face the light.',
  delays: [0, 3, 5, 10]
};

export const studioFaq = [
  {
    q: 'Is it free?',
    a: 'Yes. No sign-up, no watermark, no limit.'
  },
  {
    q: 'Is my photo uploaded?',
    a: 'No. Everything happens in your browser, and closing the tab discards it.'
  },
  {
    q: 'How do I get prints?',
    a: 'Download the print sheet and print it as a regular 4 × 6 inch photo at any photo shop. You get several photos for the price of one print.'
  }
];
