/**
 * Live face checks: is the face the right size, centred, level and facing the
 * camera for the chosen photo?
 *
 * MediaPipe's Face Landmarker runs in the browser (WebAssembly). Its code comes
 * from jsDelivr and its model from Google's public model storage, pinned to one
 * version, so neither counts against this site's hosting quota. Only the
 * engine and the model are downloaded; the camera frames never leave the device.
 * firebase.json's CSP allows exactly these two locations plus WebAssembly.
 */

const VERSION = '1.2.2';
const BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION}`;
const MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

let fileset = null;
const instances = {};

/**
 * A landmarker per mode, created on first use; resolves to null if it can't load.
 * 'VIDEO' tracks a face from frame to frame, so the live camera and still photos
 * need separate instances: sharing one let a face from the camera appear as a
 * second face in an uploaded photo.
 */
export function loadFaceLandmarker(mode = 'VIDEO') {
  if (!instances[mode]) {
    instances[mode] = (async () => {
      if (!fileset) {
        fileset = (async () => {
          const vision = await import(/* webpackIgnore: true */ `${BASE}/vision_bundle.mjs`);
          return { vision, files: await vision.FilesetResolver.forVisionTasks(`${BASE}/wasm`) };
        })();
      }
      const { vision, files } = await fileset;
      const options = (delegate) => ({
        baseOptions: { modelAssetPath: MODEL, delegate },
        runningMode: mode,
        numFaces: 2
      });
      try {
        return await vision.FaceLandmarker.createFromOptions(files, options('GPU'));
      } catch {
        return vision.FaceLandmarker.createFromOptions(files, options('CPU'));
      }
    })().catch(() => null);
  }
  return instances[mode];
}

// Face mesh landmark indices.
const FOREHEAD = 10;
const CHIN = 152;
const LEFT_CHEEK = 234;
const RIGHT_CHEEK = 454;
const LEFT_EYE = 33;
const RIGHT_EYE = 263;
const NOSE = 1;

/**
 * The mesh stops at the upper forehead; the top of the head (the crown, which
 * passport-size rules measure to) is well above it, hair included. Measured on
 * real photos, it sits about 0.45 of a forehead-to-chin height above. An
 * estimate: once person segmentation is in (for backgrounds), measure the real
 * top of the hair instead.
 */
const CROWN_ABOVE_FOREHEAD = 0.45;

/** Where the face should be, as fractions of the photo's height, from the guide. */
export function targetFor(guide) {
  if (guide.kind === 'circle') return { crown: 0.19, headMin: 0.48, headMax: 0.62 };
  return { crown: guide.crown, headMin: guide.headMin, headMax: guide.headMax };
}

/**
 * Judge one detection. `faces` are landmark lists already mapped to the photo:
 * x as a fraction of its width (as the visitor sees it), y of its height.
 * Returns one code, the most important thing to fix first.
 */
export function assess(faces, guide, aspect) {
  if (!faces || faces.length === 0) return 'none';
  if (faces.length > 1) return 'many';
  const p = faces[0];
  const t = targetFor(guide);

  const faceH = p[CHIN].y - p[FOREHEAD].y;
  const crown = p[FOREHEAD].y - CROWN_ABOVE_FOREHEAD * faceH;
  const head = p[CHIN].y - crown;
  if (head < t.headMin - 0.02) return 'closer';
  if (head > t.headMax + 0.02) return 'farther';

  const cx = (p[LEFT_CHEEK].x + p[RIGHT_CHEEK].x) / 2;
  if (cx > 0.55) return 'left';
  if (cx < 0.45) return 'right';
  if (crown > t.crown + 0.035) return 'up';
  if (crown < t.crown - 0.035) return 'down';

  // Tilt from the eye line, in real proportions (x is a fraction of width, y of height).
  const dy = (p[RIGHT_EYE].y - p[LEFT_EYE].y) * aspect;
  const dx = p[RIGHT_EYE].x - p[LEFT_EYE].x;
  if ((Math.atan(Math.abs(dy / dx)) * 180) / Math.PI > 6) return 'tilt';

  const width = Math.abs(p[RIGHT_CHEEK].x - p[LEFT_CHEEK].x);
  if (Math.abs(p[NOSE].x - cx) / width > 0.1) return 'turn';
  return 'good';
}

/**
 * Hold a code until it has been seen twice in a row, so the message doesn't
 * flicker between two states on every frame.
 */
export function steady() {
  let shown = 'loading';
  let candidate = null;
  return (code) => {
    if (code === shown) {
      candidate = null;
    } else if (code === candidate) {
      shown = code;
      candidate = null;
    } else {
      candidate = code;
    }
    return shown;
  };
}

/** What to say for each code: live, the person moves; on a photo, they drag and zoom it. */
export const MESSAGES = {
  live: {
    loading: 'Getting the face guide ready…',
    none: 'Look at the camera, with your face inside the oval.',
    many: 'Only one person in the photo, please.',
    closer: 'Move a little closer.',
    farther: 'Move back a little.',
    left: 'Move a little to your left.',
    right: 'Move a little to your right.',
    up: 'Move up a little, or lower the camera.',
    down: 'Move down a little, or raise the camera.',
    tilt: 'Keep your head straight.',
    turn: 'Look straight at the camera.',
    good: 'Looks good. Take the photo.'
  },
  photo: {
    loading: 'Checking the photo…',
    none: 'No face found. Try another photo.',
    many: 'There is more than one face in this photo.',
    closer: 'Zoom in a little.',
    farther: 'Zoom out a little.',
    left: 'Drag the photo left.',
    right: 'Drag the photo right.',
    up: 'Drag the photo up.',
    down: 'Drag the photo down.',
    tilt: 'The head is tilted. A straighter photo works better.',
    turn: 'The face is turned. A photo looking straight ahead works better.',
    good: 'Looks good.'
  }
};
