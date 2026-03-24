# User Stories: Agency Dashboard

**Projekt:** agency-dashboard
**Autor:** CPO
**Datum:** 2026-03-24

---

## F1: Org-Chart Live

**US-1: Agent-Uebersicht auf einen Blick**
Als Oliver
moechte ich alle aktiven Agents mit Name, Rolle und Status auf einer Seite sehen
damit ich in <10 Sekunden weiss, wer gerade laeuft und wer nicht.

Acceptance Criteria:
- [ ] AC-1: Alle Agents aus der GitHub-Org werden angezeigt (Name, Rolle, Status: active/idle/error)
- [ ] AC-2: Status wird farbcodiert dargestellt (Gruen=active, Grau=idle, Rot=error)
- [ ] AC-3: Die Daten sind maximal 5 Minuten alt (ISR/Cache)
- [ ] AC-4: Kein Scrollen noetig bei bis zu 10 Agents

Priority: P0
Sprint: 1
Playwright-Test: Ja -- Screenshot-Vergleich der Agent-Karten mit verschiedenen Status-Zustaenden

---

**US-2: Budget-Anteil pro Agent**
Als Oliver
moechte ich pro Agent den anteiligen Token-Verbrauch am Gesamtbudget sehen
damit ich erkennen kann, welcher Agent ueberproportional Kosten verursacht.

Acceptance Criteria:
- [ ] AC-1: Jede Agent-Karte zeigt den prozentualen Anteil am Monatsbudget
- [ ] AC-2: Agents ueber 30% Budget-Anteil werden visuell hervorgehoben (Signal Red)
- [ ] AC-3: Tooltip oder Detail-View zeigt absolute Kosten in EUR

Priority: P0
Sprint: 1
Playwright-Test: Ja -- Verifizierung der Budget-Anzeige und Highlight-Schwelle

---

## F2: Projekt-Uebersicht

**US-3: Projekt-Status Dashboard**
Als Oliver
moechte ich alle laufenden Projekte mit Fortschritt, ETA und Risiko-Bewertung sehen
damit ich weiss, ob Deadlines gehalten werden oder ich eingreifen muss.

Acceptance Criteria:
- [ ] AC-1: Jedes Projekt zeigt: Name, Sprint, Fortschritt (%), ETA, Risiko-Ampel (gruen/gelb/rot)
- [ ] AC-2: Fortschritt wird aus GitHub Issues/Milestones abgeleitet (closed/total)
- [ ] AC-3: Projekte mit Risiko "rot" stehen oben (Sortierung nach Dringlichkeit)
- [ ] AC-4: Klick auf Projekt fuehrt zu Detail-View mit Issue-Liste

Priority: P0
Sprint: 1
Playwright-Test: Ja -- Screenshot-Vergleich mit verschiedenen Risiko-Zustaenden

---

**US-4: Projekt-Risiko-Erkennung**
Als Oliver
moechte ich automatisch gewarnt werden, wenn ein Projekt hinter dem Zeitplan liegt
damit ich frueh gegensteuern kann statt am Deadline-Tag ueberrascht zu werden.

Acceptance Criteria:
- [ ] AC-1: Risiko-Ampel wird automatisch berechnet: >80% on-track = gruen, 50-80% = gelb, <50% = rot
- [ ] AC-2: Berechnung basiert auf: (abgeschlossene Issues / geplante Issues) vs. (verstrichene Sprint-Zeit / Sprint-Dauer)
- [ ] AC-3: Rote Projekte erzeugen einen visuellen Alert im Dashboard-Header

Priority: P1
Sprint: 1
Playwright-Test: Ja -- Verifizierung der Ampel-Logik mit Edge Cases (0%, 50%, 100%)

---

## F3: Token-Kosten Echtzeit

**US-5: Token-Kosten-Uebersicht**
Als Oliver
moechte ich die Token-Kosten pro Agent und gesamt auf Tages- und Monatsbasis sehen
damit ich das EUR 100/Monat Budget im Blick behalte.

Acceptance Criteria:
- [ ] AC-1: Gesamtkosten (Monat) prominent sichtbar im Dashboard-Header
- [ ] AC-2: Aufschluesselung pro Agent mit Kosten in EUR und Token-Anzahl
- [ ] AC-3: Tagesansicht und Monatsansicht umschaltbar
- [ ] AC-4: Daten werden aus GitHub-gespeicherten Token-Logs aggregiert

Priority: P0
Sprint: 1
Playwright-Test: Ja -- Verifizierung der Kostenanzeige und Aggregationslogik

---

**US-6: Budget-Warnung**
Als Oliver
moechte ich eine deutliche Warnung sehen, wenn die Token-Kosten 80% des Monatsbudgets ueberschreiten
damit ich rechtzeitig gegensteuern kann, bevor das Budget aufgebraucht ist.

Acceptance Criteria:
- [ ] AC-1: Bei >80% Budget-Verbrauch: gelber Banner im Dashboard-Header
- [ ] AC-2: Bei >95% Budget-Verbrauch: roter Banner mit Signal Red
- [ ] AC-3: Banner zeigt: aktueller Verbrauch in EUR, Prozent vom Budget, prognostiziertes Monatsende
- [ ] AC-4: Banner ist nicht dismissbar (muss sichtbar bleiben bis Budget-Situation sich aendert)

Priority: P0
Sprint: 1
Playwright-Test: Ja -- Verifizierung beider Warnstufen (80% und 95%)

---

## F4: Board Escalations

**US-7: Escalation-Feed**
Als Oliver
moechte ich alle Board-Escalations chronologisch und nach Severity sortiert sehen
damit keine kritische Entscheidung untergeht.

Acceptance Criteria:
- [ ] AC-1: Escalations werden aus dem GitHub-Repo (_org/escalations/ oder Board-Decisions) ausgelesen
- [ ] AC-2: Jede Escalation zeigt: Titel, Severity (P0/P1/P2), Datum, betroffener Agent/Projekt
- [ ] AC-3: P0-Escalations stehen immer oben, unabhaengig vom Datum
- [ ] AC-4: Unbearbeitete Escalations sind visuell hervorgehoben (Signal Red Badge)

Priority: P0
Sprint: 2
Playwright-Test: Ja -- Verifizierung der Sortierung und des Signal-Red-Badge

---

**US-8: Escalation-Zaehler im Header**
Als Oliver
moechte ich im Dashboard-Header sofort sehen, wie viele offene Escalations es gibt
damit ich ohne Scrollen weiss, ob etwas Dringendes ansteht.

Acceptance Criteria:
- [ ] AC-1: Header zeigt Badge mit Anzahl offener Escalations
- [ ] AC-2: Badge ist Signal Red wenn P0-Escalations vorhanden, sonst Orange
- [ ] AC-3: Klick auf Badge scrollt zum Escalation-Feed
- [ ] AC-4: Badge zeigt "0" nicht an (nur wenn Escalations > 0)

Priority: P1
Sprint: 2
Playwright-Test: Ja -- Badge-Rendering mit 0, 1, und 5+ Escalations

---

## F5: Daily Standup Feed

**US-9: Standup-Zusammenfassung**
Als Oliver
moechte ich einen aggregierten Feed sehen, der pro Agent die wichtigsten Aktivitaeten der letzten 24h zeigt
damit ich den taeglichen Fortschritt erfassen kann ohne Git-Logs zu lesen.

Acceptance Criteria:
- [ ] AC-1: Feed zeigt pro Agent: Anzahl Commits, geschlossene Issues, erstellte Files
- [ ] AC-2: Zeitraum ist standardmaessig "letzte 24h", umschaltbar auf "letzte 7 Tage"
- [ ] AC-3: Agents ohne Aktivitaet werden als "idle" markiert
- [ ] AC-4: Feed wird aus GitHub Events API / Commit History generiert

Priority: P1
Sprint: 2
Playwright-Test: Ja -- Feed mit aktiven und inaktiven Agents

---

**US-10: Commit-Highlights**
Als Oliver
moechte ich die wichtigsten Commits der letzten 24h als Einzeiler sehen
damit ich weiss, was sich konkret geaendert hat, ohne Diffs zu oeffnen.

Acceptance Criteria:
- [ ] AC-1: Maximal 5 Commits pro Agent (neueste zuerst)
- [ ] AC-2: Jeder Commit zeigt: Commit-Message (erste Zeile), Repo-Name, Zeitstempel
- [ ] AC-3: Commits mit [BOARD] oder [CEO] Prefix werden visuell hervorgehoben
- [ ] AC-4: Klick auf Commit oeffnet GitHub-Commit-URL in neuem Tab

Priority: P1
Sprint: 2
Playwright-Test: Ja -- Rendering der Commit-Liste mit verschiedenen Prefixes

---

## F6: Agent Spawnen

**US-11: Agent-Erstellung aus dem Dashboard**
Als Oliver
moechte ich einen neuen Agent direkt aus dem Dashboard erstellen koennen
damit ich nicht manuell ein GitHub-Repo anlegen und konfigurieren muss.

Acceptance Criteria:
- [ ] AC-1: Button "Neuer Agent" oeffnet ein Formular
- [ ] AC-2: Pflichtfelder: Agent-Name, Rolle, zugewiesenes Projekt
- [ ] AC-3: Nach Submit wird ein GitHub-Repo mit Template-Struktur erstellt
- [ ] AC-4: Neuer Agent erscheint sofort im Org-Chart (F1)

Priority: P2
Sprint: 2
Playwright-Test: Ja -- Formular-Validierung und Erfolgs-Feedback

---

**US-12: Agent-Template-Auswahl**
Als Oliver
moechte ich beim Erstellen eines Agents aus vordefinierten Rollen-Templates waehlen koennen
damit die Agent-Konfiguration konsistent bleibt und ich nicht jedes Mal bei Null anfange.

Acceptance Criteria:
- [ ] AC-1: Dropdown mit verfuegbaren Templates (z.B. "Senior FE React", "QA Lead", "VP Design")
- [ ] AC-2: Templates definieren: Standard-CLAUDE.md, Skill-Set, Budget-Limit
- [ ] AC-3: Templates werden aus einer Config-Datei im GitHub-Repo gelesen

Priority: P2
Sprint: 2
Playwright-Test: Ja -- Template-Auswahl und Vorschau der generierten Konfiguration

---

## Zusammenfassung

| Feature | User Stories | Priority | Sprint |
|---------|-------------|----------|--------|
| F1: Org-Chart | US-1, US-2 | P0 | 1 |
| F2: Projekt-Uebersicht | US-3, US-4 | P0/P1 | 1 |
| F3: Token-Kosten | US-5, US-6 | P0 | 1 |
| F4: Board Escalations | US-7, US-8 | P0/P1 | 2 |
| F5: Daily Standup Feed | US-9, US-10 | P1 | 2 |
| F6: Agent Spawnen | US-11, US-12 | P2 | 2 |

**Gesamt: 12 User Stories, 44 Acceptance Criteria**
