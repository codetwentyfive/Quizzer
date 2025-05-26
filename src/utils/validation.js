/**
 * Comprehensive validation utilities for quiz data
 */

export const validateQuizStructure = (quizData) => {
  const errors = [];

  // Basic structure validation
  if (!quizData || typeof quizData !== 'object') {
    errors.push('Quiz data must be a valid object');
    return { isValid: false, errors };
  }

  // Required fields
  if (!quizData.quizTitle || typeof quizData.quizTitle !== 'string' || quizData.quizTitle.trim().length === 0) {
    errors.push('Quiz title is required and must be a non-empty string');
  }

  if (!Array.isArray(quizData.sections)) {
    errors.push('Sections must be an array');
    return { isValid: false, errors };
  }

  if (quizData.sections.length === 0) {
    errors.push('Quiz must have at least one section');
  }

  // Validate sections
  quizData.sections.forEach((section, sectionIndex) => {
    const sectionErrors = validateSection(section, sectionIndex);
    errors.push(...sectionErrors);
  });

  // Validate result messages structure
  if (quizData.resultMessages && typeof quizData.resultMessages !== 'object') {
    errors.push('Result messages must be an object');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateSection = (section, index = 0) => {
  const errors = [];

  if (!section || typeof section !== 'object') {
    errors.push(`Section ${index + 1}: Must be a valid object`);
    return errors;
  }

  // Required fields
  if (!section.id || typeof section.id !== 'string') {
    errors.push(`Section ${index + 1}: ID is required and must be a string`);
  }

  if (!section.title || typeof section.title !== 'string' || section.title.trim().length === 0) {
    errors.push(`Section ${index + 1}: Title is required and must be a non-empty string`);
  }

  if (!section.slug || typeof section.slug !== 'string') {
    errors.push(`Section ${index + 1}: Slug is required and must be a string`);
  }

  if (!Array.isArray(section.questions)) {
    errors.push(`Section ${index + 1}: Questions must be an array`);
    return errors;
  }

  // Validate questions
  section.questions.forEach((question, questionIndex) => {
    const questionErrors = validateQuestion(question, index, questionIndex);
    errors.push(...questionErrors);
  });

  return errors;
};

export const validateQuestion = (question, sectionIndex = 0, questionIndex = 0) => {
  const errors = [];
  const questionRef = `Section ${sectionIndex + 1}, Question ${questionIndex + 1}`;

  if (!question || typeof question !== 'object') {
    errors.push(`${questionRef}: Must be a valid object`);
    return errors;
  }

  // Required fields
  if (!question.id || typeof question.id !== 'string') {
    errors.push(`${questionRef}: ID is required and must be a string`);
  }

  if (!question.text || typeof question.text !== 'string' || question.text.trim().length === 0) {
    errors.push(`${questionRef}: Text is required and must be a non-empty string`);
  }

  // Validate question type
  const validTypes = ['singleChoice', 'multipleChoice', 'textInput'];
  if (!question.type || !validTypes.includes(question.type)) {
    errors.push(`${questionRef}: Type must be one of: ${validTypes.join(', ')}`);
  }

  // Type-specific validation
  if (question.type === 'textInput') {
    if (question.placeholder && typeof question.placeholder !== 'string') {
      errors.push(`${questionRef}: Placeholder must be a string`);
    }
  } else if (question.type === 'singleChoice' || question.type === 'multipleChoice') {
    if (!Array.isArray(question.options)) {
      errors.push(`${questionRef}: Options must be an array for choice questions`);
    } else {
      if (question.options.length < 2) {
        errors.push(`${questionRef}: Must have at least 2 options`);
      }

      question.options.forEach((option, optionIndex) => {
        const optionErrors = validateOption(option, sectionIndex, questionIndex, optionIndex);
        errors.push(...optionErrors);
      });
    }

    // Validate routing if present
    if (question.routing) {
      const routingErrors = validateRouting(question.routing, question.options, questionRef);
      errors.push(...routingErrors);
    }
  }

  return errors;
};

export const validateOption = (option, sectionIndex = 0, questionIndex = 0, optionIndex = 0) => {
  const errors = [];
  const optionRef = `Section ${sectionIndex + 1}, Question ${questionIndex + 1}, Option ${optionIndex + 1}`;

  if (!option || typeof option !== 'object') {
    errors.push(`${optionRef}: Must be a valid object`);
    return errors;
  }

  if (!option.id || typeof option.id !== 'string') {
    errors.push(`${optionRef}: ID is required and must be a string`);
  }

  if (!option.text || typeof option.text !== 'string' || option.text.trim().length === 0) {
    errors.push(`${optionRef}: Text is required and must be a non-empty string`);
  }

  if (!option.value || typeof option.value !== 'string') {
    errors.push(`${optionRef}: Value is required and must be a string`);
  }

  return errors;
};

export const validateRouting = (routing, options, questionRef) => {
  const errors = [];

  if (!routing || typeof routing !== 'object') {
    errors.push(`${questionRef}: Routing must be an object`);
    return errors;
  }

  Object.entries(routing).forEach(([optionId, route]) => {
    if (!route || typeof route !== 'object') {
      errors.push(`${questionRef}: Route for option ${optionId} must be an object`);
      return;
    }

    const validRouteTypes = ['section', 'question', 'end'];
    if (!route.type || !validRouteTypes.includes(route.type)) {
      errors.push(`${questionRef}: Route type for option ${optionId} must be one of: ${validRouteTypes.join(', ')}`);
    }

    if (route.type !== 'end' && (!route.target || typeof route.target !== 'string')) {
      errors.push(`${questionRef}: Route target for option ${optionId} is required and must be a string`);
    }

    // Check if optionId exists in options
    if (options && !options.find(opt => opt.id === optionId)) {
      errors.push(`${questionRef}: Route references non-existent option ID: ${optionId}`);
    }
  });

  return errors;
};

export const sanitizeQuizData = (quizData) => {
  if (!quizData || typeof quizData !== 'object') {
    return null;
  }

  return {
    quizTitle: typeof quizData.quizTitle === 'string' ? quizData.quizTitle.trim() : '',
    sections: Array.isArray(quizData.sections) ? quizData.sections.map(sanitizeSection).filter(Boolean) : [],
    resultMessages: quizData.resultMessages && typeof quizData.resultMessages === 'object' 
      ? quizData.resultMessages 
      : {}
  };
};

export const sanitizeSection = (section) => {
  if (!section || typeof section !== 'object') {
    return null;
  }

  return {
    id: typeof section.id === 'string' ? section.id : '',
    slug: typeof section.slug === 'string' ? section.slug : '',
    title: typeof section.title === 'string' ? section.title.trim() : '',
    questions: Array.isArray(section.questions) ? section.questions.map(sanitizeQuestion).filter(Boolean) : []
  };
};

export const sanitizeQuestion = (question) => {
  if (!question || typeof question !== 'object') {
    return null;
  }

  const sanitized = {
    id: typeof question.id === 'string' ? question.id : '',
    text: typeof question.text === 'string' ? question.text.trim() : '',
    type: ['singleChoice', 'multipleChoice', 'textInput'].includes(question.type) ? question.type : 'singleChoice'
  };

  if (question.type === 'textInput') {
    if (question.placeholder && typeof question.placeholder === 'string') {
      sanitized.placeholder = question.placeholder.trim();
    }
  } else {
    if (Array.isArray(question.options)) {
      sanitized.options = question.options.map(sanitizeOption).filter(Boolean);
    }
    
    if (question.routing && typeof question.routing === 'object') {
      sanitized.routing = question.routing;
    }
  }

  return sanitized;
};

export const sanitizeOption = (option) => {
  if (!option || typeof option !== 'object') {
    return null;
  }

  return {
    id: typeof option.id === 'string' ? option.id : '',
    text: typeof option.text === 'string' ? option.text.trim() : '',
    value: typeof option.value === 'string' ? option.value : ''
  };
}; 