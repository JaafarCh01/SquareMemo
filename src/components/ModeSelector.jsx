import React from 'react';
import useGameStore from '../store/gameStore';

const modes = [
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'Learn to identify squares and build basic board vision',
    requiredLevel: 1,
  },
  {
    id: 'tactical',
    name: 'Tactical Patterns',
    description: 'Practice common tactical patterns and piece movements',
    requiredLevel: 2,
  },
  {
    id: 'mastery',
    name: 'Mastery',
    description: 'Advanced drills for complete board mastery',
    requiredLevel: 3,
  },
];

const ModeSelector = () => {
  const { currentMode, setMode, currentLevel, getLevelProgress } = useGameStore();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Select Training Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => {
          const isLocked = currentLevel < mode.requiredLevel;
          const progress = getLevelProgress(mode.requiredLevel - 1);
          
          return (
            <button
              key={mode.id}
              onClick={() => !isLocked && setMode(mode.id)}
              className={`
                relative p-6 rounded-lg border-2 transition-all
                ${currentMode === mode.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <h3 className="text-xl font-semibold mb-2">{mode.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{mode.description}</p>
              
              {isLocked && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-sm text-gray-500">
                    Unlock at Level {mode.requiredLevel}
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {!isLocked && currentMode === mode.id && (
                <span className="absolute top-2 right-2">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;
