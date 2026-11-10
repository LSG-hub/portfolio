/* ---------------- Title card (unchanged from the previous Module 5 cut) ---------------- */
Deck.scene({
  id: 'T.title', chapter: '0', title: 'Prompt Engineering', steps: 0, noChrome: true,
  mount(root, a) {
    root.style.background = '#000';
    // same title card as Module 3: centred, letter-spacing settles in; the module name on two lines
    a.el('div', 'center', `<div class="mono dim" style="font-size:20px;letter-spacing:.5em;margin-bottom:48px">AI ENGINEER ROADMAP · MODULE 5</div>
      <div id="tword" style="font-family:var(--serif);font-size:190px;font-weight:300;letter-spacing:.12em;line-height:1.08">PROMPT<br>ENGINEERING</div>
      <div class="mono dim" style="margin-top:90px;font-size:17px;letter-spacing:.3em">ENGINEERING LEARNING CIRCLE · 26 OCTOBER 2026</div>`, root);
    a.fromTo('#tword', { opacity: 0, letterSpacing: '0.45em' }, { opacity: 1, letterSpacing: '0.12em', duration: 2.2, ease: 'power3.out', delay: 0.2 });
  },
});
