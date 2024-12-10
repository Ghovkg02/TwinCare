import { streamObject } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define the Gemini API key and endpoint
const GEMINI_API_KEY = 'AIzaSyCUUXa7R0yxZ-VVl13XEkkm16ja4kFvHdk'; 
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText'; 

const prompt = (context) => `
Generate 4 short questions for a preview of a chatbot.
The user is doing a chat with a trained sickle cell disease chatbot.
The questions should be personalized, for instance:
- How is my SpO2 level today?
- When is my next appointment?
- How can I manage my pain?
- What is the best diet for me?

The questions should be short and precise.

But, don’t use these exact questions, they’re just a reference.

Here is the context to help you generate the questions and 4 UUIDs to help you keep track of the questions:
${uuidv4()} ${uuidv4()} ${uuidv4()} ${uuidv4()}
${context}
`;

const questionsSchema = z.array(z.object({ id: z.string(), question: z.string() }));

export async function POST(req) {
    const context = await req.json();

    // Send request to Gemini API
    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
            prompt: prompt(context),
            maxOutputTokens: 500, // Adjust as needed
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to call Gemini API: ${response.statusText}`);
    }

    const data = await response.json();

    // Process Gemini response
    const questions = data.candidates[0].output
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((question) => ({
            id: uuidv4(),
            question: question.trim(),
        }));

    // Validate the questions schema
    const result = questionsSchema.safeParse(questions);
    if (!result.success) {
        throw new Error('Invalid questions format');
    }

    return new Response(JSON.stringify({ questions: result.data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
