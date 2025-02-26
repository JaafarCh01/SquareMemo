import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';
import useGameStore from '../store/gameStore';

const SettingsPage = () => {
  const {
    perspective,
    showCoordinates,
    soundEnabled,
    togglePerspective,
    toggleCoordinates,
    toggleSound,
  } = useGameStore();

  const settings = [
    {
      id: 'perspective',
      name: 'Board Perspective',
      description: 'Switch between white and black side perspective',
      value: perspective === 'white',
      onChange: togglePerspective,
      label: perspective === 'white' ? 'White Side' : 'Black Side',
    },
    {
      id: 'coordinates',
      name: 'Show Coordinates',
      description: 'Display square coordinates on the board',
      value: showCoordinates,
      onChange: toggleCoordinates,
      label: showCoordinates ? 'Shown' : 'Hidden',
    },
    {
      id: 'sound',
      name: 'Sound Effects',
      description: 'Play sound effects for moves and feedback',
      value: soundEnabled,
      onChange: toggleSound,
      label: soundEnabled ? 'Enabled' : 'Disabled',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="scrollable-content">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

            <div className="bg-white rounded-xl shadow-lg">
              <div className="divide-y divide-gray-200">
                {settings.map((setting) => (
                  <div key={setting.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {setting.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {setting.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{setting.label}</span>
                        <Switch
                          checked={setting.value}
                          onChange={setting.onChange}
                          className={`${
                            setting.value ? 'bg-blue-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              setting.value ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Reset Progress Button */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        Reset Progress
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Clear all progress data and start fresh. This action cannot be undone.
                      </p>
                    </div>
                    <button
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
                          // TODO: Implement reset functionality
                          window.localStorage.removeItem('chess-trainer-storage');
                          window.location.reload();
                        }
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 