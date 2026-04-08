// lib/llm.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateGameInsights(gameData, promptTemplate) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  });

  const prompt = promptTemplate(gameData);

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  // إزالة markdown fences if present
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON from model:", text);
    throw err;
  }
}

