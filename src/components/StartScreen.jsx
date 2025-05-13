import React from 'react';
import { motion } from 'framer-motion';
import SwirlDecoration from '../assets/SwirlDecoration.svg'; // Assuming this is the SVG for animation
import SwirlDecorationSmall from '../assets/SwirlDecorationCardSmall.svg'; // Assuming this is the SVG for animation
const StartScreen = ({ onStartQuiz }) => {
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartQuiz}
          className="bg-primary-blue text-white px-10 py-4 rounded-lg text-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
        >
          Zum Quiz
        </motion.button>
      </motion.div>

      {/* Animated SVG Decoration */}
      <motion.div
        className="absolute bottom-4 right-0 w-100 h-100 md:w-64 md:h-64 opacity-50" // Adjust size and opacity as needed
        animate={{ rotate: 360 }}
        transition={{
          loop: Infinity,
          ease: "linear",
          duration: 20 // Slower rotation
        }}
      >
        <img src={SwirlDecoration} alt="Decorative Swirl" className="w-full h-full" />
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-0 w-48 h-48 md:w-64 md:h-64 opacity-50" // Adjust size and opacity as needed
        animate={{
          y: [0, -20, 0], // Vertical floating motion
          scale: [1, 1.1, 1], // Subtle pulsing
          opacity: [0.5, 0.7, 0.5], // Fade in/out
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <img src={SwirlDecorationSmall} alt="Decorative Swirl" className="w-full h-full" />
      </motion.div>
    </div>
  );
};

export default StartScreen; 