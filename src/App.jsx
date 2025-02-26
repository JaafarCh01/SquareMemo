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
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
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

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/train" element={<TrainingPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
