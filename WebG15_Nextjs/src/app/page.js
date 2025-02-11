"use client"
import { useState, useRef, useEffect } from "react"
import Translate from "../components/Translate"
import PunctuationList from "../components/PunctuationList"
import HeroCarousel from "@/components/HeroCarousel"

export default function Home() {
    // State that stores an array of punctuation objects
    const [punctuations, setPunctuations] = useState([])

    // Controls the visibility (animation trigger) of the Featured Content section
    const [isVisible, setIsVisible] = useState(false)

    // A ref for the Featured Content Section, used by IntersectionObserver
    const featuredRef = useRef(null)

    /**
     * handleWordSelection:
     * Called by the Translate component when words (punctuated forms) are found.
     * We store them in 'punctuations' state to display in the PunctuationList.
     */
    const handleWordSelection = (punctuatedForms) => {
        setPunctuations(punctuatedForms)
    }

    /**
     * clearPunctuationList:
     * Clears out the punctuation array (useful if the user resets or clears).
     */
    const clearPunctuationList = () => {
        setPunctuations([])
    }

    /**
     * useEffect that sets up an IntersectionObserver on the 'featuredRef'.
     * Once the element is at least 10% visible (threshold: 0.1), we set 'isVisible' to true.
     */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true) // start the animation
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
            {/* 
              1) Hero Section:
                 A carousel or hero banner at the top of the page 
            */}
            <HeroCarousel />

            {/* 
              2) Main Content Area:
                 Uses a responsive grid to display the PunctuationList (left) 
                 and Translate component (right) on md+ screens.
            */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left Column: Punctuation List */}
                <div className="col-span-full md:col-span-1">
                    <PunctuationList punctuations={punctuations} onSelect={(p) => console.log(`Selected: ${p.word}`)} />
                </div>

                {/* Main Content: Translate Component */}
                <div className="col-span-full md:col-span-3">
                    <Translate onWordSelection={handleWordSelection} onClear={clearPunctuationList} />
                </div>
            </div>

            {/*
              3) Featured Content Section:
                 Fades/slides in once it enters the viewport. 
                 Uses the IntersectionObserver logic to set 'isVisible'.
            */}
            <section
                ref={featuredRef}
                className={`section bg-gray-100 dark:bg-slate-900 mt-12 py-12 transition-opacity duration-500 ${
                    isVisible ? "animate-slideUp" : "opacity-0"
                }`}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
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

            {/*
              4) Testimonial Section:
                 Showcases quotes, images of team members, and brand logos
            */}
            <section className="bg-gray-50 dark:bg-slate-800 py-12 text-center">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8">
                    <blockquote className="text-xl sm:text-2xl italic text-gray-700 dark:text-gray-300 mb-8">
                        "Our mission is to make learning Hebrew engaging and effective. We’ve built a platform where learners can save their
                        favorite words, practice essential phrases, and track their progress with ease."
                    </blockquote>

                    {/* Testimonial Images */}
                    <div className="flex flex-wrap justify-center gap-8 mt-6 w-full px-6">
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
                                alt="Fatmeh Zoabi"
                                className="w-20 h-20 rounded-full object-cover border-4 border-purple-600"
                            />
                            <p className="mt-2 font-semibold">Fatmeh Zoabi</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <img
                                src="/israelOhayon.png"
                                alt="Israel Ohayon"
                                className="w-20 h-20 rounded-full object-cover border-4 border-green-600"
                            />
                            <p className="mt-2 font-semibold">Israel Ohayon</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <img
                                src="/vladi.png"
                                alt="Vladi Trinter"
                                className="w-20 h-20 rounded-full object-cover border-4 border-red-600"
                            />
                            <p className="mt-2 font-semibold">Vladi Trinter</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center mt-8">
                    <h2 className="trusted-by-heading">Trusted By</h2>
                </div>

                {/* Brand Logos */}
                <div className="mt-8 flex flex-wrap justify-center gap-8">
                    <img src="/braude.png" alt="braude" className="h-8" />
                    <img src="/google_cloud.png" alt="google" className="h-8" />
                    <img src="/next.png" alt="Next.js" className="h-8" />
                    <img src="/Firebase_logo.png" alt="fire_base" className="h-8" />
                </div>
            </section>
        </div>
    )
}
