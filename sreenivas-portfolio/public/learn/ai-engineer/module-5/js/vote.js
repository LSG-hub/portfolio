/* Live audience vote, drawn inside a scene: a QR code + short URL on the left, one bar per option on the right.
   The live source is not wired yet (planned: Firestore, so phones write votes and this slide listens).
   Until then the bars sit at zero with a "not connected" tag; add ?demo to the URL to see simulated votes arrive. */
window.Vote = (function () {
  const DEMO = new URLSearchParams(location.search).has('demo');

  /** mount(root, a, { id, question, options: [label…], url, x, y }) → { show(a), set(counts) } */
  function mount(root, a, o) {
    const box = a.at(a.el('div', 'abs hide', '', root), 0, 0); box.id = 'vote-' + o.id;
    Object.assign(box.style, { width: '1920px', height: '1080px', zIndex: 6 });

    // left: where to vote (the QR is a placeholder until the vote page exists)
    const qr = a.at(a.el('div', 'abs', `
      <div class="kicker" style="margin-bottom:22px">Vote now</div>
      <div class="vote-qr" style="width:300px;height:300px;border-radius:18px;border:2px dashed var(--line-2);background:var(--bg);display:flex;align-items:center;justify-content:center;
        font-family:var(--mono);font-size:16px;letter-spacing:.2em;color:var(--faint)">QR CODE</div>
      <div class="mono" style="margin-top:22px;font-size:24px;color:var(--ink)">${o.url}</div>
      <div class="mono" style="margin-top:8px;font-size:15px;color:var(--dim);letter-spacing:.06em">scan, or type it in your browser</div>`, box), 230, 330);

    // right: one bar per option, counts and percentages
    const X = 720, BW = 940, Y0 = 360, GAP = 150;
    const rows = o.options.map((label, k) => {
      const r = a.at(a.el('div', 'abs', `
        <div style="display:flex;align-items:baseline;justify-content:space-between;width:${BW}px">
          <span style="font-family:var(--serif);font-size:42px;color:var(--ink)">${label}</span>
          <span class="mono"><span class="vc" style="font-size:30px;color:var(--ink)">0</span><span class="vp" style="font-size:20px;color:var(--dim);margin-left:14px">0%</span></span></div>
        <div style="margin-top:16px;width:${BW}px;height:26px;border-radius:13px;background:rgba(236,232,223,.07);overflow:hidden">
          <div class="vb" style="height:100%;width:0;border-radius:13px;background:${k === 0 ? 'var(--amber)' : k === 1 ? 'var(--ink-2)' : 'var(--dim)'}"></div></div>`, box), X, Y0 + k * GAP);
      return r;
    });
    const foot = a.at(a.el('div', 'abs mono', '', box), X, Y0 + o.options.length * GAP + 10);
    foot.style.cssText += 'font-size:17px;letter-spacing:.14em;color:var(--dim)';
    const tag = DEMO ? 'DEMO VOTES · SIMULATED' : 'LIVE VOTE · NOT CONNECTED YET';
    foot.innerHTML = `<span class="vt">0</span> VOTES · <span style="color:${DEMO ? 'var(--amber)' : 'var(--faint)'}">${tag}</span>`;

    let counts = o.options.map(() => 0);
    function set(next, instant) {
      counts = next.slice();
      const total = counts.reduce((s, v) => s + v, 0);
      rows.forEach((r, k) => {
        const p = total ? counts[k] / total : 0;
        r.querySelector('.vc').textContent = counts[k];
        r.querySelector('.vp').textContent = Math.round(p * 100) + '%';
        gsap.to(r.querySelector('.vb'), { width: (p * 100) + '%', duration: instant ? 0 : 0.6, ease: 'power2.out' });
      });
      foot.querySelector('.vt').textContent = total;
    }
    function show(a) {
      a.reveal(box, { y: 0, d: 0.6 });
      if (DEMO && a.instant) { set([22, 10, 8], true); return; } // jumped straight here (or presenter preview): show a settled demo result
      if (DEMO) {
        // simulated audience: votes trickle in, then a rush, then stop at ~40 people
        const w = [0.55, 0.25, 0.20]; let n = 0;
        a.loop(() => {
          if (n >= 40) return;
          const add = n < 6 ? 1 : 2; const c = counts.slice();
          for (let j = 0; j < add; j++) { let r = Math.random(), k = 0; while (k < w.length - 1 && r > w[k]) { r -= w[k]; k++; } c[k]++; n++; }
          set(c);
        }, 450);
      }
    }
    return { box, qr, show, set };
  }
  return { mount, DEMO };
})();
