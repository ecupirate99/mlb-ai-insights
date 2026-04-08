// lib/mlb.js

const BASE_URL = "https://statsapi.mlb.com/api";

export async function fetchGameData(gameId) {
  const url = `${BASE_URL}/v1.1/game/${gameId}/feed/live`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch game data");
  return res.json();
}

export async function fetchPlayerRecentGames(playerId, days = 10) {
  // Simple example: you can refine this later
  const url = `${BASE_URL}/v1/people/${playerId}/stats?stats=gameLog&group=hitting&season=2024`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch player stats");
  const data = await res.json();
  return data;
}

export async function fetchTeamRecentGames(teamId) {
  const url = `${BASE_URL}/v1/schedule?teamId=${teamId}&sportId=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch team schedule");
  const data = await res.json();
  return data;
}
