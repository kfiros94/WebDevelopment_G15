// src/components/LearningStatistics.jsx
import '../styles/globals.css';
import React from 'react';

const LearningStatistics = () => {
  return (
    <div className="bg-slate-800 dark:bg-gray-900 rounded-lg p-2 transition-all duration-300 h-full">
      <h2 className="text-md font-semibold mb-1 text-white dark:text-gray-200 transition-all duration-300">
        Learning Progress
      </h2>
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">
            Words Learned
          </h3>
          <div className="bg-slate-700 dark:bg-gray-800 rounded-lg p-1 transition-all duration-300 flex items-center">
            <span className="text-xl font-bold text-white dark:text-gray-200 transition-all duration-300">
              42
            </span>
            <span className="text-gray-400 dark:text-gray-300 ml-0.5 text-xs transition-all duration-300">
              words
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">
            Study Streak
          </h3>
          <div className="bg-slate-700 dark:bg-gray-800 rounded-lg p-1 transition-all duration-300 flex items-center">
            <span className="text-xl font-bold text-white dark:text-gray-200 transition-all duration-300">
              7
            </span>
            <span className="text-gray-400 dark:text-gray-300 ml-0.5 text-xs transition-all duration-300">
              days
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">
            Practice Sessions
          </h3>
          <div className="bg-slate-700 dark:bg-gray-800 rounded-lg p-1 transition-all duration-300 flex items-center">
            <span className="text-xl font-bold text-white dark:text-gray-200 transition-all duration-300">
              15
            </span>
            <span className="text-gray-400 dark:text-gray-300 ml-0.5 text-xs transition-all duration-300">
              this week
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStatistics;
