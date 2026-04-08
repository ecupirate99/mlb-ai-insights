// lib/prompts.js

export function gameInsightsPrompt(gameData) {
  return `
You are an MLB analyst.

Given the MLB game data below, generate a concise JSON object with:
- "summary": 2–4 sentence recap
- "turning_points": array of key moments
- "top_players": array of { name, impact }
- "momentum_analysis": 1–2 sentence description

Respond with ONLY valid JSON.

GAME_DATA:
${JSON.stringify(gameData).slice(0, 15000)}
`;
}

export function playerInsightsPrompt(playerData) {
  return `
You are an MLB analyst.

Given the player's recent game logs below, generate a JSON object with:
- "trend": "hot", "cold", or "neutral"
- "analysis": 2–4 sentence explanation
- "strengths": array of strings
- "weaknesses": array of strings

Respond with ONLY valid JSON.

PLAYER_DATA:
${JSON.stringify(playerData).slice(0, 15000)}
`;
}

export function teamInsightsPrompt(teamData) {
  return `
You are an MLB analyst.

Given the team's recent schedule and results below, generate a JSON object with:
- "summary": 2–4 sentence overview of recent form
- "offense": 1–2 sentence description
- "defense": 1–2 sentence description
- "momentum": "rising", "falling", or "steady"

Respond with ONLY valid JSON.

TEAM_DATA:
${JSON.stringify(teamData).slice(0, 15000)}
`;
}
