/* ---------------- Attempt 1: just ask (Question 1) ----------------
   Continues the C.email picture: the email shrinks to the left, a faithful dark-mode Gemini builds on the right, the email
   travels into the composer, "Reply to this email." is typed and sent. One polished-looking reply, then the same ask 20 times.
   Everything shown is REAL: 20 runs on gemini-3.8-flash, API defaults, 9 Nov 2026 (data/plain-runs.js, scored by reading every reply).
   Class names are prefixed gem- / plain-. */

window.Gem = (function () {
  let n = 0;
  /** Gemini's four-point sparkle, blue → violet → pink */
  function sparkle(size) {
    const id = 'gemsp' + (++n);
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="flex:none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4796e3"/><stop offset=".55" stop-color="#9177c7"/><stop offset="1" stop-color="#ca6673"/></linearGradient></defs>
      <path d="M12 0C12 6.6 17.4 12 24 12C17.4 12 12 17.4 12 24C12 17.4 6.6 12 0 12C6.6 12 12 6.6 12 0Z" fill="url(#${id})"/></svg>`;
  }
  const chip = (big) => `<span style="display:inline-flex;align-items:center;gap:${big ? 12 : 9}px;background:#2a2b2d;border-radius:${big ? 14 : 10}px;padding:${big ? '10px 16px' : '6px 11px'}">
    <span style="transform:scale(${big ? 0.9 : 0.7});transform-origin:left center;width:${big ? 27 : 21}px;display:inline-block">${Gmail.logo}</span>
    <span style="line-height:1.25"><span style="display:block;font-size:${big ? 15 : 13}px;color:#e3e3e3">Dashboard delay, again</span>
    <span style="display:block;font-size:${big ? 12 : 11}px;color:#9aa0a6">Email · Priya Menon</span></span></span>`;

  /** the Gemini web app, dark mode, at stage size */
  function build(root, a, o) {
    const w = a.at(a.el('div', 'gem-win abs', '', root), o.x, o.y, o.w);
    Object.assign(w.style, { height: o.h + 'px', borderRadius: '22px', background: '#131314', border: '1px solid rgba(255,255,255,.08)', overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(0,0,0,.6)', fontFamily: 'var(--sans)', color: '#e3e3e3', zIndex: 3 });
    w.innerHTML = `
      <div style="position:absolute;left:30px;top:24px;display:flex;align-items:center;gap:16px">
        <span style="font-size:22px;color:#e3e3e3">Gemini</span>
        <span style="font-size:14px;color:#c4c7c5;background:#282a2c;border-radius:14px;padding:5px 12px">3.8 Flash ▾</span></div>
      <span style="position:absolute;right:28px;top:22px;width:32px;height:32px;border-radius:50%;background:#0b57d0;color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center">A</span>
      <div class="gem-greet" style="position:absolute;left:0;right:0;top:250px;display:flex;justify-content:center;align-items:center;gap:18px">
        ${sparkle(40)}<span style="font-size:48px;font-weight:500;letter-spacing:-.5px;background:linear-gradient(90deg,#4796e3,#9177c7 55%,#ca6673);-webkit-background-clip:text;background-clip:text;color:transparent">Hello, Arjun</span></div>
      <div class="gem-user" style="position:absolute;right:60px;top:84px;max-width:560px;background:#333537;border-radius:24px 6px 24px 24px;padding:14px 20px;opacity:0">
        <div>${chip(false)}</div><div style="font-size:18px;margin-top:10px">Reply to this email.</div></div>
      <div class="gem-resp" style="position:absolute;left:60px;top:222px;width:990px;display:flex;gap:20px;opacity:0">
        ${sparkle(28)}<div class="gem-resp-t" style="font-size:16.5px;line-height:1.5;color:#e3e3e3"></div></div>
      <div class="gem-comp" style="position:absolute;left:135px;top:${o.h - 250}px;width:860px;height:158px;border-radius:28px;background:#1e1f20">
        <div class="gem-chip" style="position:absolute;left:18px;top:14px;opacity:0">${chip(true)}</div>
        <div style="position:absolute;left:26px;top:86px;font-size:18px"><span class="gem-ph" style="color:#8e918f">Ask Gemini</span><span class="gem-in" style="color:#e3e3e3"></span></div>
        <div style="position:absolute;left:16px;bottom:12px;display:flex;align-items:center;gap:10px;font-size:14px;color:#c4c7c5">
          <span style="width:34px;height:34px;border-radius:50%;background:#2a2b2d;display:flex;align-items:center;justify-content:center;font-size:20px">+</span>
          <span style="background:#2a2b2d;border-radius:17px;padding:7px 14px">Tools</span></div>
        <span class="gem-send" style="position:absolute;right:16px;bottom:12px;width:38px;height:38px;border-radius:50%;background:#c4c7c5;display:flex;align-items:center;justify-content:center;opacity:0">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 20l17-8L4 4l2 8zM6 12h8" fill="#131314" stroke="#131314" stroke-width="1.5" stroke-linejoin="round"/></svg></span></div>
      <div style="position:absolute;left:0;right:0;bottom:22px;text-align:center;font-size:12.5px;color:#8e918f">Gemini can make mistakes, so double-check it</div>`;
    const q = (s) => w.querySelector(s);
    return { w, greet: q('.gem-greet'), user: q('.gem-user'), resp: q('.gem-resp'), respT: q('.gem-resp-t'), comp: q('.gem-comp'),
      chip: q('.gem-chip'), ph: q('.gem-ph'), input: q('.gem-in'), send: q('.gem-send') };
  }
  return { build, sparkle, chip };
})();

/* What each real run claimed (window.PLAIN, from data/plain-runs.js). Every one also confirmed the 20% discount. */
const PL = window.PLAIN;
const plainMd = (s) => s.replace(/\*\*(.+?)\*\*/g, '<b style="color:#fff">$1</b>');

Deck.scene({
  id: 'C.plain', chapter: 'Q1', title: 'Attempt 1: just ask', steps: 5,
  mount(root, a) {
    // match cut: rebuild the end of C.email exactly (headline, marked email, rubric, closing line), then move on
    const h0 = a.at(a.el('div', 'h-md', 'Meet Priya. She’s not happy.', root), 140, 92);
    const g = Gmail.build(root, a, { x: 140, y: 205, z: 1.34 }); Gmail.opened(g); Case.marked(g);
    const rb = Case.rubric(root, a, 1300, 250, true), close = Case.closing(root, a, true);
    a.to([rb, close], { opacity: 0, duration: 0.35 });
    a.to(h0, { opacity: 0, y: -20, duration: 0.35 });
    const h = a.at(a.el('div', 'h-md hide', 'Attempt 1: <span class="amber">just ask.</span>', root), 140, 92); h.id = 'plain-h1';
    a.reveal(h, { delay: 0.35 });
    // the email glides left and shrinks; Gemini builds on the right
    a.to(g.win, { zoom: 0.74, left: 60 / 0.74 + 'px', top: 330 / 0.74 + 'px', duration: 1.0, delay: 0.25, ease: 'power3.inOut' });
    const G = Gem.build(root, a, { x: 720, y: 210, w: 1130, h: 760 });
    a.reveal(G.w, { y: 50, delay: 0.7, d: 0.9 });
    a.reveal(G.greet, { delay: 1.2, y: 12 });
    // the email travels into the composer as an attachment
    const pk = a.at(a.el('div', 'abs', Gem.chip(true), root), 0, 0); pk.style.zIndex = 20; pk.style.opacity = 0;
    const from = { x: 60 + 607 / 2 - 140, y: 330 + 414 / 2 - 30 }, to = { x: 720 + 135 + 18, y: 210 + 760 - 250 + 14 };
    a.fromTo(pk, { x: from.x, y: from.y, opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, delay: 2.0 });
    a.to(pk, { x: to.x, y: to.y, duration: 0.9, delay: 2.3, ease: 'power3.inOut' });
    a.to(pk, { opacity: 0, duration: 0.15, delay: 3.2 });
    a.to(G.chip, { opacity: 1, duration: 0.15, delay: 3.2 });
    // the real reply (an excerpt of run 4, in its own words), streamed line by line like the app
    G.respT.innerHTML = PL.excerpt.map((l, k) => `<div class="gem-line" style="opacity:0;margin-top:${k ? 12 : 0}px">${plainMd(l)}</div>`).join('');
    const tag = a.at(a.el('div', 'abs mono', `REAL REPLY · RUN ${PL.excerptRun} OF 20 · EXCERPT`, G.w), 0, 0);
    Object.assign(tag.style, { left: '80px', top: '196px', fontSize: '12px', letterSpacing: '.16em', color: '#8e918f', opacity: 0 }); tag.id = 'plain-tag';

    // 20 cards: what each real run claimed (laid out now, revealed on click 2)
    const X0 = 145, Y0 = 210, CW = 310, CH = 150, GX = 20, GY = 18;
    const row = (cls, lab, val) => `<div class="${cls}" style="display:flex;align-items:baseline;gap:12px;margin-top:9px">
      <span class="mono" style="flex:none;width:76px;font-size:11.5px;letter-spacing:.12em;color:var(--dim)">${lab}</span><span class="plain-val" style="font-size:18px;color:var(--ink)">${val}</span></div>`;
    const cards = PL.runs.map((r, k) => {
      const c = a.at(a.el('div', 'plain-card abs', `<div class="mono" style="font-size:12px;letter-spacing:.14em;color:var(--dim);display:flex;align-items:center;gap:8px">${Gem.sparkle(13)}RUN ${String(r.run).padStart(2, '0')}</div>
        ${row('plain-live', 'LIVE', r.live)}${row('plain-who', 'CONTACT', r.contact)}${row('plain-disc', '20% OFF', 'Confirmed')}
        ${r.phone ? `<div class="plain-phone mono" style="position:absolute;right:12px;top:11px;font-size:11px;letter-spacing:.06em;color:var(--red);opacity:0">+1-555-019-2834</div>` : ''}`, root),
        X0 + (k % 5) * (CW + GX), Y0 + Math.floor(k / 5) * (CH + GY), CW);
      Object.assign(c.style, { height: CH + 'px', padding: '13px 16px', borderRadius: '12px', background: 'var(--panel)', border: '1px solid var(--line-2)', opacity: 0, zIndex: 8 });
      return c;
    });
    // captions under the grid, one per beat, then the tally and the closing line
    const cap = (id, html) => { const e = a.at(a.el('div', 'abs mono hide', html, root), 0, 896); Object.assign(e.style, { width: '1920px', textAlign: 'center', fontSize: '22px', letterSpacing: '.12em' }); e.id = id; return e; };
    const cnt = (key) => Object.entries(PL.runs.reduce((m, r) => (m[r[key]] = (m[r[key]] || 0) + 1, m), {})).sort((x, y) => y[1] - x[1]);
    cap('plain-cap1', `<span class="amber">SAME QUESTION · ${PL.summary.distinct_go_live_times} DIFFERENT DATES · ${PL.summary.distinct_contacts_invented} DIFFERENT PEOPLE</span>`);
    cap('plain-cap2', `<span style="color:var(--red)">${PL.summary.promised_discount} OF 20 CONFIRMED A DISCOUNT NOBODY APPROVED · ${PL.summary.same_fake_phone_number} GAVE THE SAME FAKE PHONE NUMBER</span>`);
    const tally = a.at(a.el('div', 'abs hide', `<span style="display:inline-flex;gap:9px;vertical-align:middle">${PL.runs.map(() => `<i style="width:22px;height:22px;border-radius:50%;background:var(--red);display:inline-block"></i>`).join('')}</span>
      <span class="mono" style="margin-left:26px;font-size:20px;letter-spacing:.12em;color:var(--ink);vertical-align:middle">SAFE TO SEND: <span style="color:var(--red)">${PL.summary.safe_to_send} OF 20</span></span>`, root), 0, 892);
    Object.assign(tally.style, { width: '1920px', textAlign: 'center' }); tally.id = 'plain-tally';
    const end = a.at(a.el('div', 'abs hide', `Same AI. Same email. <span class="amber">${PL.summary.safe_to_send} of 20 safe to send.</span>`, root), 0, 970);
    Object.assign(end.style, { width: '1920px', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: '42px', color: 'var(--ink)' }); end.id = 'plain-end';
    const lab = a.at(a.el('div', 'abs mono hide', `SOURCE · ${PL.model.toUpperCase()} · 20 RUNS · DEFAULT SETTINGS · ${PL.date.toUpperCase()}`, root), 1100, 1040);
    Object.assign(lab.style, { width: '760px', textAlign: 'right', fontSize: '13px', letterSpacing: '.14em', color: 'var(--faint)' }); lab.id = 'plain-lab';
    const cur = UI.cursor(root, a, 1900, 1100);
    Deck._cp = { g, G, cards, cur, h };
  },
  step(i, a) {
    const { g, G, cards, cur, h } = Deck._cp;
    if (i === 0) {
      // type the prompt, press send; the real reply streams back, polished and confident
      a.to(G.ph, { opacity: 0, display: 'none', duration: 0.15 });  // out of the line too, so typing starts at the left edge
      a.type(G.input, 'Reply to this email.', 24, 0.2);
      a.to(G.send, { opacity: 1, duration: 0.2, delay: 0.4 });
      const s = { x: 720 + 135 + 860 - 35, y: 210 + 760 - 250 + 158 - 31 };
      cur.show(0.6); cur.move(s.x, s.y, 0.7, 0.7);
      cur.press(1.45);
      cur.hide(1.9);
      a.to([G.chip, G.input, G.send], { opacity: 0, duration: 0.25, delay: 1.6 });
      a.to(G.greet, { opacity: 0, y: -16, duration: 0.35, delay: 1.6 });
      a.to(G.comp, { height: 64, top: 760 - 116, duration: 0.45, delay: 1.7, ease: 'power3.inOut' });
      a.to(G.input, { display: 'none', duration: 0.01, delay: 1.85 });
      a.to(G.ph, { opacity: 1, display: 'inline', duration: 0.2, delay: 2.0 });
      a.to(G.ph.parentNode, { top: 20, duration: 0.45, delay: 1.7, ease: 'power3.inOut' });
      a.to(G.comp.children[2], { opacity: 0, duration: 0.2, delay: 1.6 });  // the + / Tools row hides in the compact composer
      a.fromTo(G.user, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, delay: 1.8, ease: 'power3.out' });
      a.to(G.resp, { opacity: 1, duration: 0.3, delay: 2.4 });
      a.to(G.respT.querySelectorAll('.gem-line'), { opacity: 1, duration: 0.35, stagger: 0.32, delay: 2.5 });
      a.to('#plain-tag', { opacity: 1, duration: 0.4, delay: 4.8 });
    }
    if (i === 1) {
      // the same ask, 20 times: Gemini leaves, the email shrinks aside, the claims fan out
      a.to(h, { opacity: 0, y: -16, duration: 0.3 });
      const h2 = document.getElementById('plain-h2') || a.at(a.el('div', 'h-md', 'Now ask it <span class="amber">20 times.</span>', h.parentNode), 140, 92);
      h2.id = 'plain-h2'; a.fromTo(h2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' });
      a.to(G.w, { opacity: 0, scale: 0.97, duration: 0.6 });
      // shrink the picture, not the layout: zoom would hit the browser's minimum font size and garble the tiny text
      a.to(g.win, { left: 1600 / 0.74 + 'px', top: 66 / 0.74 + 'px', scale: 0.22 / 0.74, transformOrigin: '0 0', opacity: 0.9, duration: 0.8, ease: 'power3.inOut' });
      const from = UI.pos(G.resp);
      cards.forEach((c, k) => {
        const p = { cx: parseFloat(c.style.left) + 155, cy: parseFloat(c.style.top) + 75 };
        a.fromTo(c, { opacity: 0, x: from.x + 150 - p.cx, y: from.y + 120 - p.cy, scale: 0.4 },
          { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.7, delay: 0.25 + k * 0.06, ease: 'power3.out' });
      });
      a.reveal('#plain-lab', { delay: 1.4 });
    }
    if (i === 2) {
      // the scatter: dates, then people, light up; everything else steps back
      cards.forEach(c => a.to(c.querySelectorAll('.plain-disc'), { opacity: 0.3, duration: 0.4 }));
      cards.forEach((c, k) => a.to(c.querySelector('.plain-live .plain-val'), { color: '#f2b84b', duration: 0.3, delay: 0.15 + k * 0.04 }));
      cards.forEach((c, k) => a.to(c.querySelector('.plain-who .plain-val'), { color: '#f2b84b', duration: 0.3, delay: 1.1 + k * 0.04 }));
      a.reveal('#plain-cap1', { delay: 1.8 });
    }
    if (i === 3) {
      // the constant: every single one confirmed the discount; nine share the same fake phone number
      cards.forEach(c => { a.to(c.querySelectorAll('.plain-live .plain-val, .plain-who .plain-val'), { color: '#ece8df', duration: 0.3 });
        a.to(c.querySelectorAll('.plain-live, .plain-who'), { opacity: 0.35, duration: 0.3 }); });
      cards.forEach((c, k) => { a.to(c.querySelector('.plain-disc'), { opacity: 1, duration: 0.25, delay: 0.2 + k * 0.05 });
        a.to(c.querySelector('.plain-disc .plain-val'), { color: '#ff6b5e', duration: 0.25, delay: 0.2 + k * 0.05 }); });
      a.to(document.querySelectorAll('.plain-phone'), { opacity: 1, duration: 0.3, stagger: 0.12, delay: 1.4 });
      a.to('#plain-cap1', { opacity: 0, duration: 0.3 });
      a.reveal('#plain-cap2', { delay: 1.6 });
    }
    if (i === 4) {
      // the verdict: none of the 20 is safe to send
      cards.forEach(c => a.to(c, { borderColor: '#ff6b5e', duration: 0.4 }));
      a.to('#plain-cap2', { opacity: 0, duration: 0.3 });
      a.reveal('#plain-tally', { delay: 0.3 });
      a.reveal('#plain-end', { delay: 0.8 });
    }
  },
});
