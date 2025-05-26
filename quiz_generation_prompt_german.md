# Quiz JSON Generierungs-Leitfaden für LLMs

## Überblick
Dieser Leitfaden erklärt, wie man Quiz-JSON-Dateien erstellt, die mit der Quizzer-Anwendung kompatibel sind. Die App unterstützt drei Fragetypen, bedingte Weiterleitung und mehrere Sektionen.

## JSON-Struktur Anforderungen

### Grundlegende Struktur
```json
{
  "quizTitle": "Dein Quiz-Titel hier",
  "sections": [...],
  "resultMessages": {...}
}
```

### Sektions-Struktur
Jede Sektion repräsentiert ein Thema/eine Kategorie und enthält mehrere Fragen:
```json
{
  "id": "eindeutige_sektions_id",
  "slug": "sektions-slug-für-routing",
  "title": "Menschenlesbarer Sektions-Titel",
  "questions": [...]
}
```

### Fragetypen

#### 1. Einfachauswahl-Fragen
```json
{
  "id": "eindeutige_fragen_id",
  "text": "Dein Fragetext hier?",
  "type": "singleChoice",
  "options": [
    {
      "id": "option_id_1",
      "text": "Anzeigetext der Option",
      "value": "option_wert"
    }
  ],
  "routing": {
    "option_id_1": {
      "type": "section|question|end",
      "target": "ziel_sektions_slug_oder_fragen_id"
    }
  }
}
```

#### 2. Mehrfachauswahl-Fragen
```json
{
  "id": "eindeutige_fragen_id",
  "text": "Dein Fragetext hier? (Mehrere Antworten möglich)",
  "type": "multipleChoice",
  "options": [
    {
      "id": "option_id_1",
      "text": "Anzeigetext der Option",
      "value": "option_wert"
    }
  ],
  "routing": {
    "option_id_1": {
      "type": "section|question|end",
      "target": "ziel_sektions_slug_oder_fragen_id"
    }
  }
}
```

#### 3. Texteingabe-Fragen
```json
{
  "id": "eindeutige_fragen_id",
  "text": "Dein Fragetext hier?",
  "type": "textInput",
  "placeholder": "Platzhaltertext für Eingabefeld"
}
```

### Routing-Optionen
- **"section"**: Springe zu einer anderen Sektion über Slug
- **"question"**: Springe zu einer spezifischen Frage über ID
- **"end"**: Beende das Quiz sofort

### Ergebnisnachrichten-Struktur
```json
{
  "resultMessages": {
    "defaultIntro": "Einleitungstext für die Ergebnisseite",
    "knowledgeProfileTitle": "1. Wissensbewertung:",
    "recommendationsTitle": "2. Nächste Schritte:",
    "explanationsTitle": "3. Hintergrundinformationen:",
    "comicTipsTitle": "4. Zusätzliche Ressourcen:"
  }
}
```

## ID-Generierungs-Regeln
- **Sektions-IDs**: Verwende Format "s1", "s2", "s3", usw.
- **Fragen-IDs**: Verwende Format "q1", "q2", "q3", usw.
- **Options-IDs**: Verwende Format "opt1", "opt2", "opt3", usw.
- **Sektions-Slugs**: Verwende Kleinschreibung mit Bindestrichen, z.B. "grundwissen", "erweiterte-themen"

## Bewährte Praktiken

### 1. Fragendesign
- Formuliere Fragen klar und eindeutig
- Biete 2-6 Optionen für Auswahlfragen
- Verwende beschreibende Optionstexte
- Füge Kontext hinzu, wenn nötig

### 2. Routing-Strategie
- Verwende Routing sparsam für sinnvolle Verzweigungen
- Stelle sicher, dass alle Routing-Ziele existieren
- Teste Routing-Pfade gedanklich
- Biete sequenzielle Navigation als Fallback

### 3. Sektions-Organisation
- Gruppiere verwandte Fragen logisch
- Verwende 3-8 Fragen pro Sektion
- Erstelle aussagekräftige Sektionstitel
- Ordne Sektionen nach Schwierigkeit/Wichtigkeit

## Beispiel für ein vollständiges Quiz
```json
{
  "quizTitle": "Programmier-Wissensbewertung",
  "sections": [
    {
      "id": "s1",
      "slug": "grundlagen",
      "title": "Programmier-Grundlagen",
      "questions": [
        {
          "id": "q1",
          "text": "Wie ist dein Erfahrungslevel mit Programmierung?",
          "type": "singleChoice",
          "options": [
            { "id": "opt1", "text": "Kompletter Anfänger", "value": "anfänger" },
            { "id": "opt2", "text": "Etwas Erfahrung", "value": "fortgeschritten" },
            { "id": "opt3", "text": "Sehr erfahren", "value": "experte" }
          ],
          "routing": {
            "opt1": { "type": "section", "target": "anfänger-themen" },
            "opt3": { "type": "section", "target": "experten-themen" }
          }
        }
      ]
    },
    {
      "id": "s2",
      "slug": "anfänger-themen",
      "title": "Anfänger-Programmierung",
      "questions": [
        {
          "id": "q2",
          "text": "Wofür steht HTML?",
          "type": "textInput",
          "placeholder": "Gib deine Antwort hier ein..."
        }
      ]
    },
    {
      "id": "s3",
      "slug": "experten-themen",
      "title": "Erweiterte Programmierung",
      "questions": [
        {
          "id": "q3",
          "text": "Welche Design Patterns hast du bereits verwendet?",
          "type": "multipleChoice",
          "options": [
            { "id": "opt1", "text": "Singleton", "value": "singleton" },
            { "id": "opt2", "text": "Observer", "value": "observer" },
            { "id": "opt3", "text": "Factory", "value": "factory" }
          ]
        }
      ]
    }
  ],
  "resultMessages": {
    "defaultIntro": "Hier ist deine Programmier-Wissensbewertung:",
    "knowledgeProfileTitle": "1. Kenntnisstand:",
    "recommendationsTitle": "2. Lernpfad:",
    "explanationsTitle": "3. Schlüsselkonzepte:",
    "comicTipsTitle": "4. Ressourcen:"
  }
}
```

---

# LLM-Prompt für Quiz-Generierung

Du bist ein Quiz-Generierungs-Assistent. Erstelle ein umfassendes Quiz im JSON-Format basierend auf dem bereitgestellten Thema/Inhalt. Befolge diese Spezifikationen genau:

## Anforderungen:
1. **Erstelle 3-5 Sektionen** mit logischen Themengruppierungen
2. **Füge 2-4 Fragen pro Sektion hinzu** (8-15 Fragen insgesamt)
3. **Verwende alle drei Fragetypen**: singleChoice, multipleChoice, textInput
4. **Füge bedingte Weiterleitung hinzu** für mindestens 2 Fragen, um Verzweigungspfade zu erstellen
5. **Generiere eindeutige IDs** nach den Namenskonventionen
6. **Erstelle aussagekräftige Sektions-Slugs** für das Routing

## Fragenverteilung:
- 60% Einfachauswahl (mit 3-5 Optionen jeweils)
- 25% Mehrfachauswahl (mit 3-6 Optionen jeweils)
- 15% Texteingabe (mit passenden Platzhaltern)

## Routing-Richtlinien:
- Füge Routing zu 2-3 strategischen Fragen hinzu
- Verwende Sektions-Routing zum Überspringen/Springen zwischen Themen
- Verwende Fragen-Routing zum Springen zu spezifischen Folgefragen
- Verwende End-Routing sparsam für vorzeitige Beendigung

## Inhalts-Richtlinien:
- Mache Fragen lehrreich und ansprechend
- Variiere Schwierigkeitsgrade über Sektionen hinweg
- Füge sowohl faktische als auch analytische Fragen hinzu
- Stelle sicher, dass Optionen bei Einfachauswahl sich gegenseitig ausschließen
- Schreibe klare, prägnante Fragetexte

## Ausgabeformat:
Gib nur gültiges JSON ohne Code-Blöcke oder Erklärungen aus. Stelle sicher, dass alle Klammern, Kommas und Anführungszeichen korrekt formatiert sind.

**Thema/Inhalt, auf dem das Quiz basieren soll:**
[FÜGE HIER DEINEN INHALT/DEIN THEMA EIN]

---

Diese Struktur wird dir oder jedem LLM dabei helfen, Quizzes zu erstellen, die alle Funktionen deiner Anwendung voll ausnutzen, einschließlich bedingter Weiterleitung, mehrerer Fragetypen und ordnungsgemäßer Sektions-Organisation. 