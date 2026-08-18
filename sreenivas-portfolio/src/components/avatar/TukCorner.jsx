import React, { useEffect, useMemo, useRef, useState } from 'react';
import TukAvatar, { Hovercraft } from './TukAvatar';
import SpeechBubble from './SpeechBubble';
import useAvatarLife from './useAvatarLife';
import { GREETINGS, FLIGHT_LINES, createShuffleBag } from './dialogue';
import '../../styles/components/tuk-corner.css';

/**
 * TukCorner — Tuk on every page, on his charging pad, in the bottom right.
 *
 * ── Why this replaced the room ──────────────────────────────────────────
 * The house used to be a 104px strip across the bottom of every page. It was
 * lovely and it was the wrong trade: an eighteen-beat day runs five minutes and a
 * portfolio visit runs ninety seconds, so the median visitor saw three beats and
 * two lines — a lot of content almost nobody reached, which is the same mistake
 * that parked the civilisation simulation, one level up. And it cost a permanent
 * eighth of a laptop viewport on a site whose job is showing the work.
 *
 * The house still exists, at /tuk, where someone who wants it can watch a whole
 * day. Here he is what he was always meant to be: a guide standing in a corner.
 *
 * ── What it deliberately does NOT do ────────────────────────────────────
 * No routine, and no ambient wandering. There is one platform the width of a
 * charging pad, so there is nowhere to go and nothing to visit; hopping on the
 * spot would read as a twitch. He stands, breathes, blinks, looks at your cursor,
 * says hello, and takes off when you linger. Flight is unchanged and still
 * escapes the corner — the whole viewport is his.
 *
 * The bubble hangs to his LEFT because he lives on the right edge.
 */

const FOOTPRINT = 52;

const ChargePad = () => (
  <svg className="tc-pad" width="86" height="30" viewBox="0 0 86 30" aria-hidden="true">
    {/* the mat, wider than he is so he can't hide it by standing on it */}
    <rect className="tc-paper" x="2" y="21" width="82" height="7" rx="2.5" />
    <path className="tc-thin" d="M10 24.6 L76 24.6" />
    {/* the post carries the indicator, clear of his shoulder */}
    <rect className="tc-paper" x="2" y="2" width="8" height="19" rx="2.5" />
    <circle className="tc-led" cx="6" cy="6" r="2" />
  </svg>
);

const TukCorner = () => {
  const stageRef = useRef(null);
  const actorRef = useRef(null);
  const bodyRef = useRef(null);

  const [line, setLine] = useState('');
  const [saying, setSaying] = useState(false);

  const { phase, noticing, greeting, greetMs, flying, flightPhase } = useAvatarLife({
    containerRef: stageRef,
    actorRef,
    bodyRef,
    footprint: FOOTPRINT,
    // Nowhere to go: one pad-sized platform, so idle hops would just be a twitch.
    wander: false,
    fly: true
  });

  /**
   * Only marks the page as having him, so the back-to-top button can step aside.
   * No padding is reserved — unlike the strip, he floats over the page.
   */
  useEffect(() => {
    document.body.classList.add('has-tuk-corner');
    return () => document.body.classList.remove('has-tuk-corner');
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

  /** What he says in the air — chase lines, then the catch. */
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

  const pose = useMemo(() => {
    if (flightPhase === 'caught') return { gesture: 'cheer', face: 'heart', head: 'perk' };
    if (flightPhase === 'return') return { gesture: 'rest', face: 'happy', head: 'still' };
    if (flying) return { gesture: 'reach', face: 'happy', head: 'lean' };
    if (saying) return { gesture: 'wave', face: 'happy', head: 'nod' };
    if (phase === 'airborne') return { gesture: 'reach', face: 'surprise', head: 'still' };
    if (noticing) return { gesture: 'rest', face: 'happy', head: 'lean' };
    // Standing on the charger with nothing to do yet. What he does here instead
    // is the next thing to design.
    return { gesture: 'rest', face: 'neutral', head: 'still' };
  }, [phase, noticing, saying, flying, flightPhase]);

  const bubble = flightLine || (saying ? line : '') || '';

  return (
    <div className="tuk-corner" aria-hidden="true">
      <div className="tuk-corner-stage" ref={stageRef}>
        <div className="tc-pad-wrap">
          <ChargePad />
        </div>
        {/* The pad's own surface is the only standable thing here, so `measure`
            places him on it without anyone having to direct him. */}
        <div className="tc-surface" data-avatar-platform />
        <div className={`tuk-actor ${flying ? 'is-flying' : ''}`} ref={actorRef}>
          <SpeechBubble text={bubble} visible={Boolean(bubble)} side="left" />
          <Hovercraft />
          <div className="tuk-actor-body" ref={bodyRef}>
            <TukAvatar
              face={pose.face}
              gesture={pose.gesture}
              head={pose.head}
              size={FOOTPRINT}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TukCorner;
