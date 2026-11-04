import React from 'react';

/**
 * The face guide drawn over the camera and the framer, in the preset's own
 * millimetres, so one drawing is correct at any display size. The shaded band is
 * where the chin may land for the head height to be within the preset's limits.
 */
const PhotoGuide = ({ preset }) => {
  const { widthMm: w, heightMm: h, crownMm, head } = preset;
  const mid = (head.minMm + head.maxMm) / 2;
  const chin = crownMm + mid;
  const cy = crownMm + mid / 2;

  return (
    <svg className="photo-guide" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <rect
        className="photo-guide-band"
        x="0"
        y={crownMm + head.minMm}
        width={w}
        height={head.maxMm - head.minMm}
      />
      <ellipse className="photo-guide-oval" cx={w / 2} cy={cy} rx={mid * 0.37} ry={mid / 2} />
      <line className="photo-guide-line" x1="0" x2={w} y1={crownMm} y2={crownMm} />
      <line className="photo-guide-line" x1="0" x2={w} y1={chin} y2={chin} />
      <line className="photo-guide-axis" x1={w / 2} x2={w / 2} y1="0" y2={h} />
    </svg>
  );
};

export default PhotoGuide;
