import '../styles/globals.css';
import React, { useEffect } from 'react';

const AccountMainTab = () => {
  useEffect(() => {
    const mainWrapper = document.getElementById('main-wrapper');
    const clearBtn = document.getElementById('clear-btn');

    if (!mainWrapper || !clearBtn) {
      console.warn('Main wrapper or clear button not found.');
      return;
    }

    const handleClick = (e) => {
      if (e.target.classList.contains('duplicate-btn')) {
        const container = e.target.closest('.template-container');
        if (container) {
          const newContainer = container.cloneNode(true);
          const inputFields = newContainer.querySelectorAll('textarea, input');
          inputFields.forEach((input) => (input.value = ''));
          mainWrapper.insertBefore(newContainer, mainWrapper.firstChild);
        }
      }
    };

    const clearDuplicates = () => {
      while (mainWrapper.children.length > 1) {
        mainWrapper.removeChild(mainWrapper.lastChild);
      }
      console.log('All duplicates cleared. Only the first tab remains.');
    };

    mainWrapper.addEventListener('click', handleClick);
    clearBtn.addEventListener('click', clearDuplicates);

    return () => {
      if (mainWrapper) {
        mainWrapper.removeEventListener('click', handleClick);
      }
      if (clearBtn) {
        clearBtn.removeEventListener('click', clearDuplicates);
      }
    };
  }, []);

  return (
    <div className="col-span-3 bg-slate-800 rounded-lg p-6">
      <div className="flex justify-end">
        <button id="clear-btn" className="flex justify-end px-4 py-2 rounded-lg font-medium bg-slate-700 hover:bg-blue-700">
          Clear
        </button>
      </div>
      <div id="main-wrapper" className="scrollable-section max-h-96 overflow-y-auto p-6 flex flex-col gap-4">
        <div id="content-container" className="flex gap-2 template-container">
          <div className="bg-slate-700 rounded-lg p-2 shadow-lg overflow-y-auto w-2/6 h-48">
            <h4 className="text-lg font-bold mb-4 text-center">Word List</h4>
            <ul className="space-y-2">
              <li className="px-4 py-2 bg-slate-800 rounded-lg shadow">Word 1</li>
              <li className="px-4 py-2 bg-slate-800 rounded-lg shadow">Word 2</li>
              <li className="px-4 py-2 bg-slate-800 rounded-lg shadow">Word 3</li>
              <li className="px-4 py-2 bg-slate-800 rounded-lg shadow">Word 4</li>
            </ul>
          </div>
          <div id="tabWords" className="bg-slate-800 rounded-lg p-6 shadow-lg flex-1">
            <div className="flex flex-col gap-4">
              <span className="flex justify-end px-4 py-2">
                <button className="px-4 py-1 text-sm rounded-md font-medium bg-green-600 hover:bg-green-700">Save</button>
              </span>
              <div className="flex items-center gap-10">
                <textarea id="input-english" placeholder="Type text here..." className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white" rows="4"></textarea>
                <button id="translate-btn" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">Translate</button>
              </div>
              <div className="flex items-center gap-4">
                <textarea id="output-hebrew" placeholder="Translation will appear here..." className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white" rows="4" readOnly></textarea>
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700">Audio</button>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 duplicate-btn">Create a New Sentence</button>
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
