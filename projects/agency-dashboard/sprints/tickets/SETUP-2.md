# SETUP-2: GitHub OAuth Integration (next-auth v5, nur Oliver)

**Sprint:** 1
**Owner:** Senior FE React
**Priority:** P0
**Deadline:** 2026-03-31
**Estimate:** Mittel: 2-4h

## Beschreibung

GitHub OAuth via next-auth v5 einrichten. Einziger Nutzer ist Oliver — kein öffentlicher Signup. Der GitHub Access Token muss sicher in der JWT-Session gespeichert und serverseitig für alle API-Calls verfügbar sein. Kein Token darf ins Client-Bundle gelangen.

## Technische Details

- next-auth v5 mit GitHub OAuth Provider laut ADR-001 und ADR-002
- OAuth Scope: `repo` (Read-Access auf private Repos)
- Session-Strategie: JWT (kein DB nötig laut ADR-002)
- Token-Flow laut ADR-002: `accessToken` in JWT-Session → Server Components / API Routes lesen Token → Weitergabe an Octokit-Clients
- Single-User-Absicherung: `callbacks.signIn` prüft, dass nur Olivers GitHub-Login zugelassen wird (via `ALLOWED_GITHUB_LOGIN` Environment Variable)
- Token nie im Client-Bundle — alle API-Calls laufen über Next.js API Routes als Proxy
- Session-Expiry: GitHub Token Lifetime (8 Stunden)
- `NEXTAUTH_SECRET` und `NEXTAUTH_URL` als Required Env Vars
- Middleware: Alle Routen außer `/api/auth/*` und `/login` erfordern aktive Session → Redirect zu GitHub OAuth falls nicht eingeloggt

## Acceptance Criteria

- [ ] Login via GitHub OAuth funktioniert
- [ ] Nur Olivers GitHub-Account kann sich einloggen (anderen wird Zugang verweigert)
- [ ] `accessToken` ist in der JWT-Session verfügbar und in Server Components lesbar
- [ ] `accessToken` ist nicht im Client-Bundle oder in Browser DevTools Network-Tab sichtbar
- [ ] Unauthentifizierter Zugriff auf `/` wird zu Login-Seite redirected
- [ ] Logout funktioniert und Session wird invalidiert
- [ ] Code ist TypeScript strict — kein `any`
- [ ] Tests: Playwright Visual Baseline der Login-Seite

## Definition of Done

- [ ] PR ist geöffnet mit Label: sprint-1
- [ ] Review durch VP Engineering (self-review ok für Sprint 1)
- [ ] Kein PII in Logs (DSGVO)
- [ ] TypeScript strict — keine Compiler-Fehler
