/* ---------------- Question 3 · 5.7 Zero-shot, 5.8 Few-shot (and one-shot), 5.9 Chain-of-thought, Question 3 answered ----------------
   Q3.open  back to the opening wall: questions 1 and 2 ticked, question 3 glides out to centre; then the 5.7 definition
   Z.origin how the names were born, on a strip the camera pans along: GPT-2's "TL;DR:" (2019, sourced numbers), GPT-3's
            zero/one/few-shot (May 2020: the paper's sea otter → cheese example rebuilt, its own definitions), the API you
            "program" with examples (Jun 2020)
   Z.why    why examples at all: format. 2020 examples carry the shape → 2022 instructions work → 2023/24 the API takes the
            shape (schemas, Module 4.5) → today examples carry style and judgement. All sourced
   Z.shots  our CRM line three ways: zero-shot (real 0/60), one-shot (illustration: copied too closely), few-shot (real 60/60,
            judgement 38/60)
   Z.when   which one, when: a decision flow, sourced, with our own cases pinned on it; the strip
   T.open   the dive into the 5.9 cell; the definition
   T.history CoT began as few-shot (Wei 2022, the paper's own exemplar), then "Let's think step by step" (Kojima 2022), then
            why it works: the answer is predicted last (illustration)
   T.plan   one planning question three ways on GPT-6 Luna (real): the answer before the working, after it, after hidden
            thinking; gauges
   T.now    the hidden thinking in our own runs (real token counts); what the docs say now
   A3       Question 3 answered; the strip
   Data: window.REST. Class names are prefixed zs-, zw-, th-, st-. */

const zsCard = (root, a, x, y, w, html, id, border = 'var(--line-2)', hide = true) => {
  const c = a.at(a.el('div', 'abs' + (hide ? ' hide' : ''), html, root), x, y, w);
  Object.assign(c.style, { padding: '22px 26px', borderRadius: '14px', background: 'var(--panel)', border: '1px solid ' + border, boxSizing: 'border-box' }); if (id) c.id = id;
  return c;
};
const zsSrc = (t, c = 'var(--dim)') => `<div class="mono" style="margin-top:12px;font-size:12.5px;letter-spacing:.14em;color:${c}">${t}</div>`;
const zsQuote = (t, size = 30) => `<div style="font-family:var(--serif);font-size:${size}px;line-height:1.28;color:var(--ink)">${t}</div>`;

/* ---------- Q3.open ---------- */
Opener({ id: 'Q3.open', chapter: 'Q3', section: ['5.7', 'Zero-shot prompting'], title: 'Question 3 · Zero-shot', wall: 3,
  question: ['Question 3', 'When should you show it examples, or ask it to <em class="amber">think</em> first?'],
  kicker: '5.7 · Zero-shot prompting', defY: 300,
  def: 'Zero-shot means asking directly with no examples and relying on the model’s training. <span class="op-h">Works for common tasks; fails when the format or judgement is unusual.</span>',
  end: 'Every prompt so far has been zero-shot. <span class="amber">The name is older than the habit.</span>', endY: 820 });

/* ---------- Z.origin ---------- */
const ZS_DEF = [
  ['Zero-shot', 0, '“Zero-Shot (0S) is the same as one-shot except that no demonstrations are allowed, and the model is only given a natural language instruction describing the task.”', '“the most challenging setting”'],
  ['One-shot', 1, '“One-Shot (1S) is the same as few-shot except that only one demonstration is allowed, in addition to a natural language description of the task”', ''],
  ['Few-shot', 3, '“Few-Shot (FS) is the term we will use in this work to refer to the setting where the model is given a few demonstrations of the task at inference time as conditioning, but no weight updates are allowed.”', ''],
];
Deck.scene({
  id: 'Z.origin', chapter: 'Q3', section: ['5.7', 'Zero-shot prompting'], title: 'Before you could ask', steps: 4,
  mount(root, a) {
    kfHead(root, a, 'Before you could ask, <span class="amber">you set it up.</span>');
    // the timeline the camera follows
    const T = [['FEB 2019', 'GPT-2 · “TL;DR:”'], ['MAY 2020', 'GPT-3 · three names'], ['JUN 2020', 'The API · “program” it']];
    const tl = a.at(a.el('div', 'abs', `<div style="position:absolute;left:0;right:0;top:11px;height:2px;background:var(--line-2)"></div>` + T.map(([d, t], k) =>
      `<div class="zs-node" style="position:absolute;left:${k * 40}%;top:0;opacity:.35"><span style="display:block;width:24px;height:24px;border-radius:50%;background:var(--bg);border:2px solid var(--amber)"></span>
      <span class="mono" style="display:block;margin-top:10px;font-size:14px;letter-spacing:.12em;color:var(--amber)">${d}</span><span style="display:block;margin-top:2px;font-size:19px;color:var(--ink);white-space:nowrap">${t}</span></div>`).join(''), root), 160, 200, 1600);
    tl.style.height = '90px'; tl.id = 'zs-tl'; a.fromTo(tl, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.5 });
    const track = a.at(a.el('div', 'abs', '', root), 0, 330, 1920); track.id = 'zs-track';
    const frame = k => a.at(a.el('div', 'abs', '', track), 160 + k * 1800, 0, 1600);
    // frame 1 · 2019: a document for GPT-2 to continue
    const f0 = frame(0);
    const doc = a.at(a.el('div', 'abs', `<div class="mono" style="font-size:12px;letter-spacing:.14em;color:#8a6d3b;margin-bottom:14px">ILLUSTRATION · THERE WAS NO CHAT BOX. YOU STARTED A DOCUMENT, AND IT CARRIED ON</div>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:.12em;color:#666;border-bottom:1px solid #d8d2c4;padding-bottom:8px;margin-bottom:12px">BUSINESS · RETAIL TECHNOLOGY</div>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.2;color:#111;font-weight:700;margin-bottom:12px">Lumen Retail’s new dashboard slips again</div>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:1.6;color:#222;white-space:pre-wrap">MUMBAI, 12 NOVEMBER. Lumen Retail’s new analytics dashboard has slipped for the second time this quarter. The retailer had expected it on the 15th, and its board meets on Monday. A Brightline spokesperson said the team was working to deliver it as soon as possible…

<span id="zs-tldr" style="color:#111;font-weight:700"></span><span id="zs-cont" style="background:#d2f4d3"></span></div>`, f0), 0, 0, 860);
    Object.assign(doc.style, { background: '#f6f3ea', borderRadius: '6px', padding: '24px 30px', boxShadow: '0 20px 60px rgba(0,0,0,.5)', boxSizing: 'border-box' });
    const res = a.at(a.el('div', 'abs hide', zsQuote('“…this is known as the <span class="amber">‘zero-shot’</span> setting.”', 34) + zsSrc('OPENAI BLOG · 14 FEB 2019') +
      `<div style="margin-top:34px">${[['With “TL;DR:”', 21.40, 'var(--amber)'], ['3 random sentences', 20.98, 'var(--ink-2)'], ['No hint', 15.03, 'var(--faint)']].map(([t, v, c]) =>
        `<div style="display:flex;align-items:center;gap:14px;height:42px"><span style="width:210px;font-size:18px;color:var(--ink)">${t}</span><span class="zs-b" data-w="${v / 25 * 300}" style="display:inline-block;height:22px;width:0;border-radius:5px;background:${c}"></span><span class="mono" style="font-size:16px;color:var(--ink-2)">${v.toFixed(2)}</span></div>`).join('')}</div>` +
      zsSrc('SUMMARY QUALITY (ROUGE) · RADFORD ET AL., GPT-2 · FEB 2019') +
      `<div style="margin-top:16px;font-size:20px;line-height:1.45;color:var(--ink-2);font-weight:300">It worked, barely: it “just barely outperforms selecting 3 random sentences from the article.”</div>`, f0), 960, 0, 640);
    res.id = 'zs-res';
    // frame 2 · May 2020: the paper gives the three settings their names
    const f1 = frame(1);
    ZS_DEF.forEach(([t, n, d, extra], k) => {
      // the paper's own example (its Figure 2.1), rebuilt: the task line, n worked examples, then the word to translate
      const ex = [['sea otter', 'loutre de mer'], ['peppermint', 'menthe poivrée'], ['plush girafe', 'girafe peluche']].slice(0, n);
      const blocks = `<div class="mono" style="margin:14px 0 18px;padding:14px 16px;border-radius:10px;background:#f6f3ea;font-size:16px;line-height:1.7;color:#222">
        <div style="color:#8a5a00">Translate English to French:</div>
        ${ex.map(([e, f]) => `<div style="color:#555">${e} =&gt; ${f}</div>`).join('')}
        <div>cheese =&gt;<span class="zs-fr" style="color:#1e8e3e;font-weight:700"></span></div></div>`;
      const c = a.at(a.el('div', 'abs zs-def', `<div style="font-family:var(--serif);font-size:40px;color:var(--ink)">${t}</div>${blocks}
        <div style="font-size:17px;line-height:1.5;color:var(--ink-2)">${d}</div>${extra ? `<div style="margin-top:12px;font-family:var(--serif);font-size:24px;color:var(--amber)">${extra}</div>` : ''}`, f1), k * 545, 0, 510);
      Object.assign(c.style, { padding: '22px 24px', borderRadius: '14px', background: 'var(--panel)', border: '1px solid var(--line-2)', boxSizing: 'border-box', opacity: 0 });
    });
    a.at(a.el('div', 'abs', zsSrc('BROWN ET AL., “LANGUAGE MODELS ARE FEW-SHOT LEARNERS” · MAY 2020 · GPT-3, 175 BILLION PARAMETERS · EXAMPLES REBUILT FROM THE PAPER’S FIGURE 2.1'), f1), 0, 600);
    // frame 3 · Jun 2020: the API, programmed by examples
    const f2 = frame(2);
    a.at(a.el('div', 'abs', zsQuote('“Given any text prompt, the API will return a text completion, attempting to match the pattern you gave it. You can <span class="amber">‘program’ it by showing it just a few examples</span> of what you’d like it to do.”', 32) + zsSrc('OPENAI API LAUNCH · 11 JUN 2020'), f2), 0, 0, 620);
    // a 2020 prompt in the Playground of the day: no instruction at all, the examples are the instructions
    const PG = Playground.build(f2, a, { x: 700, y: 0, w: 900, h: 480, engine: 'davinci', tag: 'ILLUSTRATION · A 2020-STYLE PROMPT' });
    PG.text.innerHTML = `Email: Could you resend last month’s invoice?
Log: NORTHWIND · ROUTINE · resend invoice

Email: Second outage in two weeks. I expect a credit.
Log: KESTREL · ESCALATION · root cause, credit

Email: The dashboard you promised still isn’t live…
Log:${Playground.gen('<span id="zs-comp"></span>')}`;
    kfEnd(root, a, 'Examples weren’t a trick. <span class="amber">They were the only way to say what you wanted.</span>', 'zs-end', 975);
    this._node(a, 0);
  },
  _node(a, k) {
    document.querySelectorAll('#zs-tl .zs-node').forEach((n, j) => a.to(n, { opacity: j === k ? 1 : j < k ? 0.55 : 0.35, duration: 0.4 }));
    document.querySelectorAll('#zs-tl .zs-node span:first-child').forEach((n, j) => a.to(n, { backgroundColor: j <= k ? '#f2b84b' : '#07080b', duration: 0.4 }));
  },
  step(i, a) {
    const S = Deck.scenes.find(s => s.id === 'Z.origin');
    if (i === 0) {
      // the two magic characters, and what the model carries on with
      a.type(document.getElementById('zs-tldr'), 'TL;DR:', 8, 0.2);
      a.type(document.getElementById('zs-cont'), ' Lumen Retail’s dashboard is late again, days before its board meeting.', 40, 1.2);
      a.reveal('#zs-res', { delay: 1.0 });
      document.querySelectorAll('#zs-res .zs-b').forEach((b, k) => a.to(b, { width: +b.dataset.w, duration: 0.8, delay: 1.6 + k * 0.2, ease: 'power3.out' }));
    }
    if (i === 1) {
      // the camera pans a year on: three names for three ways of asking
      a.to('#zs-track', { x: -1800, duration: 1.1, ease: 'power3.inOut' }); S._node(a, 1);
      a.fromTo('#zs-track .zs-def', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.3, delay: 0.9, ease: 'power3.out' });
      document.querySelectorAll('#zs-track .zs-fr').forEach((f, k) => a.type(f, ' fromage', 10, 2.2 + k * 0.5));
    }
    if (i === 2) {
      a.to('#zs-track', { x: -3600, duration: 1.1, ease: 'power3.inOut' }); S._node(a, 2);
      a.type(document.getElementById('zs-comp'), ' LUMEN · ESCALATION · go-live, Excel export, new contact', 34, 1.4);
    }
    if (i === 3) a.reveal('#zs-end');
  },
});

/* ---------- Z.why ---------- */
const ZW = [
  ['2020', 'The format, by example', `<div style="font-size:19px;line-height:1.45;color:var(--ink-2)">No way to just ask for a shape. You showed two or three finished answers, and it copied them.</div>
    <div style="margin-top:14px;padding:12px 14px;border-radius:8px;background:#fff;font-size:15px;line-height:1.55;color:#202123;white-space:pre-wrap">Log: NORTHWIND · ROUTINE · …
Log: KESTREL · ESCALATION · …
Log: <span style="background:#d2f4d3">LUMEN · …</span></div>`],
  ['JAN 2022', 'Instructions start working', `<div style="font-family:var(--serif);font-size:21px;line-height:1.3;color:var(--ink)">“Making language models bigger does not inherently make them better at following a user’s intent.”</div>
    <div style="margin-top:10px;font-size:17px;line-height:1.45;color:var(--ink-2)">Trained on instructions, “outputs from the 1.3B parameter InstructGPT model are preferred to outputs from the 175B GPT-3”.</div>${zsSrc('OUYANG ET AL. (OPENAI) · INSTRUCTGPT · JAN 2022')}
    <div style="margin-top:12px;font-size:18px;color:var(--amber)">Zero-shot becomes the default.</div>`],
  ['2023 · 2024', 'The format moves into the API', `<div style="font-size:17px;line-height:1.45;color:var(--ink-2)">JSON mode “ensures the model will respond with valid JSON” (Nov 2023). Then schemas:</div>
    <div style="margin-top:12px">${[['gpt-4o + Structured Outputs', 100, 'var(--green)'], ['gpt-4-0613', 38, 'var(--faint)']].map(([t, v, c]) => `<div style="margin-bottom:8px"><div class="mono" style="font-size:12px;color:var(--ink-2);margin-bottom:4px">${t}</div><span class="zw-b" data-w="${v / 100 * 280}" style="display:inline-block;height:16px;width:0;border-radius:4px;background:${c}"></span> <span class="mono" style="font-size:13px;color:var(--ink-2)">${v === 100 ? '100%' : 'under 40%'}</span></div>`).join('')}</div>
    ${zsSrc('OPENAI · DEVDAY, 6 NOV 2023 · STRUCTURED OUTPUTS, 6 AUG 2024 · SCHEMAS IN DETAIL: MODULE 4.5')}`],
  ['TODAY', 'What examples are for now', `<div style="font-family:var(--serif);font-size:26px;line-height:1.3;color:var(--ink)">What a schema can’t say: <span class="amber">your house style, your tone, a judgement nobody would guess.</span></div>`],
];
Deck.scene({
  id: 'Z.why', chapter: 'Q3', section: ['5.8', 'Few-shot prompting'], title: 'Why examples? Format.', steps: 5,
  mount(root, a) {
    kfHead(root, a, 'Why examples? <span class="amber">Format.</span>');
    const NX = [340, 760, 1180, 1600], Y = 720;
    const rib = a.at(a.el('div', 'abs', '', root), 200, Y, 1520); Object.assign(rib.style, { height: '2px', background: 'var(--line-2)', transformOrigin: '0 50%' });
    a.fromTo(rib, { scaleX: 0 }, { scaleX: 1, duration: 0.9, delay: 0.3, ease: 'power3.inOut' });
    ZW.forEach(([d, t, body], k) => {
      const n = a.at(a.el('div', 'abs zw-n', `<span style="display:block;width:22px;height:22px;border-radius:50%;background:var(--bg);border:2px solid var(--amber);margin:0 auto"></span>
        <div class="mono" style="margin-top:10px;font-size:14px;letter-spacing:.12em;color:var(--amber);text-align:center;white-space:nowrap">${d}</div>`, root), NX[k] - 60, Y - 11, 120);
      n.style.opacity = 0.4;
      const c = a.at(a.el('div', 'abs hide zw-c', `<div style="font-family:var(--serif);font-size:28px;color:var(--ink);margin-bottom:12px">${t}</div>${body}`, root), NX[k] - 195, 240, 390);
      Object.assign(c.style, { padding: '20px 22px', borderRadius: '14px', background: 'var(--panel)', border: '1px solid var(--line-2)', boxSizing: 'border-box' });
    });
    const dot = a.at(a.el('div', 'abs', '', root), 200, Y - 7); Object.assign(dot.style, { width: '16px', height: '16px', borderRadius: '50%', background: 'var(--amber)', boxShadow: '0 0 18px rgba(242,184,75,.8)', opacity: 0 }); dot.id = 'zw-dot';
    kfEnd(root, a, 'Examples began as the only way to ask for a shape. <span class="amber">Now they teach what a schema can’t.</span>', 'zw-end', 960);
    Deck._zw = { NX };
  },
  step(i, a) {
    const { NX } = Deck._zw;
    if (i < 4) {
      // the dot travels to the next year; its card rises; the earlier ones step back
      a.to('#zw-dot', { opacity: 1, x: NX[i] - 208, duration: 0.8, ease: 'power3.inOut' });
      const ns = document.querySelectorAll('.zw-n'), cs = document.querySelectorAll('.zw-c');
      a.to(ns[i], { opacity: 1, duration: 0.3, delay: 0.6 });
      a.to(ns[i].firstElementChild, { backgroundColor: '#f2b84b', duration: 0.3, delay: 0.6 });
      for (let j = 0; j < i; j++) a.to(cs[j], { opacity: 0.4, duration: 0.4 });
      a.reveal(cs[i], { delay: 0.6 });
      cs[i].querySelectorAll('.zw-b').forEach((b, k) => a.to(b, { width: +b.dataset.w, duration: 0.8, delay: 1.2 + k * 0.2, ease: 'power3.out' }));
      return;
    }
    a.to('.zw-c', { opacity: 1, duration: 0.4 });
    a.reveal('#zw-end', { delay: 0.3 });
  },
});

/* ---------- Z.shots ---------- */
Deck.scene({
  id: 'Z.shots', chapter: 'Q3', section: ['5.8', 'Few-shot prompting'], title: 'Zero, one or few?', steps: 4,
  mount(root, a) {
    const C = window.REST.crm;
    kfHead(root, a, 'Zero, one, or <span class="amber">few?</span>', true);
    const sub = a.at(a.el('div', 'abs hide', kfMono('THE TASK: ONE LINE FOR BRIGHTLINE’S CRM LOG, IN ITS HOUSE FORMAT · CLIENT · TYPE · ASKS · REPLY BY', 'var(--dim)', 13), root), 160, 206);
    a.reveal(sub, { delay: 0.3 });
    // each way of asking: the prompt (as typed into the app), then the line it produced, dropped into Brightline's CRM log.
    // The house format has four columns; a line in the format fills them, a line that isn't spills across
    const exRow = (who, c) => `<div style="margin-top:6px;padding:6px 10px;border-radius:8px;background:#2a2b2d;font-size:13px;line-height:1.35">
      <span style="color:#9aa0a6">Example · ${who} →</span> <span style="color:#e3e3e3">${c}</span></div>`;
    const zero = C.zero.map(z => z.lines.find(l => !/[—–]/.test(l) && l.length < 240)).find(Boolean) || C.zero[0].lines[0];
    const few = C.few[2].lines[0].split(' · ');
    const cell = (t, cls = '') => `<td class="${cls}" style="padding:9px 10px;border-top:1px solid #ecebea;vertical-align:top;line-height:1.4">${t}</td>`;
    const P = [
      ['Zero-shot', 0, '',
        `<tr class="zs-out"><td colspan="4" style="padding:10px 12px;border-top:1px solid #ecebea;background:#fdecea;color:#a50e0e;line-height:1.45;font-size:14px">${kfEsc(zero)}</td></tr>`,
        `REAL · <span style="color:var(--red)">${C.zeroFormat} / 60</span> FIT THE COLUMNS`],
      ['One-shot', 1, exRow('Kestrel Foods, second outage, expects a credit', 'KESTREL FOODS · ESCALATION · 2 asks: root-cause report, service credit (not approved) · reply by 5 PM'),
        `<tr class="zs-out">${cell('LUMEN RETAIL')}${cell('ESCALATION')}${cell('<u class="zs-cp">2 asks</u>: delivery date, <u class="zs-cp">service credit (not approved)</u>')}${cell('<u class="zs-cp">by 5 PM</u>')}</tr>`,
        `<span style="color:var(--amber)">ILLUSTRATION</span> · COPIED TOO CLOSELY: PRIYA HAS 4 ASKS, AND HERS IS A DISCOUNT, NOT A CREDIT<br><span style="color:var(--amber)">REAL, ON THE SAME POINT: ${C.few[0].tagged} OF GEMINI’S 20 COPIED THE EXAMPLES’ &lt;LOG&gt; TAGS</span>`],
      ['Few-shot', 3, exRow('Northwind, resend an invoice', 'NORTHWIND SUPPLIES · ROUTINE · 1 ask: …') + exRow('Kestrel Foods, outage, credit', 'KESTREL FOODS · ESCALATION · 2 asks: …') + exRow('Orbit Travel, thanks, demo please', 'ORBIT TRAVEL · OPPORTUNITY · 1 ask: …'),
        `<tr class="zs-out">${cell(kfEsc(few[0]))}${cell(kfEsc(few[1]))}${cell(kfEsc(few[2]).replace('(not approved)', '<span style="background:rgba(242,184,75,.35);border-radius:4px;padding:0 2px">(not approved)</span>'))}${cell(kfEsc(few[3]))}</tr>`,
        `REAL · <span style="color:var(--green)">${C.few.reduce((s, f) => s + f.format, 0)} / 60</span> FIT THE COLUMNS · <span style="color:var(--amber)">${C.few.reduce((s, f) => s + f.notApproved, 0)} / 60</span> GOT THE JUDGEMENT`],
    ];
    P.forEach(([t, n, exs, out, verdict], k) => {
      const x = 160 + k * 545;
      const col = a.at(a.el('div', 'abs zs-p', `<div style="display:flex;align-items:baseline;gap:12px"><span style="font-family:var(--serif);font-size:38px;color:var(--ink)">${t}</span><span class="mono" style="font-size:13px;color:var(--dim)">${n} EXAMPLE${n === 1 ? '' : 'S'}</span></div>
        <div class="zs-in" style="margin-top:12px;padding:14px 16px;border-radius:16px;background:#1e1f20;border:1px solid #2f3032;font-family:var(--sans);color:#e3e3e3;opacity:0">
          <div style="font-size:15px;line-height:1.45">Write a one-line entry for our CRM log about this email.${n ? ' Follow the example' + (n > 1 ? 's' : '') + '.' : ''}</div>${exs}
          <div style="margin-top:10px">${Gem.chip(false)}</div></div>`, root), x, 250, 510);
      col.style.opacity = 0;
      a.fromTo(col, { opacity: 0, y: 30 }, { opacity: 0.45, y: 0, duration: 0.6, delay: 0.5 + k * 0.15, ease: 'power3.out' });
      const L = CRM.log(root, a, { x, y: 0, w: 510, widths: ['22%', '22%', '39%', '17%'] });
      col.appendChild(L.w); Object.assign(L.w.style, { position: 'relative', left: 0, top: 0, marginTop: '14px', opacity: 0 }); L.w.classList.add('zs-crm');
      L.body.innerHTML = out;
      const v = a.el('div', 'mono', verdict, col); Object.assign(v.style, { marginTop: '12px', fontSize: '12px', letterSpacing: '.12em', lineHeight: 1.55, color: 'var(--dim)', opacity: 0 }); v.classList.add('zs-v');
    });
    kfEnd(root, a, 'One example shows the shape. A few teach the pattern. <span class="amber">None can make the call for you.</span>', 'zs-end2', 975);
  },
  step(i, a) {
    const ps = document.querySelectorAll('.zs-p');
    if (i < 3) {
      // focus pull: this panel fills in and comes forward; the others step back
      ps.forEach((p, k) => a.to(p, { opacity: k === i ? 1 : k < i ? 0.55 : 0.3, duration: 0.4 }));
      a.to(ps[i].querySelector('.zs-in'), { opacity: 1, duration: 0.5, delay: 0.2 });
      a.fromTo(ps[i].querySelector('.zs-crm'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.8 });
      a.fromTo(ps[i].querySelector('.zs-out'), { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 1.3 });
      a.to(ps[i].querySelector('.zs-v'), { opacity: 1, duration: 0.4, delay: 1.7 });
      if (i === 1) a.to(ps[1].querySelectorAll('.zs-cp'), { color: '#b26b00', textDecorationColor: '#f2b84b', duration: 0.3, delay: 1.8, stagger: 0.2 });
      return;
    }
    ps.forEach(p => a.to(p, { opacity: 1, duration: 0.4 }));
    a.reveal('#zs-end2', { delay: 0.3 });
  },
});

/* ---------- Z.when ---------- */
Deck.scene({
  id: 'Z.when', chapter: 'Q3', section: ['5.8', 'Few-shot prompting'], title: 'Which one, when?', steps: 3,
  mount(root, a) {
    kfHead(root, a, 'Which one, <span class="amber">when?</span>');
    const start = zsCard(root, a, 160, 420, 470, `<div class="kicker" style="margin-bottom:14px">Start here</div>
      <div style="font-family:var(--serif);font-size:40px;line-height:1.15;color:var(--ink)">Ask plainly. <span class="amber" style="white-space:nowrap">Zero-shot.</span></div>
      <div style="margin-top:14px;font-size:18px;line-height:1.45;color:var(--ink-2)">“Try zero shot first, then few shot if needed.”</div>${zsSrc('OPENAI, REASONING BEST PRACTICES')}
      <div class="mono" style="margin-top:14px;font-size:12.5px;letter-spacing:.12em;color:var(--green)">OURS: THE REPLY TO PRIYA</div>`, 'zw-start', 'var(--amber)');
    a.reveal(start, { delay: 0.3 });
    const branch = (id, y, q, a1, src, pin) => zsCard(root, a, 780, y, 980, `<div style="font-family:var(--serif);font-size:30px;line-height:1.2;color:var(--ink-2)">${q}</div>
      <div style="margin-top:10px;font-family:var(--serif);font-size:36px;line-height:1.2;color:var(--ink)">${a1}</div>${src}
      <div class="mono" style="margin-top:12px;font-size:12.5px;letter-spacing:.12em;color:var(--green)">${pin}</div>`, id);
    branch('zw-a', 240, 'Does a program need an exact shape back?', 'Use a <span class="amber">response schema</span>. It’s an API feature, not an example.', zsSrc('GUARANTEED SHAPES: MODULE 4.5'), 'OURS: THE APP’S DRAFT AND ASK_ARJUN FIELDS');
    branch('zw-b', 560, 'Is it your house style, or a call nobody would guess?', '<span class="amber">Show it.</span> One example shows the shape. Three to five varied ones teach the pattern.',
      `<div style="margin-top:12px;font-size:17px;line-height:1.5;color:var(--ink-2)">Anthropic recommends 3 to 5 examples “for best results.” Gemini: “always include few-shot examples.” The providers disagree, so test it.</div>`, 'OURS: BRIGHTLINE’S CRM LOG LINE');
    const map = BriefMap.build(root, a, { y: 420, done: [0, 1, 2, 3, 4], now: [5, 6] });
    const end = kfEnd(root, a, 'Ask first. A schema for shape. <span class="amber">Examples for style.</span>', 'zw-end2');
    Deck._zn = { root, map, end, lk: Link.layer(root, a) };
  },
  step(i, a) {
    const { root, map, end, lk } = Deck._zn, st = document.getElementById('zw-start');
    if (i < 2) {
      const b = document.getElementById(i ? 'zw-b' : 'zw-a');
      a.fromTo(b, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.7, delay: 0.5, ease: 'power3.out' });
      a.after(150, () => Link.draw(a, lk, st, b, '#f2b84b', 0, b));
      return;
    }
    Link.clear(a, lk);
    BriefMap.checkpoint(a, root, map, [end]); a.reveal(end, { delay: 0.4 });
  },
});

/* ---------- T.open ---------- */
Opener({ id: 'T.open', chapter: 'Q3', section: ['5.9', 'Chain-of-thought prompting'], title: '5.9 · Chain-of-thought prompting', kicker: '5.9 · Chain-of-thought prompting',
  cell: 7, prev: { done: [0, 1, 2, 3, 4], now: [5, 6] },
  def: 'Chain-of-thought asks the model to <span class="op-h">reason step by step before answering</span>, which noticeably improves accuracy on <span class="op-h">multi-step and math-like problems</span>.',
  end: 'It began as <span class="amber">a kind of few-shot.</span>', endY: 720 });

/* ---------- T.history ---------- */
const TH_Q = 'Q: Shawn has five toys. For Christmas, he got two toys each from his mom and dad. How many toys does he have now?';
Deck.scene({
  id: 'T.history', chapter: 'Q3', section: ['5.9', 'Chain-of-thought prompting'], title: 'It began as examples', steps: 3,
  mount(root, a) {
    kfHead(root, a, 'It began as <span class="amber">examples.</span>');
    const g = a.at(a.el('div', 'abs', '', root), 0, 0); g.id = 'th-g1';
    // the two exemplars as the paper printed them: a white page, a serif face, the reasoning in the CoT one picked out
    const paper = (id, x, title, body) => {
      const c = a.at(a.el('div', 'abs', `<div style="font-family:Georgia,'Times New Roman',serif;font-size:15px;font-style:italic;color:#555;margin-bottom:10px">${title}</div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;line-height:1.5;color:#111">${body}</div>`, g), x, 230, 760);
      Object.assign(c.style, { padding: '22px 28px', borderRadius: '6px', background: '#fbfaf6', boxShadow: '0 20px 60px rgba(0,0,0,.5)', boxSizing: 'border-box' }); c.id = id;
      return c;
    };
    paper('th-std', 160, 'Standard prompting · the exemplar gives the answer only', `${TH_Q}<br>A: The answer is 9.`);
    paper('th-cot', 1000, 'Chain-of-thought prompting · the exemplar shows the working', `${TH_Q}<br>A: <span id="th-why" style="background:#fff1c9"></span>The answer is 9.`);
    a.fromTo(['#th-std', '#th-cot'], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.25, delay: 0.4, ease: 'power3.out' });
    a.type(document.getElementById('th-why'), 'Shawn started with 5 toys. If he got 2 toys each from his mom and dad, then that is 4 more toys. 5 + 4 = 9. ', 50, 1.4);
    a.at(a.el('div', 'abs', zsSrc('WEI ET AL. (GOOGLE) · “CHAIN-OF-THOUGHT PROMPTING ELICITS REASONING IN LARGE LANGUAGE MODELS” · JAN 2022 · EXEMPLAR FROM TABLE 20'), g), 160, 520, 1600);
    const bars = (id, y, label, rows, src) => {
      const b = a.at(a.el('div', 'abs hide', `<div class="mono" style="font-size:14px;letter-spacing:.14em;color:var(--ink-2);margin-bottom:16px">${label}</div>` +
        rows.map(([t, v, c]) => `<div style="display:flex;align-items:center;gap:18px;height:56px"><span style="width:330px;font-size:21px;color:var(--ink)">${t}</span><span class="th-b" data-w="${v * 10}" style="display:inline-block;height:34px;width:0;border-radius:6px;background:${c}"></span><span style="font-family:var(--serif);font-size:34px;color:${c}">${v}%</span></div>`).join('') + zsSrc(src), root), 160, y, 1600);
      b.id = id; return b;
    };
    bars('th-b1', 600, 'GRADE-SCHOOL MATHS (GSM8K) · PALM, 540 BILLION PARAMETERS', [['Standard exemplars', 17.9, 'var(--faint)'], ['Chain-of-thought exemplars', 56.9, 'var(--amber)']],
      'WEI ET AL. · IT “ONLY YIELDS PERFORMANCE GAINS WHEN USED WITH MODELS OF ∼100B PARAMETERS”');
    // click 2: no examples at all
    const g2 = a.at(a.el('div', 'abs', '', root), 0, 0); g2.id = 'th-g2'; g2.style.opacity = 0;
    // May 2022, in the Playground of the day: no examples, one sentence, and the model writes the working itself
    const PG = Playground.build(g2, a, { x: 160, y: 230, w: 1600, h: 330, engine: 'text-davinci-002', tag: 'ILLUSTRATION OF THE METHOD · NO EXAMPLES, ONE SENTENCE' });
    PG.text.innerHTML = `Q: Priya’s dashboard needs 1 day of validation and 2 days of sign-off, and it’s Wednesday afternoon. Is it live before Monday?\nA: <b id="th-kj"></b>${Playground.gen('<span id="th-kg"></span>')}`;
    bars('th-b2', 600, 'MULTIARITH (MATHS WORD PROBLEMS) · INSTRUCTGPT (TEXT-DAVINCI-002)', [['Zero-shot', 17.7, 'var(--faint)'], ['+ “Let’s think step by step”', 78.7, 'var(--amber)']],
      'KOJIMA ET AL. · “LARGE LANGUAGE MODELS ARE ZERO-SHOT REASONERS” · MAY 2022');
    // click 3: why it works: the answer is predicted last
    const tok = (ts, last) => ts.map(t => `<span class="mono" style="display:inline-block;margin:0 6px 8px 0;padding:6px 9px;border-radius:6px;border:1px solid var(--line-2);font-size:16px;color:var(--ink-2)">${t}</span>`).join('') + `<span class="mono th-q" style="display:inline-block;padding:6px 14px;border-radius:6px;border:2px dashed var(--amber);font-size:16px;color:var(--amber)">${last}</span>`;
    const odds = (rows) => `<div style="margin-top:14px">${rows.map(([t, v]) => `<div style="display:flex;align-items:center;gap:12px;height:30px"><span class="mono" style="width:40px;font-size:16px;color:var(--ink)">${t}</span><span class="th-o" data-w="${v * 6}" style="display:inline-block;height:16px;width:0;border-radius:4px;background:var(--amber)"></span></div>`).join('')}</div>`;
    const why = a.at(a.el('div', 'abs hide', `<div style="display:flex;gap:60px">
      <div style="flex:1"><div class="mono" style="font-size:13px;letter-spacing:.14em;color:var(--dim);margin-bottom:12px">ANSWER FIRST</div>${tok(['…how', 'many', 'toys', 'now?', 'A:', 'The', 'answer', 'is'], '?')}${odds([['9', 40], ['7', 26], ['11', 18]])}</div>
      <div style="flex:1"><div class="mono" style="font-size:13px;letter-spacing:.14em;color:var(--dim);margin-bottom:12px">AFTER THE WORKING</div>${tok(['…4', 'more', 'toys.', '5', '+', '4', '=', '9.', 'The', 'answer', 'is'], '?')}${odds([['9', 95], ['7', 2], ['11', 1]])}</div></div>
      <div style="margin-top:14px">${kfMono('ILLUSTRATION, NOT MEASURED ODDS · THE MODEL WRITES ONE TOKEN AT A TIME, SO THE ANSWER CAN ONLY USE WHAT CAME BEFORE IT', 'var(--dim)', 12.5)}</div>`, root), 160, 260, 1600);
    why.id = 'th-why2';
    kfEnd(root, a, 'Whatever is written before the answer <span class="amber">shapes the answer.</span>', 'th-end', 900);
  },
  step(i, a) {
    if (i === 0) {
      a.reveal('#th-b1');
      document.querySelectorAll('#th-b1 .th-b').forEach((b, k) => a.to(b, { width: +b.dataset.w, duration: 0.9, delay: 0.4 + k * 0.3, ease: 'power3.out' }));
    }
    if (i === 1) {
      // swap: the 2022 exemplars leave left; a single sentence, no examples, rises
      a.to(['#th-g1', '#th-b1'], { x: -140, rotation: -2, opacity: 0, duration: 0.5, ease: 'power2.in' });
      a.fromTo('#th-g2', { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.35, ease: 'power3.out' });
      a.type(document.getElementById('th-kj'), 'Let’s think step by step.', 26, 1.2);
      a.type(document.getElementById('th-kg'), ' Validation is Thursday. Sign-off is Friday and Monday. So it goes live Monday at 9 PM, after the meeting. The answer is no.', 60, 2.4);
      a.reveal('#th-b2', { delay: 1.6 });
      document.querySelectorAll('#th-b2 .th-b').forEach((b, k) => a.to(b, { width: +b.dataset.w, duration: 0.9, delay: 2.0 + k * 0.3, ease: 'power3.out' }));
    }
    if (i === 2) {
      a.to(['#th-g2', '#th-b2'], { opacity: 0, y: -30, duration: 0.45 });
      a.reveal('#th-why2', { delay: 0.4 });
      a.to('#th-why2 .th-q', { boxShadow: '0 0 0 4px rgba(242,184,75,.18)', duration: 0.4, delay: 1.0 });
      document.querySelectorAll('#th-why2 .th-o').forEach((b, k) => a.to(b, { width: +b.dataset.w, duration: 0.7, delay: 1.3 + (k % 3) * 0.15 + (k > 2 ? 0.8 : 0), ease: 'power3.out' }));
      a.reveal('#th-end', { delay: 2.8 });
    }
  },
});

/* ---------- T.plan ---------- */
Deck.scene({
  id: 'T.plan', chapter: 'Q3', section: ['5.9', 'Chain-of-thought prompting'], title: 'Can it be live by Monday?', steps: 4,
  mount(root, a) {
    const P = window.REST.plan;
    kfHead(root, a, 'Can it be live by <span class="amber">Monday?</span>');
    zsCard(root, a, 160, 215, 1600, `<div style="display:flex;gap:30px;align-items:flex-start">
      <div style="flex:1;font-size:19px;line-height:1.55;color:#ececec"><div class="mono" style="font-size:11px;letter-spacing:.14em;color:#9b9b9b;margin-bottom:6px">THE QUESTION, AS SENT</div>Today: Wednesday 11 November, 4 PM. <span id="st-board" style="padding:1px 6px;border-radius:5px;border:1px solid var(--amber);color:var(--amber)">Board: Monday 16 November, 10 AM</span>. Validation takes 1 working day, then sign-off takes 2, then deployment runs at 9 PM the day sign-off ends. Can it be live before the board meets? YES or NO first, then the day and time.</div>
      <div style="flex:none;width:300px"><div class="mono" style="font-size:12px;letter-spacing:.14em;color:var(--dim)">RIGHT ANSWER</div><div style="margin-top:6px;font-family:var(--serif);font-size:28px;color:var(--green)">NO · Mon 16 Nov, 9 PM</div>
      <div class="mono" style="margin-top:8px;font-size:12px;letter-spacing:.12em;color:var(--dim)">GPT-6 LUNA · 20 REAL RUNS A LANE</div></div></div>`, 'st-qcard');
    Object.assign(document.getElementById('st-qcard').style, { background: '#303030', border: 'none', borderRadius: '22px', fontFamily: 'var(--sans)' });
    a.reveal('#st-qcard', { delay: 0.3 });
    const pill = (t, k) => {
      const s = { bad: 'border:2px solid var(--red);color:var(--red)', ok: 'border:2px solid var(--green);color:var(--green)', step: 'border:1px solid var(--line-2);color:var(--ink-2)',
        hid: 'border:1px solid var(--line-2);color:var(--ink-2);background:repeating-linear-gradient(-45deg,rgba(236,232,223,.14) 0 8px,rgba(236,232,223,.04) 8px 16px)' }[k];
      return `<span class="st-pill" style="display:inline-block;margin-right:10px;padding:9px 15px;border-radius:10px;font-size:19px;${s}">${t}</span>`;
    };
    const ring = (n, c) => `<div style="position:relative;width:118px;height:118px"><svg width="118" height="118"><circle cx="59" cy="59" r="48" fill="none" stroke="rgba(236,232,223,.12)" stroke-width="10"/>
      <circle class="st-arc" data-f="${n / 20}" cx="59" cy="59" r="48" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-dasharray="301.6" stroke-dashoffset="301.6" transform="rotate(-90 59 59)"/></svg>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:34px;color:${c}">${n}<span class="mono" style="font-size:13px;color:var(--dim)">/20</span></div></div>`;
    const n = k => P[k].filter(r => r.ok).length;
    const L = [
      ['none', 'REASONING OFF · THE ANSWER FIRST', pill('YES', 'bad') + pill('Monday 16 November at 9 PM', 'bad'), ring(n('none'), 'var(--red)')],
      ['cot', 'REASONING OFF · “THINK STEP BY STEP”, THEN THE ANSWER', pill('Thu 12: validation', 'step') + pill('Fri 13 + Mon 16: sign-off', 'step') + pill('Mon 16, 9 PM: deploy', 'step') + pill('NO', 'ok') + pill('Mon 16 Nov, 9 PM', 'ok'), ring(n('cot'), 'var(--green)')],
      ['think', 'REASONING ON (THE DEFAULT) · THE ANSWER FIRST', pill(`Thinking · about ${Math.round(P.think.reduce((s, r) => s + r.reasoning, 0) / 20)} hidden tokens ›`, 'hid') + pill('NO', 'ok') + pill('Mon 16 Nov, 9 PM', 'ok'), ring(n('think'), 'var(--green)')],
    ];
    L.forEach(([k, lab, pills, g], j) => {
      const r = a.at(a.el('div', 'abs hide st-lane', `<div style="display:flex;align-items:center;gap:30px"><div style="flex:1"><div class="mono" style="font-size:13px;letter-spacing:.14em;color:var(--dim);margin-bottom:12px">${lab}</div><div>${pills}</div></div>${g}</div>`, root), 160, 420 + j * 170, 1600);
      r.id = 'st-l' + k;
    });
    const note = a.at(a.el('div', 'abs hide', kfMono('IT HAD TO WRITE YES OR NO FIRST. THEN IT WROTE A TIME AFTER THE BOARD MEETS.', 'var(--red)', 13), root), 160, 548); note.id = 'st-note';
    kfEnd(root, a, 'The working has to come before the answer. <span class="amber">Today, the model does it on its own.</span>', 'st-end2', 975);
    Deck._tp = { lk: Link.layer(root, a) };
  },
  _lane(a, k) {
    a.reveal('#st-l' + k);
    a.fromTo(`#st-l${k} .st-pill`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.25, delay: 0.3 });
    const arc = document.querySelector(`#st-l${k} .st-arc`);
    a.to(arc, { strokeDashoffset: 301.6 * (1 - +arc.dataset.f), duration: 1.0, delay: 0.8, ease: 'power3.out' });
  },
  step(i, a) {
    const S = Deck.scenes.find(s => s.id === 'T.plan'), { lk } = Deck._tp;
    if (i === 0) {
      S._lane(a, 'none');
      a.after(1100, () => Link.draw(a, lk, document.querySelectorAll('#st-lnone .st-pill')[1], document.getElementById('st-board'), '#ff6b5e', 0));
      a.reveal('#st-note', { delay: 1.6 });
    }
    if (i === 1) { Link.clear(a, lk); a.to('#st-note', { opacity: 0, duration: 0.3 }); S._lane(a, 'cot'); }
    if (i === 2) S._lane(a, 'think');
    if (i === 3) a.reveal('#st-end2');
  },
});

/* ---------- T.now ---------- */
Deck.scene({
  id: 'T.now', chapter: 'Q3', section: ['5.9', 'Chain-of-thought prompting'], title: 'Thinking is a setting now', steps: 3,
  mount(root, a) {
    const TH = window.REST.thinking;
    kfHead(root, a, 'Thinking is a <span class="amber">setting</span> now.');
    const k = a.at(a.el('div', 'abs hide', kfMono('OUR REPLY ASSISTANT RUNS (5.4) · AVERAGE TOKENS PER REPLY · NOBODY ASKED THEM TO THINK', 'var(--amber)', 15), root), 160, 230);
    a.reveal(k, { delay: 0.3 });
    const PX = 0.55;
    Object.entries(TH).forEach(([name, [hidden, vis]], j) => {
      const r = a.at(a.el('div', 'abs hide', `<div style="display:flex;align-items:center;gap:24px"><span style="width:340px;font-family:var(--serif);font-size:34px;color:var(--ink)">${name}</span>
        <span class="st-hb" style="display:inline-block;height:30px;width:0;border-radius:6px 0 0 6px;background:repeating-linear-gradient(-45deg,rgba(236,232,223,.22) 0 8px,rgba(236,232,223,.08) 8px 16px)"></span><span style="display:inline-block;height:30px;width:${vis * PX}px;margin-left:-24px;border-radius:0 6px 6px 0;background:var(--amber)"></span>
        <span class="mono" style="font-size:17px;color:var(--ink-2);white-space:nowrap">${hidden.toLocaleString('en-US')} hidden · <span style="color:var(--amber)">${vis} visible</span></span></div>`, root), 160, 300 + j * 90);
      a.reveal(r, { delay: 0.6 + j * 0.3 });
      a.to(r.querySelector('.st-hb'), { width: hidden * PX, duration: 1.0, delay: 0.9 + j * 0.3, ease: 'power3.out' });
    });
    const q1 = a.at(a.el('div', 'abs hide', `“Prefer general instructions over prescriptive steps. A prompt such as ‘think thoroughly’ often produces better reasoning than a hand-written step-by-step plan.”
      <div class="mono" style="margin-top:12px;font-size:13px;letter-spacing:.14em;color:var(--dim)">ANTHROPIC, PROMPTING BEST PRACTICES (CLAUDE DOCS)</div>`, root), 160, 600, 1600);
    Object.assign(q1.style, { fontFamily: 'var(--serif)', fontSize: '32px', lineHeight: 1.3, color: 'var(--ink)' }); q1.id = 'st-q1';
    const q2 = a.at(a.el('div', 'abs hide', `Thinking off? Then ask, the old way: <span class="amber">“work it out before you answer.”</span> The docs call it “manual chain-of-thought … as a fallback.”`, root), 160, 790, 1600);
    Object.assign(q2.style, { fontFamily: 'var(--serif)', fontSize: '32px', lineHeight: 1.3, color: 'var(--ink)' }); q2.id = 'st-q2';
    kfEnd(root, a, 'Turn thinking on and give it the goal. <span class="amber">Write “step by step” only when it’s off.</span>', 'st-end3');
  },
  step(i, a) {
    if (i === 0) a.reveal('#st-q1');
    if (i === 1) a.reveal('#st-q2');
    if (i === 2) a.reveal('#st-end3');
  },
});

/* ---------- A3: Question 3, answered ---------- */
Deck.scene({
  id: 'A3', chapter: 'Q3', title: 'Question 3, answered', steps: 2,
  mount(root, a) {
    const C = window.REST.crm, P = window.REST.plan;
    kfHead(root, a, 'Question 3, <span class="amber">answered.</span>');
    const row = (y, k, big, small) => { const r = a.at(a.el('div', 'abs hide', `<div class="kicker" style="margin-bottom:14px">${k}</div>
      <div style="font-family:var(--serif);font-size:44px;line-height:1.2;color:var(--ink)">${big}</div>
      <div style="margin-top:14px;font-size:24px;line-height:1.45;color:var(--ink-2);font-weight:300">${small}</div>`, root), 160, y, 1600); return r; };
    a.reveal(row(250, 'Show it examples', 'When the <span class="amber">style or the call</span> is yours. A schema does the shape.', `Three examples took our CRM line from ${C.zeroFormat} / 60 to ${C.few.reduce((s, f) => s + f.format, 0)} / 60. The judgement still needed a rule.`), { delay: 0.3 });
    a.reveal(row(520, 'Ask it to think first', 'When there are <span class="amber">steps</span>. Today, that’s a setting.', `Reasoning off, answer first: ${P.none.filter(r => r.ok).length} / 20 right. Thinking, by setting or by asking: 20 / 20.`), { delay: 0.8 });
    const map = BriefMap.build(root, a, { y: 420, done: [0, 1, 2, 3, 4, 5, 6], now: [7] });
    const end = kfEnd(root, a, 'Examples for the style. <span class="amber">Thinking for the steps.</span>', 'a3-end', 850);
    Deck._a3 = { root, map, end };
  },
  step(i, a) {
    const { root, map, end } = Deck._a3;
    if (i === 0) a.reveal(end);
    if (i === 1) { BriefMap.checkpoint(a, root, map, [end]); a.to(end, { y: 110, duration: 0.6 }); }
  },
});
