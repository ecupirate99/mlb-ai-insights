// api/insights/player.js
import { fetchPlayerData } from "../../lib/mlb.js";
import { generateGameInsights } from "../../lib/llm.js";
import { playerInsightsPrompt } from "../../lib/prompts.js";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { playerId } = req.body;
    if (!playerId) return res.status(400).json({ error: "playerId is required" });

    const playerData = await fetchPlayerData(playerId);
    const insights = await generateGameInsights(playerData, playerInsightsPrompt);

    res.status(200).json(insights);
  } catch (err) {
    console.error("PLAYER ERROR:", err);
    res.status(500).json({ error: err.message || "Failed to generate player insights" });
  }
}
