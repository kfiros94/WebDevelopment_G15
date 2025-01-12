// src/components/AccountMainTab.jsx
import '../styles/globals.css';
import React, { useEffect, useState } from 'react';
import { translateText } from '../utils/translationApi'; 
import { auth, db } from '../utils/firebaseConfig';
import { doc, setDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';

// Default punctuation marks for letters without constraints
const punctuationMarks = [
  "ָ", // קמץ
  "ַ", // פתח
  "ִ", // חיריק
  "ֶ", // סגול
  "ֹ", // חולם
  "ֻ", // קובוץ
  "ְ", // שווא
];

// Constraint JSON: certain letters have restricted punctuation
const punctuationConstraints = {
  'ה': [],        // No punctuation for ה
  'ם': [],        // No punctuation for ם
  'י': ["ָ"],     // Example: only קמץ or nothing
  'ו': ['ֹ', ''], // ו can have either חולם (ֹ) or nothing
  'מ': [ "ֶ", "ַ"], 
  'ת': [ "ַ"],
  'ח': [''],
};

// Function that adds random punctuation *to the right* of each character
function addRandomPunctuation(hebrewWord) {
  return hebrewWord
    .split('')
    .map((char) => {
      // If this char is in our constraints
      if (punctuationConstraints.hasOwnProperty(char)) {
        const allowedMarks = punctuationConstraints[char];
        if (allowedMarks.length === 0) {
          // means "no punctuation"
          return char; 
        }
        // pick randomly from the allowed set, e.g. ['ֹ','']
        const randomMark = allowedMarks[Math.floor(Math.random() * allowedMarks.length)];
        // *** Punctuation now goes on the right ***
        return char + randomMark;
      }

      // Otherwise fallback to the default punctuation set
      const randomMark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
      // *** Punctuation now goes on the right ***
      return char + randomMark;
    })
    .join('');
}

const AccountMainTab = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [collectWords, setCollectWords] = useState({}); // State for collectWords
  const [containers, setContainers] = useState([
    { id: Date.now(), punctuatedWords: ['Word 1', 'Word 2', 'Word 3', 'Word 4'], selectedMeaning: null, inputText: '', translatedWords: [] },
  ]); // Initial container

  useEffect(() => {
    // Fetch user email on auth state change
    const fetchUser = async () => {
      if (auth.currentUser) {
        setUserEmail(auth.currentUser.email);
      }
    };

    fetchUser();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch collectWords collection on mount
    const fetchCollectWords = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'collectWords'));
        const wordsData = {};
        querySnapshot.forEach((doc) => {
          wordsData[doc.id] = doc.data(); // Store the entire data object including 'word' and 'meanings'
        });
        console.log('Fetched collectWords:', wordsData); // Debugging log
        setCollectWords(wordsData);
      } catch (error) {
        console.error('Error fetching collectWords:', error);
        alert('Failed to load grammar data.');
      }
    };

    fetchCollectWords();
  }, []);

  // Function to handle adding a new container
  const handleAddContainer = () => {
    setContainers([
      ...containers,
      { id: Date.now(), punctuatedWords: ['Word 1', 'Word 2', 'Word 3', 'Word 4'], selectedMeaning: null, inputText: '', translatedWords: [] },
    ]);
  };

  // Function to handle clearing all containers
  const handleClearContainers = () => {
    setContainers([
      { id: Date.now(), punctuatedWords: ['Word 1', 'Word 2', 'Word 3', 'Word 4'], selectedMeaning: null, inputText: '', translatedWords: [] },
    ]);
  };

  // Function to handle removing a specific container
  const handleRemoveContainer = (id) => {
    setContainers(containers.filter((container) => container.id !== id));
  };

  // 1) Handle Translation
  const handleTranslate = async (id) => {
    const containerIndex = containers.findIndex((c) => c.id === id);
    if (containerIndex === -1) return;

    const container = containers[containerIndex];
    const inputValue = container.inputText.trim();

    if (!inputValue) {
      alert('Please enter a sentence to translate.');
      return;
    }

    try {
      const translatedText = await translateText(inputValue);

      // Split translated text into words
      const words = translatedText.split(/\s+/).map((word, index) => ({
        id: index,
        text: word,
      }));

      const updatedContainers = [...containers];
      updatedContainers[containerIndex].translatedWords = words;
      updatedContainers[containerIndex].punctuatedWords = ['Word 1', 'Word 2', 'Word 3', 'Word 4']; // Reset Word List
      updatedContainers[containerIndex].selectedMeaning = null; // Reset selected meaning

      setContainers(updatedContainers);
    } catch (error) {
      console.error('Translation failed:', error);
      alert('An error occurred while translating. Please try again.');
    }
  };

  // 2) Handle Word Click from Translated Sentence
  const handleWordClick = (id, clickedWord) => {
    const containerIndex = containers.findIndex((c) => c.id === id);
    if (containerIndex === -1) return;

    const cleanWord = clickedWord.replace(/[\u0591-\u05C7]/g, ''); // Remove Hebrew punctuation

    console.log('Clicked Word:', clickedWord);
    console.log('Clean Word:', cleanWord);
    console.log('CollectWords Data:', collectWords);

    const updatedContainers = [...containers];

    if (collectWords.hasOwnProperty(cleanWord)) {
      const wordData = collectWords[cleanWord];
      const dottedWords = wordData.word; // Assuming 'word' is an array of dotted forms

      console.log(`Dotted Words for "${cleanWord}":`, dottedWords);

      if (Array.isArray(dottedWords) && dottedWords.length > 0) {
        updatedContainers[containerIndex].punctuatedWords = dottedWords;
        updatedContainers[containerIndex].selectedMeaning = null; // Clear previous selection
      } else {
        console.warn(`The 'word' array for "${cleanWord}" is empty or not an array.`);
        updatedContainers[containerIndex].punctuatedWords = ['No grammar available', 'No grammar available', 'No grammar available', 'No grammar available'];
        updatedContainers[containerIndex].selectedMeaning = null;
      }
    } else {
      console.warn(`"${cleanWord}" does not exist in collectWords.`);
      updatedContainers[containerIndex].punctuatedWords = ['No grammar available', 'No grammar available', 'No grammar available', 'No grammar available'];
      updatedContainers[containerIndex].selectedMeaning = null;
    }

    setContainers(updatedContainers);
  };

  // 3) Handle Word Click from Word List
  const handleWordListClick = (id, word) => {
    if (word === 'No grammar available') {
      const containerIndex = containers.findIndex((c) => c.id === id);
      if (containerIndex === -1) return;
      const updatedContainers = [...containers];
      updatedContainers[containerIndex].selectedMeaning = null;
      setContainers(updatedContainers);
      return;
    }

    const baseWord = word.replace(/[\u0591-\u05C7]/g, '');

    console.log('Clicked Word List Item:', word);
    console.log('Base Word:', baseWord);

    const containerIndex = containers.findIndex((c) => c.id === id);
    if (containerIndex === -1) return;

    const updatedContainers = [...containers];

    if (collectWords.hasOwnProperty(baseWord)) {
      const wordData = collectWords[baseWord];
      const index = wordData.word.indexOf(word);
      if (index !== -1 && wordData.meanings[index]) {
        updatedContainers[containerIndex].selectedMeaning = wordData.meanings[index];
      } else {
        console.warn(`No meaning found for "${word}" at index ${index}.`);
        updatedContainers[containerIndex].selectedMeaning = null;
      }
    } else {
      console.warn(`"${baseWord}" does not exist in collectWords.`);
      updatedContainers[containerIndex].selectedMeaning = null;
    }

    setContainers(updatedContainers);
  };

  // 4) Handle Audio Pronunciation
  const handlePlayPronunciation = (id) => {
    const container = containers.find((c) => c.id === id);
    if (!container) return;

    const translation = container.translatedWords ? container.translatedWords.map((word) => word.text).join(' ') : '';
    if (!translation.trim()) {
      alert('No translation available to play.');
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translation);
      utterance.lang = 'he-IL';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in your browser.');
    }
  };

  // 5) Handle Save to Firestore
  const handleSave = async (id) => {
    if (!userEmail) {
      alert('You must be logged in to save sentences.');
      return;
    }

    const container = containers.find((c) => c.id === id);
    if (!container) return;

    if (!container.inputText || !container.inputText.trim()) {
      alert('Please enter a sentence to translate before saving.');
      return;
    }

    const translatedSentence = container.translatedWords ? container.translatedWords.map((word) => word.text).join(' ') : '';

    if (!translatedSentence.trim()) {
      alert('No translation available to save.');
      return;
    }

    try {
      const userDocRef = doc(db, 'userSavedLists', userEmail);
      await setDoc(
        userDocRef,
        {
          sentencesList: arrayUnion(`${container.inputText} -> ${translatedSentence}`),
        },
        { merge: true }
      );
      alert('Sentence saved successfully!');
    } catch (error) {
      console.error('Error saving sentence:', error);
      alert('An error occurred while saving the sentence. Please try again.');
    }
  };

  // 6) Handle Input Text Change
  const handleInputChange = (id, text) => {
    const containerIndex = containers.findIndex((c) => c.id === id);
    if (containerIndex === -1) return;
    const updatedContainers = [...containers];
    updatedContainers[containerIndex].inputText = text;
    setContainers(updatedContainers);
  };

  return (
    <div className="bg-slate-800 dark:bg-gray-900 rounded-lg p-3 transition-all duration-300">
      {/* Clear All Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={handleClearContainers}
          className="px-3 py-1 rounded-md font-medium bg-slate-700 dark:bg-gray-800 
                     hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 text-sm"
        >
          Clear All
        </button>
      </div>

      {/* Main Wrapper */}
      <div
        id="main-wrapper"
        className="scrollable-section max-h-80 overflow-y-auto p-3 flex flex-col gap-3"
      >
        {/* Containers */}
        {containers.map((container) => (
          <div key={container.id} className="flex gap-2">
            {/* Word List (Dynamic Rendering) */}
            <div
              className="bg-slate-700 dark:bg-gray-800 rounded-lg p-2 shadow-lg 
                         overflow-y-auto w-1/3 h-40 transition-all duration-300"
            >
              <h4 className="text-sm font-bold mb-2 text-white dark:text-gray-200 
                             text-center transition-all duration-300">
                Word List
              </h4>
              <ul className="space-y-1">
                {container.punctuatedWords.map((word, index) => (
                  <li
                    key={index}
                    className="px-2 py-1 bg-slate-800 dark:bg-gray-900 
                               rounded-lg shadow text-white dark:text-gray-300 
                               transition-all duration-300 cursor-pointer hover:bg-blue-600 text-xs"
                    onClick={() => handleWordListClick(container.id, word)}
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Area with Input, Translation, etc. */}
            <div
              id="tabWords"
              className="bg-slate-800 dark:bg-gray-900 rounded-lg p-4 shadow-lg 
                         flex-1 transition-all duration-300"
            >
              <div className="flex flex-col gap-3">
                {/* Save Button */}
                <span className="flex justify-end">
                  <button
                    onClick={() => handleSave(container.id)}
                    className="px-3 py-0.5 text-xs rounded-md font-medium bg-green-600 
                               dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 
                               transition-all duration-300"
                  >
                    Save
                  </button>
                </span>

                {/* English Input + Translate Button */}
                <div className="flex items-center gap-3">
                  <textarea
                    placeholder="Type text here..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-700 
                               dark:bg-gray-800 text-white dark:text-gray-300 
                               transition-all duration-300 text-xs resize-none"
                    rows="3"
                    value={container.inputText}
                    onChange={(e) => handleInputChange(container.id, e.target.value)}
                  ></textarea>
                  <button
                    onClick={() => handleTranslate(container.id)}
                    className="px-3 py-1 rounded-lg bg-blue-600 dark:bg-blue-700 
                               hover:bg-blue-700 dark:hover:bg-blue-800 
                               transition-all duration-300 text-xs"
                  >
                    Translate
                  </button>
                </div>

                {/* Translated Output */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-full px-3 py-2 rounded-lg bg-slate-700 
                               dark:bg-gray-800 text-white dark:text-gray-300 
                               transition-all duration-300 min-h-[4rem]"
                  >
                    {container.translatedWords.length > 0 && container.translatedWords.map((word) => (
                      <span
                        key={word.id}
                        className="clickable-word cursor-pointer px-1 rounded 
                                   hover:bg-blue-600 hover:text-white transition-colors duration-200 text-xs"
                        onClick={() => handleWordClick(container.id, word.text)}
                      >
                        {word.text}{' '}
                      </span>
                    ))}
                  </div>

                  {/* Audio Pronunciation and Remove Button */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handlePlayPronunciation(container.id)}
                      className="px-2 py-1 bg-yellow-600 dark:bg-yellow-700 
                                 hover:bg-yellow-700 dark:hover:bg-yellow-800 
                                 transition-all duration-300 text-xs rounded-md"
                    >
                      Audio
                    </button>
                    <button
                      onClick={() => handleRemoveContainer(container.id)}
                      className="px-2 py-1 bg-red-600 dark:bg-red-700 
                                 hover:bg-red-700 dark:hover:bg-red-800 
                                 transition-all duration-300 text-xs rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Display Sentences */}
                {container.selectedMeaning && (
                  <div className="mt-3 p-2 bg-slate-700 dark:bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-sm font-bold text-white dark:text-gray-200 mb-1">
                      Sentences for "{container.selectedMeaning.meaning_hebrew}"
                    </h3>
                    <p className="text-gray-300 text-xs">
                      <strong>Hebrew:</strong> {container.selectedMeaning.sentence_hebrew}
                    </p>
                    <p className="text-gray-300 text-xs">
                      <strong>English:</strong> {container.selectedMeaning.sentence_english}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Button to Add a New Sentence Container */}
        <button
          onClick={handleAddContainer}
          className="mt-3 px-4 py-1 bg-green-600 dark:bg-green-700 
                     hover:bg-green-700 dark:hover:bg-green-800 
                     rounded-lg text-white font-semibold transition-all duration-300 text-sm"
        >
          Create New Sentence
        </button>
      </div>
    </div>
  );
};

export default AccountMainTab;
