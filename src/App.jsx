import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import ResultsPage from './components/ResultsPage';
import StartScreen from './components/StartScreen';
import quizData from './data/marvel_questions.json';

const App = () => {
  const [sections] = useState(quizData.sections);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection ? currentSection.questions[currentQuestionIndex] : null;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  const totalQuestions = sections.reduce((count, section) => count + section.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;

  const updateAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    });
  };

  const goToNextQuestion = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentQuestionIndex < currentSection.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        setShowResults(true);
      }
      
      setIsTransitioning(false);
    }, 300);
  };

  const goToPreviousQuestion = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else if (currentSectionIndex > 0) {
        const prevSection = sections[currentSectionIndex - 1];
        setCurrentSectionIndex(currentSectionIndex - 1);
        setCurrentQuestionIndex(prevSection.questions.length - 1);
      }
      
      setIsTransitioning(false);
    }, 300);
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setQuizStarted(false);
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // Navigation button disabled states
  const isBackDisabled = currentSectionIndex === 0 && currentQuestionIndex === 0;
  const isNextButtonDisabled = currentQuestion && !answers[currentQuestion.id] && currentQuestion?.type !== 'textInput';
  
  if (!quizStarted) {
    return <StartScreen onStartQuiz={handleStartQuiz} />;
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-soft-pink py-12 px-4 sm:px-6">
        <ResultsPage 
          answers={answers} 
          questions={sections} 
          resultMessages={quizData.resultMessages}
        />
        <div className="text-center mt-8">
          <button 
            onClick={restartQuiz}
            className="bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
          >
            Quiz neu starten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-pink">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-8">
          <ProgressBar 
            sections={sections} 
            currentSectionIndex={currentSectionIndex} 
          />
        </div>
        
        <div className="mb-8">
          <div className="bg-beige px-8 pt-6 pb-8 rounded-lg shadow">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-center text-gray-800">{currentSection.title}</h1>
            </header>
            
            <AnimatePresence mode="wait">
              <QuestionCard
                key={currentQuestion?.id}
                question={currentQuestion}
                answer={currentAnswer}
                onAnswerChange={updateAnswer}
              />
            </AnimatePresence>
            
            <div className="mt-12 flex justify-between items-center">
              <button
                onClick={goToPreviousQuestion}
                disabled={isBackDisabled}
                className={`px-6 py-3 rounded-lg font-bold ${
                  isBackDisabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700 transition-colors'
                }`}
              >
                Zurück
              </button>
              
              <div className="text-gray-500 font-medium">
                Frage {answeredQuestions} von {totalQuestions}
              </div>
              
              <motion.button
                whileHover={!isNextButtonDisabled ? { scale: 1.05 } : {}}
                whileTap={!isNextButtonDisabled ? { scale: 0.95 } : {}}
                onClick={goToNextQuestion}
                disabled={isNextButtonDisabled}
                className={`px-6 py-3 rounded-lg font-bold ${
                  isNextButtonDisabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800 transition-colors'
                }`}
              >
                {currentSectionIndex === sections.length - 1 && 
                 currentQuestionIndex === currentSection.questions.length - 1
                  ? 'Ergebnisse anzeigen'
                  : 'Weiter'
                }
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App; 