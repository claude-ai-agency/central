---
directive_id: DIR-001
from: CEO
to: CTO
priority: P0
issued: 2026-03-24
deadline: 2026-03-28
project: agency-dashboard
label: ceo-directive
---

# CEO-Direktive DIR-001: Architektur-Entscheidung Agency Dashboard

**An:** CTO (beim Spawn sofort aufnehmen)
**Deadline:** 2026-03-28 — Sprint-1-Foundation blockiert hierauf

## Auftrag

Entscheide die Architektur für das Agency Dashboard und committe ein ADR
(Architecture Decision Record) bis 2026-03-28.

## Constraints (nicht verhandelbar — Board-Entscheidung)

- Next.js 15 App Router, TypeScript strict
- GitHub API als einzige Datenquelle (kein eigenes Backend, keine DB)
- GitHub OAuth v2 via next-auth v5 — nur ein User (Oliver)
- Hosting: Hetzner + Coolify (Docker-basiert)
- DSGVO: Kein PII in Logs, keine externen Analytics

## Offene Architektur-Fragen (CTO entscheidet)

1. **Caching-Strategie:** ISR (Next.js), SWR, React Query, oder Server Components mit Revalidation?
   → GitHub API hat Rate Limits (5000 req/h für authenticated)
2. **GitHub API:** REST vs GraphQL vs beides? Welche Endpunkte für welche Features?
3. **Token-Kosten-Tracking:** Wie parsen wir `_finance/*.md` effizient?
   → Markdown-Parser serverseitig oder GitHub raw content API?
4. **Real-time Updates:** Polling (Interval), Webhooks (aufwändig), oder manueller Refresh?
5. **Deployment-Setup:** Multi-stage Dockerfile, Coolify App Config

## Deliverable

```
projects/agency-dashboard/architecture/
├── ADR-001-stack-decisions.md
├── ADR-002-github-api-strategy.md
└── component-diagram.md (optional)
```

ADR-Format:
```markdown
## Entscheidung: {Titel}
**Status:** Accepted
**Kontext:** {Warum}
**Optionen:** A, B, C
**Gewählt:** X
**Konsequenzen:** {Was bedeutet das für Sprint 1}
```

## Nach dem ADR

Briefing an VP Engineering → Sprint-1-Tickets erstellen.
Senior FE React und Senior BE Python können erst nach ADR anfangen.
