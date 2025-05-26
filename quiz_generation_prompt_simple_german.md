# 🎯 Quiz-Generierungs-Prompt (Kopieren & Einfügen bereit)

## **Deine Aufgabe:**
Generiere ein umfassendes, interaktives Quiz im JSON-Format basierend auf dem bereitgestellten Inhalt. Das Quiz wird in einer React-Anwendung mit bedingten Routing-Fähigkeiten verwendet.

## **JSON-Struktur zum Befolgen:**

```json
{
  "quizTitle": "Dein Themen-Quiz",
  "sections": [
    {
      "id": "s1", 
      "slug": "sektions-name", 
      "title": "Sektions-Titel",
      "questions": [
        {
          "id": "q1",
          "text": "Fragetext?",
          "type": "singleChoice|multipleChoice|textInput",
          "options": [{"id": "opt1", "text": "Option", "value": "wert"}],
          "routing": {"opt1": {"type": "section|question|end", "target": "ziel"}}
        }
      ]
    }
  ],
  "resultMessages": {
    "defaultIntro": "Einleitungstext für Ergebnisse",
    "knowledgeProfileTitle": "1. Wissensbewertung:",
    "recommendationsTitle": "2. Nächste Schritte:",
    "explanationsTitle": "3. Hintergrund:",
    "comicTipsTitle": "4. Ressourcen:"
  }
}
```

## **Anforderungen:**
- **3-4 Sektionen** (8-12 Fragen insgesamt)
- **Fragetypen**: 60% singleChoice, 25% multipleChoice, 15% textInput
- **IDs**: s1/s2/s3, q1/q2/q3, opt1/opt2/opt3
- **Slugs**: kleinschreibung-mit-bindestrichen
- **Routing**: Füge 2-3 bedingte Pfade für Verzweigungsnavigation hinzu
- **Optionen**: 3-5 pro Auswahlfrage

## **Routing-Beispiele:**
- `"routing": {"opt1": {"type": "section", "target": "erweitert"}}` - Springe zu Sektion
- `"routing": {"opt2": {"type": "question", "target": "q5"}}` - Springe zu spezifischer Frage  
- `"routing": {"opt3": {"type": "end"}}` - Beende Quiz vorzeitig

## **Inhalt für Quiz-Basis:**
[FÜGE HIER DEINEN INHALT/DEIN THEMA EIN]

## **Ausgabe-Anweisungen:**
- Gib NUR gültiges JSON zurück (keine Markdown-Code-Blöcke)
- Entferne alle Kommentare oder Erklärungstexte
- Stelle sicher, dass alle Anführungszeichen, Klammern und Kommas korrekt sind
- Teste, ob Routing-Ziele existieren, bevor du sie verwendest

---

**Beispiel-Verwendung:**
Ersetze "[FÜGE HIER DEINEN INHALT/DEIN THEMA EIN]" mit deinem Inhalt und gib dann diesen gesamten Prompt an ein beliebiges LLM, um eine kompatible Quiz-JSON-Datei zu generieren. 