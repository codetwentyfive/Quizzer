/**
 * Robust quiz navigation utilities with cycle detection and error handling
 */

export class QuizNavigationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'QuizNavigationError';
    this.code = code;
  }
}

export const findNextQuestion = (currentQuestion, currentAnswer, activeSections, currentSectionIndex, currentQuestionIndex, visitedQuestions = new Set()) => {
  // Prevent infinite loops by tracking visited questions
  const currentQuestionKey = `${currentSectionIndex}-${currentQuestionIndex}`;
  
  if (visitedQuestions.has(currentQuestionKey)) {
    console.warn('Cycle detected in quiz routing, falling back to sequential navigation');
    return findSequentialNext(activeSections, currentSectionIndex, currentQuestionIndex);
  }
  
  visitedQuestions.add(currentQuestionKey);

  try {
    // Check if current question has routing defined
    if (currentQuestion?.routing && currentQuestion.type === 'singleChoice') {
      const selectedOption = currentQuestion.options?.find(opt => opt.value === currentAnswer);
      if (selectedOption && currentQuestion.routing[selectedOption.id]) {
        const route = currentQuestion.routing[selectedOption.id];
        
        const routeResult = processRoute(route, activeSections, currentSectionIndex, currentQuestionIndex);
        if (routeResult) {
          return routeResult;
        }
      }
    }
    
    // Handle multiple choice routing (use first valid routing option)
    if (currentQuestion?.routing && currentQuestion.type === 'multipleChoice' && Array.isArray(currentAnswer)) {
      for (const answerValue of currentAnswer) {
        const selectedOption = currentQuestion.options?.find(opt => opt.value === answerValue);
        if (selectedOption && currentQuestion.routing[selectedOption.id]) {
          const route = currentQuestion.routing[selectedOption.id];
          
          const routeResult = processRoute(route, activeSections, currentSectionIndex, currentQuestionIndex);
          if (routeResult) {
            return routeResult;
          }
        }
      }
    }
    
    // Default sequential navigation
    return findSequentialNext(activeSections, currentSectionIndex, currentQuestionIndex);
    
  } catch (error) {
    console.error('Error in quiz navigation:', error);
    // Fallback to sequential navigation on any error
    return findSequentialNext(activeSections, currentSectionIndex, currentQuestionIndex);
  }
};

const processRoute = (route, activeSections, currentSectionIndex, currentQuestionIndex) => {
  if (!route || typeof route !== 'object') {
    throw new QuizNavigationError('Invalid route object', 'INVALID_ROUTE');
  }

  switch (route.type) {
    case 'end':
      return { type: 'end' };
    
    case 'section':
      if (!route.target || typeof route.target !== 'string') {
        throw new QuizNavigationError('Section route missing target', 'MISSING_TARGET');
      }
      
      const targetSectionIndex = activeSections.findIndex(section => section.slug === route.target);
      if (targetSectionIndex === -1) {
        console.warn(`Section with slug "${route.target}" not found, using sequential navigation`);
        return null;
      }
      
      if (!activeSections[targetSectionIndex].questions || activeSections[targetSectionIndex].questions.length === 0) {
        console.warn(`Target section "${route.target}" has no questions, using sequential navigation`);
        return null;
      }
      
      return { 
        type: 'section', 
        sectionIndex: targetSectionIndex, 
        questionIndex: 0 
      };
    
    case 'question':
      if (!route.target || typeof route.target !== 'string') {
        throw new QuizNavigationError('Question route missing target', 'MISSING_TARGET');
      }
      
      // Find question by ID across all sections
      for (let sectionIndex = 0; sectionIndex < activeSections.length; sectionIndex++) {
        const section = activeSections[sectionIndex];
        if (!section.questions) continue;
        
        const questionIndex = section.questions.findIndex(q => q.id === route.target);
        if (questionIndex !== -1) {
          return { 
            type: 'question', 
            sectionIndex, 
            questionIndex 
          };
        }
      }
      
      console.warn(`Question with ID "${route.target}" not found, using sequential navigation`);
      return null;
    
    default:
      throw new QuizNavigationError(`Unknown route type: ${route.type}`, 'UNKNOWN_ROUTE_TYPE');
  }
};

const findSequentialNext = (activeSections, currentSectionIndex, currentQuestionIndex) => {
  // Validate current position
  if (currentSectionIndex < 0 || currentSectionIndex >= activeSections.length) {
    return { type: 'end' };
  }
  
  const currentSection = activeSections[currentSectionIndex];
  if (!currentSection || !currentSection.questions) {
    return { type: 'end' };
  }
  
  // Next question in current section
  if (currentQuestionIndex < currentSection.questions.length - 1) {
    return { 
      type: 'question', 
      sectionIndex: currentSectionIndex, 
      questionIndex: currentQuestionIndex + 1 
    };
  }
  
  // Next section
  if (currentSectionIndex < activeSections.length - 1) {
    // Find next section with questions
    for (let sectionIndex = currentSectionIndex + 1; sectionIndex < activeSections.length; sectionIndex++) {
      const section = activeSections[sectionIndex];
      if (section && section.questions && section.questions.length > 0) {
        return { 
          type: 'section', 
          sectionIndex: sectionIndex, 
          questionIndex: 0 
        };
      }
    }
  }
  
  // End of quiz
  return { type: 'end' };
};

export const findPreviousQuestion = (activeSections, currentSectionIndex, currentQuestionIndex) => {
  try {
    // Validate current position
    if (currentSectionIndex < 0 || currentSectionIndex >= activeSections.length) {
      return null;
    }
    
    // Previous question in current section
    if (currentQuestionIndex > 0) {
      return {
        sectionIndex: currentSectionIndex,
        questionIndex: currentQuestionIndex - 1
      };
    }
    
    // Previous section
    if (currentSectionIndex > 0) {
      // Find previous section with questions
      for (let sectionIndex = currentSectionIndex - 1; sectionIndex >= 0; sectionIndex--) {
        const section = activeSections[sectionIndex];
        if (section && section.questions && section.questions.length > 0) {
          return {
            sectionIndex: sectionIndex,
            questionIndex: section.questions.length - 1
          };
        }
      }
    }
    
    // At the beginning
    return null;
    
  } catch (error) {
    console.error('Error in previous question navigation:', error);
    return null;
  }
};

export const validateQuizNavigation = (activeSections) => {
  const errors = [];
  const warnings = [];
  
  if (!Array.isArray(activeSections) || activeSections.length === 0) {
    errors.push('No sections available for navigation');
    return { errors, warnings };
  }
  
  // Check for sections without questions
  activeSections.forEach((section, sectionIndex) => {
    if (!section.questions || section.questions.length === 0) {
      warnings.push(`Section ${sectionIndex + 1} (${section.title}) has no questions`);
    }
  });
  
  // Check routing references
  activeSections.forEach((section, sectionIndex) => {
    if (!section.questions) return;
    
    section.questions.forEach((question, questionIndex) => {
      if (!question.routing) return;
      
      Object.entries(question.routing).forEach(([optionId, route]) => {
        if (route.type === 'section') {
          const targetExists = activeSections.some(s => s.slug === route.target);
          if (!targetExists) {
            errors.push(`Section ${sectionIndex + 1}, Question ${questionIndex + 1}: Route references non-existent section "${route.target}"`);
          }
        } else if (route.type === 'question') {
          let questionExists = false;
          activeSections.forEach(s => {
            if (s.questions && s.questions.some(q => q.id === route.target)) {
              questionExists = true;
            }
          });
          if (!questionExists) {
            errors.push(`Section ${sectionIndex + 1}, Question ${questionIndex + 1}: Route references non-existent question "${route.target}"`);
          }
        }
      });
    });
  });
  
  return { errors, warnings };
}; 