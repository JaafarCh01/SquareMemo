import React from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ProgressPage = () => {
  const { squareStats, dailyStreak, getSquareAccuracy } = useGameStore();

  // Generate heatmap data
  const generateHeatmapData = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const heatmapData = [];

    ranks.reverse().forEach(rank => {
      const row = [];
      files.forEach(file => {
        const square = `${file}${rank}`;
        const accuracy = getSquareAccuracy(square);
        row.push({
          square,
          accuracy,
          color: `rgb(${Math.round(255 - (accuracy * 2.55))}, ${Math.round(accuracy * 2.55)}, 0)`
        });
      });
      heatmapData.push(row);
    });

    return heatmapData;
  };

  // Calculate overall statistics
  const calculateStats = () => {
    const squares = Object.keys(squareStats);
    if (squares.length === 0) return { totalAccuracy: 0, masteredSquares: 0 };

    const accuracies = squares.map(square => getSquareAccuracy(square));
    const totalAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / squares.length;
    const masteredSquares = accuracies.filter(acc => acc >= 90).length;

    return { totalAccuracy, masteredSquares };
  };

  const stats = calculateStats();
  const heatmapData = generateHeatmapData();

  // Mock data for the progress chart (replace with real data later)
  const progressData = [
    { day: 'Mon', accuracy: 65 },
    { day: 'Tue', accuracy: 70 },
    { day: 'Wed', accuracy: 75 },
    { day: 'Thu', accuracy: 72 },
    { day: 'Fri', accuracy: 78 },
    { day: 'Sat', accuracy: 82 },
    { day: 'Sun', accuracy: 85 },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="scrollable-content">
        <div className="max-w-[2000px] mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Overall Accuracy</h3>
                <p className="text-4xl font-bold text-blue-600">{stats.totalAccuracy.toFixed(1)}%</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Squares Mastered</h3>
                <p className="text-4xl font-bold text-blue-600">{stats.masteredSquares}/64</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Current Streak</h3>
                <p className="text-4xl font-bold text-blue-600">{dailyStreak} days</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Heatmap */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-6">Square Accuracy Heatmap</h2>
                <div className="grid grid-cols-8 gap-1">
                  {heatmapData.map((row, rankIndex) => (
                    row.map(({ square, accuracy, color }) => (
                      <div
                        key={square}
                        className="aspect-square relative"
                        style={{ backgroundColor: color }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {accuracy > 0 ? `${Math.round(accuracy)}%` : ''}
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-6">Progress Over Time</h2>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#2563eb"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 