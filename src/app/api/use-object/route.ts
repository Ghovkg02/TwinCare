import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define Gemini API endpoint and key
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";
const GEMINI_API_KEY = "AIzaSyCUUXa7R0yxZ-VVl13XEkkm16ja4kFvHdk"; 

// Define the schema for ingredients
const ingredientsSchema = z.array(z.object({ name: z.string(), amount: z.number() }));

export async function POST(req) {
  try {
    console.log(JSON.stringify(req.body));
    const context = await req.json();

    // Create a prompt for Gemini
    const prompt = `Generate 4 recipes for a recipe-making app using the following context:\n\n${context}`;

    // Call Gemini API
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        maxOutputTokens: 500, // Adjust the token limit as needed
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to call Gemini API: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract the generated recipes
    const generatedText = data.candidates[0]?.output || "No recipes generated.";
    const recipes = generatedText
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((recipe) => ({ name: recipe.trim(), amount: Math.random() * 10 })); // Example transformation

    // Validate the recipes schema
    const result = ingredientsSchema.safeParse(recipes);
    if (!result.success) {
      throw new Error("Invalid recipes format.");
    }

    return new Response(JSON.stringify({ ingredients: result.data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
