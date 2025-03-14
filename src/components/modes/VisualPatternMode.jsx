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
    title: 'The Lion\'s Path',
    squares: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'],
    description: 'The e-file is like a lion\'s path through the savanna, straight and powerful from e1 to e8.',
    tip: 'Think of a majestic lion walking straight up the board, marking its territory along the e-file.',
  },
  {
    id: 3,
    title: 'The Dragon\'s Diagonal',
    squares: ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'],
    description: 'The longest diagonal from a1 to h8, like a dragon\'s flight path across the sky.',
    tip: 'Imagine a dragon soaring diagonally across the board, breathing fire from corner to corner.',
  },
  {
    id: 4,
    title: 'The Zodiac Cross',
    squares: ['d4', 'e4', 'f4', 'd5', 'e5', 'f5', 'd6', 'e6', 'f6'],
    description: 'These nine central squares form a cross pattern, like the celestial cross in astrology.',
    tip: 'Think of this area as the zodiac\'s meeting point, where cosmic energies converge in the center of the board.',
  },
  {
    id: 5,
    title: 'The Eagle\'s Wings',
    squares: ['c1', 'f1', 'b2', 'g2', 'a3', 'h3'],
    description: 'These squares form wing-like patterns on both sides of the board.',
    tip: 'Visualize an eagle spreading its wings across the bottom of the board.',
  },
  {
    id: 6,
    title: 'The Scorpion\'s Strike',
    squares: ['d5', 'e5', 'c4', 'f4', 'b3', 'g3', 'a2', 'h2'],
    description: 'A scorpion-shaped pattern that spans across the board.',
    tip: 'Picture a scorpion with its claws extended (a2 and h2) and its tail ready to strike in the center (d5, e5).',
  },
  {
    id: 7,
    title: 'The Gemini Squares',
    squares: ['c3', 'd3', 'c6', 'd6', 'e3', 'f3', 'e6', 'f6'],
    description: 'Two pairs of squares on opposite sides, like the Gemini twins.',
    tip: 'Think of the duality of Gemini, reflected in these mirrored square pairs.',
  },
  {
    id: 8,
    title: 'The Phoenix Rise',
    squares: ['d1', 'e1', 'd8', 'e8', 'd4', 'e4', 'd5', 'e5'],
    description: 'A pattern connecting the center to both ends, like a phoenix rising from ashes.',
    tip: 'Visualize a phoenix ascending from the bottom squares, through the center, to the top.',
  }
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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Visual Pattern Mode</h2>
      
      <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-2xl font-semibold">{patterns[currentPattern].title}</h3>
            <span className="text-gray-500">Pattern {currentPattern + 1} of {patterns.length}</span>
          </div>
          <p className="text-gray-600">{patterns[currentPattern].description}</p>
        </div>
        
        {/* Chess Board Visualization */}
        <div className="max-w-[480px] mx-auto">
          <div className="grid grid-cols-8 gap-0.5 aspect-square">
            {Array.from({ length: 64 }, (_, i) => {
              const file = String.fromCharCode(97 + (i % 8)); // a-h
              const rank = 8 - Math.floor(i / 8); // Changed to correctly calculate ranks 1-8
              const square = `${file}${rank}`;
              const isHighlighted = patterns[currentPattern].squares.includes(square);
              const isDark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;

              return (
                <motion.div
                  key={square}
                  className={`flex items-center justify-center text-sm font-medium
                    ${isDark ? 'bg-gray-300' : 'bg-gray-100'}
                    ${isHighlighted ? 'ring-2 ring-blue-500 bg-blue-200' : ''}
                  `}
                  whileHover={{ scale: 1.05 }}
                >
                  {square}
                </motion.div>
              );
            })}
          </div>
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

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-2">
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