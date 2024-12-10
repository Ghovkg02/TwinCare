'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage } from 'ai';

// Gemini API configuration
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";
const GEMINI_API_KEY = "AIzaSyCUUXa7R0yxZ-VVl13XEkkm16ja4kFvHdk"; 

export async function continueConversation(messages: CoreMessage[]) {
    'use server';

    // Convert messages into a single prompt for Gemini
    const prompt = messages
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
            prompt,
            maxOutputTokens: 500, // Adjust token limit as needed
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to call Gemini API: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract the generated text
    const generatedText = data.candidates[0]?.output || "No response generated.";

    // Create a streamable value for the response text
    const stream = createStreamableValue(async function* () {
        yield generatedText;
    });

    return { message: stream.value, data: { test: 'hello' } };
}
