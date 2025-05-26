import React from 'react';

const ProgressBar = ({ sections, currentSectionIndex, currentQuestionIndex, answeredQuestions }) => {
  const currentSection = sections[currentSectionIndex];
  const totalQuestions = sections.reduce((count, section) => count + section.questions.length, 0);
  
  // Calculate current question number (1-based)
  let currentQuestionNumber = 1;
  for (let i = 0; i < currentSectionIndex; i++) {
    currentQuestionNumber += sections[i].questions.length;
  }
  currentQuestionNumber += currentQuestionIndex;
  
  // Calculate overall progress percentage
  const overallProgress = (currentQuestionNumber / totalQuestions) * 100;
  
  // Calculate section progress percentage
  const sectionProgress = currentSection ? ((currentQuestionIndex + 1) / currentSection.questions.length) * 100 : 0;

  return (
    <div className="w-full bg-beige p-4 md:p-6 rounded-t-lg shadow-md">
      {/* Section Progress */}
      <div className="flex items-center max-w-2xl mx-auto mb-6">
        {sections.map((section, index) => (
          <React.Fragment key={section.id}>
            <div className="flex flex-col items-center text-center w-20 md:w-24">
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-in-out
                  ${index === currentSectionIndex ? 'bg-primary-blue text-white border-primary-blue scale-110' : 
                    index < currentSectionIndex ? 'bg-primary-blue text-white border-primary-blue' : 
                    'bg-white border-gray-300 text-gray-500'}`
                }
              >
                {index + 1}
              </div>
              <span 
                className={`text-xs md:text-sm mt-2 transition-all duration-300 ease-in-out break-words
                  ${index === currentSectionIndex ? 'font-semibold text-primary-blue' : 
                    index < currentSectionIndex ? 'font-medium text-gray-700' : 
                    'text-gray-500'}`
                }
              >
                {section.title}
              </span>
            </div>
            
            {index < sections.length - 1 && (
              <div className="flex-grow mx-2">
                <div 
                  className={`h-1 w-full transition-all duration-500 ease-in-out
                    ${index < currentSectionIndex ? 'bg-primary-blue' : 'bg-gray-300'}`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Detailed Progress Information */}
      <div className="max-w-2xl mx-auto">
        {/* Overall Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Gesamtfortschritt
            </span>
            <span className="text-sm text-gray-600">
              Frage {currentQuestionNumber} von {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-blue h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Current Section Progress */}
        {currentSection && (
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {currentSection.title}
              </span>
              <span className="text-sm text-gray-600">
                {currentQuestionIndex + 1} von {currentSection.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${sectionProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Progress Statistics */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
          <span>
            ✅ {answeredQuestions} beantwortet
          </span>
          <span>
            📊 {Math.round(overallProgress)}% abgeschlossen
          </span>
          <span>
            ⏱️ {totalQuestions - currentQuestionNumber} verbleibend
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 