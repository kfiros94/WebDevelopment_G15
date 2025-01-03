'use client';

import { useState } from 'react';
import { translateText } from '../utils/translationApi';

const Translate = ({ onWordSelection, onClear }) => {
  const [englishInput, setEnglishInput] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [showGenerateButton, setShowGenerateButton] = useState(false);

  const handleTranslate = async () => {
    if (!englishInput.trim()) {
      setTranslation('Please enter a sentence to translate.');
      return;
    }

    setLoading(true);
    try {
      const translatedText = await translateText(englishInput);
      setTranslation(translatedText);
      setShowGenerateButton(true);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslation("An error occurred during translation.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEnglishInput('');
    setTranslation('');
    setSelectedWord('');
    setShowGenerateButton(false);
    if (onClear) onClear();
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
    if (onWordSelection) onWordSelection([{ word, meaning: `Meaning of ${word}` }]);
  };

  const handlePlayPronunciation = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translation);
      utterance.lang = 'he-IL';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in your browser.');
    }
  };

  const handleSave = () => {
    if (!translation) {
      alert('Please translate a sentence first!');
      return;
    }
    console.log('Saved translation:', translation); // Replace with actual save logic
    // Example using localStorage:
    // localStorage.setItem('savedTranslation', translation);
  };

  const handleGenerateNewSentence = async () => {
      if (!translation) {
        alert('Please translate a sentence first!');
        return;
      }
      setEnglishInput(''); // Clear input field for new sentence
      setTranslation(''); // Clear previous translation
      setSelectedWord(''); // Clear selected word
      setShowGenerateButton(false); // Hide button after generation
      // Example placeholder - Replace with actual API call
      const newSentence = "This is a new sentence to translate.";
      setEnglishInput(newSentence);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg flex-1 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mt-6 mb-6 text-gray-800 dark:text-white">
        Translate English to Hebrew
      </h2>
      <input
        type="text"
        value={englishInput}
        onChange={(e) => setEnglishInput(e.target.value)}
        placeholder="Type your sentence here..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all duration-300"
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleTranslate}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
          disabled={loading}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
        >
          Clear
        </button>
      </div>

      {translation && (
        <div className="mt-4 text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
          {translation.split(' ').map((word, index) => (
            <span
              key={index}
              onClick={() => handleWordClick(word)}
              className={`cursor-pointer px-1 rounded-md hover:text-blue-600 ${word === selectedWord ? 'bg-yellow-200 dark:bg-yellow-600' : ''}`}
            >
              {word}{' '}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-4">
        {translation && (
          <button
            onClick={handlePlayPronunciation}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
          >
            Play Pronunciation
          </button>
        )}
        {translation && (
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
          >
            Save
          </button>
        )}
        {showGenerateButton && (
          <button
            onClick={handleGenerateNewSentence}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
          >
            Generate a new sentence
          </button>
        )}
      </div>
    </div>
  );
};

export default Translate;