"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { useEffect, useState } from "react"
import { auth } from "../utils/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

/**
 * HeroCarousel
 *
 * A swiper-based hero section with three slides, each featuring:
 * - Headline & subtext
 * - Buttons that redirect based on user login state
 * - Interactive images and stats
 */
const HeroCarousel = () => {
    // Track the current logged-in user
    const [user, setUser] = useState(null)
    const router = useRouter()

    /**
     * useEffect:
     * Sets up a listener for Firebase auth changes.
     * If a user is signed in, store it in local state.
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    /**
     * Handle "Join Us" button:
     * If user is not signed in, go to sign-in page.
     */
    const handleJoinUsClick = () => {
        if (!user) {
            router.push("/signin")
        }
    }

    /**
     * Handle "Go To Account" button:
     * If user is signed in, go to account; otherwise go to sign-in.
     */
    const handleGoToAccountClick = () => {
        if (user) {
            router.push("/account")
        } else {
            router.push("/signin")
        }
    }

    /**
     * Handle "Test Yourself" button:
     * If user is signed in, go to quiz; otherwise go to sign-in.
     */
    const handleTestYourselfClick = () => {
        if (user) {
            router.push("/quiz")
        } else {
            router.push("/signin")
        }
    }

    return (
        <section className="w-full">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 8000, disableOnInteraction: false }} // Slide every 8s
                loop
                className="max-w-6xl mx-auto"
            >
                {/* Slide 1 */}
                <SwiperSlide>
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-blue-200 p-8 rounded-lg">
                        {/* Left content: Headline + Buttons */}
                        <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-900 leading-tight">
                                Master Hebrew From Anywhere
                            </h1>
                            <p className="text-lg sm:text-xl text-blue-800">Your journey to Hebrew fluency starts here.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {/* Joins user if not signed in */}
                                <button
                                    className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                                    onClick={handleJoinUsClick}
                                >
                                    Join Us Today!
                                </button>
                                {/* About Us (no user logic) */}
                                <button className="px-6 py-3 border border-white text-blue-800 rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105">
                                    About Us
                                </button>
                            </div>
                        </div>

                        {/* Right content: Penguin image + stats circles */}
                        <div className="relative">
                            <img src="/pngwing.com.png" alt="Penguin" className="w-full h-full object-cover rounded-lg" />

                            {/* Stats Circle #1 */}
                            <div className="absolute -left-4 sm:-left-8 top-4 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-blue-500 text-white flex items-center justify-center p-4 shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:rotate-3">
                                <div className="text-center">
                                    <div className="text-xl sm:text-2xl font-bold">10K+</div>
                                    <div className="text-xs sm:text-sm">Active Learners</div>
                                </div>
                            </div>

                            {/* Stats Circle #2 */}
                            <div className="absolute right-4 bottom-4 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-green-500 text-white flex items-center justify-center p-4 shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-green-600 hover:rotate-3">
                                <div className="text-center">
                                    <div className="text-xl sm:text-2xl font-bold">1000+</div>
                                    <div className="text-xs sm:text-sm">Hebrew Words</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 2 */}
                <SwiperSlide>
                    <div
                        className="flex flex-col justify-top pt-4 items-start h-[400px] lg:h-[600px] bg-cover bg-center bg-no-repeat p-8 rounded-lg"
                        style={{ backgroundImage: `url('/friendsTravel.png')` }}
                    >
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-blue-900 text-left">
                            Personalize Your Hebrew Learning Journey
                        </h1>
                        <p className="text-lg sm:text-xl my-4 max-w-2xl text-white text-left">
                            Take control of your Hebrew learning experience by saving the words and phrases that matter most to you. Create
                            a personalized vocabulary list and watch your Hebrew skills grow!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Goes to account or sign-in */}
                            <button
                                className="px-6 py-3 border bg-blue-400 border-gray-300 dark:border-gray-600 text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black transition-all duration-300 transform hover:scale-105"
                                onClick={handleGoToAccountClick}
                            >
                                Go To My Account
                            </button>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 3 */}
                <SwiperSlide>
                    <div
                        className="flex flex-col justify-top pt-12 items-start h-[400px] lg:h-[600px] bg-cover bg-center bg-no-repeat p-8 rounded-lg"
                        style={{ backgroundImage: `url('/ibex.png')` }}
                    >
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-blue-900 text-left">
                            Test Your Hebrew Skills
                        </h1>
                        <p className="text-lg sm:text-xl my-4 max-w-2xl text-blue-700 text-left">
                            Challenge yourself with our fun and interactive Hebrew quiz! <br />
                            Improve your language skills while having fun.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Goes to quiz or sign-in */}
                            <button
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                                onClick={handleTestYourselfClick}
                            >
                                Test Yourself
                            </button>
                            {/* Learn More (no user logic) */}
                            <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-white rounded-lg hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                                Learn More
                            </button>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    )
}

export default HeroCarousel
