import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VisualPatternMode from './modes/VisualPatternMode';
import InteractiveQuizMode from './modes/InteractiveQuizMode';
import TimeChallengeMode from './modes/TimeChallengeMode';

const levels = {
  beginner: {
    name: 'Beginner',
    modes: [
      {
        id: 'visual-pattern',
        name: 'Visual Pattern Mode',
        description: 'Learn squares through visual patterns and memorable associations',
        icon: '👁️',
        component: VisualPatternMode,
      },
      {
        id: 'interactive-quiz',
        name: 'Interactive Quiz Mode',
        description: 'Test your knowledge through interactive questions',
        icon: '❓',
        component: InteractiveQuizMode,
      },
      {
        id: 'time-challenge',
        name: 'Time Challenge Mode',
        description: 'Practice identifying squares under time pressure',
        icon: '⏱️',
        component: TimeChallengeMode,
      },
    ],
  },
  intermediate: {
    name: 'Intermediate',
    modes: [], // To be implemented
  },
  master: {
    name: 'Master',
    modes: [], // To be implemented
  },
};

const LevelSystem = () => {
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedMode, setSelectedMode] = useState(null);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setSelectedMode(null);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleBack = () => {
    setSelectedMode(null);
  };

  // If a mode is selected, render its component
  if (selectedMode) {
    const ModeComponent = selectedMode.component;
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-200 rounded-lg flex items-center gap-2"
              onClick={handleBack}
            >
              ← Back to Modes
            </motion.button>
          </div>
          <ModeComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Chess Square Trainer</h1>
        
        {/* Level Selection */}
        <div className="flex justify-center gap-4 mb-8">
          {Object.entries(levels).map(([key, level]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-semibold ${
                selectedLevel === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleLevelSelect(key)}
            >
              {level.name}
            </motion.button>
          ))}
        </div>

        {/* Mode Selection */}
        {selectedLevel && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {levels[selectedLevel].modes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.03 }}
                className={`p-6 rounded-xl cursor-pointer ${
                  selectedMode?.id === mode.id
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-white'
                }`}
                onClick={() => handleModeSelect(mode)}
              >
                <div className="text-4xl mb-4">{mode.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{mode.name}</h3>
                <p className="text-gray-600">{mode.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelSystem; 