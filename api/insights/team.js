// api/insights/team.js
import { fetchTeamData, fetchTeamRecentGames, searchTeamByName } from "../../lib/mlb.js";
import { generateTeamInsights } from "../../lib/llm.js";
import { teamInsightsPrompt } from "../../lib/prompts.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let teamId, teamName;

    if (typeof req.body === 'string') {
      teamName = req.body.trim();
    } else if (req.body.teamName) {
      teamName = req.body.teamName;
    } else if (req.body.teamId) {
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

    if (!teamId && teamName) {
      teamId = await searchTeamByName(teamName);
      if (!teamId) {
        return res.status(404).json({ 
          error: `Team not found: "${teamName}"`,
          hint: "Try 'Yankees', 'Mets', 'Dodgers', 'Reds', etc."
        });
      }
    }

    console.log(`Fetching insights for team: ${teamName || teamId} (ID: ${teamId})`);

    // ✅ Fetch BOTH team info and recent games in parallel
    const [teamData, recentGamesData] = await Promise.all([
      fetchTeamData(teamId),
      fetchTeamRecentGames(teamId, 10)
    ]);

    // ✅ Combine into a rich object for the LLM
    const enrichedTeamData = {
      ...teamData,
      recentGames: recentGamesData.recentGames,
      season: recentGamesData.season
    };

    const insights = await generateTeamInsights(enrichedTeamData, teamInsightsPrompt);
    res.status(200).json(insights);

  } catch (err) {
    console.error("TEAM ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
