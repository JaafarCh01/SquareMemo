import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const questionTypes = {
  FIND_SQUARE: 'find_square',
  FIND_PATTERN: 'find_pattern',
  RELATIVE_POSITION: 'relative_position',
  THEMED_SQUARES: 'themed_squares'
};

const themedQuestions = [
  {
    type: questionTypes.FIND_PATTERN,
    title: "Dragon's Path",
    squares: ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'],
    question: "Click all squares along the Dragon's diagonal path",
    description: "The dragon soars from a1 to h8",
    hint: "Think of a dragon breathing fire diagonally across the board, starting from the bottom-left corner (a1) and moving up one square at a time."
  },
  {
    type: questionTypes.FIND_PATTERN,
    title: "Eagle's Wings",
    squares: ['c1', 'f1', 'b2', 'g2', 'a3', 'h3'],
    question: "Find the squares that form the Eagle's wings",
    description: "The eagle spreads its wings across the bottom ranks",
    hint: "Picture an eagle with spread wings: the wing tips are at a3 and h3, the middle joints at b2 and g2, and the shoulders at c1 and f1."
  },
  {
    type: questionTypes.THEMED_SQUARES,
    title: "Zodiac Center",
    squares: ['d4', 'e4', 'f4', 'd5', 'e5', 'f5', 'd6', 'e6', 'f6'],
    question: "Click the squares forming the Zodiac cross in the center",
    description: "The cosmic cross where energies meet",
    hint: "Visualize a 3x3 square in the center of the board. It starts at d4 and extends to f6, forming a perfect square of cosmic energy."
  }
];

const relativePositions = [
  {
    type: questionTypes.RELATIVE_POSITION,
    question: "Click the square that is a Knight's move from e4",
    target: 'e4',
    correctAnswers: ['f6', 'd6', 'c5', 'c3', 'd2', 'f2', 'g3', 'g5'],
    description: "Think of an L-shape movement",
    hint: "A knight moves in an L-shape: 2 squares in one direction and then 1 square perpendicular to that. From e4, think of all possible L-shapes you can make."
  },
  {
    type: questionTypes.RELATIVE_POSITION,
    question: "Click all squares diagonally adjacent to d5",
    target: 'd5',
    correctAnswers: ['c6', 'e6', 'c4', 'e4'],
    description: "Find all squares one step diagonally from the target",
    hint: "From d5, look for squares that are one step away diagonally in all four directions (like a bishop's move)."
  }
];

const generateQuestions = () => {
  const basicQuestions = [
    {
      type: questionTypes.FIND_SQUARE,
      question: 'Find the square e4',
      correctAnswer: 'e4',
      description: 'The key central square',
      hint: "e4 is in the center of the board. 'e' is the fifth file from the left, and '4' is the fourth rank from the bottom."
    },
    {
      type: questionTypes.FIND_SQUARE,
      question: 'Locate the square f6',
      correctAnswer: 'f6',
      description: 'An important square for king safety',
      hint: "'f' is the sixth file from the left, and '6' is the sixth rank from the bottom. This square is often important for protecting the castled king."
    }
  ];

  return [...basicQuestions, ...themedQuestions, ...relativePositions];
};

const InteractiveQuizMode = () => {
  const [questions] = useState(generateQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSquares, setSelectedSquares] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSquareClick = (square) => {
    if (isAnswerChecked) return;

    if (currentQuestion.type === questionTypes.FIND_PATTERN || 
        currentQuestion.type === questionTypes.THEMED_SQUARES ||
        currentQuestion.type === questionTypes.RELATIVE_POSITION) {
      setSelectedSquares(prev => 
        prev.includes(square) 
          ? prev.filter(s => s !== square)
          : [...prev, square]
      );
    } else {
      setSelectedSquares([square]);
      checkAnswer([square]);
    }
  };

  const checkAnswer = (selectedAnswer = selectedSquares) => {
    setIsAnswerChecked(true);
    let isCorrect = false;

    if (currentQuestion.type === questionTypes.FIND_SQUARE) {
      isCorrect = selectedAnswer[0] === currentQuestion.correctAnswer;
    } else {
      const correctSquares = currentQuestion.squares || currentQuestion.correctAnswers;
      isCorrect = selectedAnswer.length === correctSquares.length &&
        selectedAnswer.every(square => correctSquares.includes(square));
    }

    setFeedback(isCorrect ? 'Correct! Well done!' : 'Try again!');
    setFeedbackType(isCorrect ? 'success' : 'error');

    if (isCorrect) {
      setScore(score + 1);
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      setTimeout(() => {
        setIsAnswerChecked(false);
        setFeedback('');
      }, 1000);
    }
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setSelectedSquares([]);
    setFeedback('');
    setIsAnswerChecked(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Interactive Quiz Mode</h2>
      
      <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-2xl font-semibold">
              {currentQuestion.title || "Find the Square"}
            </h3>
            <span className="text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{currentQuestion.question}</p>
          {currentQuestion.description && (
            <p className="text-gray-500 text-sm italic">{currentQuestion.description}</p>
          )}
        </div>

        {/* Score Display */}
        <div className="text-lg font-semibold">
          Score: {score}
        </div>

        {/* Hint Section */}
        <motion.button
          className="w-full py-3 px-4 bg-yellow-100 rounded-lg text-left"
          onClick={() => setShowHint(!showHint)}
          animate={{ height: showHint ? 'auto' : '48px' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">💡 Need a Hint?</span>
            <span>{showHint ? '▼' : '▶'}</span>
          </div>
          {showHint && (
            <p className="mt-2 text-gray-600">{currentQuestion.hint}</p>
          )}
        </motion.button>

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
              const isSelected = selectedSquares.includes(square);
              const isTarget = currentQuestion.target === square;
              const isDark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;

              return (
                <motion.div
                  key={square}
                  className={`flex items-center justify-center text-sm font-medium cursor-pointer
                    ${isDark ? 'bg-gray-300' : 'bg-gray-100'}
                    ${isSelected ? 'ring-2 ring-blue-500 bg-blue-200' : ''}
                    ${isTarget ? 'ring-2 ring-yellow-500' : ''}
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

        {/* Submit Button for multi-select questions */}
        {(currentQuestion.type === questionTypes.FIND_PATTERN || 
          currentQuestion.type === questionTypes.THEMED_SQUARES ||
          currentQuestion.type === questionTypes.RELATIVE_POSITION) && (
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => checkAnswer()}
              disabled={selectedSquares.length === 0 || isAnswerChecked}
            >
              Submit Answer
            </motion.button>
          </div>
        )}

        {/* New Game Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg"
            onClick={() => {
              setScore(0);
              setCurrentQuestionIndex(0);
              setSelectedSquares([]);
              setFeedback('');
              setIsAnswerChecked(false);
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