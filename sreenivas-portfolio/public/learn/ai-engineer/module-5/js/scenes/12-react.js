/* ---------------- Question 3 · 5.10 ReAct ----------------
   A.open   the dive into the 5.10 cell; the definition
   A.loop   our case in the 2022 text format (illustration): the Action goes out to the CRM, the Observation comes back into
            the context window (where 5.6's notes came from); then the Action line morphs into a structured tool call
            (function calling, Jun 2023) and the Thoughts dissolve into hidden thinking
   A.tools  "it has more tools than it shows you": each tool folded to one line (Anthropic, quoted); an email arrives, the
            model scans the lines, one unfolds; our web-search check (real); the strip
   Data: window.REST. Class names are prefixed ra-. */

/* ---------- A.open ---------- */
Opener({ id: 'A.open', chapter: 'RA', section: ['5.10', 'ReAct prompting'], title: '5.10 · ReAct prompting', kicker: '5.10 · ReAct prompting',
  cell: 8, prev: { done: [0, 1, 2, 3, 4, 5, 6], now: [7] },
  def: 'ReAct alternates <span class="op-h">Thought → Action → Observation</span>: the model reasons, calls a tool, reads the result, and continues. It is the prompting pattern <span class="op-h">underneath most agents</span>.',
  end: 'Where did the account notes in 5.6 come from? <span class="amber">In a real app, a tool.</span>', endY: 720 });

/* ---------- A.loop ---------- */
const RA_LINES = [
  ['Question', 'When does the dashboard go live, and is the Excel export included?', '#353740', 'q'],
  ['Thought', 'I don’t know either. The CRM will.', '#1a56db', 't'],
  ['Action', 'crm_lookup[Lumen Retail, analytics dashboard]', '#b26b00', 'a'],
  ['Observation', 'Go-live: Friday 13 November, 6 PM IST. Excel export: included.', '#0d652d', 'o'],
  ['Thought', 'Now I can answer both questions.', '#1a56db', 't'],
  ['Answer', 'It goes live on Friday 13 November at 6 PM IST, and the Excel export is included.', '#202123', 'n'],
];
Deck.scene({
  id: 'A.loop', chapter: 'RA', section: ['5.10', 'ReAct prompting'], title: 'Think. Act. Read.', steps: 4,
  mount(root, a) {
    kfHead(root, a, 'Think. Act. <span class="amber">Read.</span> Repeat.');
    // the 2022 way, in the Playground of the day: the model's own lines come back highlighted green; the Observation is pasted
    // in by your code (not green), and the model carries on
    const gen = kind => kind === 't' || kind === 'a' || kind === 'n';
    const t = a.at(a.el('div', 'abs', `<div style="display:flex;align-items:center;gap:12px;padding-bottom:12px;margin-bottom:6px;border-bottom:1px solid #ececf1">
        <span style="font-size:17px;font-weight:600;color:#202123">Playground</span><span id="ra-tag" class="mono" style="margin-left:auto;font-size:11px;letter-spacing:.14em;color:#b26b00">ILLUSTRATION · THE 2022 TEXT FORMAT (YAO ET AL., “REACT”, OCT 2022)</span></div>` +
      RA_LINES.map(([k, v, c, kind]) => `<div class="ra-l ra-${kind}" style="display:flex;gap:18px;padding:8px 0;opacity:0"><span class="ra-k" style="flex:none;width:130px;font-size:17px;font-weight:600;color:${c}">${k}:</span><span class="ra-v" style="font-size:18px;line-height:1.45;color:#202123;${gen(kind) ? 'background:#d2f4d3;border-radius:3px;padding:0 3px;' : ''}">${v}</span>${kind === 'o' ? '<span class="mono" style="flex:none;margin-left:auto;font-size:10.5px;letter-spacing:.12em;color:#6e6e80;padding-top:5px">PASTED IN BY YOUR CODE</span>' : ''}</div>`).join(''), root), 160, 230, 1000);
    Object.assign(t.style, { padding: '18px 26px 20px', borderRadius: '14px', background: '#fff', fontFamily: 'var(--sans)', boxShadow: '0 24px 70px rgba(0,0,0,.55)', boxSizing: 'border-box' }); t.id = 'ra-t';
    // the outside world: the CRM, and the context window the result comes back into
    const crm = a.at(a.el('div', 'abs hide', `<div style="display:flex;align-items:center;gap:14px"><svg width="34" height="40" viewBox="0 0 34 40"><ellipse cx="17" cy="7" rx="15" ry="5" fill="none" stroke="#6aa8ff" stroke-width="2"/><path d="M2 7v26c0 3 7 5 15 5s15-2 15-5V7M2 20c0 3 7 5 15 5s15-2 15-5" fill="none" stroke="#6aa8ff" stroke-width="2"/></svg>
      <div><div style="font-size:21px;color:var(--ink)">Brightline CRM</div><div class="mono" style="font-size:12px;letter-spacing:.12em;color:var(--dim)">A TOOL YOUR APP RUNS</div></div></div>`, root), 1300, 250, 460);
    Object.assign(crm.style, { padding: '20px 24px', borderRadius: '14px', background: 'var(--panel)', border: '1px solid rgba(106,168,255,.5)', boxSizing: 'border-box' }); crm.id = 'ra-crm';
    a.reveal(crm, { delay: 0.6 });
    const ctx = a.at(a.el('div', 'abs hide', `<div class="mono" style="font-size:12.5px;letter-spacing:.14em;color:var(--dim);margin-bottom:10px">THE CONTEXT WINDOW · WHAT THE MODEL READS NEXT</div>
      <div style="font-size:16px;line-height:1.6;color:var(--ink-2)">System: You are Arjun… the rules…</div>
      <div style="font-size:16px;line-height:1.6;color:var(--ink-2)">User: Priya’s email</div>
      <div style="font-size:16px;line-height:1.6;color:var(--ink-2)">Thought… Action: crm_lookup[…]</div>
      <div id="ra-obs" style="font-size:16px;line-height:1.6;color:var(--green);opacity:0">Observation: go-live Fri 13 Nov, 6 PM IST; Excel included</div>`, root), 1300, 470, 460);
    Object.assign(ctx.style, { padding: '20px 24px', borderRadius: '14px', background: 'var(--panel)', border: '1px solid var(--line-2)', boxSizing: 'border-box' }); ctx.id = 'ra-ctx';
    a.reveal(ctx, { delay: 0.8 });
    // click 3: what became of the text format
    const hist = a.at(a.el('div', 'abs hide', `<div style="font-family:var(--serif);font-size:26px;line-height:1.3;color:var(--ink)">“Developers can now describe functions to gpt-4-0613 and gpt-3.5-turbo-0613, and have the model intelligently choose to output a JSON object containing arguments to call those functions.”</div>
      <div class="mono" style="margin-top:12px;font-size:13px;letter-spacing:.14em;color:var(--dim)">OPENAI, FUNCTION CALLING · 13 JUN 2023</div>`, root), 160, 660, 1000);
    hist.id = 'ra-hist';
    kfEnd(root, a, 'The pattern stayed. <span class="amber">The text format didn’t.</span>', 'ra-end', 945);
    const ptr = a.at(a.el('div', 'abs hide', kfMono('RUNNING THIS LOOP FOR REAL, WITH TOOLS, IS AN AGENT: MODULE 10.5', 'var(--dim)', 14), root), 0, 1025);
    Object.assign(ptr.style, { width: '1920px', textAlign: 'center' }); ptr.id = 'ra-ptr';
    Deck._ral = { root };
  },
  _fly(a, root, from, to, html, colour, delay) {
    // a small packet with the real payload travels from one element to another
    a.after(delay * 1000, () => {
      const f = UI.pos(from), t = UI.pos(to);
      const p = a.at(a.el('div', 'abs mono', html, root), f.x + 20, f.cy - 16);
      Object.assign(p.style, { padding: '7px 12px', borderRadius: '8px', background: colour, color: '#07080b', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', zIndex: 20, boxShadow: '0 8px 20px rgba(0,0,0,.4)', opacity: 0 });
      a.to(p, { opacity: 1, duration: 0.2 });
      a.to(p, { x: t.x + 30 - (f.x + 20), y: t.cy - f.cy, duration: 0.9, delay: 0.1, ease: 'power3.inOut' });
      a.to(p, { opacity: 0, duration: 0.2, delay: 1.0 });
      a.after(1100, () => p.remove());
    });
  },
  step(i, a) {
    const S = Deck.scenes.find(s => s.id === 'A.loop'), { root } = Deck._ral, L = document.querySelectorAll('#ra-t .ra-l');
    if (i === 0) {
      // the question, a thought, an action; the action goes out to the CRM
      a.to([L[0], L[1], L[2]], { opacity: 1, duration: 0.4, stagger: 0.7 });
      S._fly(a, root, L[2], document.getElementById('ra-crm'), 'crm_lookup[Lumen Retail, dashboard]', '#f2b84b', 2.0);
      a.to('#ra-crm', { boxShadow: '0 0 0 4px rgba(106,168,255,.25), 0 0 40px rgba(106,168,255,.35)', duration: 0.3, delay: 3.0, yoyo: true, repeat: 1 });
    }
    if (i === 1) {
      // the result comes back into the context window; the model reads it and answers
      S._fly(a, root, document.getElementById('ra-crm'), document.getElementById('ra-obs'), 'go-live Fri 13 Nov · Excel: included', '#5fd39a', 0);
      a.to('#ra-obs', { opacity: 1, duration: 0.4, delay: 1.0 });
      a.to(L[3], { opacity: 1, duration: 0.4, delay: 1.2 });
      a.to([L[4], L[5]], { opacity: 1, duration: 0.4, stagger: 0.8, delay: 1.9 });
    }
    if (i === 2) {
      // the morph: the Action line becomes a structured tool call; the Thoughts dissolve into hidden thinking
      const act = document.querySelector('#ra-t .ra-a .ra-v');
      a.to(act, { opacity: 0, duration: 0.3 });
      a.after(320, () => { act.innerHTML = '{"name": "crm_lookup", "arguments": {"client": "Lumen Retail", "project": "analytics dashboard"}}'; });
      a.to(act, { opacity: 1, color: '#8a5300', duration: 0.4, delay: 0.4 });
      a.after(320, () => { act.style.fontFamily = 'var(--mono)'; act.style.fontSize = '16px'; });
      a.to(document.querySelector('#ra-t .ra-a .ra-k'), { opacity: 0.5, duration: 0.3 });
      document.querySelectorAll('#ra-t .ra-t .ra-v').forEach(v => {
        a.to(v, { color: 'rgba(0,0,0,0)', duration: 0.4, delay: 0.8 });
        a.to(v, { backgroundImage: 'repeating-linear-gradient(-45deg,rgba(0,0,0,.14) 0 8px,rgba(0,0,0,.04) 8px 16px)', borderRadius: '6px', duration: 0.01, delay: 1.0 });
      });
      a.after(1200, () => document.querySelectorAll('#ra-t .ra-t .ra-k').forEach(k => { k.textContent = 'Thinking:'; }));
      a.after(400, () => { document.getElementById('ra-tag').textContent = 'ILLUSTRATION · THE SAME LOOP SINCE 2023: A TOOL CALL, AND HIDDEN THINKING'; });
      a.reveal('#ra-hist', { delay: 1.4 });
    }
    if (i === 3) { a.reveal('#ra-end'); a.reveal('#ra-ptr', { delay: 0.4 }); }
  },
});

/* ---------- A.tools ---------- */
const RA_TOOLS = [
  ['web_search', 'Search the web for current information.'],
  ['gmail', 'Search and read the user’s email.'],
  ['google_drive', 'Find and read files in Google Drive.'],
  ['pdf', 'Read, fill and create PDF files.'],
  ['crm_lookup', 'Look up an account in Brightline’s CRM.'],
  ['xlsx', 'Create and edit spreadsheets.'],
];
Deck.scene({
  id: 'A.tools', chapter: 'RA', section: ['5.10', 'ReAct prompting'], title: 'More tools than it shows you', steps: 3,
  mount(root, a) {
    kfHead(root, a, 'It has more tools than it <span class="amber">shows you.</span>');
    const list = a.at(a.el('div', 'abs hide', `<div class="mono" style="font-size:13px;letter-spacing:.16em;color:var(--dim);margin-bottom:14px">WHAT THE MODEL SEES ABOUT EACH TOOL · ILLUSTRATION</div>` +
      RA_TOOLS.map(([n, d]) => `<div class="ra-tool" data-n="${n}" style="position:relative;padding:10px 12px;border-radius:8px"><div style="display:flex;gap:18px"><span class="mono" style="flex:none;width:170px;font-size:18px;color:var(--amber)">${n}</span><span style="font-size:19px;color:var(--ink-2)">${d}</span></div>
        ${n === 'crm_lookup' ? `<div id="ra-full" style="height:0;overflow:hidden"><div style="margin-top:12px;padding:14px 16px;border-radius:8px;border:1px solid var(--amber);font-size:17px;line-height:1.5;color:var(--ink-2)"><span class="mono" style="font-size:11.5px;letter-spacing:.14em;color:var(--amber)">LOADED ONLY NOW</span><br>Use for any question about a client account: delivery dates, scope, contacts, approvals. Input: client name and project. Returns the latest account notes. Never guess an account fact; look it up.</div></div>` : ''}</div>`).join(''), root), 160, 240, 940);
    Object.assign(list.style, { padding: '22px 26px', borderRadius: '14px', background: 'var(--panel)', border: '1px solid var(--line-2)', boxSizing: 'border-box' }); list.id = 'ra-list';
    a.reveal(list, { delay: 0.4 });
    const beam = a.at(a.el('div', 'abs', '', list), 14, 60, 912); Object.assign(beam.style, { height: '44px', borderRadius: '8px', background: 'rgba(242,184,75,.14)', border: '1px solid rgba(242,184,75,.5)', opacity: 0, pointerEvents: 'none' }); beam.id = 'ra-beam';
    const q = a.at(a.el('div', 'abs hide', `“At startup, the agent pre-loads the name and description of every installed skill into its system prompt.”
      <div class="mono" style="margin-top:12px;font-size:13px;letter-spacing:.14em;color:var(--dim)">ANTHROPIC ENGINEERING, AGENT SKILLS · 16 OCT 2025</div>
      <div style="margin-top:18px;font-family:var(--sans);font-size:24px;line-height:1.45;color:var(--ink-2);font-weight:300">The full instructions load only once the model decides a tool fits. <span style="color:var(--ink)">It decides from that one line.</span></div>`, root), 1180, 250, 600);
    Object.assign(q.style, { fontFamily: 'var(--serif)', fontSize: '30px', lineHeight: 1.3, color: 'var(--ink)' });
    a.reveal(q, { delay: 1.0 });
    const mail = a.at(a.el('div', 'abs', '✉ Priya: when will it be ready?', root), 1500, 160);
    Object.assign(mail.style, { padding: '8px 14px', borderRadius: '8px', background: '#fff', color: '#1f1f1f', fontSize: '15px', boxShadow: '0 8px 20px rgba(0,0,0,.4)', opacity: 0, zIndex: 20 }); mail.id = 'ra-mail';
    const chk = a.at(a.el('div', 'abs hide', `<div class="kicker" style="margin-bottom:14px">We checked one</div>
      <div style="font-size:24px;line-height:1.45;color:var(--ink-2);font-weight:300">GPT-6 Luna, with web search offered. “What is Priya’s $4,800 invoice in rupees?” <span style="color:var(--green)">Searched 20 / 20.</span> Told to search: <span style="color:var(--green)">20 / 20.</span> When the need is obvious, it finds the tool.</div>`, root), 1180, 660, 600);
    chk.id = 'ra-chk';
    const map = BriefMap.build(root, a, { y: 420, done: [0, 1, 2, 3, 4, 5, 6, 7], now: [8] });
    const end = kfEnd(root, a, 'It picks a tool from one line. <span class="amber">Make the need obvious, or name the tool.</span>', 'ra-end2');
    const ptr = a.at(a.el('div', 'abs hide', kfMono('HOW THE HIDDEN LAYER WORKS: MODULE 6 · HOW CONNECTORS PLUG IN: MODULE 11', 'var(--dim)', 14), root), 0, 1030);
    Object.assign(ptr.style, { width: '1920px', textAlign: 'center', zIndex: 13 }); ptr.id = 'ra-ptr2';
    Deck._rt2 = { root, map, end, ptr };
  },
  step(i, a) {
    const { root, map, end, ptr } = Deck._rt2;
    if (i === 0) {
      // an email arrives; the model reads down the one-liners; one fits, and only that one opens up
      const rows = [...document.querySelectorAll('#ra-list .ra-tool')], k = rows.findIndex(r => r.dataset.n === 'crm_lookup');
      const lp = UI.pos(document.getElementById('ra-list'));
      a.fromTo('#ra-mail', { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' });
      a.to('#ra-mail', { x: lp.x + 600 - 1500, y: lp.y - 10 - 160, duration: 0.7, delay: 0.6, ease: 'power3.inOut' });
      a.to('#ra-beam', { opacity: 1, duration: 0.2, delay: 1.3 });
      rows.slice(0, k + 1).forEach((r, j) => a.to('#ra-beam', { y: r.offsetTop - 60, duration: 0.28, delay: 1.4 + j * 0.3, ease: 'power1.inOut' }));
      a.to(rows[k], { backgroundColor: 'rgba(242,184,75,.10)', duration: 0.3, delay: 1.5 + k * 0.3 });
      a.to('#ra-beam', { opacity: 0, duration: 0.3, delay: 1.9 + k * 0.3 });
      a.to('#ra-full', { height: 'auto', duration: 0.7, delay: 2.0 + k * 0.3, ease: 'power3.out' });
    }
    if (i === 1) a.reveal('#ra-chk');
    if (i === 2) { a.to('#ra-mail', { opacity: 0, duration: 0.3 }); BriefMap.checkpoint(a, root, map, [end, ptr]); a.reveal(end, { delay: 0.4 }); a.reveal(ptr, { delay: 0.7 }); }
  },
});
