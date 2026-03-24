# ADR-002: GitHub API Strategy — Agency Dashboard

**Status:** Accepted
**Datum:** 2026-03-24
**Entscheider:** CTO
**Auftrag:** DIR-001
**Abhangigkeit:** ADR-001

---

## Kontext

Das Agency Dashboard nutzt GitHub als einzige Datenquelle. Alle Agentur-Daten (Agents, Projekte, Budgets, Standup-Feeds) liegen als Dateien, Issues, Labels und Commits im Repository. Wir mussen effizient mit den GitHub API Rate Limits umgehen:

- **REST API:** 5000 Requests/Stunde (authenticated)
- **GraphQL API:** 5000 Punkte/Stunde (authenticated, Kosten pro Query variabel)
- **Single User:** Nur Oliver's Token — kein Load-Balancing uber mehrere Tokens

---

## API-Zuordnung nach Feature

### F1: Org-Chart (Agents, Status, Budget)

**Datenquellen:**
- Agent-Profile: `_org/agents/*.md` oder `.claude/skills/ki-agency/references/agent-profiles/*.md`
- Agent-Status: GitHub Issues mit Label `agent-status` oder Convention aus Dateien
- Budget pro Agent: `_finance/hiring-budget.md`, `_finance/projects.md`

**API-Strategie: GraphQL + REST**

```graphql
# GraphQL: Repo-Inhalt eines Verzeichnisses laden (1 Request)
query OrgChart {
  repository(owner: "owner", name: "central") {
    agentProfiles: object(expression: "main:_org/agents") {
      ... on Tree {
        entries { name, object { ... on Blob { text } } }
      }
    }
  }
}
```

```
# REST: Finance-Files als Raw Content
GET /repos/{owner}/{repo}/contents/_finance/hiring-budget.md
GET /repos/{owner}/{repo}/contents/_finance/projects.md
```

**Kosten:** ~1 GraphQL-Punkt + 2 REST-Requests pro Refresh
**Cache:** staleTime 5 Minuten

---

### F2: Projekt-Ubersicht (Progress, ETA, Risiko)

**Datenquellen:**
- Projektdaten: `projects/*/brief.md`, `projects/*/kickoff.md`
- Sprint-Status: `projects/*/sprints/*.md`
- Issues/PRs: GitHub Issues API mit Label-Filtering

**API-Strategie: GraphQL**

```graphql
# Projektdateien + Issues in einem Request
query ProjectOverview {
  repository(owner: "owner", name: "central") {
    # Projekt-Verzeichnisse
    projects: object(expression: "main:projects") {
      ... on Tree {
        entries {
          name
          object {
            ... on Tree {
              entries { name, object { ... on Blob { text } } }
            }
          }
        }
      }
    }
    # Issues mit Projekt-Labels
    issues(first: 50, labels: ["agency-dashboard"], states: OPEN, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        title, number, state, labels(first: 10) { nodes { name, color } }
        assignees(first: 5) { nodes { login } }
        updatedAt, createdAt
      }
    }
  }
}
```

**Kosten:** ~1-2 GraphQL-Punkte pro Refresh
**Cache:** staleTime 5 Minuten

---

### F3: Token-Kosten pro Agent (Echtzeit)

**Datenquellen:**
- `_finance/projects.md` — Budget-Tracking-Tabellen
- `_finance/hiring-budget.md` — Agent-Budget-Limits
- Potentiell: `_finance/token-log-YYYY-MM.md` (falls eingefuhrt)

**API-Strategie: REST Raw Content**

```
GET /repos/{owner}/{repo}/contents/_finance/projects.md
  Accept: application/vnd.github.raw+json

GET /repos/{owner}/{repo}/contents/_finance/hiring-budget.md
  Accept: application/vnd.github.raw+json
```

**Begrundung:** Raw Content API liefert direkt den Markdown-Text (kein Base64). Serverseitiger Parser (unified/remark) extrahiert die Tabellen zu typisierten Objekten.

**Parsing-Pipeline:**
1. Fetch Raw Markdown via REST
2. Parse mit `unified().use(remarkParse).use(remarkGfm)`
3. Walk AST, finde `table`-Nodes
4. Extrahiere Zeilen zu `BudgetEntry[]` TypeScript-Objekten
5. Cache via React Query (staleTime: 10 Minuten — Budget andert sich selten)

**Kosten:** 2 REST-Requests pro Refresh
**Cache:** staleTime 10 Minuten (Budget-Daten sind weniger volatil)

---

### F4: Board Escalations (Sprint 2)

**Datenquellen:**
- Issues mit Label `escalation` oder `board-attention`
- `_org/ceo-directives/*.md`

**API-Strategie: GraphQL**

```graphql
query Escalations {
  repository(owner: "owner", name: "central") {
    issues(first: 20, labels: ["escalation"], states: OPEN) {
      nodes { title, number, body, createdAt, labels(first: 5) { nodes { name } } }
    }
    directives: object(expression: "main:_org/ceo-directives") {
      ... on Tree {
        entries { name, object { ... on Blob { text } } }
      }
    }
  }
}
```

**Kosten:** ~1 GraphQL-Punkt
**Cache:** staleTime 2 Minuten (Escalations sind zeitkritisch)

---

### F5: Daily Standup Feed (Sprint 2)

**Datenquellen:**
- Commits der letzten 24h (Commit-Messages mit Agent-Prefix `[CTO]`, `[CEO]`, etc.)
- Issues mit Label `standup`

**API-Strategie: GraphQL**

```graphql
query StandupFeed($since: GitTimestamp!) {
  repository(owner: "owner", name: "central") {
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 50, since: $since) {
            nodes { message, committedDate, author { name, email } }
          }
        }
      }
    }
  }
}
```

**Kosten:** ~1 GraphQL-Punkt
**Cache:** staleTime 5 Minuten

---

### F6: Agent Spawnen aus UI (Sprint 2, P2)

**Datenquellen/Actions:**
- GitHub Actions Workflow Dispatch (REST)
- Oder: Issue erstellen mit speziellem Label → Automation

**API-Strategie: REST (Write-Operation)**

```
POST /repos/{owner}/{repo}/dispatches
{
  "event_type": "spawn-agent",
  "client_payload": { "role": "senior-fe-react", "task": "..." }
}
```

**Alternativ:** Issue erstellen mit Label `agent-spawn-request`

**Kosten:** 1 REST-Request pro Spawn
**Cache:** Nicht applicable (Write-Operation)

---

## Rate Limit Handling

### Budget-Rechnung (Worst Case, aktives Browsen)

| Quelle | Requests/Refresh | Interval | Requests/Stunde |
|--------|-----------------|----------|-----------------|
| F1 Org-Chart (GraphQL) | 1 | 5 min | 12 |
| F1 Finance (REST) | 2 | 5 min | 24 |
| F2 Projekte (GraphQL) | 1 | 5 min | 12 |
| F3 Token-Kosten (REST) | 2 | 10 min | 12 |
| F4 Escalations (GraphQL) | 1 | 2 min | 30 |
| F5 Standup (GraphQL) | 1 | 5 min | 12 |
| **Gesamt GraphQL** | | | **~66 Punkte/h** |
| **Gesamt REST** | | | **~36 Requests/h** |

**Ergebnis:** Weit unter den Limits (66/5000 GraphQL, 36/5000 REST). Selbst bei aggressiverem Polling (1 Min) bleiben wir bei ~400/5000 — komfortabel.

### Rate Limit Headers auswerten

Jede GitHub API Response enthalt:
- `x-ratelimit-remaining` — verbleibende Requests
- `x-ratelimit-reset` — Unix-Timestamp wann Reset

**Implementierung:**
```typescript
// Middleware in API-Client-Layer
function checkRateLimit(headers: Headers): void {
  const remaining = parseInt(headers.get('x-ratelimit-remaining') ?? '5000');
  const resetAt = parseInt(headers.get('x-ratelimit-reset') ?? '0') * 1000;

  if (remaining < 100) {
    console.warn(`GitHub Rate Limit low: ${remaining} remaining, resets at ${new Date(resetAt)}`);
    // Polling-Interval automatisch erhohen
  }

  if (remaining === 0) {
    const waitMs = resetAt - Date.now();
    throw new RateLimitError(`Rate limit exceeded. Resets in ${Math.ceil(waitMs / 1000)}s`);
  }
}
```

### Backoff-Strategie

1. **remaining < 500:** Normal weiter
2. **remaining < 100:** Polling-Interval verdoppeln, Warning in UI
3. **remaining === 0:** Alle Fetches pausieren, Countdown in UI anzeigen
4. **403 mit `rate limit exceeded`:** Sofort pausieren, auf Reset warten

---

## Caching-Layer Konzept

### Architektur

```
Browser Tab
  └── React Query Cache (In-Memory)
        ├── queryKey: ['org-chart']        → staleTime: 5 min
        ├── queryKey: ['projects']          → staleTime: 5 min
        ├── queryKey: ['finance', 'budget'] → staleTime: 10 min
        ├── queryKey: ['escalations']       → staleTime: 2 min
        └── queryKey: ['standup', date]     → staleTime: 5 min
```

### Query Key Convention

```typescript
const queryKeys = {
  orgChart: ['org-chart'] as const,
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
  },
  finance: {
    budget: ['finance', 'budget'] as const,
    tokenCosts: ['finance', 'token-costs'] as const,
  },
  escalations: ['escalations'] as const,
  standup: (date: string) => ['standup', date] as const,
} as const;
```

### Cache Invalidation

- **Manueller Refresh:** `queryClient.invalidateQueries()` — alles neu laden
- **Feature-spezifisch:** `queryClient.invalidateQueries({ queryKey: queryKeys.finance.budget })`
- **Nach Write-Operationen (F6):** Automatisch relevante Queries invalidieren
- **Window Focus:** React Query `refetchOnWindowFocus: true` (Default)

---

## Fehlerbehandlung

### Error-Typen

| Fehler | HTTP Status | Handling |
|--------|-------------|----------|
| Rate Limit | 403 + `rate limit exceeded` | Backoff, UI-Warning, Countdown |
| Not Found | 404 | Graceful Fallback (Datei existiert nicht) |
| Auth Expired | 401 | Redirect zu Login |
| Server Error | 500+ | Retry (3x mit Exponential Backoff) |
| Network Error | — | Offline-Banner, cached Daten zeigen |

### Error Boundary Pattern

```typescript
// Globaler Error Handler fur GitHub API
class GitHubApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public rateLimitRemaining?: number,
  ) {
    super(message);
  }
}

// React Query Global Error Handler
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof GitHubApiError) {
          if (error.status === 403) return false; // Rate limit — nicht retrien
          if (error.status === 401) return false; // Auth — nicht retrien
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 Minuten Default
      refetchOnWindowFocus: true,
    },
  },
});
```

### UI-Feedback

- **Loading:** Skeleton-Components (kein Spinner)
- **Error:** Inline-Error mit "Retry"-Button
- **Rate Limit:** Banner oben: "GitHub Rate Limit erreicht. Automatischer Retry in X Sekunden."
- **Stale Data:** Dezenter Hinweis "Zuletzt aktualisiert vor X Minuten"

---

## Authentifizierung

### next-auth v5 Setup

```typescript
// Single-Provider: GitHub OAuth
// Scope: repo (read access to private repos)
// Session-Strategy: JWT (kein DB nötig)
// Token-Weitergabe: accessToken in Session fur API-Calls
```

### Token-Flow

1. Oliver loggt sich via GitHub OAuth ein
2. `accessToken` wird in JWT-Session gespeichert
3. Server Components / API Routes lesen Token aus Session
4. Token wird an Octokit-Clients weitergegeben
5. Kein Token im Client-Bundle — alle API-Calls laufen uber Next.js API Routes

### Sicherheit

- Access Token nie im Client-Bundle exponiert
- API Routes als Proxy zwischen Client und GitHub API
- `NEXTAUTH_SECRET` als Environment Variable in Coolify
- Session-Expiry: GitHub Token Lifetime (8 Stunden Default)

---

## Zusammenfassung

| Aspekt | Entscheidung |
|--------|-------------|
| Primary API | GraphQL fur verschachtelte Reads |
| Secondary API | REST fur Raw Content + Write Ops |
| Rate Limit Budget | ~100/5000 pro Stunde (2% Auslastung) |
| Caching | React Query, feature-spezifische staleTime |
| Error Handling | Typed Errors, Backoff, UI-Feedback |
| Auth Token Flow | Server-side only, nie im Client |
