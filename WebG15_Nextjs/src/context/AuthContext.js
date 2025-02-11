"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../utils/firebaseConfig"

/**
 * AuthContext:
 * A React context for sharing user authentication state across the app.
 */
const AuthContext = createContext()

/**
 * AuthProvider:
 * A context provider component that listens for Firebase auth state changes
 * and exposes the current user and a loading flag to its children.
 */
export const AuthProvider = ({ children }) => {
    // user: stores the current logged-in user (or null if none)
    // loading: a boolean indicating whether we're waiting for auth to resolve
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    /**
     * useEffect:
     * - Subscribes to Firebase auth state changes via onAuthStateChanged.
     * - Sets user to the currentUser if signed in, or null if signed out.
     * - Disables loading after the initial check is done.
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
            console.log("User state changed:", currentUser)
        })

        // Cleanup subscription on component unmount
        return () => unsubscribe()
    }, [])

    return (
        // Provide user and loading states to any descendants
        <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
    )
}

/**
 * useAuth:
 * A custom hook to access the AuthContext.
 * Returns the current user and loading flag.
 */
export const useAuth = () => useContext(AuthContext)
