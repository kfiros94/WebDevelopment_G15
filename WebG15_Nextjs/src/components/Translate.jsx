'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore'; // Firestore imports

const Translate = ({ onWordSelection, onClear }) => {
  const [englishInput, setEnglishInput] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleTranslate = async () => {
    if (!englishInput.trim()) {
      setTranslation('Please enter a sentence to translate.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: englishInput, target: 'he' }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setTranslation(data.translatedText);
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

  const handleSaveToFirebase = async () => {
    if (!user) {
      router.push('/signin'); // Redirect to sign-in page if user is not signed in
      return;
    }

    if (!translation) {
      alert('Please translate a sentence first!');
      return;
    }

    try {
      const userCollectionRef = collection(db, 'userSavedList', user.uid, 'sentences');
      await addDoc(userCollectionRef, {
        englishSentence: englishInput,
        translatedSentence: translation,
        timestamp: new Date(),
      });
      alert('Translation saved successfully!');
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      alert('Failed to save the translation.');
    }
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
              className={`cursor-pointer px-1 rounded-md hover:text-blue-600 ${
                word === selectedWord ? 'bg-yellow-200 dark:bg-yellow-600' : ''
              }`}
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
            onClick={handleSaveToFirebase}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
          >
            Save to Firestore
          </button>
        )}
      </div>
    </div>
  );
};

export default Translate;
