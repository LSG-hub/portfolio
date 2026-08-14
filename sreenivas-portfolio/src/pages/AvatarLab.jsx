import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import TukAvatar from '../components/avatar/TukAvatar';
import SpeechBubble from '../components/avatar/SpeechBubble';
import useAvatarLife from '../components/avatar/useAvatarLife';
import { GREETINGS, createShuffleBag } from '../components/avatar/dialogue';
import { SCENES, SCENE_NAMES, FACES, FACE_LABELS, GESTURES, HEADS } from '../components/avatar/expressions';
import '../styles/components/avatar-lab.css';

/**
 * /avatar-lab — a bench for tuning Tuk's physics against real DOM furniture.
 *
 * Deliberately not the live portfolio page: same rect-harvesting, same glass
 * cards, but you aren't scrolling past the hero on every reload while tuning
 * gravity. When the physics feel right, the actor mounts on HomePage unchanged.
 */

const GESTURE_NAMES = Object.keys(GESTURES);

const AvatarLab = () => {
  const worldRef = useRef(null);
  const actorRef = useRef(null);
  const bodyRef = useRef(null);

  const [mode, setMode] = useState('auto');      // 'auto' = ambient, or a scene name
  const [manual, setManual] = useState({ face: null, gesture: null, head: null });
  const [line, setLine] = useState('');
  const [saying, setSaying] = useState(false);

  const { phase, noticing, greeting, platformCount, greetMs } = useAvatarLife({
    containerRef: worldRef,
    actorRef,
    bodyRef,
    footprint: 64
  });

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
   * Composition: ambient behaviour derived from physics, overridden by a
   * directed scene, overridden by an explicit manual axis. This is the
   * priority rule the real implementation needs — directed interrupts
   * ambient, ambient resumes when the scene clears.
   */
  const pose = useMemo(() => {
    let base;
    if (mode !== 'auto') {
      base = { ...SCENES[mode] };
    } else if (saying) {
      // greeting wins over the jump pose — he stops to say hello
      base = { gesture: 'wave', face: 'happy', head: 'nod' };
    } else if (phase === 'airborne') {
      base = { gesture: 'reach', face: 'surprise', head: 'still' };
    } else if (phase === 'landing') {
      base = { gesture: 'rest', face: 'happy', head: 'still' };
    } else if (noticing) {
      base = { gesture: 'rest', face: 'happy', head: 'lean' };
    } else {
      base = { gesture: 'rest', face: 'neutral', head: 'still' };
    }
    return {
      face: manual.face || base.face,
      gesture: manual.gesture || base.gesture,
      head: manual.head || base.head
    };
  }, [mode, phase, noticing, saying, manual]);

  const chip = (active, label, onClick, key) => (
    <button key={key} type="button" className="lab-chip" aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  );

  return (
    <div className="lab">
      <div className="container">
        <Link to="/" className="lab-back">&larr; Back to portfolio</Link>

        <header className="lab-header">
          <span className="eyebrow">Avatar lab &middot; not linked from the site</span>
          <h1 className="lab-title">Tuk, on real furniture</h1>
          <p className="lab-lede">
            The cards below are tagged <code>data-avatar-platform</code>. Their top edges are
            harvested with <code>getBoundingClientRect()</code> every half second, so Tuk is
            standing on actual DOM, not a painted floor. He hops rather than walks &mdash; stub
            legs and detached hands make a gait look wrong, and hopping buys squash-and-stretch
            for free.
          </p>
        </header>

        <div className="lab-readout">
          <span><b>{platformCount}</b> platforms</span>
          <span>phase <b>{phase}</b></span>
          <span>cursor <b>{noticing ? 'near' : 'far'}</b></span>
          <span>face <b>{pose.face}</b></span>
          <span>hands <b>{pose.gesture}</b></span>
          <span>head <b>{pose.head}</b></span>
          <span>saying <b>{saying ? `“${line}”` : '—'}</b></span>
        </div>

        <div className="lab-controls">
          <div className="lab-group">
            <span className="lab-group-label">Scene</span>
            <div className="lab-chips">
              {chip(mode === 'auto', 'auto (ambient)', () => setMode('auto'), 'auto')}
              {SCENE_NAMES.map((name) =>
                chip(mode === name, name, () => setMode(name), name)
              )}
            </div>
          </div>

          <div className="lab-group">
            <span className="lab-group-label">Override face</span>
            <div className="lab-chips">
              {chip(!manual.face, 'auto', () => setManual((m) => ({ ...m, face: null })), 'f-auto')}
              {FACES.map((f) =>
                chip(manual.face === f, FACE_LABELS[f], () => setManual((m) => ({ ...m, face: f })), f)
              )}
            </div>
          </div>

          <div className="lab-group">
            <span className="lab-group-label">Override hands</span>
            <div className="lab-chips">
              {chip(!manual.gesture, 'auto', () => setManual((m) => ({ ...m, gesture: null })), 'g-auto')}
              {GESTURE_NAMES.map((g) =>
                chip(manual.gesture === g, g, () => setManual((m) => ({ ...m, gesture: g })), g)
              )}
            </div>
          </div>

          <div className="lab-group">
            <span className="lab-group-label">Override head</span>
            <div className="lab-chips">
              {chip(!manual.head, 'auto', () => setManual((m) => ({ ...m, head: null })), 'h-auto')}
              {HEADS.map((h) =>
                chip(manual.head === h, h, () => setManual((m) => ({ ...m, head: h })), h)
              )}
            </div>
          </div>
        </div>

        {/* ── the world ── */}
        <div className="lab-world" ref={worldRef}>
          {/* actorRef carries translation only; bodyRef carries scale, so the
              bubble is neither squashed nor mirrored when he turns. */}
          <div className="lab-actor" ref={actorRef}>
            <SpeechBubble text={line} visible={saying} />
            <div className="lab-actor-body" ref={bodyRef}>
              <TukAvatar
                face={pose.face}
                gesture={pose.gesture}
                head={pose.head}
                size={64}
                title="Tuk, the portfolio avatar"
              />
            </div>
          </div>

          <div className="lab-shelf lab-shelf-a">
            <div className="lab-card glass" data-avatar-platform>
              <span className="eyebrow">Platform 01</span>
              <p className="lab-card-title">Juno</p>
            </div>
            <div className="lab-card glass lab-card-sm" data-avatar-platform>
              <span className="eyebrow">02</span>
            </div>
          </div>

          <div className="lab-shelf lab-shelf-b">
            <div className="lab-card glass lab-card-wide" data-avatar-platform>
              <span className="eyebrow">Platform 03 &mdash; wide</span>
              <p className="lab-card-title">Selected Work</p>
            </div>
          </div>

          <div className="lab-shelf lab-shelf-c">
            <div className="lab-card glass lab-card-sm" data-avatar-platform>
              <span className="eyebrow">04</span>
            </div>
            <div className="lab-card glass" data-avatar-platform>
              <span className="eyebrow">Platform 05</span>
              <p className="lab-card-title">SPEAR</p>
            </div>
          </div>

          <div className="lab-floor" data-avatar-platform />
        </div>

        <section className="lab-notes glass-flat">
          <h2 className="lab-notes-title">Known gaps</h2>
          <ul>
            <li><strong>No pathfinding.</strong> He picks a direction and hops; if he lands on something, good. Falling out of the world respawns him. Charming by accident, but not deliberate navigation &mdash; the agent's <code>goToSection()</code> tool will need real targeting.</li>
            <li><strong>Coordinates are container-relative.</strong> Fine here. On the real page he needs document coordinates plus a viewport-sticky mode, so he can either ride the page or stay visible.</li>
            <li><strong>No hiding or peeking.</strong> The z-index tricks that make him duck behind the navbar aren't built.</li>
            <li><strong>Mobile is untested.</strong> No cursor means the notice behaviour never fires; taps need to become pokes.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AvatarLab;
