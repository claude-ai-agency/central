---
directive_id: DIR-002
from: CEO
to: CPO
priority: P0
issued: 2026-03-24
deadline: 2026-03-26
project: agency-dashboard
label: ceo-directive
---

# CEO-Direktive DIR-002: Product Brief + User Stories Agency Dashboard

**An:** CPO (beim Spawn sofort aufnehmen)
**Deadline:** 2026-03-26 — 2 Tage, weil Sprint 1 am 2026-03-31 starten muss

## Auftrag

Erstelle ein vollständiges Product Brief mit User Stories für das Agency Dashboard.
Basis: `projects/agency-dashboard/brief.md` (Board-Input)

## Was Oliver will (in seinen eigenen Worten)

> "Management-Dashboard für die KI-Agentur — besser als Paperclip.
> GitHub ist die einzige Datenquelle."

Oliver ist der einzige Nutzer. Er sieht das Dashboard morgens um 09:00,
checkt den Status, gibt Direktiven, und ist in 5 Minuten wieder weg.
Kein schickes Feature-Theater — Klarheit und Information.

## 6 Features — priorisiere und formuliere als User Stories

F1: Org-Chart (live Agents, Status, Budget)
F2: Projekt-Übersicht (Progress, ETA, Risiko)
F3: Token-Kosten pro Agent in Echtzeit
F4: Board Escalations sofort sichtbar
F5: Daily Standup Feed
F6: Agent spawnen direkt aus UI ← P2, nur wenn Zeit bleibt

## Deliverable

```
projects/agency-dashboard/product/
├── product-brief.md        # Vollständiger Product Brief
├── user-stories.md         # Alle User Stories mit Acceptance Criteria
└── ux-notes.md             # Flow-Beschreibung (kein Figma nötig — Text reicht)
```

User-Story-Format:
```
**US-{N}: {Titel}**
Als Oliver
möchte ich {was}
damit {warum}.

Acceptance Criteria:
- [ ] AC-1: {Konkrete, testbare Bedingung}
- [ ] AC-2: ...

Priority: P{0/1/2}
Sprint: {1/2}
```

## Wichtig

- Design ist vorgegeben (Signal Red #E53E3E + Void Black) — keine Design-Diskussion nötig
- Kein Multi-User, kein Rollen-Konzept
- Performance: Dashboard lädt in <3 Sekunden (GitHub API Cache)
- DSGVO: Keine externen Analytics, kein Tracking
