# PCA study site

An interactive study tracker for the **Google Professional Cloud Architect** exam, built
on the official exam guide revision **30 Oct 2025**.

Live at **[gcp.danhngo.ca](https://gcp.danhngo.ca)**.

Static HTML. No build step, no dependencies, no framework, no server required.

## Why it exists

Google rewrote this exam on 30 October 2025. Three of the four case studies are new —
Altostrat Media, Cymbal Retail and KnightMotives Automotive, with only EHR Healthcare
carried over — and sections 2.4 and 2.5 are now entirely Gemini Enterprise Agent Platform,
Model Garden, AI Hypercomputer and Model Armor.

A lot of study material still teaches the retired blueprint. **If a prep source mentions
Mountkirk Games, TerramEarth or Helicopter Racing League, it predates the current exam —
reject it.** Everything here is generated from the current guide.

## Exam facts

2 hours · 50–60 multiple choice and multiple select · $200 · English or Japanese ·
online-proctored or onsite · no prerequisites · valid 2 years · 2 case studies per exam,
20–30% of questions, shown on a split screen.

| § | Section | Weight |
|---|---------|--------|
| 1 | Designing and planning a cloud solution architecture | 25% |
| 2 | Managing and provisioning a cloud solution infrastructure | 17.5% |
| 3 | Designing for security and compliance | 17.5% |
| 4 | Analyzing and optimizing technical and business processes | 15% |
| 5 | Managing implementation | 12.5% |
| 6 | Ensuring solution and operations excellence | 12.5% |

22 sub-sections. The Well-Architected Framework's six pillars run through all of them —
treat the framework as a required primary source, not background reading.

## Views

Four modes. The split is by **object, not activity** — each thing has exactly one home and
carries its own practice, so you never meet the same material in two places. (Splitting
learn-vs-test was tried and abandoned: it cuts across the material, so the decision tables
legitimately belonged on both sides of the line.) Nav badges show what is waiting behind each.

### Today
The landing view and the only one you need on a normal study day: days to exam, your last
mock score, the current week, then **one card** with today's three unticked tasks, the
flashcards due, and a single recommended drill (leeches if they have piled up, otherwise
the section with the most exam weight still unearned). Everything else can wait.

Exam-surface coverage sits at the bottom as a progress bar, not a headline. It is
self-ticked, so it measures effort, not readiness — the mock score is the number to trust.

### Plan
The 9-week schedule at ~15 h/week with ~80 tickable tasks and slip detection, plus the
*points left* table — section weight × (1 − ticked) — so you can see where the next mark
actually is rather than which bar looks shortest. Mock scores are logged here.

### Study
Three tabs, one per kind of object. Each both teaches and tests the thing it owns.

- **Topics** — all 22 sub-sections as one collapsed row each: § id, title, prep signal
  (foundational / partial / **gap**), actions done, confidence, notes indicator. Open a row
  for the guide's verbatim bullets, official doc links, read / hands-on / drilled tracking,
  a 1–5 confidence rating, **your own notes**, and a one-click drill of that topic's
  questions. Filter by gaps, low confidence, unfinished or noted.
- **Decisions** — the nine tables that decide this exam: compute, database, storage class,
  load balancer, hybrid connectivity, DR pattern, migration strategy, IAM control, and
  AI/agent product. The third column of each is *the tell* — the phrase in a question stem
  that points at that row. That is what you drill, not the feature lists. **The 55 recall
  cards live here too**, under the table each one tests — read a table, then close the book
  and drill it. Spaced repetition (Again → 10 min, Good → 1 day, then intervals expanding by
  an ease factor). Cards for topics with no table are listed at the bottom, so all 55 stay
  reachable.
- **Cases** — all four, each with the existing environment mapped to what it implies, every
  requirement tagged (business / technical / non-functional / compliance) with the decision
  it forces and the service answer, a reference architecture held back until you have
  written your own, and the traps that case sets. 53 requirements and 29 traps across the
  four.

### Mock
The timed scored run, which is a genuinely different act from studying: a full 60-question
mock (120 minutes, auto-submits, sampled weighted to the real section percentages), plus
section drills, a wrong-answers-only retake, and a leech list of questions missed twice or
more. Per-topic drills launched from Study land here too. Every question carries an
explanation and links back to its Study topic.

Notes live inside the topic they belong to rather than in a separate view, and still export
as one markdown file. Confidence rating is deliberately separate from the checkboxes:
familiarity is the thing most likely to mislead you — trust mock scores over how a topic
feels.

Old hash links (`#blueprint`, `#dashboard`, `#tables`, `#notes`, `#quiz`, `#cards`,
`#cases`, `#drill/*`) redirect to their new homes, so existing bookmarks keep working.

## Run it locally

```bash
./serve.sh          # http://localhost:8000
```

Any static server works. Opening `index.html` directly should also work — data loads via
`<script src>` rather than `fetch()`, specifically so `file://` is not blocked — but the
server is the tested path and gives `localStorage` a stable origin.

## Progress and backups

Progress lives in `localStorage`, keyed to the origin you open the site from. A cache clear
wipes it. **Use "Export progress" regularly**; "Import" restores a snapshot. Notes also
export as markdown separately.

## Layout

```
index.html            app shell + nav
css/app.css
js/store.js           localStorage persistence, readiness math, quiz history,
                      SM-2 card scheduling, export/import
js/quiz.js            mock test engine — weighted sampling, timer, scoring, review
js/app.js             hash router (#mode/tab) + the four modes
data/blueprint.js     6 sections → 22 sub-sections, verbatim official bullets,
                      exam weights, doc links, prep signals
data/plan.js          the 9-week study plan, ~80 tickable tasks
data/questions.js     122 questions, weighted to the real section percentages
data/decisions.js     9 decision tables (91 rows) + 55 flashcards
data/cases.js         the four case studies: requirement tagging, reference
                      architectures, per-case traps
```

`data/blueprint.js` bullets are quoted verbatim from the exam guide — don't paraphrase
them. Re-fetch the guide periodically and diff it; Google revised this exam once already.

## On the case studies

The site links the four **v6.1 standard-exam** PDFs and does not copy their text. Those
documents are Google's, and a local copy would silently go stale if they revise them.
Read the PDFs; this is the working layer on top.

Worth knowing: the `altostrat_media_case_study_english.pdf` and `cymbal_retail_...` URLs
*without* the `v6.1_pca_` prefix are the **renewal** exam's case studies — different
documents. The canonical standard-exam links are embedded as hyperlinks inside the exam
guide PDF, which is where the ones here came from.

## On the question bank

122 questions authored from the official exam guide bullets, the four case studies and the
Well-Architected Framework — weighted so a full mock's section mix matches the real exam.
25 of them (20%) hang off a specific case study, matching the exam's case share.

They train reasoning; they do not reproduce real exam phrasing, and no braindump material
was used — that violates Google's certification agreement, and post-Oct-2025 dumps are
stale anyway. Pair this with one reputable practice-exam product for realistic full mocks,
and verify it covers the current revision by checking which case studies it uses.

Writing your own questions on a topic is itself strong retention practice. Append to
`data/questions.js`; the engine picks them up with no other changes.

## Accuracy caveat

Product naming in sections 2.4 and 2.5 is genuinely unstable — Vertex AI became the Gemini
Enterprise Agent Platform at Cloud Next 2026, and the official overview docs do not yet
spell out component boundaries. That content is therefore anchored on the durable selection
logic (TPU vs GPU, grounding vs fine-tuning, pipelines vs notebook glue, Model Armor vs
Cloud Armor) rather than on product names. Verify names against live docs as you study.

## Licence

MIT for the code. The exam guide bullets, section weights and case study links are
Google's material, referenced and linked rather than reproduced.
