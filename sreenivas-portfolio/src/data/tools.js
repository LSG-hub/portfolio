/**
 * Free tools that run entirely in the visitor's browser.
 *
 * Copy lives here, not in the components, for the same reason as the rest of
 * src/data: scripts/prerender.mjs reads it to write each tool's crawlable HTML,
 * and a tool page is only found through search if its text is in that HTML.
 * Same **bold** / *italic* markup as everywhere else.
 */

/**
 * Photo sizes. Millimetres are the source of truth; pixels are derived at 300 DPI,
 * the resolution print shops and most upload forms expect.
 *
 * `head` is the chin-to-crown height the guide aims for (ICAO 9303 gives 32–36 mm
 * for a 35×45 photo) and `crownMm` is the gap from the top edge to the crown.
 */
export const photoPresets = [
  {
    id: 'passport-35x45',
    label: 'Passport size',
    size: '35 × 45 mm',
    widthMm: 35,
    heightMm: 45,
    head: { minMm: 32, maxMm: 36 },
    crownMm: 4,
    use: 'The standard Indian passport-size photo, also used for visas, office and HR documents, bank and KYC forms, and ID cards.'
  }
];

/** The print sheet: a standard 6 × 4 inch photo print, landscape. */
export const printSheet = {
  label: '4 × 6 inch print sheet',
  widthIn: 6,
  heightIn: 4,
  dpi: 300
};

export const passportPhotoTool = {
  slug: 'passport-photo',
  name: 'Passport photo maker',
  eyebrow: 'Free tool · No login · No upload',
  title: 'Passport size photo maker',
  lede: 'Take a photo with your camera or upload one, frame it to the exact size, and download it along with a print-ready 4 × 6 inch sheet. **Your photo never leaves your device:** everything happens in your browser.',

  metaTitle: 'Passport size photo maker: free, no login, 35×45 mm',
  metaDescription: 'Make a 35×45 mm passport size photo from your phone or laptop camera, free and with no login. Download it with a 4×6 print sheet. Your photo never leaves your device.',

  steps: [
    '**Take or upload a photo.** Face a plain, light wall, look straight at the camera, and keep your expression neutral.',
    '**Frame it.** Drag and zoom until your face sits inside the oval: the top of your head on the upper line, your chin on the lower one.',
    '**Download.** Get the single photo for online forms, or the 4 × 6 inch sheet of 8 photos to print at any photo shop for a few rupees.'
  ],

  tips: [
    '**Light:** face a window or a lamp so your face is evenly lit, with no shadow on one side or behind you.',
    '**Background:** stand about an arm’s length from a plain white or light wall.',
    '**Pose:** shoulders straight, head level, eyes open, mouth closed.',
    '**Glasses and caps:** take them off if you can. Some visa rules, including the US, don’t allow glasses, and glare is a common reason photos get rejected.',
    '**Camera height:** hold the phone or set the laptop at eye level, not below your chin.'
  ],

  faq: [
    {
      q: 'Is it really free?',
      a: 'Yes. No login, no watermark, no limit on how many photos you make.'
    },
    {
      q: 'Is my photo uploaded anywhere?',
      a: 'No. The camera, the framing and the downloads all run in your browser. Nothing is sent to a server, and closing the tab discards everything.'
    },
    {
      q: 'How do I get printed copies?',
      a: 'Download the 4 × 6 inch sheet and print it at any photo shop as a standard 4 × 6 (also called 4R) print. It costs a few rupees and gives you 8 photos. Ask for it to be printed at 100%, not "fit to page".'
    },
    {
      q: 'Can I use this for my Indian passport application?',
      a: 'The Passport Seva Kendra takes your photo at the appointment, so the application itself usually needs none. Passport-size photos are still needed for visas, forms, ID cards and office documents, and that is what this is for.'
    },
    {
      q: 'What size and resolution is the photo?',
      a: '35 × 45 mm at 300 DPI, which is 413 × 531 pixels. Download it as JPG, JPEG, PNG or WebP; JPG and JPEG are the same file with a different extension, for forms that insist on one.'
    }
  ]
};

export const toolsData = [passportPhotoTool];
