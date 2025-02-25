import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const ChessTrainer = () => {
  const [game, setGame] = useState(new Chess());
  const [targetSquare, setTargetSquare] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [mode, setMode] = useState('squareToCoord'); // or 'coordToSquare'

  // Generate random square (e.g., 'a1', 'h8')
  const generateRandomSquare = () => {
    const files = 'abcdefgh';
    const ranks = '12345678';
    const square = files[Math.floor(Math.random() * 8)] + ranks[Math.floor(Math.random() * 8)];
    setTargetSquare(square);
    return square;
  };

  // Initialize or reset game
  useEffect(() => {
    generateRandomSquare();
    setGame(new Chess());
  }, [mode]);

  // Handle Square-to-Coordinate mode submission
  const handleSquareToCoordSubmit = () => {
    if (userAnswer.toLowerCase() === targetSquare) {
      setCorrect(c => c + 1);
    } else {
      setIncorrect(i => i + 1);
    }
    setUserAnswer('');
    generateRandomSquare();
  };

  // Handle Coordinate-to-Square mode click
  const handleSquareClick = (square) => {
    if (mode === 'coordToSquare') {
      if (square === targetSquare) {
        setCorrect(c => c + 1);
      } else {
        setIncorrect(i => i + 1);
      }
      generateRandomSquare();
    }
  };

  // Custom board styling for highlighted square
  const customSquareStyles = {
    [targetSquare]: {
      backgroundColor: 'rgba(255, 255, 0, 0.4)',
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Chess Square Trainer</h1>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('squareToCoord')}
            className={`px-4 py-2 ${mode === 'squareToCoord' ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded`}
          >
            Square → Coordinate
          </button>
          <button
            onClick={() => setMode('coordToSquare')}
            className={`px-4 py-2 ${mode === 'coordToSquare' ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded`}
          >
            Coordinate → Square
          </button>
        </div>
      </div>

      {mode === 'squareToCoord' ? (
        <div className="mb-4">
          <p className="mb-2">What coordinate is this?</p>
          <Chessboard
            position={{}}
            customSquareStyles={customSquareStyles}
            boardWidth={400}
          />
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter coordinate (e.g., a1)"
            className="border p-2 mt-4"
          />
          <button
            onClick={handleSquareToCoordSubmit}
            className="bg-green-600 text-white px-4 py-2 ml-2"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <p className="mb-2">Click the square: <strong>{targetSquare}</strong></p>
          <Chessboard
            position={{}}
            onSquareClick={handleSquareClick}
            boardWidth={400}
          />
        </div>
      )}

      <div className="stats">
        <p>Correct: {correct}</p>
        <p>Incorrect: {incorrect}</p>
        <p>Accuracy: {((correct / (correct + incorrect)) * 100 || 0).toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default ChessTrainer;