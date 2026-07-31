(function () {
  const BP = window.BLUEPRINT, PLAN = window.PLAN;
  const $ = sel => document.querySelector(sel);
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

  /* ---------------- Dashboard ---------------- */

  function viewDashboard() {
    const examDate = Store.state.examDate;
    const left = daysBetween(today(), day(examDate));
    const readiness = Store.readiness();
    const cw = currentWeek();
    const mocks = Store.state.mocks;

    const sectionRows = BP.sections.map(s => {
      const pct = Store.sectionCompletion(s) * 100;
      // Unearned weight = where the next point actually is.
      const gap = (s.weight * (1 - pct / 100)).toFixed(1);
      return `<tr>
        <td class="mono sec-id">§${s.id}</td>
        <td data-label="Section">${esc(s.title)}</td>
        <td class="mono" data-label="Weight">${s.weight}%</td>
        <td class="bar-cell" data-label="Covered"><div class="bar"><i style="width:${pct.toFixed(0)}%"></i></div><span class="mono dim">${pct.toFixed(0)}%</span></td>
        <td class="mono ${gap > 8 ? 'warn' : ''}" data-label="Unearned">${gap}</td>
      </tr>`;
    }).join('');

    const gaps = allTopics().filter(t => t.prep === 'gap' && Store.topicCompletion(t.id) < 1);
    const priority = gaps.filter(t => t.priority);

    const next = (cw && cw !== 'past')
      ? cw.tasks.map((task, i) => ({ task, key: `w${cw.n}:${i}` })).filter(x => !Store.task(x.key)).slice(0, 3)
      : [];

    const trend = mocks.length
      ? mocks.map(m => `<li><span class="mono">${m.date}</span> <b>${Math.round(m.score / m.total * 100)}%</b> <span class="dim">${m.score}/${m.total} ${esc(m.label)}</span></li>`).join('')
      : '<li class="dim">No mocks logged yet. Week 1 baseline first.</li>';

    return `
      <div class="grid-3">
        <div class="card kpi">
          <div class="kpi-num ${left < 14 ? 'warn' : ''}">${left}</div>
          <div class="kpi-label">days to exam</div>
          <div class="dim small">${day(examDate).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}</div>
          <input type="date" id="exam-date" value="${examDate}">
        </div>
        <div class="card kpi">
          <div class="kpi-num">${readiness.toFixed(0)}<span class="unit">%</span></div>
          <div class="kpi-label">exam surface covered</div>
          <div class="dim small">weighted by section, not topic count</div>
        </div>
        <div class="card kpi">
          <div class="kpi-num">${cw && cw !== 'past' ? cw.n : (cw === 'past' ? '—' : '0')}<span class="unit">/9</span></div>
          <div class="kpi-label">current study week</div>
          <div class="dim small">${cw && cw !== 'past' ? esc(cw.theme) : (cw === 'past' ? 'past the plan — mock mode' : 'starts ' + fmt(PLAN.weeks[0].from))}</div>
        </div>
      </div>

      ${priority.length ? `<div class="alert">
        <b>Highest-risk topic still open:</b>
        ${priority.map(t => `<a href="#blueprint" data-focus="${t.id}">§${t.id} ${esc(t.title)}</a>`).join(' · ')}
        <div class="small">New in the Oct 2025 rewrite, and most third-party prep material has not caught up. Week 6 exists for this.</div>
      </div>` : ''}

      <div class="grid-2">
        <div class="card">
          <h2>Where the next point is</h2>
          <table class="tbl stack">
            <thead><tr><th></th><th>Section</th><th>Weight</th><th>Covered</th><th title="Exam weight you have not yet earned">Unearned</th></tr></thead>
            <tbody>${sectionRows}</tbody>
          </table>
          <p class="small dim">Unearned = section weight × (1 − covered). Attack the biggest number, not the lowest percentage.</p>
        </div>

        <div>
          <div class="card">
            <h2>Next 3 actions</h2>
            ${next.length
              ? `<ol class="next">${next.map(x => `<li>${esc(x.task)}</li>`).join('')}</ol>
                 <a class="btn-link" href="#plan">Open week ${cw.n} →</a>`
              : `<p class="dim">${cw === 'past' ? 'Plan complete — you are in mock-and-review mode.' : cw ? 'Week ' + cw.n + ' is fully ticked. Nice.' : 'Plan starts ' + fmt(PLAN.weeks[0].from) + '.'}</p>`}
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
      </div>

      <div class="card">
        <h2>Open gaps — commonly under-prepared topics</h2>
        ${gaps.length
          ? `<div class="chips">${gaps.map(t => `<a class="chip cov-none" href="#blueprint" data-focus="${t.id}">§${t.id} ${esc(t.title.slice(0, 52))}${t.title.length > 52 ? '…' : ''}</a>`).join('')}</div>`
          : '<p class="dim">No open gaps. Verify with mock scores, not self-assessment.</p>'}
      </div>
    `;
  }

  function bindDashboard() {
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

  /* ---------------- Blueprint ---------------- */

  let bpFilter = 'all';

  function viewBlueprint() {
    const sections = BP.sections.map(s => {
      const topics = s.topics.filter(t => {
        if (bpFilter === 'gaps') return t.prep === 'gap';
        if (bpFilter === 'lowconf') return (Store.topic(t.id).conf || 0) <= 2;
        if (bpFilter === 'open') return Store.topicCompletion(t.id) < 1;
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

    return `
      <div class="card meta">
        <div>
          <b>Exam guide revision ${BP.guideRevision}</b> — ${BP.exam.questions} questions · ${BP.exam.minutes} min · ${BP.exam.price} · valid ${BP.exam.validityYears} years · case studies ${BP.exam.caseStudyShare} of questions
          <div class="small dim">Retired case studies: ${BP.retiredCaseStudies.join(', ')}. Any prep source still using these predates the current exam — reject it.</div>
        </div>
        <div class="links">
          <a href="${BP.guideUrl}" target="_blank" rel="noopener">Official guide PDF</a>
          <a href="${BP.sampleQuestionsUrl}" target="_blank" rel="noopener">Sample questions</a>
        </div>
      </div>

      <div class="filters">
        ${[['all', 'All 22'], ['open', 'Not finished'], ['gaps', 'Book gaps'], ['lowconf', 'Low confidence']]
          .map(([k, l]) => `<button class="f${bpFilter === k ? ' on' : ''}" data-filter="${k}">${l}</button>`).join('')}
      </div>
      ${sections || '<div class="card dim">Nothing matches this filter.</div>'}
    `;
  }

  function topicCard(t) {
    const st = Store.topic(t.id);
    const cov = PREP[t.prep] || PREP.partial;
    return `<article class="topic${t.priority ? ' prio' : ''}" id="t-${t.id}">
      <div class="topic-head">
        <h3><span class="mono">${t.id}</span> ${esc(t.title)}</h3>
        <span class="chip ${cov.cls}">${cov.label}</span>
      </div>

      ${t.bullets.length ? `<ul class="bullets">${t.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      ${t.note ? `<p class="note">${esc(t.note)}</p>` : ''}

      <div class="refs">
        ${(t.docs || []).map(d => `<a class="ref doc" href="${d.url}" target="_blank" rel="noopener">${esc(d.label)}</a>`).join('')}
      </div>

      <div class="track">
        ${[['read', 'Read'], ['hands', 'Hands-on'], ['drilled', 'Drilled']].map(([k, l]) =>
          `<label class="cb${st[k] ? ' on' : ''}"><input type="checkbox" data-topic="${t.id}" data-flag="${k}"${st[k] ? ' checked' : ''}> ${l}</label>`).join('')}
        <span class="conf">Confidence
          ${[1, 2, 3, 4, 5].map(n => `<button class="dot${st.conf >= n ? ' on' : ''}" data-conf="${t.id}" data-n="${n}" title="${n}/5">${n}</button>`).join('')}
        </span>
      </div>
    </article>`;
  }

  function bindBlueprint() {
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.onclick = () => { bpFilter = b.dataset.filter; render(); };
    });
    document.querySelectorAll('input[data-topic]').forEach(cb => {
      cb.onchange = () => {
        Store.setTopicFlag(cb.dataset.topic, cb.dataset.flag, cb.checked);
        cb.closest('.cb').classList.toggle('on', cb.checked);
      };
    });
    document.querySelectorAll('[data-conf]').forEach(b => {
      b.onclick = () => {
        const id = b.dataset.conf, n = +b.dataset.n;
        Store.setConfidence(id, Store.topic(id).conf === n ? 0 : n);
        render();
        const el = document.getElementById('t-' + id);
        if (el) el.scrollIntoView({ block: 'center' });
      };
    });
  }

  /* ---------------- Plan ---------------- */

  function viewPlan() {
    const cw = currentWeek();
    const t = today();

    // Slip = tasks left in weeks that have already ended.
    let slip = 0;
    PLAN.weeks.forEach(w => {
      if (t > day(w.to)) {
        const c = Store.weekCompletion(w);
        slip += c.total - c.done;
      }
    });

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
            return tp ? `<a class="chip ${PREP[tp.prep].cls}" href="#blueprint" data-focus="${id}">§${id}</a>` : '';
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

    return `
      <div class="card meta">
        <div>
          <b>9 weeks · ~${PLAN.hoursPerWeek} h/week</b> — ${fmt(PLAN.start)} to ${fmt(PLAN.weeks[8].to)}, then final review ${fmt(PLAN.finalReview.from)}–${fmt(PLAN.finalReview.to)}, exam ${fmt(PLAN.examDate)}.
          <div class="small dim">A fail carries a 14-day wait, so an Oct 9 attempt still leaves ${fmt(PLAN.retakeWindow)} for a retake — inside the Oct 2026 goal.</div>
        </div>
      </div>

      ${slip > 0 ? `<div class="alert warn-alert">
        <b>${slip} task${slip > 1 ? 's' : ''} left behind in weeks that have already ended.</b>
        <div class="small">Do not try to catch up on everything. Carry forward only what feeds a section with high unearned weight — check the Dashboard — and abandon the rest.</div>
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
    `;
  }

  function bindPlan() {
    document.querySelectorAll('input[data-task]').forEach(cb => {
      cb.onchange = () => {
        Store.setTask(cb.dataset.task, cb.checked);
        cb.closest('li').classList.toggle('on', cb.checked);
        // Refresh the header counters without collapsing the open week.
        const d = cb.closest('details');
        if (d) {
          const w = PLAN.weeks.find(w => cb.dataset.task.startsWith(`w${w.n}:`));
          if (w) {
            const c = Store.weekCompletion(w);
            d.querySelector('.bar.sm i').style.width = (c.done / c.total * 100) + '%';
            d.querySelector('summary .mono.dim:last-child').textContent = `${c.done}/${c.total}`;
          }
        }
      };
    });
  }

  /* ---------------- Case studies ---------------- */

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
        <textarea id="case-answer" class="notes-area" rows="10"
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
    document.querySelectorAll('[data-case]').forEach(b => {
      b.onclick = () => { openCase = b.dataset.case; caseFilter = 'all'; render(); window.scrollTo(0, 0); };
    });
    const back = $('#case-back');
    if (back) back.onclick = () => { openCase = null; render(); window.scrollTo(0, 0); };
    document.querySelectorAll('[data-cfilter]').forEach(b => {
      b.onclick = () => { caseFilter = b.dataset.cfilter; render(); };
    });
    const rev = $('#case-reveal');
    if (rev) rev.onclick = () => { showRef[openCase] = !showRef[openCase]; render(); };
    const ta = $('#case-answer');
    if (ta) {
      let t;
      ta.oninput = () => { clearTimeout(t); t = setTimeout(() => Store.setNote('case:' + openCase, ta.value), 400); };
    }
  }

  /* ---------------- Notes ---------------- */

  let noteTopic = null;

  function viewNotes() {
    const topics = allTopics();
    const t = noteTopic || topics[0].id;
    const cur = topics.find(x => x.id === t);
    const written = Store.notedIds().filter(id => !id.startsWith('case:'));

    return `
      <div class="card meta"><div>
        <b>Per-topic notes</b> — your own words are what you will actually recall under exam pressure.
        <div class="small dim">${written.length} of ${topics.length} sub-sections have notes. Saved locally;
        use Export progress to back them up, or the button below for a markdown copy.</div>
      </div>
      <div class="links"><button id="notes-md">Export as markdown</button></div></div>

      <div class="grid-2">
        <div class="card">
          <h2>${esc(cur.title)} <span class="mono dim">§${cur.id}</span></h2>
          ${cur.bullets.length ? `<details><summary class="dim small">Official bullets for this sub-section</summary>
            <ul class="bullets">${cur.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul></details>` : ''}
          <textarea id="note-area" class="notes-area" rows="16"
            placeholder="What you learned, in your own words. Decision rules, service comparisons, things you got wrong in a mock.">${esc(Store.note(t))}</textarea>
        </div>
        <div class="card">
          <h2>Sub-sections</h2>
          <div class="note-list">
            ${topics.map(x => `<button class="note-pick${x.id === t ? ' on' : ''}" data-note="${x.id}">
              <span class="mono">${x.id}</span> ${esc(x.title.slice(0, 40))}${x.title.length > 40 ? '…' : ''}
              ${Store.note(x.id) ? '<span class="dot-has"></span>' : ''}</button>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function bindNotes() {
    document.querySelectorAll('[data-note]').forEach(b => {
      b.onclick = () => { noteTopic = b.dataset.note; render(); };
    });
    const ta = $('#note-area');
    if (ta) {
      let t;
      ta.oninput = () => {
        clearTimeout(t);
        t = setTimeout(() => {
          Store.setNote(noteTopic || allTopics()[0].id, ta.value);
          const pick = document.querySelector(`[data-note="${noteTopic || allTopics()[0].id}"]`);
          if (pick && ta.value && !pick.querySelector('.dot-has')) {
            pick.insertAdjacentHTML('beforeend', '<span class="dot-has"></span>');
          }
        }, 400);
      };
    }
    const md = $('#notes-md');
    if (md) md.onclick = exportNotesMarkdown;
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

  /* ---------------- Mock tests ---------------- */

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
      document.querySelectorAll('[data-mode]').forEach(b => {
        b.onclick = () => {
          const started = Quiz.start(b.dataset.mode, { section: b.dataset.section });
          if (!started) return;
          quizStage = 'run';
          render();
        };
      });
      return;
    }

    if (quizStage === 'run') {
      const r = Quiz.current();

      document.querySelectorAll('[data-opt]').forEach(b => {
        b.onclick = () => { Quiz.select(+b.dataset.opt); render(); };
      });
      const prev = $('#q-prev'), next = $('#q-next'), fin = $('#q-finish'), ab = $('#q-abandon');
      if (prev) prev.onclick = () => { r.i--; render(); };
      if (next) next.onclick = () => { r.i++; render(); };
      if (fin) fin.onclick = () => { quizStage = 'results'; render(); };
      if (ab) ab.onclick = () => { quizStage = 'results'; render(); };
      document.querySelectorAll('[data-goto]').forEach(b => {
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
    };
  }

  /* ---------------- Flashcards ---------------- */

  let cardQueue = null, cardShown = false, cardScope = 'due';

  function viewCards() {
    const all = window.FLASHCARDS;
    const due = Store.dueCards(all);

    if (!cardQueue) {
      const counts = { due: due.length, all: all.length };
      const byTopic = {};
      all.forEach(c => { byTopic[c.t || c.topic] = (byTopic[c.t || c.topic] || 0) + 1; });

      return `
        <div class="card meta"><div>
          <b>${all.length} cards</b> — the decision tables plus the high-confusion pairs the exam keeps
          returning to. Spaced repetition: cards you find hard come back sooner.
          <div class="small dim">${counts.due} due now.</div>
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
    document.querySelectorAll('[data-cards]').forEach(b => {
      b.onclick = () => {
        const all = window.FLASHCARDS;
        const mode = b.dataset.cards;
        let q = mode === 'due' ? Store.dueCards(all)
              : mode === 'topic' ? all.filter(c => c.topic === b.dataset.topic)
              : all.slice();
        cardQueue = q.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(p => p[1]);
        cardShown = false;
        render();
      };
    });
    const show = $('#c-show');
    if (show) show.onclick = () => { cardShown = true; render(); };
    document.querySelectorAll('[data-grade]').forEach(b => {
      b.onclick = () => {
        const g = +b.dataset.grade, c = cardQueue[0];
        Store.gradeCard(c.id, g);
        cardQueue.shift();
        if (g === 0) cardQueue.push(c);        // failed cards come back this session
        cardShown = false;
        render();
      };
    });
    const done = $('#c-done');
    if (done) done.onclick = () => { cardQueue = null; cardShown = false; render(); };
  }

  /* ---------------- Decision tables ---------------- */

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
          <a class="chip cov-partial" href="#blueprint" data-focus="${d.topic}">§${d.topic}</a>
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

  /* ---------------- Shell ---------------- */

  const VIEWS = {
    dashboard: { title: 'Dashboard', render: viewDashboard, bind: bindDashboard },
    blueprint: { title: 'Blueprint', render: viewBlueprint, bind: bindBlueprint },
    plan: { title: 'Plan', render: viewPlan, bind: bindPlan },
    cases: { title: 'Case studies', render: viewCases, bind: bindCases },
    notes: { title: 'Notes', render: viewNotes, bind: bindNotes },
    quiz: { title: 'Mock tests', render: viewQuiz, bind: bindQuiz },
    cards: { title: 'Flashcards', render: viewCards, bind: bindCards },
    tables: { title: 'Decision tables', render: viewTables, bind: () => {} }
  };

  let pendingFocus = null;

  function render() {
    if (tick) { clearInterval(tick); tick = null; }
    const name = (location.hash.slice(1) || 'dashboard').split('?')[0];
    const view = VIEWS[name] || VIEWS.dashboard;

    $('#view').innerHTML = view.render();
    view.bind();

    document.querySelectorAll('nav a').forEach(a =>
      a.classList.toggle('on', a.getAttribute('href') === '#' + name));

    // Cross-view deep links: #blueprint + data-focus scrolls to a topic.
    document.querySelectorAll('[data-focus]').forEach(a => {
      a.addEventListener('click', () => { pendingFocus = a.dataset.focus; });
    });

    if (pendingFocus && name === 'blueprint') {
      const el = document.getElementById('t-' + pendingFocus);
      if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); }
      pendingFocus = null;
    }
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
