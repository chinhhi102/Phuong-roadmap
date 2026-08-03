# 📊 BA Academy — Business Analyst Learning Platform

An interactive, roadmap-driven learning **management** experience that takes a learner from beginner to **job-ready Business Analyst**. It's both a learning dashboard and a study workspace: rich lessons, a Notion-style note system, W3Schools-style scoring, an analytics dashboard, an auto-built portfolio, and a completion certificate — all **client-side** and deployable to **GitHub Pages**.

> Curriculum standard: the path follows **Simplilearn's Business Analyst program** — **IIBA BABOK® v3** knowledge areas for the BA core, **Microsoft PL-300** for Power BI, plus Agile, SQL/Excel, and a capstone. **Module 1 (Power BI) is first** to match what the learner is studying now. Examples are flavored with accounting / ERP / MISA scenarios.

---

## ✨ Features

| Area | What's included |
|------|-----------------|
| **Curriculum** | **9 modules · 29 lessons**, structured on Simplilearn / BABOK v3 + PL-300. Each lesson has objectives, duration, difficulty, prerequisites, resources, rich content, a real-world example, exercises, deliverables, and completion criteria. |
| **Practice quizzes** | Every lesson has a **10–15 question practice quiz** (~377 total) in its Practice tab — instructor-gradable like exams. |
| **Exams** | **One focused exam per module (20–30 questions each — 200 total)**. Auto-graded MCQ/True-False; short-answer questions are auto-graded by keywords and **the Instructor role can override each answer's grade** on a finished quiz or exam, recomputing the score live. The module exam weighs 60% of the module score. |
| **Roadmap** | roadmap.sh-style hierarchy — expandable modules, per-module progress, **all lessons open** (prerequisites shown only as recommended order), current-lesson highlight, per-module "Take exam", search + difficulty/status filters. |
| **Lesson page** | Markdown content with **Mermaid diagrams, tables, code blocks, embedded resources**; tabs for Learn / Practice / Assignment / Notes / Discussion; bookmarks & favorites; prev/next navigation. |
| **Notes** | Notion-like per-lesson editor: Markdown + live preview, checklist/table/code/callout inserts, **auto-save**, fullscreen, and a searchable notes hub. |
| **Assessment** | Auto-graded quizzes (MCQ / true-false / short-answer), exercise & assignment scoring, and a W3Schools-style **weighted lesson score** → module score → overall course score. |
| **Dashboard** | Overall progress ring, radar chart (competency by module), completion bar chart, streak, hours studied, average score, strengths/weaknesses, recent activity. |
| **Collaboration** | Shared UI with a **learner/instructor identity toggle**: instructors review/approve assignments and comment; learners submit, respond, and revise — inline. |
| **Portfolio** | Auto-assembled from completed lessons; exports to a self-contained **HTML** file. |
| **Certificate** | Generated at 100% completion with name, date, overall score, and competency level; print / save as PDF. |
| **Data** | Swappable storage: **browser localStorage** (default) or a **local server that writes an XML file** (`npm run dev:server`). JSON **export/import** backup; reset. |
| **UX** | Dark/light mode, responsive layout, smooth animations (Framer Motion), `⌘/Ctrl+K` search, accessible components. |

---

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # typecheck (tsc -b) + production build to dist/
npm run preview    # serve the production build locally
npm run typecheck  # types only
npm run server     # run only the local data server (port 8787)
npm run dev:server # run the data server + app; persists to an XML file (data/ba-data.xml)
npm run deploy     # build + publish dist/ with gh-pages
```

---

## 🌐 Deploy to GitHub Pages

The app is a static SPA that uses **HashRouter** and **relative asset paths** (`base: './'`), so it runs on any static host with no server config.

**Option A — GitHub Actions (recommended).** A workflow is included at `.github/workflows/deploy.yml`. Push to `main`, then in **Settings → Pages** set *Source = GitHub Actions*. Done.

**Option B — `gh-pages` branch.**
```bash
npm run deploy     # publishes dist/ to the gh-pages branch
```

No `base` change is needed for project sites because assets are referenced relatively and routing is hash-based.

---

## 💾 Data & storage

All learner data — progress, notes, quiz & exam results, completed lessons, bookmarks, settings — flows through `src/services/storage.ts`.

- **Two backends out of the box:**
  - **Browser localStorage** (default) — zero setup, works on static hosts like GitHub Pages.
  - **Local file/server** — run `npm run dev:server`; the app (started in `--mode server`) persists to a **`data/ba-data.xml`** file via a tiny zero-dependency Node server (`server/index.mjs`). Selected by `VITE_STORAGE=server` (see `.env.server`).
- **Swappable backend:** the app talks to a `KeyValueStore` interface and a single `activeStore`. To move to Firebase / Supabase / IndexedDB, implement the interface once (like `ServerStore`) and swap `activeStore` — **no UI changes**.
- **Backup:** Settings → *Export backup* downloads a JSON snapshot; *Import backup* restores it.

---

## 🏗️ Architecture

```
src/
  components/        # shared UI primitives (Button, Card, Modal, Progress…), Markdown, Mermaid, layout
    ui/
    layout/
  features/          # feature-sliced pages & widgets
    roadmap/
    lessons/         # LessonPage + Exercise/Assignment/Discussion/Score panels
    notes/           # NoteEditor + NotesPage
    quizzes/         # QuizRunner (auto-grading)
    dashboard/       # analytics + charts
    portfolio/
    certificate/
    settings/
  data/              # curriculum (typed) — one file per module
    modules/
  lib/               # utils, scoring, selectors, download
  services/          # storage abstraction (localStorage → swappable)
  store/             # Zustand stores (settings, progress, notes) w/ persistence
  types/             # domain types (single source of truth)
```

**Scoring model** (`src/lib/scoring.ts`): each lesson score is a weighted blend of quiz (40%), exercises (25%), assignment (25%), and completion (10%), renormalized over whichever components a lesson actually has. Module and overall scores aggregate lesson scores.

---

## ⌨️ Keyboard shortcuts

- `⌘/Ctrl + K` — open lesson search
- `Esc` — close dialogs
- `⌘/Ctrl + Enter` — send a discussion message

---

## 🧰 Tech stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS · Zustand · React Router (HashRouter) · Recharts · Mermaid · react-markdown + remark-gfm · Framer Motion · Zod · lucide-react.

**Engineering notes (deliberate choices):**
- **UI primitives are hand-rolled in the shadcn/ui style** rather than pulling the shadcn CLI, so the project builds with zero interactive setup and no Radix peer-dependency surface. The component API is compatible with swapping in shadcn later.
- **React Query is intentionally omitted** — there is no server; all state is local and lives in Zustand + the storage layer. React Hook Form isn't needed for the app's light forms; **Zod** is wired into backup import validation.
- Heavy dependencies (**Mermaid, Recharts, each route**) are **code-split** so the initial bundle is ~150 KB gzipped.

---

## 📌 Scope & honesty

This is a substantial single-pass build covering the full feature set end-to-end. A few areas are intentionally lightweight and are the natural next iteration:
- Instructor review is simulated locally via the identity toggle (no real auth/multi-user backend — by design for a static app; the storage layer is ready for one).
- Certificate/portfolio export produce clean HTML (print-to-PDF) rather than server-rendered PDFs.

Everything listed under **Features** is implemented and works against real, typed curriculum data. `npm run build` passes a strict typecheck.
