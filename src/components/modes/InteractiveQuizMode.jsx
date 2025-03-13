import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const questionTypes = {
  FIND_SQUARE: 'find_square',
  NAME_SQUARE: 'name_square',
  ADJACENT_SQUARES: 'adjacent_squares',
};

const generateQuestions = () => {
  const questions = [
    {
      type: questionTypes.FIND_SQUARE,
      question: 'Click on the square e4',
      correctAnswer: 'e4',
      difficulty: 1,
    },
    {
      type: questionTypes.NAME_SQUARE,
      question: 'What is the name of the highlighted square?',
      targetSquare: 'd5',
      correctAnswer: 'd5',
      difficulty: 1,
    },
    {
      type: questionTypes.ADJACENT_SQUARES,
      question: 'Click all squares adjacent to d4',
      correctAnswer: ['c3', 'c4', 'c5', 'd3', 'd5', 'e3', 'e4', 'e5'],
      difficulty: 2,
    },
  ];
  return questions;
};

const InteractiveQuizMode = () => {
  const [targetSquare, setTargetSquare] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');

  useEffect(() => {
    generateNewTarget();
  }, []);

  const generateNewTarget = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    setTargetSquare(randomFile + randomRank);
    setFeedback('');
    setFeedbackType('');
  };

  const handleSquareClick = (square) => {
    if (square === targetSquare) {
      setScore(score + 1);
      setFeedback('Correct! Well done!');
      setFeedbackType('success');
      setTimeout(generateNewTarget, 1000);
    } else {
      setFeedback('Try again!');
      setFeedbackType('error');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Interactive Quiz Mode</h2>
      
      <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
        <div>
          <h3 className="text-2xl font-semibold mb-3">Find the Square</h3>
          <p className="text-gray-600">Click on square: <span className="font-bold">{targetSquare}</span></p>
        </div>

        {/* Score Display */}
        <div className="text-lg font-semibold">
          Score: {score}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className={`text-lg font-medium ${
            feedbackType === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {feedback}
          </div>
        )}

        {/* Chess Board */}
        <div className="max-w-[480px] mx-auto">
          <div className="grid grid-cols-8 gap-0.5 aspect-square">
            {Array.from({ length: 64 }, (_, i) => {
              const file = String.fromCharCode(97 + (i % 8));
              const rank = 8 - Math.floor(i / 8);
              const square = `${file}${rank}`;
              const isDark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;

              return (
                <motion.div
                  key={square}
                  className={`flex items-center justify-center text-sm font-medium cursor-pointer
                    ${isDark ? 'bg-gray-300' : 'bg-gray-100'}
                  `}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleSquareClick(square)}
                >
                  {square}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* New Game Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => {
              setScore(0);
              generateNewTarget();
            }}
          >
            New Game
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveQuizMode; 