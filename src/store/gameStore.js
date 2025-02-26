import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

      // Actions
      setLevel: (level) => set({ currentLevel: level }),
      setMode: (mode) => set({ currentMode: mode }),
      togglePerspective: () => set((state) => ({ perspective: state.perspective === 'white' ? 'black' : 'white' })),
      toggleCoordinates: () => set((state) => ({ showCoordinates: !state.showCoordinates })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      // Progress tracking actions
      updateSquareStats: (square, isCorrect) => set((state) => {
        const currentStats = state.squareStats[square] || { correct: 0, attempts: 0 };
        return {
          squareStats: {
            ...state.squareStats,
            [square]: {
              correct: currentStats.correct + (isCorrect ? 1 : 0),
              attempts: currentStats.attempts + 1,
            },
          },
        };
      }),

      // Streak management
      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        const isConsecutiveDay = state.lastPlayedDate === new Date().setDate(new Date().getDate() - 1).toDateString();
        
        return {
          dailyStreak: isConsecutiveDay ? state.dailyStreak + 1 : 1,
          lastPlayedDate: today,
        };
      }),

      // Helper methods
      getSquareAccuracy: (square) => {
        const stats = get().squareStats[square];
        if (!stats || stats.attempts === 0) return 0;
        return (stats.correct / stats.attempts) * 100;
      },

      getLevelProgress: (level) => {
        // Calculate level progress based on square accuracies
        const stats = get().squareStats;
        const squares = Object.keys(stats);
        if (squares.length === 0) return 0;
        
        const totalAccuracy = squares.reduce((sum, square) => sum + get().getSquareAccuracy(square), 0);
        return totalAccuracy / squares.length;
      },
    }),
    {
      name: 'chess-trainer-storage',
    }
  )
)

export default useGameStore 