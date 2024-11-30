// mywords.js - create this new file
document.addEventListener('DOMContentLoaded', () => {
    const wordManager = new WordManager();
    const wordsTableBody = document.querySelector('table tbody');
    
    function displaySavedWords() {
        const words = wordManager.getAllWords();
        wordsTableBody.innerHTML = words.map(word => `
            <tr class="border-b dark:border-gray-700">
                <td class="p-4">${word.hebrewText}</td>
                <td class="p-4">${word.pronunciation}</td>
                <td class="p-4">${word.translation}</td>
                <td class="p-4">
                    <button onclick="playAudio('${word.hebrewText}')" 
                            class="text-blue-500 hover:text-blue-700">
                        Audio
                    </button>
                </td>
                <td class="p-4">
                    <button onclick="deleteWord('${word.hebrewText}')"
                            class="text-red-500 hover:text-red-700">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Audio playback function
    window.playAudio = function(word) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'he-IL';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    };

    // Delete word function
    window.deleteWord = function(hebrewText) {
        if (confirm('Are you sure you want to delete this word?')) {
            wordManager.deleteWord(hebrewText);
            displaySavedWords();
        }
    };

    // Initial display
    displaySavedWords();
});