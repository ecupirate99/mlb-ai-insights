// lib/mlb.js

// -------------------------
// GAME DATA
// -------------------------
export async function fetchGameData(gameId) {
  const url = `https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data || !data.gameData) {
    throw new Error("Invalid game data returned from MLB API");
  }

  return data;
}

// -------------------------
// PLAYER LOOKUP + DATA
// -------------------------
export async function searchPlayerByName(name) {
  const url = `https://statsapi.mlb.com/api/v1/people/search?names=${encodeURIComponent(name)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data || !data.people || data.people.length === 0) {
    return null;
  }

  return data.people[0].id;
}

export async function fetchPlayerData(playerId) {
  const url = `https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=stats(group=[hitting,pitching],type=[season])`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data || !data.people || data.people.length === 0) {
    throw new Error("Invalid player data returned from MLB API");
  }

  return data;
}

// -------------------------
// TEAM LOOKUP + DATA
// -------------------------
export async function searchTeamByName(name) {
  const url = `https://statsapi.mlb.com/api/v1/teams?sportId=1`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data || !data.teams) return null;

  const search = name.toLowerCase();
  const mlbTeams = data.teams.filter(t => t.active);

  let match = mlbTeams.find(t => t.teamName.toLowerCase() === search);
  if (match) return match.id;

  match = mlbTeams.find(t => t.name.toLowerCase() === search);
  if (match) return match.id;

  match = mlbTeams.find(t =>
    t.name.toLowerCase().includes(search) ||
    t.teamName.toLowerCase().includes(search) ||
    t.locationName.toLowerCase().includes(search)
  );

  return match ? match.id : null;
}

export async function fetchTeamData(teamId) {
  const url = `https://statsapi.mlb.com/api/v1/teams/${teamId}?hydrate=teamStats(type=[season],group=[hitting,pitching,fielding])`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data || !data.teams || data.teams.length === 0) {
    throw new Error("Invalid team data returned from MLB API");
  }

  return data;
}
