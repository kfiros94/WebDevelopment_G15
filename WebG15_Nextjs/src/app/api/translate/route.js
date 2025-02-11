import { NextResponse } from "next/server"

/**
 * POST
 *
 * This API endpoint accepts a JSON payload containing:
 *   - text: The string to be translated
 *   - target: The target language code (default is "he" for Hebrew)
 *
 * It then calls the Google Translate API with the provided text and returns
 * the translated result as JSON.
 */
export async function POST(req) {
    // Extract "text" and "target" from the request body
    const { text, target } = await req.json()

    // Validate input: text must exist and not be empty
    if (!text || !text.trim()) {
        return NextResponse.json({ error: "Please provide a sentence to translate." }, { status: 400 })
    }

    try {
        // Retrieve the Google Translate API key from environment variables
        const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY

        // Call the Google Translate API endpoint
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,
                target: target || "he", // Default target language is Hebrew if none is provided
            }),
        })

        // Handle response errors
        if (!response.ok) {
            // Attempt to parse the error response and create an Error
            const errorData = await response.json()
            throw new Error(errorData.error?.message || `Error: ${response.status}`)
        }

        // Parse the JSON data returned by the Translate API
        const data = await response.json()

        // Return the translated text as JSON
        return NextResponse.json({
            translatedText: data?.data?.translations[0]?.translatedText,
        })
    } catch (error) {
        // Log any error and return a 500 status with a generic message
        console.error("Translation API error:", error)
        return NextResponse.json({ error: "Failed to fetch translation. Please try again." }, { status: 500 })
    }
}
