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
    <div className="flex-1 flex flex-col min-h-0">
      {/* Mode Selector Section */}
      <div className="flex-none bg-white">
        <div className="max-w-[2000px] mx-auto">
          <ModeSelector />
        </div>
      </div>

      {/* Training Interface */}
      <div className="flex-1 min-h-0 bg-gray-50">
        <div className="h-full max-w-[2000px] mx-auto px-6 py-8">
          <div className="flex flex-col h-full bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6 flex-none">
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
                className={`mb-6 p-4 rounded-lg text-lg flex-none ${
                  feedback.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Chessboard */}
            <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
              <div className="aspect-square w-full max-w-3xl bg-gray-200 rounded-lg">
                {/* Placeholder for Chessboard component */}
                <div className="h-full flex items-center justify-center text-gray-500 text-xl">
                  Chessboard Component Coming Soon
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="max-w-md w-full mx-auto mt-8 flex-none">
              <input
                type="text"
                placeholder="Enter square coordinate (e.g., e4)"
                className="w-full px-6 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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