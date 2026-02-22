// Mock data layer for sports stats app
// All statistics are structured to be accurate representations

export type Sport = "NBA" | "NFL" | "MLB" | "NHL";

export type Sportsbook = "FanDuel" | "DraftKings" | "Fanatics" | "BetMGM";

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  record: string;
  logo?: string;
  conference: string;
  division: string;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  teamAbbr: string;
  position: string;
  number: number;
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

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  time: string;
  date: string;
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
  homeScore?: number;
  awayScore?: number;
}

// --- TEAMS ---
export const teams: Team[] = [
  { id: "bos", name: "Celtics", abbreviation: "BOS", city: "Boston", record: "42-14", conference: "Eastern", division: "Atlantic" },
  { id: "nyk", name: "Knicks", abbreviation: "NYK", city: "New York", record: "38-18", conference: "Eastern", division: "Atlantic" },
  { id: "mil", name: "Bucks", abbreviation: "MIL", city: "Milwaukee", record: "35-21", conference: "Eastern", division: "Central" },
  { id: "den", name: "Nuggets", abbreviation: "DEN", city: "Denver", record: "38-18", conference: "Western", division: "Northwest" },
  { id: "okc", name: "Thunder", abbreviation: "OKC", city: "Oklahoma City", record: "42-13", conference: "Western", division: "Northwest" },
  { id: "lal", name: "Lakers", abbreviation: "LAL", city: "Los Angeles", record: "33-23", conference: "Western", division: "Pacific" },
  { id: "gsw", name: "Warriors", abbreviation: "GSW", city: "Golden State", record: "30-26", conference: "Western", division: "Pacific" },
  { id: "phi", name: "76ers", abbreviation: "PHI", city: "Philadelphia", record: "28-28", conference: "Eastern", division: "Atlantic" },
  { id: "cle", name: "Cavaliers", abbreviation: "CLE", city: "Cleveland", record: "41-15", conference: "Eastern", division: "Central" },
  { id: "min", name: "Timberwolves", abbreviation: "MIN", city: "Minnesota", record: "36-20", conference: "Western", division: "Northwest" },
];

// --- PLAYERS ---
export const players: Player[] = [
  {
    id: "jt0", name: "Jayson Tatum", team: "Celtics", teamAbbr: "BOS", position: "SF", number: 0,
    stats: { gamesPlayed: 55 },
    seasonAverages: { points: 27.1, rebounds: 8.4, assists: 5.2, steals: 1.1, blocks: 0.6, turnovers: 2.8, minutes: 36.2, fgPct: 47.1, threePct: 37.6, ftPct: 83.2 },
    last10: { points: 29.3, rebounds: 9.1, assists: 5.8, steals: 1.3, blocks: 0.7, turnovers: 2.5, minutes: 37.1, fgPct: 48.2, threePct: 39.1, ftPct: 85.0 },
    last5: { points: 31.2, rebounds: 8.8, assists: 6.0, steals: 1.0, blocks: 0.8, turnovers: 2.4, minutes: 37.8, fgPct: 49.5, threePct: 40.2, ftPct: 86.1 },
  },
  {
    id: "jb7", name: "Jaylen Brown", team: "Celtics", teamAbbr: "BOS", position: "SG", number: 7,
    stats: { gamesPlayed: 53 },
    seasonAverages: { points: 23.5, rebounds: 5.6, assists: 3.8, steals: 1.2, blocks: 0.5, turnovers: 2.4, minutes: 34.1, fgPct: 49.2, threePct: 35.8, ftPct: 71.4 },
    last10: { points: 24.8, rebounds: 5.9, assists: 4.1, steals: 1.4, blocks: 0.4, turnovers: 2.2, minutes: 34.8, fgPct: 50.1, threePct: 37.2, ftPct: 73.0 },
    last5: { points: 25.6, rebounds: 6.2, assists: 3.6, steals: 1.6, blocks: 0.6, turnovers: 2.0, minutes: 35.2, fgPct: 51.3, threePct: 38.5, ftPct: 74.2 },
  },
  {
    id: "jb30", name: "Jalen Brunson", team: "Knicks", teamAbbr: "NYK", position: "PG", number: 11,
    stats: { gamesPlayed: 54 },
    seasonAverages: { points: 28.4, rebounds: 3.5, assists: 7.3, steals: 0.9, blocks: 0.2, turnovers: 2.6, minutes: 35.8, fgPct: 48.3, threePct: 38.9, ftPct: 84.7 },
    last10: { points: 30.1, rebounds: 3.8, assists: 7.8, steals: 1.0, blocks: 0.3, turnovers: 2.4, minutes: 36.5, fgPct: 49.1, threePct: 40.2, ftPct: 86.0 },
    last5: { points: 32.4, rebounds: 4.0, assists: 8.2, steals: 1.1, blocks: 0.2, turnovers: 2.2, minutes: 37.2, fgPct: 50.5, threePct: 41.8, ftPct: 87.3 },
  },
  {
    id: "ga34", name: "Giannis Antetokounmpo", team: "Bucks", teamAbbr: "MIL", position: "PF", number: 34,
    stats: { gamesPlayed: 50 },
    seasonAverages: { points: 31.5, rebounds: 11.8, assists: 6.2, steals: 1.1, blocks: 1.4, turnovers: 3.5, minutes: 35.4, fgPct: 61.2, threePct: 27.4, ftPct: 65.8 },
    last10: { points: 33.2, rebounds: 12.4, assists: 6.8, steals: 1.2, blocks: 1.6, turnovers: 3.3, minutes: 36.1, fgPct: 62.5, threePct: 28.9, ftPct: 67.2 },
    last5: { points: 34.8, rebounds: 13.0, assists: 7.0, steals: 1.0, blocks: 1.8, turnovers: 3.1, minutes: 36.8, fgPct: 63.8, threePct: 30.1, ftPct: 68.5 },
  },
  {
    id: "nj15", name: "Nikola Jokic", team: "Nuggets", teamAbbr: "DEN", position: "C", number: 15,
    stats: { gamesPlayed: 56 },
    seasonAverages: { points: 26.8, rebounds: 12.5, assists: 9.4, steals: 1.4, blocks: 0.9, turnovers: 3.2, minutes: 34.8, fgPct: 56.7, threePct: 33.8, ftPct: 81.5 },
    last10: { points: 28.4, rebounds: 13.2, assists: 10.1, steals: 1.6, blocks: 1.0, turnovers: 3.0, minutes: 35.5, fgPct: 58.2, threePct: 35.1, ftPct: 83.0 },
    last5: { points: 30.2, rebounds: 14.0, assists: 10.8, steals: 1.8, blocks: 1.2, turnovers: 2.8, minutes: 36.2, fgPct: 59.5, threePct: 36.4, ftPct: 84.2 },
  },
  {
    id: "sga2", name: "Shai Gilgeous-Alexander", team: "Thunder", teamAbbr: "OKC", position: "SG", number: 2,
    stats: { gamesPlayed: 54 },
    seasonAverages: { points: 31.2, rebounds: 5.5, assists: 6.1, steals: 2.0, blocks: 1.1, turnovers: 2.4, minutes: 34.2, fgPct: 53.5, threePct: 35.3, ftPct: 87.4 },
    last10: { points: 33.5, rebounds: 5.8, assists: 6.5, steals: 2.2, blocks: 1.3, turnovers: 2.2, minutes: 35.0, fgPct: 54.8, threePct: 36.8, ftPct: 88.5 },
    last5: { points: 35.0, rebounds: 6.0, assists: 7.0, steals: 2.4, blocks: 1.4, turnovers: 2.0, minutes: 35.8, fgPct: 56.1, threePct: 38.2, ftPct: 89.8 },
  },
  {
    id: "lj23", name: "LeBron James", team: "Lakers", teamAbbr: "LAL", position: "SF", number: 23,
    stats: { gamesPlayed: 52 },
    seasonAverages: { points: 23.8, rebounds: 7.2, assists: 8.8, steals: 1.3, blocks: 0.5, turnovers: 3.4, minutes: 35.0, fgPct: 51.2, threePct: 38.1, ftPct: 75.8 },
    last10: { points: 25.1, rebounds: 7.5, assists: 9.2, steals: 1.4, blocks: 0.6, turnovers: 3.2, minutes: 35.8, fgPct: 52.5, threePct: 39.5, ftPct: 77.0 },
    last5: { points: 26.4, rebounds: 7.8, assists: 9.8, steals: 1.6, blocks: 0.7, turnovers: 3.0, minutes: 36.5, fgPct: 53.8, threePct: 40.8, ftPct: 78.2 },
  },
  {
    id: "sc30", name: "Stephen Curry", team: "Warriors", teamAbbr: "GSW", position: "PG", number: 30,
    stats: { gamesPlayed: 51 },
    seasonAverages: { points: 22.5, rebounds: 4.8, assists: 6.4, steals: 0.7, blocks: 0.3, turnovers: 2.8, minutes: 32.5, fgPct: 45.1, threePct: 40.8, ftPct: 92.1 },
    last10: { points: 24.2, rebounds: 5.1, assists: 6.8, steals: 0.8, blocks: 0.4, turnovers: 2.6, minutes: 33.2, fgPct: 46.5, threePct: 42.2, ftPct: 93.5 },
    last5: { points: 25.8, rebounds: 5.4, assists: 7.2, steals: 0.9, blocks: 0.3, turnovers: 2.4, minutes: 34.0, fgPct: 47.8, threePct: 43.5, ftPct: 94.0 },
  },
  {
    id: "je21", name: "Joel Embiid", team: "76ers", teamAbbr: "PHI", position: "C", number: 21,
    stats: { gamesPlayed: 34 },
    seasonAverages: { points: 27.3, rebounds: 8.6, assists: 3.8, steals: 0.9, blocks: 1.7, turnovers: 3.6, minutes: 33.8, fgPct: 52.8, threePct: 38.5, ftPct: 86.2 },
    last10: { points: 29.1, rebounds: 9.2, assists: 4.2, steals: 1.0, blocks: 1.9, turnovers: 3.4, minutes: 34.5, fgPct: 54.1, threePct: 39.8, ftPct: 87.5 },
    last5: { points: 30.8, rebounds: 9.8, assists: 4.6, steals: 1.1, blocks: 2.1, turnovers: 3.2, minutes: 35.2, fgPct: 55.4, threePct: 41.2, ftPct: 88.8 },
  },
  {
    id: "dm1", name: "Donovan Mitchell", team: "Cavaliers", teamAbbr: "CLE", position: "SG", number: 45,
    stats: { gamesPlayed: 53 },
    seasonAverages: { points: 24.1, rebounds: 4.2, assists: 4.5, steals: 1.5, blocks: 0.4, turnovers: 2.5, minutes: 33.6, fgPct: 46.8, threePct: 37.2, ftPct: 86.5 },
    last10: { points: 25.8, rebounds: 4.5, assists: 4.8, steals: 1.6, blocks: 0.5, turnovers: 2.3, minutes: 34.2, fgPct: 48.1, threePct: 38.5, ftPct: 87.8 },
    last5: { points: 27.2, rebounds: 4.8, assists: 5.2, steals: 1.8, blocks: 0.6, turnovers: 2.1, minutes: 35.0, fgPct: 49.5, threePct: 39.8, ftPct: 89.0 },
  },
  {
    id: "ae1", name: "Anthony Edwards", team: "Timberwolves", teamAbbr: "MIN", position: "SG", number: 5,
    stats: { gamesPlayed: 55 },
    seasonAverages: { points: 25.8, rebounds: 5.6, assists: 4.1, steals: 1.3, blocks: 0.6, turnovers: 2.9, minutes: 35.2, fgPct: 46.2, threePct: 36.8, ftPct: 82.5 },
    last10: { points: 27.5, rebounds: 5.9, assists: 4.5, steals: 1.5, blocks: 0.7, turnovers: 2.7, minutes: 35.8, fgPct: 47.5, threePct: 38.2, ftPct: 84.0 },
    last5: { points: 29.0, rebounds: 6.2, assists: 4.8, steals: 1.6, blocks: 0.8, turnovers: 2.5, minutes: 36.5, fgPct: 48.8, threePct: 39.5, ftPct: 85.2 },
  },
];

// --- GAMES ---
export const games: Game[] = [
  {
    id: "g1", 
    homeTeam: teams[0], // BOS
    awayTeam: teams[1], // NYK
    time: "7:30 PM ET", date: "Today", status: "scheduled",
    moneyline: [
      { sportsbook: "FanDuel", home: -185, away: 155 },
      { sportsbook: "DraftKings", home: -180, away: 150 },
      { sportsbook: "Fanatics", home: -190, away: 160 },
      { sportsbook: "BetMGM", home: -175, away: 145 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 223.5, over: -110, under: -110 },
      { sportsbook: "DraftKings", total: 224.0, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 223.5, over: -112, under: -108 },
      { sportsbook: "BetMGM", total: 224.5, over: -110, under: -110 },
    ],
  },
  {
    id: "g2",
    homeTeam: teams[2], // MIL
    awayTeam: teams[3], // DEN
    time: "8:00 PM ET", date: "Today", status: "scheduled",
    moneyline: [
      { sportsbook: "FanDuel", home: -125, away: 105 },
      { sportsbook: "DraftKings", home: -130, away: 110 },
      { sportsbook: "Fanatics", home: -120, away: 100 },
      { sportsbook: "BetMGM", home: -128, away: 108 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 232.5, over: -110, under: -110 },
      { sportsbook: "DraftKings", total: 233.0, over: -105, under: -115 },
      { sportsbook: "Fanatics", total: 232.0, over: -108, under: -112 },
      { sportsbook: "BetMGM", total: 232.5, over: -112, under: -108 },
    ],
  },
  {
    id: "g3",
    homeTeam: teams[4], // OKC
    awayTeam: teams[5], // LAL
    time: "9:30 PM ET", date: "Today", status: "scheduled",
    moneyline: [
      { sportsbook: "FanDuel", home: -280, away: 230 },
      { sportsbook: "DraftKings", home: -275, away: 225 },
      { sportsbook: "Fanatics", home: -285, away: 235 },
      { sportsbook: "BetMGM", home: -270, away: 220 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 218.5, over: -110, under: -110 },
      { sportsbook: "DraftKings", total: 219.0, over: -110, under: -110 },
      { sportsbook: "Fanatics", total: 218.0, over: -108, under: -112 },
      { sportsbook: "BetMGM", total: 219.5, over: -112, under: -108 },
    ],
  },
  {
    id: "g4",
    homeTeam: teams[8], // CLE
    awayTeam: teams[9], // MIN
    time: "7:00 PM ET", date: "Today", status: "scheduled",
    moneyline: [
      { sportsbook: "FanDuel", home: -210, away: 175 },
      { sportsbook: "DraftKings", home: -205, away: 170 },
      { sportsbook: "Fanatics", home: -215, away: 180 },
      { sportsbook: "BetMGM", home: -200, away: 165 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 215.5, over: -110, under: -110 },
      { sportsbook: "DraftKings", total: 216.0, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 215.0, over: -112, under: -108 },
      { sportsbook: "BetMGM", total: 216.5, over: -110, under: -110 },
    ],
  },
];

// --- PROPS ---
function calcHitRate(avg: number, line: number): number {
  // Simplified: if avg > line, higher hit rate for over
  const diff = avg - line;
  const base = 50 + (diff / avg) * 100;
  return Math.max(15, Math.min(92, Math.round(base)));
}

export const propLines: PropLine[] = [
  {
    id: "p1", playerId: "jt0", playerName: "Jayson Tatum", teamAbbr: "BOS", stat: "Points",
    line: 26.5, gamesPlayed: 55,
    hitRate: calcHitRate(27.1, 26.5), hitRateLast10: calcHitRate(29.3, 26.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 26.5, over: -115, under: -105 },
      { sportsbook: "DraftKings", line: 27.0, over: -110, under: -110 },
      { sportsbook: "Fanatics", line: 26.5, over: -112, under: -108 },
      { sportsbook: "BetMGM", line: 27.5, over: -105, under: -115 },
    ],
  },
  {
    id: "p2", playerId: "jt0", playerName: "Jayson Tatum", teamAbbr: "BOS", stat: "Rebounds",
    line: 8.5, gamesPlayed: 55,
    hitRate: calcHitRate(8.4, 8.5), hitRateLast10: calcHitRate(9.1, 8.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 8.5, over: -105, under: -115 },
      { sportsbook: "DraftKings", line: 8.5, over: -108, under: -112 },
      { sportsbook: "Fanatics", line: 8.5, over: -110, under: -110 },
      { sportsbook: "BetMGM", line: 8.0, over: -120, under: 100 },
    ],
  },
  {
    id: "p3", playerId: "jt0", playerName: "Jayson Tatum", teamAbbr: "BOS", stat: "Assists",
    line: 5.5, gamesPlayed: 55,
    hitRate: calcHitRate(5.2, 5.5), hitRateLast10: calcHitRate(5.8, 5.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 5.5, over: 100, under: -120 },
      { sportsbook: "DraftKings", line: 5.5, over: -102, under: -118 },
      { sportsbook: "Fanatics", line: 5.5, over: -105, under: -115 },
      { sportsbook: "BetMGM", line: 5.5, over: 105, under: -125 },
    ],
  },
  {
    id: "p4", playerId: "jb30", playerName: "Jalen Brunson", teamAbbr: "NYK", stat: "Points",
    line: 28.5, gamesPlayed: 54,
    hitRate: calcHitRate(28.4, 28.5), hitRateLast10: calcHitRate(30.1, 28.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 28.5, over: -108, under: -112 },
      { sportsbook: "DraftKings", line: 29.0, over: -105, under: -115 },
      { sportsbook: "Fanatics", line: 28.5, over: -110, under: -110 },
      { sportsbook: "BetMGM", line: 28.0, over: -115, under: -105 },
    ],
  },
  {
    id: "p5", playerId: "jb30", playerName: "Jalen Brunson", teamAbbr: "NYK", stat: "Assists",
    line: 7.5, gamesPlayed: 54,
    hitRate: calcHitRate(7.3, 7.5), hitRateLast10: calcHitRate(7.8, 7.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 7.5, over: 100, under: -120 },
      { sportsbook: "DraftKings", line: 7.5, over: -105, under: -115 },
      { sportsbook: "Fanatics", line: 7.5, over: -102, under: -118 },
      { sportsbook: "BetMGM", line: 7.5, over: 102, under: -122 },
    ],
  },
  {
    id: "p6", playerId: "ga34", playerName: "Giannis Antetokounmpo", teamAbbr: "MIL", stat: "Points",
    line: 31.5, gamesPlayed: 50,
    hitRate: calcHitRate(31.5, 31.5), hitRateLast10: calcHitRate(33.2, 31.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 31.5, over: -110, under: -110 },
      { sportsbook: "DraftKings", line: 32.0, over: -105, under: -115 },
      { sportsbook: "Fanatics", line: 31.5, over: -108, under: -112 },
      { sportsbook: "BetMGM", line: 31.0, over: -115, under: -105 },
    ],
  },
  {
    id: "p7", playerId: "ga34", playerName: "Giannis Antetokounmpo", teamAbbr: "MIL", stat: "Rebounds",
    line: 11.5, gamesPlayed: 50,
    hitRate: calcHitRate(11.8, 11.5), hitRateLast10: calcHitRate(12.4, 11.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 11.5, over: -115, under: -105 },
      { sportsbook: "DraftKings", line: 11.5, over: -112, under: -108 },
      { sportsbook: "Fanatics", line: 12.0, over: -105, under: -115 },
      { sportsbook: "BetMGM", line: 11.5, over: -118, under: -102 },
    ],
  },
  {
    id: "p8", playerId: "nj15", playerName: "Nikola Jokic", teamAbbr: "DEN", stat: "Points",
    line: 26.5, gamesPlayed: 56,
    hitRate: calcHitRate(26.8, 26.5), hitRateLast10: calcHitRate(28.4, 26.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 26.5, over: -112, under: -108 },
      { sportsbook: "DraftKings", line: 27.0, over: -108, under: -112 },
      { sportsbook: "Fanatics", line: 26.5, over: -110, under: -110 },
      { sportsbook: "BetMGM", line: 26.5, over: -115, under: -105 },
    ],
  },
  {
    id: "p9", playerId: "nj15", playerName: "Nikola Jokic", teamAbbr: "DEN", stat: "Assists",
    line: 9.5, gamesPlayed: 56,
    hitRate: calcHitRate(9.4, 9.5), hitRateLast10: calcHitRate(10.1, 9.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 9.5, over: -102, under: -118 },
      { sportsbook: "DraftKings", line: 9.5, over: -105, under: -115 },
      { sportsbook: "Fanatics", line: 9.5, over: 100, under: -120 },
      { sportsbook: "BetMGM", line: 10.0, over: 105, under: -125 },
    ],
  },
  {
    id: "p10", playerId: "sga2", playerName: "Shai Gilgeous-Alexander", teamAbbr: "OKC", stat: "Points",
    line: 31.5, gamesPlayed: 54,
    hitRate: calcHitRate(31.2, 31.5), hitRateLast10: calcHitRate(33.5, 31.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 31.5, over: -105, under: -115 },
      { sportsbook: "DraftKings", line: 31.5, over: -108, under: -112 },
      { sportsbook: "Fanatics", line: 31.0, over: -112, under: -108 },
      { sportsbook: "BetMGM", line: 32.0, over: -102, under: -118 },
    ],
  },
  {
    id: "p11", playerId: "lj23", playerName: "LeBron James", teamAbbr: "LAL", stat: "Points",
    line: 23.5, gamesPlayed: 52,
    hitRate: calcHitRate(23.8, 23.5), hitRateLast10: calcHitRate(25.1, 23.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 23.5, over: -112, under: -108 },
      { sportsbook: "DraftKings", line: 24.0, over: -105, under: -115 },
      { sportsbook: "Fanatics", line: 23.5, over: -108, under: -112 },
      { sportsbook: "BetMGM", line: 23.5, over: -115, under: -105 },
    ],
  },
  {
    id: "p12", playerId: "lj23", playerName: "LeBron James", teamAbbr: "LAL", stat: "Assists",
    line: 8.5, gamesPlayed: 52,
    hitRate: calcHitRate(8.8, 8.5), hitRateLast10: calcHitRate(9.2, 8.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 8.5, over: -115, under: -105 },
      { sportsbook: "DraftKings", line: 8.5, over: -112, under: -108 },
      { sportsbook: "Fanatics", line: 9.0, over: -102, under: -118 },
      { sportsbook: "BetMGM", line: 8.5, over: -110, under: -110 },
    ],
  },
  {
    id: "p13", playerId: "dm1", playerName: "Donovan Mitchell", teamAbbr: "CLE", stat: "Points",
    line: 24.5, gamesPlayed: 53,
    hitRate: calcHitRate(24.1, 24.5), hitRateLast10: calcHitRate(25.8, 24.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 24.5, over: -105, under: -115 },
      { sportsbook: "DraftKings", line: 24.5, over: -108, under: -112 },
      { sportsbook: "Fanatics", line: 24.0, over: -112, under: -108 },
      { sportsbook: "BetMGM", line: 24.5, over: -102, under: -118 },
    ],
  },
  {
    id: "p14", playerId: "ae1", playerName: "Anthony Edwards", teamAbbr: "MIN", stat: "Points",
    line: 25.5, gamesPlayed: 55,
    hitRate: calcHitRate(25.8, 25.5), hitRateLast10: calcHitRate(27.5, 25.5),
    sportsbooks: [
      { sportsbook: "FanDuel", line: 25.5, over: -112, under: -108 },
      { sportsbook: "DraftKings", line: 26.0, over: -105, under: -115 },
      { sportsbook: "Fanatics", line: 25.5, over: -110, under: -110 },
      { sportsbook: "BetMGM", line: 25.5, over: -115, under: -105 },
    ],
  },
];

// Helper to get props for a specific game
export function getPropsForGame(gameId: string): PropLine[] {
  const game = games.find(g => g.id === gameId);
  if (!game) return [];
  const teamAbbrs = [game.homeTeam.abbreviation, game.awayTeam.abbreviation];
  return propLines.filter(p => teamAbbrs.includes(p.teamAbbr));
}

// Helper to get player by id
export function getPlayer(playerId: string): Player | undefined {
  return players.find(p => p.id === playerId);
}

// Helper to get props for a player
export function getPropsForPlayer(playerId: string): PropLine[] {
  return propLines.filter(p => p.playerId === playerId);
}

// Format odds display
export function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}
