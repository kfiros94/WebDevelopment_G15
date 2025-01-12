'use client';

import React, { useState, useEffect } from "react";
import Translate from "../../components/Translate";
import WordTable from "../../components/WordTable";
import { db } from "../../utils/firebaseConfig"; // Firestore instance
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth } from "../../utils/firebaseConfig"; // Firebase auth
import withAuth from "../../components/withAuth";
import { translateText } from "../../utils/translationApi";

const MyWords = () => {
  const [words, setWords] = useState([]); // Single words
  const [sentences, setSentences] = useState([]); // Sentences
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [translatedSentence, setTranslatedSentence] = useState(null);
  const [englishSentence, setEnglishSentence] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // Track user email for Firestore operations

  useEffect(() => {
    const fetchSavedLists = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email);
        const docRef = doc(db, "userSavedLists", user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const savedList = docSnap.data().sentencesList || [];
          const formattedWords = [];
          const formattedSentences = [];

          // Split words and sentences
          savedList.forEach((entry) => {
            const [english, hebrew] = entry.split(" -> ");
            const hebrewTrimmed = hebrew.trim();
            const isSentence = hebrewTrimmed.split(" ").length > 1;

            if (isSentence) {
              formattedSentences.push({
                english: english.trim(),
                hebrew: hebrewTrimmed,
                pronunciation: transliterateHebrew(hebrewTrimmed),
                type: "sentence",
              });
            } else {
              formattedWords.push({
                english: english.trim(),
                hebrew: hebrewTrimmed,
                pronunciation: transliterateHebrew(hebrewTrimmed),
                type: "word",
              });
            }
          });

          setWords(formattedWords);
          setSentences(formattedSentences);
        } else {
          await setDoc(docRef, { sentencesList: [] });
        }
      }
    };

    fetchSavedLists();
  }, []);

  const transliterateHebrew = (text) => {
    const hebrewToEnglishMap = {
      'א': 'A', 'ב': 'V', 'ג': 'G', 'ד': 'D', 'ה': 'H', 'ו': 'O', 'ז': 'Z', 'ח': 'Ch', 'ט': 'T',
      'י': 'Y', 'כ': 'K', 'ך': 'K', 'ל': 'L', 'מ': 'M', 'ם': 'M', 'נ': 'N', 'ן': 'N', 'ס': 'S',
      'ע': 'A', 'פ': 'P', 'ף': 'F', 'צ': 'Tz', 'ץ': 'Tz', 'ק': 'K', 'ר': 'R', 'ש': 'Sh', 'ת': 'T'
    };
    return Array.from(text).map((char) => hebrewToEnglishMap[char] || char).join('');
  };

  const handleAddWords = async () => {
    if (highlightedWords.length === 0) return; // No words selected
  
    const newWords = await Promise.all(
      highlightedWords.map(async (word) => ({
        english: await translateText(word, "en"),
        hebrew: word,
        pronunciation: transliterateHebrew(word),
        type: "word",
      }))
    );
  
    const updatedWords = [...words, ...newWords]; // Append only the new words
    setWords(updatedWords); // Update state with new words
    setHighlightedWords([]); // Clear highlighted words after saving
  
    if (userEmail) {
      const docRef = doc(db, "userSavedLists", userEmail);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const currentData = docSnap.data().sentencesList || [];
        const updatedSentencesList = [
          ...currentData, // Existing data from Firestore
          ...newWords.map((w) => `${w.english} -> ${w.hebrew}`), // New words only
        ];
        await updateDoc(docRef, { sentencesList: updatedSentencesList });
      }
    }
  };
  
  
  const handleAddSentence = async () => {
    if (!translatedSentence || !englishSentence) return;
  
    const newSentence = {
      english: englishSentence,
      hebrew: translatedSentence,
      pronunciation: transliterateHebrew(translatedSentence),
      type: "sentence",
    };
  
    const updatedSentences = [...sentences, newSentence]; // Correctly append to the `sentences` list
    setSentences(updatedSentences);
  
    if (userEmail) {
      const docRef = doc(db, "userSavedLists", userEmail);
      const updatedSentencesList = [
        ...words.map((w) => `${w.english} -> ${w.hebrew}`),
        ...updatedSentences.map((s) => `${s.english} -> ${s.hebrew}`),
      ]; // Ensure both lists are combined properly
      await updateDoc(docRef, { sentencesList: updatedSentencesList });
    }
  
    setTranslatedSentence(null);
    setEnglishSentence(null);
  };
  

  const deleteWord = async (index, type) => {
    let updatedWords = [...words]; // Create copies of words and sentences
    let updatedSentences = [...sentences];
  
    if (type === "word") {
      updatedWords = updatedWords.filter((_, i) => i !== index); // Remove the selected word
      setWords(updatedWords);
    } else {
      updatedSentences = updatedSentences.filter((_, i) => i !== index); // Remove the selected sentence
      setSentences(updatedSentences);
    }
  
    if (userEmail) {
      const docRef = doc(db, "userSavedLists", userEmail);
      const updatedSentencesList = [
        ...updatedWords.map((w) => `${w.english} -> ${w.hebrew}`),
        ...updatedSentences.map((s) => `${s.english} -> ${s.hebrew}`),
      ]; // Combine both words and sentences
  
      await updateDoc(docRef, { sentencesList: updatedSentencesList }); // Update Firestore
    }
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
    <div className="p-6 bg-gray-100 dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">My Vocabulary</h1>
        <Translate
          onTranslationComplete={(englishInput, translatedText) => {
            setEnglishSentence(englishInput);
            setTranslatedSentence(translatedText);
          }}
          onWordSelection={(punctuations) => {
            const selectedWords = punctuations.map((p) => p.word);
            setHighlightedWords((prevWords) => [...new Set([...prevWords, ...selectedWords])]);
          }}
          onClear={() => {
            setHighlightedWords([]);
            setTranslatedSentence(null);
            setEnglishSentence(null);
          }}
        />
        <div className="flex justify-center gap-4 mt-4">
          <button
            className={`px-6 py-3 rounded-lg ${
              highlightedWords.length > 0 ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
            onClick={handleAddWords}
          >
            Save Words
          </button>
          <button
            className={`px-6 py-3 rounded-lg ${
              translatedSentence ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
            onClick={handleAddSentence}
            disabled={!translatedSentence}
          >
            Save Sentence
          </button>
        </div>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Words Table</h2>
        <WordTable words={words} onDelete={(index) => deleteWord(index, "word")} onPlayAudio={playAudio} />

        <h2 className="text-2xl font-semibold mt-6 mb-4">Sentences Table</h2>
        <WordTable words={sentences} onDelete={(index) => deleteWord(index, "sentence")} onPlayAudio={playAudio} />
      </div>
    </div>
  );
};

export default withAuth(MyWords);