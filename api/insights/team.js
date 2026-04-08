// api/insights/team.js
import { fetchTeamRecentGames } from "../../lib/mlb.js";
import { generateGameInsights } from "../../lib/llm.js";
import { teamInsightsPrompt } from "../../lib/prompts.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { teamId } = req.body;
    if (!teamId) return res.status(400).json({ error: "teamId is required" });

    const teamData = await fetchTeamRecentGames(teamId);
    const insights = await generateTeamInsights(teamData, teamInsightsPrompt);

    res.status(200).json(insights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate team insights" });
  }
}
