export async function POST(req) {
  console.log("🔍 Checking OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Not Found ❌"); // Debug

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "Missing OpenAI API key" }, { status: 500 });
  }

  try {
    const { message } = await req.json();
    console.log("Received message:", message);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",  // Change from gpt-4 to gpt-3.5-turbo
        messages: [
          { role: "system", content: "You are an AI that only helps with learning Hebrew." },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });
    

    console.log("OpenAI Response Status:", response.status);
    console.log("🔑 OpenAI API Key (First 5 chars):", process.env.OPENAI_API_KEY?.slice(0, 5));

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI Error:", errorData);
      throw new Error(`OpenAI API Error: ${errorData.error.message || response.status}`);
    }

    const data = await response.json();
    console.log("OpenAI Reply:", data.choices[0].message.content);
    
    return Response.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return Response.json({ error: "Failed to fetch AI response." }, { status: 500 });
  }
}
