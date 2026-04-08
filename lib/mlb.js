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

  // Only ACTIVE MLB teams
  const mlbTeams = data.teams.filter(t => t.active && t.sport && t.sport.id === 1);
  
  console.log(`Searching for: "${search}"`);
  console.log(`Found ${mlbTeams.length} active MLB teams`);

  // 1. Exact match on teamName ("Mets")
  let match = mlbTeams.find(t => t.teamName.toLowerCase() === search);
  if (match) {
    console.log(`✅ Exact teamName match: ${match.name} (ID: ${match.id})`);
    return match.id;
  }

  // 2. Exact match on full name ("New York Mets")
  match = mlbTeams.find(t => t.name.toLowerCase() === search);
  if (match) {
    console.log(`✅ Exact name match: ${match.name} (ID: ${match.id})`);
    return match.id;
  }

  // 3. Exact match on location ("New York")
  match = mlbTeams.find(t => t.locationName.toLowerCase() === search);
  if (match) {
    console.log(`✅ Location match: ${match.name} (ID: ${match.id})`);
    return match.id;
  }

  // 4. Partial match
  match = mlbTeams.find(t =>
    t.name.toLowerCase().includes(search) ||
    t.teamName.toLowerCase().includes(search) ||
    t.locationName.toLowerCase().includes(search)
  );

  if (match) {
    console.log(`✅ Partial match: ${match.name} (ID: ${match.id})`);
    return match.id;
  }

  console.log(`❌ No match found for: "${search}"`);
  return null;
}

// lib/mlb.js (ADD THESE TO THE BOTTOM)

export async function fetchTeamData(teamId) {
  const id = parseInt(teamId, 10);
  if (isNaN(id)) {
    throw new Error(`Invalid teamId: ${teamId} - must be a number`);
  }

  const url = `https://statsapi.mlb.com/api/v1/teams/${id}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data || !data.teams || data.teams.length === 0) {
    throw new Error(`No team found for teamId: ${id}`);
  }

  return data.teams[0];
}

export async function fetchTeamRecentGames(teamId, limit = 10) {
  const now = new Date();
  const season = now.getFullYear();
  
  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${teamId}&season=${season}&hydrate=team,linescore,decisions`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data || !data.dates) {
    throw new Error("Invalid schedule data returned from MLB API");
  }

  const games = data.dates
    .flatMap(date => date.games)
    .filter(game => game.status.statusCode === 'F')
    .sort((a, b) => new Date(b.gameDate) - new Date(a.gameDate))
    .slice(0, limit);

  return {
    teamId,
    season,
    recentGames: games
  };
}
