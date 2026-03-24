# SETUP-4: Playwright-Baseline einrichten (leere Seite als Baseline)

**Sprint:** 1
**Owner:** QA Lead
**Priority:** P0
**Deadline:** 2026-04-01
**Estimate:** Klein: <2h

## Beschreibung

Playwright-Testing-Infrastruktur aufsetzen und erste Screenshot-Baseline für die leere Dashboard-Startseite erstellen. Diese Baseline dient als Referenz für alle nachfolgenden Visual Regression Tests in Sprint 1.

## Technische Details

- Playwright mit `@playwright/test` als Dev-Dependency installieren
- `playwright.config.ts` im Projekt-Root konfigurieren: Baseurl `http://localhost:3000`, Browser: Chromium (primary), Viewport: 1440x900
- Screenshot-Verzeichnis: `tests/screenshots/baseline/`
- Visual Regression via `toHaveScreenshot()` — Threshold: 0.1 (10% Pixel-Differenz toleriert)
- Test-Datei: `tests/visual/baseline.spec.ts` — Screenshot der leeren `/`-Route nach OAuth-Mock
- CI-Modus: `--update-snapshots` nur explizit, nie automatisch
- `bun run test:visual` als Script in `package.json`
- Abhängigkeit: Benötigt laufenden Dev-Server (SETUP-1 und SETUP-2 müssen abgeschlossen sein)
- Auth-Mock für Tests: Playwright `storageState` mit gemockter Session, damit Tests nicht echten OAuth-Flow durchlaufen

## Acceptance Criteria

- [ ] `bun run test:visual` läuft durch ohne Fehler
- [ ] Screenshot-Baseline für leere Dashboard-Seite ist committed unter `tests/screenshots/baseline/`
- [ ] Playwright-Config ist mit korrekter Baseurl konfiguriert
- [ ] Auth-Mock (storageState) funktioniert — Tests können Dashboard-Routes ohne echten OAuth öffnen
- [ ] `toHaveScreenshot()` schlägt an wenn sich die Seite visuell ändert
- [ ] Code ist TypeScript strict — kein `any`

## Definition of Done

- [ ] PR ist geöffnet mit Label: sprint-1
- [ ] Review durch VP Engineering (self-review ok für Sprint 1)
- [ ] Kein PII in Logs (DSGVO)
- [ ] TypeScript strict — keine Compiler-Fehler
