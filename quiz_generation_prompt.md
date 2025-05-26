# Quiz JSON Generation Guide for LLMs

## Overview
This guide explains how to create quiz JSON files compatible with the Quizzer application. The app supports three question types, conditional routing, and multiple sections.

## JSON Structure Requirements

### Root Level Structure
```json
{
  "quizTitle": "Your Quiz Title Here",
  "sections": [...],
  "resultMessages": {...}
}
```

### Section Structure
Each section represents a topic/category and contains multiple questions:
```json
{
  "id": "unique_section_id",
  "slug": "section-slug-for-routing",
  "title": "Human Readable Section Title",
  "questions": [...]
}
```

### Question Types

#### 1. Single Choice Questions
```json
{
  "id": "unique_question_id",
  "text": "Your question text here?",
  "type": "singleChoice",
  "options": [
    {
      "id": "option_id_1",
      "text": "Option display text",
      "value": "option_value"
    }
  ],
  "routing": {
    "option_id_1": {
      "type": "section|question|end",
      "target": "target_section_slug_or_question_id"
    }
  }
}
```

#### 2. Multiple Choice Questions
```json
{
  "id": "unique_question_id",
  "text": "Your question text here? (Multiple answers possible)",
  "type": "multipleChoice",
  "options": [
    {
      "id": "option_id_1",
      "text": "Option display text",
      "value": "option_value"
    }
  ],
  "routing": {
    "option_id_1": {
      "type": "section|question|end",
      "target": "target_section_slug_or_question_id"
    }
  }
}
```

#### 3. Text Input Questions
```json
{
  "id": "unique_question_id",
  "text": "Your question text here?",
  "type": "textInput",
  "placeholder": "Placeholder text for input field"
}
```

### Routing Options
- **"section"**: Jump to another section by slug
- **"question"**: Jump to specific question by ID
- **"end"**: End quiz immediately

### Result Messages Structure
```json
{
  "resultMessages": {
    "defaultIntro": "Introduction text for results page",
    "knowledgeProfileTitle": "1. Knowledge Assessment:",
    "recommendationsTitle": "2. Next Steps:",
    "explanationsTitle": "3. Background Information:",
    "comicTipsTitle": "4. Additional Resources:"
  }
}
```

## ID Generation Rules
- **Section IDs**: Use format "s1", "s2", "s3", etc.
- **Question IDs**: Use format "q1", "q2", "q3", etc.
- **Option IDs**: Use format "opt1", "opt2", "opt3", etc.
- **Section Slugs**: Use lowercase with hyphens, e.g., "basic-knowledge", "advanced-topics"

## Best Practices

### 1. Question Design
- Make questions clear and unambiguous
- Provide 2-6 options for choice questions
- Use descriptive option text
- Include context when necessary

### 2. Routing Strategy
- Use routing sparingly for meaningful branching
- Ensure all routing targets exist
- Test routing paths mentally
- Provide fallback sequential navigation

### 3. Section Organization
- Group related questions logically
- Use 3-8 questions per section
- Create meaningful section titles
- Order sections by difficulty/importance

## Example Complete Quiz
```json
{
  "quizTitle": "Programming Knowledge Assessment",
  "sections": [
    {
      "id": "s1",
      "slug": "basics",
      "title": "Programming Basics",
      "questions": [
        {
          "id": "q1",
          "text": "What is your experience level with programming?",
          "type": "singleChoice",
          "options": [
            { "id": "opt1", "text": "Complete beginner", "value": "beginner" },
            { "id": "opt2", "text": "Some experience", "value": "intermediate" },
            { "id": "opt3", "text": "Very experienced", "value": "advanced" }
          ],
          "routing": {
            "opt1": { "type": "section", "target": "beginner-topics" },
            "opt3": { "type": "section", "target": "advanced-topics" }
          }
        }
      ]
    },
    {
      "id": "s2",
      "slug": "beginner-topics",
      "title": "Beginner Programming",
      "questions": [
        {
          "id": "q2",
          "text": "What does HTML stand for?",
          "type": "textInput",
          "placeholder": "Enter your answer here..."
        }
      ]
    },
    {
      "id": "s3",
      "slug": "advanced-topics",
      "title": "Advanced Programming",
      "questions": [
        {
          "id": "q3",
          "text": "Which design patterns have you used?",
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
    "defaultIntro": "Here's your programming knowledge assessment:",
    "knowledgeProfileTitle": "1. Skill Level:",
    "recommendationsTitle": "2. Learning Path:",
    "explanationsTitle": "3. Key Concepts:",
    "comicTipsTitle": "4. Resources:"
  }
}
```

---

# LLM Prompt for Quiz Generation

You are a quiz generation assistant. Create a comprehensive quiz in JSON format based on the provided topic/content. Follow these specifications exactly:

## Requirements:
1. **Create 3-5 sections** with logical topic groupings
2. **Include 2-4 questions per section** (8-15 questions total)
3. **Use all three question types**: singleChoice, multipleChoice, textInput
4. **Add conditional routing** for at least 2 questions to create branching paths
5. **Generate unique IDs** following the naming conventions
6. **Create meaningful section slugs** for routing

## Question Distribution:
- 60% Single Choice (with 3-5 options each)
- 25% Multiple Choice (with 3-6 options each)  
- 15% Text Input (with appropriate placeholders)

## Routing Guidelines:
- Add routing to 2-3 strategic questions
- Use section routing to skip/jump between topics
- Use question routing to jump to specific follow-ups
- Use end routing sparingly for early termination

## Content Guidelines:
- Make questions educational and engaging
- Vary difficulty levels across sections
- Include both factual and analytical questions
- Ensure options are mutually exclusive for single choice
- Write clear, concise question text

## Output Format:
Provide only valid JSON without code blocks or explanations. Ensure all brackets, commas, and quotes are properly formatted.

**Topic/Content to base the quiz on:**
[INSERT YOUR CONTENT/TOPIC HERE]

---

This structure will help you or any LLM create quizzes that fully utilize your application's features including conditional routing, multiple question types, and proper section organization. 