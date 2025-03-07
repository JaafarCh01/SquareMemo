import React, { useState } from 'react';
import useGameStore from '../store/gameStore';
import ModeSelector from '../components/ModeSelector';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const TrainingPage = () => {
  const { currentMode, perspective, showCoordinates, updateSquareStats, updateStreak } = useGameStore();
  const [currentScore, setCurrentScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [game] = useState(new Chess()); // Initialize empty chess position

  const handleAnswer = (answer, correctSquare) => {
    const isCorrect = answer.toLowerCase() === correctSquare.toLowerCase();
    updateSquareStats(correctSquare, isCorrect);
    
    if (isCorrect) {
      setCurrentScore(prev => prev + 1);
      setFeedback({
        type: 'success',
        message: 'Correct! Well done!'
      });
      updateStreak();
    } else {
      setFeedback({
        type: 'error',
        message: `Incorrect. The correct square was ${correctSquare}`
      });
    }

    // Clear feedback after 2 seconds
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Mode Selector Section */}
      <div className="flex-none bg-white">
        <div className="max-w-[2000px] mx-auto">
          <ModeSelector />
        </div>
      </div>

      {/* Training Interface */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="max-w-[2000px] mx-auto px-6 py-8">
          <div className="flex flex-col bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-semibold">
                Current Score: {currentScore}
              </div>
              <div className="flex space-x-6">
                <div className="text-gray-600">
                  Playing as {perspective}
                </div>
                <div className="text-gray-600">
                  Coordinates: {showCoordinates ? 'Shown' : 'Hidden'}
                </div>
              </div>
            </div>

            {/* Feedback Display */}
            {feedback && (
              <div
                className={`mb-6 p-4 rounded-lg text-lg ${
                  feedback.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Chessboard */}
            <div className="flex items-center justify-center py-4">
              <div style={{ width: '100%', maxWidth: '700px' }}>
                <Chessboard 
                  position={game.fen()}
                  boardOrientation={perspective === 'black' ? 'black' : 'white'}
                  showBoardNotation={showCoordinates}
                  customBoardStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </div>
            </div>

            {/* Answer Input */}
            <div className="max-w-md w-full mx-auto mt-8">
              <input
                type="text"
                placeholder="Enter square coordinate (e.g., e4)"
                className="w-full px-6 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswer(e.target.value, 'e4');
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage; 