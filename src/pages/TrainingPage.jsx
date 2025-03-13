import React from 'react';
import LevelSystem from '../components/LevelSystem';

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-gray-100 overflow-y-auto">
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <LevelSystem />
      </div>
    </div>
  );
} 