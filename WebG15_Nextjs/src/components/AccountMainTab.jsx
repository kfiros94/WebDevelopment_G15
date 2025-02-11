"use client"

import "../styles/globals.css"
import React, { useEffect, useState } from "react"
import { translateText } from "../utils/translationApi"
import { auth, db } from "../utils/firebaseConfig"
import { doc, setDoc, arrayUnion, collection, getDocs } from "firebase/firestore"

// A set of punctuation marks commonly used in Hebrew
const punctuationMarks = [
    "ָ", // Kamatz
    "ַ", // Patach
    "ִ", // Chirik
    "ֶ", // Segol
    "ֹ", // Cholam
    "ֻ", // Kubutz
    "ְ", // Shva
]

// Some letters have restricted punctuation (constraints)
const punctuationConstraints = {
    ה: [], // 'ה' gets no punctuation
    ם: [], // Final mem gets no punctuation
    י: ["ָ"], // 'י' can only have Kamatz or nothing
    ו: ["ֹ", ""], // 'ו' can have Cholam (ֹ) or nothing
    מ: ["ֶ", "ַ"],
    ת: ["ַ"],
    ח: [""],
}

/**
 * addRandomPunctuation
 *
 * Takes a Hebrew word and adds a random punctuation mark after each character.
 * Some letters have constraints (e.g., 'ה' gets no punctuation).
 */
function addRandomPunctuation(hebrewWord) {
    return hebrewWord
        .split("")
        .map((char) => {
            // If the character has constraints
            if (punctuationConstraints.hasOwnProperty(char)) {
                const allowedMarks = punctuationConstraints[char]
                // If there are no allowed marks, return the char unchanged
                if (allowedMarks.length === 0) {
                    return char
                }
                // Otherwise pick a random punctuation from the allowed set
                const randomMark = allowedMarks[Math.floor(Math.random() * allowedMarks.length)]
                return char + randomMark
            }
            // If no constraints, pick from the default punctuation set
            const randomMark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)]
            return char + randomMark
        })
        .join("")
}

/**
 * AccountMainTab
 *
 * Renders a set of "containers," each containing:
 *  - A user input area (sentence to translate)
 *  - A translate button
 *  - A generated translation
 *  - A "Word List" that can display dotted versions from the Firestore 'collectWords' collection
 */
const AccountMainTab = () => {
    // Track the currently logged-in user's email
    const [userEmail, setUserEmail] = useState(null)

    // Holds the entire 'collectWords' data from Firestore
    // Key = base word, Value = {word: [...], meanings: [...]}, etc.
    const [collectWords, setCollectWords] = useState({})

    // An array of "containers," each representing a small "sentence" workflow
    const [containers, setContainers] = useState([
        {
            id: Date.now(), // Unique ID
            punctuatedWords: ["Word 1", "Word 2", "Word 3", "Word 4"], // Displayed initially
            selectedMeaning: null, // Chosen meaning from the 'Word List'
            inputText: "", // The user-input sentence to translate
            translatedWords: [], // The result from the translation
        },
    ])

    /**
     * useEffect #1: Check if there's a current user on mount,
     * and listen for auth changes. If logged in, store user.email in state.
     */
    useEffect(() => {
        const fetchUser = async () => {
            if (auth.currentUser) {
                setUserEmail(auth.currentUser.email)
            }
        }

        fetchUser()

        // Listen for changes in auth state
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email)
            } else {
                setUserEmail(null)
            }
        })

        return () => unsubscribe()
    }, [])

    /**
     * useEffect #2: Fetch 'collectWords' from Firestore (the 'collectWords' collection).
     * Store it in 'collectWords' state as an object for quick lookups.
     */
    useEffect(() => {
        const fetchCollectWords = async () => {
            try {
                // Grab all docs from 'collectWords' collection
                const querySnapshot = await getDocs(collection(db, "collectWords"))
                const wordsData = {}
                querySnapshot.forEach((doc) => {
                    wordsData[doc.id] = doc.data()
                })
                setCollectWords(wordsData)
            } catch (error) {
                console.error("Error fetching collectWords:", error)
                alert("Failed to load grammar data.")
            }
        }

        fetchCollectWords()
    }, [])

    /**
     * Add a new container (i.e., new mini "sentence translator" instance).
     */
    const handleAddContainer = () => {
        setContainers((prev) => [
            ...prev,
            {
                id: Date.now(),
                punctuatedWords: ["Word 1", "Word 2", "Word 3", "Word 4"],
                selectedMeaning: null,
                inputText: "",
                translatedWords: [],
            },
        ])
    }

    /**
     * Clear all containers, resetting to a single fresh container.
     */
    const handleClearContainers = () => {
        setContainers([
            {
                id: Date.now(),
                punctuatedWords: ["Word 1", "Word 2", "Word 3", "Word 4"],
                selectedMeaning: null,
                inputText: "",
                translatedWords: [],
            },
        ])
    }

    /**
     * Remove a specific container by its ID.
     */
    const handleRemoveContainer = (id) => {
        setContainers((prev) => prev.filter((container) => container.id !== id))
    }

    /**
     * Translate the text in a given container using 'translateText' from translationApi.
     * Then store the words in 'translatedWords'.
     */
    const handleTranslate = async (id) => {
        const containerIndex = containers.findIndex((c) => c.id === id)
        if (containerIndex === -1) return

        const container = containers[containerIndex]
        const inputValue = container.inputText.trim()

        if (!inputValue) {
            alert("Please enter a sentence to translate.")
            return
        }

        try {
            // translationApi call to get the translation
            const translatedText = await translateText(inputValue)
            // Split translation into individual words
            const words = translatedText.split(/\s+/).map((word, index) => ({
                id: index,
                text: word,
            }))

            // Update this container with the new translation
            const updatedContainers = [...containers]
            updatedContainers[containerIndex].translatedWords = words
            updatedContainers[containerIndex].punctuatedWords = ["Word 1", "Word 2", "Word 3", "Word 4"]
            updatedContainers[containerIndex].selectedMeaning = null
            setContainers(updatedContainers)
        } catch (error) {
            console.error("Translation failed:", error)
            alert("An error occurred while translating. Please try again.")
        }
    }

    /**
     * Called when the user clicks on a word in the translated text area.
     * Looks up 'collectWords' to find dotted forms for that base word (cleanWord).
     */
    const handleWordClick = (id, clickedWord) => {
        const containerIndex = containers.findIndex((c) => c.id === id)
        if (containerIndex === -1) return

        // Remove Hebrew punctuation from the clickedWord for a clean base
        const cleanWord = clickedWord.replace(/[\u0591-\u05C7]/g, "")

        const updatedContainers = [...containers]

        if (collectWords.hasOwnProperty(cleanWord)) {
            // 'collectWords[cleanWord]' is an object with 'word' and 'meanings'
            const wordData = collectWords[cleanWord]
            const dottedWords = wordData.word

            // If we have dotted forms, show them
            if (Array.isArray(dottedWords) && dottedWords.length > 0) {
                updatedContainers[containerIndex].punctuatedWords = dottedWords
                updatedContainers[containerIndex].selectedMeaning = null // Clear any previous selection
            } else {
                // If array is empty, no grammar available
                updatedContainers[containerIndex].punctuatedWords = [
                    "No grammar available",
                    "No grammar available",
                    "No grammar available",
                    "No grammar available",
                ]
                updatedContainers[containerIndex].selectedMeaning = null
            }
        } else {
            // If the baseWord doesn't exist in collectWords
            updatedContainers[containerIndex].punctuatedWords = [
                "No grammar available",
                "No grammar available",
                "No grammar available",
                "No grammar available",
            ]
            updatedContainers[containerIndex].selectedMeaning = null
        }

        setContainers(updatedContainers)
    }

    /**
     * Called when the user clicks a "dotted word" in the Word List.
     * Looks up the corresponding meaning from the 'meanings' array in 'collectWords'
     * and sets that as 'selectedMeaning'.
     */
    const handleWordListClick = (id, word) => {
        const containerIndex = containers.findIndex((c) => c.id === id)
        if (containerIndex === -1) return

        const updatedContainers = [...containers]

        // If the dotted word is just "No grammar available," do nothing
        if (word === "No grammar available") {
            updatedContainers[containerIndex].selectedMeaning = null
            setContainers(updatedContainers)
            return
        }

        // Remove punctuation for the base
        const baseWord = word.replace(/[\u0591-\u05C7]/g, "")

        if (collectWords.hasOwnProperty(baseWord)) {
            const wordData = collectWords[baseWord]
            // Find the index of the 'word' array that matches the dotted form
            const index = wordData.word.indexOf(word)
            // If there's a matching meaning, set it
            if (index !== -1 && wordData.meanings[index]) {
                updatedContainers[containerIndex].selectedMeaning = wordData.meanings[index]
            } else {
                updatedContainers[containerIndex].selectedMeaning = null
            }
        } else {
            updatedContainers[containerIndex].selectedMeaning = null
        }

        setContainers(updatedContainers)
    }

    /**
     * Plays the text (in Hebrew) via the Speech Synthesis API.
     */
    const handlePlayPronunciation = (id) => {
        const container = containers.find((c) => c.id === id)
        if (!container) return

        // Combine all translated words into a single sentence
        const translation = container.translatedWords ? container.translatedWords.map((word) => word.text).join(" ") : ""

        if (!translation.trim()) {
            alert("No translation available to play.")
            return
        }

        // If speech synthesis is available, speak the text in Hebrew
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(translation)
            utterance.lang = "he-IL"
            utterance.rate = 0.8 // Slightly slower speech
            speechSynthesis.speak(utterance)
        } else {
            alert("Speech synthesis is not supported in your browser.")
        }
    }

    /**
     * Saves the user-input text + translated text to Firestore under userSavedLists/{userEmail}.
     */
    const handleSave = async (id) => {
        // Must be logged in
        if (!userEmail) {
            alert("You must be logged in to save sentences.")
            return
        }

        const container = containers.find((c) => c.id === id)
        if (!container) return

        // Must have input text
        if (!container.inputText || !container.inputText.trim()) {
            alert("Please enter a sentence to translate before saving.")
            return
        }

        // Must have a translation
        const translatedSentence = container.translatedWords ? container.translatedWords.map((word) => word.text).join(" ") : ""

        if (!translatedSentence.trim()) {
            alert("No translation available to save.")
            return
        }

        try {
            // Save a new field in the doc's "sentencesList" array: "English -> Hebrew"
            const userDocRef = doc(db, "userSavedLists", userEmail)
            await setDoc(
                userDocRef,
                {
                    sentencesList: arrayUnion(`${container.inputText} -> ${translatedSentence}`),
                },
                { merge: true },
            )
            alert("Sentence saved successfully!")
        } catch (error) {
            console.error("Error saving sentence:", error)
            alert("An error occurred while saving the sentence. Please try again.")
        }
    }

    /**
     * handleInputChange: update the 'inputText' for the container with matching ID.
     */
    const handleInputChange = (id, text) => {
        const containerIndex = containers.findIndex((c) => c.id === id)
        if (containerIndex === -1) return
        const updatedContainers = [...containers]
        updatedContainers[containerIndex].inputText = text
        setContainers(updatedContainers)
    }

    return (
        <div className="bg-slate-800 dark:bg-gray-900 rounded-lg p-3 transition-all duration-300">
            {/* 
        Clear All Button: clears all containers and resets to a single container 
      */}
            <div className="flex justify-end mb-2">
                <button
                    onClick={handleClearContainers}
                    className="px-3 py-1 rounded-md font-medium bg-slate-700 dark:bg-gray-800
                     hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 text-sm"
                >
                    Clear All
                </button>
            </div>

            {/* 
        Main wrapper for all containers (scrollable if too many). 
        Each container is rendered below in a .map().
      */}
            <div id="main-wrapper" className="scrollable-section max-h-[80vh] overflow-y-auto p-3 flex flex-col gap-3">
                {containers.map((container) => (
                    <div
                        key={container.id}
                        className="
              flex flex-col md:flex-row gap-2 bg-slate-800 dark:bg-gray-900 
              p-2 rounded-lg
              border-2 border-blue-800 
            "
                    >
                        {/* 
              Word List area: displays the "punctuatedWords" 
              that come from handleWordClick or default placeholders.
            */}
                        <div
                            className="md:w-1/3 w-full bg-slate-700 dark:bg-gray-800 rounded-lg p-2 shadow-lg
                         overflow-y-auto md:h-40 h-auto transition-all duration-300"
                        >
                            <h4 className="text-sm font-bold mb-2 text-white dark:text-gray-200 text-center">Word List</h4>
                            <ul className="space-y-1">
                                {container.punctuatedWords.map((word, index) => (
                                    <li
                                        key={index}
                                        className="px-2 py-1 bg-slate-800 dark:bg-gray-900
                               rounded-lg shadow text-white dark:text-gray-300
                               transition-all duration-300 cursor-pointer hover:bg-blue-600 text-xs"
                                        onClick={() => handleWordListClick(container.id, word)}
                                    >
                                        {word}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 
              Main area: includes input for a sentence, 
              translation button, and the translated text display
            */}
                        <div
                            id="tabWords"
                            className="flex-1 bg-slate-800 dark:bg-gray-900 rounded-lg p-4 shadow-lg
                         transition-all duration-300"
                        >
                            <div className="flex flex-col gap-3">
                                {/* Save Button: saves the input -> translation pair to Firestore */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleSave(container.id)}
                                        className="px-3 py-1 text-xs rounded-md font-medium bg-green-600 
                               dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 
                               transition-all duration-300"
                                    >
                                        Save
                                    </button>
                                </div>

                                {/* 
                  English Input + Translate Button 
                */}
                                <div className="flex flex-col md:flex-row gap-3">
                                    <textarea
                                        placeholder="Type text here..."
                                        className="w-full px-3 py-2 rounded-lg bg-slate-700 
                               dark:bg-gray-800 text-white dark:text-gray-300 
                               transition-all duration-300 text-xs resize-none"
                                        rows="3"
                                        value={container.inputText}
                                        onChange={(e) => handleInputChange(container.id, e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleTranslate(container.id)}
                                        className="px-3 py-2 rounded-lg bg-blue-600 dark:bg-blue-700 
                               hover:bg-blue-700 dark:hover:bg-blue-800 
                               transition-all duration-300 text-xs self-start"
                                    >
                                        Translate
                                    </button>
                                </div>

                                {/* 
                  Display the translated words 
                  with an option to click each word (handleWordClick)
                  Audio & Remove container buttons on the right
                */}
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                                    <div
                                        className="w-full px-3 py-2 rounded-lg bg-slate-700 
                               dark:bg-gray-800 text-white dark:text-gray-300 
                               transition-all duration-300 min-h-[4rem]"
                                    >
                                        {container.translatedWords.length > 0 &&
                                            container.translatedWords.map((word) => (
                                                <span
                                                    key={word.id}
                                                    className="clickable-word cursor-pointer px-1 rounded 
                                   hover:bg-blue-600 hover:text-white transition-colors duration-200 text-xs"
                                                    onClick={() => handleWordClick(container.id, word.text)}
                                                >
                                                    {word.text}{" "}
                                                </span>
                                            ))}
                                    </div>

                                    {/* Audio (speech synthesis) and Remove Container Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePlayPronunciation(container.id)}
                                            className="px-2 py-1 bg-yellow-600 dark:bg-yellow-700 
                                 hover:bg-yellow-700 dark:hover:bg-yellow-800 
                                 transition-all duration-300 text-xs rounded-md"
                                        >
                                            Audio
                                        </button>
                                        <button
                                            onClick={() => handleRemoveContainer(container.id)}
                                            className="px-2 py-1 bg-red-600 dark:bg-red-700 
                                 hover:bg-red-700 dark:hover:bg-red-800 
                                 transition-all duration-300 text-xs rounded-md"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* 
                  Display the 'selectedMeaning' from the Word List
                  if the user clicked on a dotted word that has a meaning
                */}
                                {container.selectedMeaning && (
                                    <div className="mt-3 p-2 bg-slate-700 dark:bg-gray-800 rounded-lg shadow-lg">
                                        <h3 className="text-sm font-bold text-white dark:text-gray-200 mb-1">
                                            Sentences for "{container.selectedMeaning.meaning_hebrew}"
                                        </h3>
                                        <p className="text-gray-300 text-xs">
                                            <strong>Hebrew:</strong> {container.selectedMeaning.sentence_hebrew}
                                        </p>
                                        <p className="text-gray-300 text-xs">
                                            <strong>English:</strong> {container.selectedMeaning.sentence_english}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add a new container for a new sentence translation */}
                <button
                    onClick={handleAddContainer}
                    className="mt-3 px-4 py-1 bg-green-600 dark:bg-green-700 
                     hover:bg-green-700 dark:hover:bg-green-800 
                     rounded-lg text-white font-semibold transition-all duration-300 text-sm self-start"
                >
                    Create New Sentence
                </button>
            </div>
        </div>
    )
}

export default AccountMainTab