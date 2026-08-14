import React from 'react';
import '../../styles/components/tuk-room.css';

/**
 * The room Tuk lives in — a horizontal cutaway of a small home, wall removed.
 *
 * WHY A CUTAWAY AND NOT A ROOM. The ribbon is about 17:1 (1440px wide, 82px of
 * usable height above the floor line). No single room is that shape, and
 * outdoors needs a horizon the strip has nowhere to put — it fades to
 * transparent at the top. A cutaway is the only layout the geometry wants.
 *
 * ── Construction rules ──────────────────────────────────────────────────
 * 1. EVERY PIECE IS ITS OWN 1:1 SVG. viewBox units are display pixels, and the
 *    bottom edge of the viewBox sits on the floor line. So a piece 56 tall
 *    stands 56px off the floor, and nothing needs scale bookkeeping.
 *
 * 2. NO PRESENTATION ATTRIBUTES ON PATHS. Stroke and fill come from the shared
 *    `.rp-*` classes in tuk-room.css. Restyling the whole room — heavier line,
 *    different paper, more or less accent — is then one CSS block, not 40 edits.
 *
 * 3. FURNITURE LINES ARE LIGHTER THAN TUK'S. He carries 2.1 on a 60-unit
 *    viewBox drawn at 52px (≈1.8 on screen); the room carries 1.7. Deliberate:
 *    the character has to read as the foreground.
 *
 * 4. THE SOFA IS TWO LAYERS. In a side-on cutaway the near armrest occludes
 *    whoever is sitting, so `LoungeFront` paints ABOVE the actor while
 *    `LoungeBack` paints below, and he sits between them. Built now because
 *    retrofitting it later means redrawing the sofa.
 *
 * Sizes are load-bearing: total width is 666px, and the three zones that survive
 * every breakpoint total 448px, which is what lets them sit on a 480px strip
 * without touching. Changing one means re-checking tuk-room.css.
 */

/** Kitchen — counter, kettle on the boil, a shelf of mugs. */
const KitchenNook = () => (
  <svg className="rp" width="116" height="56" viewBox="0 0 116 56" aria-hidden="true">
    {/* wall shelf + mugs */}
    <rect className="rp-paper" x="78" y="16" width="34" height="3.5" rx="1.5" />
    <rect className="rp-paper" x="82" y="9" width="8" height="7" rx="1.6" />
    <path className="rp-thin" d="M90 11 q3 1.6 0 3.4" />
    <rect className="rp-paper" x="96" y="9" width="8" height="7" rx="1.6" />
    <path className="rp-thin" d="M104 11 q3 1.6 0 3.4" />

    {/* steam first, so it rises behind the spout rather than over it */}
    <g className="rp-steam">
      <path className="rp-thin rp-steam-a" d="M41 9 q3 -3.5 0 -7" />
      <path className="rp-thin rp-steam-b" d="M45 8 q2.5 -3 0 -6" />
      <path className="rp-thin rp-steam-c" d="M37.5 6.5 q2.5 -3 0 -5.5" />
    </g>

    {/* counter + cabinet */}
    <rect className="rp-paper" x="3" y="25" width="70" height="4" rx="1.5" />
    <rect className="rp-paper" x="7" y="29" width="62" height="27" rx="2" />
    <path className="rp-thin" d="M38 31 L38 56" />
    <path className="rp-thin" d="M34 36 L34 41" />
    <path className="rp-thin" d="M42 36 L42 41" />

    {/* kettle */}
    <path className="rp-paper" d="M18 25 L20 13 Q20 10 24 10 L31 10 Q35 10 35 13 L37 25 Z" />
    <path className="rp-ink" d="M35 14 L41 11" />
    <path className="rp-ink" d="M22 10 Q27.5 3 33 10" />
    <circle className="rp-knob" cx="27.5" cy="8" r="1.5" />
  </svg>
);

/** Window and a plant that needs watering. */
const WindowPlant = () => (
  <svg className="rp" width="92" height="72" viewBox="0 0 92 72" aria-hidden="true">
    {/* daylight, then the frame over it */}
    <rect className="rp-glow" x="6" y="6" width="40" height="32" rx="2" />
    <rect className="rp-ink" x="6" y="6" width="40" height="32" rx="2" />
    <path className="rp-thin" d="M26 6 L26 38" />
    <path className="rp-thin" d="M6 22 L46 22" />
    <rect className="rp-paper" x="1" y="38" width="50" height="4" rx="1.5" />

    {/* plant */}
    <path className="rp-leaf" d="M76 52 Q64 46 67 31 Q75 39 76 52 Z" />
    <path className="rp-leaf" d="M76 52 Q88 45 86 32 Q78 39 76 52 Z" />
    <path className="rp-leaf" d="M76 52 Q72 40 76 27 Q81 40 76 52 Z" />
    <path className="rp-paper" d="M63 72 L66 56 L88 56 L85 72 Z" />
    <rect className="rp-paper" x="62" y="52" width="27" height="5" rx="1.5" />
  </svg>
);

/**
 * Lounge — sofa, TV, rug, wall clock. Back layer.
 *
 * THE CLOCK RUNS ON HIS TIME. The hands are driven from his position in the day,
 * so the minute hand sweeps a full turn every 11 seconds. That is the compression
 * made visible: it is the one object in the room that admits time moves
 * differently down here.
 *
 * THE TELEVISION IS SHOWING ORIGINS. Eight silhouettes rise out of a horizon,
 * stand a while, and fall, on a 36-second loop. It is the parked civilisation
 * simulation as a two-inch vignette, which is the right size for it: nobody needs
 * it explained, and the rare sofa line ("That world again. Stone tools, then
 * towers. Then it starts over.") lands on someone who has already half-noticed.
 * Pure CSS, so it costs no re-renders.
 */
const LoungeBack = ({ clock }) => (
  <svg className="rp" width="196" height="64" viewBox="0 0 196 64" aria-hidden="true">
    {/* Rug, seen edge-on. Neutral rather than accent-tinted: in accent-soft it
        read as a pink stain spreading out from under the sofa. */}
    <rect className="rp-rug" x="8" y="60" width="150" height="4" rx="2" />

    {/* wall clock, running on his clock */}
    <circle className="rp-paper" cx="54" cy="11" r="8.5" />
    <g transform={`rotate(${clock.hour} 54 11)`}>
      <path className="rp-ink" d="M54 11 L54 6.5" />
    </g>
    <g transform={`rotate(${clock.minute} 54 11)`}>
      <path className="rp-thin" d="M54 11 L54 4.5" />
    </g>
    <circle className="rp-knob" cx="54" cy="11" r="1" />

    {/* sofa: backrest and the far arm */}
    <rect className="rp-paper" x="10" y="24" width="92" height="24" rx="7" />
    <path className="rp-thin" d="M40 28 L40 45" />
    <path className="rp-thin" d="M71 28 L71 45" />
    <rect className="rp-paper" x="4" y="33" width="14" height="27" rx="6" />

    {/* TV on its stand */}
    <rect className="rp-paper" x="138" y="52" width="36" height="8" rx="2" />
    <path className="rp-ink" d="M156 46 L156 52" />
    <rect className="rp-paper" x="126" y="17" width="60" height="29" rx="4" />
    {/* The flicker animates the GROUP's opacity, and the light state sets the
        screen's own. Both on one element and the animation wins outright, so the
        TV would never brighten as the room goes dark. Multiplying instead. */}
    <g className="rp-tv-flicker">
      <rect className="rp-screen" x="130" y="21" width="52" height="21" rx="2" />
      {/* what's on */}
      <g className="rp-tv-show">
        <circle className="rp-tv-sun" cx="135" cy="32" r="1.7" />
        <rect className="rp-tv-tower rp-t1" x="133" y="30" width="4" height="8" />
        <rect className="rp-tv-tower rp-t2" x="138" y="25" width="5" height="13" />
        <rect className="rp-tv-tower rp-t3" x="144" y="28" width="4" height="10" />
        <rect className="rp-tv-tower rp-t4" x="149" y="23" width="6" height="15" />
        <rect className="rp-tv-tower rp-t5" x="156" y="27" width="4" height="11" />
        <rect className="rp-tv-tower rp-t6" x="161" y="24" width="5" height="14" />
        <rect className="rp-tv-tower rp-t7" x="167" y="29" width="4" height="9" />
        <rect className="rp-tv-tower rp-t8" x="172" y="26" width="6" height="12" />
        <path className="rp-tv-horizon" d="M131 38.6 L181 38.6" />
      </g>
    </g>
  </svg>
);

/**
 * Lounge front layer — the seat and the near armrest, which occlude whoever is
 * sitting. Same viewBox as LoungeBack so the two register exactly.
 */
const LoungeFront = () => (
  <svg className="rp" width="196" height="64" viewBox="0 0 196 64" aria-hidden="true">
    <rect className="rp-paper" x="6" y="44" width="98" height="16" rx="5" />
    <rect className="rp-paper" x="88" y="31" width="16" height="29" rx="6" />
    <path className="rp-ink" d="M14 60 L14 63" />
    <path className="rp-ink" d="M96 60 L96 63" />
  </svg>
);

/** Desk, laptop, anglepoise lamp, bookshelf. The dev's corner. */
const DeskNook = () => (
  <svg className="rp" width="126" height="78" viewBox="0 0 126 78" aria-hidden="true">
    {/* bookshelf */}
    <rect className="rp-paper" x="98" y="16" width="26" height="62" rx="2" />
    <path className="rp-thin" d="M98 36 L124 36" />
    <path className="rp-thin" d="M98 57 L124 57" />
    <rect className="rp-book" x="101" y="22" width="4" height="14" />
    <rect className="rp-book" x="106" y="20" width="5" height="16" />
    <rect className="rp-book" x="112" y="23" width="4" height="13" />
    <rect className="rp-book" x="101" y="44" width="5" height="13" />
    <rect className="rp-book" x="107" y="42" width="4" height="15" />

    {/* Lamp — glow sits under the shade, which flares DOWNWARD. Drawn the other
        way up it read as a funnel, and the light appeared to fall out of a hopper. */}
    <circle className="rp-glow" cx="24.5" cy="26" r="7" />
    <path className="rp-ink" d="M16 40 L14 24 L24.5 14" />
    <path className="rp-paper" d="M21 13 L28 13 L32 21 L17 21 Z" />
    <rect className="rp-paper" x="10" y="40" width="12" height="4" rx="1.5" />

    {/* desk */}
    <rect className="rp-paper" x="4" y="44" width="84" height="4" rx="1.5" />
    <path className="rp-ink" d="M11 48 L11 78" />
    <path className="rp-ink" d="M81 48 L81 78" />
    <rect className="rp-paper" x="52" y="48" width="32" height="12" rx="2" />
    <path className="rp-thin" d="M62 54 L74 54" />

    {/* laptop */}
    <rect className="rp-paper" x="30" y="26" width="22" height="15" rx="1.5" />
    <rect className="rp-screen-sm" x="32" y="28" width="18" height="11" rx="1" />
    <path className="rp-paper" d="M28 44 L54 44 L52 41 L30 41 Z" />
  </svg>
);

/**
 * Charging dock and the front door. A dock rather than a bed — he's a robot,
 * and it gives the night block a light source.
 *
 * The door is the exit. It stays shut until the hovercraft exists, and it is
 * what makes "compound" a later extension rather than a decision now.
 */
const DockDoor = () => (
  <svg className="rp" width="136" height="68" viewBox="0 0 136 68" aria-hidden="true">
    <rect className="rp-paper" x="92" y="1" width="44" height="67" rx="2" />
    <rect className="rp-thin" x="101" y="7" width="29" height="44" rx="1.5" />
    <circle className="rp-knob" cx="97" cy="40" r="2" />

    {/* wall socket, and the cable running to the dock */}
    <rect className="rp-paper" x="80" y="44" width="7" height="9" rx="1.5" />
    <circle className="rp-knob" cx="82.2" cy="48" r="0.8" />
    <circle className="rp-knob" cx="84.8" cy="48" r="0.8" />
    <path className="rp-thin" d="M76 65 Q82 63 83 53" />

    {/**
     * A charging MAT he stands on, not a pod he stands in front of. He is 52px
     * wide and the first draft's dock was 32, so during the longest beat of the
     * day — 26 seconds asleep — he occluded the entire thing and the scene read
     * as a robot loitering by a door. A pad wider than he is cannot be hidden,
     * and the post carrying the indicator sits clear of his shoulder.
     */}
    <rect className="rp-paper" x="2" y="61" width="74" height="7" rx="2.5" />
    <path className="rp-thin" d="M10 64.6 L68 64.6" />
    <rect className="rp-paper" x="2" y="38" width="8" height="23" rx="2.5" />
    <circle className="rp-led" cx="6" cy="42" r="2" />
  </svg>
);

/**
 * The room, laid out left to right. `space-between` rather than fixed offsets:
 * the zones then distribute at any width and can't collide until their combined
 * 626px exceeds the strip, which the breakpoints handle by dropping zones from
 * the least essential inward.
 *
 * No z-index on `.rp-room` or `.rp-zone` on purpose — either one would open a
 * stacking context and trap `.rp-front` below the actor.
 */
const RoomFurniture = ({ clock }) => (
  <div className="rp-room">
    <div className="rp-zone rp-kitchen" data-tuk-zone="kitchen"><KitchenNook /></div>
    <div className="rp-zone rp-window" data-tuk-zone="window"><WindowPlant /></div>
    <div className="rp-zone rp-lounge" data-tuk-zone="lounge">
      <LoungeBack clock={clock} />
      <div className="rp-front"><LoungeFront /></div>
    </div>
    <div className="rp-zone rp-desk" data-tuk-zone="desk"><DeskNook /></div>
    <div className="rp-zone rp-dock" data-tuk-zone="dock"><DockDoor /></div>
  </div>
);

export default RoomFurniture;
