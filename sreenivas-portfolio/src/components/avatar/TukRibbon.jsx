import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TukAvatar, { Hovercraft } from './TukAvatar';
import SpeechBubble from './SpeechBubble';
import useAvatarLife from './useAvatarLife';
import useRoutine from './useRoutine';
import RoomFurniture from './RoomFurniture';
import skyAt from './daylight';
import { GREETINGS, FLIGHT_LINES, createShuffleBag } from './dialogue';
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

  const { phase, noticing, greeting, greetMs, arrivals, flying, flightPhase } = useAvatarLife({
    containerRef: stageRef,
    actorRef,
    bodyRef,
    footprint: FOOTPRINT,
    hopVy: HOP_VY,
    goalRef,
    fly: true
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

  /** His day stops while he is out flying, and picks up where it left off. */
  const { beat, speech, progress } = useRoutine({ goalRef, arrivals, zoneX, enabled: !flying });

  /**
   * The light, sampled from a curve rather than switched between named states.
   * Written as inline style because that is the only way it moves: a gradient is
   * a background-image, and background-image does not interpolate, so the CSS
   * transition this used to rely on never ran and every change was a hard cut.
   * The three levels ride down as custom properties, which the furniture inherits.
   */
  const sky = useMemo(() => skyAt(progress), [progress]);

  /**
   * The wall clock, on his time. progress 0 is the `wake` beat, which the routine
   * calls 6am, so the face agrees with what he is doing: midday at the desk,
   * evening on the sofa. His day is 280 real seconds, so the minute hand sweeps a
   * full turn roughly every 11 seconds. That visible speed is the point.
   */
  const clock = useMemo(() => {
    const hourOfDay = (6 + progress * 24) % 24;
    return { hour: (hourOfDay % 12) * 30, minute: (hourOfDay % 1) * 360 };
  }, [progress]);

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
   * What he says in the air. Chase lines come and go while he is closing on the
   * cursor; the catch line plays once, on the spot, and stays up for the whole
   * celebration because that is the payoff of the game.
   */
  const [flightLine, setFlightLine] = useState('');
  const chaseBag = useRef(createShuffleBag(FLIGHT_LINES.chase));
  const caughtBag = useRef(createShuffleBag(FLIGHT_LINES.caught));

  useEffect(() => {
    if (flightPhase === 'caught') {
      setFlightLine(caughtBag.current.draw());
      return undefined;
    }
    if (flightPhase !== 'chase') {
      setFlightLine('');
      return undefined;
    }
    setFlightLine(chaseBag.current.draw());
    let showing = true;
    const id = window.setInterval(() => {
      showing = !showing;
      setFlightLine(showing ? chaseBag.current.draw() : '');
    }, 2400);
    return () => window.clearInterval(id);
  }, [flightPhase]);

  /**
   * Composition priority: a greeting interrupts everything — including sleep,
   * which is what makes a 3am visitor the one who gets to wake him — then
   * locomotion, then mere proximity, then whatever his day says he's doing.
   */
  const pose = useMemo(() => {
    // Happy, not `determined`: >_< with slanted brows reads as furious, and a
    // robot who scowls at you for coming close is the wrong character entirely.
    if (flightPhase === 'caught') return { gesture: 'cheer', face: 'heart', head: 'perk' };
    if (flightPhase === 'return') return { gesture: 'rest', face: 'happy', head: 'still' };
    if (flying) return { gesture: 'reach', face: 'happy', head: 'lean' };
    if (saying) return { gesture: 'wave', face: 'happy', head: 'nod' };
    if (phase === 'airborne') return { gesture: 'reach', face: 'surprise', head: 'still' };
    if (noticing) return { gesture: 'rest', face: 'happy', head: 'lean' };
    return { gesture: beat.gesture, face: beat.face, head: beat.head };
  }, [phase, noticing, saying, beat, flying, flightPhase]);

  /**
   * The prop survives hops and proximity — he carries his mug to the kitchen —
   * but not a greeting or a flight, where he needs his hands.
   */
  const prop = saying || flying ? null : beat.prop || null;

  /**
   * A hello outranks a chore line: if you've just turned up, that's what he
   * answers. His chore dialogue is what he says when nobody is watching.
   */
  const bubble = flightLine || (saying ? line : null) || (!flying ? speech : null) || '';

  return (
    <div
      className="tuk-ribbon"
      aria-hidden="true"
      style={{ '--rp-lamp': sky.lamp, '--rp-screen': sky.screen, '--rp-day': sky.day }}
    >
      <div className="tuk-ribbon-surface" style={{ background: sky.gradient }} />
      <div className="tuk-ribbon-stage" ref={stageRef}>
        <div className="tuk-ribbon-floor" data-avatar-platform />
        <RoomFurniture clock={clock} />
        {/* actorRef carries translation only; bodyRef carries scale, so the
            bubble is neither squashed nor mirrored when he turns. */}
        <div className={`tuk-actor ${flying ? 'is-flying' : ''}`} ref={actorRef}>
          <SpeechBubble text={bubble} visible={Boolean(bubble)} />
          <Hovercraft />
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
