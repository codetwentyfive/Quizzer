import React from 'react';
import { motion } from 'framer-motion';
import AnswerOption from './AnswerOption';
import SwirlDecoration from '../assets/SwirlDecoration.svg'; // Import regular SVG
import SwirlDecorationCardSmall from '../assets/SwirlDecorationCardSmall.svg'; // Import small SVG

const QuestionCard = ({ question, answer, onAnswerChange }) => {
  if (!question) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
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

  const handleKeyDown = (event, optionValue) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (question.type === 'multipleChoice') {
        const newSelected = answer ? [...answer] : [];
        const isSelected = newSelected.includes(optionValue);
        if (isSelected) {
          onAnswerChange(newSelected.filter(val => val !== optionValue));
        } else {
          onAnswerChange([...newSelected, optionValue]);
        }
      } else {
        onAnswerChange(optionValue);
      }
    }
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
        return (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            role="radiogroup"
            aria-labelledby="question-text"
            aria-required="true"
          >
            {question.options.map((option, index) => (
              <div
                key={option.id}
                role="radio"
                aria-checked={answer === option.value}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                aria-label={`Option ${index + 1}: ${option.text}`}
              >
                <AnswerOption
                  option={option}
                  type={question.type}
                  selected={answer}
                  onChange={onAnswerChange}
                />
              </div>
            ))}
          </div>
        );

      case 'multipleChoice':
        return (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            role="group"
            aria-labelledby="question-text"
            aria-describedby="multiple-choice-hint"
          >
            <div id="multiple-choice-hint" className="sr-only">
              Mehrfachauswahl möglich. Verwenden Sie die Eingabetaste oder Leertaste zum Auswählen.
            </div>
            {question.options.map((option, index) => (
              <div
                key={option.id}
                role="checkbox"
                aria-checked={answer && answer.includes(option.value)}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                aria-label={`Option ${index + 1}: ${option.text}`}
              >
                <AnswerOption
                  option={option}
                  type={question.type}
                  selected={answer}
                  onChange={onAnswerChange}
                />
              </div>
            ))}
          </div>
        );

      case 'textInput':
        return (
          <div className="w-full">
            <label htmlFor="text-input" className="sr-only">
              Ihre Antwort
            </label>
            <textarea
              id="text-input"
              value={answer || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder={question.placeholder || 'Ihre Antwort hier eingeben...'}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              aria-describedby="text-input-hint"
              aria-required="false"
            />
            <div id="text-input-hint" className="text-sm text-gray-500 mt-2">
              Geben Sie Ihre Antwort in das Textfeld ein. Dieses Feld ist optional.
            </div>
          </div>
        );

      default:
        return (
          <div className="text-red-500" role="alert">
            Unbekannter Fragetyp: {question.type}
          </div>
        );
    }
  };

  return (
    <motion.div
      className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="main"
      aria-live="polite"
    >
      {/* Decorative SVG background */}
      <motion.h2 
        id="question-text"
        className="text-2xl font-extrabold mb-4 text-gray-800 z-10 relative"
        variants={itemVariants}
        tabIndex={0}
      >
        {question.text}
      </motion.h2>
      
      {/* Question Type Indicator */}
      <div className="sr-only">
        {question.type === 'singleChoice' && 'Einfachauswahl: Wählen Sie eine Option aus.'}
        {question.type === 'multipleChoice' && 'Mehrfachauswahl: Sie können mehrere Optionen auswählen.'}
        {question.type === 'textInput' && 'Texteingabe: Geben Sie Ihre Antwort in das Textfeld ein.'}
      </div>
      
      {/* Card content */}
      <motion.div 
        className="z-10 relative"
        variants={itemVariants}
      >
        {renderQuestionInput()}
      </motion.div>
    </motion.div>
  );
};

export default React.memo(QuestionCard); 