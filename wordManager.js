// wordManager.js
class WordManager {
    constructor() {
        this.savedWords = this.loadSavedWords();
    }

    // Load saved words from localStorage
    loadSavedWords() {
        const saved = localStorage.getItem('savedWords');
        return saved ? JSON.parse(saved) : [];
    }

    // Save a new word
    saveWord(hebrewText, pronunciation, translation) {
        const newWord = {
            hebrewText,
            pronunciation,
            translation,
            dateAdded: new Date().toISOString()
        };

        // Check if word already exists
        if (!this.savedWords.some(word => word.hebrewText === hebrewText)) {
            this.savedWords.push(newWord);
            localStorage.setItem('savedWords', JSON.stringify(this.savedWords));
            return true;
        }
        return false;
    }

    // Delete a word
    deleteWord(hebrewText) {
        this.savedWords = this.savedWords.filter(word => word.hebrewText !== hebrewText);
        localStorage.setItem('savedWords', JSON.stringify(this.savedWords));
    }

    // Get all saved words
    getAllWords() {
        return this.savedWords;
    }
}