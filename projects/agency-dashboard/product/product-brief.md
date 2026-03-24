# Product Brief: Agency Dashboard

**Projekt:** agency-dashboard
**Autor:** CPO
**Datum:** 2026-03-24
**Status:** Draft
**MVP-Deadline:** 2026-04-21

---

## Problem Statement

Oliver betreibt eine KI-Agentur mit mehreren autonomen Agents, Projekten und laufenden Token-Kosten. Aktuell muss er sich den Status manuell zusammensuchen: GitHub Repos durchklicken, Commit-Logs lesen, Token-Kosten schätzen, Escalations in Markdown-Files suchen. Das kostet jeden Morgen 15-20 Minuten und erfordert mentalen Context-Switch zwischen 5+ Tabs.

**Kern-Pain-Points:**
1. **Kein Gesamtbild:** Agent-Status, Projekt-Fortschritt und Kosten leben in verschiedenen GitHub-Repos ohne zentrale Sicht
2. **Escalations gehen unter:** Board-Escalations sind in Markdown-Files vergraben -- keine Push-Sichtbarkeit
3. **Token-Kosten sind intransparent:** Budget von EUR 100/Monat, aber kein Echtzeit-Tracking pro Agent
4. **Kein Daily Standup Feed:** Was gestern passiert ist, erfordert manuelles Git-Log-Lesen
5. **ADHS-feindlicher Workflow:** Viele Tabs, viele Quellen, hohe kognitive Last -- Gift fuer Fokus

---

## Zielgruppe

**Oliver Hees** -- einziger User. Kein Multi-User-Szenario.

**Workflow:**
- Morgens 09:00: Dashboard oeffnen, Gesamtstatus in <30 Sekunden erfassen
- Escalations pruefen, ggf. Direktive geben
- Token-Budget checken -- noch im Rahmen?
- In 5 Minuten wieder weg, zurueck zur eigentlichen Arbeit

**Profil:**
- 20 Jahre Softwareentwicklung, Tech-Stack-Entscheidungen trifft er selbst
- ADHS: Braucht sofortige Klarheit, keine verschachtelten Navigationen
- Hasst Buzzwords, liebt Praezision
- Prueft morgens, entscheidet schnell, delegiert sofort

---

## Value Proposition

Das Agency Dashboard ersetzt den taeglichen 15-Minuten-GitHub-Rundgang durch eine einzige Seite, die in 30 Sekunden die drei kritischen Fragen beantwortet:

1. **Laeuft alles?** (Org-Chart mit Agent-Status)
2. **Brennt etwas?** (Escalations, Risiken)
3. **Was kostet es?** (Token-Verbrauch pro Agent)

**Besser als manuelles GitHub-Checken weil:**
- Eine Seite statt 5+ Tabs
- Escalations sind sofort sichtbar, nicht in Files versteckt
- Token-Kosten aggregiert statt geschaetzt
- Daily Standup ohne jeden Commit einzeln zu lesen
- ADHS-optimiert: Information above the fold, kein Scrollen noetig

---

## MVP Scope

### IN (6 Features)

| # | Feature | Beschreibung | Sprint |
|---|---------|-------------|--------|
| F1 | Org-Chart Live | Alle Agents mit aktuellem Status, Rolle und Budget-Anteil | 1 |
| F2 | Projekt-Uebersicht | Progress-Tracking, ETA, Risiko-Ampel pro Projekt | 1 |
| F3 | Token-Kosten Echtzeit | Kosten pro Agent, Tages-/Monatsaggregation, Budget-Warnung | 1 |
| F4 | Board Escalations | Escalations aus Board-Decisions sofort sichtbar, mit Severity | 2 |
| F5 | Daily Standup Feed | Aggregierter Feed: Was hat jeder Agent gestern gemacht? | 2 |
| F6 | Agent Spawnen | Neuen Agent direkt aus dem Dashboard erstellen | 2 (P2) |

### OUT (nicht im MVP)

- **Multi-User / Rollen:** Nur Oliver. Kein Auth-Management.
- **Mobile-Optimierung:** Desktop-first. Oliver arbeitet am Schreibtisch.
- **Eigene Datenbank:** GitHub ist die einzige Wahrheitsquelle. Kein eigenes Backend.
- **Externe Integrationen:** Kein Slack, kein Linear, kein Email. Nur GitHub.
- **Historische Analytics:** Kein Trend-Dashboard. Aktueller Status reicht fuer MVP.
- **Chat/Messaging mit Agents:** Kein Interaktions-Layer. Direktiven laufen ueber Git.

---

## Success Metrics

| Metrik | Ziel | Messung |
|--------|------|---------|
| Morning Check Zeit | <2 Minuten (von 15-20 Min) | Oliver-Feedback nach 1 Woche |
| Dashboard Load Time | <3 Sekunden | Lighthouse / Playwright |
| Escalation Sichtbarkeit | 100% der Board-Escalations sichtbar | Manueller Abgleich mit Git |
| Token-Budget Transparenz | Abweichung <5% zu realen Kosten | Vergleich mit Anthropic-Rechnung |
| Taegliche Nutzung | Oliver oeffnet Dashboard min. 5x/Woche | Selbstreport |

---

## Design-Prinzipien

### Signal Red (#E53E3E) + Void Black

**Warum diese Aesthetik?**

- **Signal Red** steht fuer Aufmerksamkeit und Dringlichkeit. In einem Management-Dashboard ist Rot die natuerliche Farbe fuer: Escalations, Budget-Warnungen, fehlgeschlagene Agents, Risiko-Ampeln. Es ist nicht dekorativ -- es ist funktional.
- **Void Black** als Hintergrund reduziert visuelle Ablenkung auf null. Information steht im Vordergrund, nicht Chrome oder Dekoration. Fuer einen ADHS-optimierten Workflow ideal: weniger Stimuli, mehr Signal.
- **Kontrast:** Weisser Text auf schwarzem Grund mit roten Akzenten erzeugt eine Command-Center-Aesthetik. Oliver ist Entwickler -- Terminal-Look fuehlt sich natuerlich an.

**Einsatz:**
- Signal Red: Alerts, Warnungen, kritische Status-Indikatoren, primaere CTAs
- Void Black: Hintergrund, Card-Backgrounds, Navigation
- Weiss/Grau: Text, sekundaere Information, Borders
- Gruen (#38A169): Positive Status (Agent aktiv, Budget OK, Projekt on-track)

---

## Constraints

| Constraint | Detail |
|-----------|--------|
| **Datenquelle** | Ausschliesslich GitHub API (REST + GraphQL). Keine eigene DB. |
| **Auth** | GitHub OAuth, hardcoded auf Olivers GitHub-Account. Kein Multi-User. |
| **Hosting** | Hetzner Cloud + Coolify. Kein AWS, kein GCP. EU-only. |
| **DSGVO** | Keine externen Analytics, kein Tracking, keine Cookies ausser Auth-Session. Kein Google Fonts, kein CDN ausserhalb EU. |
| **Tech-Stack** | Next.js 15, TypeScript strict, Tailwind CSS. Vorgegeben, nicht verhandelbar. |
| **Performance** | Dashboard-Load <3 Sekunden. GitHub API Caching via ISR/SWR. |
| **Budget** | EUR 100/Monat Token-Kosten fuer die gesamte Agentur. Dashboard selbst: minimal. |
| **Tests** | Playwright Visual Tests mandatory fuer alle UI-Features. |
| **Timeline** | MVP bis 2026-04-21. Sprint 1 startet 2026-03-31. |
