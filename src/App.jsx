import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import ResultsPage from './components/ResultsPage';
import StartScreen from './components/StartScreen';
import QuizEditor from './components/QuizEditor';
import { findNextQuestion, findPreviousQuestion, validateQuizNavigation } from './utils/quizNavigation';
import quizData from './data/marvel_questions.json';

const App = () => {
  const [mode, setMode] = useState('start'); // 'start', 'taking', 'editor', 'results'
  const [currentQuizData, setCurrentQuizData] = useState(quizData); // Current quiz being used
  const [loadedQuizData, setLoadedQuizData] = useState(null); // Quiz data loaded from file
  const [sections] = useState(quizData.sections);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Memoized computed values
  const activeSections = useMemo(() => 
    loadedQuizData ? loadedQuizData.sections : sections, 
    [loadedQuizData, sections]
  );
  
  const activeResultMessages = useMemo(() => 
    loadedQuizData ? loadedQuizData.resultMessages : quizData.resultMessages,
    [loadedQuizData]
  );

  const currentSection = useMemo(() => 
    activeSections[currentSectionIndex], 
    [activeSections, currentSectionIndex]
  );
  
  const currentQuestion = useMemo(() => 
    currentSection ? currentSection.questions[currentQuestionIndex] : null,
    [currentSection, currentQuestionIndex]
  );
  
  const currentAnswer = useMemo(() => 
    currentQuestion ? answers[currentQuestion.id] : null,
    [currentQuestion, answers]
  );

  const totalQuestions = useMemo(() => 
    activeSections.reduce((count, section) => count + section.questions.length, 0),
    [activeSections]
  );
  
  const answeredQuestions = useMemo(() => 
    Object.keys(answers).length,
    [answers]
  );

  // Validate navigation on quiz data changes
  const navigationValidation = useMemo(() => {
    return validateQuizNavigation(activeSections);
  }, [activeSections]);

  const updateAnswer = useCallback((answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  }, [currentQuestion?.id]);

  const goToNextQuestion = useCallback(() => {
    if (isTransitioning) return;
    
    const currentAnswer = answers[currentQuestion.id];
    const nextRoute = findNextQuestion(
      currentQuestion, 
      currentAnswer, 
      activeSections, 
      currentSectionIndex, 
      currentQuestionIndex
    );
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      switch (nextRoute.type) {
        case 'end':
          setShowResults(true);
          setMode('results');
          break;
        
        case 'section':
          setCurrentSectionIndex(nextRoute.sectionIndex);
          setCurrentQuestionIndex(nextRoute.questionIndex);
          break;
        
        case 'question':
          setCurrentSectionIndex(nextRoute.sectionIndex);
          setCurrentQuestionIndex(nextRoute.questionIndex);
          break;
        
        default:
          // Fallback to results if something goes wrong
          console.warn('Unknown navigation result, ending quiz');
          setShowResults(true);
          setMode('results');
      }
      
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, answers, currentQuestion, activeSections, currentSectionIndex, currentQuestionIndex]);

  const goToPreviousQuestion = useCallback(() => {
    if (isTransitioning) return;
    
    const previousRoute = findPreviousQuestion(activeSections, currentSectionIndex, currentQuestionIndex);
    
    if (!previousRoute) {
      return; // Already at the beginning
    }
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentSectionIndex(previousRoute.sectionIndex);
      setCurrentQuestionIndex(previousRoute.questionIndex);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, activeSections, currentSectionIndex, currentQuestionIndex]);

  const restartQuiz = useCallback(() => {
    setAnswers({});
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setMode('start');
  }, []);

  const handleStartQuiz = useCallback(() => {
    // Validate navigation before starting
    if (navigationValidation.errors.length > 0) {
      console.error('Quiz navigation errors:', navigationValidation.errors);
      alert('Quiz hat Navigationsfehler. Bitte überprüfen Sie die Konfiguration.');
      return;
    }
    
    if (navigationValidation.warnings.length > 0) {
      console.warn('Quiz navigation warnings:', navigationValidation.warnings);
    }
    
    setMode('taking');
  }, [navigationValidation]);

  const handleGoToEditor = useCallback(() => {
    setMode('editor');
  }, []);

  const handleBackFromEditor = useCallback(() => {
    setMode('start');
  }, []);

  const handleLoadQuiz = useCallback((quizData) => {
    setLoadedQuizData(quizData);
    setCurrentQuizData(quizData);
    // Reset quiz state
    setAnswers({});
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    // Go to editor with loaded data
    setMode('editor');
  }, []);

  const handleLoadAndRunQuiz = useCallback((quizData) => {
    setLoadedQuizData(quizData);
    setCurrentQuizData(quizData);
    // Reset quiz state
    setAnswers({});
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    // Start the quiz immediately
    setMode('taking');
  }, []);

  // Navigation button disabled states
  const isBackDisabled = useMemo(() => 
    currentSectionIndex === 0 && currentQuestionIndex === 0,
    [currentSectionIndex, currentQuestionIndex]
  );
  
  const isNextButtonDisabled = useMemo(() => 
    currentQuestion && !answers[currentQuestion.id] && currentQuestion?.type !== 'textInput',
    [currentQuestion, answers]
  );
  
  // Quiz Editor Mode
  if (mode === 'editor') {
    return <QuizEditor onBack={handleBackFromEditor} initialQuizData={loadedQuizData} />;
  }

  // Start Screen Mode
  if (mode === 'start') {
    return <StartScreen 
      onStartQuiz={handleStartQuiz} 
      onGoToEditor={handleGoToEditor} 
      onLoadQuiz={handleLoadQuiz}
      onLoadAndRunQuiz={handleLoadAndRunQuiz}
    />;
  }

  // Results Mode
  if (mode === 'results') {
    return (
      <div className="min-h-screen bg-soft-pink py-12 px-4 sm:px-6">
        <ResultsPage 
          answers={answers} 
          questions={activeSections} 
          resultMessages={activeResultMessages}
        />
        <div className="text-center mt-8 space-x-4">
          <button 
            onClick={restartQuiz}
            className="bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
          >
            Quiz neu starten
          </button>
          <button 
            onClick={handleGoToEditor}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold"
          >
            Eigenes Quiz erstellen
          </button>
        </div>
      </div>
    );
  }

  // Quiz Taking Mode
  return (
    <div className="min-h-screen bg-soft-pink">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-8">
          <ProgressBar 
            sections={activeSections} 
            currentSectionIndex={currentSectionIndex}
            currentQuestionIndex={currentQuestionIndex}
            answeredQuestions={answeredQuestions}
          />
        </div>
        
        <div className="mb-8">
          <div className="bg-beige px-8 pt-6 pb-8 rounded-lg shadow">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-center text-gray-800">{currentSection?.title || 'Quiz'}</h1>
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
                {currentSectionIndex === activeSections.length - 1 && 
                 currentQuestionIndex === currentSection?.questions?.length - 1
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