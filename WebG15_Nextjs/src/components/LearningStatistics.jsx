// src/components/LearningStatistics.jsx
import '../styles/globals.css';

import React from 'react';

const LearningStatistics = () => {
  return (
    <div className="col-span-1 bg-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Learning Progress</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-bold mb-2">Words Learned</h3>
          <div className="bg-slate-700 rounded-lg p-4">
            <span className="text-3xl font-bold">42</span>
            <span className="text-gray-400 ml-2">words</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">Study Streak</h3>
          <div className="bg-slate-700 rounded-lg p-4">
            <span className="text-3xl font-bold">7</span>
            <span className="text-gray-400 ml-2">days</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">Practice Sessions</h3>
          <div className="bg-slate-700 rounded-lg p-4">
            <span className="text-3xl font-bold">15</span>
            <span className="text-gray-400 ml-2">this week</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStatistics;