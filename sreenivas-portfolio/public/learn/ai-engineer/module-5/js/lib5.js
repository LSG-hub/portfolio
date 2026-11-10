/* Module 5 building blocks: prompt cards, reply cards (from saved runs), chapter tags, captions, sources.
   Every reply shown comes from window.EX (deck/data/examples.js), built from examples/out/*.json. */
window.M5 = (function () {
  const A = () => Deck.api;
  const esc = (s) => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  // light markdown for replies: **bold**, `code`, headings → bold lines, keep line breaks
  const md = (s) => esc(s).replace(/^#{1,4}\s*(.+)$/gm, '<b>$1</b>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<span class="mono" style="color:var(--amber)">$1</span>').replace(/\n/g, '<br>');
  const ROLE = { system: ['SYSTEM', 'var(--violet)'], user: ['USER', 'var(--blue)'], text: ['THE TEXT', 'var(--ink-2)'], example: ['EXAMPLES', 'var(--green)'],
    facts: ['FACTS', 'var(--teal)'], instr: ['INSTRUCTION', 'var(--amber)'], tools: ['TOOLS', 'var(--amber)'], model: ['MODEL', 'var(--green)'] };

  function ex(id) { return (window.EX || {})[id] || { reply: `‹missing run: ${id}›`, model: '?', ran_at: '' }; }
  function when(id) { const t = ex(id).ran_at; return t ? new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''; }
  const NICE = { 'gemini-3.8-flash': 'Gemini 3.8 Flash', 'gemini-3.5-flash': 'Gemini 3.5 Flash', 'gemini-2.5-flash': 'Gemini 2.5 Flash', 'openai-community/gpt2': 'GPT-2 (2019)',
    'Qwen/Qwen2.5-0.5B': 'Qwen2.5-0.5B base', 'Qwen/Qwen2.5-1.5B-Instruct': 'Qwen2.5-1.5B Instruct' };
  function modelName(id) { const m = ex(id).model; return NICE[m] || m; }

  /** a card of prompt segments: [{role, text, html?}] */
  function prompt(root, x, y, w, segs, o = {}) {
    const c = A().at(A().el('div', 'card', '', root), x, y, w);
    c.style.cssText += `padding:16px 18px;background:#0f1218;${o.h ? `height:${o.h}px;overflow:hidden;` : ''}`;
    c.innerHTML = `<div class="mono" style="font-size:12px;letter-spacing:.16em;color:var(--dim);margin-bottom:10px">${o.title || 'WHAT WE SEND'}</div>` +
      segs.map((s, k) => {
        const [lab, col] = ROLE[s.role] || ROLE.text;
        return `<div data-seg="${k}" style="border-left:3px solid ${col};padding:4px 0 4px 12px;margin-bottom:8px">
          <div class="mono" style="font-size:11px;letter-spacing:.14em;color:${col}">${s.label || lab}</div>
          <div class="${s.mono === false ? '' : 'mono'}" style="font-size:${o.size || 15}px;line-height:1.5;color:var(--ink-2);white-space:pre-wrap">${s.html || esc(s.text)}</div></div>`;
      }).join('');
    return c;
  }

  /** a reply card for a saved run; text appears on show() */
  function reply(root, x, y, w, id, o = {}) {
    const c = A().at(A().el('div', 'card', '', root), x, y, w);
    c.style.cssText += `padding:16px 18px;${o.h ? `height:${o.h}px;overflow:hidden;` : ''}border-color:${o.col || 'var(--line-2)'}`;
    let text = o.text != null ? o.text : (ex(id).reply ?? JSON.stringify(ex(id).error));
    let cut = !!o.trimmed;  // o.trimmed: caller passed a shortened o.text
    if (o.max && text.length > o.max) { text = text.slice(0, o.max).replace(/\s+\S*$/, ''); cut = true; }
    c.innerHTML = `<div class="mono" style="font-size:12px;letter-spacing:.14em;color:var(--dim);margin-bottom:10px;display:flex;justify-content:space-between;gap:12px"><span>${o.title || 'REPLY'} · <span style="color:var(--ink-2)">${modelName(id)}</span></span><span>${when(id)}</span></div>
      <div class="rb ${o.mono ? 'mono' : ''}" style="font-size:${o.size || 18}px;line-height:1.5;color:var(--ink)"></div>
      ${cut ? `<div class="mono" style="font-size:12px;color:var(--dim);margin-top:10px">… ${o.more || 'reply continues'} · real reply, cut for the slide</div>` : ''}`;
    c.style.opacity = 0;
    const body = c.querySelector('.rb');
    return {
      el: c,
      show(d = 0) {
        A().to(c, { opacity: 1, duration: 0.4, delay: d });
        if (A().instant) { body.innerHTML = o.raw ? esc(text).replace(/\n/g, '<br>') : md(text); return; }
        A().after(d * 1000 + 150, () => { body.innerHTML = ''; });
        const st = { n: 0 };
        A().to(st, { n: text.length, duration: Math.min(2.6, text.length / 260), delay: d + 0.2, ease: 'none',
          onUpdate: () => { body.innerHTML = (o.raw ? esc(text.slice(0, Math.round(st.n))).replace(/\n/g, '<br>') : md(text.slice(0, Math.round(st.n)))); },
          onComplete: () => { body.innerHTML = o.raw ? esc(text).replace(/\n/g, '<br>') : md(text); } });
      },
    };
  }

  /** syllabus chapter tags, top right */
  function tags(root, list) {
    const t = A().at(A().el('div', '', '', root), 1160, 44, 700);
    t.style.cssText += 'display:flex;gap:8px;justify-content:flex-end;z-index:41';
    t.innerHTML = list.map(c => `<span class="mono" style="font-size:12px;letter-spacing:.08em;padding:5px 10px;border-radius:999px;border:1px solid var(--line-2);color:var(--ink-2)">${c}</span>`).join('');
    return t;
  }
  /** "then" fact chips in a row */
  function chips(root, x, y, list, w = 1600) {
    const r = A().at(A().el('div', '', '', root), x, y, w);
    r.style.cssText += 'display:flex;gap:10px;flex-wrap:wrap';
    r.innerHTML = list.map((c, k) => `<span data-chip="${k}" class="mono" style="font-size:14px;padding:7px 12px;border-radius:8px;background:rgba(242,184,75,.08);border:1px solid rgba(242,184,75,.35);color:var(--ink-2)"><span class="amber">${c[0]}</span> · ${c[1]}</span>`).join('');
    return r;
  }
  /** caption line (serif) with replay-safe set() */
  function caption(root, y = 868) {
    const c = A().at(A().el('div', '', '', root), 160, y, 1600);
    c.style.cssText += 'font-family:var(--serif);font-size:27px;line-height:1.32;color:var(--ink-2)';
    return {
      el: c,
      set(h) {
        if (A().instant) { c.innerHTML = h; return; }
        A().to(c, { opacity: 0, duration: 0.2 }); A().after(220, () => { c.innerHTML = h; }); A().to(c, { opacity: 1, duration: 0.4, delay: 0.25 });
      },
    };
  }
  // bottom-anchored so a two-line source never runs into the year ribbon
  function source(root, text) { const s = A().at(A().el('div', 'source', text, root), 160, 0, 1600); s.style.top = 'auto'; s.style.bottom = '84px'; return s; }
  return { esc, md, ex, when, modelName, prompt, reply, tags, chips, caption, source };
})();
