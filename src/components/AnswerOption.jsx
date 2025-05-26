import React from 'react';
import { motion } from 'framer-motion';

const AnswerOption = ({ option, type, selected, onChange, isSquare, backgroundSvg }) => {
  const isSelected = type === 'multipleChoice' 
    ? selected && selected.includes(option.value)
    : selected === option.value;

  const handleClick = () => {
    if (type === 'multipleChoice') {
      const newSelected = selected ? [...selected] : [];
      if (isSelected) {
        onChange(newSelected.filter(val => val !== option.value));
      } else {
        onChange([...newSelected, option.value]);
      }
    } else {
      onChange(option.value);
    }
  };

  const baseClasses = "p-4 rounded-lg border-2 cursor-pointer transition-all w-full h-full flex flex-col items-center justify-center text-center font-bold relative overflow-hidden";
  const selectedClasses = "border-primary-blue bg-primary-blue text-white";
  const unselectedClasses = "border-gray-200 bg-soft-pink text-white text-border-black hover:border-light-blue hover:shadow-md";
  
  const sizeAndPaddingClasses = isSquare ? "p-2 text-sm" : "p-6 text-lg";

  return (
    <motion.div 
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses} ${sizeAndPaddingClasses}`}
      whileHover={{ scale: isSquare ? 1.03 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      style={{
        backgroundImage: isSelected || !backgroundSvg ? 'none' : `url(${backgroundSvg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom left',
        backgroundSize: '90%'
      }}
    >
      <div className={`font-bolder text-xl ${isSquare ? 'leading-tight' : ''} relative z-10`}>{option.text}</div>
    </motion.div>
  );
};

export default AnswerOption; 