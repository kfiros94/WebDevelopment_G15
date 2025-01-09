export const translateText = async (text, target = "he") => {
  if (!text.trim()) {
    return "Please enter a sentence to translate.";
  }

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText || "No translation available.";
  } catch (error) {
    console.error("Translation error:", error);
    return "Failed to fetch translation. Please try again later.";
  }
};
