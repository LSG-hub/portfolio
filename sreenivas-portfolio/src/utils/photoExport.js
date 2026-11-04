/**
 * Turning a framed photo into files: the single photo and the print sheet.
 *
 * Everything is a canvas in the visitor's browser. Nothing here touches the
 * network, which is the tool's whole promise.
 */

const MM_PER_INCH = 25.4;
export const DPI = 300;

export const mmToPx = (mm, dpi = DPI) => Math.round((mm / MM_PER_INCH) * dpi);

/**
 * The framing, in frame units: the frame is 1 wide and `aspect` (height / width)
 * tall. The image's centre sits at (cx, cy) and each image pixel is `scale`
 * frame-widths across. Keeping it resolution-free lets the on-screen frame and
 * the 300 DPI export share one description.
 */
export function drawFramed(ctx, image, framing, width, height, background = '#FFFFFF') {
  ctx.save();
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const w = image.width * framing.scale * width;
  const h = image.height * framing.scale * width;
  ctx.drawImage(image, framing.cx * width - w / 2, framing.cy * width - h / 2, w, h);
  ctx.restore();
}

/** The framing that just covers the frame with the image, centred. */
export function coverFraming(image, aspect) {
  const scale = Math.max(1 / image.width, aspect / image.height);
  return { scale, cx: 0.5, cy: aspect / 2 };
}

export function renderPhoto(image, framing, preset) {
  const canvas = document.createElement('canvas');
  canvas.width = mmToPx(preset.widthMm);
  canvas.height = mmToPx(preset.heightMm);
  drawFramed(canvas.getContext('2d'), image, framing, canvas.width, canvas.height);
  return canvas;
}

/**
 * As many photos as fit on the sheet at their true size, centred, with a thin
 * grey border on each to cut along. A 6 × 4 inch sheet holds 4 × 2 passport photos.
 */
export function sheetLayout(photoWidth, photoHeight, sheet) {
  const width = Math.round(sheet.widthIn * sheet.dpi);
  const height = Math.round(sheet.heightIn * sheet.dpi);
  const gap = mmToPx(3, sheet.dpi);
  const cols = Math.floor((width + gap) / (photoWidth + gap));
  const rows = Math.floor((height + gap) / (photoHeight + gap));
  return {
    width,
    height,
    gap,
    cols,
    rows,
    count: cols * rows,
    left: Math.round((width - (cols * photoWidth + (cols - 1) * gap)) / 2),
    top: Math.round((height - (rows * photoHeight + (rows - 1) * gap)) / 2)
  };
}

export function renderSheet(photo, sheet) {
  const { width, height, gap, cols, rows, left, top, count } = sheetLayout(photo.width, photo.height, sheet);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#C8C8C8';
  ctx.lineWidth = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = left + c * (photo.width + gap);
      const y = top + r * (photo.height + gap);
      ctx.drawImage(photo, x, y);
      ctx.strokeRect(x - 0.5, y - 0.5, photo.width + 1, photo.height + 1);
    }
  }
  return { canvas, count };
}

/**
 * Download formats. JPG and JPEG are the same file; both are offered because some
 * upload forms check the extension literally.
 */
export const FORMATS = [
  { id: 'jpg', label: 'JPG', mime: 'image/jpeg', ext: 'jpg' },
  { id: 'jpeg', label: 'JPEG', mime: 'image/jpeg', ext: 'jpeg' },
  { id: 'png', label: 'PNG', mime: 'image/png', ext: 'png' },
  { id: 'webp', label: 'WebP', mime: 'image/webp', ext: 'webp' }
];

/** Safari can't encode WebP from a canvas; it silently returns a PNG instead. */
export const canEncode = (mime) => {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  return c.toDataURL(mime).startsWith(`data:${mime}`);
};

/**
 * Write the DPI into the file, because browsers leave it at 72 (or unset) and a
 * printer or form that reads it would get the physical size wrong. The pixels
 * are already right either way. JPEG keeps it in the JFIF header, PNG in a pHYs
 * chunk; WebP has no standard field, so it is left alone.
 */
function jpegWithDpi(bytes, dpi) {
  const isJfif =
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff && bytes[3] === 0xe0 &&
    String.fromCharCode(...bytes.slice(6, 11)) === 'JFIF\0';
  if (!isJfif) return bytes;
  bytes[13] = 1; // units: dots per inch
  bytes[14] = dpi >> 8;
  bytes[15] = dpi & 0xff;
  bytes[16] = dpi >> 8;
  bytes[17] = dpi & 0xff;
  return bytes;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (bytes) => {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

function pngWithDpi(bytes, dpi) {
  // Signature (8) + IHDR (25); pHYs must come before the image data, right after IHDR.
  const at = 33;
  if (String.fromCharCode(...bytes.slice(12, 16)) !== 'IHDR') return bytes;
  const ppm = Math.round(dpi / 0.0254);
  const chunk = new Uint8Array(21);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  view.setUint32(8, ppm);
  view.setUint32(12, ppm);
  chunk[16] = 1; // unit: metre
  view.setUint32(17, crc32(chunk.subarray(4, 17)));
  const out = new Uint8Array(bytes.length + chunk.length);
  out.set(bytes.subarray(0, at));
  out.set(chunk, at);
  out.set(bytes.subarray(at), at + chunk.length);
  return out;
}

export async function encode(canvas, format, { quality = 0.95, dpi = DPI } = {}) {
  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode the image'))), format.mime, quality)
  );
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (format.mime === 'image/jpeg') return new Blob([jpegWithDpi(bytes, dpi)], { type: format.mime });
  if (format.mime === 'image/png') return new Blob([pngWithDpi(bytes, dpi)], { type: format.mime });
  return blob;
}

export function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment to start the download before the URL goes away.
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Decode a picked file, respecting the orientation a phone camera stored in it.
 * createImageBitmap needs no object URL, so no blob: source has to be allowed in
 * the page's Content-Security-Policy.
 */
export async function decodeFile(file) {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error(
      /heic|heif/i.test(file.type || file.name)
        ? 'This browser can’t open HEIC photos. On an iPhone, pick the photo in Safari, or set Camera → Formats to "Most Compatible".'
        : 'That file couldn’t be opened as an image. Try a JPEG or PNG.'
    );
  }
}
