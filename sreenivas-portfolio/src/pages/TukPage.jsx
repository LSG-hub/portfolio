import React from 'react';
import { Link } from 'react-router-dom';
import TukRibbon from '../components/avatar/TukRibbon';
import '../styles/components/tuk-page.css';

/**
 * /tuk — the house, given a page of its own.
 *
 * It used to be a strip along the bottom of every page, and that was the wrong
 * trade: a five-minute day against a ninety-second visit meant the median visitor
 * saw three of eighteen beats, while it cost an eighth of a laptop viewport
 * everywhere. Here it costs nothing anyone didn't ask for, and someone who is
 * interested can watch a whole day.
 *
 * TukRibbon is unchanged and still pins itself to the bottom of the window, so
 * the copy scrolls above the room rather than around it. That also means the day
 * keeps running while you read about it, which is the right way round.
 */

const TukPage = () => (
  <div className="tuk-page">
    <div className="container-prose">
      <Link to="/" className="tuk-page-back">&larr; Back to the portfolio</Link>

      <header className="tuk-page-header">
        <span className="eyebrow">A robot with a routine</span>
        <h1 className="tuk-page-title">Tuk, at home</h1>
        <p className="tuk-page-lede">
          The strip along the bottom of this page is where Tuk lives. He wakes on his
          charging pad, boils a kettle he has no use for, waters a plant, works at a desk,
          sweeps a floor nobody looks at, watches something on television, and goes back to
          bed. It takes about five minutes, and then he does it again.
        </p>
      </header>

      <section className="tuk-page-notes">
        <h2 className="tuk-page-h2">How it works</h2>
        <ul className="numbered-list tuk-page-list">
          <li>
            <strong>Eighteen beats, five minutes.</strong> That number is a content budget
            rather than a feel: eighteen authored chores at a natural length come to roughly
            300 seconds. The day is compressed, never his movement &mdash; beats are short and
            his hop speed is untouched physics, which is how stop-motion reads as a timelapse
            instead of a fast-forward.
          </li>
          <li>
            <strong>He stands on your actual DOM.</strong> Every surface tagged as a platform
            contributes its top edge, harvested by <code>getBoundingClientRect()</code>. Move a
            piece of furniture in CSS and where he stands to use it moves with it.
          </li>
          <li>
            <strong>The light is a curve, not a state.</strong> Dawn, midday, dusk and night are
            keyframes sampled continuously from his position in the day, because a CSS gradient
            cannot be transitioned &mdash; <code>background-image</code> does not interpolate, so
            four named states cut between frames. The lamp, both screens and the daylight through
            the window ride the same curve in opposite directions.
          </li>
          <li>
            <strong>He talks about what he is doing.</strong> Lines belong to the action, not the
            room, and the ones where his hands are full are deliberately silent. Roughly one visit
            in eight draws from a rarer set, which is where his story lives.
          </li>
          <li>
            <strong>The television is showing a civilisation.</strong> Silhouettes rise out of a
            horizon, stand a while, and fall, on their own day. It is a separate simulation, shrunk
            to two inches and left playing in the corner of his living room.
          </li>
        </ul>

        <p className="tuk-page-foot">
          Everywhere else on this site he stands on his charging pad in the corner, out of the way.
          Linger near him with a cursor and he will take off after it.
        </p>
      </section>
    </div>

    <TukRibbon />
  </div>
);

export default TukPage;
