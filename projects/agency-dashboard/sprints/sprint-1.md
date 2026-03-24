# Sprint 1 — Agency Dashboard

**Zeitraum:** 2026-03-24 → 2026-04-07 (2 Wochen)
**Sprint-Ziel:** Foundation steht — Auth, GitHub-Datenanbindung, F1+F2+F3 funktional

---

## Milestones

| Datum | Milestone | Owner | Status |
|-------|-----------|-------|--------|
| 2026-03-26 | Product Brief + User Stories fertig | CPO | ⏳ |
| 2026-03-28 | Architektur-Entscheidung (ADR) committed | CTO | ⏳ |
| 2026-03-31 | Next.js Projekt-Scaffold + GitHub OAuth | Senior FE React | ⏳ |
| 2026-04-04 | F1: Org-Chart (read-only, GitHub-Daten) | Senior FE React | ⏳ |
| 2026-04-04 | F3: Token-Kosten Endpoint | Senior BE Python | ⏳ |
| 2026-04-07 | F2: Projekt-Übersicht MVP | Senior FE React | ⏳ |
| 2026-04-07 | Sprint Review + Retro | CEO + Team | ⏳ |

---

## Sprint Backlog

### [P0] Setup & Foundation

- [ ] `SETUP-1` — Next.js 15 Projekt-Init (TypeScript strict, Tailwind, ESLint)
  Owner: Senior FE React | Deadline: 2026-03-31
- [ ] `SETUP-2` — GitHub OAuth Integration (next-auth v5, nur Oliver)
  Owner: Senior FE React | Deadline: 2026-03-31
- [ ] `SETUP-3` — GitHub API Client (REST + GraphQL wrapper, Rate-Limit-Handling)
  Owner: Senior BE Python | Deadline: 2026-03-31
- [ ] `SETUP-4` — Playwright-Baseline einrichten (leere Seite als Baseline)
  Owner: QA Lead | Deadline: 2026-04-01

### [P0] F1 — Org-Chart

- [ ] `F1-1` — GitHub API: Alle aktiven Agent-Profile aus `_hr/agents/` lesen
  Owner: Senior BE Python | Deadline: 2026-04-02
- [ ] `F1-2` — UI: Org-Chart-Komponente (Signal Red + Void Black)
  Owner: Senior FE React | Deadline: 2026-04-04
- [ ] `F1-3` — Agent-Status: active/pending/offline aus YAML-Frontmatter
  Owner: Senior FE React | Deadline: 2026-04-04
- [ ] `F1-4` — Budget-Anzeige pro Agent
  Owner: Senior FE React | Deadline: 2026-04-04
- [ ] `F1-5` — Playwright Visual Test: Org-Chart Screenshot-Baseline
  Owner: QA Lead | Deadline: 2026-04-05

### [P1] F2 — Projekt-Übersicht

- [ ] `F2-1` — GitHub API: Projekte aus `projects/` lesen, Status aus brief.md
  Owner: Senior BE Python | Deadline: 2026-04-05
- [ ] `F2-2` — UI: Projekt-Cards mit Progress, ETA, Risiko-Indikator
  Owner: Senior FE React | Deadline: 2026-04-07
- [ ] `F2-3` — Playwright Visual Test: Projekt-Übersicht
  Owner: QA Lead | Deadline: 2026-04-07

### [P1] F3 — Token-Kosten

- [ ] `F3-1` — Finance-Parser: `_finance/` Markdown lesen + aggregieren
  Owner: Senior BE Python | Deadline: 2026-04-04
- [ ] `F3-2` — UI: Token-Kosten-Widget pro Agent (MTD, Week, Today)
  Owner: Senior FE React | Deadline: 2026-04-06

---

## Definition of Done (Sprint 1)

- [ ] GitHub OAuth läuft, nur Oliver kommt rein
- [ ] F1 Org-Chart zeigt echte Daten aus `_hr/agents/`
- [ ] F2 Projekt-Übersicht zeigt mindestens agency-dashboard
- [ ] F3 zeigt Token-Budget pro Agent aus `_finance/`
- [ ] Alle Playwright-Baselines gesetzt, kein visueller Regression
- [ ] Deployment auf Hetzner via Coolify funktioniert (Staging)
- [ ] Kein PII in Logs (DSGVO)

---

## Sprint Review — 2026-04-07

Format: `meetings/sprint-planning/2026-04-07-sprint-1-review.md`
Teilnehmer: CEO, CTO, CPO, VP Engineering, QA Lead
