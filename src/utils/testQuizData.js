// Test quiz data for validating various scenarios
export const validQuizData = {
  quizTitle: "Test Quiz",
  sections: [
    {
      id: "section1",
      title: "Basic Questions",
      slug: "basic",
      questions: [
        {
          id: "q1",
          text: "What is your favorite color?",
          type: "singleChoice",
          options: [
            { id: "opt1", text: "Red", value: "red" },
            { id: "opt2", text: "Blue", value: "blue" },
            { id: "opt3", text: "Green", value: "green" }
          ],
          routing: {
            "opt1": { type: "question", target: "q3" },
            "opt2": { type: "section", target: "advanced" },
            "opt3": { type: "end" }
          }
        },
        {
          id: "q2",
          text: "Enter your name:",
          type: "textInput"
        },
        {
          id: "q3",
          text: "Which programming languages do you know?",
          type: "multipleChoice",
          options: [
            { id: "opt4", text: "JavaScript", value: "js" },
            { id: "opt5", text: "Python", value: "python" },
            { id: "opt6", text: "Java", value: "java" }
          ]
        }
      ]
    },
    {
      id: "section2",
      title: "Advanced Questions",
      slug: "advanced",
      questions: [
        {
          id: "q4",
          text: "Rate your experience level:",
          type: "singleChoice",
          options: [
            { id: "opt7", text: "Beginner", value: "beginner" },
            { id: "opt8", text: "Intermediate", value: "intermediate" },
            { id: "opt9", text: "Expert", value: "expert" }
          ]
        }
      ]
    }
  ],
  resultMessages: [
    {
      id: "result1",
      title: "Great Job!",
      message: "You completed the quiz successfully.",
      conditions: []
    }
  ]
};

export const invalidQuizData = {
  // Missing quizTitle
  sections: [
    {
      // Missing id and slug
      title: "Invalid Section",
      questions: [
        {
          id: "q1",
          // Missing text
          type: "invalidType",
          options: [
            { 
              // Missing id and value
              text: "Option 1" 
            }
          ]
        }
      ]
    }
  ]
};

export const cyclicRoutingQuizData = {
  quizTitle: "Cyclic Test Quiz",
  sections: [
    {
      id: "section1",
      title: "Cyclic Questions",
      slug: "cyclic",
      questions: [
        {
          id: "q1",
          text: "Question 1",
          type: "singleChoice",
          options: [
            { id: "opt1", text: "Go to Q2", value: "q2" },
            { id: "opt2", text: "Go to Q3", value: "q3" }
          ],
          routing: {
            "opt1": { type: "question", target: "q2" },
            "opt2": { type: "question", target: "q3" }
          }
        },
        {
          id: "q2",
          text: "Question 2",
          type: "singleChoice",
          options: [
            { id: "opt3", text: "Back to Q1", value: "q1" }
          ],
          routing: {
            "opt3": { type: "question", target: "q1" }
          }
        },
        {
          id: "q3",
          text: "Question 3",
          type: "singleChoice",
          options: [
            { id: "opt4", text: "Back to Q1", value: "q1" }
          ],
          routing: {
            "opt4": { type: "question", target: "q1" }
          }
        }
      ]
    }
  ],
  resultMessages: []
};

export const emptyQuizData = {
  quizTitle: "Empty Quiz",
  sections: [],
  resultMessages: []
};

export const largeFileTestData = {
  quizTitle: "Large Quiz Test",
  sections: Array.from({ length: 100 }, (_, sectionIndex) => ({
    id: `section${sectionIndex + 1}`,
    title: `Section ${sectionIndex + 1}`,
    slug: `section-${sectionIndex + 1}`,
    questions: Array.from({ length: 50 }, (_, questionIndex) => ({
      id: `q${sectionIndex * 50 + questionIndex + 1}`,
      text: `Question ${questionIndex + 1} in Section ${sectionIndex + 1}`,
      type: "singleChoice",
      options: [
        { id: `opt${sectionIndex * 50 + questionIndex + 1}_1`, text: "Option A", value: "a" },
        { id: `opt${sectionIndex * 50 + questionIndex + 1}_2`, text: "Option B", value: "b" },
        { id: `opt${sectionIndex * 50 + questionIndex + 1}_3`, text: "Option C", value: "c" }
      ]
    }))
  })),
  resultMessages: [
    {
      id: "result1",
      title: "Completed Large Quiz",
      message: "You completed all 5000 questions!",
      conditions: []
    }
  ]
};

// Test functions
export const runValidationTests = () => {
  const tests = [
    {
      name: "Valid Quiz Data",
      data: validQuizData,
      expectedValid: true
    },
    {
      name: "Invalid Quiz Data",
      data: invalidQuizData,
      expectedValid: false
    },
    {
      name: "Empty Quiz Data",
      data: emptyQuizData,
      expectedValid: false
    },
    {
      name: "Cyclic Routing Quiz",
      data: cyclicRoutingQuizData,
      expectedValid: true // Should be valid but with warnings
    }
  ];

  return tests;
};

export const generateTestFile = (data, sizeInMB = 1) => {
  // Generate a test file of specified size for file upload testing
  const baseSize = JSON.stringify(data).length;
  const targetSize = sizeInMB * 1024 * 1024; // Convert MB to bytes
  
  if (baseSize >= targetSize) {
    return data;
  }
  
  const multiplier = Math.ceil(targetSize / baseSize);
  const expandedData = {
    ...data,
    sections: Array.from({ length: multiplier }, (_, i) => 
      data.sections.map(section => ({
        ...section,
        id: `${section.id}_copy_${i}`,
        slug: `${section.slug}-copy-${i}`,
        questions: section.questions.map(question => ({
          ...question,
          id: `${question.id}_copy_${i}`
        }))
      }))
    ).flat()
  };
  
  return expandedData;
}; 