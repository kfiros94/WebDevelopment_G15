export const translateText = async (text, target = 'he') => {
  // Direct API Key usage
  const apiKey = 'XXXXXXXXXXXXXXXXXXXX';//DONT PUSH TO GITHUB

  if (!apiKey) {
    console.error("API Key is missing. Please provide a valid API Key.");
    return "Translation service is unavailable.";
  }

  if (!text.trim()) {
    return 'Please enter a sentence to translate.';
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data?.data?.translations[0]?.translatedText || "No translation available.";
  } catch (error) {
    console.error("Translation error:", error);
    return 'Failed to fetch translation. Please try again later.';
  }
};
