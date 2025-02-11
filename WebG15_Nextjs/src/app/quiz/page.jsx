"use client"

import * as React from "react"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/navigation" // For routing
import withAuth from "@/components/withAuth" // Authentication wrapper

/**
 * Array of button configurations for different quiz/learning options.
 * Each object contains:
 *  - url: The background image
 *  - title: Main text shown on the button
 *  - description: Sub-text shown on the button
 *  - width: The percentage width in the flex container
 *  - path: The route to navigate when clicked
 */
const buttons = [
    {
        url: "/quizImages/practice.jpg",
        title: "Word Practice",
        description: "Improve your Hebrew vocabulary by practicing your saved words.",
        width: "40%",
        path: "/quiz/word-practice",
    },
    {
        url: "/quizImages/testYourself.jpg",
        title: "Test Your Hebrew Level",
        description: "Take a fun quiz to check your proficiency.",
        width: "30%",
        path: "/quiz/test-level",
    },
    {
        url: "/quizImages/AIChat.jpg",
        title: "Learn with AI",
        description: "Interact with AI-powered learning sessions.",
        width: "30%",
        path: "/quiz/learn-with-ai",
    },
    {
        url: "/quizImages/cards.jpg",
        title: "Hebrew Cards",
        description: "Flip cards to reveal words and meanings.",
        width: "40%",
        path: "/quiz/hebrew-cards",
    },
]

// Styled MUI components for the image buttons

/**
 * ImageButton:
 * Base styling for each button, making it occupy a certain height
 * and use an image background. It also handles hover effects.
 */
const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: "relative",
    height: 200,
    [theme.breakpoints.down("sm")]: {
        width: "100% !important", // Full width on small screens
        height: 100,
    },
    "&:hover, &.Mui-focusVisible": {
        zIndex: 1,
        "& .MuiImageBackdrop-root": {
            opacity: 0.15,
        },
        "& .MuiTypography-root": {
            border: "4px solid currentColor",
        },
    },
}))

/**
 * ImageSrc:
 * A styled 'span' that serves as the background image container.
 * Covers the entire button area.
 */
const ImageSrc = styled("span")({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
})

/**
 * Image:
 * A styled container for the text (title, description) in the middle of the button.
 */
const Image = styled("span")(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 16px",
    color: theme.palette.common.white,
}))

/**
 * ImageBackdrop:
 * A dark overlay placed on top of the background image
 * for improved text contrast and hover transition.
 */
const ImageBackdrop = styled("span")(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
}))

/**
 * ImageMarked:
 * A small horizontal mark that appears below the text on hover.
 */
const ImageMarked = styled("span")(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
}))

/**
 * StyledHeadline:
 * Large animated headline using a gradient text and fade/scale animations.
 */
const StyledHeadline = styled(Typography)(({ theme }) => ({
    fontSize: "3rem",
    fontWeight: 900,
    textAlign: "center",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
    animation: "fade-in 1s ease-out, scale-in 1.2s ease-in-out",
    "@keyframes fade-in": {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
    },
    "@keyframes scale-in": {
        "0%": { transform: "scale(0.9)" },
        "100%": { transform: "scale(1)" },
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "2.5rem",
    },
}))

/**
 * Quiz:
 * Main component that shows a list of image-based buttons for different quiz/learning paths.
 * Wrapped in 'withAuth' to ensure user is logged in before accessing this page.
 */
const Quiz = () => {
    const router = useRouter()

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, p: 4 }}>
            {/* 
        Animated headline 
      */}
            <StyledHeadline component="h1">Ready to Level Up Your Hebrew?</StyledHeadline>

            {/*
        Container for all the image buttons
      */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    minWidth: 300,
                    width: "100%",
                    gap: 4,
                    justifyContent: "center",
                }}
            >
                {buttons.map((button) => (
                    <ImageButton key={button.title} style={{ width: button.width }} onClick={() => router.push(button.path)}>
                        <ImageSrc style={{ backgroundImage: `url(${button.url})` }} />
                        <ImageBackdrop className="MuiImageBackdrop-root" />
                        <Image>
                            <Typography component="span" variant="h5" fontWeight="bold" gutterBottom>
                                {button.title}
                            </Typography>
                            <Typography component="span" variant="body2">
                                {button.description}
                            </Typography>
                            <ImageMarked className="MuiImageMarked-root" />
                        </Image>
                    </ImageButton>
                ))}
            </Box>
        </Box>
    )
}

// Wrap Quiz with 'withAuth' to ensure only authenticated users can access it
export default withAuth(Quiz)
