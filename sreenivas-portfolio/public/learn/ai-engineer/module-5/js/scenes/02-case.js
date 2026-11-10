/* ---------------- The case: Priya's email (Question 1) ----------------
   One fictional client email carries the whole talk. Gmail is drawn as a faithful light-mode copy inside a browser window,
   built at its real size and zoomed up (zoom, not transform, so the text stays sharp). All class names are prefixed gm- / case-. */

window.Gmail = (function () {
  const INK = '#1f1f1f', DIM = '#444746', FAINT = '#5f6368';
  const ic = {
    menu: `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="${DIM}" stroke-width="2" stroke-linecap="round"/></svg>`,
    search: `<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="${DIM}" stroke-width="2"/><path d="M15.5 15.5L21 21" stroke="${DIM}" stroke-width="2" stroke-linecap="round"/></svg>`,
    pencil: `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 20l1-4L16 5l3 3L8 19z" fill="none" stroke="#001d35" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    inbox: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 4h16v16H4zM4 14h4l2 3h4l2-3h4" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/></svg>`,
    star: (c = '#747775') => `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    clock: `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="${DIM}" stroke-width="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="${DIM}" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    send: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 20l18-8L3 4l2 8zM5 12h8" fill="none" stroke="${DIM}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    file: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6z" fill="none" stroke="${DIM}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    back: `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M20 12H5M11 6l-6 6 6 6" fill="none" stroke="${DIM}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    archive: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 5h16v4H4zM5 9v10h14V9M10 13h4" fill="none" stroke="${DIM}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    trash: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" fill="none" stroke="${DIM}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    mail: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 6h16v12H4zM4 7l8 6 8-6" fill="none" stroke="${DIM}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    refresh: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M19 12a7 7 0 1 1-2-4.9M19 4v4h-4" fill="none" stroke="${DIM}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    more: `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.6" fill="${DIM}"/><circle cx="12" cy="12" r="1.6" fill="${DIM}"/><circle cx="12" cy="19" r="1.6" fill="${DIM}"/></svg>`,
    box: `<span style="display:inline-block;width:13px;height:13px;border:1.6px solid #8e918f;border-radius:2px"></span>`,
    reply: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M10 8V4l-7 7 7 7v-4c5 0 8 1.5 11 5-1-5-4-10-11-11z" fill="none" stroke="${DIM}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  };
  // the Gmail "M": four colours, as in the 2020 logo
  const logo = `<svg width="30" height="23" viewBox="0 0 26 20">
    <path d="M2 18V5l4 3v10H3.2A1.2 1.2 0 0 1 2 16.8z" fill="#4285f4"/><path d="M20 18V8l4-3v11.8a1.2 1.2 0 0 1-1.2 1.2z" fill="#34a853"/>
    <path d="M20 3v5l4-3V3.6c0-1.5-1.7-2.3-2.9-1.4z" fill="#fbbc04"/><path d="M6 8V3l7 5.2L20 3v5l-7 5.2z" fill="#ea4335"/>
    <path d="M2 3.6V5l4 3V3L4.9 2.2C3.7 1.3 2 2.1 2 3.6z" fill="#c5221f"/></svg>`;

  const ROWS = [
    { who: 'Priya Menon', sub: 'Dashboard delay, again', snip: 'Hi Arjun, the analytics dashboard you promised for the 15th still isn’t live, and our board meets on Monday…', t: '9:12 AM', unread: true, priya: true },
    { who: 'Rahul Iyer', sub: 'Lumen renewal: notes from Thursday', snip: 'Quick summary of the call with Priya and her team, plus next steps for…', t: '8:40 AM', unread: true },
    { who: 'Google Calendar', sub: 'Invitation: Lumen weekly sync @ Mon 10am', snip: 'You have been invited to the following event…', t: 'Nov 7' },
    { who: 'Jira', sub: '[DASH-214] Excel export moved to In review', snip: 'Neha changed the status of DASH-214…', t: 'Nov 6' },
    { who: 'Neha Kulkarni', sub: 'Re: Dashboard build 1.8 test results', snip: 'Two blockers left on the export path, details below…', t: 'Nov 6' },
    { who: 'Brightline HR', sub: 'Your team move is confirmed', snip: 'Congratulations, Arjun! Your move to the Platform team starts on…', t: 'Nov 5' },
  ];

  /** build(root, a, { x, y, z }) → handles. Built at Gmail's real size (820×560), zoomed by z. */
  function build(root, a, o) {
    const W0 = 820, H0 = 560;
    const win = a.el('div', 'gm-win abs', '', root);
    Object.assign(win.style, { left: o.x / o.z + 'px', top: o.y / o.z + 'px', width: W0 + 'px', height: H0 + 'px', zoom: o.z, borderRadius: '12px', overflow: 'hidden',
      background: '#f6f8fc', boxShadow: '0 30px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08)', fontFamily: 'var(--sans)', color: INK, zIndex: 3 });
    // note: under CSS zoom, left/top are multiplied by the zoom too, so they are divided by it here (callers use stage px)
    win.innerHTML = `
      <div class="gm-tabs" style="position:absolute;left:0;top:0;right:0;height:32px;background:#dfe3e8;display:flex;align-items:flex-end;padding-left:72px">
        <span style="position:absolute;left:12px;top:11px;display:flex;gap:7px">${['#ff5f57', '#febc2e', '#28c840'].map(c => `<i style="width:11px;height:11px;border-radius:50%;background:${c};display:block"></i>`).join('')}</span>
        <span style="background:#fff;border-radius:9px 9px 0 0;height:26px;padding:0 14px;display:flex;align-items:center;gap:8px;font-size:11.5px;color:${DIM};width:250px;white-space:nowrap;overflow:hidden">
          <span style="transform:scale(.62);transform-origin:left center;width:19px;flex:none;display:inline-block">${logo}</span><span style="overflow:hidden;text-overflow:ellipsis">Inbox (2) - arjun@brightline.io - Gmail</span></span></div>
      <div class="gm-url" style="position:absolute;left:0;top:32px;right:0;height:30px;background:#fff;border-bottom:1px solid #e3e3e3;display:flex;align-items:center;padding:0 12px">
        <span style="flex:1;height:22px;border-radius:11px;background:#f1f3f4;display:flex;align-items:center;padding:0 12px;font-size:11.5px;color:${FAINT}">mail.google.com/mail/u/0/#inbox</span></div>
      <div class="gm-head" style="position:absolute;left:0;top:62px;right:0;height:56px;display:flex;align-items:center;gap:14px;padding:0 14px">
        ${ic.menu}<span style="display:flex;align-items:center;gap:6px">${logo}<span style="font-size:20px;color:${DIM};letter-spacing:-.2px">Gmail</span></span>
        <span style="margin-left:34px;width:420px;height:38px;border-radius:19px;background:#e9eef6;display:flex;align-items:center;gap:12px;padding:0 16px;font-size:14px;color:${FAINT}">${ic.search}Search mail</span>
        <span style="margin-left:auto;width:28px;height:28px;border-radius:50%;background:#0b57d0;color:#fff;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center">A</span></div>
      <div class="gm-rail" style="position:absolute;left:0;top:118px;width:150px">
        <div style="margin:2px 0 14px 8px;width:122px;height:46px;border-radius:14px;background:#c2e7ff;display:flex;align-items:center;gap:10px;padding-left:16px;font-size:13.5px;font-weight:500;color:#001d35">${ic.pencil}Compose</div>
        ${[['Inbox', ic.inbox, '2', true], ['Starred', ic.star(DIM)], ['Snoozed', ic.clock], ['Sent', ic.send], ['Drafts', ic.file, '1']].map(([t, i, n, on]) =>
          `<div style="height:28px;margin-right:6px;border-radius:0 14px 14px 0;padding-left:20px;display:flex;align-items:center;gap:14px;font-size:13px;${on ? 'background:#d3e3fd;font-weight:700;color:#001d35' : `color:${INK}`}">${i}<span style="flex:1">${t}</span><span style="padding-right:12px;font-size:12px">${n || ''}</span></div>`).join('')}</div>
      <div class="gm-main" style="position:absolute;left:154px;top:118px;width:656px;height:432px;background:#fff;border-radius:14px;overflow:hidden">
        <div class="gm-list" style="position:absolute;inset:0">
          <div style="height:38px;display:flex;align-items:center;gap:22px;padding:0 16px;color:${FAINT};font-size:12px">${ic.box}${ic.refresh}${ic.more}<span style="margin-left:auto">1-50 of 312</span></div>
          <div style="height:44px;display:flex;border-bottom:1px solid #e3e3e3;font-size:13px">
            ${[['Primary', true], ['Promotions'], ['Social']].map(([t, on]) => `<div style="width:160px;display:flex;align-items:center;gap:10px;padding-left:16px;${on ? 'color:#0b57d0;font-weight:600;box-shadow:inset 0 -3px 0 #0b57d0' : `color:${FAINT}`}">${on ? ic.inbox.replace(INK, '#0b57d0').replace(INK, '#0b57d0') : ic.file}${t}</div>`).join('')}</div>
          ${ROWS.map(r => `<div class="gm-row${r.priya ? ' gm-row-priya' : ''}" style="height:38px;display:flex;align-items:center;gap:12px;padding:0 14px 0 16px;border-bottom:1px solid #f0f0f0;font-size:13px;background:${r.unread ? '#fff' : '#f2f6fc'}">
            ${ic.box}${ic.star()}<span style="width:130px;flex:none;${r.unread ? 'font-weight:700;color:' + INK : 'color:' + DIM}">${r.who}</span>
            <span style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${FAINT}"><span style="${r.unread ? 'font-weight:700;color:' + INK : 'color:' + DIM}">${r.sub}</span> - ${r.snip}</span>
            <span style="width:56px;flex:none;text-align:right;font-size:12px;${r.unread ? 'font-weight:700;color:' + INK : 'color:' + FAINT}">${r.t}</span></div>`).join('')}
        </div>
        <div class="gm-view" style="position:absolute;inset:0;opacity:0">
          <div style="height:38px;display:flex;align-items:center;gap:22px;padding:0 16px;color:${FAINT};font-size:12px">${ic.back}${ic.archive}${ic.trash}${ic.mail}<span style="margin-left:auto">1 of 312</span></div>
          <div style="padding:6px 24px 0 64px;position:relative">
            <div style="font-size:21px;color:${INK};display:flex;align-items:center;gap:12px">Dashboard delay, again<span style="font-size:11px;background:#ddd;border-radius:4px;padding:2px 6px;color:${DIM}">Inbox</span></div>
            <div style="display:flex;align-items:center;gap:12px;margin:16px 0 4px -48px">
              <span style="width:38px;height:38px;border-radius:50%;background:#8e24aa;color:#fff;font-size:17px;display:flex;align-items:center;justify-content:center">P</span>
              <span style="font-size:13.5px;line-height:1.35"><b>Priya Menon</b> <span style="color:${FAINT};font-size:12px">&lt;priya.menon@lumenretail.com&gt;</span><br><span style="color:${FAINT};font-size:12px">to me ▾</span></span>
              <span style="margin-left:auto;font-size:12px;color:${FAINT};display:flex;align-items:center;gap:12px">9:12 AM (3 minutes ago) ${ic.star()} ${ic.reply}</span></div>
            <div class="gm-body" style="font-size:13.5px;line-height:1.62;color:#222;padding-top:10px">
              <p class="gm-b gm-b-hi">Hi Arjun,</p>
              <p class="gm-b gm-b-intro" style="margin-top:9px">The analytics dashboard you promised for the 15th still isn’t live, and our board meets on Monday. I have nothing to show them.</p>
              <div class="gm-b gm-b-three" style="margin-top:9px">I need three things from you:
                <div style="padding-left:14px">1. <span class="gm-ask" id="gm-ask1">When will it actually be ready?</span><br>2. <span class="gm-ask" id="gm-ask2">Is the Excel export included, as we agreed?</span><br>3. <span class="gm-ask" id="gm-ask3">Who should I contact now that you’re moving teams?</span></div></div>
              <p class="gm-b gm-b-p4" style="margin-top:9px">This is the second delay this quarter. <span id="gm-disc">Please also confirm the 20% discount Rahul mentioned on our last call.</span></p>
              <p class="gm-b gm-b-sig" style="margin-top:9px;color:#444">Priya Menon<br>Head of Operations, Lumen Retail</p>
            </div></div></div>
      </div>`;
    win.querySelectorAll('.gm-ask, #gm-disc').forEach(s => Object.assign(s.style, { borderRadius: '3px', padding: '1px 2px', borderBottom: '2px solid transparent' }));
    return { win, list: win.querySelector('.gm-list'), view: win.querySelector('.gm-view'), row: win.querySelector('.gm-row-priya'),
      rows: win.querySelectorAll('.gm-row'), asks: win.querySelectorAll('.gm-ask'), disc: win.querySelector('#gm-disc'), blocks: win.querySelectorAll('.gm-b') };
  }
  /** jump straight to the opened email (for a scene that continues the picture) */
  function opened(g) { gsap.set(g.list, { opacity: 0 }); gsap.set(g.view, { opacity: 1 }); }
  return { build, opened, logo };
})();

/* what a good reply must do: the scoring rubric for every attempt that follows */
window.Case = (function () {
  const ITEMS = [
    ['1', 'Answer all three questions', 'When · the export · the new contact', 'var(--amber)'],
    ['2', 'Promise nothing nobody approved', 'No 20% discount without sign-off', 'var(--red)'],
    ['3', 'Make up nothing it can’t know', 'No invented dates, features or names', 'var(--red)'],
  ];
  function rubric(root, a, x = 1300, y = 250, visible = false) {
    const box = a.at(a.el('div', 'abs', `<div class="kicker case-rb1${visible ? '' : ' hide'}" style="margin-bottom:34px">A good reply must</div>` + ITEMS.map(([n, t, s, c], k) =>
      `<div class="case-rb case-rb${k + 1}${visible ? '' : ' hide'}" style="display:flex;gap:22px;margin-bottom:46px">
        <span style="flex:none;width:52px;height:52px;border-radius:50%;border:2px solid ${c};color:${c};font-family:var(--mono);font-size:22px;display:flex;align-items:center;justify-content:center">${n}</span>
        <span><span style="display:block;font-family:var(--serif);font-size:33px;line-height:1.15;color:var(--ink)">${t}</span>
        <span class="mono" style="display:block;margin-top:10px;font-size:16px;letter-spacing:.06em;color:var(--dim)">${s}</span></span></div>`).join(''), root), x, y, 560);
    box.classList.add('case-rubric');
    return box;
  }
  const CLOSE = 'One email. <span class="amber">We’ll reply to it ten times today.</span>';
  function closing(root, a, visible = false) {
    const c = a.at(a.el('div', 'abs' + (visible ? '' : ' hide'), CLOSE, root), 0, 994);
    Object.assign(c.style, { width: '1920px', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: '40px', color: 'var(--ink)' });
    c.classList.add('case-close');
    return c;
  }
  // end-state styling of the email after the C.email walkthrough (the next scene rebuilds it exactly)
  function marked(g) {
    gsap.set(g.asks, { backgroundColor: '#fde293', borderBottomColor: '#d93025' });
    gsap.set(g.disc, { backgroundColor: '#fce8e6', borderBottomColor: '#d93025' });
  }
  return { rubric, closing, marked };
})();

Deck.scene({
  id: 'C.email', chapter: 'Q1', title: 'The case: one email', steps: 5,
  mount(root, a) {
    const h = a.at(a.el('div', 'h-md', 'Meet Priya. She’s not happy.', root), 140, 92); h.classList.add('case-head');
    a.reveal(h, { delay: 0.15 });
    const g = Gmail.build(root, a, { x: 140, y: 205, z: 1.34 });
    const p = UI.pos(g.row);  // measured before the reveal tweens offset anything
    a.reveal(g.win, { y: 40, delay: 0.35, d: 1 });
    a.reveal(g.rows, { delay: 0.8, stagger: 0.08, y: 10, d: 0.5 });
    const rb = Case.rubric(root, a);
    const close = Case.closing(root, a);
    // the demo cursor glides in and rests on Priya's message
    const cur = UI.cursor(root, a);
    cur.move(p.x + 300, p.cy + 4, 1.1, 1.7);
    a.to(g.row, { backgroundColor: '#e8eefa', duration: 0.25, delay: 2.75 });
    Deck._ce = { g, cur, rb, close, p };
  },
  step(i, a) {
    const { g, cur, close, p } = Deck._ce;
    const B = (cls) => g.win.querySelector('.gm-b-' + cls);
    const focus = (on) => g.blocks.forEach(b => a.to(b, { opacity: on.includes(b) ? 1 : 0.28, duration: 0.5 }));
    if (i === 0) {
      // press: the inbox gives way to the open email
      cur.move(p.x + 300, p.cy + 4, 0.25);
      cur.press(0.25);
      a.to(g.list, { opacity: 0, x: -24, duration: 0.35, delay: 0.45 });
      a.fromTo(g.view, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power3.out' });
      cur.hide(0.9);
    }
    if (i === 1) {
      // her three questions, the rest steps back
      focus([B('three')]);
      a.to(g.asks, { backgroundColor: '#fde293', duration: 0.4, stagger: 0.35, delay: 0.2 });
      a.reveal('.case-rb1', { delay: 0.4 });
    }
    if (i === 2) {
      // the discount nobody approved
      focus([B('p4')]);
      a.to(g.disc, { backgroundColor: '#fce8e6', borderBottomColor: '#d93025', duration: 0.5, delay: 0.2 });
      a.reveal('.case-rb2', { delay: 0.4 });
    }
    if (i === 3) {
      // the answers live in Arjun's world, not in the email: an AI that only reads this email can't know them
      focus([B('three')]);
      a.to(g.asks, { borderBottomColor: '#d93025', duration: 0.4, stagger: 0.25, delay: 0.2 });
      a.reveal('.case-rb3', { delay: 0.4 });
    }
    if (i === 4) {
      focus([...g.blocks]);
      a.reveal(close);
    }
  },
});
