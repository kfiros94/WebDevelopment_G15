'use client'; // Ensures this is a client-side component

import { useState, useEffect } from "react";
import Translate from "../../components/Translate";
import WordTable from "../../components/WordTable";
import { translateText } from "../../utils/translationApi";

const MyWords = () => {
  const [words, setWords] = useState(() => {
    // Load initial data from localStorage
    if (typeof window !== "undefined") {
      const savedWords = localStorage.getItem("myWords");
      return savedWords ? JSON.parse(savedWords) : [];
    }
    return [];
  });

  const [selectedWord, setSelectedWord] = useState(null);
  const [highlightedWord, setHighlightedWord] = useState("");

  useEffect(() => {
    // Save words to localStorage whenever the `words` state changes
    localStorage.setItem("myWords", JSON.stringify(words));
  }, [words]);

  const handleWordSelection = (punctuations) => {
    // Assume first punctuation object as default
    if (punctuations.length > 0) {
      setHighlightedWord(punctuations[0].word);
      setSelectedWord({
        hebrew: punctuations[0].word,
        pronunciation: "Pronunciation Placeholder", // Replace with actual pronunciation
        translation: `Translation of ${punctuations[0].word}`,
      });
    }
  };

  const handleAddWord = async () => {
    if (!highlightedWord) {
      alert("Please select a valid Hebrew word before saving.");
      return;
    }

    try {
      // Fetch English translation for the highlighted Hebrew word
      const englishTranslation = await translateText(highlightedWord, "en");

      // Generate pronunciation (this is mocked; replace with actual logic or API)
      const pronunciation = `${highlightedWord}`;

      // Combine English and Hebrew for Translation
      const translation = `${englishTranslation} ${highlightedWord}`;

      const newWord = {
        english: englishTranslation,
        hebrew: highlightedWord,
        pronunciation,
        translation,
      };

      setWords([...words, newWord]);
      setSelectedWord(null);
      setHighlightedWord("");
    } catch (error) {
      alert("Failed to add word. Please try again.");
      console.error(error);
    }
  };

  const deleteWord = (index) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const playAudio = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "he-IL";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported in your browser.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-slate-900 min-h-screen text-white relative">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          My Vocabulary
        </h1>

        {/* Translate Component */}
        <div className="flex items-center gap-4">
          <Translate
            onWordSelection={(punctuations) => handleWordSelection(punctuations)}
            onClear={() => {
              setSelectedWord(null);
              setHighlightedWord("");
            }}
          />
          {/* Save Button */}
          <button
            className={`px-6 py-3 rounded-lg ${
              highlightedWord
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            } transition-all duration-300 transform hover:scale-105 shadow-md`}
            onClick={handleAddWord}
            disabled={!highlightedWord}
          >
            Save
          </button>
        </div>

        {/* Word List Table */}
        <WordTable words={words} onDelete={deleteWord} onPlayAudio={playAudio} />
      </div>
    </div>
  );
};

export default MyWords;
