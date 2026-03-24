# Kickoff: Agency Dashboard

**Datum:** 2026-03-24
**CEO:** Oliver Hees Clone
**MVP-Deadline:** 2026-04-21 (4 Wochen)
**Budget:** €100/Monat Token-Kosten

---

## Mission

Ein Management-Dashboard das die gesamte KI-Agentur auf einen Blick zeigt —
besser als Paperclip. GitHub ist die einzige Wahrheitsquelle. Kein eigenes Backend,
keine eigene DB. Schnell, DSGVO-konform, nur für Oliver.

---

## Team

| Rolle | Agent | Status |
|-------|-------|--------|
| CEO (Kickoff) | Oliver Clone | ✅ Active |
| CTO (Architektur) | — | ⏳ Direktive ausgestellt |
| CPO (Product Brief) | — | ⏳ Direktive ausgestellt |
| VP Engineering | — | 📋 Nach CTO-Spawn |
| Senior FE React | — | 📋 Nach Sprint-1-Planung |
| VP Design | — | 📋 Nach CPO-Brief |
| QA Lead | — | 📋 Ab Sprint 2 |

---

## 6 MVP-Features (Deliverables)

| # | Feature | Owner | Sprint | Status |
|---|---------|-------|--------|--------|
| F1 | Org-Chart live (Agents, Status, Budget) | Senior FE React | 1 | ⏳ |
| F2 | Projekt-Übersicht (Progress, ETA, Risiko) | Senior FE React | 1 | ⏳ |
| F3 | Token-Kosten pro Agent in Echtzeit | Senior BE Python | 1 | ⏳ |
| F4 | Board Escalations sofort sichtbar | Senior FE React | 2 | ⏳ |
| F5 | Daily Standup Feed | Senior FE React | 2 | ⏳ |
| F6 | Agent spawnen direkt aus UI | Senior FE React + BE | 2 | ⏳ |

---

## Tech-Stack (vom Board vorgegeben)

- **Framework:** Next.js 15, TypeScript strict, Tailwind CSS
- **Datenquelle:** GitHub API (REST + GraphQL) — keine eigene DB
- **Auth:** GitHub OAuth — nur Oliver (single-user)
- **Hosting:** Hetzner + Coolify
- **Design:** Signal Red #E53E3E + Void Black
- **Tests:** Playwright Visual Tests (mandatory für alle UI-Features)

---

## Sprint-Plan Übersicht

| Sprint | Dauer | Ziel |
|--------|-------|------|
| Sprint 1 | 2026-03-24 → 2026-04-07 | Foundation: Architektur, Auth, F1+F2+F3 |
| Sprint 2 | 2026-04-07 → 2026-04-21 | Features: F4+F5+F6, Visual Tests, Deployment |

**Puffer:** 0 Tage — MVP-Deadline ist hart. Scope-Cut bei Zeitdruck: F6 (Agent spawnen) ist P2.

---

## Risiken

| Risiko | Wahrscheinlichkeit | Mitigation |
|--------|-------------------|------------|
| GitHub API Rate Limits | Mittel | Caching-Layer, ISR in Next.js |
| F6 zu komplex für MVP | Hoch | F6 ist P2 — wird bei Zeitdruck gestrichen |
| Design-Abstimmung ohne VP Design | Mittel | Signal Red + Void Black ist fix vorgegeben |
| Playwright-Setup kostet Zeit | Niedrig | Von Anfang an integrieren, nicht am Ende |

---

## Entscheidungen

- **[CEO] F6 ist P2:** Direkte Agent-Spawn-UI ist nice-to-have. Core-Value liegt in Observability (F1-F3).
- **[CEO] GitHub-only:** Keine eigene DB — reduziert Komplexität massiv, DSGVO einfacher.
- **[CEO] Single-User-Auth:** Kein Multi-Tenant. Nur Oliver via GitHub OAuth. Kein Overhead.

---

## CEO-Direktiven (ausgestellt)

- DIR-001 → CTO: Architektur-Entscheidung + ADR bis 2026-03-28
- DIR-002 → CPO: Product Brief + User Stories bis 2026-03-26

Details: `_org/ceo-directives/`
