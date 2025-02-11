// src/components/ProfileInformation.jsx
import React, { useEffect, useState } from "react"
import { auth, db } from "../utils/firebaseConfig" // Firebase config
import { onAuthStateChanged } from "firebase/auth" // Firebase auth
import { doc, getDoc } from "firebase/firestore" // Firestore doc retrieval

/**
 * ProfileInformation
 *
 * Displays user profile data (name, email, learning level) in read-only inputs.
 * Uses Firebase auth to detect the current user, then fetches user info from Firestore.
 */
const ProfileInformation = () => {
    // Local state to store user profile
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        level: "Beginner", // Default learning level
    })

    /**
     * useEffect:
     * - Subscribes to Firebase auth state changes with onAuthStateChanged.
     * - If user is logged in, fetch doc from "users" collection using their UID.
     * - Once doc is retrieved, populate the profile state with their info.
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid)
                const userDoc = await getDoc(userDocRef)

                if (userDoc.exists()) {
                    const userData = userDoc.data()
                    setProfile({
                        name: `${userData.firstName} ${userData.lastName}`,
                        email: userData.email,
                        level: userData.learningLevel || "Beginner",
                    })
                }
            }
        })

        // Cleanup subscription on unmount
        return () => unsubscribe()
    }, [])

    return (
        <div className="bg-slate-800 dark:bg-gray-900 rounded-lg p-2 transition-all duration-300 h-full">
            {/* Section Title */}
            <h2 className="text-md font-semibold mb-1 text-white dark:text-gray-200 transition-all duration-300">Profile Information</h2>

            {/* Read-Only Profile Form */}
            <form className="space-y-2">
                <div>
                    <label className="block mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        readOnly
                        className="w-full p-1 rounded bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 
                       focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-xs"
                    />
                </div>

                <div>
                    <label className="block mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        readOnly
                        className="w-full p-1 rounded bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 
                       focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-xs"
                    />
                </div>

                <div>
                    <label className="block mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">
                        Learning Level
                    </label>
                    <input
                        type="text"
                        name="level"
                        value={profile.level}
                        readOnly
                        className="w-full p-1 rounded bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 
                       focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-xs"
                    />
                </div>
            </form>
        </div>
    )
}

export default ProfileInformation
