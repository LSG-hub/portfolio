import React from 'react';

/**
 * Comic-style speech bubble with a tail pointing down at Tuk's screen.
 *
 * Parented to the actor's *unscaled* wrapper, not the body — otherwise it
 * inherits the squash and the facing flip, and the text renders mirrored the
 * moment he turns left.
 *
 * `side` flips which way the tail leans so the bubble stays inside the
 * container when he's near an edge.
 */
const SpeechBubble = ({ text, visible, side = 'right' }) => (
  <div
    className={`tuk-bubble tuk-bubble-${side} ${visible ? 'is-visible' : ''}`}
    aria-hidden={!visible}
  >
    <span className="tuk-bubble-text">{text}</span>
    <span className="tuk-bubble-tail" aria-hidden="true" />
  </div>
);

export default SpeechBubble;
