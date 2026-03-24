# SETUP-1: Next.js 15 Projekt-Init (TypeScript strict, Tailwind, ESLint)

**Sprint:** 1
**Owner:** Senior FE React
**Priority:** P0
**Deadline:** 2026-03-31
**Estimate:** Mittel: 2-4h

## Beschreibung

Next.js 15 App Router Projekt von Grund auf aufsetzen mit TypeScript strict mode, Tailwind CSS, ESLint-Konfiguration, Multi-stage Dockerfile, und allen Sprint-1-Dependencies. Ziel ist ein lauffähiges Grundgerüst das direkt auf Coolify deploybar ist.

## Technische Details

- Next.js 15 App Router, `output: 'standalone'` in `next.config.ts` laut ADR-001
- TypeScript strict mode: `"strict": true`, `"noImplicitAny": true` in `tsconfig.json`
- Tailwind CSS mit Farbpalette: Signal Red (`#FF0000` oder projektspezifisch), Void Black
- Dependencies von Tag 1 laut ADR-001: `@tanstack/react-query`, `@octokit/graphql`, `@octokit/rest`, `next-auth@5`, `unified`, `remark-parse`, `remark-gfm`
- QueryClientProvider im Root-Layout (`app/layout.tsx`)
- Multi-stage Dockerfile laut ADR-001: Stage 1 deps (bun install), Stage 2 builder (bun run build), Stage 3 runner (Node.js Alpine)
- `.dockerignore`: `node_modules`, `.git`, `*.md` (ausser public), `.env.local`
- Health-Check Route: `GET /api/health` → `{ status: 'ok' }` mit HTTP 200
- Environment Variables dokumentiert: `GITHUB_TOKEN`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

## Acceptance Criteria

- [ ] `bun run dev` startet ohne Fehler
- [ ] `bun run build` kompiliert ohne TypeScript-Fehler
- [ ] `GET /api/health` antwortet mit `200 { status: 'ok' }`
- [ ] `Dockerfile` baut erfolgreich durch alle 3 Stages
- [ ] QueryClientProvider ist im Root-Layout konfiguriert mit `staleTime: 5min` Default
- [ ] Tailwind CSS ist konfiguriert, Signal Red und Void Black als Custom Colors definiert
- [ ] ESLint läuft ohne Fehler (`bun run lint`)
- [ ] Code ist TypeScript strict — kein `any`

## Definition of Done

- [ ] PR ist geöffnet mit Label: sprint-1
- [ ] Review durch VP Engineering (self-review ok für Sprint 1)
- [ ] Kein PII in Logs (DSGVO)
- [ ] TypeScript strict — keine Compiler-Fehler
