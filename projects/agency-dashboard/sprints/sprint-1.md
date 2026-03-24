# Sprint 1 — Agency Dashboard

**Zeitraum:** 2026-03-24 → 2026-04-07 (2 Wochen)
**Sprint-Ziel:** Foundation steht — Auth, GitHub-Datenanbindung, F1+F2+F3 funktional

---

## Milestones

| Datum | Milestone | Owner | Status |
|-------|-----------|-------|--------|
| 2026-03-26 | Product Brief + User Stories fertig | CPO | ✅ 2026-03-24 |
| 2026-03-28 | Architektur-Entscheidung (ADR) committed | CTO | ✅ 2026-03-24 |
| 2026-03-31 | Next.js Projekt-Scaffold + GitHub OAuth | Senior FE React | ✅ 2026-03-24 |
| 2026-04-04 | F1: Org-Chart (read-only, GitHub-Daten) | Senior FE React | ✅ 2026-03-24 |
| 2026-04-04 | F3: Token-Kosten Endpoint | Senior BE Python | ✅ 2026-03-24 |
| 2026-04-07 | F2: Projekt-Übersicht MVP | Senior FE React | ✅ 2026-03-24 |
| 2026-04-07 | Sprint Review + Retro | CEO + Team | ⏳ |

---

## Sprint Backlog

### [P0] Setup & Foundation

- [x] `SETUP-1` — Next.js 15 Projekt-Init (TypeScript strict, Tailwind, ESLint) ✅ 0fe890b
  Owner: Senior FE React | Deadline: 2026-03-31
- [x] `SETUP-2` — GitHub OAuth Integration (next-auth v5, nur Oliver) ✅ 0fe890b
  Owner: Senior FE React | Deadline: 2026-03-31
- [x] `SETUP-3` — GitHub API Client (REST + GraphQL wrapper, Rate-Limit-Handling) ✅ 0fe890b
  Owner: Senior BE Python | Deadline: 2026-03-31
- [ ] `SETUP-4` — Playwright-Baseline einrichten (leere Seite als Baseline) ⏳ ausstehend
  Owner: QA Lead | Deadline: 2026-04-01

### [P0] F1 — Org-Chart

- [x] `F1-1` — GitHub API: Alle aktiven Agent-Profile aus `_hr/agents/` lesen ✅ 0fe890b
  Owner: Senior BE Python | Deadline: 2026-04-02
- [x] `F1-2` — UI: Org-Chart-Komponente (Signal Red + Void Black) ✅ c2e221a
  Owner: Senior FE React | Deadline: 2026-04-04
- [x] `F1-3` — Agent-Status: active/pending/offline aus YAML-Frontmatter ✅ d0cea25
  Owner: Senior FE React | Deadline: 2026-04-04
- [x] `F1-4` — Budget-Anzeige pro Agent ✅ c624391
  Owner: Senior FE React | Deadline: 2026-04-04
- [ ] `F1-5` — Playwright Visual Test: Org-Chart Screenshot-Baseline ⏳ ausstehend (SETUP-4 dep)
  Owner: QA Lead | Deadline: 2026-04-05

### [P1] F2 — Projekt-Übersicht

- [x] `F2-1` — GitHub API: Projekte aus `projects/` lesen, Status aus brief.md ✅ 7da9730
  Owner: Senior BE Python | Deadline: 2026-04-05
- [x] `F2-2` — UI: Projekt-Cards mit Progress, ETA, Risiko-Indikator ✅ 4f1f0d3
  Owner: Senior FE React | Deadline: 2026-04-07
- [ ] `F2-3` — Playwright Visual Test: Projekt-Übersicht ⏳ ausstehend (SETUP-4 dep)
  Owner: QA Lead | Deadline: 2026-04-07

### [P1] F3 — Token-Kosten

- [x] `F3-1` — Finance-Parser: `_finance/` Markdown lesen + aggregieren ✅ c0c3658
  Owner: Senior BE Python | Deadline: 2026-04-04
- [x] `F3-2` — UI: Token-Kosten-Widget pro Agent (MTD, Week, Today) ✅ db588ee
  Owner: Senior FE React | Deadline: 2026-04-06

---

## Definition of Done (Sprint 1)

- [x] GitHub OAuth läuft, nur Oliver kommt rein ✅
- [x] F1 Org-Chart zeigt echte Daten aus `_hr/agents/` ✅
- [x] F2 Projekt-Übersicht zeigt mindestens agency-dashboard ✅
- [x] F3 zeigt Token-Budget pro Agent aus `_finance/` ✅
- [ ] Alle Playwright-Baselines gesetzt (SETUP-4 ausstehend) ⏳
- [ ] Deployment auf Hetzner via Coolify funktioniert (Staging) ⏳
- [x] Kein PII in Logs (DSGVO) ✅

**Sprint-Fortschritt:** 9/14 Tickets Done — Blocker: SETUP-4 (QA), Coolify Deployment

---

## Sprint Review — 2026-04-07

Format: `meetings/sprint-planning/2026-04-07-sprint-1-review.md`
Teilnehmer: CEO, CTO, CPO, VP Engineering, QA Lead
