// lib/llm.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateGameInsights(gameData, promptTemplate) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.0-flash-lite"
  });

  const prompt = promptTemplate(gameData);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
}

