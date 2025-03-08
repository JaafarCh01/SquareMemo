import React from 'react';
import { Chessboard } from 'react-chessboard';
import { useTrainingSession } from '../hooks/useTrainingSession';

export default function TrainingPage() {
  const {
    targetSquare,
    selectedSquare,
    isCorrect,
    score,
    attempts,
    gameOver,
    orientation,
    handleSquareClick,
    resetGame,
  } = useTrainingSession();

  const customSquareStyles = {
    ...(selectedSquare && {
      [selectedSquare]: {
        backgroundColor: isCorrect ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)',
      },
    }),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Chess Square Trainer</h1>
          <div className="flex justify-center space-x-8 mb-4">
            <div className="text-lg">
              Score: <span className="font-bold">{score}</span>
            </div>
            <div className="text-lg">
              Attempts: <span className="font-bold">{attempts}/20</span>
            </div>
            <div className="text-lg">
              Accuracy:{' '}
              <span className="font-bold">
                {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
              </span>
            </div>
          </div>
          {!gameOver ? (
            <div className="text-xl font-bold mb-4">
              Find square: <span className="text-blue-600">{targetSquare}</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-2xl font-bold">
                Training Complete!
              </div>
              <button
                onClick={resetGame}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start New Session
              </button>
            </div>
          )}
        </div>

        <div className="aspect-w-1 aspect-h-1 max-w-[600px] mx-auto">
          <Chessboard
            id="training-board"
            boardOrientation={orientation}
            customSquareStyles={customSquareStyles}
            onSquareClick={handleSquareClick}
            showBoardNotation={true}
          />
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold mb-4">How to Play</h2>
          <p className="text-gray-700">
            Click on the square that matches the coordinate shown above the board.
            The board orientation may change randomly to help you learn the squares
            from both perspectives.
          </p>
        </div>
      </div>
    </div>
  );
} 