import React from 'react';
import { GESTURES } from './expressions';
import '../../styles/components/avatar.css';

/**
 * Tuk — the portfolio avatar. Purely presentational: it renders whatever
 * face / gesture / head it is handed. Locomotion lives in useAvatarLife.
 *
 * ── The layer rule (do not break this) ──────────────────────────────────
 * Each hand is TWO nested groups:
 *   .tuk-hand-pos   outer — carries position, animated by CSS *transition*
 *   .tuk-hand-spin  inner — carries local motion, animated by CSS *animation*
 * A CSS animation overrides a presentation attribute, so putting both on one
 * element makes the hand snap to the SVG origin the moment it waves. Any prop
 * or limb added later follows the same split.
 */

const VIEW = { w: 60, h: 67 };

const Face = ({ name }) => {
  switch (name) {
    case 'happy':
      return (
        <g>
          <path className="tuk-glyph-line" d="M18.5 28.5 L22 24.5 L25.5 28.5" />
          <path className="tuk-glyph-line" d="M34.5 28.5 L38 24.5 L41.5 28.5" />
          <path className="tuk-thin" d="M25 34 Q30 38.4 35 34" />
        </g>
      );
    case 'wink':
      return (
        <g>
          <path className="tuk-glyph-line" d="M18.5 28 L22 24 L25.5 28" />
          <circle className="tuk-glyph" cx="38" cy="27" r="3.3" />
          <path className="tuk-thin" d="M25 34.5 Q30 38 35 34.5" />
        </g>
      );
    case 'surprise':
      return (
        <g>
          <circle className="tuk-glyph" cx="22" cy="27" r="4.5" />
          <circle className="tuk-glyph" cx="38" cy="27" r="4.5" />
          <circle className="tuk-thin" cx="30" cy="36" r="2.2" />
        </g>
      );
    case 'heart':
      return (
        <g>
          <path className="tuk-glyph-accent" d="M22 30.5 C17 26.5 17.5 23 20 23 C21.3 23 22 24 22 24 C22 24 22.7 23 24 23 C26.5 23 27 26.5 22 30.5 Z" />
          <path className="tuk-glyph-accent" d="M38 30.5 C33 26.5 33.5 23 36 23 C37.3 23 38 24 38 24 C38 24 38.7 23 40 23 C42.5 23 43 26.5 38 30.5 Z" />
          <path className="tuk-thin" d="M26 35.5 Q30 38.6 34 35.5" />
        </g>
      );
    case 'determined':
      return (
        <g>
          <path className="tuk-glyph-line" d="M18 24 L25.5 26.8" />
          <path className="tuk-glyph-line" d="M42 24 L34.5 26.8" />
          <circle className="tuk-glyph" cx="22" cy="30" r="2.6" />
          <circle className="tuk-glyph" cx="38" cy="30" r="2.6" />
          <path className="tuk-thin" d="M25.5 36 L34.5 36" />
        </g>
      );
    case 'sad':
      return (
        <g>
          <path className="tuk-glyph-line" d="M18 27 L25 24.5" />
          <path className="tuk-glyph-line" d="M42 27 L35 24.5" />
          <circle className="tuk-glyph" cx="22" cy="30" r="2.8" />
          <circle className="tuk-glyph" cx="38" cy="30" r="2.8" />
          <path className="tuk-thin" d="M26 37 Q30 34.4 34 37" />
        </g>
      );
    case 'sleepy':
      return (
        <g>
          <path className="tuk-glyph-line" d="M18.5 27 L25.5 27" />
          <path className="tuk-glyph-line" d="M34.5 27 L41.5 27" />
          <path className="tuk-thin" d="M27 35.5 L33 35.5" />
        </g>
      );
    case 'thinking':
      return (
        <g>
          <circle className="tuk-glyph" cx="22" cy="26" r="3" />
          <circle className="tuk-glyph" cx="38" cy="26" r="3" />
          <circle className="tuk-glyph tuk-dot-1" cx="25" cy="36" r="1.3" />
          <circle className="tuk-glyph tuk-dot-2" cx="30" cy="36" r="1.3" />
          <circle className="tuk-glyph tuk-dot-3" cx="35" cy="36" r="1.3" />
        </g>
      );
    case 'listening':
      return (
        <g>
          <circle className="tuk-glyph" cx="22" cy="26" r="3" />
          <circle className="tuk-glyph" cx="38" cy="26" r="3" />
          <g className="tuk-bars">
            <rect className="tuk-glyph-accent" x="25.2" y="32" width="2.2" height="7" rx="1" />
            <rect className="tuk-glyph-accent" x="28.9" y="32" width="2.2" height="7" rx="1" />
            <rect className="tuk-glyph-accent" x="32.6" y="32" width="2.2" height="7" rx="1" />
          </g>
        </g>
      );
    case 'loading':
      return (
        <g className="tuk-spinner">
          <path className="tuk-glyph-line tuk-spin-stroke" d="M30 22 A7 7 0 1 1 24.2 33.2" />
        </g>
      );
    case 'error':
      return (
        <g>
          <path className="tuk-glyph-line" d="M19 24 L25 30 M25 24 L19 30" />
          <path className="tuk-glyph-line" d="M35 24 L41 30 M41 24 L35 30" />
          <path className="tuk-thin" d="M25.5 36 L34.5 36" />
        </g>
      );
    case 'neutral':
    default:
      return (
        <g>
          <circle className="tuk-glyph" cx="22" cy="27" r="3.3" />
          <circle className="tuk-glyph" cx="38" cy="27" r="3.3" />
          <path className="tuk-thin" d="M25 35 Q30 37.6 35 35" />
        </g>
      );
  }
};

const TukAvatar = ({
  face = 'neutral',
  gesture = 'rest',
  head = 'still',
  /** 1 = facing right, -1 = facing left */
  facing = 1,
  /** vertical squash: 1 = neutral, <1 = squashed, >1 = stretched */
  squash = 1,
  size = 64,
  className = '',
  title
}) => {
  const pose = GESTURES[gesture] || GESTURES.rest;
  const height = Math.round((size * VIEW.h) / VIEW.w);

  return (
    <svg
      className={`tuk ${className}`}
      width={size}
      height={height}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g style={{ transform: `scaleX(${facing})`, transformOrigin: '50% 50%' }}>
        <g
          className="tuk-squash"
          style={{ transform: `scaleY(${squash}) scaleX(${2 - squash})` }}
        >
          {/* torso */}
          <line className="tuk-ch" x1="24" y1="56" x2="23" y2="63" />
          <line className="tuk-ch" x1="36" y1="56" x2="37" y2="63" />
          <rect className="tuk-soft" x="20" y="42" width="20" height="15" rx="5" />
          <rect className="tuk-ch" x="20" y="42" width="20" height="15" rx="5" />

          {/* head — antenna + screen + face, moves as one unit */}
          <g className={`tuk-head tuk-head-${head}`}>
            <line className="tuk-ch" x1="30" y1="16" x2="30" y2="10" />
            <circle className="tuk-fill tuk-antenna" cx="30" cy="8.4" r="2.4" />
            <rect className="tuk-paper" x="11" y="16" width="38" height="26" rx="9" />
            <Face name={face} />
          </g>

          {/* hands — position layer wraps motion layer */}
          <g className="tuk-hand-pos" style={{ transform: `translate(${pose.l[0]}px, ${pose.l[1]}px)` }}>
            <g className="tuk-hand-spin">
              <circle className="tuk-hand" cx="0" cy="0" r="4.4" />
            </g>
          </g>
          <g className="tuk-hand-pos" style={{ transform: `translate(${pose.r[0]}px, ${pose.r[1]}px)` }}>
            <g className={`tuk-hand-spin ${pose.wag ? 'tuk-wag' : ''}`}>
              {pose.armed && (
                <g>
                  <path className="tuk-blade" d="M0 -2.2 L20 -1.1 L23 0 L20 1.1 L0 2.2 Z" transform="rotate(-46)" />
                  <path className="tuk-ch" d="M-2.6 -3.4 L-2.6 3.4" strokeWidth="2.4" transform="rotate(-46)" />
                </g>
              )}
              <circle className="tuk-hand" cx="0" cy="0" r="4.4" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default TukAvatar;
