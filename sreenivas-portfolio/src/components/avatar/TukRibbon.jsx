import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TukAvatar from './TukAvatar';
import SpeechBubble from './SpeechBubble';
import useAvatarLife from './useAvatarLife';
import useRoutine from './useRoutine';
import RoomFurniture from './RoomFurniture';
import { GREETINGS, createShuffleBag } from './dialogue';
import '../../styles/components/tuk-ribbon.css';

/**
 * TukRibbon — the strip along the bottom of every page. This is Tuk's home.
 *
 * The room is furnished (see RoomFurniture) but he doesn't use it yet: he
 * potters along the floor and says hello when the cursor comes near. The
 * routine — a 5-minute day of chores at each zone — is the next slice, then the
 * hovercraft that lets him leave the strip.
 *
 * Three things about the geometry:
 *
 * 1. IT DOES NOT CLIP. Overflow stays visible on purpose — his speech bubble
 *    hangs above his head and his hop apex clears the roofline. The blur sits
 *    on a separate inset surface div rather than the strip itself, because
 *    backdrop-filter establishes a backdrop root that can crop children.
 *
 * 2. IT NEVER EATS A CLICK. A fixed 100px band across the bottom of every page
 *    would otherwise swallow the footer links, so the whole thing is
 *    pointer-events: none. He is watched, not touched — until dynamic mode.
 *
 * 3. THE HOP IS GENTLE. The open-world default clears 62px, which doesn't fit
 *    under a 100px ceiling; a shallower launch also reads as domestic
 *    pottering rather than bouncing off the walls.
 *
 * Layout compensation lives in CSS on `body.has-tuk-ribbon`, keyed off a class
 * this component owns — so the padding can never outlive the strip.
 */

const FOOTPRINT = 52;
const HOP_VY = -250; // clears ~21px

const TukRibbon = () => {
  const stageRef = useRef(null);
  const actorRef = useRef(null);
  const bodyRef = useRef(null);

  const [line, setLine] = useState('');
  const [saying, setSaying] = useState(false);

  /** Where the routine wants him. Written by useRoutine, read by the physics loop. */
  const goalRef = useRef(null);

  const { phase, noticing, greeting, greetMs, arrivals } = useAvatarLife({
    containerRef: stageRef,
    actorRef,
    bodyRef,
    footprint: FOOTPRINT,
    hopVy: HOP_VY,
    goalRef
  });

  /**
   * Zone positions come from the real DOM, the same way standable surfaces do —
   * so moving a piece of furniture in CSS moves where he stands to use it, with
   * no second copy of the layout to keep in sync. Zone SVGs are drawn 1:1, so
   * the beat's `at` offset is directly in their own coordinates.
   *
   * Returns null for a zone hidden at this breakpoint, which the routine skips.
   */
  const zoneX = useCallback((zone, at) => {
    const stage = stageRef.current;
    if (!stage) return null;
    const el = stage.querySelector(`[data-tuk-zone="${zone}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return null;
    return r.left - stage.getBoundingClientRect().left + at;
  }, []);

  const { beat } = useRoutine({ goalRef, arrivals, zoneX });

  /** Reserve the space the strip occupies, and give it back on unmount. */
  useEffect(() => {
    document.body.classList.add('has-tuk-ribbon');
    return () => document.body.classList.remove('has-tuk-ribbon');
  }, []);

  /** Shuffle bag rather than Math.random — every line before any repeat. */
  const bag = useRef(createShuffleBag(GREETINGS));

  useEffect(() => {
    if (!greeting) return undefined;
    setLine(bag.current.draw());
    setSaying(true);
    const t = window.setTimeout(() => setSaying(false), greetMs);
    return () => window.clearTimeout(t);
  }, [greeting, greetMs]);

  /**
   * Composition priority: a greeting interrupts everything — including sleep,
   * which is what makes a 3am visitor the one who gets to wake him — then
   * locomotion, then mere proximity, then whatever his day says he's doing.
   */
  const pose = useMemo(() => {
    if (saying) return { gesture: 'wave', face: 'happy', head: 'nod' };
    if (phase === 'airborne') return { gesture: 'reach', face: 'surprise', head: 'still' };
    if (noticing) return { gesture: 'rest', face: 'happy', head: 'lean' };
    return { gesture: beat.gesture, face: beat.face, head: beat.head };
  }, [phase, noticing, saying, beat]);

  /**
   * The prop survives hops and proximity — he carries his mug to the kitchen —
   * but not a greeting, where he sets it down to wave.
   */
  const prop = saying ? null : beat.prop || null;

  return (
    <div className={`tuk-ribbon is-${beat.light}`} aria-hidden="true">
      <div className="tuk-ribbon-surface" />
      <div className="tuk-ribbon-stage" ref={stageRef}>
        <div className="tuk-ribbon-floor" data-avatar-platform />
        <RoomFurniture />
        {/* actorRef carries translation only; bodyRef carries scale, so the
            bubble is neither squashed nor mirrored when he turns. */}
        <div className="tuk-actor" ref={actorRef}>
          <SpeechBubble text={line} visible={saying} />
          <div className="tuk-actor-body" ref={bodyRef}>
            <TukAvatar
              face={pose.face}
              gesture={pose.gesture}
              head={pose.head}
              prop={prop}
              size={FOOTPRINT}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TukRibbon;
