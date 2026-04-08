// lib/llm.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or flash-lite
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Try to parse JSON safely
  try {
    return JSON.parse(text);
  } catch {
    // Fallback: try to extract JSON block
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("LLM did not return valid JSON");
    return JSON.parse(match[0]);
  }
}

export async function generateGameInsights(gameData, promptBuilder) {
  const prompt = promptBuilder(gameData);
  return callGemini(prompt);
}

export async function generatePlayerInsights(playerData, promptBuilder) {
  const prompt = promptBuilder(playerData);
  return callGemini(prompt);
}

export async function generateTeamInsights(teamData, promptBuilder) {
  const prompt = promptBuilder(teamData);
  return callGemini(prompt);
}
