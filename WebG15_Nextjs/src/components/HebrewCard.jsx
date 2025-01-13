'use client';
import React, { useState } from 'react';
import { SpeakerWaveIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { doc, setDoc, arrayUnion } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../utils/firebaseConfig'; // Firestore config
import { useAuth } from '../context/AuthContext'; // Import auth context

const HebrewCard = ({ card }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { user } = useAuth(); // Correct reference to `user`

  // Function to play Hebrew word pronunciation
  const handlePlayAudio = (hebrewWord) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(hebrewWord);
      utterance.lang = 'he-IL';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      alert('Your browser does not support speech synthesis.');
    }
  };

  // Function to save the word to Firestore
  const handleSaveWord = async (englishWord, hebrewWord) => {
    if (!user) {
      alert('You need to be logged in to save words.');
      return;
    }

    const userDocRef = doc(db, 'userSavedLists', user.email); // Document reference

    try {
      await setDoc(
        userDocRef,
        {
          sentencesList: arrayUnion(`${englishWord} -> ${hebrewWord}`), // Save only the Hebrew word
        },
        { merge: true } // Merge to avoid overwriting
      );
      alert(`Saved: ${englishWord} -> ${hebrewWord}`);
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  // Toggle reveal state
  const handleCardClick = () => {
    setIsRevealed((prev) => !prev);
  };

  return (
    <div
      className={`relative bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg cursor-pointer ${
        isRevealed ? 'revealed' : ''
      }`}
      onClick={handleCardClick}
    >
      <img
        src={card.image}
        alt={card.english}
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="text-center mt-4">
        <p className="font-bold text-lg text-gray-900 dark:text-white">{card.english}</p>
        {isRevealed && (
          <>
            <p className="mt-2 text-blue-600 dark:text-yellow-400">
              {card.hebrew.split(' ')[0]} {/* Display only the Hebrew word */}
            </p>
            <div className="flex justify-center gap-4 mt-2">
              {/* Play Audio Icon */}
              <button
                className="flex items-center justify-center gap-1 text-blue-500 hover:text-blue-400"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card from toggling
                  handlePlayAudio(card.hebrew);
                }}
                aria-label={`Play pronunciation for ${card.english}`}
              >
                <SpeakerWaveIcon className="w-6 h-6" />
                <span className="hidden sm:inline">Play</span>
              </button>

              {/* Save Word Icon */}
              <button
                className="flex items-center justify-center gap-1 text-green-500 hover:text-green-400"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card from toggling
                  handleSaveWord(card.english, card.hebrew.split(' ')[0]); // Save only the Hebrew word
                }}
                aria-label={`Save ${card.english} to saved list`}
              >
                <BookmarkIcon className="w-6 h-6" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HebrewCard;
