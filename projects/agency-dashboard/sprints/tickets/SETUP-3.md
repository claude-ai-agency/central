# SETUP-3: GitHub API Client (REST + GraphQL wrapper, Rate-Limit-Handling)

**Sprint:** 1
**Owner:** Senior BE Python
**Priority:** P0
**Deadline:** 2026-03-31
**Estimate:** Groß: 4-8h

## Beschreibung

Abstraktions-Layer über den GitHub REST und GraphQL APIs bauen. Dieser Client wird von allen Features (F1, F2, F3) genutzt. Er muss Rate Limits erkennen, korrekt reagieren, und den Auth-Token sicher aus der next-auth Session beziehen — ohne ihn je ins Client-Bundle zu exponieren.

## Technische Details

- `@octokit/graphql` für GraphQL-Queries (verschachtelte Reads: Org-Chart, Projekte) laut ADR-001
- `@octokit/rest` für REST Raw Content (`_finance/*.md`, Raw File Fetches) laut ADR-001
- Beide Clients erhalten `accessToken` aus next-auth Session — Server-side only (API Routes / Server Components) laut ADR-002
- Rate-Limit-Middleware laut ADR-002:
  - `x-ratelimit-remaining < 100`: Polling-Interval verdoppeln, Warning loggen (kein PII)
  - `x-ratelimit-remaining === 0`: `RateLimitError` werfen, alle Fetches pausieren
  - HTTP 403 mit `rate limit exceeded`: sofort pausieren
- Fehlertypen laut ADR-002: `GitHubApiError` mit `status` und `rateLimitRemaining`
- Backoff-Strategie: remaining < 500 normal, < 100 Interval verdoppeln, === 0 pausieren mit Countdown
- HTTP 401 → Redirect zu Login (kein Retry)
- HTTP 404 → Graceful Fallback (Datei existiert nicht → leeres Array/null)
- HTTP 500+ → Retry max 3x mit Exponential Backoff
- Query-Key-Konvention aus ADR-002 in `lib/query-keys.ts` definieren
- Client-Module: `lib/github-graphql.ts`, `lib/github-rest.ts`, `lib/github-client.ts` (Facade)

## Acceptance Criteria

- [ ] `lib/github-graphql.ts` exportiert typisierte GraphQL-Query-Funktion
- [ ] `lib/github-rest.ts` exportiert typisierte REST Raw-Content-Funktion
- [ ] Rate-Limit-Header werden bei jedem Response ausgewertet
- [ ] `RateLimitError` wird korrekt geworfen wenn `remaining === 0`
- [ ] HTTP 401 führt zu Auth-Redirect, nicht zu Retry
- [ ] HTTP 404 liefert `null` / leeres Ergebnis (kein Crash)
- [ ] `lib/query-keys.ts` mit vollständiger Query-Key-Struktur aus ADR-002
- [ ] Kein `accessToken` taucht in Logs auf (DSGVO / Security)
- [ ] Code ist TypeScript strict — kein `any`

## Definition of Done

- [ ] PR ist geöffnet mit Label: sprint-1
- [ ] Review durch VP Engineering (self-review ok für Sprint 1)
- [ ] Kein PII in Logs (DSGVO)
- [ ] TypeScript strict — keine Compiler-Fehler
