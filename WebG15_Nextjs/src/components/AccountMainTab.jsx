import '../styles/globals.css';
import React, { useEffect, useState } from 'react';
import { translateText } from '../utils/translationApi'; 
import { auth, db } from '../utils/firebaseConfig';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';

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
  'ו': ['ֹ', ''], // ו can have either cholem (ֹ) or nothing
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

  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email);
    }
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
    const mainWrapper = document.getElementById('main-wrapper');
    const clearBtn = document.getElementById('clear-btn');

    if (!mainWrapper || !clearBtn) {
      console.warn('Main wrapper or clear button not found.');
      return;
    }

    const attachButtonFunctionality = () => {
      const translateButtons = mainWrapper.querySelectorAll('#translate-btn');
      translateButtons.forEach((btn) => {
        btn.removeEventListener('click', handleTranslate);
        btn.addEventListener('click', handleTranslate);
      });

      const audioButtons = mainWrapper.querySelectorAll('#audio-btn');
      audioButtons.forEach((btn) => {
        btn.removeEventListener('click', handlePlayPronunciation);
        btn.addEventListener('click', handlePlayPronunciation);
      });

      const saveButtons = mainWrapper.querySelectorAll('#save-btn');
      saveButtons.forEach((btn) => {
        btn.removeEventListener('click', handleSave);
        btn.addEventListener('click', handleSave);
      });
    };

    const handleClick = (e) => {
      if (e.target.classList.contains('duplicate-btn')) {
        const container = e.target.closest('.template-container');
        if (!container) return;

        const newContainer = container.cloneNode(true);

        // Clear inputs in the duplicated container
        const inputFields = newContainer.querySelectorAll('textarea, input');
        inputFields.forEach((input) => (input.value = ''));

        // Clear the clickable words area
        const outputDiv = newContainer.querySelector('#output-hebrew');
        if (outputDiv) outputDiv.innerHTML = '';

        // Clear the Word List items
        const wordListItems = newContainer.querySelectorAll('.word-list-item');
        wordListItems.forEach((li) => {
          li.textContent = '';
        });

        // Insert duplicated container at the top
        mainWrapper.insertBefore(newContainer, mainWrapper.firstChild);

        // Reattach button functionality
        attachButtonFunctionality();
      }
    };

    const clearDuplicates = () => {
      while (mainWrapper.children.length > 1) {
        mainWrapper.removeChild(mainWrapper.lastChild);
      }
      // Reset the first container
      const remainingContainer = mainWrapper.querySelector('.template-container');
      if (remainingContainer) {
        const textboxes = remainingContainer.querySelectorAll('textarea, input');
        textboxes.forEach((textbox) => (textbox.value = ''));

        const outputDiv = remainingContainer.querySelector('#output-hebrew');
        if (outputDiv) outputDiv.innerHTML = '';

        // Clear the Word List
        const wordListItems = remainingContainer.querySelectorAll('.word-list-item');
        wordListItems.forEach((li) => {
          li.textContent = '';
        });
      }
      console.log('All duplicates cleared, and textboxes reset.');
      attachButtonFunctionality();
    };

    mainWrapper.addEventListener('click', handleClick);
    clearBtn.addEventListener('click', clearDuplicates);

    attachButtonFunctionality();

    return () => {
      if (mainWrapper) {
        mainWrapper.removeEventListener('click', handleClick);
      }
      if (clearBtn) {
        clearBtn.removeEventListener('click', clearDuplicates);
      }
    };
  }, []);

  // 1) Handle Translation
  const handleTranslate = async (e) => {
    const container = e.target.closest('.template-container');
    if (!container) return;

    const inputField = container.querySelector('#input-english');
    const outputDiv = container.querySelector('#output-hebrew');
    if (!inputField || !outputDiv) return;

    const inputValue = inputField.value.trim();
    if (!inputValue) {
      alert('Please enter a sentence to translate.');
      return;
    }

    try {
      const translatedText = await translateText(inputValue);

      // Each word becomes a clickable <span>
      const words = translatedText.split(/\s+/);
      const clickableHTML = words
        .map(
          (word) =>
            `<span class="clickable-word cursor-pointer px-1 rounded 
                    hover:bg-blue-600 hover:text-white transition-colors duration-200">${word}</span>`
        )
        .join(' ');

      outputDiv.innerHTML = clickableHTML;

      // Add click event to each word
      const allSpans = outputDiv.querySelectorAll('.clickable-word');
      allSpans.forEach((span) => {
        span.addEventListener('click', () => {
          // For each Word List item, apply random punctuation to the right
          const wordListItems = container.querySelectorAll('.word-list-item');
          const originalHebrew = span.textContent || '';

          wordListItems.forEach((li) => {
            li.textContent = addRandomPunctuation(originalHebrew);
          });
        });
      });
    } catch (error) {
      console.error('Translation failed:', error);
      alert('An error occurred while translating. Please try again.');
    }
  };

  // 2) Handle Audio Pronunciation
  const handlePlayPronunciation = (e) => {
    const container = e.target.closest('.template-container');
    if (!container) return;

    const outputDiv = container.querySelector('#output-hebrew');
    if (!outputDiv) return;

    const spans = outputDiv.querySelectorAll('.clickable-word');
    const translation = Array.from(spans).map((s) => s.textContent).join(' ');
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

  // 3) Handle Save to Firestore
  const handleSave = async (e) => {
    let email = userEmail || (auth.currentUser && auth.currentUser.email);
    if (!email) {
      alert('You must be logged in to save sentences.');
      return;
    }

    const container = e.target.closest('.template-container');
    if (!container) return;

    const inputField = container.querySelector('#input-english');
    if (!inputField) return;

    // Reconstruct the translation
    const outputDiv = container.querySelector('#output-hebrew');
    const spans = outputDiv.querySelectorAll('.clickable-word');
    const translatedSentence = Array.from(spans).map((s) => s.textContent).join(' ');

    const englishSentence = inputField.value.trim();
    if (!englishSentence || !translatedSentence) {
      alert('Both the English sentence and its translation must be provided.');
      return;
    }

    try {
      const userDocRef = doc(db, 'userSavedLists', email);
      await setDoc(
        userDocRef,
        {
          sentencesList: arrayUnion(`${englishSentence} -> ${translatedSentence}`),
        },
        { merge: true }
      );
      alert('Sentence saved successfully!');
    } catch (error) {
      console.error('Error saving sentence:', error);
      alert('An error occurred while saving the sentence. Please try again.');
    }
  };

  return (
    <div className="col-span-3 bg-slate-800 dark:bg-gray-900 rounded-lg p-6 transition-all duration-300">
      <div className="flex justify-end">
        <button
          id="clear-btn"
          className="flex justify-end px-4 py-2 rounded-lg font-medium bg-slate-700 dark:bg-gray-800 
                     hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300"
        >
          Clear
        </button>
      </div>

      <div
        id="main-wrapper"
        className="scrollable-section max-h-96 overflow-y-auto p-6 flex flex-col gap-4"
      >
        {/* The original container */}
        <div id="content-container" className="flex gap-2 template-container">
          {/* Word List (4 items) */}
          <div
            className="bg-slate-700 dark:bg-gray-800 rounded-lg p-2 shadow-lg 
                       overflow-y-auto w-2/6 h-48 transition-all duration-300"
          >
            <h4 className="text-lg font-bold mb-4 text-white dark:text-gray-200 
                           text-center transition-all duration-300"
            >
              Word List
            </h4>
            <ul className="space-y-2">
              {['Word 1', 'Word 2', 'Word 3', 'Word 4'].map((word, index) => (
                <li
                  key={index}
                  className="px-4 py-2 bg-slate-800 dark:bg-gray-900 
                             rounded-lg shadow text-white dark:text-gray-300 
                             transition-all duration-300 word-list-item"
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>

          {/* Main area with input, translation, etc. */}
          <div
            id="tabWords"
            className="bg-slate-800 dark:bg-gray-900 rounded-lg p-6 shadow-lg 
                       flex-1 transition-all duration-300"
          >
            <div className="flex flex-col gap-4">
              {/* Save button */}
              <span className="flex justify-end px-4 py-2">
                <button
                  id="save-btn"
                  className="px-4 py-1 text-sm rounded-md font-medium bg-green-600 
                             dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 
                             transition-all duration-300"
                >
                  Save
                </button>
              </span>

              {/* English input + Translate */}
              <div className="flex items-center gap-10">
                <textarea
                  id="input-english"
                  placeholder="Type text here..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 
                             dark:bg-gray-800 text-white dark:text-gray-300 
                             transition-all duration-300"
                  rows="4"
                ></textarea>
                <button
                  id="translate-btn"
                  className="px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-700 
                             hover:bg-blue-700 dark:hover:bg-blue-800 
                             transition-all duration-300"
                >
                  Translate
                </button>
              </div>

              {/* The "translated" box */}
              <div className="flex items-center gap-4">
                <div
                  id="output-hebrew"
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 
                             dark:bg-gray-800 text-white dark:text-gray-300 
                             transition-all duration-300 min-h-[6rem]"
                >
                  {/* Clickable words inserted here by handleTranslate() */}
                </div>

                {/* Audio + Create a New Sentence */}
                <div className="flex flex-col gap-2">
                  <button
                    id="audio-btn"
                    className="px-4 py-2 bg-yellow-600 dark:bg-yellow-700 
                               hover:bg-yellow-700 dark:hover:bg-yellow-800 
                               transition-all duration-300"
                  >
                    Audio
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 dark:bg-red-700 
                               hover:bg-red-700 dark:hover:bg-red-800 
                               duplicate-btn transition-all duration-300"
                  >
                    Create a New Sentence
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default AccountMainTab;
