import React, { useState } from 'react';
import { motion } from 'framer-motion';

const patterns = [
  {
    id: 1,
    title: 'The Center Squares',
    squares: ['d4', 'd5', 'e4', 'e5'],
    description: 'The central squares are the heart of the chess board. They form a 2x2 square in the middle.',
    tip: 'Remember: d4, d5, e4, e5 form a perfect square in the center.',
  },
  {
    id: 2,
    title: 'The First Rank',
    squares: ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
    description: 'The first rank is where White\'s pieces start. From left to right: a1 to h1.',
    tip: 'Think of it as reading from left to right, just like reading a book.',
  },
  {
    id: 3,
    title: 'The Diagonal Pattern',
    squares: ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'],
    description: 'The main diagonal runs from a1 to h8.',
    tip: 'Notice how both numbers increase by 1 as you move diagonally.',
  },
];

const VisualPatternMode = () => {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [showTip, setShowTip] = useState(false);

  const nextPattern = () => {
    setCurrentPattern((prev) => (prev + 1) % patterns.length);
    setShowTip(false);
  };

  const previousPattern = () => {
    setCurrentPattern((prev) => (prev - 1 + patterns.length) % patterns.length);
    setShowTip(false);
  };

  const toggleTip = () => {
    setShowTip(!showTip);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Visual Pattern Mode</h2>
      
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">{patterns[currentPattern].title}</h3>
          <p className="text-gray-600 mb-4">{patterns[currentPattern].description}</p>
          
          {/* Chess Board Visualization */}
          <div className="grid grid-cols-8 gap-1 mb-6">
            {Array.from({ length: 64 }, (_, i) => {
              const file = String.fromCharCode(97 + (i % 8)); // a-h
              const rank = Math.floor(8 - i / 8); // 1-8
              const square = `${file}${rank}`;
              const isHighlighted = patterns[currentPattern].squares.includes(square);
              const isDark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;

              return (
                <motion.div
                  key={square}
                  className={`aspect-square flex items-center justify-center text-sm font-medium
                    ${isDark ? 'bg-gray-300' : 'bg-gray-100'}
                    ${isHighlighted ? 'ring-2 ring-blue-500 bg-blue-200' : ''}
                  `}
                  whileHover={{ scale: 1.1 }}
                >
                  {square}
                </motion.div>
              );
            })}
          </div>

          {/* Tip Section */}
          <motion.button
            className="w-full py-3 px-4 bg-yellow-100 rounded-lg text-left"
            onClick={toggleTip}
            animate={{ height: showTip ? 'auto' : '48px' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">💡 Learning Tip</span>
              <span>{showTip ? '▼' : '▶'}</span>
            </div>
            {showTip && (
              <p className="mt-2 text-gray-600">{patterns[currentPattern].tip}</p>
            )}
          </motion.button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gray-200 rounded-lg"
            onClick={previousPattern}
          >
            Previous Pattern
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            onClick={nextPattern}
          >
            Next Pattern
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default VisualPatternMode; 