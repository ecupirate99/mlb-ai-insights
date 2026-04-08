// api/insights/player.js
import { fetchPlayerData, searchPlayerByName } from "../../lib/mlb.js";
import { generateGameInsights } from "../../lib/llm.js";
import { playerInsightsPrompt } from "../../lib/prompts.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let { playerId, playerName } = req.body;

    // Allow name lookup
    if (!playerId && playerName) {
      playerId = await searchPlayerByName(playerName);
    }

    if (!playerId) {
      return res.status(400).json({ error: "playerId or playerName is required" });
    }

    const playerData = await fetchPlayerData(playerId);

    const insights = await generateGameInsights(playerData, playerInsightsPrompt);

    res.status(200).json(insights);
  } catch (err) {
    console.error("PLAYER ERROR:", err);
    res.status(500).json({ error: err.message || "Failed to generate player insights" });
  }
}
