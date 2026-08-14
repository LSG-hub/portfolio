import React, { useLayoutEffect, useRef } from 'react';

/**
 * Comic-style speech bubble with a tail pointing down at Tuk's screen.
 *
 * Parented to the actor's *unscaled* wrapper, not the body — otherwise it
 * inherits the squash and the facing flip, and the text renders mirrored the
 * moment he turns left.
 *
 * `side` flips which way the tail leans so the bubble stays inside the
 * container when he's near an edge.
 *
 * ── Why the width is measured in JS ─────────────────────────────────────
 * CSS cannot size a box to its own wrapped text. `width: max-content` with a
 * `max-width` gives the box the full max-width as soon as the text wraps, and
 * shrink-to-fit never reflows it down to the longest resulting LINE — it uses the
 * unwrapped width. A two-line bubble was therefore always 190px wide however
 * short its lines were: "This chapter is about mortality." wrapped to a longest
 * line of 90px and sat in a 190px box, 78px of it empty.
 *
 * So: let it wrap, ask the range for its line boxes, and pin the width to the
 * widest one. `text-wrap: balance` runs first, which evens the lines and so
 * shortens that widest one, making the final box tighter still.
 */
const SpeechBubble = ({ text, visible, side = 'right' }) => {
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || !text) return;

    el.style.width = '';           // let it wrap freely again before measuring
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = Array.from(range.getClientRects()).filter((r) => r.width > 1);
    if (rects.length < 2) return;  // a single line is already tight

    /**
     * getClientRects reports TRANSFORMED geometry, and the bubble is scaled to
     * 0.88 while hidden and mid-spring. Measuring during that would set a width
     * 12% too small and push the text onto a third line, so normalise against the
     * element's untransformed layout width.
     */
    const scale = el.getBoundingClientRect().width / (el.offsetWidth || 1);
    const longest = Math.max(...rects.map((r) => r.width)) / (scale || 1);
    el.style.width = `${Math.ceil(longest) + 1}px`;
  }, [text]);

  return (
    <div
      className={`tuk-bubble tuk-bubble-${side} ${visible ? 'is-visible' : ''}`}
      aria-hidden={!visible}
    >
      <span className="tuk-bubble-text" ref={textRef}>{text}</span>
      <span className="tuk-bubble-tail" aria-hidden="true" />
    </div>
  );
};

export default SpeechBubble;
