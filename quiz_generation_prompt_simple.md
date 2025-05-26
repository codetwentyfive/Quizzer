# 🎯 Quiz Generation Prompt (Copy & Paste Ready)

## **Your Task:**
Generate a comprehensive, interactive quiz in JSON format based on the provided content. The quiz will be used in a React application with conditional routing capabilities.

## **JSON Structure to Follow:**

```json
{
  "quizTitle": "Your Topic Quiz",
  "sections": [
    {
      "id": "s1", 
      "slug": "section-name", 
      "title": "Section Title",
      "questions": [
        {
          "id": "q1",
          "text": "Question text?",
          "type": "singleChoice|multipleChoice|textInput",
          "options": [{"id": "opt1", "text": "Option", "value": "value"}],
          "routing": {"opt1": {"type": "section|question|end", "target": "target"}}
        }
      ]
    }
  ],
  "resultMessages": {
    "defaultIntro": "Results intro text",
    "knowledgeProfileTitle": "1. Knowledge Assessment:",
    "recommendationsTitle": "2. Next Steps:",
    "explanationsTitle": "3. Background:",
    "comicTipsTitle": "4. Resources:"
  }
}
```

## **Requirements:**
- **3-4 sections** (8-12 questions total)
- **Question types**: 60% singleChoice, 25% multipleChoice, 15% textInput
- **IDs**: s1/s2/s3, q1/q2/q3, opt1/opt2/opt3
- **Slugs**: lowercase-with-hyphens
- **Routing**: Add 2-3 conditional paths for branching navigation
- **Options**: 3-5 per choice question

## **Routing Examples:**
- `"routing": {"opt1": {"type": "section", "target": "advanced"}}` - Jump to section
- `"routing": {"opt2": {"type": "question", "target": "q5"}}` - Jump to specific question  
- `"routing": {"opt3": {"type": "end"}}` - End quiz early

## **Content to Base Quiz On:**
[PASTE YOUR CONTENT/TOPIC HERE]

## **Output Instructions:**
- Return ONLY valid JSON (no markdown code blocks)
- Remove any comments or explanation text
- Ensure all quotes, brackets, and commas are correct
- Test routing targets exist before using them

---

**Example Usage:**
Replace "[PASTE YOUR CONTENT/TOPIC HERE]" with your content, then give this entire prompt to any LLM to generate a compatible quiz JSON file. 