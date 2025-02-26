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
    <div className="w-full px-6">
      <h2 className="text-2xl font-bold mb-6">Select Training Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => {
          const isLocked = currentLevel < mode.requiredLevel;
          const progress = getLevelProgress(mode.requiredLevel - 1);
          
          return (
            <button
              key={mode.id}
              onClick={() => !isLocked && setMode(mode.id)}
              className={`
                relative p-8 rounded-xl border-2 transition-all h-full
                ${currentMode === mode.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <h3 className="text-2xl font-semibold mb-3">{mode.name}</h3>
              <p className="text-gray-600 text-base mb-6">{mode.description}</p>
              
              {isLocked && (
                <div className="absolute bottom-6 left-8 right-8">
                  <div className="text-sm text-gray-500 mb-2">
                    Unlock at Level {mode.requiredLevel}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {!isLocked && currentMode === mode.id && (
                <span className="absolute top-4 right-4">
                  <svg
                    className="w-8 h-8 text-blue-500"
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
