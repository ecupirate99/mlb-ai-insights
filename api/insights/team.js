// api/insights/team.js
import { fetchTeamData, searchTeamByName } from "../../lib/mlb.js";
import { generateGameInsights } from "../../lib/llm.js";
import { teamInsightsPrompt } from "../../lib/prompts.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let { teamId, teamName } = req.body;

    // Allow name lookup
    if (!teamId && teamName) {
      teamId = await searchTeamByName(teamName);
    }

    if (!teamId) {
      return res.status(400).json({ error: "teamId or teamName is required" });
    }

    const teamData = await fetchTeamData(teamId);

    const insights = await generateGameInsights(teamData, teamInsightsPrompt);

    res.status(200).json(insights);
  } catch (err) {
    console.error("TEAM ERROR:", err);
    res.status(500).json({ error: err.message || "Failed to generate team insights" });
  }
}
