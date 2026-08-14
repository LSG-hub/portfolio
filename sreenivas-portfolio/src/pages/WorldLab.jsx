import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useWorld from '../world/useWorld';
import WorldCanvas from '../components/world/WorldCanvas';
import { SPEEDS } from '../world/clock';
import { actionProgress, dayNumber, dayPhase, isNight } from '../world/simulate';
import { ERAS, CYCLE_SECONDS, HOUR, getEra } from '../world/data/eras';
import { getAction } from '../world/data/actions';
import { getStructure } from '../world/data/structures';
import { lifeStage } from '../world/data/people';
import '../styles/components/world-lab.css';

/**
 * /world-lab — an inspector for the simulation.
 *
 * There is no renderer yet, so the world is shown as data. That's deliberate and
 * it's the right order: the dev clock has to exist before anything downstream is
 * observable, and reading the chronicle scroll past at ×10000 is a genuine test
 * of whether the pacing and the story work.
 */

const clockOf = (elapsed) => {
  const hours = dayPhase(elapsed) * 24;
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const fmt = (n) => Math.floor(n).toLocaleString('en-IN');

const WorldLab = () => {
  const { world, elapsed, dev, version } = useWorld();
  const chronicleRef = useRef(null);

  // Extracted so the dependency is statically checkable.
  const chronicleLength = world ? world.chronicle.length : 0;
  useEffect(() => {
    const el = chronicleRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chronicleLength]);

  if (!world) return <div className="wlab"><div className="container">Building the world…</div></div>;

  const era = getEra(world.era);
  const action = world.tuk.action;
  const actionDef = action ? getAction(action.type) : null;
  const progress = actionProgress(world);
  const standing = world.structures.filter((s) => s.state === 'standing');
  const building = world.structures.find((s) => s.state === 'building');
  const night = isNight(world.elapsed);
  const recent = world.chronicle.slice(-60);

  return (
    <div className="wlab">
      <div className="container">
        <Link to="/" className="wlab-back">&larr; Back to portfolio</Link>

        <header className="wlab-header">
          <span className="eyebrow">World lab &middot; simulation inspector</span>
          <h1 className="wlab-title">Tuk&rsquo;s world, as data</h1>
          <p className="wlab-lede">
            No renderer yet &mdash; the clock had to come first, because nothing downstream is
            observable without it. Run at <code>&times;10000</code> and watch the chronicle
            scroll: thirty days of history plays in about four minutes.
          </p>
        </header>

        {!dev.enabled && (
          <p className="wlab-locked">
            Controls are development-only. This build follows the real clock, and the
            gate is compile-time &mdash; a production bundle does not contain them.
          </p>
        )}

        <div className="wlab-stage">
          <WorldCanvas world={world} version={version} height={340} />
        </div>

        {dev.enabled && (
          <section className="wlab-panel">
            <div className="wlab-row">
              <span className="wlab-label">Speed</span>
              <div className="wlab-chips">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="wlab-chip"
                    aria-pressed={dev.speed === s}
                    onClick={() => dev.setSpeed(s)}
                  >
                    &times;{fmt(s)}
                  </button>
                ))}
                <button
                  type="button"
                  className="wlab-chip"
                  aria-pressed={dev.paused}
                  onClick={dev.togglePause}
                >
                  {dev.paused ? 'resume' : 'pause'}
                </button>
                <button type="button" className="wlab-chip" onClick={() => dev.step(HOUR)}>
                  +1 day
                </button>
              </div>
            </div>

            <div className="wlab-row">
              <span className="wlab-label">Scrub</span>
              <input
                type="range"
                className="wlab-scrub"
                min={0}
                max={CYCLE_SECONDS * 2}
                step={HOUR / 4}
                value={Math.min(elapsed, CYCLE_SECONDS * 2)}
                onChange={(e) => dev.jumpTo(Number(e.target.value))}
                aria-label="Scrub world time"
              />
              <span className="wlab-scrub-val">day {fmt(elapsed / HOUR)}</span>
            </div>

            <div className="wlab-row">
              <span className="wlab-label">Jump to era</span>
              <div className="wlab-chips">
                {ERAS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className="wlab-chip"
                    aria-pressed={world.era === e.id}
                    onClick={() => dev.jumpToEra(e.id)}
                  >
                    {e.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="wlab-row">
              <span className="wlab-label">Cycle</span>
              <div className="wlab-chips">
                {[1, 2, 3].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="wlab-chip"
                    aria-pressed={world.cycle === c}
                    onClick={() => dev.jumpToCycle(c)}
                  >
                    {c}
                  </button>
                ))}
                <button
                  type="button"
                  className="wlab-chip"
                  onClick={() => dev.reseed(`seed-${Math.floor(elapsed)}`)}
                >
                  reseed
                </button>
                <span className="wlab-seed">{dev.seed}</span>
              </div>
            </div>
          </section>
        )}

        {/* ── readout ── */}
        <section className="wlab-stats">
          <div className="wlab-stat"><b>{world.cycle}</b><span>cycle</span></div>
          <div className="wlab-stat"><b>{era.name}</b><span>era {world.era}</span></div>
          <div className="wlab-stat"><b>{fmt(dayNumber(world))}</b><span>day</span></div>
          <div className="wlab-stat">
            <b>{clockOf(world.elapsed)}</b><span>{night ? 'night' : 'day'}</span>
          </div>
          <div className="wlab-stat wlab-stat-key"><b>{world.tuk.buried}</b><span>buried</span></div>
          <div className="wlab-stat"><b>{world.npcs.length}</b><span>alive</span></div>
          <div className="wlab-stat"><b>{standing.length}</b><span>standing</span></div>
          <div className="wlab-stat"><b>{fmt(world.events || 0)}</b><span>events / frame</span></div>
          <div className="wlab-stat"><b>{Math.round(dev.buildMs)}ms</b><span>last rebuild</span></div>
        </section>

        <div className="wlab-grid">
          {/* current action */}
          <section className="wlab-card">
            <h2>Doing</h2>
            {action ? (
              <>
                <p className="wlab-action">
                  {actionDef.verb}
                  {building && action.type === 'build' && ` ${getStructure(building.type).label}`}
                </p>
                <div className="wlab-bar"><span style={{ width: `${progress * 100}%` }} /></div>
                <p className="wlab-meta">
                  {action.duration}s &middot; x&nbsp;{Math.round(world.tuk.x)}
                  {world.pendingBurials > 0 && ` · ${world.pendingBurials} to bury`}
                </p>
              </>
            ) : <p className="wlab-empty">idle</p>}
          </section>

          {/* resources */}
          <section className="wlab-card">
            <h2>Resources</h2>
            <dl className="wlab-res">
              {Object.entries(world.resources).map(([k, v]) => (
                <div key={k} className={k === 'knowledge' ? 'is-kept' : ''}>
                  <dt>{k}</dt><dd>{fmt(v)}</dd>
                </div>
              ))}
            </dl>
            <p className="wlab-meta">knowledge is the only one that survives a collapse</p>
          </section>

          {/* structures */}
          <section className="wlab-card">
            <h2>Built <span className="wlab-count">{standing.length}</span></h2>
            {standing.length ? (
              <ul className="wlab-list">
                {standing.map((s) => (
                  <li key={s.id}>
                    {getStructure(s.type).label}
                    <span>day {fmt(s.builtAt / HOUR)}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="wlab-empty">nothing yet</p>}
            {world.ruins.length > 0 && (
              <p className="wlab-meta">{world.ruins.length} ruins from earlier cycles</p>
            )}
          </section>

          {/* alive */}
          <section className="wlab-card">
            <h2>Living <span className="wlab-count">{world.npcs.length}</span></h2>
            {world.npcs.length ? (
              <ul className="wlab-list">
                {world.npcs.map((n) => {
                  const frac = (world.elapsed - n.bornAt) / n.lifespan;
                  const stage = lifeStage(Math.min(frac, 0.999));
                  return (
                    <li key={n.id}>
                      {n.name} <em>{n.role}</em>
                      <span className={`wlab-stage is-${stage.key}`}>{stage.key}</span>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="wlab-empty">no one</p>}
          </section>

          {/* graves */}
          <section className="wlab-card">
            <h2>Graveyard <span className="wlab-count">{world.graves.length}</span></h2>
            {world.graves.length ? (
              <ul className="wlab-list wlab-graves">
                {world.graves.slice(-14).reverse().map((g) => (
                  <li key={g.id}>
                    {g.name} <em>{g.role}</em>
                    <span>day {fmt(g.diedAt / HOUR)}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="wlab-empty">empty</p>}
          </section>
        </div>

        {/* chronicle */}
        <section className="wlab-card wlab-chronicle">
          <h2>Chronicle <span className="wlab-count">{world.chronicle.length}</span></h2>
          <div className="wlab-log" ref={chronicleRef}>
            {recent.map((c, i) => (
              <p key={`${c.at}-${i}`}>
                <span className="wlab-log-day">
                  {c.cycle > 1 && <em>c{c.cycle}</em>} day {fmt(c.day)}
                </span>
                {c.text}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorldLab;
