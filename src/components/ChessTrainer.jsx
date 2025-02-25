import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useGame } from '../context/GameContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { SpeakerWaveIcon, SpeakerXMarkIcon, ArrowsPointingOutIcon, ClockIcon } from '@heroicons/react/24/solid';
import useSound from 'use-sound';
import correctSound from '../assets/sounds/correct.mp3';
import incorrectSound from '../assets/sounds/incorrect.mp3';
import { motion, AnimatePresence } from 'framer-motion';

const ChessTrainer = () => {
  const {
    game,
    targetSquare,
    stats,
    settings,
    progressMap,
    generateRandomSquare,
    setStats,
    setSettings,
    setProgressMap,
    userAnswer,
    setUserAnswer,
  } = useGame();

  const [boardWidth, setBoardWidth] = useState(Math.min(600, window.innerWidth - 384));
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds for timed mode

  // Update board width on window resize
  useEffect(() => {
    const handleResize = () => {
      setBoardWidth(Math.min(600, window.innerWidth - 384));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer logic for timed mode
  useEffect(() => {
    let timer;
    if (settings.mode === 'timed' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            // Time's up - show results
            clearInterval(timer);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [settings.mode, timeLeft]);

  // Reset timer when changing to timed mode
  useEffect(() => {
    if (settings.mode === 'timed') {
      setTimeLeft(30);
    }
  }, [settings.mode]);

  // Initialize game and target square on mount
  useEffect(() => {
    generateRandomSquare();
  }, []);

  const highlightVariants = {
    correct: { scale: 1.05, backgroundColor: 'rgba(76, 175, 80, 0.6)' },
    incorrect: { scale: 1.05, backgroundColor: 'rgba(244, 67, 54, 0.6)' },
    default: { backgroundColor: 'rgba(255, 235, 59, 0.4)' },
  };

  const [playCorrect] = useSound(correctSound, { volume: 0.5 });
  const [playIncorrect] = useSound(incorrectSound, { volume: 0.5 });

  // Keyboard shortcut: Submit answer with Enter
  useHotkeys('enter', () => handleSubmit(), { enableOnFormTags: true });

  // Handle answer submission with sound
  const handleSubmit = (clickedSquare) => {
    const isCorrect = settings.mode === 'squareToCoord' 
      ? userAnswer.toLowerCase() === targetSquare
      : clickedSquare === targetSquare;

    // Update stats and progress map
    setStats(s => ({ ...s, [isCorrect ? 'correct' : 'incorrect']: s[isCorrect ? 'correct' : 'incorrect'] + 1 }));
    setProgressMap(p => ({
      ...p,
      [targetSquare]: {
        ...p[targetSquare],
        [isCorrect ? 'correct' : 'incorrect']: p[targetSquare][isCorrect ? 'correct' : 'incorrect'] + 1,
      },
    }));

    // Play sound
    if (settings.soundEnabled) {
      isCorrect ? playCorrect() : playIncorrect();
    }

    // Reset for next question
    setUserAnswer('');
    generateRandomSquare();
  };

  const renderModeContent = () => {
    switch (settings.mode) {
      case 'squareToCoord':
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">What is this square's coordinate?</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter coordinate (e.g., e4)"
                className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                onClick={() => handleSubmit()}
                className="w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-500 transition-colors font-medium"
              >
                Submit
              </button>
            </div>
          </>
        );
      
      case 'coordToSquare':
        return (
          <h2 className="text-xl font-semibold mb-4">Click square: <span className="text-blue-400">{targetSquare}</span></h2>
        );
      
      case 'timed':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Time left: <span className="text-blue-400">{timeLeft}s</span></h2>
              <span className="text-sm">Score: {stats.correct}</span>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter coordinate (e.g., e4)"
                className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </>
        );
      
      case 'blindfold':
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Find square: <span className="text-blue-400">{targetSquare}</span></h2>
            <p className="text-sm text-gray-400 mb-4">Try to visualize the board without visual aids</p>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Chess Vision Trainer
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Chessboard Container */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="relative w-full max-w-[calc(100vh-8rem)] aspect-square">
            <Chessboard
              position="8/8/8/8/8/8/8/8" // Empty board
              boardWidth={boardWidth}
              customSquareStyles={{
                [targetSquare]: settings.mode !== 'coordToSquare' ? {
                  backgroundColor: 'rgba(255, 235, 59, 0.4)',
                } : {},
              }}
              boardOrientation={settings.isBlackPerspective ? 'black' : 'white'}
              showBoardNotation={settings.showCoordinates}
              customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                opacity: settings.mode === 'blindfold' ? 0.1 : 1,
              }}
              onSquareClick={(square) => {
                if (settings.mode === 'coordToSquare' || settings.mode === 'blindfold') {
                  handleSubmit(square);
                }
              }}
            />
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col p-6">
          {/* View Controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSettings(s => ({ ...s, isBlackPerspective: !s.isBlackPerspective }))}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ArrowsPointingOutIcon className="w-5 h-5" />
              {settings.isBlackPerspective ? 'Black' : 'White'} View
            </button>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showCoordinates}
                onChange={() => setSettings(s => ({ ...s, showCoordinates: !s.showCoordinates }))}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600"
              />
              Coordinates
            </label>
          </div>

          {/* Mode Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Training Mode</h3>
            <div className="flex flex-col gap-2">
              {['squareToCoord', 'coordToSquare', 'timed', 'blindfold'].map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    setSettings(s => ({ ...s, mode }));
                    setStats({ correct: 0, incorrect: 0 });
                    generateRandomSquare();
                    if (mode === 'timed') setTimeLeft(30);
                  }}
                  className={`p-3 rounded-lg text-sm font-medium ${
                    settings.mode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {mode.replace(/([A-Z])/g, ' $1').split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Specific Content */}
          <div className="mt-6">
            {renderModeContent()}
          </div>

          {/* Progress */}
          <div className="mt-auto pt-6 space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Progress</span>
              <span>{((stats.correct / (stats.correct + stats.incorrect)) * 100 || 0).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.correct / (stats.correct + stats.incorrect)) * 100 || 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessTrainer;