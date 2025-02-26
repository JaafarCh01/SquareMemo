import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';

const AchievementNotification = memo(({ achievement }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg z-50"
  >
    <div className="flex items-center space-x-3">
      <span className="text-2xl">{achievement.icon}</span>
      <div>
        <h3 className="font-bold">{achievement.title}</h3>
        <p className="text-sm text-blue-100">{achievement.description}</p>
      </div>
    </div>
  </motion.div>
));

const AchievementCard = memo(({ achievement }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
  >
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
        {achievement.icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
        <p className="text-sm text-gray-500">{achievement.description}</p>
        <p className="text-xs text-gray-400 mt-1">
          Earned {new Date(achievement.earnedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  </motion.div>
));

const LeaderboardEntry = memo(({ entry, rank }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center space-x-4">
      <span className={`font-bold ${rank <= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
        #{rank}
      </span>
      <span className="font-medium">{entry.username}</span>
    </div>
    <span className="font-semibold text-gray-900">{entry.score}</span>
  </motion.div>
));

const AchievementsPanel = () => {
  const { getRecentAchievements, getTopScores } = useGameStore();
  const recentAchievements = getRecentAchievements();
  const topScores = getTopScores();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Achievements */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
        <div className="space-y-4">
          {recentAchievements.length > 0 ? (
            recentAchievements.map((achievement) => (
              <AchievementCard
                key={`${achievement.id}-${achievement.earnedAt}`}
                achievement={achievement}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No achievements yet. Keep training to earn badges!
            </p>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Top Players</h2>
        <div className="divide-y divide-gray-100">
          {topScores.length > 0 ? (
            topScores.map((entry, index) => (
              <LeaderboardEntry
                key={`${entry.username}-${entry.timestamp}`}
                entry={entry}
                rank={index + 1}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No scores yet. Be the first to make the leaderboard!
            </p>
          )}
        </div>
      </div>

      {/* Achievement Notifications */}
      <AnimatePresence>
        {recentAchievements.slice(0, 1).map((achievement) => (
          <AchievementNotification
            key={`notification-${achievement.id}-${achievement.earnedAt}`}
            achievement={achievement}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default memo(AchievementsPanel); 