"use client"

import "../styles/globals.css"
import React, { useEffect, useState } from "react"
import { auth, db } from "../utils/firebaseConfig" // Firebase Auth & Firestore
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

/**
 * LearningStatistics
 *
 * This component shows the user’s learning progress details:
 * - The total words they've saved (learned)
 * - A placeholder for "Study Streak"
 * - A placeholder for "Practice Sessions"
 *
 * It listens for Firebase auth changes, and if the user is logged in,
 * fetches the user’s 'sentencesList' from Firestore to display how many items they have.
 */
const LearningStatistics = () => {
    // Track the number of words the user has learned (i.e., items in sentencesList)
    const [wordsLearned, setWordsLearned] = useState(0)

    /**
     * useEffect:
     * - Subscribes to auth changes with onAuthStateChanged.
     * - If user is logged in, fetch doc in 'userSavedLists/{user.email}',
     *   read 'sentencesList', and update wordsLearned with its length.
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Use user's email to find their doc
                const docRef = doc(db, "userSavedLists", user.email)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data()
                    const sentencesList = data.sentencesList || []
                    // The total count of entries in 'sentencesList' is used as wordsLearned
                    setWordsLearned(sentencesList.length)
                } else {
                    // If doc doesn't exist, user has no saved items
                    setWordsLearned(0)
                }
            } else {
                // If user signs out or there's no user, reset to 0
                setWordsLearned(0)
            }
        })

        return () => unsubscribe() // Clean up auth subscription on unmount
    }, [])

    return (
        <div className="bg-slate-800 dark:bg-gray-900 rounded-lg p-2 transition-all duration-300 h-full">
            {/* Title */}
            <h2 className="text-md font-semibold mb-1 text-white dark:text-gray-200 transition-all duration-300">Learning Progress</h2>

            <div className="space-y-2">
                {/* Words Learned */}
                <div>
                    <h3 className="font-semibold mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">
                        Words Learned
                    </h3>
                    <div className="bg-slate-700 dark:bg-gray-800 rounded-lg p-1 transition-all duration-300 flex items-center">
                        <span className="text-xl font-bold text-white dark:text-gray-200 transition-all duration-300">{wordsLearned}</span>
                        <span className="text-gray-400 dark:text-gray-300 ml-0.5 text-xs transition-all duration-300">words</span>
                    </div>
                </div>

                {/* Study Streak (placeholder) */}
                <div>
                    <h3 className="font-semibold mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">
                        Study Streak
                    </h3>
                    <div className="bg-slate-700 dark:bg-gray-800 rounded-lg p-1 transition-all duration-300 flex items-center">
                        <span className="text-xl font-bold text-white dark:text-gray-200 transition-all duration-300">7</span>
                        <span className="text-gray-400 dark:text-gray-300 ml-0.5 text-xs transition-all duration-300">days</span>
                    </div>
                </div>

                {/* Practice Sessions (placeholder) */}
                <div>
                    <h3 className="font-semibold mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">
                        Practice Sessions
                    </h3>
                    <div className="bg-slate-700 dark:bg-gray-800 rounded-lg p-1 transition-all duration-300 flex items-center">
                        <span className="text-xl font-bold text-white dark:text-gray-200 transition-all duration-300">15</span>
                        <span className="text-gray-400 dark:text-gray-300 ml-0.5 text-xs transition-all duration-300">this week</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LearningStatistics
