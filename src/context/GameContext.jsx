import { createContext, useContext, useState } from 'react';
import { Chess } from 'chess.js';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [game, setGame] = useState(new Chess());
  const [targetSquare, setTargetSquare] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [settings, setSettings] = useState({
    isBlackPerspective: false,
    showCoordinates: true,
    soundEnabled: true,
    mode: 'squareToCoord', // 'coordToSquare', 'timed', 'blindfold'
    focusArea: 'all', // 'diagonals', 'center', 'corners', etc.
    timeLimit: 60, // seconds
  });

  // Track progress per square: { a1: { correct: 3, incorrect: 1 }, ... }
  const [progressMap, setProgressMap] = useState(
    Array.from({ length: 64 }, (_, i) => {
      const file = 'abcdefgh'[i % 8];
      const rank = Math.floor(i / 8) + 1;
      return { square: `${file}${rank}`, correct: 0, incorrect: 0 };
    }).reduce((acc, curr) => ({ ...acc, [curr.square]: curr }), {})
  );

  const generateRandomSquare = () => {
    let square;
    const files = 'abcdefgh';
    const ranks = '12345678';
    
    // Filter squares based on focus area
    const validSquares = Object.keys(progressMap).filter(sq => {
      const file = sq[0];
      const rank = parseInt(sq[1]);
      switch (settings.focusArea) {
        case 'diagonals': return file === String.fromCharCode(97 + (rank - 1));
        case 'center': return ['d4', 'd5', 'e4', 'e5'].includes(sq);
        case 'corners': return ['a1', 'a8', 'h1', 'h8'].includes(sq);
        default: return true;
      }
    });

    square = validSquares[Math.floor(Math.random() * validSquares.length)];
    setTargetSquare(square);
    return square;
  };

  return (
    <GameContext.Provider
      value={{
        game,
        targetSquare,
        stats,
        settings,
        progressMap,
        generateRandomSquare,
        setGame,
        setStats,
        setSettings,
        setProgressMap,
        userAnswer,
        setUserAnswer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);