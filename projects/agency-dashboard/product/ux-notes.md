# UX Notes: Agency Dashboard

**Projekt:** agency-dashboard
**Autor:** CPO
**Datum:** 2026-03-24

---

## Seiten / Views

Das Dashboard ist eine **Single-Page-Application mit 3 Views**, erreichbar ueber eine minimale Top-Navigation:

### 1. Dashboard (Startseite / Default View)
Die zentrale Uebersicht. Alles was Oliver morgens braucht, auf einen Blick.

**Layout (von oben nach unten):**

```
+------------------------------------------------------------------+
|  HEADER: Budget-Status | Escalation-Badge | Zeitstempel          |
+------------------------------------------------------------------+
|                                                                    |
|  [Org-Chart]              |  [Projekt-Uebersicht]                |
|  Agent-Karten im Grid     |  Projekte mit Ampel + Progress       |
|  2-3 Spalten              |  Sortiert nach Risiko                |
|                            |                                      |
+----------------------------+--------------------------------------+
|                                                                    |
|  [Token-Kosten]                                                   |
|  Gesamtkosten + Pro-Agent-Aufschluesselung                        |
|  Budget-Balken mit Warnstufen                                     |
|                                                                    |
+------------------------------------------------------------------+
```

### 2. Standup View
Tagesansicht der Agent-Aktivitaeten.

**Layout:**
```
+------------------------------------------------------------------+
|  HEADER (identisch)                                               |
+------------------------------------------------------------------+
|                                                                    |
|  Zeitraum-Toggle: [24h] [7 Tage]                                 |
|                                                                    |
|  Agent A                                                          |
|  - 5 Commits, 3 Issues closed                                    |
|  - Letzte Commits als Einzeiler                                   |
|                                                                    |
|  Agent B                                                          |
|  - idle (keine Aktivitaet)                                        |
|                                                                    |
|  ...                                                               |
+------------------------------------------------------------------+
```

### 3. Escalations View
Detaillierte Escalation-Liste mit Filtern.

**Layout:**
```
+------------------------------------------------------------------+
|  HEADER (identisch, Escalation-Badge hervorgehoben)              |
+------------------------------------------------------------------+
|                                                                    |
|  Filter: [Alle] [P0] [P1] [P2] [Unbearbeitet]                   |
|                                                                    |
|  Escalation-Karten                                                |
|  - Severity-Badge | Titel | Datum | Agent/Projekt               |
|  - P0 immer oben, dann chronologisch                             |
|                                                                    |
+------------------------------------------------------------------+
```

### 4. Agent Erstellen (Modal, kein eigener View)
Oeffnet sich als Modal ueber dem aktuellen View. Kein Seitenwechsel noetig.

---

## Navigation

**Top-Navigation (horizontal, minimalistisch):**
```
[Dashboard]  [Standup]  [Escalations]        [+ Agent]
```

- 3 Views + 1 Action-Button
- Aktiver View ist unterstrichen (Signal Red)
- Kein Hamburger-Menu, kein Sidebar -- Oliver hat einen grossen Monitor
- "[+ Agent]" ist P2, wird erst in Sprint 2 sichtbar

**Keyboard-Shortcuts (nice-to-have, Sprint 2):**
- `1` = Dashboard
- `2` = Standup
- `3` = Escalations
- `N` = Neuer Agent

---

## Above the Fold -- Was Oliver sofort sieht

Beim Oeffnen des Dashboards (Default View) sind sofort sichtbar, ohne Scrollen:

1. **Budget-Status:** Aktueller Monatsverbrauch in EUR + Prozent (Header, links)
2. **Escalation-Badge:** Anzahl offener Escalations (Header, Mitte)
3. **Org-Chart:** Alle Agent-Karten mit Status-Farben (obere Haelfte)
4. **Projekt-Risiken:** Projekte mit roter Ampel (obere Haelfte, rechts)

**Designziel:** In 5 Sekunden weiss Oliver ob alles OK ist oder ob er handeln muss. Gruene Ampeln und kein Escalation-Badge = alles laeuft. Rote Elemente = sofort Attention.

---

## Farbkonzept

### Signal Red (#E53E3E) -- Aufmerksamkeit und Aktion

Wird eingesetzt fuer:
- **Escalation-Badges:** Offene P0-Escalations
- **Budget-Warnungen:** >80% und >95% Budget-Verbrauch
- **Agent-Status "Error":** Agent ist fehlgeschlagen oder unresponsive
- **Risiko-Ampel "Rot":** Projekt liegt deutlich hinter Zeitplan
- **Primaere CTAs:** "Agent Erstellen"-Button, kritische Aktionen
- **Aktive Navigation:** Unterstreichung des aktiven Views

**Regel:** Signal Red wird NUR fuer Dinge verwendet die Aufmerksamkeit erfordern. Kein dekorativer Einsatz. Wenn alles laeuft, ist kaum Rot auf der Seite.

### Void Black -- Fokus durch Reduktion

Wird eingesetzt fuer:
- **Page Background:** #0A0A0A (nicht reines Schwarz, leicht aufgehellt)
- **Card Backgrounds:** #141414 (leichter Kontrast zum Page Background)
- **Navigation Background:** #0A0A0A (verschmilzt mit Page)

**Kontrast-Konzept:**
```
Ebene 0 (Page):    #0A0A0A  -- tiefster Hintergrund
Ebene 1 (Cards):   #141414  -- leicht angehoben, subtle Border #1E1E1E
Ebene 2 (Hover):   #1E1E1E  -- Interaktions-Feedback
Ebene 3 (Modal):   #1A1A1A  -- Modal-Background mit Overlay
```

### Weitere Farben

| Farbe | Hex | Einsatz |
|-------|-----|---------|
| Weiss | #F7F7F7 | Primaerer Text |
| Grau 400 | #9CA3AF | Sekundaerer Text, Timestamps |
| Grau 600 | #4B5563 | Borders, Dividers |
| Gruen | #38A169 | Positiver Status (active, on-track, budget OK) |
| Gelb | #D69E2E | Warnung (Risiko mittel, Budget 80%) |
| Signal Red | #E53E3E | Kritisch (siehe oben) |

---

## Typografie

- **Monospace fuer Daten:** Agent-Namen, Commit-Messages, Token-Zahlen
- **Sans-Serif fuer UI:** Navigation, Labels, Ueberschriften (Inter oder System-Font)
- **Keine Web-Fonts von externen CDNs** (DSGVO) -- self-hosted oder System-Stack

---

## Responsive-Verhalten

**Nicht im MVP-Scope.** Desktop-only, optimiert fuer 1920x1080+. Oliver arbeitet am Schreibtisch mit grossem Monitor.

Minimale Viewport-Breite: 1280px. Darunter kein Support.

---

## Ladeverhalten

- **Initial Load:** Skeleton-Screen mit Void-Black-Karten und Pulse-Animation
- **Daten-Update:** ISR (Incremental Static Regeneration) alle 5 Minuten
- **Manueller Refresh:** Kein Pull-to-Refresh. Browser-Reload reicht.
- **Fehler-State:** Wenn GitHub API nicht erreichbar: Letzte gecachte Daten anzeigen + Banner "Daten von [Zeitstempel] -- GitHub API nicht erreichbar"
