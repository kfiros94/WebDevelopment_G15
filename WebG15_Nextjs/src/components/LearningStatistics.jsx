// src/components/LearningStatistics.jsx
import '../styles/globals.css';

import React from 'react';

const LearningStatistics = () => {
  return (
    <div className="col-span-1 bg-slate-800 dark:bg-gray-900 rounded-lg p-6 transition-all duration-300">
      <h2 className="text-xl font-bold mb-4 text-white dark:text-gray-200 transition-all duration-300">
        Learning Progress
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-bold mb-2 text-gray-400 dark:text-gray-300 transition-all duration-300">
            Words Learned
          </h3>
          <div className="bg-slate-700 dark:bg-gray-800 rounded-lg p-4 transition-all duration-300">
            <span className="text-3xl font-bold text-white dark:text-gray-200 transition-all duration-300">
              42
            </span>
            <span className="text-gray-400 dark:text-gray-300 ml-2 transition-all duration-300">
              words
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2 text-gray-400 dark:text-gray-300 transition-all duration-300">
            Study Streak
          </h3>
          <div className="bg-slate-700 dark:bg-gray-800 rounded-lg p-4 transition-all duration-300">
            <span className="text-3xl font-bold text-white dark:text-gray-200 transition-all duration-300">
              7
            </span>
            <span className="text-gray-400 dark:text-gray-300 ml-2 transition-all duration-300">
              days
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2 text-gray-400 dark:text-gray-300 transition-all duration-300">
            Practice Sessions
          </h3>
          <div className="bg-slate-700 dark:bg-gray-800 rounded-lg p-4 transition-all duration-300">
            <span className="text-3xl font-bold text-white dark:text-gray-200 transition-all duration-300">
              15
            </span>
            <span className="text-gray-400 dark:text-gray-300 ml-2 transition-all duration-300">
              this week
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStatistics;
