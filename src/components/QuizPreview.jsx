import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';

const QuizPreview = ({ quiz, onClose }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (!quiz.sections || quiz.sections.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4">Keine Inhalte</h3>
          <p className="text-gray-600 mb-6">
            Das Quiz hat keine Sektionen oder Fragen. Fügen Sie zuerst Inhalte hinzu, bevor Sie eine Vorschau anzeigen.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zurück zum Editor
          </button>
        </div>
      </div>
    );
  }

  const currentSection = quiz.sections[currentSectionIndex];
  const currentQuestion = currentSection ? currentSection.questions[currentQuestionIndex] : null;
  const totalQuestions = quiz.sections.reduce((count, section) => count + section.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;

  const updateAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < quiz.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      setShowResults(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = quiz.sections[currentSectionIndex - 1];
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(prevSection.questions.length - 1);
    }
  };

  const restartPreview = () => {
    setAnswers({});
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const isBackDisabled = currentSectionIndex === 0 && currentQuestionIndex === 0;
  const isNextButtonDisabled = currentQuestion && !answers[currentQuestion.id] && currentQuestion?.type !== 'textInput';

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Quiz Ergebnisse - Vorschau</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">Quiz-Zusammenfassung</h4>
              <p className="text-blue-700">
                {answeredQuestions} von {totalQuestions} Fragen beantwortet ({Math.round((answeredQuestions / totalQuestions) * 100)}% vollständig)
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold mb-3">Antworten:</h4>
              <div className="space-y-4">
                {quiz.sections.map((section, sectionIndex) => (
                  <div key={section.id}>
                    <h5 className="font-medium text-gray-800 mb-2">{section.title}</h5>
                    <div className="ml-4 space-y-2">
                      {section.questions.map((question, questionIndex) => (
                        <div key={question.id} className="text-sm">
                          <p className="text-gray-600 mb-1">
                            Q{sectionIndex + 1}.{questionIndex + 1}: {question.text}
                          </p>
                          <p className="text-gray-800 font-medium">
                            {answers[question.id] ? (
                              Array.isArray(answers[question.id]) 
                                ? answers[question.id].join(', ')
                                : answers[question.id]
                            ) : (
                              <span className="text-red-500">Nicht beantwortet</span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={restartPreview}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Vorschau neu starten
            </button>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zurück zum Editor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-2xl font-bold">{quiz.quizTitle} - Vorschau</h3>
            <p className="text-gray-600 text-sm mt-1">
              Dies ist eine Vorschau Ihres Quiz. Alle Funktionen sind verfügbar.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <ProgressBar 
            sections={quiz.sections} 
            currentSectionIndex={currentSectionIndex}
            currentQuestionIndex={currentQuestionIndex}
            answeredQuestions={answeredQuestions}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="bg-beige px-8 pt-6 pb-8 rounded-lg shadow">
              <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-center text-gray-800">
                  {currentSection.title}
                </h1>
              </header>
              
              <AnimatePresence mode="wait">
                {currentQuestion && (
                  <QuestionCard
                    key={currentQuestion.id}
                    question={currentQuestion}
                    answer={answers[currentQuestion.id]}
                    onAnswerChange={updateAnswer}
                  />
                )}
              </AnimatePresence>
              
              <div className="mt-12 flex justify-between items-center">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={isBackDisabled}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-colors ${
                    isBackDisabled
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  <FiChevronLeft />
                  <span>Zurück</span>
                </button>
                
                <button
                  onClick={goToNextQuestion}
                  disabled={isNextButtonDisabled}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-colors ${
                    isNextButtonDisabled
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <span>
                    {currentSectionIndex === quiz.sections.length - 1 && 
                     currentQuestionIndex === currentSection.questions.length - 1
                      ? 'Ergebnisse anzeigen'
                      : 'Weiter'
                    }
                  </span>
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="text-center text-sm text-gray-600">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              📋 Vorschau-Modus
            </span>
            <span className="ml-2">
              Testen Sie Ihr Quiz vollständig vor dem Export
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview; 