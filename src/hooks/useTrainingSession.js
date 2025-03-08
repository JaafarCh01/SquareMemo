import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { createTrainingSession, updateUserProgress } from '../utils/db';

const SQUARES = [
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'
];

export function useTrainingSession() {
  const { user } = useAuth();
  const [targetSquare, setTargetSquare] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [orientation, setOrientation] = useState('white');

  // Generate a new target square
  const generateNewTarget = useCallback(() => {
    const newTarget = SQUARES[Math.floor(Math.random() * SQUARES.length)];
    setTargetSquare(newTarget);
    setSelectedSquare(null);
    setIsCorrect(null);
  }, []);

  // Initialize the game
  useEffect(() => {
    generateNewTarget();
  }, [generateNewTarget]);

  // Handle square selection
  const handleSquareClick = async (square) => {
    if (gameOver || !targetSquare) return;

    setSelectedSquare(square);
    const correct = square === targetSquare;
    setIsCorrect(correct);
    setAttempts(prev => prev + 1);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    // Wait a moment before generating new target
    setTimeout(() => {
      if (attempts + 1 >= 20) {
        endSession();
      } else {
        generateNewTarget();
        // Randomly flip board orientation (30% chance)
        if (Math.random() < 0.3) {
          setOrientation(prev => prev === 'white' ? 'black' : 'white');
        }
      }
    }, 1000);
  };

  // End the training session
  const endSession = async () => {
    setGameOver(true);
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000); // in seconds

    if (user) {
      try {
        // Create training session record
        await createTrainingSession(user.uid, {
          score,
          attempts,
          duration: sessionDuration,
          timestamp: new Date(),
        });

        // Update user progress
        await updateUserProgress(user.uid, {
          trainingTime: sessionDuration,
          correctAnswers: score,
          attempts: attempts,
        });
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setGameOver(false);
    setOrientation('white');
    generateNewTarget();
  };

  return {
    targetSquare,
    selectedSquare,
    isCorrect,
    score,
    attempts,
    gameOver,
    orientation,
    handleSquareClick,
    resetGame,
  };
} 