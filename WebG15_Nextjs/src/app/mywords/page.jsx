"use client"

import React, { useState, useEffect } from "react"
import Translate from "../../components/Translate"
import WordTable from "../../components/WordTable"
import { db } from "../../utils/firebaseConfig" // Firestore setup
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"
import { auth } from "../../utils/firebaseConfig" // Firebase auth
import withAuth from "../../components/withAuth" // Higher-order component to ensure user is logged in
import { translateText } from "../../utils/translationApi"

/**
 * MyWords
 *
 * A component to manage the user's saved words and sentences.
 * Allows adding single words or entire sentences to a Firestore doc
 * in 'userSavedLists/{userEmail}' and displays them in separate tables.
 */
const MyWords = () => {
    // State arrays for storing single words and sentences
    const [words, setWords] = useState([])
    const [sentences, setSentences] = useState([])

    // Tracks words the user highlights during the translation
    const [highlightedWords, setHighlightedWords] = useState([])

    // Tracks the final translated sentence and the original English input
    const [translatedSentence, setTranslatedSentence] = useState(null)
    const [englishSentence, setEnglishSentence] = useState(null)

    // User's email for Firestore read/write
    const [userEmail, setUserEmail] = useState(null)

    /**
     * Fetch the user's saved words/sentences from Firestore on component mount.
     */
    useEffect(() => {
        const fetchSavedLists = async () => {
            const user = auth.currentUser
            if (user) {
                setUserEmail(user.email)
                // Firestore document reference
                const docRef = doc(db, "userSavedLists", user.email)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const savedList = docSnap.data().sentencesList || []
                    const formattedWords = []
                    const formattedSentences = []

                    // Split each entry ("English -> Hebrew") to determine
                    // if it's a single word or a sentence
                    savedList.forEach((entry) => {
                        const [english, hebrew] = entry.split(" -> ")
                        const hebrewTrimmed = hebrew.trim()
                        const isSentence = hebrewTrimmed.split(" ").length > 1

                        if (isSentence) {
                            // Sentence object
                            formattedSentences.push({
                                english: english.trim(),
                                hebrew: hebrewTrimmed,
                                pronunciation: transliterateHebrew(hebrewTrimmed),
                                type: "sentence",
                            })
                        } else {
                            // Word object
                            formattedWords.push({
                                english: english.trim(),
                                hebrew: hebrewTrimmed,
                                pronunciation: transliterateHebrew(hebrewTrimmed),
                                type: "word",
                            })
                        }
                    })

                    // Update local state with the user's saved words/sentences
                    setWords(formattedWords)
                    setSentences(formattedSentences)
                } else {
                    // If document doesn't exist, initialize it with an empty array
                    await setDoc(docRef, { sentencesList: [] })
                }
            }
        }

        fetchSavedLists()
    }, [])

    /**
     * transliterateHebrew:
     * Converts Hebrew characters to an approximate English phonetic representation.
     */
    const transliterateHebrew = (text) => {
        const hebrewToEnglishMap = {
            א: "A",
            ב: "V",
            ג: "G",
            ד: "D",
            ה: "H",
            ו: "O",
            ז: "Z",
            ח: "Ch",
            ט: "T",
            י: "Y",
            כ: "K",
            ך: "K",
            ל: "L",
            מ: "M",
            ם: "M",
            נ: "N",
            ן: "N",
            ס: "S",
            ע: "A",
            פ: "P",
            ף: "F",
            צ: "Tz",
            ץ: "Tz",
            ק: "K",
            ר: "R",
            ש: "Sh",
            ת: "T",
        }
        return Array.from(text)
            .map((char) => hebrewToEnglishMap[char] || char)
            .join("")
    }

    /**
     * handleAddWords:
     * Adds each highlighted word to Firestore, translating them to English first.
     */
    const handleAddWords = async () => {
        if (highlightedWords.length === 0) return // No words highlighted

        // Translate each highlighted word to English
        const newWords = await Promise.all(
            highlightedWords.map(async (word) => ({
                english: await translateText(word, "en"),
                hebrew: word,
                pronunciation: transliterateHebrew(word),
                type: "word",
            })),
        )

        // Append new words to local 'words' state
        const updatedWords = [...words, ...newWords]
        setWords(updatedWords)

        // Clear highlighted words after saving
        setHighlightedWords([])

        // Update Firestore if user is logged in
        if (userEmail) {
            const docRef = doc(db, "userSavedLists", userEmail)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const currentData = docSnap.data().sentencesList || []
                // Convert each new word to the "English -> Hebrew" format
                const updatedSentencesList = [...currentData, ...newWords.map((w) => `${w.english} -> ${w.hebrew}`)]
                await updateDoc(docRef, { sentencesList: updatedSentencesList })
            }
        }
    }

    /**
     * handleAddSentence:
     * Takes the final translated sentence plus the original English sentence,
     * saves them to local state and Firestore.
     */
    const handleAddSentence = async () => {
        // Must have both an original English sentence & a translated sentence
        if (!translatedSentence || !englishSentence) return

        // Create a new sentence object
        const newSentence = {
            english: englishSentence,
            hebrew: translatedSentence,
            pronunciation: transliterateHebrew(translatedSentence),
            type: "sentence",
        }

        // Append to local 'sentences' state
        const updatedSentences = [...sentences, newSentence]
        setSentences(updatedSentences)

        // Update Firestore
        if (userEmail) {
            const docRef = doc(db, "userSavedLists", userEmail)
            // Rebuild the entire sentence list from local state
            const updatedSentencesList = [
                ...words.map((w) => `${w.english} -> ${w.hebrew}`),
                ...updatedSentences.map((s) => `${s.english} -> ${s.hebrew}`),
            ]
            await updateDoc(docRef, { sentencesList: updatedSentencesList })
        }

        // Reset the current sentence input
        setTranslatedSentence(null)
        setEnglishSentence(null)
    }

    /**
     * deleteWord:
     * Removes a word or sentence from local state and from Firestore.
     * @param {number} index - The index in the array (words or sentences) to remove
     * @param {string} type - Either "word" or "sentence"
     */
    const deleteWord = async (index, type) => {
        let updatedWords = [...words]
        let updatedSentences = [...sentences]

        if (type === "word") {
            updatedWords = updatedWords.filter((_, i) => i !== index)
            setWords(updatedWords)
        } else {
            updatedSentences = updatedSentences.filter((_, i) => i !== index)
            setSentences(updatedSentences)
        }

        // Update Firestore doc if user is logged in
        if (userEmail) {
            const docRef = doc(db, "userSavedLists", userEmail)
            const updatedSentencesList = [
                ...updatedWords.map((w) => `${w.english} -> ${w.hebrew}`),
                ...updatedSentences.map((s) => `${s.english} -> ${s.hebrew}`),
            ]
            await updateDoc(docRef, { sentencesList: updatedSentencesList })
        }
    }

    /**
     * playAudio:
     * Uses the browser's SpeechSynthesis API to pronounce the Hebrew text out loud.
     */
    const playAudio = (text) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = "he-IL" // Use Hebrew voice
            window.speechSynthesis.speak(utterance)
        } else {
            alert("Speech synthesis is not supported in your browser.")
        }
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-slate-900 min-h-screen">
            <div className="container mx-auto">
                {/* Page Heading */}
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">My Vocabulary</h1>

                {/*
          Translation Input Section:
          'Translate' component handles user input and returns 
          the final English sentence + Hebrew translation.
        */}
                <Translate
                    onTranslationComplete={(englishInput, translatedText) => {
                        setEnglishSentence(englishInput)
                        setTranslatedSentence(translatedText)
                    }}
                    onWordSelection={(punctuations) => {
                        const selectedWords = punctuations.map((p) => p.word)
                        // Use a Set to avoid duplicates
                        setHighlightedWords((prevWords) => [...new Set([...prevWords, ...selectedWords])])
                    }}
                    onClear={() => {
                        setHighlightedWords([])
                        setTranslatedSentence(null)
                        setEnglishSentence(null)
                    }}
                />

                {/* Action Buttons for saving words or entire sentences */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                    <button
                        className={`px-6 py-3 rounded-lg ${
                            highlightedWords.length > 0
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-600 text-gray-300 cursor-not-allowed"
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

                {/* Words Table Section */}
                <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-4">Words Table</h2>
                <div className="overflow-x-auto">
                    <WordTable words={words} onDelete={(index) => deleteWord(index, "word")} onPlayAudio={playAudio} />
                </div>

                {/* Sentences Table Section */}
                <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-4">Sentences Table</h2>
                <div className="overflow-x-auto">
                    <WordTable words={sentences} onDelete={(index) => deleteWord(index, "sentence")} onPlayAudio={playAudio} />
                </div>
            </div>
        </div>
    )
}

// Wrap the component with withAuth to ensure user must be logged in
export default withAuth(MyWords)
