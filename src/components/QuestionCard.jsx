import React from 'react';
import { motion } from 'framer-motion';
import AnswerOption from './AnswerOption';
import SwirlDecoration from '../assets/SwirlDecoration.svg'; // Import regular SVG
import SwirlDecorationCardSmall from '../assets/SwirlDecorationCardSmall.svg'; // Import small SVG

const QuestionCard = ({ question, answer, onAnswerChange }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const renderQuestionInput = () => {
    let optionContainerClassName = "mt-6"; // Default for textInput or < 4 options
    let motionDivClassName = ""; // No special class for motion.div by default

    if (question.type === 'singleChoice' || question.type === 'multipleChoice') {
      const numOptions = question.options.length;
      if (numOptions >= 2 && numOptions <= 5) {
        if (numOptions === 4) {
          optionContainerClassName = "grid grid-cols-2 gap-3 mt-6"; // gap-3 for tighter packing
        } else { // 5 or 6 options
          optionContainerClassName = "grid grid-cols-3 gap-3 mt-6";
        }
        motionDivClassName = "aspect-square flex items-center justify-center"; // Apply to the motion.div wrapping AnswerOption
      } else if (question.type === 'singleChoice') { // Default grid for single choice if not 4-6
        optionContainerClassName = "grid grid-cols-1 gap-4 mt-6";
      }
      // For multipleChoice with < 4 options, it will use the default "mt-6" which stacks them, or we can define another specific layout.
      // For now, multipleChoice with < 4 options will stack vertically.
    }

    // Determine which background SVG to use for the options
    let optionBackgroundSvg = null;
    if (question.options) {
      optionBackgroundSvg = question.options.length >= 5 ? SwirlDecorationCardSmall : SwirlDecoration;
    }

    switch (question.type) {
      case 'singleChoice':
      case 'multipleChoice':
        return (
          <div className={optionContainerClassName}>
            {question.options.map((option) => (
              <motion.div 
                key={option.id} 
                variants={itemVariants}
                className={motionDivClassName} // Apply square and flex centering here
              >
                <AnswerOption
                  option={option}
                  type={question.type}
                  selected={question.type === 'multipleChoice' ? (answer || []) : answer}
                  onChange={onAnswerChange}
                  // Pass a prop if AnswerOption itself needs to adapt for square layout
                  isSquare={motionDivClassName.includes('aspect-square')}
                  backgroundSvg={optionBackgroundSvg} // Pass the determined SVG
                />
              </motion.div>
            ))}
          </div>
        );
        
      case 'textInput':
        return (
          <motion.div variants={itemVariants} className="mt-6">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder={question.placeholder || "Deine Antwort..."}
              rows={4}
              value={answer || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
            />
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Decorative SVG background */}
      <motion.h2 
        className="text-2xl font-extrabold mb-4 text-gray-800 z-10 relative"
        variants={itemVariants}
      >
        {question.text}
      </motion.h2>
      {/* Card content */}
      <div className="z-10 relative">
        {renderQuestionInput()}
      </div>
    </motion.div>
  );
};

export default QuestionCard; 