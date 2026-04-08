// api/insights/game.js
import { fetchGameData } from "../../lib/mlb.js";
import { generateGameInsights } from "../../lib/llm.js";
import { gameInsightsPrompt } from "../../lib/prompts.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { gameId } = req.body;
    if (!gameId) return res.status(400).json({ error: "gameId is required" });

    const gameData = await fetchGameData(gameId);
    const insights = await generateGameInsights(gameData, gameInsightsPrompt);

    res.status(200).json(insights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate game insights" });
  }
}
