import { NextResponse } from "next/server";

export async function POST(req) {
  const { text, target } = await req.json();

  if (!text || !text.trim()) {
    return NextResponse.json({ error: "Please provide a sentence to translate." }, { status: 400 });
  }

  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY; // Access the API key securely

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          target: target || "he", // Default to Hebrew
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ translatedText: data?.data?.translations[0]?.translatedText });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Failed to fetch translation. Please try again." }, { status: 500 });
  }
}
