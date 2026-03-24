# ADR-001: Stack Decisions — Agency Dashboard

**Status:** Accepted
**Datum:** 2026-03-24
**Entscheider:** CTO
**Auftrag:** DIR-001

---

## Kontext

Das Agency Dashboard ist ein Single-User Management-Dashboard (nur Oliver) das die gesamte KI-Agentur visualisiert. GitHub ist die einzige Datenquelle — kein eigenes Backend, keine eigene DB. Die Architektur muss mit GitHub API Rate Limits (5000 req/h authenticated) umgehen, dabei schnell laden und DSGVO-konform auf Hetzner/Coolify laufen.

Constraints vom Board:
- Next.js 15 App Router, TypeScript strict
- GitHub API only — kein Backend, keine DB
- GitHub OAuth v2 via next-auth v5
- Hetzner + Coolify (Docker)
- DSGVO: Kein PII in Logs, keine externen Analytics

---

## Entscheidung 1: Caching-Strategie

**Optionen:**

| Option | Pro | Contra |
|--------|-----|--------|
| A) ISR (Next.js Incremental Static Regeneration) | Built-in, einfach, CDN-freundlich | Zu statisch für Dashboard-Daten, Coolify hat kein CDN |
| B) SWR (stale-while-revalidate) | Leichtgewichtig, Client-side, guter UX | Kein serverseitiger Cache, jeder Tab-Wechsel fetcht neu |
| C) React Query (TanStack Query) | Mächtiges Caching, Deduplication, Retry, DevTools | Zusätzliche Dependency, Lernkurve |
| D) Server Components + unstable_cache + SWR | Server-side fetch mit Cache, Client hydration mit SWR | Komplexer Setup |

**Gewahlt:** C) React Query (TanStack Query) + Server Components fur initiales Laden

**Begrundung:**
- React Query bietet exakt was wir brauchen: `staleTime` pro Query, automatisches Background-Refetch, Request-Deduplication, Retry-Logic
- Server Components liefern den initialen HTML-Render (SEO irrelevant, aber schnelles First Paint)
- React Query cached clientseitig — bei 5000 req/h Rate Limit ist intelligentes Caching Pflicht
- `staleTime: 5 * 60 * 1000` (5 Minuten) als Default — Dashboard-Daten mussen nicht sekundengenau sein
- Kein ISR nötig, da Single-User und kein CDN auf Coolify

**Konsequenzen fur Sprint 1:**
- `@tanstack/react-query` als Dependency von Tag 1
- QueryClientProvider im Root-Layout
- Jeder API-Call bekommt eine eigene Query-Key-Struktur
- Server Components fur initiale Daten, Client Components fur interaktive Teile

---

## Entscheidung 2: GitHub API — REST vs GraphQL

**Optionen:**

| Option | Pro | Contra |
|--------|-----|--------|
| A) Nur REST | Einfach, gut dokumentiert | Overfetching, mehr Requests nötig |
| B) Nur GraphQL | Exakte Daten, weniger Requests | Komplexere Queries, Error-Handling anders |
| C) Beides — REST + GraphQL je nach Feature | Best of both worlds | Zwei API-Clients pflegen |

**Gewahlt:** C) Beides — GraphQL als Primary, REST wo GraphQL keinen Vorteil bietet

**Begrundung:**
- GraphQL ist ideal fur verschachtelte Daten (Org-Chart: Repo → Issues → Labels → Assignees in einem Request)
- REST ist besser fur einfache Calls (Raw File Content fur `_finance/*.md`)
- Rate Limits sind getrennt: GraphQL hat eigenes Budget (5000 Punkte/h), REST ebenfalls 5000 req/h
- Effektiv verdoppelt sich unser Budget durch Nutzung beider APIs

Details in ADR-002.

**Konsequenzen fur Sprint 1:**
- GitHub GraphQL Client (leichtgewichtig, `graphql-request` oder `octokit/graphql`)
- GitHub REST Client (`octokit/rest`) fur Raw Content
- Shared Auth-Token aus next-auth Session
- API-Client-Layer als Abstraktion uber beiden

---

## Entscheidung 3: Token-Kosten-Tracking (`_finance/*.md` Parsing)

**Optionen:**

| Option | Pro | Contra |
|--------|-----|--------|
| A) GitHub Raw Content API + serverseitiger Markdown-Parser | Volle Kontrolle, schnell | Braucht Parser-Dependency |
| B) GitHub GraphQL Content-Query | Ein Request fur mehrere Files | Base64-encoded, muss decodiert werden |
| C) GitHub REST Contents API + `gray-matter` + `marked` | Standard-Tooling, Frontmatter-Support | Mehrere Requests pro File |

**Gewahlt:** A) GitHub REST Raw Content API + `unified`/`remark` Parser-Pipeline

**Begrundung:**
- `_finance/projects.md` und `_finance/hiring-budget.md` enthalten Markdown-Tabellen mit Budget-Daten
- GitHub Raw Content API (`GET /repos/{owner}/{repo}/contents/{path}`) liefert direkt den Inhalt
- `unified` + `remark` + `remark-gfm` parsed GFM-Tabellen zu strukturiertem AST
- Daraus extrahieren wir typisierte TypeScript-Objekte (Budget pro Agent, Verbrauch, Status)
- Kein Frontmatter in Finance-Files, daher kein `gray-matter` nötig
- Server-side only — Parser lauft nie im Client-Bundle

**Konsequenzen fur Sprint 1:**
- `unified`, `remark-parse`, `remark-gfm` als Dev-Dependencies
- `lib/finance-parser.ts` — typed Parser fur Finance-Markdown
- Finance-Daten werden via React Query gecached (staleTime: 10 Minuten)
- Type-Definitionen fur Budget-Tabellen in `types/finance.ts`

---

## Entscheidung 4: Real-time Updates

**Optionen:**

| Option | Pro | Contra |
|--------|-----|--------|
| A) Webhooks (GitHub → eigener Endpoint) | Echtes Real-time | Braucht offentlich erreichbaren Endpoint, Webhook-Infrastruktur, Security |
| B) Polling (festes Interval) | Einfach, kein Infra-Overhead | Verschwendet Rate Limits, Delay |
| C) Manueller Refresh + React Query Background Refetch | Minimaler Rate-Limit-Verbrauch, User-kontrolliert | Nicht automatisch |
| D) Smart Polling (React Query refetchInterval + Window Focus) | Automatisch wenn aktiv, pausiert wenn inaktiv | Leichter Delay |

**Gewahlt:** D) Smart Polling via React Query + manueller Refresh-Button

**Begrundung:**
- Single-User Dashboard — Oliver schaut aktiv drauf oder nicht
- React Query `refetchOnWindowFocus: true` + `refetchInterval: 5 * 60 * 1000` (5 Min wenn Fenster aktiv)
- Manueller "Refresh"-Button fur sofortige Aktualisierung
- Webhooks sind Overkill fur Single-User + erfordern offentlichen Endpoint (Coolify-Setup komplizierter)
- Bei 5000 req/h und ~20 Queries pro Refresh: 5-Minuten-Interval = ~240 Refreshes/h = ~4800 req/h → sicher im Limit
- Kritische Views (Token-Kosten) konnen kurzeres Interval bekommen

**Konsequenzen fur Sprint 1:**
- Kein Webhook-Setup nötig (spart Komplexität)
- React Query `defaultOptions` mit Smart-Polling-Config
- Refresh-Button in Header/Toolbar
- Optional: visuelle "Zuletzt aktualisiert"-Anzeige

---

## Entscheidung 5: Deployment-Setup (Coolify + Docker)

**Gewahlt:** Multi-stage Dockerfile, Standalone-Output, Coolify Git-Deploy

**Dockerfile-Struktur:**

```
Stage 1: deps      — bun install (cached layer)
Stage 2: builder   — bun run build (Next.js standalone output)
Stage 3: runner    — Node.js Alpine, nur standalone output + public + .next/static
```

**Details:**
- `output: 'standalone'` in `next.config.ts` — minimales Deployment-Bundle
- Bun fur Install + Build (schneller), Node.js Alpine fur Runtime (stabiler mit Next.js)
- `.dockerignore`: `node_modules`, `.git`, `*.md` (ausser public), `.env.local`
- Environment Variables via Coolify UI: `GITHUB_TOKEN`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- Health-Check: `GET /api/health` → 200 OK
- Port: 3000 (Coolify Reverse Proxy davor)

**Coolify Config:**
- Git-Source: GitHub Repository (auto-deploy on push to main)
- Build Command: Docker (Dockerfile im Root)
- Domain: dashboard.claude-agency.dev (oder ahnlich)
- SSL: Let's Encrypt via Coolify

**Konsequenzen fur Sprint 1:**
- `Dockerfile` und `.dockerignore` im Repo-Root von Tag 1
- `/api/health` Route implementieren
- `next.config.ts` mit `output: 'standalone'`
- Coolify-App anlegen und erstes Deployment testen (kann mit Placeholder-Page sein)

---

## Zusammenfassung der Stack-Entscheidungen

| Entscheidung | Gewahlt |
|--------------|---------|
| Caching | React Query + Server Components |
| GitHub API | GraphQL primary + REST fur Raw Content |
| Finance Parsing | REST Raw API + unified/remark serverseitig |
| Real-time | Smart Polling (5 Min) + manueller Refresh |
| Deployment | Multi-stage Docker, Standalone, Coolify Git-Deploy |

## Sprint-1-Implikationen

1. **Dependencies (Tag 1):** `@tanstack/react-query`, `@octokit/graphql`, `@octokit/rest`, `next-auth@5`, `unified`, `remark-parse`, `remark-gfm`
2. **Architektur-Layer:** API-Client-Abstraktion, Finance-Parser, Query-Key-System
3. **Infrastruktur:** Dockerfile, Coolify-App, Health-Check-Route
4. **Kein Backend nötig:** Alles lauft in Next.js API Routes + Server Components
