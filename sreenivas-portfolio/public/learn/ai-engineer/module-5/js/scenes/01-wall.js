/* ---------------- Opening: the internet on "prompt engineering", the four questions, then the first live vote ----------------
   Every item is real and verified (research/pe-wall/*.json → deck/data/wall.js). They pop up in date order,
   so the wall itself tells the story: hype (2023) → backlash (2024) → "context engineering" (2025–26). */
const WallCard = (function () {
  const esc = (s) => M5.esc(s);
  const HL = /(prompt[\s-]?engineer(?:ing|s)?|context engineering)/gi;
  const hl = (s) => esc(s).replace(HL, '<mark style="background:#f2b84b;color:#14110a;border-radius:3px;padding:0 3px">$1</mark>');
  const cut = (s, n) => s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s;
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = (d) => { const [y, m, dd] = d.split('-'); return (dd ? +dd + ' ' : '') + (m ? MON[+m - 1] + ' ' : '') + y; };
  const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";  // single quotes inside: it goes into style="" attributes
  const av = (name, bg) => `<span style="flex:none;width:34px;height:34px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font:700 15px ${SANS};color:#fff">${esc((name || '?').trim()[0] || '?').toUpperCase()}</span>`;
  function social(o, s) {
    return `<div style="background:${s.bg};border:1px solid ${s.line};border-radius:16px;padding:12px 14px;font-family:${SANS};color:${s.ink}">
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:6px">${av(o.a, s.av)}
        <div style="line-height:1.2;min-width:0"><div style="font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(o.a || '')}</div>
        <div style="font-size:13px;color:${s.dim};white-space:nowrap">${esc(o.h || '')} · ${date(o.d)}</div></div>
        <span style="margin-left:auto;font:700 13px ${SANS};color:${s.dim}">${s.mark}</span></div>
      <div style="font-size:15px;line-height:1.38">${hl(cut(o.t, 230))}</div></div>`;
  }
  function html(o) {
    if (o.k === 'x') return social(o, { bg: '#000', line: '#2f3336', ink: '#e7e9ea', dim: '#71767b', av: '#3a3f45', mark: '𝕏' });
    if (o.k === 'bsky') return social(o, { bg: '#161e27', line: '#2e4052', ink: '#f1f3f5', dim: '#8d9eb2', av: '#1185fe', mark: '🦋' });
    if (o.k === 'masto') return social(o, { bg: '#282c37', line: '#393f4f', ink: '#ececf8', dim: '#9baec8', av: '#6364ff', mark: 'M' });
    if (o.k === 'hn') return `<div style="background:#f6f6ef;padding:10px 12px;font-family:Verdana,Geneva,sans-serif;color:#000;border-top:3px solid #ff6600">
      <div style="font-size:11px;color:#828282;margin-bottom:6px">▲ ${esc(o.a || '')} · ${date(o.d)}</div><div style="font-size:13px;line-height:1.4">${hl(cut(o.t, 220))}</div></div>`;
    if (o.k === 'hntitle') return `<div style="background:#f6f6ef;padding:9px 12px;font-family:Verdana,Geneva,sans-serif;border-top:3px solid #ff6600">
      <div style="display:flex;gap:8px;align-items:baseline"><span style="flex:none;background:#ff6600;color:#fff;font:700 11px Verdana;padding:1px 4px">Y</span><span style="font-size:14px;color:#000">${hl(cut(o.t, 120))}</span></div>
      <div style="font-size:10px;color:#828282;margin:4px 0 0 26px">by ${esc(o.a || '')} · ${date(o.d)}</div></div>`;
    if (o.k === 'yt') return `<div style="background:#0f0f0f;padding:10px;border-radius:12px;display:flex;gap:10px;font-family:Roboto,Arial,sans-serif">
      <div style="flex:none;width:128px;height:72px;border-radius:8px;background:linear-gradient(135deg,#2a2a2a,#121212);display:flex;align-items:center;justify-content:center"><span style="width:34px;height:24px;border-radius:6px;background:#ff0033;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px">▶</span></div>
      <div style="min-width:0"><div style="font-size:14px;font-weight:600;line-height:1.3;color:#f1f1f1">${hl(cut(o.t, 90))}</div><div style="font-size:12px;color:#aaa;margin-top:4px">${esc(o.a || '')} · ${date(o.d)}</div></div></div>`;
    if (o.k === 'news') return `<div style="background:#f4f1ea;padding:12px 16px;color:#111;border-top:2px solid #111">
      <div style="font:700 11px ${SANS};letter-spacing:.14em;text-transform:uppercase;color:#555">${esc(o.w || '')} · ${date(o.d)}</div>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:1.22;margin-top:6px;font-weight:700">${hl(cut(o.t, 140))}</div>
      ${o.ex ? `<div style="font-family:Georgia,serif;font-size:13px;line-height:1.35;color:#444;margin-top:6px;font-style:italic">${hl(cut(o.ex, 130))}</div>` : ''}</div>`;
    if (o.k === 'job' || o.k === 'course') return `<div style="background:#1b1f23;border:1px solid #38434f;border-radius:10px;padding:12px 14px;font-family:${SANS}">
      <div style="display:inline-block;font:700 10px ${SANS};letter-spacing:.12em;padding:2px 7px;border-radius:4px;background:${o.k === 'job' ? '#057642' : '#0a66c2'};color:#fff">${o.k === 'job' ? 'JOB' : 'COURSE'}</div>
      <div style="font-size:15px;font-weight:600;color:#f3f2ef;line-height:1.3;margin-top:7px">${hl(cut(o.t, 170))}</div>
      <div style="font-size:12px;color:#a8a29e;margin-top:5px">${esc(o.a || '')} · ${date(o.d)}</div></div>`;
    // other titles: Stack Overflow, Substack, dev.to, Reddit, Product Hunt, blogs
    const P = { stackoverflow: ['Stack Overflow', '#f48024'], substack: ['Substack', '#ff6719'], devto: ['DEV', '#fff'], reddit: ['Reddit', '#ff4500'], producthunt: ['Product Hunt', '#da552f'] }[o.p] || [o.w || o.p || '', '#9aa0a6'];
    return `<div style="background:#16181c;border-left:3px solid ${P[1]};padding:10px 14px;font-family:${SANS}">
      <div style="font:700 11px ${SANS};letter-spacing:.08em;color:${P[1]}">${esc(P[0])}${o.w && o.p === 'reddit' ? ' · ' + esc(o.w) : ''}</div>
      <div style="font-size:15px;font-weight:600;color:#e8eaed;line-height:1.3;margin-top:4px">${hl(cut(o.t, 150))}</div>
      <div style="font-size:12px;color:#9aa0a6;margin-top:4px">${esc(o.a || '')} · ${date(o.d)}</div></div>`;
  }
  return { html };
})();

Deck.scene({
  id: 'O.wall', chapter: '0', title: 'Four questions', steps: 5, noChrome: true,
  mount(root, a) {
    root.style.background = '#000';
    const W = (window.WALL || []);
    const wall = a.el('div', 'abs', '', root); wall.id = 'dwall';
    Object.assign(wall.style, { left: 0, top: 0, width: '1920px', height: '1080px', overflow: 'hidden' });
    // the year the wall has reached, huge and faint behind the cards
    const yr = a.at(a.el('div', 'abs mono', '', wall), 60, 840); yr.style.cssText += 'font-size:200px;font-weight:300;color:rgba(236,232,223,.07);letter-spacing:.04em;z-index:0';
    // cards pop up in place all over the screen (slow start, then a flood), all stay, and the whole wall drifts gently.
    // 42 of the 320, sampled across the dates, popping in date order.
    const N = 42, pick = d3.range(N).map(k => W[Math.round(k * (W.length - 1) / (N - 1))]).filter(Boolean);
    // organic scatter: each card goes to the emptiest of 40 random spots (best-candidate sampling), sizes vary a little
    let seed = 5; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const placed = [], SC = 0.62;
    const cards = pick.map((o, k) => {
      let best = null, bd = -1;
      for (let t = 0; t < 40; t++) { const cx = 60 + rnd() * 1800, cy = 50 + rnd() * 980;
        const dmin = placed.reduce((m, p) => Math.min(m, Math.hypot((p[0] - cx) / 1.6, p[1] - cy)), 1e9);
        if (dmin > bd) { bd = dmin; best = [cx, cy]; } }
      placed.push(best);
      const sc = SC * (0.82 + rnd() * 0.36), w = o.k === 'news' ? 350 : 340;
      const d = a.at(a.el('div', 'abs', WallCard.html(o), wall), best[0] - w * sc / 2, best[1] - 60 * sc); d.style.width = w + 'px';
      d.style.transformOrigin = '0 0'; d.style.zIndex = 1 + k; d.dataset.y = o.d.slice(0, 4); d.dataset.sc = sc;
      gsap.set(d, { scale: sc, rotation: (rnd() - 0.5) * 8 });
      return d;
    });
    // pop in: slow start, then a flood (the year behind follows the newest card)
    a.fromTo(cards, { opacity: 0, scale: (k, e) => e.dataset.sc * 0.5 }, { opacity: (k) => 0.75 + ((k * 13) % 4) * 0.08, scale: (k, e) => +e.dataset.sc, duration: 0.45, ease: 'back.out(2)',
      stagger: { amount: 6, ease: 'power1.out' } });
    cards.forEach((d, k) => a.after(600 + 6000 * (1 - Math.pow(1 - k / N, 2)), () => { yr.textContent = d.dataset.y; }));
    if (a.instant) yr.textContent = pick[pick.length - 1].d.slice(0, 4);
    a.loop(() => { if (!a.instant) gsap.to(cards, { x: () => (Math.random() - .5) * 14, y: () => (Math.random() - .5) * 10, duration: 3.2, ease: 'sine.inOut' }); }, 3200);

    // Cut 3: the four questions the session answers (each maps to a part of the talk; all four come back answered at the end)
    const QS = ['Why does the same AI give a different answer every time you ask?', 'What does a prompt that works every time look like?',
      'When should you show it examples, or tell it to think first?', 'Is prompt engineering still worth learning in 2026?'];
    // fixed colours, alternating white / gold; each question just appears on its click
    const q = a.el('div', 'center', QS.map((t, k) => `<div id="oq${k + 1}" class="h-lg hide" style="color:${k % 2 ? 'var(--amber)' : 'var(--ink)'};max-width:1500px;font-size:62px;text-wrap:balance;margin:${k ? 40 : 0}px 0 0;text-shadow:0 0 40px #000">${t}</div>`).join(''), root);
    q.style.zIndex = 5; q.id = 'oqs';

    // question 4 becomes the first live vote; the same vote returns at the end ('q4-after') to show whether minds moved
    const v = Vote.mount(root, a, { id: 'q4-before', options: ['Yes, it’s a core skill', 'No, it’s a fad', 'Not sure yet'], url: 'vote.link/m5' });
    const vq = a.at(a.el('div', 'abs hide', 'Is prompt engineering still worth learning in 2026?', root), 0, 150);
    Object.assign(vq.style, { width: '1920px', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: '58px', color: 'var(--amber)', zIndex: 6 });
    vq.id = 'vq';
    Deck._wallVote = v;
  },
  step(i, a) {
    if (i === 0) a.to('#dwall', { opacity: 0.12, duration: 0.9 });
    if (i < 4) { a.reveal('#oq' + (i + 1), { delay: i === 0 ? 0.3 : 0.1 }); return; }
    // vote: the questions clear, the wall dims further, question 4 moves to the top, QR + live bars come in
    a.to('#oqs', { opacity: 0, duration: 0.5 });
    a.to('#dwall', { opacity: 0.05, duration: 0.8 });
    a.reveal('#vq', { delay: 0.3 });
    Deck._wallVote.show(a);
  },
});
