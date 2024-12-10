import { convertToCoreMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define Gemini API endpoint and key
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";
const GEMINI_API_KEY = "AIzaSyCUUXa7R0yxZ-VVl13XEkkm16ja4kFvHdk"; 

export async function POST(req) {
  const { messages } = await req.json();

  // Convert messages into a single prompt
  const prompt = convertToCoreMessages(messages)
    .map((msg) => (msg.role === "user" ? `User: ${msg.content}` : `Assistant: ${msg.content}`))
    .join("\n");

  // Call Gemini API
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt, // Send the converted prompt to Gemini
      maxOutputTokens: 500, // Adjust token limit as needed
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to call Gemini API: ${response.statusText}`);
  }

  const data = await response.json();

  // Extract the generated text
  const generatedText = data.candidates[0]?.output || "No response generated.";

  // Return as a data stream response
  return new Response(JSON.stringify({ text: generatedText }), {
    headers: { "Content-Type": "application/json" },
  });
}
