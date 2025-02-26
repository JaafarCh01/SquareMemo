import React, { useState } from 'react';
import useGameStore from '../store/gameStore';
import ModeSelector from '../components/ModeSelector';

const TrainingPage = () => {
  const { currentMode, perspective, showCoordinates, updateSquareStats, updateStreak } = useGameStore();
  const [currentScore, setCurrentScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Chess Vision Trainer
        </h1>

        {/* Mode Selector Section */}
        <ModeSelector />

        {/* Training Interface */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-semibold">
                Current Score: {currentScore}
              </div>
              <div className="flex space-x-4">
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
                className={`mb-4 p-4 rounded-lg ${
                  feedback.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Chessboard will be added here */}
            <div className="aspect-square max-w-2xl mx-auto bg-gray-200 rounded-lg mb-4">
              {/* Placeholder for Chessboard component */}
              <div className="h-full flex items-center justify-center text-gray-500">
                Chessboard Component Coming Soon
              </div>
            </div>

            {/* Answer Input */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter square coordinate (e.g., e4)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // TODO: Implement answer validation
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