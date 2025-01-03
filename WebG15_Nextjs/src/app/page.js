// src/app/page.js
"use client"
import { useState, useRef, useEffect } from "react" // Add this import
import Translate from "../components/Translate"
import PunctuationList from "../components/PunctuationList"


export default function Home() {
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
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true) // Set visible when in view
                }
            },
            { threshold: 0.1 }, // Trigger when 10% of the section is visible
        )

        if (featuredRef.current) {
            observer.observe(featuredRef.current)
        }

        return () => {
            if (featuredRef.current) {
                observer.unobserve(featuredRef.current)
            }
        }
    }, [])

    return (
        <div className="flex flex-col gap-12 bg-gray-100 dark:bg-slate-900 min-h-screen">
            {/* Hero Section */}
            <section className="w-full">
                <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left Content */}
                        <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                                Master Hebrew From Anywhere
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                                Your journey to Hebrew fluency starts here.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
                                    Get Started
                                </button>
                                <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        {/* Right Content with Image and Stats */}
                        <div className="relative mt-8 lg:mt-0 max-w-[80%] mx-auto lg:max-w-full">
                            <div className="relative aspect-[4/3] rounded-lg bg-gray-100 dark:bg-slate-900">
                                <img
                                    src="/pngwing.com.png" // Use the path relative to the `public` folder
                                    alt="Student learning Hebrew"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                {/* Stats Circles */}
                                <div className="absolute -left-4 sm:-left-8 top-4 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-blue-500 text-white flex items-center justify-center p-4 shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-blue-600 hover:rotate-3">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold">10K+</div>
                                        <div className="text-xs sm:text-sm">Active Learners</div>
                                    </div>
                                </div>
                                <div className="absolute right-4 bottom-4 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-green-500 text-white flex items-center justify-center p-4 shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-green-600 hover:rotate-3">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold">1000+</div>
                                        <div className="text-xs sm:text-sm">Hebrew Words</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto p-6 grid grid-cols-4 gap-6">
                {/* Left Column: Punctuation List */}
                <div className="col-span-1">
                    <PunctuationList
                        punctuations={punctuations}
                        onSelect={(p) => console.log(`Selected: ${p.word}`)} // Handle selection logic here
                    />
                </div>

                {/* Main Content: Translate Component */}
                <div className="col-span-3">
                    <Translate onWordSelection={handleWordSelection} onClear={clearPunctuationList} />
                </div>
            </div>

            {/* Featured Content Section */}
            <section
                ref={featuredRef}
                className={`section bg-gray-100 dark:bg-slate-900 mt-12 py-12 transition-opacity duration-500 ${
                    isVisible ? "animate-slideUp" : "opacity-0"
                }`}
            >
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-8">Featured Content</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Word of the Day */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">Word of the Day</h3>
                            <div className="text-4xl mb-4 text-center">שָׁלוֹם</div>
                            <p>Shalom</p>
                            <p>Peace, hello, goodbye</p>
                        </div>

                        {/* Get Started */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">Get Started</h3>
                            <ul>
                                <li className="mb-2">📚 Create your word list</li>
                                <li className="mb-2">✍️ Practice daily</li>
                                <li className="mb-2">🎯 Track your progress</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
