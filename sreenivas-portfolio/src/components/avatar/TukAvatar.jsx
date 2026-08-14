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
 *
 * ── Ambient life ────────────────────────────────────────────────────────
 * `.tuk-idle` (breathing) and `.tuk-face` (blink) exist ONLY to carry those
 * animations. They get their own groups for the same reason the hands do:
 * `.tuk-squash` already carries an inline transform from the physics loop, and
 * animating it would blow that away. Without these two layers he stands
 * perfectly still between hops and reads as a static illustration.
 */

const VIEW = { w: 60, h: 67 };

/** Faces whose eyes are already shut, drawn, or spinning — blinking them looks wrong. */
const NO_BLINK = new Set(['sleepy', 'loading', 'error']);

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

/**
 * Held objects, in the right hand's local coordinates: (0,0) is the hand's
 * centre. Drawn before the hand circle so the hand overlaps them and reads as a
 * grip. The broom's bristles reach y≈17, which is floor level when the hand is
 * in the low `sweep` pose — that pose wags, so the broom sweeps for free.
 */
const Prop = ({ name }) => {
  switch (name) {
    case 'mug':
      return (
        <g>
          <path className="tuk-prop-line" d="M8 -8 Q12.5 -5.5 8 -3" />
          <rect className="tuk-prop" x="-4" y="-11.5" width="12" height="10" rx="1.8" />
          <path className="tuk-prop-line" d="M-4 -8.6 L8 -8.6" />
        </g>
      );
    case 'can':
      return (
        <g>
          <path className="tuk-prop-line" d="M-5 -10 Q0.5 -17 6 -10" />
          <path className="tuk-prop" d="M5.5 -9 L15 -13 L15.5 -9.5 L5.5 -5 Z" />
          <rect className="tuk-prop" x="-7" y="-10.5" width="14" height="11.5" rx="2.4" />
          <g className="tuk-drip">
            <circle className="tuk-drop tuk-drop-a" cx="15" cy="-6" r="1.3" />
            <circle className="tuk-drop tuk-drop-b" cx="15" cy="-6" r="1.1" />
          </g>
        </g>
      );
    case 'broom':
      return (
        <g>
          <path className="tuk-prop-line" d="M-2 -11 L3 12" />
          <path className="tuk-prop" d="M-2 12 L8.5 12 L11 19 L-5 19 Z" />
          <path className="tuk-prop-line" d="M0.5 13.5 L-0.5 18 M3.5 13.5 L3.5 18 M6.5 13.5 L7.5 18" />
        </g>
      );
    case 'book':
      return (
        <g>
          <rect className="tuk-prop" x="-6" y="-9.5" width="17" height="13" rx="1.2" />
          <path className="tuk-prop-line" d="M2.5 -9.5 L2.5 3.5" />
          <path className="tuk-prop-line" d="M5.5 -6 L8.5 -6 M5.5 -2.5 L8.5 -2.5" />
        </g>
      );
    default:
      return null;
  }
};

/**
 * The hovercraft. Its own SVG, mounted as a sibling of the scaled body so it
 * neither mirrors when he turns nor squashes when he lands.
 */
export const Hovercraft = () => (
  <svg className="tuk-craft" width="58" height="22" viewBox="0 0 58 22" aria-hidden="true">
    <ellipse className="tuk-craft-wash" cx="29" cy="17" rx="21" ry="4.5" />
    <path className="tuk-craft-body" d="M5 9 Q29 1 53 9 Q29 16 5 9 Z" />
    <path className="tuk-craft-edge" d="M12 11.4 L46 11.4" />
    <g className="tuk-craft-jets">
      <circle className="tuk-craft-jet" cx="18" cy="13.5" r="2.4" />
      <circle className="tuk-craft-jet" cx="40" cy="13.5" r="2.4" />
    </g>
  </svg>
);

const TukAvatar = ({
  face = 'neutral',
  gesture = 'rest',
  head = 'still',
  /** something held in the right hand — see PROPS in expressions.js */
  prop = null,
  /** 1 = facing right, -1 = facing left */
  facing = 1,
  /** vertical squash: 1 = neutral, <1 = squashed, >1 = stretched */
  squash = 1,
  /** ambient breathing + blinking. Off only for a static specimen render. */
  idle = true,
  size = 64,
  className = '',
  title
}) => {
  const pose = GESTURES[gesture] || GESTURES.rest;
  const height = Math.round((size * VIEW.h) / VIEW.w);
  const blink = idle && !NO_BLINK.has(face);

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
          {/* breathing lives on its own group — see the layer rule above */}
          <g className={idle ? 'tuk-idle' : undefined}>
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
            {/* blink layer — animation only, never a presentation transform */}
            <g className={blink ? 'tuk-face tuk-blink' : 'tuk-face'}>
              <Face name={face} />
            </g>
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
              {prop && <Prop name={prop} />}
              <circle className="tuk-hand" cx="0" cy="0" r="4.4" />
            </g>
          </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default TukAvatar;
