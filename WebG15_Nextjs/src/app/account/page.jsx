// src/pages/Account.jsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import Navbar from "../../components/Navbar"
import AccountMainTab from "../../components/AccountMainTab"
import LearningStatistics from "../../components/LearningStatistics"
import ProfileInformation from "../../components/ProfileInformation"
import withAuth from "../../components/withAuth"

const Account = () => {
    const [punctuations, setPunctuations] = useState([])
    const [isVisible, setIsVisible] = useState(false) // Track if Featured Content is visible
    const featuredRef = useRef(null) // Ref for Featured Content Section

    const handleWordSelection = (punctuatedForms) => {
        setPunctuations(punctuatedForms)
    }

    const clearPunctuationList = () => {
        setPunctuations([])
    }

    // Observe when the Featured Content Section comes into view
    useEffect(() => {
        if (!featuredRef.current) return // Add a null check for the ref

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true) // Set visible when in view
                }
            },
            { threshold: 0.1 }, // Trigger when 10% of the section is visible
        )

        observer.observe(featuredRef.current)

        return () => {
            if (featuredRef.current) {
                observer.unobserve(featuredRef.current) // Ensure featuredRef.current is not null
            }
        }
    }, [featuredRef]) // Add featuredRef as a dependency

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-800 dark:from-gray-900 dark:to-black flex flex-col text-white dark:text-gray-300">
            <main id="the-main" className="flex-1 container mx-auto px-4 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                {/* Define a grid with two rows: first row auto height, second row flexible */}
                <div className="grid grid-cols-1 grid-rows-[auto,1fr] gap-4 h-full">
                    {/* First Row: ProfileInformation and LearningStatistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileInformation />
                        <LearningStatistics />
                    </div>

                    {/* Second Row: AccountMainTab */}
                    <div className="h-full">
                        <AccountMainTab />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default withAuth(Account) // Wrap the component with auth protection
