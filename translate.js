// Wait for the DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', function () {
    // Create a single instance of WordManager to handle saving/loading words
    const wordManager = new WordManager();

    // Add click event listener to the translate button
    document.getElementById('translateButton').addEventListener('click', async function () {
        // Get the English text from the input and remove any extra whitespace
        const englishText = document.getElementById('englishInput').value.trim();
        const translationOutput = document.getElementById('translationOutput');

        // Input validation
        if (!englishText) {
            translationOutput.textContent = 'Please enter a sentence to translate.';
            translationOutput.classList.remove('hidden');
            return;
        }

        // Show loading state to user
        translationOutput.textContent = 'Translating...';
        translationOutput.classList.remove('hidden');

        try {
            // Make API call to Microsoft Translator
            const response = await fetch('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=he', {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': '8rsq4EfUQDZfSUNNArnI5I4V5hchLHHvGWEyoEErdatl4yD4NF3mJQQJ99AKAC3pKaRXJ3w3AAAbACOG25Yf',
                    'Ocp-Apim-Subscription-Region': 'eastasia',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([
                    { text: englishText }
                ]),
            });

            // Check if the API request was successful
            if (!response.ok) throw new Error(`Failed to fetch translation: ${response.status}`);

            const data = await response.json();
            const translatedText = data[0].translations[0].text;

            // Clear previous translation results
            translationOutput.innerHTML = '';

            // Create container for full translation and play button
            const translationContainer = document.createElement('div');
            translationContainer.className = 'mb-6 flex items-center justify-between';
            
            // Create and style the translated text element
            const translatedTextDiv = document.createElement('div');
            translatedTextDiv.className = 'text-xl font-bold';
            translatedTextDiv.textContent = translatedText;
            
            // Create and style the play button for full sentence
            const playButton = document.createElement('button');
            playButton.className = 'ml-4 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95';
            playButton.textContent = 'Play';
            
            // Add audio playback functionality to the play button
            playButton.addEventListener('click', function() {
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(translatedText);
                    utterance.lang = 'he-IL'; // Set language to Hebrew
                    utterance.rate = 0.8;     // Slightly slower speech rate for clarity
                    speechSynthesis.speak(utterance);
                } else {
                    alert('Speech synthesis is not supported in your browser.');
                }
            });

            // Add translation and play button to container
            translationContainer.appendChild(translatedTextDiv);
            translationContainer.appendChild(playButton);
            translationOutput.appendChild(translationContainer);

// Create container for individual words
const words = translatedText.split(' ');
const englishWords = englishText.split(' ');
const wordsContainer = document.createElement('div');
wordsContainer.className = 'mt-4 space-y-2';

// Create elements for each word with save functionality
words.forEach((hebrewWord, index) => {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'flex items-center space-x-2';
    
    // Create HTML structure for each word - now with only the save button
    wordDiv.innerHTML = `
        <span class="text-lg">${hebrewWord}</span>
        <span class="text-gray-500">(${englishWords[index] || ''})</span>
        <button class="save-word-btn px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            Save Word
        </button>
    `;
    
    // Add save functionality to each word
    const saveButton = wordDiv.querySelector('.save-word-btn');
    saveButton.addEventListener('click', () => {
        const saved = wordManager.saveWord(
            hebrewWord,
            hebrewWord, // Using Hebrew word as pronunciation for now
            englishWords[index] || ''
        );
        
        if (saved) {
            saveButton.textContent = 'Saved!';
            saveButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            saveButton.classList.add('bg-gray-500');
        } else {
            alert('This word is already in your saved words!');
        }
    });
    
    wordsContainer.appendChild(wordDiv);
});

            // Add the words container to the translation output
            translationOutput.appendChild(wordsContainer);
            translationOutput.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            translationOutput.textContent = 'Failed to fetch translation. Please try again later.';
        }
    });

    // Mobile menu functionality
    const hamburgerButton = document.getElementById('hamburgerButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburgerButton && mobileMenu) {
        // Toggle mobile menu when hamburger button is clicked
        hamburgerButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!hamburgerButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
});