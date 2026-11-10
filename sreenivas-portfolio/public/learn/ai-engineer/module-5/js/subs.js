/* Live subtitles that follow the script.
   1. Speech-to-text: the browser's own recogniser (Safari: webkitSpeechRecognition, Apple's speech model). It gives rough words.
   2. Script follower (no ML): a small alignment over the current scene's script. A cursor moves forward only when the
      recent spoken words line up, in order, with script words ahead of it; off-script talk never lines up, so it never shows.
      [click] markers in the script are anchors: each click snaps the cursor to that part of the script.
   What is displayed is the script's own words up to the cursor, never the raw recognition (except in "raw" mode).
   Shared by presenter.html (runs the mic) and the deck (draws the overlay; can also run the mic alone). */
window.Subs = (function () {
  const STOP = new Set('a an the and or but so of to in on at by for with from as is are was were be been it its this that these those you your we our i me my they them their he she his her there here then than not no do does did can will just also very about into over up out if what which who how when where why one okay ok yeah right everyone now well let see get go got know like um uh'.split(' '));
  const norm = (w) => w.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9.%]+/g, '').replace(/^\.+|\.+$/g, '');

  /** script text → display words, normalised words, click anchors and sentence starts */
  function parse(say) {
    const words = [], clicks = [], sents = [0];
    const parts = String(say || '').replace(/\s+/g, ' ').split(/(\[click\])/);
    parts.forEach(p => {
      if (p === '[click]') { clicks.push(words.length); if (words.length && sents[sents.length - 1] !== words.length) sents.push(words.length); return; }
      p.split(' ').filter(Boolean).forEach(t => {
        words.push({ t, n: norm(t) });
        if (/[.?!]["”’)]*$/.test(t)) sents.push(words.length);
      });
    });
    // names = words written with a capital in mid-sentence somewhere in this script (so "Llama" counts at a sentence start too)
    const names = new Set('gpt openai claude anthropic gemini google gemma llama meta muse qwen alibaba deepseek mistral mixtral cohere command aya apache mit nvidia ollama hugging'.split(' ')), starts = new Set(sents);
    words.forEach((w, i) => { if (!starts.has(i) && /^[A-Z][A-Za-z]/.test(w.t) && !/^(I|I'm|I'll|OK)$/.test(w.t)) names.add(w.n.replace(/s$/, '')); });
    words.forEach(w => { w.k = /\d/.test(w.t) || (/^[A-Z]/.test(w.t) && names.has(w.n.replace(/s$/, ''))); });
    const ss = [...new Set(sents)].filter(i => i < words.length).sort((x, y) => x - y);
    // chunks: each sentence, split at commas/colons into pieces of about two caption lines
    const chunks = [];
    ss.forEach((st, k) => {
      const en = (ss[k + 1] ?? words.length) - 1;
      let a = st;
      while (a <= en) {
        let len = 0, b = a, cut = -1;
        while (b <= en && len + words[b].t.length + 1 <= 96) { len += words[b].t.length + 1; if (/[,;:—–]$/.test(words[b].t) && b - a >= 3) cut = b; b++; }
        let e = b > en ? en : (cut >= 0 && cut < b - 1 && (b - 1 - cut) < 9 ? cut : b - 1);
        if (e < a) e = a;
        chunks.push([a, e]); a = e + 1;
      }
    });
    return { words, clicks, sents: ss, chunks };
  }

  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const d = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      let prev = d[0]; d[0] = i;
      for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t; }
    }
    return d[b.length];
  }
  /** how well a heard word matches a script word: 0 = no match */
  function sim(h, s) {
    if (!h || !s) return 0;
    if (h === s) return 1;
    if (s.length >= 4 && h.length >= 4) {
      const e = lev(h, s);
      if (e <= (s.length >= 7 ? 2 : 1)) return 0.8;
      if (s.length >= 6 && (s.startsWith(h) || h.startsWith(s))) return 0.7; // "licence" vs "licences", plural/stem
    }
    return 0;
  }
  const weight = (w) => STOP.has(w) ? 0.4 : (w.length >= 7 ? 2.2 : 1.6);
  // what speech recognisers often write for the family names (heard → script spelling)
  const ALIAS = { gwen: 'qwen', quen: 'qwen', kwen: 'qwen', quinn: 'qwen', cloud: 'claude', clawed: 'claude', lama: 'llama', jemma: 'gemma', gema: 'gemma',
    mistrel: 'mistral', gbt: 'gpt', deepsea: 'deepseek', coherent: 'cohere', olama: 'ollama', oss: 'oss', astro: 'astra', sole: 'sol', luna: 'luna', mixed: 'mixed' };
  const alias = (w) => ALIAS[w] || w;

  /** follows one scene's script */
  function Follower(say) {
    const S = parse(say);
    const F = { S, cur: -1, score: 0, fresh: true };
    /** feed the latest heard words (normalised, oldest first). Returns true if the cursor moved.
        Only matches beyond the cursor count as evidence; nearer positions win, so a phrase repeated later never steals the cursor. */
    F.feed = (heardRaw) => {
      const H = heardRaw.slice(-8).map(alias);
      if (!H.length || !S.words.length) return false;
      const lo = Math.max(0, F.cur - 12), hi = Math.min(S.words.length - 1, F.cur + 32); // look back far enough for the heard words to land where they were said
      let prev = new Map(); // script position j → { v: total score, e: evidence beyond the cursor }
      for (let i = 0; i < H.length; i++) {
        const now = new Map();
        const put = (j, v, e) => { const o = now.get(j); if (!o || v > o.v) now.set(j, { v, e }); };
        for (let j = lo; j <= hi; j++) {
          const sw = S.words[j].n;
          let m = sim(H[i], sw); // a word the recogniser split in two: "deep seek" = "deepseek", "fine tune" = "finetune"
          if (i > 0) m = Math.max(m, sim(H[i - 1] + H[i], sw));
          if (!m) continue;
          const w = m * weight(sw), gain = j > F.cur ? w : 0;
          let bv = 0, be = 0;
          prev.forEach((o, pj) => { if (pj < j) { const v = o.v - 0.15 * (j - pj - 1); if (v > bv) { bv = v; be = o.e; } } });
          put(j, bv + w, be + gain);
        }
        prev.forEach((o, pj) => { if (o.v - 0.3 > 0) put(pj, o.v - 0.3, o.e); }); // an off-script word in between costs a little
        prev = now;
      }
      // the reading that explains all the recent words best (nearest wins a tie); move only if it ends past the cursor
      let pick = -1, pv = -1, pe = 0;
      prev.forEach((o, j) => { if (o.v > pv + 1e-9 || (Math.abs(o.v - pv) < 1e-9 && j < pick)) { pv = o.v; pick = j; pe = o.e; } });
      if (pick <= F.cur) return false;
      const jump = pick - F.cur;
      const need = jump === 1 ? 0.4 : jump <= 3 ? 0.8 : jump <= 8 ? 1.6 : jump <= 18 ? 3.2 : 4.4; // the very next word needs almost nothing, big jumps need a lot
      if (pe < (F.fresh ? Math.max(need, 1.6) : need)) return false; // the first move after a scene change or a click needs a real content word
      F.fresh = false;
      F.cur = pick;
      return true;
    };
    /** snap to the text that follows click number `beat` (0 = start of the scene) */
    F.anchor = (beat, backwards) => {
      const a = beat > 0 ? (S.clicks[beat - 1] ?? S.words.length) - 1 : -1;
      if (backwards || a > F.cur) { F.cur = a; F.fresh = true; }
    };
    F.nudge = (d) => { F.cur = Math.max(-1, Math.min(S.words.length - 1, F.cur + d)); };
    F.nextSentence = () => { const n = S.sents.find(s => s > F.cur + 1); F.cur = (n ?? S.words.length) - 1; };
    const chunkOf = (p) => S.chunks.find(([x, y]) => p >= x && p <= y) || null;
    /** the caption to show, teleprompter style: the whole current chunk, each word flagged `on` once spoken.
        preview = show the chunk that comes next (nothing lit yet). Returns [{t, k, on}]. */
    F.line = (preview = false) => {
      const c = chunkOf(preview || F.cur < 0 ? F.cur + 1 : F.cur);
      if (!c) return [];
      return S.words.slice(c[0], c[1] + 1).map((x, i) => ({ t: x.t, k: x.k, on: c[0] + i <= F.cur }));
    };
    /** true when the last word of a chunk has just been spoken (time to queue the next one) */
    F.chunkDone = () => { const c = chunkOf(F.cur); return !!c && F.cur === c[1] && F.cur < S.words.length - 1; };
    F.text = () => F.line().filter(x => x.on).map(x => x.t).join(' ');
    F.context = () => S.words.slice(Math.max(0, F.cur - 6), F.cur + 7).map((x, k, arr) => (Math.max(0, F.cur - 6) + k === F.cur ? `[${x.t}]` : x.t)).join(' ');
    return F;
  }

  /** speech recogniser with auto-restart (Safari stops continuous recognition every minute or so) */
  function Mic(onWords, onStatus) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const M = { want: false, lang: 'en-IN', rec: null, heard: '' };
    if (!SR) { onStatus('unsupported', 'This browser has no speech recognition. Use Safari or Chrome.'); return M; }
    const make = () => {
      const r = new SR();
      r.continuous = true; r.interimResults = true; r.lang = M.lang; r.maxAlternatives = 1;
      r.onstart = () => onStatus('listening', 'Listening');
      r.onresult = (e) => {
        let txt = '';
        for (let i = Math.max(0, e.results.length - 3); i < e.results.length; i++) txt += ' ' + e.results[i][0].transcript;
        M.heard = txt.trim();
        onWords(M.heard.split(/\s+/).map(norm).filter(Boolean), M.heard);
      };
      r.onerror = (e) => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { M.want = false; onStatus('blocked', 'Microphone or speech recognition not allowed'); } else if (e.error !== 'no-speech' && e.error !== 'aborted') onStatus('error', e.error); };
      r.onend = () => { if (M.want) setTimeout(() => { try { M.rec = make(); M.rec.start(); } catch (err) { onStatus('error', String(err)); } }, 250); else onStatus('off', 'Mic off'); };
      return r;
    };
    M.start = () => { if (M.want) return; M.want = true; try { M.rec = make(); M.rec.start(); } catch (e) { onStatus('error', String(e)); } };
    M.stop = () => { M.want = false; try { M.rec && M.rec.stop(); } catch (e) {} };
    M.setLang = (l) => { M.lang = l; if (M.want) { try { M.rec.stop(); } catch (e) {} } }; // onend restarts with the new language
    return M;
  }

  /** the deck overlay (inside the 1920×1080 stage, so it scales with the slide): one caption card that grows word by word */
  function View(stage) {
    const el = document.createElement('div'); el.id = 'subs'; stage.appendChild(el);
    const box = document.createElement('div'); box.className = 'box'; el.appendChild(box);
    let saved = {}; try { saved = JSON.parse(localStorage.getItem('m5-cut3-cc-deck') || '{}'); } catch (e) {}
    const V = { el, opt: Object.assign({ visible: true, size: 'M', pos: 'bottom' }, saved), shown: [] };
    V.apply = (o) => {
      Object.assign(V.opt, o || {});
      try { localStorage.setItem('m5-cut3-cc-deck', JSON.stringify(V.opt)); } catch (e) {}
      el.className = `subs-${V.opt.pos} subs-${V.opt.size}${V.opt.visible ? '' : ' subs-hidden'}${el.classList.contains('on') ? ' on' : ''}`;
    };
    const esc = (t) => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const span = (x) => `<span class="w${x.k ? ' k' : ''}${x.on === false ? '' : ' on'}">${esc(x.t)}</span>`;
    /** words: [{t, k, on}] (on = spoken: lit; k = key word: amber) or a plain string (raw mode: all lit).
        The same chunk again only lights words; a new chunk swaps in. */
    V.show = (words) => {
      if (typeof words === 'string') words = words.split(/\s+/).filter(Boolean).map(t => ({ t, k: false, on: true }));
      if (!words || !words.length) { el.classList.remove('on'); V.shown = []; return; }
      const same = V.shown.length === words.length && V.shown.every((x, i) => x.t === words[i].t);
      if (same) {
        box.querySelectorAll('.w').forEach((s, i) => s.classList.toggle('on', words[i].on !== false));
      } else {
        box.innerHTML = words.map(span).join(' ');
        el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap');
      }
      V.shown = words.map(x => ({ t: x.t }));
      el.classList.add('on');
    };
    V.apply();
    return V;
  }

  /** test without a mic: speak the scene's script with some recognition noise and off-script fillers */
  function simulate(say, onWords, rate = 2.6, from = 0) {
    const words = parse(say).words.slice(Math.max(0, from)).map(w => w.n).filter(Boolean);
    const FILL = ['um', 'so', 'okay', 'basically', 'right', 'you', 'know', 'like'];
    const heard = []; let i = 0;
    const tick = () => {
      if (i >= words.length) return;
      const r = Math.random();
      if (r < 0.08) heard.push(FILL[Math.floor(Math.random() * FILL.length)]);          // filler
      else if (r < 0.14) { heard.push(words[i].slice(0, -1) + 'z'); i++; }               // mis-heard word
      else if (r < 0.18) i++;                                                             // dropped word
      else heard.push(words[i++]);
      onWords(heard.slice(-10), heard.slice(-12).join(' '));
      sim.t = setTimeout(tick, 1000 / rate);
    };
    const sim = { stop: () => clearTimeout(sim.t) }; tick();
    return sim;
  }

  return { parse, norm, sim, Follower, Mic, View, simulate };
})();
