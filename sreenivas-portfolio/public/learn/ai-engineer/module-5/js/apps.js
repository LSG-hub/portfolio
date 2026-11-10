/* Real app UIs the deck shows text inside, so prompts and examples read as something people recognise rather than code.
   Studio.build(root, a, o): Google AI Studio's chat prompt page, dark mode. Labels follow Google's AI Studio quickstart:
   a "Run settings" panel holding "System instructions", a "Type something..." composer, "Run" and "Get code". The
   "Max output tokens" row stands for the API's maxOutputTokens; we could not confirm AI Studio's exact label for it.
   o = { x, y, w, h, panel (width of Run settings), model, title }. Class names are prefixed st-. */
window.Studio = (function () {
  const logo = `<svg width="22" height="22" viewBox="0 0 24 24" style="flex:none"><path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" fill="none" stroke="#a8c7fa" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  function build(root, a, o) {
    const P = o.panel || 460, H = o.h;
    const w = a.at(a.el('div', 'st-win abs', '', root), o.x, o.y, o.w);
    Object.assign(w.style, { height: H + 'px', borderRadius: '18px', background: '#131314', border: '1px solid rgba(255,255,255,.09)', overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(0,0,0,.6)', fontFamily: 'var(--sans)', color: '#e3e3e3', zIndex: 3 });
    w.innerHTML = `
      <div style="position:absolute;left:0;right:0;top:0;height:58px;border-bottom:1px solid #2a2b2d;display:flex;align-items:center;gap:12px;padding:0 20px">
        ${logo}<span style="font-size:17px;color:#e3e3e3">Google AI Studio</span><span style="color:#5f6368">/</span><span style="font-size:16px;color:#c4c7c5">${o.title || 'Reply Assistant'}</span>
        <span style="margin-left:auto;font-size:14px;color:#c4c7c5;border:1px solid #444746;border-radius:16px;padding:5px 13px">Get code</span></div>
      <div class="st-chat" style="position:absolute;left:0;top:58px;bottom:0;width:${o.w - P}px">
        <div class="st-user" style="position:absolute;right:22px;top:24px;max-width:${o.w - P - 60}px;background:#2a2b2d;border-radius:18px;padding:12px 16px;opacity:0">
          <div class="mono" style="font-size:11px;letter-spacing:.12em;color:#9aa0a6;margin-bottom:8px">USER</div>
          <div class="st-user-b" style="font-size:16px;line-height:1.45"></div></div>
        <div class="st-resp" style="position:absolute;left:22px;right:22px;top:180px;font-size:15.5px;line-height:1.55;color:#e3e3e3;opacity:0"></div>
        <div class="st-comp" style="position:absolute;left:18px;right:18px;bottom:18px;height:104px;border-radius:20px;background:#1e1f20;border:1px solid #2f3032">
          <div style="position:absolute;left:18px;top:16px;font-size:16px"><span class="st-ph" style="color:#8e918f">Type something...</span><span class="st-in" style="color:#e3e3e3"></span></div>
          <span class="st-run" style="position:absolute;right:12px;bottom:12px;display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:18px;background:#a8c7fa;color:#062e6f;font-size:15px;font-weight:500">Run <span style="font-size:12px;opacity:.75">Ctrl ↵</span></span></div></div>
      <div class="st-panel" style="position:absolute;right:0;top:58px;bottom:0;width:${P}px;border-left:1px solid #2a2b2d;background:#1b1c1d;padding:18px 20px;box-sizing:border-box">
        <div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:16px;color:#e3e3e3">Run settings</span>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 6h10M17 6h4M3 12h4M11 12h10M3 18h12M19 18h2" stroke="#c4c7c5" stroke-width="2" stroke-linecap="round"/><circle cx="15" cy="6" r="2" fill="none" stroke="#c4c7c5" stroke-width="2"/><circle cx="9" cy="12" r="2" fill="none" stroke="#c4c7c5" stroke-width="2"/><circle cx="17" cy="18" r="2" fill="none" stroke="#c4c7c5" stroke-width="2"/></svg></div>
        <div style="margin-top:14px;padding:10px 14px;border-radius:12px;background:#2a2b2d;font-size:15px;color:#e3e3e3;display:flex;justify-content:space-between">${o.model || 'Gemini 3.8 Flash'}<span style="color:#9aa0a6">▾</span></div>
        <div style="margin-top:18px;font-size:14px;color:#c4c7c5">System instructions</div>
        <div class="st-sys" style="margin-top:8px;min-height:120px;padding:12px 14px;border-radius:12px;border:1px solid #444746;background:#131314;font-size:16px;line-height:1.5;color:#e3e3e3"></div>
        <div class="st-more" style="margin-top:18px;font-size:14px;color:#9aa0a6">
          <div style="display:flex;justify-content:space-between;align-items:center"><span>Temperature</span><span style="color:#e3e3e3">1</span></div>
          <div style="position:relative;height:4px;margin:10px 0 18px;border-radius:2px;background:#444746"><span style="position:absolute;left:0;top:0;bottom:0;width:50%;border-radius:2px;background:#a8c7fa"></span><span style="position:absolute;left:50%;top:-6px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:#a8c7fa"></span></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span>Max output tokens</span><span class="st-max mono" style="min-width:90px;text-align:right;padding:4px 10px;border-radius:8px;border:1px solid #444746;color:#e3e3e3;font-size:14px">65,536</span></div>
          <div style="display:flex;justify-content:space-between"><span>Structured output</span><span style="width:34px;height:18px;border-radius:9px;background:#444746;display:inline-block"></span></div></div></div>`;
    const q = (s) => w.querySelector(s);
    return { w, sys: q('.st-sys'), user: q('.st-user'), userB: q('.st-user-b'), resp: q('.st-resp'), comp: q('.st-comp'), ph: q('.st-ph'), input: q('.st-in'),
      run: q('.st-run'), panel: q('.st-panel'), more: q('.st-more'), max: q('.st-max') };
  }
  return { build, logo };
})();

/* Playground.build(root, a, o): the GPT-3 Playground as it looked in 2020 to 2022, light mode: a prompt page with a "Load a
   preset..." menu, the generated part highlighted green, a Submit button, and a settings column (labels from the period
   descriptions: Engine, Response Length, Temperature, Top P, Frequency Penalty, Presence Penalty, Best Of). Always shown with
   an ILLUSTRATION tag. o = { x, y, w, h, engine, side (show the settings column), tag }. Class names are prefixed pg-. */
window.Playground = (function () {
  function build(root, a, o) {
    const S = o.side === false ? 0 : 230;
    const w = a.at(a.el('div', 'pg-win abs', '', root), o.x, o.y, o.w);
    Object.assign(w.style, { height: o.h + 'px', borderRadius: '14px', background: '#ffffff', overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,.55)', fontFamily: 'var(--sans)', color: '#202123', zIndex: 3 });
    const row = (k, v) => `<div style="margin-top:14px;font-size:13px;color:#353740"><div style="display:flex;justify-content:space-between"><span>${k}</span><span style="color:#6e6e80">${v}</span></div>
      <div style="height:3px;margin-top:8px;border-radius:2px;background:#ececf1"><div style="width:45%;height:3px;border-radius:2px;background:#10a37f"></div></div></div>`;
    w.innerHTML = `
      <div style="position:absolute;left:0;right:0;top:0;height:50px;border-bottom:1px solid #ececf1;display:flex;align-items:center;gap:14px;padding:0 18px">
        <span style="font-size:17px;font-weight:600">Playground</span>
        <span style="font-size:13px;color:#6e6e80;border:1px solid #d9d9e3;border-radius:6px;padding:4px 10px">Load a preset... ▾</span>
        <span class="mono" style="margin-left:auto;font-size:11px;letter-spacing:.14em;color:#b26b00">${o.tag || 'ILLUSTRATION'}</span></div>
      <div class="pg-text" style="position:absolute;left:22px;top:66px;right:${S + 22}px;bottom:70px;font-size:16px;line-height:1.6;white-space:pre-wrap;color:#202123"></div>
      <span class="pg-submit" style="position:absolute;left:22px;bottom:18px;padding:8px 18px;border-radius:6px;background:#10a37f;color:#fff;font-size:14px;font-weight:500">Submit</span>
      ${S ? `<div style="position:absolute;right:0;top:50px;bottom:0;width:${S}px;border-left:1px solid #ececf1;padding:14px 18px;box-sizing:border-box">
        <div style="font-size:13px;color:#353740">Engine</div>
        <div style="margin-top:6px;padding:6px 10px;border:1px solid #d9d9e3;border-radius:6px;font-size:14px;display:flex;justify-content:space-between">${o.engine || 'davinci'}<span style="color:#6e6e80">▾</span></div>
        ${row('Response Length', 64)}${row('Temperature', 0.7)}${row('Top P', 1)}${row('Frequency Penalty', 0)}${row('Presence Penalty', 0)}${row('Best Of', 1)}</div>` : ''}`;
    const q = (s) => w.querySelector(s);
    return { w, text: q('.pg-text'), submit: q('.pg-submit') };
  }
  // the green highlight the Playground put behind generated text
  const gen = (t, cls = '') => `<span class="pg-gen ${cls}" style="background:#d2f4d3;border-radius:2px">${t}</span>`;
  return { build, gen };
})();

/* CRM: Brightline's own CRM (fictional, part of the case), light mode. CRM.record shows one account's notes as fields;
   CRM.log shows the activity log as a table (Client · Type · Asks · Reply by). Class names are prefixed crm-. */
window.CRM = (function () {
  const bar = (title) => `<div style="height:46px;background:#16325c;color:#fff;display:flex;align-items:center;gap:12px;padding:0 18px;border-radius:12px 12px 0 0">
    <svg width="20" height="22" viewBox="0 0 34 40"><ellipse cx="17" cy="7" rx="15" ry="5" fill="none" stroke="#9cc3ff" stroke-width="2.4"/><path d="M2 7v26c0 3 7 5 15 5s15-2 15-5V7M2 20c0 3 7 5 15 5s15-2 15-5" fill="none" stroke="#9cc3ff" stroke-width="2.4"/></svg>
    <span style="font-size:16px;font-weight:600">Brightline CRM</span><span style="font-size:14px;color:#b9c7dc">${title}</span>
    <span style="margin-left:auto;font-size:12px;color:#b9c7dc;background:rgba(255,255,255,.1);border-radius:12px;padding:4px 12px">Search accounts</span></div>`;
  function shell(root, a, o, title) {
    const w = a.at(a.el('div', 'crm-win abs', bar(title), root), o.x, o.y, o.w);
    Object.assign(w.style, { borderRadius: '12px', background: '#f3f2f2', boxShadow: '0 24px 70px rgba(0,0,0,.55)', fontFamily: 'var(--sans)', color: '#181818', zIndex: 3 });
    return w;
  }
  /** o = { x, y, w, account, sub, fields: [[label, valueHtml]] } */
  function record(root, a, o) {
    const w = shell(root, a, o, '/ Accounts / ' + o.account);
    const b = a.el('div', '', `<div style="display:flex;align-items:center;gap:12px"><span style="width:38px;height:38px;border-radius:8px;background:#ff5d2d;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center">${o.account[0]}</span>
      <div><div style="font-size:12px;color:#706e6b">Account</div><div style="font-size:20px;font-weight:600">${o.account}</div></div>
      <span style="margin-left:auto;font-size:13px;color:#706e6b">${o.sub || ''}</span></div>
      <div style="margin-top:14px;background:#fff;border:1px solid #dddbda;border-radius:10px">` +
      o.fields.map(([k, v], j) => `<div class="crm-f" data-k="${j}" style="display:flex;gap:16px;padding:12px 16px;${j ? 'border-top:1px solid #ecebea;' : ''}"><span style="flex:none;width:170px;font-size:13px;color:#706e6b;padding-top:2px">${k}</span><span class="crm-v" style="font-size:17px;line-height:1.45">${v}</span></div>`).join('') + '</div>', w);
    b.style.padding = '16px 18px 18px';
    return { w, fields: [...w.querySelectorAll('.crm-f')] };
  }
  /** o = { x, y, w, title, rows: [[client, type, asks, reply]], cols } ; returns tbody to append rows to */
  function log(root, a, o) {
    const w = shell(root, a, o, '/ ' + (o.title || 'Activity log'));
    const cols = o.cols || ['Client', 'Type', 'Asks', 'Reply by'], wd = o.widths || ['28%', '18%', '36%', '18%'];
    const b = a.el('div', '', `<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #dddbda;border-radius:8px;table-layout:fixed;font-size:15px">
      <thead><tr>${cols.map((c, j) => `<th style="width:${wd[j]};text-align:left;padding:9px 12px;font-size:12px;font-weight:600;color:#706e6b;background:#fafaf9;border-bottom:1px solid #dddbda">${c}</th>`).join('')}</tr></thead>
      <tbody class="crm-body">${(o.rows || []).map(r => rowHtml(r)).join('')}</tbody></table>`, w);
    b.style.padding = '14px 16px 16px';
    return { w, body: w.querySelector('.crm-body') };
  }
  const rowHtml = (r, cls = '') => `<tr class="crm-row ${cls}">${r.map(c => `<td style="padding:9px 12px;border-top:1px solid #ecebea;vertical-align:top;line-height:1.4">${c}</td>`).join('')}</tr>`;
  return { record, log, rowHtml };
})();
