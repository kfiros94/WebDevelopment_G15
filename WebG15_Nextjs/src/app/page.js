"use client"
import { useState, useRef, useEffect } from "react"
import Translate from "../components/Translate"
import PunctuationList from "../components/PunctuationList"
import HeroCarousel from "@/components/HeroCarousel"

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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true) // Set visible when in view
                }
            },
            { threshold: 0.1 },
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
            <HeroCarousel />

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto p-6 grid grid-cols-4 gap-6">
                {/* Left Column: Punctuation List */}
                <div className="col-span-1">
                    <PunctuationList punctuations={punctuations} onSelect={(p) => console.log(`Selected: ${p.word}`)} />
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
            {/* Testimonial Section */}
            <section className="bg-gray-50 dark:bg-slate-800 py-12 text-center">
            <div className="max-w-4xl mx-auto text-center px-6">
                    <blockquote className="text-xl sm:text-2xl italic text-gray-700 dark:text-gray-300 mb-8">
                        "Our mission is to make learning Hebrew engaging and effective. We’ve built a platform where learners can save their
                        favorite words, practice essential phrases, and track their progress with ease."
                    </blockquote>

                    {/* Testimonial Images in a Row */}
                    <div className="flex justify-around gap-8 mt-6 w-full px-6">
                        <div className="flex flex-col items-center">
                            <img
                                src="/Kfir.jpeg"
                                alt="Kfir Amoyal"
                                className="w-20 h-20 rounded-full object-cover border-4 border-blue-600"
                            />
                            <p className="mt-2 font-semibold">Kfir Amoyal</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <img
                                src="/Fatmeh.png"
                                alt="User 2"
                                className="w-20 h-20 rounded-full object-cover border-4 border-purple-600"
                            />
                            <p className="mt-2 font-semibold">Fatmeh Zoabi</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <img
                                src="/israelOhayon.png"
                                alt="User 1"
                                className="w-20 h-20 rounded-full object-cover border-4 border-green-600"
                            />
                            <p className="mt-2 font-semibold">Israel Ohayon</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <img src="/vladi.png" alt="User 3" className="w-20 h-20 rounded-full object-cover border-4 border-red-600" />
                            <p className="mt-2 font-semibold">Vladi Trinter</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center mt-8">
                    <h2 className="trusted-by-heading">Trusted By</h2>
                </div>

                {/* Brand Logos */}
                <div className="mt-8 flex justify-center gap-8">
                    <img src="/braude.png" alt="braude" className="h-8" />
                    <img src="/google_cloud.png" alt="google" className="h-8" />
                    <img src="/next.png" alt="Next.js" className="h-8" />
                    <img src="/Firebase_logo.png" alt="fire_base" className="h-8" />
                </div>
            </section>
        </div>
    )
}
