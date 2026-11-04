import React, { useId } from 'react';

/**
 * The guide drawn over the camera and the framer. Drawn in a 100-wide box at the
 * photo's own aspect ratio, so one drawing is right at any display size.
 *
 * - portrait: the crown line, an oval for the face, and a shaded band where the
 *   chin may land for the head height to be within the size's limits.
 * - circle: the circle a profile photo is shown in, with the corners dimmed, and
 *   a faint oval for the face.
 *
 * `status` colours it: 'idle' in the accent colour, and later 'good' (green) when
 * the face checks pass.
 */
const PhotoGuide = ({ guide, aspect, status = 'idle' }) => {
  const maskId = useId();
  const W = 100;
  const H = 100 * aspect;

  if (guide.kind === 'circle') {
    const r = Math.min(W, H) / 2;
    return (
      <svg className={`photo-guide is-${status}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <mask id={maskId}>
            <rect width={W} height={H} fill="white" />
            <circle cx={W / 2} cy={H / 2} r={r} fill="black" />
          </mask>
        </defs>
        <rect className="photo-guide-dim" width={W} height={H} mask={`url(#${maskId})`} />
        <circle className="photo-guide-line" cx={W / 2} cy={H / 2} r={r - 0.5} />
        <ellipse className="photo-guide-oval" cx={W / 2} cy={H * 0.46} rx={W * 0.2} ry={H * 0.27} />
      </svg>
    );
  }

  const crown = guide.crown * H;
  const mid = ((guide.headMin + guide.headMax) / 2) * H;
  return (
    <svg className={`photo-guide is-${status}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <rect className="photo-guide-band" x="0" y={crown + guide.headMin * H} width={W} height={(guide.headMax - guide.headMin) * H} />
      <ellipse className="photo-guide-oval" cx={W / 2} cy={crown + mid / 2} rx={mid * 0.37} ry={mid / 2} />
      <line className="photo-guide-line" x1="0" x2={W} y1={crown} y2={crown} />
      <line className="photo-guide-line" x1="0" x2={W} y1={crown + mid} y2={crown + mid} />
      <line className="photo-guide-axis" x1={W / 2} x2={W / 2} y1="0" y2={H} />
    </svg>
  );
};

export default PhotoGuide;
