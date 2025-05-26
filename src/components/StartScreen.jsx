import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiUpload, FiFileText, FiPlay } from 'react-icons/fi';
import { validateQuizStructure, sanitizeQuizData } from '../utils/validation';
import SwirlDecoration from '../assets/SwirlDecoration.svg'; // Assuming this is the SVG for animation
import SwirlDecorationSmall from '../assets/SwirlDecorationCardSmall.svg'; // Assuming this is the SVG for animation

const StartScreen = ({ onStartQuiz, onGoToEditor, onLoadQuiz, onLoadAndRunQuiz }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedQuizTitle, setLoadedQuizTitle] = useState(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

  const handleFileUpload = async (event, shouldRunImmediately = false) => {
    const file = event.target.files[0];
    if (!file) return;

    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      setError('Datei ist zu groß. Maximale Dateigröße: 5MB');
      event.target.value = '';
      return;
    }

    // File type validation
    if (!file.name.toLowerCase().endsWith('.json')) {
      setError('Nur JSON-Dateien sind erlaubt');
      event.target.value = '';
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      
      // Parse JSON with error handling
      let quizData;
      try {
        quizData = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Ungültige JSON-Datei: Datei konnte nicht geparst werden');
      }

      // Sanitize data first
      const sanitizedData = sanitizeQuizData(quizData);
      if (!sanitizedData) {
        throw new Error('Ungültige Quiz-Datei: Datenstruktur ist fehlerhaft');
      }

      // Comprehensive validation
      const validation = validateQuizStructure(sanitizedData);
      if (!validation.isValid) {
        const errorMessage = validation.errors.length > 3 
          ? `${validation.errors.slice(0, 3).join('; ')}... (${validation.errors.length - 3} weitere Fehler)`
          : validation.errors.join('; ');
        throw new Error(`Validierungsfehler: ${errorMessage}`);
      }
      
      setLoadedQuizTitle(sanitizedData.quizTitle);
      
      if (shouldRunImmediately) {
        // Load and run the quiz immediately
        onLoadAndRunQuiz(sanitizedData);
      } else {
        // Load into editor
        onLoadQuiz(sanitizedData);
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError(err.message || 'Unbekannter Fehler beim Laden der Datei');
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleLoadForEditing = (event) => {
    handleFileUpload(event, false);
  };

  const handleLoadAndRun = (event) => {
    handleFileUpload(event, true);
  };

  return (
    <div className="min-h-screen bg-soft-pink flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center z-10"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary-blue mb-8">
          Beteiligungsquiz
        </h1>
        
        {/* Success Message for Loaded Quiz */}
        {loadedQuizTitle && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 max-w-md mx-auto"
          >
            <div className="text-sm">
              Quiz "{loadedQuizTitle}" erfolgreich geladen!
            </div>
          </motion.div>
        )}
        
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto"
          >
            <div className="text-sm">{error}</div>
          </motion.div>
        )}
        
        <div className="space-y-4">
          {/* Start Default Quiz */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartQuiz}
            className="bg-primary-blue text-white px-10 py-4 rounded-lg text-xl font-bold shadow-lg hover:bg-blue-700 transition-colors block w-full max-w-xs mx-auto"
          >
            Standard Quiz starten
          </motion.button>
          
          {/* Load and Run Quiz */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <input
              type="file"
              accept=".json"
              onChange={handleLoadAndRun}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
              aria-label="Quiz-Datei laden und sofort starten"
            />
            <button
              className={`bg-green-600 text-white px-10 py-4 rounded-lg text-xl font-bold shadow-lg hover:bg-green-700 transition-colors block w-full max-w-xs mx-auto flex items-center justify-center space-x-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
              aria-label="Quiz aus Datei laden und sofort starten"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Laden...</span>
                </>
              ) : (
                <>
                  <FiPlay />
                  <span>Quiz laden & starten</span>
                </>
              )}
            </button>
          </motion.div>
          
          {/* Create New Quiz */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoToEditor}
            className="bg-purple-600 text-white px-10 py-4 rounded-lg text-xl font-bold shadow-lg hover:bg-purple-700 transition-colors block w-full max-w-xs mx-auto"
          >
            🎯 Eigenes Quiz erstellen
          </motion.button>
          
          {/* Load Quiz for Editing */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <input
              type="file"
              accept=".json"
              onChange={handleLoadForEditing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
              aria-label="Quiz-Datei zum Bearbeiten laden"
            />
            <button
              className={`bg-orange-600 text-white px-10 py-4 rounded-lg text-xl font-bold shadow-lg hover:bg-orange-700 transition-colors block w-full max-w-xs mx-auto flex items-center justify-center space-x-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
              aria-label="Quiz aus Datei zum Bearbeiten laden"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Laden...</span>
                </>
              ) : (
                <>
                  <FiUpload />
                  <span>Quiz bearbeiten</span>
                </>
              )}
            </button>
          </motion.div>
          
          <div className="text-sm text-gray-600 mt-4">
            Unterstützte Formate: JSON (max. 5MB)
          </div>
        </div>
        
        <p className="text-gray-600 mt-6 text-lg">
          Starte das Standard-Quiz, lade ein eigenes Quiz oder erstelle ein neues
        </p>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-10 left-10 w-32 h-32 opacity-20"
      >
        <img src={SwirlDecoration} alt="" className="w-full h-full" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-10 right-10 w-24 h-24 opacity-20"
      >
        <img src={SwirlDecorationSmall} alt="" className="w-full h-full" />
      </motion.div>
    </div>
  );
};

export default StartScreen; 