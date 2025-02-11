"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../utils/firebaseConfig"

/**
 * withAuth:
 * A higher-order component that checks if a user is logged in.
 * If not, it redirects them to the sign-in page.
 * Otherwise, it renders the wrapped component.
 */
const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter()
        const [loading, setLoading] = useState(true)

        /**
         * useEffect:
         * - Subscribes to Firebase auth state changes with onAuthStateChanged.
         * - If no user is found, redirect to "/signin".
         * - If user is present, remove the loading screen and render the wrapped component.
         */
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (!user) {
                    // If no user, redirect to sign-in
                    router.push("/signin")
                } else {
                    // If user is present, allow rendering
                    setLoading(false)
                }
            })

            // Cleanup subscription on unmount
            return () => unsubscribe()
        }, [router])

        // Show a loading message until we confirm the user's login state
        if (loading) {
            return <div className="text-center mt-20 text-xl">Loading...</div>
        }

        // Render the wrapped component if user is signed in
        return <WrappedComponent {...props} />
    }
}

export default withAuth
