/* ---------------- Question 1, answered + the definition (5.1) ----------------
   The 20 go-live dates Gemini invented under the plain prompt, counted (real), become the candidates for "live by ___";
   each run is a fresh pick. Then the answer, then the better prompt's single answer (20/20), then the roadmap's definition.
   Data: window.BRIEF.plainDates. Class names are prefixed def-. */

Deck.scene({
  id: 'D.def', chapter: 'Q1', title: 'Question 1, answered', steps: 5,
  mount(root, a) {
    const B = window.BRIEF, D = B.plainDates, max = D[0][1];
    const h = a.at(a.el('div', 'h-md hide', 'Question 1, <span class="amber">answered.</span>', root), 140, 92);
    a.reveal(h, { delay: 0.1 });
    const k1 = a.at(a.el('div', 'abs mono hide', 'WHAT A GO-LIVE DATE LOOKS LIKE, TO GEMINI · COUNTS FROM 20 REAL RUNS', root), 160, 250);
    Object.assign(k1.style, { fontSize: '16px', letterSpacing: '.18em', color: 'var(--amber)' }); k1.id = 'def-k1';
    a.reveal(k1, { delay: 0.4 });
    // one bar per date it invented, longest first
    const bars = D.map(([lab, n], k) => {
      const y = 310 + k * 74;
      const r = a.at(a.el('div', 'abs def-bar', `<span class="mono def-lab" style="display:inline-block;width:230px;font-size:20px;color:var(--ink)">${lab}</span>
        <span class="def-fill" style="display:inline-block;vertical-align:middle;height:34px;border-radius:6px;background:var(--amber);width:0"></span>
        <span class="mono def-n" style="margin-left:16px;font-size:20px;color:var(--dim)">${n}</span>`, root), 160, y);
      r.style.whiteSpace = 'nowrap'; r.style.opacity = 0;
      a.to(r, { opacity: 1, duration: 0.3, delay: 0.6 + k * 0.12 });
      a.to(r.querySelector('.def-fill'), { width: Math.round(n / max * 520), duration: 0.7, delay: 0.7 + k * 0.12, ease: 'power3.out' });
      return r;
    });
    // the sentence it was completing (click 1)
    const sent = a.at(a.el('div', 'abs hide', `The dashboard will be live by <span class="def-blank" style="display:inline-block;min-width:250px;border-bottom:3px solid var(--amber);color:var(--amber);padding:0 6px">&nbsp;</span>`, root), 160, 790);
    Object.assign(sent.style, { fontFamily: 'var(--serif)', fontSize: '40px', color: 'var(--ink)' }); sent.id = 'def-sent';
    const sub = a.at(a.el('div', 'abs mono hide', 'EVERY RUN PICKS AGAIN FROM WHAT’S LIKELY. NOTHING IS LOOKED UP.', root), 160, 868);
    Object.assign(sub.style, { fontSize: '16px', letterSpacing: '.16em', color: 'var(--dim)' }); sub.id = 'def-sub';
    // the answer (click 2)
    const ans = a.at(a.el('div', 'abs hide', `<div class="kicker" style="margin-bottom:22px">Answer 1</div>
      <div style="font-family:var(--serif);font-size:46px;line-height:1.16;color:var(--ink)">Every reply is a fresh pick from <span class="amber">what’s likely.</span></div>
      <div style="margin-top:24px;font-size:26px;line-height:1.45;color:var(--ink-2);font-weight:300">Gemini didn’t look up a date. It predicted one that sounds right. Ask again, and it picks again.</div>`, root), 1120, 300, 660);
    ans.id = 'def-ans';
    // the better prompt's single answer (click 3)
    const one = a.at(a.el('div', 'abs hide', `<span class="mono" style="display:inline-block;width:230px;font-size:20px;color:var(--ink)">Confirm by 5 PM</span>
      <span style="display:inline-block;vertical-align:middle;height:34px;border-radius:6px;background:var(--green);width:520px"></span>
      <span class="mono" style="margin-left:16px;font-size:20px;color:var(--green)">20</span>`, root), 160, 560);
    one.style.whiteSpace = 'nowrap'; one.id = 'def-one';
    const k2 = a.at(a.el('div', 'abs mono hide', 'WITH THE BETTER PROMPT · 20 REAL RUNS · ONE ANSWER', root), 160, 500);
    Object.assign(k2.style, { fontSize: '16px', letterSpacing: '.18em', color: 'var(--green)' }); k2.id = 'def-k2';
    // the definition (click 3) and the cheapest lever (click 4)
    const def = a.at(a.el('div', 'abs hide', `<div class="kicker" style="margin-bottom:22px">5.1 · Prompt engineering</div>
      <div style="font-family:var(--serif);font-size:52px;line-height:1.14;color:var(--ink)">The discipline of writing instructions that get <span class="amber">consistent, high-quality output.</span></div>
      <div class="mono" style="margin-top:20px;font-size:14px;letter-spacing:.14em;color:var(--dim)">AI ENGINEER ROADMAP · 5.1</div>`, root), 1120, 300, 680);
    def.id = 'def-def';
    const lever = a.at(a.el('div', 'abs hide', 'It is the cheapest lever you have, so exhaust it before reaching for retrieval or fine-tuning.', root), 1120, 700, 680);
    Object.assign(lever.style, { fontSize: '28px', lineHeight: 1.45, color: 'var(--ink-2)', fontWeight: 300 }); lever.id = 'def-lever';
    const end = a.at(a.el('div', 'abs hide', 'Now let’s build that prompt, <span class="amber">piece by piece.</span>', root), 0, 976);
    Object.assign(end.style, { width: '1920px', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: '42px', color: 'var(--ink)' }); end.id = 'def-end';
    const map = BriefMap.build(root, a, { y: 420 });
    Deck._cd = { bars, D, root, map, end };
  },
  step(i, a) {
    const { bars, D, root, map, end } = Deck._cd;
    if (i === 0) {
      // the blank gets filled, three times, each time a different pick
      a.reveal('#def-sent');
      const blank = document.querySelector('.def-blank');
      const picks = [0, 4, 1];   // Friday 3 PM, Sunday noon, Friday 2 PM: real values from the runs
      const tw = (t, v) => a.instant ? gsap.set(t, v) : gsap.to(t, v);   // replays (going back) land on the final state at once
      picks.forEach((p, n) => a.after(700 + n * 1100, () => {
        bars.forEach((b, k) => tw(b, { opacity: k === p ? 1 : 0.35, duration: 0.25 }));
        blank.textContent = D[p][0];
        if (!a.instant) gsap.fromTo(blank, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 });
      }));
      a.after(700 + picks.length * 1100, () => bars.forEach(b => tw(b, { opacity: 1, duration: 0.3 })));
      a.reveal('#def-sub', { delay: 3.9 });
    }
    if (i === 1) a.reveal('#def-ans');
    if (i === 2) {
      // the better prompt: six guesses become one answer; the definition takes the answer's place
      a.to(bars, { opacity: 0, x: -20, duration: 0.4, stagger: 0.05 });
      a.to(['#def-k1', '#def-sent', '#def-sub', '#def-ans'], { opacity: 0, duration: 0.35 });
      a.reveal('#def-k2', { delay: 0.4 });
      a.reveal('#def-one', { delay: 0.5 });
      a.reveal('#def-def', { delay: 0.9 });
    }
    if (i === 3) { a.reveal('#def-lever'); a.reveal('#def-end', { delay: 0.6 }); }
    // the pieces we'll build, one chapter at a time
    if (i === 4) BriefMap.checkpoint(a, root, map, [end]);
  },
});
