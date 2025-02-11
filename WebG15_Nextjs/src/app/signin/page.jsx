"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // For routing
import { auth, db } from "../../utils/firebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

/**
 * SignInSignUp
 *
 * A combined component for signing up and signing in. Uses Firebase Authentication
 * and Firestore to manage user accounts. After signing up, the user is signed out,
 * prompting them to sign in explicitly.
 */
const SignInSignUp = () => {
    // Next.js router for client-side navigation
    const router = useRouter()

    // Controls whether we're in "Sign Up" mode or "Sign In" mode
    const [isSignUp, setIsSignUp] = useState(false)

    // Holds all form fields for either sign in or sign up
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        firstName: "",
        lastName: "",
    })

    // Status messages for feedback
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    /**
     * handleChange:
     * Updates form data state whenever an input changes.
     */
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    /**
     * handleSubmit:
     * Handles form submissions for both sign-up and sign-in.
     * - If sign-up, creates an account, saves user info in Firestore, then signs out user.
     * - If sign-in, authenticates user and redirects to '/account'.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")

        const { email, password } = formData

        try {
            if (isSignUp) {
                // Create a new user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const user = userCredential.user

                // Save extra user data in Firestore under 'users/{uid}'
                await setDoc(doc(db, "users", user.uid), {
                    ...formData,
                    learningLevel: "Beginner", // Default field
                })

                // Immediately sign out, so user has to sign in again explicitly
                await signOut(auth)

                setMessage("Account created successfully! Please sign in.")
                setIsSignUp(false) // Switch to sign-in mode
            } else {
                // Sign in existing user
                const userCredential = await signInWithEmailAndPassword(auth, email, password)
                setMessage("Sign-in successful! Redirecting...")
                router.push("/account") // Navigate to the account page
            }
        } catch (err) {
            // Handle Firebase auth errors
            switch (err.code) {
                case "auth/user-not-found":
                    setError("No account found with this email. Please sign up first.")
                    break
                case "auth/wrong-password":
                    setError("Incorrect password. Please try again.")
                    break
                default:
                    setError("An error occurred: " + err.message)
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
            {/*
        Outer container for the login/sign-up form
        Splits into two sections (left for form, right for an image + message).
      */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-5xl flex">
                {/* Left Section: the form */}
                <div className="w-[55%] p-6 border-r border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">{isSignUp ? "Sign Up" : "Sign In"}</h2>

                    {/* The sign-up/sign-in form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Extra fields for sign-up mode only */}
                        {isSignUp && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Email field */}
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        {/* Submit button */}
                        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                            {isSignUp ? "Sign Up" : "Sign In"}
                        </button>
                    </form>

                    {/* Toggle between sign-in and sign-up */}
                    <p className="mt-4 text-center text-blue-500 cursor-pointer" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? "Already have an account? Sign In" : "Don’t have an account? Sign Up"}
                    </p>

                    {/* Status messages */}
                    {message && <p className="mt-4 text-green-500">{message}</p>}
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                </div>

                {/* Right Section: welcome / sign-up illustration */}
                <div className="w-[45%] p-4 flex flex-col justify-start items-center text-center">
                    <h3 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">{isSignUp ? "Join Us Today!" : "Welcome!"}</h3>
                    <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                        {isSignUp
                            ? "Unlock a world of knowledge and track your progress easily by signing up today."
                            : "Access your account and continue your learning journey with ease."}
                    </p>
                    {/* Display a dynamic image based on sign-up or sign-in mode */}
                    <img
                        src={isSignUp ? "/signUp_kids_happy.png" : "/signup_pinguin.png"}
                        alt={isSignUp ? "Sign Up Kids Happy" : "Sign Up Pinguin"}
                        className=""
                    />
                </div>
            </div>
        </div>
    )
}

export default SignInSignUp
