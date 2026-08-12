(function () {
  const BP = window.BLUEPRINT, PLAN = window.PLAN;
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const PREP = {
    foundational: { label: 'foundational', cls: 'cov-good' },
    partial:      { label: 'partial',      cls: 'cov-partial' },
    gap:          { label: 'GAP',          cls: 'cov-none' }
  };

  const allTopics = () => BP.sections.flatMap(s => s.topics.map(t => ({ ...t, section: s })));
  const topicById = id => allTopics().find(t => t.id === id);

  // Date helpers — parse as local noon so timezone never shifts the day.
  const day = s => new Date(s + 'T12:00:00');
  const today = () => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; };
  const daysBetween = (a, b) => Math.round((b - a) / 86400000);
  const fmt = s => day(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  function currentWeek() {
    const t = today();
    for (const w of PLAN.weeks) if (t >= day(w.from) && t <= day(w.to)) return w;
    return t < day(PLAN.weeks[0].from) ? null : 'past';
  }

  const lastMock = () => Store.state.mocks[Store.state.mocks.length - 1] || null;
  const mockPct = m => Math.round(m.score / m.total * 100);

  // Open tasks in the current week, in plan order.
  function openTasks() {
    const cw = currentWeek();
    if (!cw || cw === 'past') return [];
    return cw.tasks
      .map((task, i) => ({ task, key: `w${cw.n}:${i}`, week: cw }))
      .filter(x => !Store.task(x.key));
  }

  // Sections ranked by exam weight not yet earned — where the next point actually is.
  const byUnearned = () => BP.sections
    .map(s => ({ s, unearned: s.weight * (1 - Store.sectionCompletion(s)) }))
    .sort((a, b) => b.unearned - a.unearned);

  function slippedTasks() {
    const t = today();
    let slip = 0;
    PLAN.weeks.forEach(w => {
      if (t > day(w.to)) {
        const c = Store.weekCompletion(w);
        slip += c.total - c.done;
      }
    });
    return slip;
  }

  /* ---------------- Today ---------------- */

  function viewToday() {
    const examDate = Store.state.examDate;
    const left = daysBetween(today(), day(examDate));
    const cw = currentWeek();
    const last = lastMock();
    const pct = last ? mockPct(last) : null;
    const due = Store.dueCards(window.FLASHCARDS).length;
    const leech = Store.leeches().length;
    const coverage = Store.readiness();

    const shortlist = openTasks().slice(0, 3);
    const worst = byUnearned()[0];
    const prio = allTopics().filter(t => t.prep === 'gap' && t.priority && Store.topicCompletion(t.id) < 1);

    // One recommended drill: clear the leech list first, otherwise hit the weakest section.
    const drill = leech >= 5
      ? { mode: 'leech', label: `Retake ${leech} leeches — questions you have missed twice or more` }
      : { mode: 'section', section: worst.s.id, label: `Drill §${worst.s.id} ${worst.s.title} — ${worst.unearned.toFixed(1)} points still on the table` };

    return `
      <div class="grid-3">
        <div class="card kpi">
          <div class="kpi-num ${left < 14 ? 'warn' : ''}">${left}</div>
          <div class="kpi-label">days to exam</div>
          <div class="dim small">${day(examDate).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}</div>
        </div>
        <div class="card kpi">
          <div class="kpi-num ${pct === null ? 'dim' : pct >= 75 ? 'ok' : 'warn'}">${pct === null ? '—' : pct}${pct === null ? '' : '<span class="unit">%</span>'}</div>
          <div class="kpi-label">last mock score</div>
          <div class="dim small">${last
            ? `${last.score}/${last.total} on ${last.date}${last.label ? ' · ' + esc(last.label) : ''} · gate is 75%`
            : 'No mock yet — this is the only number that predicts the result.'}</div>
        </div>
        <div class="card kpi">
          <div class="kpi-num">${cw && cw !== 'past' ? cw.n : (cw === 'past' ? '—' : '0')}<span class="unit">/9</span></div>
          <div class="kpi-label">study week</div>
          <div class="dim small">${cw && cw !== 'past' ? esc(cw.theme) : (cw === 'past' ? 'past the plan — mock mode' : 'starts ' + fmt(PLAN.weeks[0].from))}</div>
        </div>
      </div>

      ${prio.length ? `<div class="alert">
        <b>Highest-risk topic still open:</b>
        ${prio.map(t => `<a href="#study/topics" data-focus="${t.id}">§${t.id} ${esc(t.title)}</a>`).join(' · ')}
        <div class="small">New in the Oct 2025 rewrite, and most third-party prep material has not caught up. Week 6 exists for this.</div>
      </div>` : ''}

      <div class="card do-now">
        <h2>Do this now</h2>

        ${shortlist.length ? `<ul class="tasks do-tasks">
          ${shortlist.map(x => `<li><label><input type="checkbox" data-task="${x.key}"> ${esc(x.task)}</label></li>`).join('')}
        </ul>` : `<p class="dim do-empty">${cw === 'past'
          ? 'Plan complete — you are in mock-and-review mode.'
          : cw ? `Week ${cw.n} is fully ticked. Take the recommended drill below.`
               : `Plan starts ${fmt(PLAN.weeks[0].from)}.`}</p>`}

        <div class="do-actions">
          <button class="primary" data-go-cards${due ? '' : ' disabled'}>${due ? `Review ${due} due card${due > 1 ? 's' : ''}` : 'No cards due'}</button>
          <button class="primary" data-drill="${drill.mode}"${drill.section ? ` data-section="${drill.section}"` : ''}>${esc(drill.label)}</button>
        </div>

        <p class="small dim do-foot">Three things, in this order. Everything else is on the other tabs and can wait.</p>
      </div>

      <div class="card cover">
        <div class="cover-row">
          <span class="cover-label">Exam surface ticked off</span>
          <div class="bar"><i style="width:${coverage.toFixed(0)}%"></i></div>
          <span class="mono dim">${coverage.toFixed(0)}%</span>
        </div>
        <p class="small dim">Self-ticked, weighted by section. A progress meter, not a readiness score — the mock number above is the one to trust.</p>
      </div>
    `;
  }

  function bindToday() {
    bindTasks();

    const cards = $('[data-go-cards]');
    if (cards) cards.onclick = () => {
      startCardQueue('due');
      location.hash = 'drill/cards';
    };

    const d = $('[data-drill]');
    if (d) d.onclick = () => {
      if (!Quiz.start(d.dataset.drill, { section: d.dataset.section })) return;
      quizStage = 'run';
      location.hash = 'drill/mock';
    };
  }

  /* ---------------- Plan ---------------- */

  function viewPlan() {
    const cw = currentWeek();
    const t = today();
    const slip = slippedTasks();
    const mocks = Store.state.mocks;

    const weeks = PLAN.weeks.map(w => {
      const c = Store.weekCompletion(w);
      const pct = c.total ? (c.done / c.total * 100) : 0;
      const isNow = cw !== 'past' && cw && cw.n === w.n;
      const past = t > day(w.to);
      const state = isNow ? 'now' : past ? (c.done === c.total ? 'done' : 'behind') : 'ahead';

      return `<details class="card week ${state}"${isNow ? ' open' : ''}>
        <summary>
          <span class="wk mono">W${w.n}</span>
          <span class="wk-dates mono dim">${fmt(w.from)} – ${fmt(w.to)}</span>
          <span class="wk-theme">${esc(w.theme)}${w.priority ? ' <span class="chip cov-none">high risk</span>' : ''}</span>
          <span class="bar sm"><i style="width:${pct}%"></i></span>
          <span class="mono dim">${c.done}/${c.total}</span>
        </summary>
        <p class="note">${esc(w.why)}</p>
        <div class="chips">
          ${w.topics.map(id => {
            const tp = topicById(id);
            return tp ? `<a class="chip ${PREP[tp.prep].cls}" href="#study/topics" data-focus="${id}">§${id}</a>` : '';
          }).join('')}
        </div>
        <ul class="tasks">
          ${w.tasks.map((task, i) => {
            const key = `w${w.n}:${i}`, on = Store.task(key);
            return `<li class="${on ? 'on' : ''}"><label><input type="checkbox" data-task="${key}"${on ? ' checked' : ''}> ${esc(task)}</label></li>`;
          }).join('')}
        </ul>
      </details>`;
    }).join('');

    const sectionRows = BP.sections.map(s => {
      const pct = Store.sectionCompletion(s) * 100;
      const gap = (s.weight * (1 - pct / 100)).toFixed(1);
      return `<tr>
        <td class="mono sec-id">§${s.id}</td>
        <td data-label="Section"><a href="#study/topics" data-focus="${s.topics[0].id}">${esc(s.title)}</a></td>
        <td class="mono" data-label="Weight">${s.weight}%</td>
        <td class="bar-cell" data-label="Ticked"><div class="bar"><i style="width:${pct.toFixed(0)}%"></i></div><span class="mono dim">${pct.toFixed(0)}%</span></td>
        <td class="mono ${gap > 8 ? 'warn' : ''}" data-label="Points left">${gap}</td>
      </tr>`;
    }).join('');

    const trend = mocks.length
      ? mocks.map(m => `<li><span class="mono">${m.date}</span> <b class="${mockPct(m) >= 75 ? 'ok' : 'warn'}">${mockPct(m)}%</b> <span class="dim">${m.score}/${m.total} ${esc(m.label)}</span></li>`).join('')
      : '<li class="dim">No mocks logged yet. Week 1 baseline first.</li>';

    return `
      <div class="card meta">
        <div>
          <b>9 weeks · ~${PLAN.hoursPerWeek} h/week</b> — ${fmt(PLAN.start)} to ${fmt(PLAN.weeks[8].to)}, then final review ${fmt(PLAN.finalReview.from)}–${fmt(PLAN.finalReview.to)}, exam ${fmt(PLAN.examDate)}.
          <div class="small dim">A fail carries a 14-day wait, so an Oct 9 attempt still leaves ${fmt(PLAN.retakeWindow)} for a retake — inside the Oct 2026 goal.</div>
        </div>
        <div class="links"><label class="date-set">Exam date <input type="date" id="exam-date" value="${Store.state.examDate}"></label></div>
      </div>

      ${slip > 0 ? `<div class="alert warn-alert">
        <b>${slip} task${slip > 1 ? 's' : ''} left behind in weeks that have already ended.</b>
        <div class="small">Do not try to catch up on everything. Carry forward only what feeds a section with points still on the table — see the table below — and abandon the rest.</div>
      </div>` : ''}

      ${weeks}

      <div class="card">
        <h2>Final review · ${fmt(PLAN.finalReview.from)}–${fmt(PLAN.finalReview.to)}</h2>
        <ul class="tasks">
          ${PLAN.finalReviewTasks.map((task, i) => {
            const key = `fr:${i}`, on = Store.task(key);
            return `<li class="${on ? 'on' : ''}"><label><input type="checkbox" data-task="${key}"${on ? ' checked' : ''}> ${esc(task)}</label></li>`;
          }).join('')}
        </ul>
      </div>

      <div class="grid-2">
        <div class="card">
          <h2>Where the next point is</h2>
          <table class="tbl stack">
            <thead><tr><th></th><th>Section</th><th>Weight</th><th>Ticked</th><th title="Exam weight you have not yet earned">Points left</th></tr></thead>
            <tbody>${sectionRows}</tbody>
          </table>
          <p class="small dim">Points left = section weight × (1 − ticked). Attack the biggest number, not the lowest percentage.</p>
        </div>

        <div class="card">
          <h2>Mock scores</h2>
          <ul class="mocks">${trend}</ul>
          <div class="row">
            <input type="number" id="mock-score" placeholder="score" min="0">
            <input type="number" id="mock-total" placeholder="of" value="60" min="1">
            <input type="text" id="mock-label" placeholder="label (optional)">
            <button id="mock-add">Log</button>
          </div>
          <p class="small dim">Go/no-go gate: ≥75% on section drills before you sit it.</p>
        </div>
      </div>
    `;
  }

  function bindPlan() {
    bindTasks();

    const d = $('#exam-date');
    if (d) d.onchange = () => { Store.setExamDate(d.value); render(); };

    const add = $('#mock-add');
    if (add) add.onclick = () => {
      const s = $('#mock-score').value, t = $('#mock-total').value;
      if (s === '' || t === '' || +t <= 0) return;
      Store.addMock(s, t, $('#mock-label').value.trim());
      render();
    };
  }

  // Task checkboxes appear on both Today and Plan.
  function bindTasks() {
    $$('input[data-task]').forEach(cb => {
      cb.onchange = () => {
        Store.setTask(cb.dataset.task, cb.checked);
        const li = cb.closest('li');
        if (li) li.classList.toggle('on', cb.checked);
        // Keep the week header counters live without collapsing the open week.
        const d = cb.closest('details');
        if (d) {
          const w = PLAN.weeks.find(w => cb.dataset.task.startsWith(`w${w.n}:`));
          if (w) {
            const c = Store.weekCompletion(w);
            d.querySelector('.bar.sm i').style.width = (c.done / c.total * 100) + '%';
            d.querySelector('summary .mono.dim:last-child').textContent = `${c.done}/${c.total}`;
          }
        }
        updateBadges();
      };
    });
  }

  /* ---------------- Study · topics ---------------- */

  let bpFilter = 'all';

  function viewTopics() {
    const sections = BP.sections.map(s => {
      const topics = s.topics.filter(t => {
        if (bpFilter === 'gaps') return t.prep === 'gap';
        if (bpFilter === 'lowconf') return (Store.topic(t.id).conf || 0) <= 2;
        if (bpFilter === 'open') return Store.topicCompletion(t.id) < 1;
        if (bpFilter === 'noted') return !!Store.note(t.id);
        return true;
      });
      if (!topics.length) return '';

      return `<section class="card sec">
        <header class="sec-head">
          <h2><span class="mono dim">§${s.id}</span> ${esc(s.title)}</h2>
          <span class="weight">${s.weight}% of exam</span>
        </header>
        ${topics.map(t => topicCard(t)).join('')}
      </section>`;
    }).join('');

    const noted = allTopics().filter(t => Store.note(t.id)).length;

    return `
      <div class="card meta">
        <div>
          <b>Exam guide revision ${BP.guideRevision}</b> — ${BP.exam.questions} questions · ${BP.exam.minutes} min · ${BP.exam.price} · valid ${BP.exam.validityYears} years · case studies ${BP.exam.caseStudyShare} of questions
          <div class="small dim">Every sub-section is one row: open it for the official bullets, the docs, your notes and the tracking. ${noted} of ${allTopics().length} have notes. Retired case studies: ${BP.retiredCaseStudies.join(', ')} — any prep source still using these predates the current exam.</div>
        </div>
        <div class="links">
          <a href="${BP.guideUrl}" target="_blank" rel="noopener">Official guide PDF</a>
          <button id="notes-md">Export notes</button>
        </div>
      </div>

      <div class="filters">
        ${[['all', 'All 22'], ['open', 'Not finished'], ['gaps', 'Book gaps'], ['lowconf', 'Low confidence'], ['noted', 'Has notes']]
          .map(([k, l]) => `<button class="f${bpFilter === k ? ' on' : ''}" data-filter="${k}">${l}</button>`).join('')}
      </div>
      ${sections || '<div class="card dim">Nothing matches this filter.</div>'}
    `;
  }

  // Collapsed by default: one row per sub-section, everything about it inside.
  function topicCard(t) {
    const st = Store.topic(t.id);
    const cov = PREP[t.prep] || PREP.partial;
    const done = Number(st.read) + Number(st.hands) + Number(st.drilled);
    const tables = window.DECISIONS.filter(d => d.topic === t.id);
    const qn = window.QUESTIONS.filter(q => q.t === t.id).length;
    const hasNote = !!Store.note(t.id);

    return `<details class="topic${t.priority ? ' prio' : ''}" id="t-${t.id}">
      <summary>
        <span class="mono t-id">${t.id}</span>
        <span class="t-title">${esc(t.title)}</span>
        <span class="t-status">
          <span class="chip ${cov.cls}">${cov.label}</span>
          <span class="mono dim" title="study actions done">${done}/3</span>
          <span class="mono ${st.conf ? 'conf-on' : 'dim'}" title="confidence">${st.conf ? st.conf + '/5' : '–/5'}</span>
          <span class="dot-has${hasNote ? '' : ' off'}" title="${hasNote ? 'you have notes' : 'no notes yet'}"></span>
        </span>
      </summary>

      <div class="topic-body">
        ${t.bullets.length ? `<ul class="bullets">${t.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        ${t.note ? `<p class="note">${esc(t.note)}</p>` : ''}

        <div class="refs">
          ${(t.docs || []).map(d => `<a class="ref doc" href="${d.url}" target="_blank" rel="noopener">${esc(d.label)}</a>`).join('')}
          ${tables.map(d => `<a class="ref doc" href="#study/decisions">▤ ${esc(d.title)}</a>`).join('')}
          ${qn ? `<button class="ref doc" data-tdrill="${t.id}">▶ Drill ${qn} question${qn > 1 ? 's' : ''}</button>` : ''}
        </div>

        <div class="track">
          ${[['read', 'Read'], ['hands', 'Hands-on'], ['drilled', 'Drilled']].map(([k, l]) =>
            `<label class="cb${st[k] ? ' on' : ''}"><input type="checkbox" data-topic="${t.id}" data-flag="${k}"${st[k] ? ' checked' : ''}> ${l}</label>`).join('')}
          <span class="conf">Confidence
            ${[1, 2, 3, 4, 5].map(n => `<button class="dot${st.conf >= n ? ' on' : ''}" data-conf="${t.id}" data-n="${n}" title="${n}/5">${n}</button>`).join('')}
          </span>
        </div>

        <label class="note-label" for="n-${t.id}">Your notes — what you will actually recall under pressure</label>
        <textarea id="n-${t.id}" class="notes-area sm" rows="5" data-note="${t.id}"
          placeholder="Decision rules, service comparisons, things you got wrong in a mock.">${esc(Store.note(t.id))}</textarea>
      </div>
    </details>`;
  }

  function bindTopics() {
    $$('[data-filter]').forEach(b => {
      b.onclick = () => { bpFilter = b.dataset.filter; render(); };
    });

    $$('input[data-topic]').forEach(cb => {
      cb.onchange = () => {
        Store.setTopicFlag(cb.dataset.topic, cb.dataset.flag, cb.checked);
        cb.closest('.cb').classList.toggle('on', cb.checked);
        refreshTopicStatus(cb.dataset.topic);
      };
    });

    // Toggle in place — a full re-render would scroll the card out from under the cursor.
    $$('[data-conf]').forEach(b => {
      b.onclick = () => {
        const id = b.dataset.conf, n = +b.dataset.n;
        const next = Store.topic(id).conf === n ? 0 : n;
        Store.setConfidence(id, next);
        if (bpFilter === 'lowconf') { render(); return; }   // the card may no longer belong in this filter
        const row = b.closest('.conf');
        row.querySelectorAll('.dot').forEach(d => d.classList.toggle('on', +d.dataset.n <= next));
        refreshTopicStatus(id);
      };
    });

    $$('textarea[data-note]').forEach(ta => {
      const id = ta.dataset.note;   // captured now, not read when the timer fires
      let t;
      ta.oninput = () => {
        clearTimeout(t);
        t = setTimeout(() => { Store.setNote(id, ta.value); refreshTopicStatus(id); }, 400);
      };
    });

    $$('[data-tdrill]').forEach(b => {
      b.onclick = () => {
        if (!Quiz.start('topic', { topic: b.dataset.tdrill })) return;
        quizStage = 'run';
        location.hash = 'drill/mock';
      };
    });

    const md = $('#notes-md');
    if (md) md.onclick = exportNotesMarkdown;
  }

  // Keep a collapsed row's summary honest without re-rendering the page.
  function refreshTopicStatus(id) {
    const el = document.getElementById('t-' + id);
    if (!el) return;
    const st = Store.topic(id);
    const done = Number(st.read) + Number(st.hands) + Number(st.drilled);
    const spans = el.querySelectorAll('.t-status .mono');
    if (spans[0]) spans[0].textContent = `${done}/3`;
    if (spans[1]) {
      spans[1].textContent = st.conf ? st.conf + '/5' : '–/5';
      spans[1].className = 'mono ' + (st.conf ? 'conf-on' : 'dim');
    }
    const dot = el.querySelector('.dot-has');
    if (dot) dot.classList.toggle('off', !Store.note(id));
    updateBadges();
  }

  function exportNotesMarkdown() {
    let out = `# PCA notes\n\nExam ${Store.state.examDate} · guide revision ${BP.guideRevision}\n`;
    BP.sections.forEach(s => {
      const written = s.topics.filter(t => Store.note(t.id));
      if (!written.length) return;
      out += `\n## §${s.id} ${s.title} (${s.weight}%)\n`;
      written.forEach(t => { out += `\n### ${t.id} ${t.title}\n\n${Store.note(t.id)}\n`; });
    });
    const cases = window.CASES.filter(c => Store.note('case:' + c.id));
    if (cases.length) {
      out += `\n## Case study architectures\n`;
      cases.forEach(c => { out += `\n### ${c.name}\n\n${Store.note('case:' + c.id)}\n`; });
    }
    const blob = new Blob([out], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pca-notes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ---------------- Study · decision tables ---------------- */

  function viewTables() {
    return `
      <div class="card meta"><div>
        <b>Nine decision tables</b> — service selection is where this exam is won and lost.
        The third column is the phrase in a question stem that points at that row; that is what you drill.
        <div class="small dim">Run these from memory on paper during final review.</div>
      </div></div>
      ${window.DECISIONS.map(d => `<div class="card">
        <div class="topic-head">
          <h3>${esc(d.title)}</h3>
          <a class="chip cov-partial" href="#study/topics" data-focus="${d.topic}">§${d.topic}</a>
        </div>
        <p class="note">${esc(d.intro)}</p>
        <div class="tbl-scroll">
          <table class="tbl dec stack">
            <thead><tr>${d.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
            <tbody>${d.rows.map(r => `<tr>${r.map((cell, i) =>
              `<td class="${i === 0 ? 'dec-opt' : i === 2 ? 'dec-tell' : ''}" data-label="${esc(d.cols[i] || '')}">${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`).join('')}`;
  }

  /* ---------------- Study · case studies ---------------- */

  const KIND = {
    business:     { label: 'business',      cls: 'k-biz' },
    technical:    { label: 'technical',     cls: 'k-tech' },
    nonfunctional:{ label: 'non-functional',cls: 'k-nf' },
    compliance:   { label: 'compliance',    cls: 'k-comp' }
  };

  let openCase = null, caseFilter = 'all', showRef = {};

  function viewCases() {
    if (openCase) return caseDetail(window.CASES.find(c => c.id === openCase));

    return `
      <div class="card meta"><div>
        <b>Four case studies, two appear on your exam</b> — ${BP.exam.caseStudyShare} of questions,
        shown on a split screen during the exam.
        <div class="small dim">Read the official PDFs (linked per case) — that is the source text. What is
        here is the working layer: requirement tagging, the decision each requirement forces, a reference
        architecture, and the traps set per case. Retired and disqualifying if a prep source uses them:
        ${BP.retiredCaseStudies.join(', ')}.</div>
      </div></div>

      ${window.CASES.map(c => {
        const answered = Store.note('case:' + c.id).length > 0;
        const counts = { business: 0, technical: 0, nonfunctional: 0, compliance: 0 };
        c.reqs.forEach(r => counts[r.kind]++);
        return `<div class="card case-card">
          <div class="topic-head">
            <h3>${esc(c.name)}</h3>
            <span class="chip ${c.status.startsWith('new') ? 'cov-none' : 'cov-partial'}">${esc(c.status)}</span>
          </div>
          <p class="case-one">${esc(c.oneLine)}</p>
          <p class="note">${esc(c.tension)}</p>
          <div class="chips">
            ${Object.entries(counts).map(([k, n]) => `<span class="chip ${KIND[k].cls}">${n} ${KIND[k].label}</span>`).join('')}
            <span class="chip cov-none">${c.traps.length} traps</span>
            ${answered ? '<span class="chip cov-good">your answer saved</span>' : ''}
          </div>
          <div class="refs" style="margin-top:12px">
            <button class="primary" data-case="${c.id}">Work this case →</button>
            <a class="ref doc" href="${c.url}" target="_blank" rel="noopener">Official PDF (v6.1)</a>
          </div>
        </div>`;
      }).join('')}`;
  }

  function caseDetail(c) {
    const reqs = c.reqs.filter(r => caseFilter === 'all' || r.kind === caseFilter);
    const revealed = !!showRef[c.id];
    const mine = Store.note('case:' + c.id);

    return `
      <div class="card quiz-head">
        <div><b>${esc(c.name)}</b> <span class="dim mono"> ${c.reqs.length} requirements · ${c.traps.length} traps</span></div>
        <div class="quiz-head-right">
          <a class="ref doc" href="${c.url}" target="_blank" rel="noopener">Official PDF</a>
          <button id="case-back">← All cases</button>
        </div>
      </div>

      <div class="card">
        <h2>The tension</h2>
        <p class="case-one">${esc(c.oneLine)}</p>
        <p class="note">${esc(c.tension)}</p>
      </div>

      <div class="card">
        <h2>Existing environment → what it implies</h2>
        <div class="tbl-scroll"><table class="tbl dec stack">
          <thead><tr><th>What they have</th><th>So what</th></tr></thead>
          <tbody>${c.env.map(([a, b]) =>
            `<tr><td class="dec-opt" style="white-space:normal" data-label="What they have">${esc(a)}</td><td data-label="So what">${esc(b)}</td></tr>`).join('')}</tbody>
        </table></div>
      </div>

      <div class="card">
        <h2>Your architecture — write it before revealing the reference</h2>
        <p class="small dim">Committing an answer first is what makes the comparison teach you anything. Saved locally as you type.</p>
        <textarea id="case-answer" class="notes-area" rows="10" data-case-note="${c.id}"
          placeholder="Compute · data · networking · security · AI · ops. Name services and say why each requirement drove it.">${esc(mine)}</textarea>
        <div class="row" style="margin-top:10px">
          <button class="primary" id="case-reveal">${revealed ? 'Hide reference architecture' : 'Reveal reference architecture'}</button>
        </div>
      </div>

      ${revealed ? `<div class="card">
        <h2>Reference architecture</h2>
        <div class="tbl-scroll"><table class="tbl dec stack">
          <thead><tr><th>Layer</th><th>Choice</th><th>Why</th></tr></thead>
          <tbody>${c.arch.map(([l, ch, why]) =>
            `<tr><td class="dec-opt" data-label="Layer">${esc(l)}</td><td data-label="Choice">${esc(ch)}</td><td class="dim" data-label="Why">${esc(why)}</td></tr>`).join('')}</tbody>
        </table></div>
        <p class="small dim">One defensible answer, not the only one. On the exam you pick from options — what matters is that your reasoning names the same constraints.</p>
      </div>` : ''}

      <div class="card">
        <h2>Requirements → decisions</h2>
        <div class="filters">
          ${[['all', 'All ' + c.reqs.length]].concat(Object.keys(KIND).map(k =>
            [k, KIND[k].label + ' ' + c.reqs.filter(r => r.kind === k).length]))
            .map(([k, l]) => `<button class="f${caseFilter === k ? ' on' : ''}" data-cfilter="${k}">${esc(l)}</button>`).join('')}
        </div>
        ${reqs.map(r => `<div class="req">
          <div class="q-meta">
            <span class="chip ${KIND[r.kind].cls}">${KIND[r.kind].label}</span>
          </div>
          <p class="req-text">${esc(r.text)}</p>
          <p class="req-drives"><b>Drives:</b> ${esc(r.drives)}</p>
          <p class="note">${esc(r.answer)}</p>
        </div>`).join('') || '<p class="dim">Nothing in this category.</p>'}
      </div>

      <div class="card">
        <h2>Traps this case sets</h2>
        <ul class="traps">${c.traps.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>`;
  }

  function bindCases() {
    $$('[data-case]').forEach(b => {
      b.onclick = () => { openCase = b.dataset.case; caseFilter = 'all'; render(); window.scrollTo(0, 0); };
    });
    const back = $('#case-back');
    if (back) back.onclick = () => { openCase = null; render(); window.scrollTo(0, 0); };
    $$('[data-cfilter]').forEach(b => {
      b.onclick = () => { caseFilter = b.dataset.cfilter; render(); };
    });
    const rev = $('#case-reveal');
    if (rev) rev.onclick = () => { showRef[openCase] = !showRef[openCase]; render(); };

    const ta = $('[data-case-note]');
    if (ta) {
      const key = 'case:' + ta.dataset.caseNote;   // captured now — "← All cases" clears openCase
      let t;
      ta.oninput = () => {
        clearTimeout(t);
        t = setTimeout(() => Store.setNote(key, ta.value), 400);
      };
    }
  }

  /* ---------------- Drill · mock tests ---------------- */

  let quizStage = 'menu';   // menu | run | results
  let tick = null;

  function viewQuiz() {
    if (quizStage === 'run') return Quiz.renderQuestion();
    if (quizStage === 'results') return Quiz.renderResults();
    return Quiz.renderMenu();
  }

  function bindQuiz() {
    if (tick) { clearInterval(tick); tick = null; }

    if (quizStage === 'menu') {
      $$('[data-mode]').forEach(b => {
        b.onclick = () => {
          if (!Quiz.start(b.dataset.mode, { section: b.dataset.section })) return;
          quizStage = 'run';
          render();
        };
      });
      return;
    }

    if (quizStage === 'run') {
      const r = Quiz.current();

      $$('[data-opt]').forEach(b => {
        b.onclick = () => { Quiz.select(+b.dataset.opt); render(); };
      });
      const prev = $('#q-prev'), next = $('#q-next'), fin = $('#q-finish'), ab = $('#q-abandon');
      if (prev) prev.onclick = () => { r.i--; render(); };
      if (next) next.onclick = () => { r.i++; render(); };
      if (fin) fin.onclick = () => { quizStage = 'results'; render(); };
      if (ab) ab.onclick = () => { quizStage = 'results'; render(); };
      $$('[data-goto]').forEach(b => {
        b.onclick = () => { r.i = +b.dataset.goto; render(); };
      });

      // Auto-submit when the clock runs out, like the real thing.
      if (r.endsAt) {
        tick = setInterval(() => {
          if (Date.now() >= r.endsAt) { quizStage = 'results'; render(); }
          else if (quizStage === 'run') {
            const t = $('.timer');
            if (t) {
              const left = Math.max(0, r.endsAt - Date.now());
              const m = Math.floor(left / 60000), sec = Math.floor(left % 60000 / 1000);
              t.textContent = `${m}:${String(sec).padStart(2, '0')}`;
              t.classList.toggle('warn', left < 300000);
            }
          }
        }, 1000);
      }
      return;
    }

    // results
    const again = $('#q-again'), log = $('#q-log');
    if (again) again.onclick = () => { Quiz.abandon(); quizStage = 'menu'; render(); };
    if (log) log.onclick = () => {
      const r = Quiz.current();
      Store.addMock(Quiz.grade(), r.qs.length, r.label);
      log.textContent = 'Logged ✓';
      log.disabled = true;
      updateBadges();
    };
  }

  /* ---------------- Drill · flashcards ---------------- */

  let cardQueue = null, cardShown = false;

  const shuffled = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(p => p[1]);

  function startCardQueue(mode, topic) {
    const all = window.FLASHCARDS;
    const q = mode === 'due' ? Store.dueCards(all)
            : mode === 'topic' ? all.filter(c => c.topic === topic)
            : all.slice();
    cardQueue = shuffled(q);
    cardShown = false;
  }

  function viewCards() {
    const all = window.FLASHCARDS;
    const due = Store.dueCards(all);

    if (!cardQueue) {
      const byTopic = {};
      all.forEach(c => { byTopic[c.topic] = (byTopic[c.topic] || 0) + 1; });

      return `
        <div class="card meta"><div>
          <b>${all.length} cards</b> — the decision tables plus the high-confusion pairs the exam keeps
          returning to. Spaced repetition: cards you find hard come back sooner.
          <div class="small dim">${due.length} due now.</div>
        </div></div>
        <div class="grid-2">
          <div class="card">
            <h2>Drill</h2>
            <button class="primary" data-cards="due"${due.length ? '' : ' disabled'}>Due now (${due.length})</button>
            <button class="primary" data-cards="all">All ${all.length} cards</button>
          </div>
          <div class="card">
            <h2>By topic</h2>
            <div class="chips">${Object.keys(byTopic).sort().map(t =>
              `<button class="chip cov-partial" data-cards="topic" data-topic="${t}">§${t} · ${byTopic[t]}</button>`).join('')}</div>
          </div>
        </div>`;
    }

    if (!cardQueue.length) {
      return `<div class="card kpi">
        <div class="kpi-num ok">✓</div>
        <div class="kpi-label">deck complete</div>
        <div class="row" style="justify-content:center;margin-top:12px"><button id="c-done" class="primary">Back</button></div>
      </div>`;
    }

    const c = cardQueue[0];
    const st = Store.card(c.id);
    return `
      <div class="card quiz-head">
        <div><b>Flashcards</b> <span class="dim mono">${cardQueue.length} left · §${c.topic} · streak ${st.streak}</span></div>
        <div class="quiz-head-right"><button id="c-done">End</button></div>
      </div>
      <div class="card flashcard">
        <p class="fc-q">${esc(c.q)}</p>
        ${cardShown
          ? `<p class="fc-a">${esc(c.a)}</p>
             <div class="fc-grades">
               <button data-grade="0" class="g0">Again</button>
               <button data-grade="1" class="g1">Hard</button>
               <button data-grade="2" class="g2">Good</button>
               <button data-grade="3" class="g3">Easy</button>
             </div>`
          : '<button id="c-show" class="primary">Show answer</button>'}
      </div>`;
  }

  function bindCards() {
    $$('[data-cards]').forEach(b => {
      b.onclick = () => { startCardQueue(b.dataset.cards, b.dataset.topic); render(); };
    });
    const show = $('#c-show');
    if (show) show.onclick = () => { cardShown = true; render(); };
    $$('[data-grade]').forEach(b => {
      b.onclick = () => {
        const g = +b.dataset.grade, c = cardQueue[0];
        Store.gradeCard(c.id, g);
        cardQueue.shift();
        if (g === 0) cardQueue.push(c);        // failed cards come back this session
        cardShown = false;
        render();
        updateBadges();
      };
    });
    const done = $('#c-done');
    if (done) done.onclick = () => { cardQueue = null; cardShown = false; render(); };
  }

  /* ---------------- Shell ---------------- */

  // Four modes. Anything with more than one job inside it gets sub-tabs, never a nav slot.
  const VIEWS = {
    today: { render: viewToday, bind: bindToday },
    plan:  { render: viewPlan,  bind: bindPlan },
    study: {
      def: 'topics',
      tabs: {
        topics:    { label: 'Topics',    render: viewTopics, bind: bindTopics },
        decisions: { label: 'Decisions', render: viewTables, bind: () => {} },
        cases:     { label: 'Cases',     render: viewCases,  bind: bindCases }
      }
    },
    drill: {
      def: 'mock',
      tabs: {
        mock:  { label: 'Mock exam',  render: viewQuiz,  bind: bindQuiz },
        cards: { label: 'Flashcards', render: viewCards, bind: bindCards }
      }
    }
  };

  // Old bookmarks and any stale deep link still land somewhere sensible.
  const LEGACY = {
    dashboard: 'today', blueprint: 'study/topics', notes: 'study/topics',
    tables: 'study/decisions', cases: 'study/cases', quiz: 'drill/mock', cards: 'drill/cards'
  };

  let pendingFocus = null, lastRoute = null;

  function render() {
    if (tick) { clearInterval(tick); tick = null; }

    const raw = location.hash.slice(1).split('?')[0].replace(/^\/+|\/+$/g, '');
    if (LEGACY[raw]) { location.replace('#' + LEGACY[raw]); return; }   // re-enters via hashchange

    const [reqName, reqTab] = raw.split('/');
    const name = VIEWS[reqName] ? reqName : 'today';
    const v = VIEWS[name];
    const tab = v.tabs ? (v.tabs[reqTab] ? reqTab : v.def) : null;
    const leaf = tab ? v.tabs[tab] : v;

    const routeChanged = (name + '/' + tab) !== lastRoute;
    lastRoute = name + '/' + tab;

    $('#view').innerHTML =
      (v.tabs ? subnav(name, v, tab) : '') + leaf.render();
    leaf.bind();

    $$('nav > a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + name));
    updateBadges();

    // Cross-view deep links: any data-focus lands on the matching Study topic.
    $$('[data-focus]').forEach(a => {
      a.addEventListener('click', () => { pendingFocus = a.dataset.focus; bpFilter = 'all'; });
    });

    if (pendingFocus && name === 'study' && tab === 'topics') {
      const el = document.getElementById('t-' + pendingFocus);
      pendingFocus = null;
      if (el) {
        el.open = true;
        el.scrollIntoView({ block: 'center' });
        el.classList.add('flash');
        return;
      }
    }

    // Only a real navigation resets scroll — in-view re-renders must stay put.
    if (routeChanged) window.scrollTo(0, 0);
  }

  function subnav(name, v, cur) {
    return `<div class="subnav">${Object.entries(v.tabs).map(([k, t]) => {
      const n = tabBadge(name, k);
      return `<a href="#${name}/${k}" class="${cur === k ? 'on' : ''}">${t.label}${n ? ` <b>${n}</b>` : ''}</a>`;
    }).join('')}</div>`;
  }

  function tabBadge(name, tab) {
    if (name === 'drill' && tab === 'cards') return Store.dueCards(window.FLASHCARDS).length;
    if (name === 'drill' && tab === 'mock') return Store.leeches().length;
    if (name === 'study' && tab === 'topics') return allTopics().filter(t => t.prep === 'gap' && Store.topicCompletion(t.id) < 1).length;
    return 0;
  }

  // Counts in the nav so nothing has to be hunted for.
  function updateBadges() {
    const counts = {
      today: openTasks().length,
      plan: slippedTasks(),
      study: tabBadge('study', 'topics'),
      drill: Store.dueCards(window.FLASHCARDS).length + Store.leeches().length
    };
    $$('nav > a').forEach(a => {
      const key = a.getAttribute('href').slice(1);
      const n = counts[key] || 0;
      let b = a.querySelector('b');
      if (!n) { if (b) b.remove(); return; }
      if (!b) { b = document.createElement('b'); a.appendChild(b); }
      b.textContent = n;
    });
  }

  window.addEventListener('hashchange', render);

  window.addEventListener('DOMContentLoaded', () => {
    $('#btn-export').onclick = () => Store.export();
    $('#btn-import').onclick = () => $('#file-import').click();
    $('#file-import').onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      Store.import(f, err => {
        if (err) alert('Could not read that file: ' + err.message);
        else render();
      });
      e.target.value = '';
    };
    render();
  });
})();
