"use client"

import React, { useState } from "react"
import cardsData from "../../../utils/cardsData" // All card info loaded here
import HebrewCard from "../../../components/HebrewCard" // Single card component

/**
 * HebrewCardsPage
 *
 * Displays a set of Hebrew learning cards organized by categories.
 * The user can select a category from a dropdown, and the corresponding
 * Hebrew cards are displayed in a grid.
 */
const HebrewCardsPage = () => {
    // State to track the currently selected category.
    // Default to the first category in 'cardsData.categories'
    const [selectedCategory, setSelectedCategory] = useState(Object.keys(cardsData.categories)[0])

    return (
        <div className="min-h-screen p-6 bg-gray-100 dark:bg-slate-900">
            {/*
        Page Heading
        A simple header for the practice area
      */}
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Hebrew Cards Practice</h1>

            {/*
        Category Selector
        A dropdown that allows the user to select which category's cards to display
      */}
            <div className="flex justify-center mb-6">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-700 text-white p-3 rounded-lg"
                >
                    {/* Map over the category keys and display each as an <option> */}
                    {Object.keys(cardsData.categories).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/*
        Cards Grid
        Displays the cards for the chosen category in a responsive grid layout.
      */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* For each 'card' in the selected category, render a HebrewCard component */}
                {cardsData.categories[selectedCategory].map((card) => (
                    <HebrewCard key={card.id} card={card} />
                ))}
            </div>
        </div>
    )
}

export default HebrewCardsPage
