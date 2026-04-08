// api/insights/player.js
import { fetchPlayerRecentGames } from "../../../lib/mlb";
import { generatePlayerInsights } from "../../../lib/llm";
import { playerInsightsPrompt } from "../../../lib/prompts";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { playerId, games } = req.body;
    if (!playerId) return res.status(400).json({ error: "playerId is required" });

    const playerData = await fetchPlayerRecentGames(playerId, games || 10);
    const insights = await generatePlayerInsights(playerData, playerInsightsPrompt);

    res.status(200).json(insights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate player insights" });
  }
}
