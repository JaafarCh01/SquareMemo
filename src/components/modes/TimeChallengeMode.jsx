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
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [targetSquare, setTargetSquare] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timePerSquare, setTimePerSquare] = useState(INITIAL_TIME_PER_SQUARE);
  const [squareTimer, setSquareTimer] = useState(INITIAL_TIME_PER_SQUARE);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimePerSquare(INITIAL_TIME_PER_SQUARE);
    setTargetSquare(generateRandomSquare());
    setSquareTimer(INITIAL_TIME_PER_SQUARE);
  };

  const handleSquareClick = (square) => {
    if (gameState !== 'playing' || feedback.show) return;

    setSelectedSquare(square);
    const isCorrect = square === targetSquare;

    setFeedback({ show: true, isCorrect });

    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
      
      // Decrease time per square as player improves
      if (streak > 0 && streak % 5 === 0) {
        setTimePerSquare(Math.max(1, timePerSquare - 0.5));
      }
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false });
      setSelectedSquare(null);
      setTargetSquare(generateRandomSquare());
      setSquareTimer(timePerSquare);
    }, 500);
  };

  // Main game timer
  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setGameState('finished');
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Square timer
  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setSquareTimer((time) => {
          if (time <= 0) {
            setStreak(0);
            setTargetSquare(generateRandomSquare());
            return timePerSquare;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timePerSquare]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Time Challenge Mode</h2>
        <div className="flex gap-4">
          <div className="text-xl font-semibold">Score: {score}</div>
          <div className="text-xl font-semibold">Time: {timeLeft}s</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        {gameState === 'ready' && (
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Ready to Start?</h3>
            <p className="mb-6 text-gray-600">
              Find as many squares as you can in {GAME_DURATION} seconds!
              The faster you are, the more points you'll score.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg"
              onClick={startGame}
            >
              Start Challenge
            </motion.button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg">
                Find square: <span className="font-bold">{targetSquare}</span>
              </div>
              <div className="flex gap-4">
                <div>Streak: {streak}</div>
                <div>Best Streak: {bestStreak}</div>
                <div>Time per square: {squareTimer}s</div>
              </div>
            </div>

            {/* Chess Board */}
            <div className="max-w-[600px] mx-auto mb-6">
              <div className="grid grid-cols-8 gap-0.5">
                {Array.from({ length: 64 }, (_, i) => {
                  const file = String.fromCharCode(97 + (i % 8));
                  const rank = Math.floor(8 - i / 8);
                  const square = `${file}${rank}`;
                  const isDark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
                  const isSelected = square === selectedSquare;

                  return (
                    <motion.div
                      key={square}
                      whileHover={{ scale: 1.05 }}
                      className={`
                        aspect-square flex items-center justify-center text-sm font-medium cursor-pointer
                        ${isDark ? 'bg-gray-300' : 'bg-gray-100'}
                        ${isSelected ? 'ring-2 ring-blue-500' : ''}
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
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${(squareTimer / timePerSquare) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Time's Up!</h3>
            <div className="space-y-2 mb-6">
              <p className="text-xl">Final Score: {score}</p>
              <p>Best Streak: {bestStreak}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg"
              onClick={startGame}
            >
              Play Again
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeChallengeMode; 