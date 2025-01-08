'use client';

import React, { useState, useEffect } from "react";
import Translate from "../../components/Translate";
import WordTable from "../../components/WordTable";
import { translateText } from "../../utils/translationApi";
import withAuth from "../../components/withAuth";


const MyWords = () => {
  const [words, setWords] = useState(() => {
    if (typeof window !== "undefined") {
      const savedWords = localStorage.getItem("myWords");
      return savedWords ? JSON.parse(savedWords) : [];
    }
    return [];
  });

  

  const [highlightedWords, setHighlightedWords] = useState([]); // Track multiple selected words
  const [category, setCategory] = useState("both"); // Track the selected category
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("myWords", JSON.stringify(words));
    }
  }, [words]);

  const hebrewToEnglishMap = {
    'א': 'A', 'ב': 'V', 'ג': 'G', 'ד': 'D', 'ה': 'H', 'ו': 'O', 'ז': 'Z', 'ח': 'Ch', 'ט': 'T',
    'י': 'Y', 'כ': 'K', 'ך': 'K', 'ל': 'L', 'מ': 'M', 'ם': 'M', 'נ': 'N', 'ן': 'N', 'ס': 'S',
    'ע': 'A', 'פ': 'P', 'ף': 'P', 'צ': 'Tz', 'ץ': 'Tz', 'ק': 'K', 'ר': 'R', 'ש': 'Sh', 'ת': 'T'
  };

  const transliterateHebrew = (text) => {
    return Array.from(text).map((char, index, array) => {
      if (char === 'ב') return index === 0 ? 'B' : 'V';
      if (char === 'ו') return index === 0 || index === array.length - 1 ? 'V' : 'O';
      return hebrewToEnglishMap[char] || char;
    }).join('');
  };

  const handleAddWords = async () => {
    if (highlightedWords.length === 0) {
      setShowPopup(true);
      return;
    }

    try {
      for (let word of highlightedWords) {
        const englishTranslation = await translateText(word, "en");
        const transliteratedPronunciation = transliterateHebrew(word);

        const newWord = {
          english: englishTranslation,
          hebrew: word,
          pronunciation: transliteratedPronunciation,
          type: "word",
        };

        setWords((prevWords) => [...prevWords, newWord]);
      }

      setHighlightedWords([]); // Clear highlighted words after saving
    } catch (error) {
      console.error("Error adding words:", error);
      alert("Failed to add words. Please try again.");
    }
  };

  const handleAddSentence = async () => {
    if (highlightedWords.length === 0) {
      setShowPopup(true);
      return;
    }

    try {
      const sentenceToTranslate = highlightedWords.join(" "); // Combine the selected words
      const englishTranslation = await translateText(sentenceToTranslate, "en");
      const transliteratedPronunciation = transliterateHebrew(sentenceToTranslate);

      const newSentence = {
        english: englishTranslation,
        hebrew: sentenceToTranslate,
        pronunciation: transliteratedPronunciation,
        type: "sentence",
      };

      setWords((prevWords) => [...prevWords, newSentence]);
      setHighlightedWords([]); // Clear after saving
    } catch (error) {
      console.error("Error adding sentence:", error);
      alert("Failed to add sentence. Please try again.");
    }
  };

  const deleteWord = (index) => {
    setWords((prevWords) => prevWords.filter((_, i) => i !== index));
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

  // Filter words based on the selected category
  const filteredWords = words.filter((word) => category === "both" || word.type === category);

  return (
    <div className="p-6 bg-gray-100 dark:bg-slate-900 min-h-screen text-white relative">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          My Vocabulary
        </h1>

        <div className="flex flex-col gap-4">
          <Translate
            onWordSelection={(punctuations) => {
              const selectedWords = punctuations.map((p) => p.word);
              setHighlightedWords((prevWords) => [
                ...new Set([...prevWords, ...selectedWords]),
              ]);
            }}
            onClear={() => setHighlightedWords([])}
          />
          <div className="flex items-center gap-4">
            <button
              className={`px-6 py-3 rounded-lg ${highlightedWords.length > 0 ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-600 text-gray-300 cursor-not-allowed"} transition-all duration-300 transform hover:scale-105 shadow-md`}
              onClick={handleAddWords}
            >
              Save Words
            </button>
            <button
              className={`px-6 py-3 rounded-lg ${highlightedWords.length > 0 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-600 text-gray-300 cursor-not-allowed"} transition-all duration-300 transform hover:scale-105 shadow-md`}
              onClick={handleAddSentence}
              disabled={highlightedWords.length === 0}
            >
              Save Sentence
            </button>
          </div>
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex justify-center mb-6 mt-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-700 text-white p-2 rounded-md"
          >
            <option value="both">All</option>
            <option value="word">Words</option>
            <option value="sentence">Sentences</option>
          </select>
        </div>

        <WordTable
          words={filteredWords} // Pass filtered words based on the selected category
          onDelete={deleteWord}
          onPlayAudio={playAudio}
        />
      </div>
    </div>
  );
};

export default withAuth(MyWords);
