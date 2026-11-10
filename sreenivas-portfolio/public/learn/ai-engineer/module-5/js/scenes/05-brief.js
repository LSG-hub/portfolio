/* ---------------- Attempt 2: a better prompt (Question 1) ----------------
   The improved prompt (research/case/prompt-brief.txt, instructions only, no new facts) types itself into Gemini,
   a real reply comes back, then the same ask 20 times, then all three models flip from their plain-prompt score to 20/20.
   All data REAL: window.BRIEF (data/brief-runs.js). Class names are prefixed brief-. */

Deck.scene({
  id: 'C.brief', chapter: 'Q1', title: 'Attempt 2: a better prompt', steps: 4,
  mount(root, a) {
    const B = window.BRIEF, R = { x: 395, y: 220, w: 1130, h: 720 }, CT = 112, CH = R.h - CT - 64;
    const h = a.at(a.el('div', 'h-md hide', 'Attempt 2: <span class="amber">a better prompt.</span>', root), 140, 92); h.id = 'brief-h1';
    a.reveal(h, { delay: 0.1 });
    // the email thumbnail, where the previous slides left it
    const g = Gmail.build(root, a, { x: 1600, y: 66, z: 0.74 }); Gmail.opened(g); Case.marked(g);
    gsap.set(g.win, { scale: 0.22 / 0.74, transformOrigin: '0 0', opacity: 0.9 });
    // Gemini, fresh; the composer grows to fit a long prompt, then the prompt types itself in
    const G = Gem.build(root, a, R);
    gsap.set(G.chip, { opacity: 0 });
    a.reveal(G.w, { y: 30, delay: 0.2, d: 0.8 });
    a.reveal(G.greet, { delay: 0.6, y: 10 });
    a.to(G.greet, { opacity: 0, duration: 0.3, delay: 1.3 });
    a.to(G.ph, { opacity: 0, display: 'none', duration: 0.15, delay: 1.3 });
    a.to(G.comp, { top: CT, height: CH, duration: 0.6, delay: 1.4, ease: 'power3.inOut' });
    const wrap = a.el('div', 'brief-wrap', `<span class="brief-txt"></span><div class="brief-tail" style="opacity:0;margin-top:14px;white-space:normal;font-family:var(--mono);font-size:13.5px;color:#9aa0a6">&lt;email&gt;<div style="margin:8px 0;font-family:var(--sans)">${Gem.chip(true)}</div>&lt;/email&gt;</div>`, G.comp);
    Object.assign(wrap.style, { position: 'absolute', left: '26px', right: '26px', top: '20px', fontSize: '15.5px', lineHeight: 1.48, whiteSpace: 'pre-wrap', color: '#e3e3e3' });
    const T = 2.1, cps = 150, done = T + B.instructions.length / cps;
    a.type(wrap.querySelector('.brief-txt'), B.instructions, cps, T);
    a.to(wrap.querySelector('.brief-tail'), { opacity: 1, duration: 0.4, delay: done + 0.1 });
    a.to(G.send, { opacity: 1, duration: 0.2, delay: done + 0.2 });
    // the user's message once sent: long, so Gemini shows its start and a "Show more"
    G.user.innerHTML = `<div style="font-size:16px;line-height:1.45;max-width:520px">You are Arjun, a client relationship manager at Brightline. Write a reply to the client email below.<br><span style="color:#9aa0a6">Rules: Answer each of her questions, in order…</span></div>
      <div style="margin-top:8px">${Gem.chip(false)}</div><div style="margin-top:8px;font-size:13px;color:#a8c7fa">Show more ▾</div>`;
    gsap.set(G.resp, { top: 300 });
    G.respT.innerHTML = B.excerpt.map((l, k) => `<div class="brief-line" style="opacity:0;margin-top:${k ? 10 : 0}px">${l}</div>`).join('');
    const tag = a.at(a.el('div', 'abs mono', `REAL REPLY · RUN ${B.excerptRun} OF 20 · IN FULL`, G.w), 80, 272);
    Object.assign(tag.style, { fontSize: '12px', letterSpacing: '.16em', color: '#8e918f', opacity: 0 }); tag.id = 'brief-tag';

    // 20 cards: what each real run said (every one: confirm by 5 PM, and check on the discount)
    const X0 = 145, Y0 = 210, CW = 310, CHt = 150, GX = 20, GY = 18;
    const row = (lab, val) => `<div style="display:flex;align-items:baseline;gap:12px;margin-top:9px">
      <span class="mono" style="flex:none;width:76px;font-size:11.5px;letter-spacing:.12em;color:var(--dim)">${lab}</span><span style="font-size:18px;color:var(--ink)">${val}</span></div>`;
    const cards = B.rows[0].vAfter.map((v, k) => {
      const c = a.at(a.el('div', 'brief-card abs', `<div class="mono" style="font-size:12px;letter-spacing:.14em;color:var(--dim);display:flex;align-items:center;gap:8px">${Gem.sparkle(13)}RUN ${String(k + 1).padStart(2, '0')}</div>
        ${row('LIVE', 'Confirm by 5 PM')}${row('CONTACT', 'Confirm by 5 PM')}${row('20% OFF', 'Checking')}`, root),
        X0 + (k % 5) * (CW + GX), Y0 + Math.floor(k / 5) * (CHt + GY), CW);
      Object.assign(c.style, { height: CHt + 'px', padding: '13px 16px', borderRadius: '12px', background: 'var(--panel)', border: '1px solid var(--green)', opacity: 0, zIndex: 8 });
      return c;
    });
    const cap = a.at(a.el('div', 'abs mono hide', `<span style="color:var(--green)">20 OF 20 · NOTHING INVENTED · NO DISCOUNT PROMISED · ${B.words[0]} TO ${B.words[1]} WORDS EACH</span>`, root), 0, 896);
    Object.assign(cap.style, { width: '1920px', textAlign: 'center', fontSize: '22px', letterSpacing: '.12em' }); cap.id = 'brief-cap';

    // three models: from their plain-prompt score to the better prompt (click 3)
    const kick = a.at(a.el('div', 'abs mono hide', 'SAFE TO SEND · PLAIN PROMPT → BETTER PROMPT · 20 REAL RUNS EACH', root), 0, 286);
    Object.assign(kick.style, { width: '1920px', textAlign: 'center', fontSize: '18px', letterSpacing: '.22em', color: 'var(--amber)' }); kick.id = 'brief-kick';
    const rows = B.rows.map((r, k) => {
      const y = 370 + k * 150;
      const lab = a.at(a.el('div', 'abs hide brief-lab', `<span style="font-family:var(--serif);font-size:40px;color:var(--ink)">${r.name}</span>`, root), 200, y - 8);
      const dots = a.at(a.el('div', 'abs hide', r.vBefore.map(v => `<i class="brief-dot" style="width:28px;height:28px;border-radius:50%;display:inline-block;margin-right:12px;background:${v ? 'var(--green)' : 'var(--red)'}"></i>`).join(''), root), 640, y + 6);
      dots.style.whiteSpace = 'nowrap';
      const n = a.at(a.el('div', 'abs hide', `<span class="brief-v" style="font-family:var(--serif);font-size:64px;color:var(--green)">${r.before}</span><span class="mono" style="font-size:20px;color:var(--dim);margin-left:10px">/ 20</span>
        <span class="mono brief-was" style="display:block;font-size:14px;letter-spacing:.14em;color:var(--dim);opacity:0">WAS ${r.before}</span>`, root), 1480, y - 24);
      n.style.whiteSpace = 'nowrap';
      return { r, lab, dots, n };
    });
    const end = a.at(a.el('div', 'abs hide', 'Same email. A better prompt. <span class="amber">60 of 60 safe to send.</span>', root), 0, 900);
    Object.assign(end.style, { width: '1920px', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: '46px', color: 'var(--ink)' }); end.id = 'brief-end';
    const src = a.at(a.el('div', 'abs mono hide', `SOURCE · GEMINI 3.8 FLASH, GPT-5.6 LUNA, GPT-6 LUNA · 20 RUNS EACH · DEFAULT SETTINGS · ${B.date.toUpperCase()}`, root), 900, 1040);
    Object.assign(src.style, { width: '960px', textAlign: 'right', fontSize: '13px', letterSpacing: '.14em', color: 'var(--faint)' }); src.id = 'brief-src';
    const cur = UI.cursor(root, a, 1900, 1100);
    Deck._cb = { G, cards, rows, cur, h, wrap, R, CT, CH };
  },
  step(i, a) {
    const { G, cards, rows, cur, h, wrap, R, CT, CH } = Deck._cb;
    if (i === 0) {
      // send it; the composer collapses, the long message shows as a bubble, the real reply streams in
      const s = { x: R.x + 135 + 860 - 35, y: R.y + CT + CH - 31 };
      cur.show(0); cur.move(s.x, s.y, 0.6, 0.05);
      cur.press(0.7); cur.hide(1.1);
      a.to([wrap, G.send, G.comp.children[2]], { opacity: 0, duration: 0.25, delay: 0.85 });
      a.to(G.comp, { top: R.h - 116, height: 64, duration: 0.5, delay: 0.95, ease: 'power3.inOut' });
      a.to(G.ph.parentNode, { top: 20, duration: 0.01, delay: 0.95 });
      a.to(G.ph, { opacity: 1, display: 'inline', duration: 0.2, delay: 1.4 });
      a.fromTo(G.user, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, delay: 1.1, ease: 'power3.out' });
      a.to(G.resp, { opacity: 1, duration: 0.3, delay: 1.7 });
      a.to(G.respT.querySelectorAll('.brief-line'), { opacity: 1, duration: 0.35, stagger: 0.3, delay: 1.8 });
      a.to('#brief-tag', { opacity: 1, duration: 0.4, delay: 4.2 });
    }
    if (i === 1) {
      // the same ask, 20 times: all green
      a.to(h, { opacity: 0, y: -16, duration: 0.3 });
      const h2 = document.getElementById('brief-h2') || a.at(a.el('div', 'h-md', 'Now ask it <span class="amber">20 times.</span>', h.parentNode), 140, 92);
      h2.id = 'brief-h2'; a.fromTo(h2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' });
      a.to(G.w, { opacity: 0, scale: 0.97, duration: 0.6 });
      const from = UI.pos(G.resp);
      cards.forEach((c, k) => {
        const p = { cx: parseFloat(c.style.left) + 155, cy: parseFloat(c.style.top) + 75 };
        a.fromTo(c, { opacity: 0, x: from.x + 150 - p.cx, y: from.y + 120 - p.cy, scale: 0.4 },
          { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.7, delay: 0.25 + k * 0.06, ease: 'power3.out' });
      });
      a.reveal('#brief-cap', { delay: 1.8 });
      a.reveal('#brief-src', { delay: 1.8 });
    }
    if (i === 2) {
      // every model, before and after: the dots flip from their plain-prompt verdicts to green
      a.to([...cards, '#brief-cap'], { opacity: 0, duration: 0.4 });
      a.to('#brief-h2', { opacity: 0, duration: 0.3 });
      const h3 = document.getElementById('brief-h3') || a.at(a.el('div', 'h-md', 'Every model. <span class="amber">Same prompt.</span>', h.parentNode), 140, 92);
      h3.id = 'brief-h3'; a.fromTo(h3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' });
      a.reveal('#brief-kick', { delay: 0.4 });
      rows.forEach(({ r, lab, dots, n }, k) => {
        const t0 = 0.6 + k * 1.2;
        a.reveal([lab, dots, n], { delay: t0, y: 0 });
        a.to(dots.querySelectorAll('.brief-dot'), { backgroundColor: '#5fd39a', duration: 0.2, stagger: 0.03, delay: t0 + 0.5 });
        a.count(n.querySelector('.brief-v'), r.after, { from: r.before, d: 0.6, delay: t0 + 0.5 });
        a.to(n.querySelector('.brief-was'), { opacity: 1, duration: 0.3, delay: t0 + 1.1 });
      });
    }
    if (i === 3) a.reveal('#brief-end');
  },
});
