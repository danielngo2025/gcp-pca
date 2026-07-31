// Progress lives in localStorage. It is tied to this browser and dies with a cache clear,
// so export/import is the real backup — not a nice-to-have.
(function () {
  const KEY = 'gcp-pca-progress-v1';

  const blank = () => ({
    examDate: window.PLAN.examDate,
    topics: {},   // id -> { read, hands, drilled, conf }
    tasks: {},    // "w3:2" -> true
    mocks: [],    // { date, score, total, label }
    notes: {},    // topic id / case id -> string
    qhist: {},    // question id -> { seen, wrong }  (wrong>=2 ⇒ leech)
    cards: {},    // card id -> { ease, due, streak }  SM-2 lite
    updated: null
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      return Object.assign(blank(), JSON.parse(raw));
    } catch (e) {
      console.warn('progress unreadable, starting fresh', e);
      return blank();
    }
  }

  function save() {
    state.updated = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('could not persist progress', e);
    }
  }

  const Store = {
    get state() { return state; },

    topic(id) {
      if (!state.topics[id]) state.topics[id] = { read: false, hands: false, drilled: false, conf: 0 };
      return state.topics[id];
    },

    setTopicFlag(id, flag, value) {
      Store.topic(id)[flag] = value;
      save();
    },

    setConfidence(id, conf) {
      Store.topic(id).conf = conf;
      save();
    },

    task(key) { return !!state.tasks[key]; },

    setTask(key, value) {
      if (value) state.tasks[key] = true;
      else delete state.tasks[key];
      save();
    },

    addMock(score, total, label) {
      state.mocks.push({ date: new Date().toISOString().slice(0, 10), score: +score, total: +total, label: label || '' });
      save();
    },

    removeMock(i) {
      state.mocks.splice(i, 1);
      save();
    },

    setExamDate(d) {
      state.examDate = d;
      save();
    },

    // Fraction of the three study actions done for a topic.
    topicCompletion(id) {
      const t = Store.topic(id);
      return (Number(t.read) + Number(t.hands) + Number(t.drilled)) / 3;
    },

    sectionCompletion(section) {
      const vals = section.topics.map(t => Store.topicCompletion(t.id));
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    },

    // Single readiness number: how much of the weighted exam surface you've covered.
    readiness() {
      return window.BLUEPRINT.sections
        .reduce((sum, s) => sum + s.weight * Store.sectionCompletion(s), 0);
    },

    weekCompletion(week) {
      const done = week.tasks.filter((_, i) => Store.task(`w${week.n}:${i}`)).length;
      return { done, total: week.tasks.length };
    },

    export() {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `pca-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    },

    import(file, done) {
      const r = new FileReader();
      r.onload = () => {
        try {
          state = Object.assign(blank(), JSON.parse(r.result));
          save();
          done(null);
        } catch (e) {
          done(e);
        }
      };
      r.readAsText(file);
    },

    /* ---- notes & case study attempts ---- */

    note(id) { return state.notes[id] || ''; },

    setNote(id, text) {
      if (text) state.notes[id] = text;
      else delete state.notes[id];
      save();
    },

    notedIds() { return Object.keys(state.notes); },

    /* ---- quiz history ---- */

    recordAnswer(qid, correct) {
      const h = state.qhist[qid] || (state.qhist[qid] = { seen: 0, wrong: 0 });
      h.seen++;
      if (!correct) h.wrong++;
      save();
    },

    // Repeatedly missed questions are worth more than fresh ones.
    leeches() {
      return Object.entries(state.qhist)
        .filter(([, h]) => h.wrong >= 2)
        .map(([id]) => id);
    },

    wrongOnce() {
      return Object.entries(state.qhist)
        .filter(([, h]) => h.wrong >= 1)
        .map(([id]) => id);
    },

    /* ---- flashcard scheduling (SM-2 lite) ---- */

    card(id) {
      if (!state.cards[id]) state.cards[id] = { ease: 2.5, due: 0, streak: 0 };
      return state.cards[id];
    },

    // grade: 0 = again, 1 = hard, 2 = good, 3 = easy
    gradeCard(id, grade) {
      const c = Store.card(id);
      const dayMs = 86400000;
      if (grade === 0) {
        c.streak = 0;
        c.ease = Math.max(1.3, c.ease - 0.2);
        c.due = Date.now() + 10 * 60000;           // 10 minutes
      } else {
        c.streak++;
        if (grade === 1) c.ease = Math.max(1.3, c.ease - 0.15);
        if (grade === 3) c.ease = Math.min(3.0, c.ease + 0.15);
        const interval = c.streak === 1 ? 1 : c.streak === 2 ? 3 : Math.round(3 * Math.pow(c.ease, c.streak - 2));
        c.due = Date.now() + interval * dayMs;
      }
      save();
    },

    dueCards(all) {
      const now = Date.now();
      return all.filter(c => Store.card(c.id).due <= now);
    },

    reset() {
      state = blank();
      save();
    }
  };

  window.Store = Store;
})();
