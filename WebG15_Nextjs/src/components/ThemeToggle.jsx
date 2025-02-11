"use client" // Ensures this code runs on the client side, needed for localStorage usage

import { useEffect, useState } from "react"

/**
 * ThemeToggle
 *
 * A simple toggle button that switches between "light" and "dark" themes.
 * It respects the user's previously saved preference in localStorage,
 * or defaults to the system preference if no saved theme is found.
 */
const ThemeToggle = () => {
    // Local theme state, defaulting to "light"
    const [theme, setTheme] = useState("light")

    /**
     * useEffect:
     * Runs once on mount. It checks localStorage for a saved theme,
     * or if none is found, uses system preference (matchMedia).
     * Then, applies the "dark" class to documentElement if dark mode is active.
     */
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Attempt to load from localStorage
            const savedTheme =
                localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

            setTheme(savedTheme)
            document.documentElement.classList.toggle("dark", savedTheme === "dark")
        }
    }, [])

    /**
     * toggleTheme:
     * Flips between "light" and "dark" in local state and in localStorage,
     * and applies/removes the "dark" class on the document root accordingly.
     */
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)

        // Toggle the "dark" class on <html> if the new theme is dark
        document.documentElement.classList.toggle("dark", newTheme === "dark")

        // Persist user preference in localStorage
        localStorage.setItem("theme", newTheme)
    }

    return (
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200">
            {theme === "dark" ? (
                // Sun icon (indicates toggling back to light mode)
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707
               m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            ) : (
                // Moon icon (indicates toggling to dark mode)
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20.354 15.354A9 9 0 018.646 3.646 
               9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
            )}
        </button>
    )
}

export default ThemeToggle
