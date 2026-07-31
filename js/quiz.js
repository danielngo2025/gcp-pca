// Mock test engine. Modes: full timed exam, per-section drill, wrong-only retake, leeches.
// Questions are sampled weighted to the real section percentages so a full mock's mix
// matches the exam rather than the bank's shape.
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sectionOf = q => q.t.split('.')[0];

  // Deterministic-enough shuffle; Math.random is fine in the browser.
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(p => p[1]);

  let run = null;   // { qs, i, answers, mode, endsAt, timer, label }

  function weightedSample(n) {
    const picked = [];
    window.BLUEPRINT.sections.forEach(s => {
      const want = Math.round(n * s.weight / 100);
      const pool = shuffle(window.QUESTIONS.filter(q => sectionOf(q) === s.id));
      picked.push(...pool.slice(0, want));
    });
    // Top up or trim if rounding drifted.
    const rest = shuffle(window.QUESTIONS.filter(q => !picked.includes(q)));
    while (picked.length < n && rest.length) picked.push(rest.pop());
    return shuffle(picked).slice(0, n);
  }

  function start(mode, opts) {
    opts = opts || {};
    let qs, minutes = 0, label = '';

    if (mode === 'full') {
      qs = weightedSample(Math.min(60, window.QUESTIONS.length));
      minutes = 120;
      label = 'Full timed mock';
    } else if (mode === 'section') {
      qs = shuffle(window.QUESTIONS.filter(q => sectionOf(q) === opts.section));
      label = `§${opts.section} drill`;
    } else if (mode === 'topic') {
      qs = shuffle(window.QUESTIONS.filter(q => q.t === opts.topic));
      label = `§${opts.topic} drill`;
    } else if (mode === 'wrong') {
      const ids = Store.wrongOnce();
      qs = shuffle(window.QUESTIONS.filter(q => ids.includes(q.id)));
      label = 'Wrong answers only';
    } else if (mode === 'leech') {
      const ids = Store.leeches();
      qs = shuffle(window.QUESTIONS.filter(q => ids.includes(q.id)));
      label = 'Leech list';
    }

    if (!qs || !qs.length) return null;

    run = { qs, i: 0, answers: qs.map(() => null), mode, label, minutes, endsAt: minutes ? Date.now() + minutes * 60000 : null };
    return run;
  }

  function current() { return run; }
  function abandon() { run = null; }

  function select(optIdx) {
    const q = run.qs[run.i];
    const multi = q.a.length > 1;
    let cur = run.answers[run.i] || [];
    if (multi) {
      cur = cur.includes(optIdx) ? cur.filter(x => x !== optIdx) : cur.concat(optIdx);
    } else {
      cur = [optIdx];
    }
    run.answers[run.i] = cur.sort((a, b) => a - b);
  }

  const isCorrect = (q, ans) =>
    !!ans && ans.length === q.a.length && q.a.every(x => ans.includes(x));

  function grade() {
    let score = 0;
    run.qs.forEach((q, i) => {
      const ok = isCorrect(q, run.answers[i]);
      if (ok) score++;
      Store.recordAnswer(q.id, ok);
    });
    return score;
  }

  /* ---------------- rendering ---------------- */

  function renderMenu() {
    const total = window.QUESTIONS.length;
    const wrong = Store.wrongOnce().length, leech = Store.leeches().length;
    const bySection = window.BLUEPRINT.sections.map(s => {
      const n = window.QUESTIONS.filter(q => sectionOf(q) === s.id).length;
      return `<button class="drill" data-mode="section" data-section="${s.id}">
        <b>§${s.id}</b> ${esc(s.title)}<span class="dim mono"> ${n}q · ${s.weight}%</span></button>`;
    }).join('');

    return `
      <div class="card meta"><div>
        <b>${total} questions</b> — authored from the official exam guide bullets, the four case
        studies and the Well-Architected Framework, weighted to the real section percentages.
        <div class="small dim">These train reasoning, not exam wording. Add one reputable practice-exam
        product in week 9 for realistic full mocks — verify it covers the Oct 2025 revision by checking
        its case studies are Altostrat / Cymbal / KnightMotives, not the retired set.</div>
      </div></div>

      <div class="grid-2">
        <div class="card">
          <h2>Full mock</h2>
          <p class="small dim">${Math.min(60, total)} questions, 120 minutes, weighted to the exam. Sit it uninterrupted.</p>
          <button class="primary" data-mode="full">Start timed mock</button>
        </div>
        <div class="card">
          <h2>Targeted review</h2>
          <p class="small dim">Where the real gains are after a mock — never re-take a whole mock to fix three topics.</p>
          <button class="primary" data-mode="wrong"${wrong ? '' : ' disabled'}>Wrong answers (${wrong})</button>
          <button class="primary" data-mode="leech"${leech ? '' : ' disabled'}>Leeches — missed 2+ times (${leech})</button>
        </div>
      </div>

      <div class="card">
        <h2>Section drills</h2>
        <div class="drills">${bySection}</div>
      </div>`;
  }

  function renderQuestion() {
    const q = run.qs[run.i];
    const ans = run.answers[run.i] || [];
    const multi = q.a.length > 1;
    const cs = q.cs ? window.BLUEPRINT.caseStudies.find(c => c.id === q.cs) : null;

    let timer = '';
    if (run.endsAt) {
      const left = Math.max(0, run.endsAt - Date.now());
      const m = Math.floor(left / 60000), s = Math.floor(left % 60000 / 1000);
      timer = `<span class="timer mono${left < 300000 ? ' warn' : ''}">${m}:${String(s).padStart(2, '0')}</span>`;
    }

    const answered = run.answers.filter(Boolean).length;

    return `
      <div class="card quiz-head">
        <div>
          <b>${esc(run.label)}</b>
          <span class="dim mono"> ${run.i + 1} / ${run.qs.length} · answered ${answered}</span>
        </div>
        <div class="quiz-head-right">${timer}<button id="q-abandon">End</button></div>
      </div>

      <div class="card question">
        <div class="q-meta">
          <a class="chip cov-partial" href="#blueprint" data-focus="${q.t}">§${q.t}</a>
          ${cs ? `<span class="chip cov-none">${esc(cs.name)}</span>` : ''}
          ${multi ? '<span class="chip cov-good">choose 2</span>' : ''}
        </div>
        <p class="q-text">${esc(q.q)}</p>
        <div class="opts">
          ${q.o.map((o, i) => `<button class="opt${ans.includes(i) ? ' on' : ''}" data-opt="${i}">
            <span class="opt-key">${String.fromCharCode(65 + i)}</span> ${esc(o)}</button>`).join('')}
        </div>
      </div>

      <div class="card quiz-nav">
        <button id="q-prev"${run.i === 0 ? ' disabled' : ''}>← Previous</button>
        <span class="dots">${run.qs.map((_, i) =>
          `<button class="qdot${i === run.i ? ' cur' : ''}${run.answers[i] ? ' done' : ''}" data-goto="${i}" title="${i + 1}"></button>`).join('')}</span>
        ${run.i === run.qs.length - 1
          ? '<button id="q-finish" class="primary">Finish &amp; score</button>'
          : `<span class="nav-right"><button id="q-next">Next →</button>${answered
              ? '<button id="q-finish" class="primary sm">Finish</button>' : ''}</span>`}
      </div>`;
  }

  function renderResults() {
    const score = grade();
    const pct = Math.round(score / run.qs.length * 100);
    const gate = pct >= 75;

    // Per-section breakdown tells you what to drill next.
    const bySec = {};
    run.qs.forEach((q, i) => {
      const s = sectionOf(q);
      bySec[s] = bySec[s] || { n: 0, ok: 0 };
      bySec[s].n++;
      if (isCorrect(q, run.answers[i])) bySec[s].ok++;
    });

    const rows = window.BLUEPRINT.sections.filter(s => bySec[s.id]).map(s => {
      const b = bySec[s.id], p = Math.round(b.ok / b.n * 100);
      return `<tr><td class="mono sec-id">§${s.id}</td><td data-label="Section">${esc(s.title)}</td>
        <td class="mono" data-label="Score">${b.ok}/${b.n}</td>
        <td class="bar-cell" data-label="Percent"><div class="bar"><i style="width:${p}%" class="${p < 75 ? 'lo' : ''}"></i></div><span class="mono dim">${p}%</span></td></tr>`;
    }).join('');

    const wrong = run.qs.map((q, i) => ({ q, ans: run.answers[i] }))
      .filter(x => !isCorrect(x.q, x.ans));

    return `
      <div class="card kpi">
        <div class="kpi-num ${gate ? 'ok' : 'warn'}">${pct}<span class="unit">%</span></div>
        <div class="kpi-label">${score} of ${run.qs.length} correct</div>
        <div class="small dim">${gate ? 'Above the 75% go/no-go gate.' : 'Below the 75% gate — drill the weak sections before re-testing.'}</div>
        ${run.mode === 'full' ? `<div class="row" style="justify-content:center;margin-top:12px">
          <button id="q-log" class="primary">Log this to the dashboard</button></div>` : ''}
      </div>

      ${rows ? `<div class="card"><h2>By section</h2><table class="tbl stack">
        <thead><tr><th></th><th>Section</th><th>Score</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div>` : ''}

      <div class="card">
        <h2>Review — ${wrong.length} missed</h2>
        <p class="small dim">Read only these. Re-reading questions you got right is the least efficient thing you can do with study time.</p>
        ${wrong.length ? wrong.map(x => reviewCard(x.q, x.ans)).join('') : '<p class="dim">Nothing missed.</p>'}
      </div>

      <div class="card">
        <h2>Everything, for reference</h2>
        <details><summary class="dim small">Show all ${run.qs.length} with explanations</summary>
          ${run.qs.map((q, i) => reviewCard(q, run.answers[i])).join('')}
        </details>
      </div>

      <div class="row"><button id="q-again" class="primary">Back to mock tests</button></div>`;
  }

  function reviewCard(q, ans) {
    ans = ans || [];
    return `<div class="review">
      <div class="q-meta">
        <a class="chip cov-partial" href="#blueprint" data-focus="${q.t}">§${q.t}</a>
        ${isCorrect(q, ans) ? '<span class="chip cov-good">correct</span>' : '<span class="chip cov-none">missed</span>'}
      </div>
      <p class="q-text">${esc(q.q)}</p>
      <ul class="review-opts">
        ${q.o.map((o, i) => {
          const right = q.a.includes(i), chose = ans.includes(i);
          const cls = right ? 'right' : chose ? 'wrongpick' : '';
          const mark = right ? '✓' : chose ? '✗' : '';
          return `<li class="${cls}"><span class="opt-key">${String.fromCharCode(65 + i)}</span> ${esc(o)} <b>${mark}</b></li>`;
        }).join('')}
      </ul>
      <p class="note">${esc(q.why)}</p>
    </div>`;
  }

  window.Quiz = { start, current, abandon, select, grade, renderMenu, renderQuestion, renderResults, isCorrect };
})();
