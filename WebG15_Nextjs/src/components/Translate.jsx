'use client';

import { useState, useEffect } from 'react';
import { auth } from '../utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { translateText } from '../utils/translationApi';

const Translate = ({ onTranslationComplete, onWordSelection, onClear }) => {
  const [englishInput, setEnglishInput] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');

  const handleTranslate = async () => {
    if (!englishInput.trim()) {
      setTranslation('Please enter a sentence to translate.');
      return;
    }

    setLoading(true);
    try {
      const translatedText = await translateText(englishInput, 'he');
      setTranslation(translatedText);

      // Pass the full sentence and translation to parent
      if (onTranslationComplete) {
        onTranslationComplete(englishInput, translatedText);
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslation('An error occurred while translating.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEnglishInput('');
    setTranslation('');
    setSelectedWord('');
    if (onClear) onClear();
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
    if (onWordSelection) onWordSelection([{ word, meaning: `Meaning of ${word}` }]);
  };

  const handlePlayPronunciation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translation);
      utterance.lang = 'he-IL';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in your browser.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg flex-1">
      <h2 className="text-2xl font-bold mt-6 mb-6">Translate English to Hebrew</h2>
      <input
        type="text"
        value={englishInput}
        onChange={(e) => setEnglishInput(e.target.value)}
        placeholder="Type your sentence here..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleTranslate}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
        <button onClick={handleClear} className="px-6 py-3 bg-gray-600 text-white rounded-lg">
          Clear
        </button>
      </div>
      {translation && (
        <div className="mt-4 text-lg bg-gray-100 p-4 rounded-lg text-gray-800 dark:bg-slate-700 dark:text-white">
          {translation.split(' ').map((word, index) => (
            <span
              key={index}
              onClick={() => handleWordClick(word)}
              className={`cursor-pointer px-1 rounded-md hover:text-blue-600 ${
                word === selectedWord ? 'bg-yellow-200 dark:bg-yellow-600' : ''
              }`}
            >
              {word}{' '}
            </span>
          ))}
        </div>
      )}
      {translation && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={handlePlayPronunciation}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Play Pronunciation
          </button>
        </div>
      )}
    </div>
  );
};

export default Translate;
