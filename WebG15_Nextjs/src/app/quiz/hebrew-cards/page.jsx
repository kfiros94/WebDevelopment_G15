'use client';

import React, { useState } from 'react';
import cardsData from '../../../utils/cardsData';

const HebrewCardsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(cardsData.categories)[0]); // Default to first category

  // Handle revealing translation when a card is clicked
  const handleCardClick = (cardId) => {
    const cardElement = document.getElementById(`card-${cardId}`);
    cardElement.classList.toggle('revealed');
  };

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
          <div
            key={card.id}
            id={`card-${card.id}`}
            className="relative bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg cursor-pointer"
            onClick={() => handleCardClick(card.id)}
          >
            <img
              src={card.image}
              alt={card.english}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="font-bold text-lg text-gray-900 dark:text-white">{card.english}</p>
              <p className="mt-2 hidden text-blue-600 dark:text-yellow-400 hebrew-text">{card.hebrew}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .revealed .hebrew-text {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default HebrewCardsPage;
