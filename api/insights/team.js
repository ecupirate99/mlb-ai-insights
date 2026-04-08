// api/insights/team.js
import { fetchTeamData, searchTeamByName } from "../../lib/mlb.js";
import { generateTeamInsights } from "../../lib/llm.js";
import { teamInsightsPrompt } from "../../lib/prompts.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let teamId, teamName;

    // Handle multiple input formats
    if (typeof req.body === 'string') {
      // Plain text: "mets"
      teamName = req.body.trim();
    } else if (req.body.teamName) {
      // JSON: { "teamName": "mets" }
      teamName = req.body.teamName;
    } else if (req.body.teamId) {
      // JSON: { "teamId": 121 }
      teamId = req.body.teamId;
    } else {
      return res.status(400).json({ 
        error: "Please provide team name or ID",
        examples: {
          plainText: "mets",
          json: { teamName: "mets" },
          jsonWithId: { teamId: 121 }
        }
      });
    }

    // Convert team name to ID if needed
    if (!teamId && teamName) {
      teamId = await searchTeamByName(teamName);
      if (!teamId) {
        return res.status(404).json({ 
          error: `Team not found: "${teamName}"`,
          hint: "Try 'Yankees', 'Mets', 'Dodgers', etc."
        });
      }
    }

    console.log(`Fetching insights for team: ${teamName || teamId} (ID: ${teamId})`);

    const teamData = await fetchTeamData(teamId);
    const insights = await generateTeamInsights(teamData, teamInsightsPrompt);

    res.status(200).json(insights);
  } catch (err) {
    console.error("TEAM ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
