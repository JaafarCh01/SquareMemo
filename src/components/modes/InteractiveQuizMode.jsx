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
  const [questions] = useState(generateQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSquares, setSelectedSquares] = useState([]);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false });
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSquareClick = (square) => {
    if (feedback.show) return;

    if (currentQuestion.type === questionTypes.ADJACENT_SQUARES) {
      setSelectedSquares((prev) => 
        prev.includes(square) 
          ? prev.filter(s => s !== square)
          : [...prev, square]
      );
    } else {
      setSelectedSquares([square]);
      checkAnswer(square);
    }
  };

  const checkAnswer = (answer = selectedSquares) => {
    let isCorrect = false;

    if (currentQuestion.type === questionTypes.ADJACENT_SQUARES) {
      const selectedSet = new Set(answer);
      const correctSet = new Set(currentQuestion.correctAnswer);
      isCorrect = selectedSet.size === correctSet.size && 
        [...selectedSet].every(square => correctSet.has(square));
    } else {
      isCorrect = answer === currentQuestion.correctAnswer;
    }

    setFeedback({ show: true, isCorrect });
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false });
      setSelectedSquares([]);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 1500);
  };

  const handleSubmit = () => {
    if (currentQuestion.type === questionTypes.ADJACENT_SQUARES) {
      checkAnswer(selectedSquares);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Interactive Quiz Mode</h2>
        <div className="text-xl font-semibold">
          Score: {score}/{questions.length}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>

          {/* Chess Board */}
          <div className="grid grid-cols-8 gap-1 mb-6">
            {Array.from({ length: 64 }, (_, i) => {
              const file = String.fromCharCode(97 + (i % 8));
              const rank = Math.floor(8 - i / 8);
              const square = `${file}${rank}`;
              const isDark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
              const isSelected = selectedSquares.includes(square);
              const isTarget = currentQuestion.type === questionTypes.NAME_SQUARE && 
                             square === currentQuestion.targetSquare;

              return (
                <motion.div
                  key={square}
                  whileHover={{ scale: 1.1 }}
                  className={`
                    aspect-square flex items-center justify-center text-sm font-medium cursor-pointer
                    ${isDark ? 'bg-gray-300' : 'bg-gray-100'}
                    ${isSelected ? 'ring-2 ring-blue-500 bg-blue-200' : ''}
                    ${isTarget ? 'ring-2 ring-yellow-500 bg-yellow-200' : ''}
                    ${feedback.show && isSelected ? 
                      (feedback.isCorrect ? 'bg-green-200' : 'bg-red-200') : ''}
                  `}
                  onClick={() => handleSquareClick(square)}
                >
                  {square}
                </motion.div>
              );
            })}
          </div>

          {/* Feedback Message */}
          {feedback.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center p-4 rounded-lg mb-4 ${
                feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {feedback.isCorrect ? 'Correct! 🎉' : 'Try again! 💪'}
            </motion.div>
          )}

          {/* Submit Button for Adjacent Squares Question */}
          {currentQuestion.type === questionTypes.ADJACENT_SQUARES && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg mt-4"
              onClick={handleSubmit}
            >
              Submit Answer
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveQuizMode; 