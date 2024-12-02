document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('translateButton').addEventListener('click', async function () {
        const englishText = document.getElementById('englishInput').value.trim();
        const translationOutput = document.getElementById('translationOutput');

        if (!englishText) {
            translationOutput.textContent = 'Please enter a sentence to translate.';
            translationOutput.classList.remove('hidden');
            return;
        }

        // Show loading message
        translationOutput.textContent = 'Translating...';
        translationOutput.classList.remove('hidden');

        try {
            const response = await fetch('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=he', {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': 'SECRET KEY DO NOT PUSH TO GIT', // The API key פה שמים את ה
                    'Ocp-Apim-Subscription-Region': 'eastasia', // Replace with the region
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([
                    { text: englishText }
                ]),
            });

            if (!response.ok) throw new Error(`Failed to fetch translation: ${response.status}`);

            const data = await response.json();
            const translatedText = data[0].translations[0].text;

            // Display the translation
            translationOutput.innerHTML = `
                ${translatedText}
                <button id="playButton" 
                    class="ml-4 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 
                           transition-all duration-300 transform hover:scale-105 shadow-md 
                           hover:shadow-lg active:scale-95">
                    Play
                </button>
            `;

            // Add Play Button Functionality
            const playButton = document.getElementById('playButton');
            playButton.addEventListener('click', function () {
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(translatedText);
                    utterance.lang = 'he-IL'; // Set to Hebrew
                    utterance.rate = 0.8; // Slow down for clarity
                    speechSynthesis.speak(utterance);
                } else {
                    alert('Speech synthesis is not supported in your browser.');
                }
            });
        } catch (error) {
            console.error(error);
            translationOutput.textContent = 'Failed to fetch translation. Please try again later.';
        }
    });
});
