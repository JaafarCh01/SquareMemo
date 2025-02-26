import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TrainingPage from './pages/TrainingPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import useGameStore from './store/gameStore'
import './App.css'

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}

function App() {
  const { dailyStreak } = useGameStore()

  return (
    <Router>
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="w-full bg-white shadow-lg z-10 flex-none">
          <div className="w-full max-w-[2000px] mx-auto px-6">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center">
                  <span className="text-xl font-bold text-gray-800">
                    Chess Vision Trainer
                  </span>
                </Link>

                <div className="hidden md:flex items-center space-x-2">
                  <NavLink to="/train">Train</NavLink>
                  <NavLink to="/progress">Progress</NavLink>
                  <NavLink to="/settings">Settings</NavLink>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Daily Streak: {dailyStreak} days
                </div>
                <Link
                  to="/train"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Training
                </Link>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-gray-200">
              <div className="flex justify-around py-2">
                <NavLink to="/train">Train</NavLink>
                <NavLink to="/progress">Progress</NavLink>
                <NavLink to="/settings">Settings</NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0 bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/train" element={<TrainingPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
