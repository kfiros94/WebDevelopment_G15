'use client';
import React, { useState } from 'react';
import cardsData from '../../../utils/cardsData';
import HebrewCard from '../../../components/HebrewCard'; // Import the HebrewCard component

const HebrewCardsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(cardsData.categories)[0]); // Default to first category

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-slate-900">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Hebrew Cards Practice</h1>

      {/* Category Selector */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-700 text-white p-3 rounded-lg"
        >
          {Object.keys(cardsData.categories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardsData.categories[selectedCategory].map((card) => (
          <HebrewCard key={card.id} card={card} /> 
        ))}
      </div>
    </div>
  );
};

export default HebrewCardsPage;
