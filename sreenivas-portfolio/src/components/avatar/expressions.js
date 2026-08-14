/**
 * Tuk's expression vocabulary.
 *
 * Three ORTHOGONAL axes — face, hands, head — composed rather than enumerated.
 * 12 x 8 x 6 = 576 readings from 26 definitions. Adding a face adds 48 readings.
 *
 * The backend never touches these. It triggers SCENES (semantic states); the
 * frontend owns how a state maps to face/hands/head. Keeping that boundary
 * means the model never has to know what a head motion is.
 */

/** Screen faces. Drawn in TukAvatar; this is the ordered list + labels. */
export const FACES = [
  'neutral',
  'happy',
  'wink',
  'surprise',
  'heart',
  'determined',
  'sad',
  'sleepy',
  'thinking',
  'listening',
  'loading',
  'error'
];

export const FACE_LABELS = {
  neutral: 'neutral',
  happy: '^_^',
  wink: '^_·',
  surprise: 'O_O',
  heart: '♥_♥',
  determined: '>_<',
  sad: 'sad',
  sleepy: 'zzz',
  thinking: '…',
  listening: 'listening',
  loading: 'working',
  error: 'X_X'
};

/**
 * Hand poses, in the SVG's own viewBox coordinates (60 x 67).
 *
 * `wag` drives the wave animation. It is applied to the INNER spin group, never
 * the outer position group — see avatar.css. A CSS animation overrides a
 * presentation attribute, so animating transform on the positioned element
 * throws the hand to the SVG origin.
 */
export const GESTURES = {
  rest:   { l: [12, 46], r: [48, 46], wag: false, armed: false },
  wave:   { l: [12, 46], r: [51, 22], wag: true,  armed: false },
  point:  { l: [13, 48], r: [56, 33], wag: false, armed: false },
  thumbs: { l: [12, 47], r: [44, 31], wag: false, armed: false },
  shrug:  { l: [7, 34],  r: [53, 34], wag: false, armed: false },
  chin:   { l: [12, 48], r: [36, 41], wag: false, armed: false },
  cheer:  { l: [11, 17], r: [49, 17], wag: false, armed: false },
  reach:  { l: [9, 30],  r: [51, 30], wag: false, armed: false },
  sword:  { l: [15, 51], r: [47, 33], wag: false, armed: true  }
};

export const HEADS = ['still', 'nod', 'shake', 'tilt', 'lean', 'perk'];

/**
 * Semantic states. THIS is the tool surface the agent gets — `setState('thinking')`,
 * not setFace() + setHands() separately.
 */
export const SCENES = {
  idle:      { gesture: 'rest',   face: 'neutral',    head: 'still' },
  greeting:  { gesture: 'wave',   face: 'happy',      head: 'nod'   },
  listening: { gesture: 'rest',   face: 'listening',  head: 'lean'  },
  thinking:  { gesture: 'chin',   face: 'thinking',   head: 'tilt'  },
  answering: { gesture: 'rest',   face: 'neutral',    head: 'nod'   },
  working:   { gesture: 'rest',   face: 'loading',    head: 'still' },
  navigating:{ gesture: 'point',  face: 'determined', head: 'lean'  },
  unsure:    { gesture: 'shrug',  face: 'sad',        head: 'shake' },
  delighted: { gesture: 'cheer',  face: 'heart',      head: 'perk'  },
  error:     { gesture: 'rest',   face: 'error',      head: 'shake' },
  asleep:    { gesture: 'rest',   face: 'sleepy',     head: 'still' }
};

export const SCENE_NAMES = Object.keys(SCENES);

/** Locomotion phases owned by useAvatarLife — not part of the scene vocabulary. */
export const PHASES = ['grounded', 'launch', 'airborne', 'landing'];
