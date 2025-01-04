import '../styles/globals.css';
import React, { useEffect, useState } from 'react';
import { translateText } from '../utils/translationApi'; // Import your translation API function

const AccountMainTab = () => {
  useEffect(() => {
    const mainWrapper = document.getElementById('main-wrapper');
    const clearBtn = document.getElementById('clear-btn');

    if (!mainWrapper || !clearBtn) {
      console.warn('Main wrapper or clear button not found.');
      return;
    }

    // Function to attach translate functionality to all Translate buttons
    const attachTranslateFunctionality = () => {
      const translateButtons = mainWrapper.querySelectorAll('#translate-btn');
      translateButtons.forEach((btn) => {
        btn.removeEventListener('click', handleTranslate); // Avoid duplicate listeners
        btn.addEventListener('click', handleTranslate);
      });
    };

    const handleClick = (e) => {
      if (e.target.classList.contains('duplicate-btn')) {
        const container = e.target.closest('.template-container');
        if (container) {
          const newContainer = container.cloneNode(true);

          // Clear input fields in the new container
          const inputFields = newContainer.querySelectorAll('textarea, input');
          inputFields.forEach((input) => (input.value = ''));

          mainWrapper.insertBefore(newContainer, mainWrapper.firstChild);
          attachTranslateFunctionality(); // Reattach translate functionality to new buttons
        }
      }
    };

    const clearDuplicates = () => {
      // Remove all duplicate containers, leaving only the first one
      while (mainWrapper.children.length > 1) {
        mainWrapper.removeChild(mainWrapper.lastChild);
      }

      // Clear all textboxes in the remaining container
      const remainingContainer = mainWrapper.querySelector('.template-container');
      if (remainingContainer) {
        const textboxes = remainingContainer.querySelectorAll('textarea, input');
        textboxes.forEach((textbox) => (textbox.value = '')); // Reset all textboxes
      }

      console.log('All duplicates cleared, and textboxes reset.');
      attachTranslateFunctionality(); // Reattach functionality after clearing
    };

    mainWrapper.addEventListener('click', handleClick);
    clearBtn.addEventListener('click', clearDuplicates);

    // Attach translate functionality on component load
    attachTranslateFunctionality();

    return () => {
      if (mainWrapper) {
        mainWrapper.removeEventListener('click', handleClick);
      }
      if (clearBtn) {
        clearBtn.removeEventListener('click', clearDuplicates);
      }
    };
  }, []);

  // Function to handle translation
  const handleTranslate = async (e) => {
    const container = e.target.closest('.template-container'); // Identify the specific container
    const inputField = container.querySelector('#input-english');
    const outputField = container.querySelector('#output-hebrew');

    if (!inputField || !outputField) {
      console.warn('Input or output fields not found.');
      return;
    }

    const inputValue = inputField.value.trim();

    if (!inputValue) {
      alert('Please enter a sentence to translate.');
      return;
    }

    try {
      const translatedText = await translateText(inputValue); // Call the translation API
      outputField.value = translatedText; // Update the output field with the translation
    } catch (error) {
      console.error('Translation failed:', error);
      alert('An error occurred while translating. Please try again.');
    }
  };

  return (
    <div className="col-span-3 bg-slate-800 dark:bg-gray-900 rounded-lg p-6 transition-all duration-300">
      <div className="flex justify-end">
        <button
          id="clear-btn"
          className="flex justify-end px-4 py-2 rounded-lg font-medium bg-slate-700 dark:bg-gray-800 hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300"
        >
          Clear
        </button>
      </div>
      <div
        id="main-wrapper"
        className="scrollable-section max-h-96 overflow-y-auto p-6 flex flex-col gap-4"
      >
        <div id="content-container" className="flex gap-2 template-container">
          <div className="bg-slate-700 dark:bg-gray-800 rounded-lg p-2 shadow-lg overflow-y-auto w-2/6 h-48 transition-all duration-300">
            <h4 className="text-lg font-bold mb-4 text-white dark:text-gray-200 text-center transition-all duration-300">
              Word List
            </h4>
            <ul className="space-y-2">
              {['Word 1', 'Word 2', 'Word 3', 'Word 4'].map((word, index) => (
                <li
                  key={index}
                  className="px-4 py-2 bg-slate-800 dark:bg-gray-900 rounded-lg shadow text-white dark:text-gray-300 transition-all duration-300"
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
          <div
            id="tabWords"
            className="bg-slate-800 dark:bg-gray-900 rounded-lg p-6 shadow-lg flex-1 transition-all duration-300"
          >
            <div className="flex flex-col gap-4">
              <span className="flex justify-end px-4 py-2">
                <button className="px-4 py-1 text-sm rounded-md font-medium bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 transition-all duration-300">
                  Save
                </button>
              </span>
              <div className="flex items-center gap-10">
                <textarea
                  id="input-english"
                  placeholder="Type text here..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 transition-all duration-300"
                  rows="4"
                ></textarea>
                <button
                  id="translate-btn"
                  className="px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300"
                >
                  Translate
                </button>
              </div>
              <div className="flex items-center gap-4">
                <textarea
                  id="output-hebrew"
                  placeholder="Translation will appear here..."
                  readOnly
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 transition-all duration-300"
                  rows="4"
                ></textarea>
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 bg-yellow-600 dark:bg-yellow-700 hover:bg-yellow-700 dark:hover:bg-yellow-800 transition-all duration-300">
                    Audio
                  </button>
                  <button className="px-4 py-2 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 duplicate-btn transition-all duration-300">
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
