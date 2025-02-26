import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Achievement definitions
const ACHIEVEMENTS = {
  FIRST_CORRECT: {
    id: 'first_correct',
    title: 'First Steps',
    description: 'Get your first correct answer',
    icon: '🎯',
  },
  PERFECT_ROUND: {
    id: 'perfect_round',
    title: 'Perfect Round',
    description: 'Complete a training session with 100% accuracy',
    icon: '⭐',
  },
  STREAK_MASTER: {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Maintain a 7-day training streak',
    icon: '🔥',
  },
  SQUARE_MASTER: {
    id: 'square_master',
    title: 'Square Master',
    description: 'Achieve 90% accuracy on all squares',
    icon: '👑',
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 10 correct answers in under 30 seconds',
    icon: '⚡',
  },
};

const useGameStore = create(
  persist(
    (set, get) => ({
      // Current game state
      currentLevel: 1,
      currentMode: 'foundation',
      perspective: 'white',
      showCoordinates: true,
      soundEnabled: true,

      // Progress tracking
      squareStats: {},
      dailyStreak: 0,
      lastPlayedDate: null,
      achievements: {},
      sessionStats: {
        startTime: null,
        correctAnswers: 0,
        totalAttempts: 0,
      },
      leaderboard: [], // [{username: string, score: number, timestamp: number}]

      // Actions
      setLevel: (level) => set({ currentLevel: level }),
      setMode: (mode) => set({ currentMode: mode }),
      togglePerspective: () => set((state) => ({ 
        perspective: state.perspective === 'white' ? 'black' : 'white' 
      })),
      toggleCoordinates: () => set((state) => ({ 
        showCoordinates: !state.showCoordinates 
      })),
      toggleSound: () => set((state) => ({ 
        soundEnabled: !state.soundEnabled 
      })),

      // Session management
      startSession: () => set((state) => ({
        sessionStats: {
          startTime: Date.now(),
          correctAnswers: 0,
          totalAttempts: 0,
        }
      })),

      // Progress tracking actions
      updateSquareStats: (square, isCorrect) => set((state) => {
        const currentStats = state.squareStats[square] || { correct: 0, attempts: 0 };
        const newStats = {
          squareStats: {
            ...state.squareStats,
            [square]: {
              correct: currentStats.correct + (isCorrect ? 1 : 0),
              attempts: currentStats.attempts + 1,
            },
          },
          sessionStats: {
            ...state.sessionStats,
            correctAnswers: state.sessionStats.correctAnswers + (isCorrect ? 1 : 0),
            totalAttempts: state.sessionStats.totalAttempts + 1,
          },
        };

        // Check for achievements
        const achievements = { ...state.achievements };
        
        // First correct answer
        if (isCorrect && !achievements[ACHIEVEMENTS.FIRST_CORRECT.id]) {
          achievements[ACHIEVEMENTS.FIRST_CORRECT.id] = {
            ...ACHIEVEMENTS.FIRST_CORRECT,
            earnedAt: Date.now(),
          };
        }

        // Speed achievement
        if (isCorrect && 
            state.sessionStats.correctAnswers === 9 && 
            Date.now() - state.sessionStats.startTime < 30000) {
          achievements[ACHIEVEMENTS.SPEED_DEMON.id] = {
            ...ACHIEVEMENTS.SPEED_DEMON,
            earnedAt: Date.now(),
          };
        }

        // Perfect round achievement
        if (state.sessionStats.totalAttempts >= 10 && 
            state.sessionStats.correctAnswers === state.sessionStats.totalAttempts) {
          achievements[ACHIEVEMENTS.PERFECT_ROUND.id] = {
            ...ACHIEVEMENTS.PERFECT_ROUND,
            earnedAt: Date.now(),
          };
        }

        return {
          ...newStats,
          achievements,
        };
      }),

      // Streak management
      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        const isConsecutiveDay = state.lastPlayedDate === new Date().setDate(new Date().getDate() - 1).toDateString();
        const newStreak = isConsecutiveDay ? state.dailyStreak + 1 : 1;
        
        // Check for streak achievement
        const achievements = { ...state.achievements };
        if (newStreak >= 7 && !achievements[ACHIEVEMENTS.STREAK_MASTER.id]) {
          achievements[ACHIEVEMENTS.STREAK_MASTER.id] = {
            ...ACHIEVEMENTS.STREAK_MASTER,
            earnedAt: Date.now(),
          };
        }

        return {
          dailyStreak: newStreak,
          lastPlayedDate: today,
          achievements,
        };
      }),

      // Leaderboard management
      addToLeaderboard: (username, score) => set((state) => ({
        leaderboard: [...state.leaderboard, {
          username,
          score,
          timestamp: Date.now(),
        }].sort((a, b) => b.score - a.score).slice(0, 100), // Keep top 100 scores
      })),

      // Helper methods
      getSquareAccuracy: (square) => {
        const stats = get().squareStats[square];
        if (!stats || stats.attempts === 0) return 0;
        return (stats.correct / stats.attempts) * 100;
      },

      getLevelProgress: (level) => {
        const stats = get().squareStats;
        const squares = Object.keys(stats);
        if (squares.length === 0) return 0;
        
        const totalAccuracy = squares.reduce((sum, square) => sum + get().getSquareAccuracy(square), 0);
        return totalAccuracy / squares.length;
      },

      getRecentAchievements: () => {
        const achievements = get().achievements;
        return Object.values(achievements)
          .sort((a, b) => b.earnedAt - a.earnedAt)
          .slice(0, 5); // Get 5 most recent achievements
      },

      getTopScores: () => {
        return get().leaderboard
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Get top 10 scores
      },
    }),
    {
      name: 'chess-trainer-storage',
    }
  )
)

export default useGameStore 