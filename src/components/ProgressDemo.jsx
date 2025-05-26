import React from 'react';

const ProgressDemo = () => {
  // Sample data for demonstration
  const sampleSections = [
    { id: 'section1', title: 'Grundlagen', questions: [{}, {}, {}] },
    { id: 'section2', title: 'Verhalten', questions: [{}, {}] },
    { id: 'section3', title: 'Zukunft', questions: [{}, {}, {}, {}] }
  ];

  const currentSectionIndex = 1;
  const currentQuestionIndex = 0;
  const answeredQuestions = 4;
  const totalQuestions = 9;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8">Progress Display Comparison</h1>
      
      {/* Old Approach */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-red-600">❌ Old Approach (Problems)</h2>
        <div className="space-y-4">
          <div className="text-center text-gray-600">
            Simple text: "Frage 4 von 9"
          </div>
          <div className="bg-red-50 p-4 rounded border-l-4 border-red-400">
            <h3 className="font-semibold text-red-800">Issues:</h3>
            <ul className="text-red-700 text-sm mt-2 space-y-1">
              <li>• Shows "answered" vs "total" instead of current position</li>
              <li>• No visual progress indication</li>
              <li>• No context about sections</li>
              <li>• Doesn't show progress within current section</li>
              <li>• Limited information for user orientation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* New Enhanced Approach */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-green-600">✅ New Enhanced Approach</h2>
        
        {/* Section Progress Visualization */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Section Progress:</h3>
          <div className="flex items-center justify-center space-x-4">
            {sampleSections.map((section, index) => (
              <React.Fragment key={section.id}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                      ${index === currentSectionIndex ? 'bg-blue-600 text-white border-blue-600 scale-110' : 
                        index < currentSectionIndex ? 'bg-blue-600 text-white border-blue-600' : 
                        'bg-white border-gray-300 text-gray-500'}`
                    }
                  >
                    {index + 1}
                  </div>
                  <span className={`text-sm mt-2 ${index === currentSectionIndex ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
                    {section.title}
                  </span>
                </div>
                {index < sampleSections.length - 1 && (
                  <div className="flex-grow">
                    <div className={`h-1 w-16 ${index < currentSectionIndex ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Gesamtfortschritt</span>
            <span className="text-sm text-gray-600">Frage 4 von 9</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '44%' }}
            />
          </div>
        </div>

        {/* Current Section Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Verhalten</span>
            <span className="text-sm text-gray-600">1 von 2</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: '50%' }}
            />
          </div>
        </div>

        {/* Progress Statistics */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>✅ 4 beantwortet</span>
          <span>📊 44% abgeschlossen</span>
          <span>⏱️ 5 verbleibend</span>
        </div>

        <div className="bg-green-50 p-4 rounded border-l-4 border-green-400 mt-4">
          <h3 className="font-semibold text-green-800">Benefits:</h3>
          <ul className="text-green-700 text-sm mt-2 space-y-1">
            <li>• Clear visual progress with multiple progress bars</li>
            <li>• Shows current position accurately (Question 4 of 9)</li>
            <li>• Section-level context with visual indicators</li>
            <li>• Progress within current section</li>
            <li>• Multiple metrics: answered, percentage, remaining</li>
            <li>• Smooth animations and visual feedback</li>
            <li>• Better user orientation and motivation</li>
          </ul>
        </div>
      </div>

      {/* Alternative Approaches */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-600">🔄 Alternative Progress Approaches</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Circular Progress */}
          <div className="space-y-3">
            <h3 className="font-semibold">Circular Progress</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${44 * 1.88} ${100 * 1.88}`}
                    className="text-blue-600"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">44%</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 text-center">Good for overall completion</p>
          </div>

          {/* Step Progress */}
          <div className="space-y-3">
            <h3 className="font-semibold">Step-by-Step</h3>
            <div className="flex items-center space-x-2">
              {[1,2,3,4,5,6,7,8,9].map((step) => (
                <div
                  key={step}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                    ${step <= 4 ? 'bg-blue-600 text-white' : 
                      step === 5 ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-500'}`}
                >
                  {step}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 text-center">Shows each question individually</p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
        <h2 className="text-xl font-bold mb-4 text-blue-800">💡 Recommendation</h2>
        <p className="text-blue-700 mb-4">
          The enhanced approach combines the best of multiple progress indicators:
        </p>
        <ul className="text-blue-700 space-y-2">
          <li><strong>Section Progress:</strong> Visual overview of quiz structure</li>
          <li><strong>Overall Progress Bar:</strong> Clear completion percentage</li>
          <li><strong>Section Progress Bar:</strong> Context within current section</li>
          <li><strong>Statistics:</strong> Multiple metrics for different user preferences</li>
        </ul>
        <p className="text-blue-700 mt-4">
          This approach provides comprehensive feedback while maintaining clean, intuitive design.
        </p>
      </div>
    </div>
  );
};

export default ProgressDemo; 