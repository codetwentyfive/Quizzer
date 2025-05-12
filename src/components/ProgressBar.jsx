import React from 'react';

const ProgressBar = ({ sections, currentSectionIndex }) => {
  return (
    <div className="w-full bg-beige p-4 md:p-6 rounded-t-lg shadow-md">
      <div className="flex items-center max-w-2xl mx-auto">
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
    </div>
  );
};

export default ProgressBar; 