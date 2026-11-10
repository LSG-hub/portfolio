/* Shared UI helpers for Cut 3: stage coordinates of any element, and the demo cursor (glides, presses, ripples). */
window.UI = (function () {
  /** an element's box in stage coordinates (1920×1080), whatever the zoom */
  function pos(el) {
    const st = document.getElementById('stage').getBoundingClientRect(), k = st.width / 1920, r = el.getBoundingClientRect();
    return { x: (r.left - st.left) / k, y: (r.top - st.top) / k, w: r.width / k, h: r.height / k,
      cx: (r.left + r.width / 2 - st.left) / k, cy: (r.top + r.height / 2 - st.top) / k };
  }
  /** a demo cursor; its tip sits at (x, y). move() glides, press() presses with a ripple, hide() fades it */
  function cursor(root, a, x = 1900, y = 1100) {
    const c = a.at(a.el('div', 'ui-cursor', `<svg width="34" height="40" viewBox="0 0 34 40" style="position:absolute;left:-3px;top:-2px">
      <path d="M3 2 L3 32 L11 25 L16 37 L22 34.5 L17 23 L28 23 Z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/></svg>
      <span class="ui-ripple"></span>`, root), 0, 0);
    Object.assign(c.style, { zIndex: 30, pointerEvents: 'none', width: '1px', height: '1px' });
    const rip = c.querySelector('.ui-ripple');
    Object.assign(rip.style, { position: 'absolute', left: '-18px', top: '-18px', width: '36px', height: '36px', borderRadius: '50%',
      border: '3px solid rgba(255,255,255,.95)', boxShadow: '0 0 0 2px rgba(0,0,0,.35)', opacity: 0 });
    gsap.set(c, { x, y });
    return {
      el: c,
      move(tx, ty, d = 1, delay = 0) { return a.to(c, { x: tx, y: ty, duration: d, delay, ease: 'power2.inOut' }); },
      press(delay = 0) {
        a.fromTo(c.querySelector('svg'), { scale: 1 }, { scale: 0.84, duration: 0.09, delay, yoyo: true, repeat: 1, transformOrigin: '3px 2px' });
        a.fromTo(rip, { opacity: 0.95, scale: 0.3 }, { opacity: 0, scale: 1.7, duration: 0.6, delay, ease: 'power2.out' });
      },
      show(delay = 0) { a.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.3, delay }); },
      hide(delay = 0) { a.to(c, { opacity: 0, duration: 0.3, delay }); },
    };
  }
  return { pos, cursor };
})();
