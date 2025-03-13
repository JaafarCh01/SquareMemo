import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const GAME_DURATION = 60; // seconds
const INITIAL_TIME_PER_SQUARE = 5; // seconds

const generateRandomSquare = () => {
  const file = String.fromCharCode(97 + Math.floor(Math.random() * 8)); // a-h
  const rank = Math.floor(Math.random() * 8) + 1; // 1-8
  return `${file}${rank}`;
};

const TimeChallengeMode = () => {
  const [targetSquare, setTargetSquare] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');

  useEffect(() => {
    let timer;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  const generateNewTarget = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    setTargetSquare(randomFile + randomRank);
    setFeedback('');
    setFeedbackType('');
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsGameActive(true);
    generateNewTarget();
  };

  const handleSquareClick = (square) => {
    if (!isGameActive) return;

    if (square === targetSquare) {
      setScore(score + 1);
      setFeedback('Correct! Well done!');
      setFeedbackType('success');
      setTimeout(() => {
        generateNewTarget();
      }, 300);
    } else {
      setFeedback('Try again!');
      setFeedbackType('error');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Time Challenge Mode</h2>
      
      <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
        <div>
          <h3 className="text-2xl font-semibold mb-3">Race Against Time</h3>
          <p className="text-gray-600">
            {isGameActive 
              ? `Find square: ${targetSquare}`
              : 'Click Start Game to begin the challenge!'}
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="text-lg font-semibold">Time: {timeLeft}s</div>
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

        {/* Game Control Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            onClick={startGame}
            disabled={isGameActive}
          >
            {isGameActive ? 'Game in Progress' : 'Start Game'}
          </motion.button>
        </div>

        {/* Game Over Message */}
        {!isGameActive && score > 0 && (
          <div className="text-center text-xl font-semibold text-gray-700">
            Game Over! Final Score: {score}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeChallengeMode; 