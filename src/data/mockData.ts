// Data layer — types, interfaces, and helper functions only

export type Sport = "NBA" | "NCAAB" | "NCAAF" | "NFL" | "MLB" | "NHL" | "UFC" | "PGA" | "Soccer";
export type Sportsbook = "FanDuel" | "DraftKings" | "Fanatics" | "BetMGM" | "Bovada";

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  record: string;
  logo?: string;
  conference: string;
  division: string;
  sport: Sport;
  stats?: TeamStats;
  ranking?: number;
}

export interface TeamStats {
  ppg: number;
  oppPpg: number;
  rpg: number;
  apg: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
  turnovers: number;
  steals: number;
  blocks: number;
  ypg?: number;
  rushYpg?: number;
  passYpg?: number;
  oppYpg?: number;
  thirdDownPct?: number;
  redZonePct?: number;
  sacks?: number;
  takeaways?: number;
}

export interface MatchupHistory {
  team1Id: string;
  team2Id: string;
  allTime: { wins: number; losses: number };
  last5: { team1Wins: number; team2Wins: number; results: MatchupResult[] };
  last10: { team1Wins: number; team2Wins: number };
  streak: string;
  avgScore: { team1: number; team2: number };
  lastMeeting: string;
}

export interface MatchupResult {
  date: string;
  team1Score: number;
  team2Score: number;
  location: string;
}

export interface Injury {
  player: string;
  teamAbbr: string;
  status: "Out" | "Doubtful" | "Questionable" | "Probable" | "Day-to-Day";
  injury: string;
  returnDate?: string;
}

export interface InjuryHistoryEntry {
  date: string;
  injury: string;
  missedGames: number;
  severity: "Minor" | "Moderate" | "Major" | "Season-Ending";
  bodyPart: string;
}

export interface PlayerInjuryHistory {
  playerId: string;
  playerName: string;
  teamAbbr: string;
  history: InjuryHistoryEntry[];
}

export interface Player {
  id: string;
  name: string;
  team: string;
  teamAbbr: string;
  position: string;
  number: number;
  sport: Sport;
  stats: PlayerStats;
  seasonAverages: SeasonAverages;
  last10: SeasonAverages;
  last5: SeasonAverages;
}

export interface SeasonAverages {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  minutes: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  [key: string]: number;
}

export interface PropLine {
  id: string;
  playerId: string;
  playerName: string;
  teamAbbr: string;
  stat: string;
  line: number;
  sport: Sport;
  sportsbooks: SportsbookLine[];
  hitRate: number;
  hitRateLast10: number;
  gamesPlayed: number;
}

export interface SportsbookLine {
  sportsbook: Sportsbook;
  over: number;
  under: number;
  line: number;
}

export interface GamePlayerProp {
  playerName: string;
  stat: string;
  line: number;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  time: string;
  date: string;
  sport: Sport;
  status: "scheduled" | "live" | "final";
  moneyline: {
    sportsbook: Sportsbook;
    home: number;
    away: number;
  }[];
  overUnder: {
    sportsbook: Sportsbook;
    total: number;
    over: number;
    under: number;
  }[];
  spread?: {
    sportsbook: Sportsbook;
    home: number;
    away: number;
    homeOdds: number;
    awayOdds: number;
  }[];
  homeScore?: number;
  awayScore?: number;
  quarterScores?: { period: string; home: number; away: number }[];
  keyInjuries?: { player: string; status: string; injury: string }[];
  playerProps?: GamePlayerProp[];
}

// ===================== EMPTY DATA ARRAYS =====================

export const nbaTeams: Team[] = [];
export const ncaabTeams: Team[] = [];
export const ncaafTeams: Team[] = [];

export const allTeams: Team[] = [];
export const matchupHistories: MatchupHistory[] = [];
export const injuries: Injury[] = [];
export const injuryHistories: PlayerInjuryHistory[] = [];
export const allPlayers: Player[] = [];
export const allGames: Game[] = [];
export const propLines: PropLine[] = [];

// ===================== HELPER FUNCTIONS =====================

export function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export function getTeam(id: string): Team | undefined {
  return allTeams.find((t) => t.id === id);
}

export function getTeamsBySport(sport: Sport): Team[] {
  return allTeams.filter((t) => t.sport === sport);
}

export function getPlayer(id: string): Player | undefined {
  return allPlayers.find((p) => p.id === id);
}

export function getPropsForPlayer(playerId: string): PropLine[] {
  return propLines.filter((p) => p.playerId === playerId);
}

export function getPropsForGame(gameId: string): PropLine[] {
  return [];
}

export function getMatchupHistory(team1Id: string, team2Id: string): MatchupHistory | undefined {
  return matchupHistories.find(
    (m) =>
      (m.team1Id === team1Id && m.team2Id === team2Id) ||
      (m.team1Id === team2Id && m.team2Id === team1Id)
  );
}

export function getInjuryHistory(playerId: string): PlayerInjuryHistory | undefined {
  return injuryHistories.find((h) => h.playerId === playerId);
}
