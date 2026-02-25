// Historical stats — aggregates all sport-specific data files
// Types are defined in the generator module

import type { Sport } from "./mockData";

export type {
  TeamSeason,
  TeamHistorical,
  PlayerSeason,
  PlayerHistorical,
} from "./historical/generator";

import { nbaTeams, nbaPlayers } from "./historical/nba";
import { nflTeams, nflPlayers } from "./historical/nfl";
import { mlbTeams, mlbPlayers } from "./historical/mlb";
import { nhlTeams, nhlPlayers } from "./historical/nhl";
import { soccerTeams, soccerPlayers } from "./historical/soccer";
import { ufcTeams, ufcPlayers } from "./historical/ufc";

import type { TeamHistorical, PlayerHistorical } from "./historical/generator";

// ── Combined arrays ────────────────────────────────────────────────

export const allHistoricalTeams: TeamHistorical[] = [
  ...nbaTeams, ...nflTeams, ...mlbTeams, ...nhlTeams, ...soccerTeams, ...ufcTeams,
];

export const allHistoricalPlayers: PlayerHistorical[] = [
  ...nbaPlayers, ...nflPlayers, ...mlbPlayers, ...nhlPlayers, ...soccerPlayers, ...ufcPlayers,
];

// ── Accessors ──────────────────────────────────────────────────────

export function getHistoricalTeam(id: string): TeamHistorical | undefined {
  return allHistoricalTeams.find((t) => t.id === id);
}

export function getHistoricalPlayer(id: string): PlayerHistorical | undefined {
  return allHistoricalPlayers.find((p) => p.id === id);
}

export function searchHistorical(query: string): { teams: TeamHistorical[]; players: PlayerHistorical[] } {
  const q = query.toLowerCase().trim();
  if (!q) return { teams: [], players: [] };
  return {
    teams: allHistoricalTeams.filter((t) =>
      t.name.toLowerCase().includes(q) || t.city.toLowerCase().includes(q) || t.abbreviation.toLowerCase().includes(q)
    ),
    players: allHistoricalPlayers.filter((p) =>
      p.name.toLowerCase().includes(q) || p.teamAbbr.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)
    ),
  };
}

// ── Stat columns per sport ─────────────────────────────────────────

export function getStatColumns(sport: Sport): string[] {
  switch (sport) {
    case "NBA": case "NCAAB": return ["points", "rebounds", "assists", "steals", "blocks", "fgPct", "threePct", "ftPct", "minutes"];
    case "NFL": return ["passYards", "passTD", "interceptions", "rushYards", "rushTD", "receptions", "recYards", "recTD"];
    case "Soccer": return ["goals", "assists", "shotsOnTarget", "shotsPerGame", "passAccuracy", "minutesPlayed"];
    case "NHL": return ["goals", "assists", "points", "plusMinus", "penaltyMinutes", "shotsOnGoal"];
    case "MLB": return ["avg", "homeRuns", "rbi", "obp", "slg", "ops", "runs", "hits"];
    case "UFC": return ["wins", "losses", "koTko", "submissions", "strikesLandedPerMin", "takedownAvg", "strikingAccuracy"];
    default: return ["points", "rebounds", "assists"];
  }
}

export function formatStatLabel(key: string): string {
  const map: Record<string, string> = {
    points: "PTS", rebounds: "REB", assists: "AST", steals: "STL", blocks: "BLK",
    fgPct: "FG%", threePct: "3P%", ftPct: "FT%", minutes: "MIN",
    passYards: "PASS YDS", passTD: "TD", interceptions: "INT", completionPct: "CMP%",
    qbRating: "QBR", rushYards: "RUSH YDS", rushTD: "RUSH TD",
    carries: "CAR", receptions: "REC", recYards: "REC YDS", recTD: "REC TD", targets: "TGT",
    goals: "G", shotsOnTarget: "SOT", shotsPerGame: "S/G", passAccuracy: "PASS%",
    minutesPlayed: "MIN", plusMinus: "+/-", penaltyMinutes: "PIM", shotsOnGoal: "SOG",
    avg: "AVG", homeRuns: "HR", rbi: "RBI", obp: "OBP", slg: "SLG", ops: "OPS",
    runs: "R", hits: "H",
    wins: "W", losses: "L", koTko: "KO/TKO", submissions: "SUB",
    strikesLandedPerMin: "SLpM", takedownAvg: "TD Avg", strikingAccuracy: "STR%",
    decisions: "DEC",
  };
  return map[key] || key.toUpperCase();
}
