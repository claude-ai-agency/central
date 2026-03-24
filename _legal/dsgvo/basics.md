# DSGVO Grundlagen für claude-ai-agency

## Pflicht-Checks bei jedem Feature
1. Werden personenbezogene Daten verarbeitet?
2. Gibt es eine Rechtsgrundlage (Art. 6 DSGVO)?
3. Ist eine DSFA (Datenschutz-Folgeabschätzung) nötig?
4. Sind AV-Verträge vorhanden?
5. Sind TOMs (Technische+Organisatorische Maßnahmen) dokumentiert?

## §203 StGB Relevanz
Bei Projekten für Steuerberater, Ärzte, Anwälte:
- Strikte Datenisolation (Single-Tenant)
- Kein Logging von Kundendaten
- AV-Vertrag mit DSGVO Officer Sign-off
- Verarbeitung nur auf EU-Servern (Hetzner Nürnberg/Falkenstein)

## DSGVO Officer Sign-off Pflicht
Alle Features die Kundendaten berühren brauchen: [DSGVO] Approved
