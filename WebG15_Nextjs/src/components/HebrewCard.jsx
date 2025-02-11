"use client"
import React, { useState } from "react"
import { SpeakerWaveIcon, BookmarkIcon } from "@heroicons/react/24/outline"
import { doc, setDoc, arrayUnion } from "firebase/firestore"
import { db } from "../utils/firebaseConfig" // Firestore config
import { useAuth } from "../context/AuthContext" // Auth context hook

/**
 * HebrewCard
 *
 * Represents a single card showing an English word (card.english)
 * and optionally reveals the Hebrew (card.hebrew) when clicked.
 * Also provides buttons to:
 *   - Play the Hebrew word via speech synthesis
 *   - Save the word to the user's Firestore document
 */
const HebrewCard = ({ card }) => {
    // Whether the Hebrew portion of the card is revealed
    const [isRevealed, setIsRevealed] = useState(false)

    // Access the current logged-in user from auth context
    const { user } = useAuth()

    /**
     * handlePlayAudio:
     * Uses the SpeechSynthesis API to play the Hebrew text.
     * Prevent card toggling with stopPropagation() on the button.
     */
    const handlePlayAudio = (hebrewWord) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(hebrewWord)
            utterance.lang = "he-IL"
            utterance.rate = 0.8
            speechSynthesis.speak(utterance)
        } else {
            alert("Your browser does not support speech synthesis.")
        }
    }

    /**
     * handleSaveWord:
     * Saves the word to the user's Firestore document under 'userSavedLists/{user.email}'.
     * If no user is logged in, alerts the user to log in.
     */
    const handleSaveWord = async (englishWord, hebrewWord) => {
        if (!user) {
            alert("You need to be logged in to save words.")
            return
        }

        const userDocRef = doc(db, "userSavedLists", user.email)

        try {
            // Use arrayUnion to add "English -> Hebrew" pairs to 'sentencesList'
            await setDoc(
                userDocRef,
                {
                    sentencesList: arrayUnion(`${englishWord} -> ${hebrewWord}`),
                },
                { merge: true },
            )
            alert(`Saved: ${englishWord} -> ${hebrewWord}`)
        } catch (error) {
            console.error("Error saving word:", error)
        }
    }

    /**
     * handleCardClick:
     * Toggles the reveal state (Hebrew text becomes visible on click).
     */
    const handleCardClick = () => {
        setIsRevealed((prev) => !prev)
    }

    return (
        <div
            className={`relative bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg cursor-pointer ${isRevealed ? "revealed" : ""}`}
            onClick={handleCardClick}
        >
            {/* Card Image */}
            <img src={card.image} alt={card.english} className="w-full h-48 object-cover rounded-lg" />

            {/* Text Content */}
            <div className="text-center mt-4">
                {/* English Word */}
                <p className="font-bold text-lg text-gray-900 dark:text-white">{card.english}</p>

                {/* Hebrew Word (revealed upon card click) */}
                {isRevealed && (
                    <>
                        <p className="mt-2 text-blue-600 dark:text-yellow-400">
                            {/* Display only the first Hebrew word if multiple are present */}
                            {card.hebrew.split(" ")[0]}
                        </p>

                        {/* Audio + Save Buttons */}
                        <div className="flex justify-center gap-4 mt-2">
                            {/* Play Audio Icon */}
                            <button
                                className="flex items-center justify-center gap-1 text-blue-500 hover:text-blue-400"
                                onClick={(e) => {
                                    e.stopPropagation() // Prevent toggling
                                    handlePlayAudio(card.hebrew)
                                }}
                                aria-label={`Play pronunciation for ${card.english}`}
                            >
                                <SpeakerWaveIcon className="w-6 h-6" />
                                <span className="hidden sm:inline">Play</span>
                            </button>

                            {/* Save Word Icon */}
                            <button
                                className="flex items-center justify-center gap-1 text-green-500 hover:text-green-400"
                                onClick={(e) => {
                                    e.stopPropagation() // Prevent toggling
                                    // Save only the first Hebrew word if multiple words
                                    handleSaveWord(card.english, card.hebrew.split(" ")[0])
                                }}
                                aria-label={`Save ${card.english} to saved list`}
                            >
                                <BookmarkIcon className="w-6 h-6" />
                                <span className="hidden sm:inline">Save</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default HebrewCard
