"use client"

import React, { useState, useEffect } from "react"
import { Typography, Button, Box, Paper, LinearProgress } from "@mui/material"
import { getDoc, doc } from "firebase/firestore"
import { auth, db } from "../../../utils/firebaseConfig" // Firestore and Auth imports
import distractorsData from "../../../utils/distractorsData" // Local distractors dataset

/**
 * WordPracticePage
 *
 * A quiz-like component that pulls saved words/sentences from Firestore,
 * adds random distractors, and quizzes the user with multiple-choice questions.
 */
const WordPracticePage = () => {
    // State variables for quiz data and logic
    const [questions, setQuestions] = useState([]) // The question objects
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [attemptsLeft, setAttemptsLeft] = useState(3)
    const [isQuizOver, setIsQuizOver] = useState(false)
    const [quizCompletedSuccessfully, setQuizCompletedSuccessfully] = useState(false)
    const [loading, setLoading] = useState(true)

    /**
     * useEffect #1:
     * Fetches the user's saved words/sentences from Firestore and constructs
     * multiple-choice questions (with distractors).
     */
    useEffect(() => {
        const fetchSavedWords = async () => {
            // Ensure the user is logged in
            const user = auth.currentUser
            if (!user) {
                alert("You need to be logged in to take the quiz.")
                return
            }

            try {
                const docRef = doc(db, "userSavedLists", user.email)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    // 'sentencesList' = array of entries like "Hello -> שלום"
                    const savedList = docSnap.data().sentencesList || []

                    // Randomly shuffle and take up to 15 items
                    const shuffledList = savedList.sort(() => 0.5 - Math.random()).slice(0, 15)

                    // Build question objects
                    const formattedQuestions = shuffledList.map((entry) => {
                        const [english, hebrew] = entry.split(" -> ")
                        const isWord = hebrew.split(" ").length === 1 // single word vs. multi-word sentence

                        // From local distractors data, pick a set for words or sentences
                        const distractors = isWord
                            ? distractorsData.words.filter((d) => d !== hebrew)
                            : distractorsData.sentences.filter((d) => d !== hebrew)

                        // Shuffle and pick 3 distractors, plus the correct answer
                        const shuffledOptions = [hebrew, ...distractors.sort(() => 0.5 - Math.random()).slice(0, 3)].sort(
                            () => 0.5 - Math.random(),
                        )

                        return {
                            english,
                            correctAnswer: hebrew,
                            options: shuffledOptions,
                            isWord,
                        }
                    })

                    setQuestions(formattedQuestions)
                    setLoading(false)
                } else {
                    alert("No saved words found.")
                    setLoading(false)
                }
            } catch (error) {
                console.error("Error fetching saved words:", error)
                setLoading(false)
            }
        }

        fetchSavedWords()
    }, [])

    /**
     * handleAnswerClick:
     * Checks if the user's selected option is correct. If yes, move to next question (or end quiz).
     * If incorrect, reduce attempts by 1. If no attempts left, end the quiz.
     */
    const handleAnswerClick = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex]

        if (selectedOption === currentQuestion.correctAnswer) {
            // Correct answer
            setTimeout(() => {
                setSelectedAnswer(null)
                // If it was the last question, finish quiz
                if (currentQuestionIndex + 1 === questions.length) {
                    setIsQuizOver(true)
                    setQuizCompletedSuccessfully(true)
                } else {
                    // Move to the next question
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
                }
            }, 1000)
        } else {
            // Incorrect answer: reduce attempts
            setAttemptsLeft((prevAttempts) => prevAttempts - 1)
            setTimeout(() => setSelectedAnswer(null), 1000)
            // If attempts are 0 after this miss, end the quiz
            if (attemptsLeft - 1 === 0) {
                setIsQuizOver(true)
                setQuizCompletedSuccessfully(false)
            }
        }
    }

    /**
     * handleRetry:
     * Resets the quiz state so the user can try again.
     */
    const handleRetry = () => {
        setAttemptsLeft(3)
        setCurrentQuestionIndex(0)
        setIsQuizOver(false)
        setSelectedAnswer(null)
        setQuizCompletedSuccessfully(false)
    }

    // If still loading from Firestore, show loading message
    if (loading) {
        return (
            <Box sx={{ textAlign: "center", paddingTop: 4 }}>
                <Typography variant="h5">Loading quiz...</Typography>
            </Box>
        )
    }

    // If quiz is over, display a success or failure message
    if (isQuizOver) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    padding: 4,
                    minHeight: "100vh",
                    backgroundImage: "url(/QuizBG.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {quizCompletedSuccessfully ? (
                    <>
                        <Typography
                            variant="h3"
                            sx={{
                                color: "#4caf50",
                                fontFamily: "Caveat, cursive",
                                fontSize: "2.5rem",
                                marginBottom: "20px",
                            }}
                        >
                            כל הכבוד Well Done!
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                            <img
                                src="/veryGoodPinguin.jpg"
                                alt="Very Good Penguin"
                                style={{
                                    maxWidth: "200px",
                                    height: "200px",
                                    borderRadius: "20px",
                                }}
                            />
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h4" color="error" gutterBottom>
                            Quiz Over!
                        </Typography>
                        <Typography variant="h6">No attempts left. Better luck next time!</Typography>
                    </>
                )}
                {/* Retry Button to restart the quiz */}
                <Button variant="contained" onClick={handleRetry} sx={{ mt: 2 }}>
                    Retry Quiz
                </Button>
            </Box>
        )
    }

    // Otherwise, render the current question
    const currentQuestion = questions[currentQuestionIndex]

    return (
        <Box
            sx={{
                maxWidth: "100vw",
                minHeight: "100vh",
                padding: 4,
                backgroundImage: "url(/QuizBG.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Box
                sx={{
                    maxWidth: 600,
                    margin: "0 auto",
                    padding: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "16px",
                }}
            >
                <Typography variant="h4" textAlign="center" gutterBottom color="primary">
                    Word Practice Quiz
                </Typography>

                {/* Progress bar showing how far along the quiz is */}
                <LinearProgress variant="determinate" value={((currentQuestionIndex + 1) / questions.length) * 100} sx={{ mb: 2 }} />

                <Paper elevation={3} sx={{ padding: 4, mb: 3 }}>
                    <Typography variant="h5" textAlign="center">
                        {currentQuestion.english}
                    </Typography>
                    <Typography variant="body1" textAlign="center" sx={{ color: "#fff", fontWeight: "bold", marginTop: 2 }}>
                        Attempts Left: {attemptsLeft}
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
                        {/* List out all the options (correct + distractors) as buttons */}
                        {currentQuestion.options.map((option, index) => (
                            <Button
                                key={index}
                                variant={selectedAnswer === option ? "contained" : "outlined"}
                                color={
                                    // If user selected the correct answer, show success
                                    selectedAnswer && option === currentQuestion.correctAnswer
                                        ? "success"
                                        : // If user selected the wrong answer, show error
                                          selectedAnswer === option
                                          ? "error"
                                          : "primary"
                                }
                                onClick={() => {
                                    setSelectedAnswer(option)
                                    handleAnswerClick(option)
                                }}
                                sx={{
                                    padding: 2,
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    transition: "background-color 0.3s ease",
                                }}
                            >
                                {option}
                            </Button>
                        ))}
                    </Box>
                </Paper>

                {/* Attempts Left display at the bottom */}
                <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        padding: "8px",
                        borderRadius: "8px",
                    }}
                >
                    Attempts Left: {attemptsLeft}
                </Typography>
            </Box>
        </Box>
    )
}

export default WordPracticePage
