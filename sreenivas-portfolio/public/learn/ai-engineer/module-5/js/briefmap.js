/* The prompt we're building: one strip that grows across the chapters. A chapter's closing beat steps the slide back and
   brings the strip up: pieces already built are ticked (green), the one this chapter built is lit (amber), the rest wait
   (dashed). One cell per roadmap chapter, named as the roadmap names it. Class names are prefixed bm-. */
window.BriefMap = (function () {
  const PIECES = [
    ['5.2', 'Input format'], ['5.3', 'System prompting'], ['5.4', 'Role & behaviour'], ['5.5', 'Constraining prompts'], ['5.6', 'Contextual prompting'],
    ['5.7', 'Zero-shot'], ['5.8', 'Few-shot'], ['5.9', 'Chain-of-thought'], ['5.10', 'ReAct'],
  ];
  const W = 1600, GAP = 14, CW = (W - GAP * (PIECES.length - 1)) / PIECES.length;
  /** build(root, a, { y, done: [index…], now: [index…], title }) → the strip, hidden until show() */
  function build(root, a, o) {
    const done = new Set(o.done || []), now = new Set(o.now || []);
    const cells = PIECES.map(([n, t], k) => {
      const st = done.has(k) ? 'done' : now.has(k) ? 'now' : 'todo';
      const bd = st === 'done' ? '2px solid var(--green)' : st === 'now' ? '2px solid var(--line-2)' : '2px dashed var(--line-2)';
      const mark = st === 'done' ? '<span style="color:var(--green)">✓ </span>' : '';
      return `<div class="bm-cell bm-${st}" style="position:absolute;left:${k * (CW + GAP)}px;top:0;width:${CW}px;height:128px;box-sizing:border-box;padding:16px 14px;border-radius:14px;border:${bd};background:${st === 'todo' ? 'var(--bg)' : 'var(--panel)'};opacity:0">
        <div class="mono" style="font-size:14px;letter-spacing:.1em;color:${st === 'todo' ? 'var(--faint)' : 'var(--dim)'}">${mark}${n}</div>
        <div style="margin-top:10px;font-family:var(--serif);font-size:22px;line-height:1.15;color:${st === 'todo' ? 'var(--dim)' : 'var(--ink)'}">${t}</div></div>`;
    }).join('');
    const c = a.at(a.el('div', 'abs bm-strip', `<div class="mono bm-k" style="position:absolute;left:0;top:-46px;font-size:16px;letter-spacing:.18em;color:var(--amber);opacity:0">${o.title || 'THE PROMPT WE’RE BUILDING'}</div>${cells}`, root), (1920 - W) / 2, o.y ?? 420, W);
    Object.assign(c.style, { height: '128px', zIndex: 12 });
    return c;
  }
  /** the strip builds itself: the kicker, the cells left to right, then this chapter's pieces light up */
  function show(a, c, delay = 0) {
    a.to(c.querySelector('.bm-k'), { opacity: 1, duration: 0.4, delay });
    a.fromTo(c.querySelectorAll('.bm-cell'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, delay: delay + 0.15, ease: 'power3.out' });
    const lit = c.querySelectorAll('.bm-now');
    if (lit.length) {
      a.to(lit, { borderColor: '#f2b84b', boxShadow: '0 0 0 4px rgba(242,184,75,.18), 0 0 40px rgba(242,184,75,.35)', duration: 0.5, delay: delay + 1.0, stagger: 0.15 });
      a.fromTo(lit, { scale: 1 }, { scale: 1.06, duration: 0.25, delay: delay + 1.0, stagger: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
    }
  }
  /** the chapter-end beat: everything on the slide steps back except `keep`, and the strip builds in front */
  function checkpoint(a, root, c, keep = []) {
    [...root.children].forEach(el => {
      if (el === c || keep.includes(el) || el.tagName === 'STYLE') return;
      if (+gsap.getProperty(el, 'opacity') > 0.15) a.to(el, { opacity: 0.05, duration: 0.5, ease: 'power2.out' });
    });
    show(a, c, 0.35);
  }
  return { build, show, checkpoint, PIECES };
})();
