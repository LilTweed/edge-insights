// Historical stats data for representative teams and star players across all sports
// Uses realistic career averages for well-known players

import type { Sport } from "./mockData";

// ── Types ──────────────────────────────────────────────────────────

export interface TeamSeason {
  year: string;
  record: string;
  winPct: number;
  homeRecord: string;
  awayRecord: string;
  ppg: number;
  oppPpg: number;
  last5: string; // e.g. "W-W-L-W-L"
  playoffs?: string;
}

export interface TeamHistorical {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  sport: Sport;
  conference: string;
  seasons: TeamSeason[];
  h2h: Record<string, { wins: number; losses: number }>; // opponent abbr → record
}

export interface PlayerSeason {
  year: string;
  team: string;
  gamesPlayed: number;
  stats: Record<string, number>;
}

export interface PlayerHistorical {
  id: string;
  name: string;
  sport: Sport;
  position: string;
  team: string;
  teamAbbr: string;
  seasons: PlayerSeason[];
}

// ── Helper ─────────────────────────────────────────────────────────

function yrs(from: number, to: number): string[] {
  const a: string[] = [];
  for (let y = from; y <= to; y++) a.push(`${y}-${String(y + 1).slice(2)}`);
  return a;
}

// ── NBA Teams ──────────────────────────────────────────────────────

export const nbaHistoricalTeams: TeamHistorical[] = [
  {
    id: "lak", name: "Lakers", abbreviation: "LAL", city: "Los Angeles", sport: "NBA", conference: "Western",
    seasons: [
      { year: "2024-25", record: "32-21", winPct: .604, homeRecord: "19-8", awayRecord: "13-13", ppg: 115.2, oppPpg: 112.8, last5: "W-W-L-W-L", playoffs: "TBD" },
      { year: "2023-24", record: "47-35", winPct: .573, homeRecord: "27-14", awayRecord: "20-21", ppg: 117.2, oppPpg: 115.4, last5: "W-L-W-W-L", playoffs: "1st Round" },
      { year: "2022-23", record: "43-39", winPct: .524, homeRecord: "25-16", awayRecord: "18-23", ppg: 117.0, oppPpg: 116.1, last5: "W-W-W-L-L", playoffs: "Conf Finals" },
      { year: "2021-22", record: "33-49", winPct: .402, homeRecord: "18-23", awayRecord: "15-26", ppg: 112.1, oppPpg: 115.0, last5: "L-L-W-L-L" },
      { year: "2020-21", record: "42-30", winPct: .583, homeRecord: "22-14", awayRecord: "20-16", ppg: 109.5, oppPpg: 106.8, last5: "L-W-L-W-W", playoffs: "1st Round" },
      { year: "2019-20", record: "52-19", winPct: .732, homeRecord: "26-10", awayRecord: "26-9", ppg: 113.4, oppPpg: 107.6, last5: "W-W-W-W-L", playoffs: "Champions" },
      { year: "2018-19", record: "37-45", winPct: .451, homeRecord: "22-19", awayRecord: "15-26", ppg: 111.8, oppPpg: 113.1, last5: "L-W-L-L-L" },
      { year: "2017-18", record: "35-47", winPct: .427, homeRecord: "20-21", awayRecord: "15-26", ppg: 108.1, oppPpg: 109.6, last5: "W-L-L-W-L" },
      { year: "2016-17", record: "26-56", winPct: .317, homeRecord: "16-25", awayRecord: "10-31", ppg: 104.6, oppPpg: 111.6, last5: "L-L-L-W-L" },
      { year: "2015-16", record: "17-65", winPct: .207, homeRecord: "10-31", awayRecord: "7-34", ppg: 97.3, oppPpg: 109.2, last5: "L-L-L-L-W" },
    ],
    h2h: { BOS: { wins: 45, losses: 38 }, GSW: { wins: 32, losses: 29 }, DEN: { wins: 28, losses: 22 } },
  },
  {
    id: "cel", name: "Celtics", abbreviation: "BOS", city: "Boston", sport: "NBA", conference: "Eastern",
    seasons: [
      { year: "2024-25", record: "38-15", winPct: .717, homeRecord: "22-5", awayRecord: "16-10", ppg: 118.6, oppPpg: 110.2, last5: "W-W-W-L-W", playoffs: "TBD" },
      { year: "2023-24", record: "64-18", winPct: .780, homeRecord: "37-4", awayRecord: "27-14", ppg: 120.6, oppPpg: 109.9, last5: "W-W-W-W-L", playoffs: "Champions" },
      { year: "2022-23", record: "57-25", winPct: .695, homeRecord: "33-8", awayRecord: "24-17", ppg: 117.9, oppPpg: 112.5, last5: "W-L-W-W-W", playoffs: "Conf Finals" },
      { year: "2021-22", record: "51-31", winPct: .622, homeRecord: "28-13", awayRecord: "23-18", ppg: 111.8, oppPpg: 104.5, last5: "W-W-L-W-W", playoffs: "Finals" },
      { year: "2020-21", record: "36-36", winPct: .500, homeRecord: "18-18", awayRecord: "18-18", ppg: 112.6, oppPpg: 111.2, last5: "W-L-W-L-L", playoffs: "1st Round" },
      { year: "2019-20", record: "48-24", winPct: .667, homeRecord: "25-11", awayRecord: "23-13", ppg: 113.7, oppPpg: 107.5, last5: "W-W-W-L-W", playoffs: "Conf Finals" },
      { year: "2018-19", record: "49-33", winPct: .598, homeRecord: "28-13", awayRecord: "21-20", ppg: 112.4, oppPpg: 108.0, last5: "W-L-W-W-L", playoffs: "Conf Semis" },
      { year: "2017-18", record: "55-27", winPct: .671, homeRecord: "30-11", awayRecord: "25-16", ppg: 104.0, oppPpg: 100.4, last5: "W-W-W-L-W", playoffs: "Conf Finals" },
      { year: "2016-17", record: "53-29", winPct: .646, homeRecord: "31-10", awayRecord: "22-19", ppg: 108.0, oppPpg: 105.1, last5: "W-W-L-W-W", playoffs: "Conf Finals" },
      { year: "2015-16", record: "48-34", winPct: .585, homeRecord: "29-12", awayRecord: "19-22", ppg: 105.7, oppPpg: 103.7, last5: "W-L-W-L-W", playoffs: "1st Round" },
    ],
    h2h: { LAL: { wins: 38, losses: 45 }, GSW: { wins: 18, losses: 14 }, DEN: { wins: 15, losses: 11 } },
  },
  {
    id: "gsw", name: "Warriors", abbreviation: "GSW", city: "Golden State", sport: "NBA", conference: "Western",
    seasons: [
      { year: "2024-25", record: "28-25", winPct: .528, homeRecord: "17-10", awayRecord: "11-15", ppg: 111.8, oppPpg: 112.4, last5: "L-W-L-L-W" },
      { year: "2023-24", record: "46-36", winPct: .561, homeRecord: "26-15", awayRecord: "20-21", ppg: 114.7, oppPpg: 113.2, last5: "W-L-W-L-L", playoffs: "Play-In" },
      { year: "2022-23", record: "44-38", winPct: .537, homeRecord: "26-15", awayRecord: "18-23", ppg: 118.9, oppPpg: 118.5, last5: "L-W-W-L-L", playoffs: "Conf Semis" },
      { year: "2021-22", record: "53-29", winPct: .646, homeRecord: "31-10", awayRecord: "22-19", ppg: 111.0, oppPpg: 105.5, last5: "W-W-W-L-W", playoffs: "Champions" },
    ],
    h2h: { LAL: { wins: 29, losses: 32 }, BOS: { wins: 14, losses: 18 }, DEN: { wins: 20, losses: 18 } },
  },
  {
    id: "den", name: "Nuggets", abbreviation: "DEN", city: "Denver", sport: "NBA", conference: "Western",
    seasons: [
      { year: "2024-25", record: "35-18", winPct: .660, homeRecord: "21-6", awayRecord: "14-12", ppg: 116.4, oppPpg: 111.8, last5: "W-W-W-L-W" },
      { year: "2023-24", record: "57-25", winPct: .695, homeRecord: "34-7", awayRecord: "23-18", ppg: 115.8, oppPpg: 110.2, last5: "W-W-L-W-W", playoffs: "Conf Semis" },
      { year: "2022-23", record: "53-29", winPct: .646, homeRecord: "34-7", awayRecord: "19-22", ppg: 116.2, oppPpg: 110.4, last5: "W-W-W-W-L", playoffs: "Champions" },
    ],
    h2h: { LAL: { wins: 22, losses: 28 }, GSW: { wins: 18, losses: 20 }, BOS: { wins: 11, losses: 15 } },
  },
];

// ── NBA Players ────────────────────────────────────────────────────

export const nbaHistoricalPlayers: PlayerHistorical[] = [
  {
    id: "lebron", name: "LeBron James", sport: "NBA", position: "SF", team: "Lakers", teamAbbr: "LAL",
    seasons: [
      { year: "2024-25", team: "LAL", gamesPlayed: 48, stats: { points: 23.5, rebounds: 7.1, assists: 9.0, steals: 1.2, blocks: 0.5, fgPct: 50.4, threePct: 35.8, ftPct: 75.2, minutes: 33.8 } },
      { year: "2023-24", team: "LAL", gamesPlayed: 71, stats: { points: 25.7, rebounds: 7.3, assists: 8.3, steals: 1.3, blocks: 0.5, fgPct: 54.0, threePct: 41.0, ftPct: 75.0, minutes: 35.3 } },
      { year: "2022-23", team: "LAL", gamesPlayed: 55, stats: { points: 28.9, rebounds: 8.3, assists: 6.8, steals: 0.9, blocks: 0.6, fgPct: 50.0, threePct: 32.1, ftPct: 76.8, minutes: 35.5 } },
      { year: "2021-22", team: "LAL", gamesPlayed: 56, stats: { points: 30.3, rebounds: 8.2, assists: 6.2, steals: 1.3, blocks: 1.1, fgPct: 52.4, threePct: 35.9, ftPct: 75.6, minutes: 37.2 } },
      { year: "2020-21", team: "LAL", gamesPlayed: 45, stats: { points: 25.0, rebounds: 7.7, assists: 7.8, steals: 1.1, blocks: 0.6, fgPct: 51.3, threePct: 36.5, ftPct: 69.8, minutes: 33.4 } },
      { year: "2019-20", team: "LAL", gamesPlayed: 67, stats: { points: 25.3, rebounds: 7.8, assists: 10.2, steals: 1.2, blocks: 0.5, fgPct: 49.3, threePct: 34.8, ftPct: 69.3, minutes: 34.6 } },
      { year: "2018-19", team: "LAL", gamesPlayed: 55, stats: { points: 27.4, rebounds: 8.5, assists: 8.3, steals: 1.3, blocks: 0.6, fgPct: 51.0, threePct: 33.9, ftPct: 66.5, minutes: 35.2 } },
      { year: "2017-18", team: "CLE", gamesPlayed: 82, stats: { points: 27.5, rebounds: 8.6, assists: 9.1, steals: 1.4, blocks: 0.9, fgPct: 54.2, threePct: 36.7, ftPct: 73.1, minutes: 36.9 } },
      { year: "2016-17", team: "CLE", gamesPlayed: 74, stats: { points: 26.4, rebounds: 8.6, assists: 8.7, steals: 1.2, blocks: 0.6, fgPct: 54.8, threePct: 36.3, ftPct: 67.4, minutes: 37.8 } },
      { year: "2015-16", team: "CLE", gamesPlayed: 76, stats: { points: 25.3, rebounds: 7.4, assists: 6.8, steals: 1.4, blocks: 0.6, fgPct: 52.0, threePct: 30.9, ftPct: 73.1, minutes: 35.6 } },
    ],
  },
  {
    id: "tatum", name: "Jayson Tatum", sport: "NBA", position: "SF", team: "Celtics", teamAbbr: "BOS",
    seasons: [
      { year: "2024-25", team: "BOS", gamesPlayed: 50, stats: { points: 27.0, rebounds: 9.0, assists: 5.5, steals: 1.0, blocks: 0.6, fgPct: 46.8, threePct: 37.2, ftPct: 83.5, minutes: 36.2 } },
      { year: "2023-24", team: "BOS", gamesPlayed: 74, stats: { points: 26.9, rebounds: 8.1, assists: 4.9, steals: 1.0, blocks: 0.6, fgPct: 47.1, threePct: 37.6, ftPct: 83.3, minutes: 35.7 } },
      { year: "2022-23", team: "BOS", gamesPlayed: 74, stats: { points: 30.1, rebounds: 8.8, assists: 4.6, steals: 1.1, blocks: 0.7, fgPct: 46.6, threePct: 35.0, ftPct: 85.4, minutes: 36.9 } },
      { year: "2021-22", team: "BOS", gamesPlayed: 76, stats: { points: 26.9, rebounds: 8.0, assists: 4.4, steals: 1.0, blocks: 0.6, fgPct: 45.3, threePct: 35.3, ftPct: 85.3, minutes: 36.3 } },
      { year: "2020-21", team: "BOS", gamesPlayed: 64, stats: { points: 26.4, rebounds: 7.4, assists: 4.3, steals: 1.2, blocks: 0.5, fgPct: 45.9, threePct: 38.6, ftPct: 86.8, minutes: 35.8 } },
      { year: "2019-20", team: "BOS", gamesPlayed: 66, stats: { points: 23.4, rebounds: 7.0, assists: 3.0, steals: 1.4, blocks: 0.9, fgPct: 45.0, threePct: 40.3, ftPct: 81.2, minutes: 34.3 } },
    ],
  },
  {
    id: "curry", name: "Stephen Curry", sport: "NBA", position: "PG", team: "Warriors", teamAbbr: "GSW",
    seasons: [
      { year: "2024-25", team: "GSW", gamesPlayed: 48, stats: { points: 22.5, rebounds: 5.0, assists: 6.4, steals: 0.8, blocks: 0.3, fgPct: 44.8, threePct: 40.1, ftPct: 92.4, minutes: 32.1 } },
      { year: "2023-24", team: "GSW", gamesPlayed: 74, stats: { points: 26.4, rebounds: 4.5, assists: 5.1, steals: 0.7, blocks: 0.4, fgPct: 45.0, threePct: 40.8, ftPct: 92.3, minutes: 32.7 } },
      { year: "2022-23", team: "GSW", gamesPlayed: 56, stats: { points: 29.4, rebounds: 6.1, assists: 6.3, steals: 0.9, blocks: 0.4, fgPct: 49.3, threePct: 42.7, ftPct: 91.5, minutes: 34.7 } },
      { year: "2021-22", team: "GSW", gamesPlayed: 64, stats: { points: 25.5, rebounds: 5.2, assists: 6.3, steals: 1.3, blocks: 0.4, fgPct: 43.7, threePct: 38.0, ftPct: 92.3, minutes: 34.5 } },
      { year: "2020-21", team: "GSW", gamesPlayed: 63, stats: { points: 32.0, rebounds: 5.5, assists: 5.8, steals: 1.2, blocks: 0.1, fgPct: 48.2, threePct: 42.1, ftPct: 91.6, minutes: 34.2 } },
      { year: "2019-20", team: "GSW", gamesPlayed: 5, stats: { points: 20.8, rebounds: 5.2, assists: 6.6, steals: 1.0, blocks: 0.4, fgPct: 40.3, threePct: 24.5, ftPct: 100.0, minutes: 27.8 } },
      { year: "2018-19", team: "GSW", gamesPlayed: 69, stats: { points: 27.3, rebounds: 5.3, assists: 5.2, steals: 1.3, blocks: 0.4, fgPct: 47.2, threePct: 43.7, ftPct: 91.6, minutes: 33.8 } },
      { year: "2017-18", team: "GSW", gamesPlayed: 51, stats: { points: 26.4, rebounds: 5.1, assists: 6.1, steals: 1.6, blocks: 0.2, fgPct: 49.5, threePct: 42.3, ftPct: 92.1, minutes: 32.0 } },
      { year: "2016-17", team: "GSW", gamesPlayed: 79, stats: { points: 25.3, rebounds: 4.5, assists: 6.6, steals: 1.8, blocks: 0.2, fgPct: 46.8, threePct: 41.1, ftPct: 89.8, minutes: 33.4 } },
      { year: "2015-16", team: "GSW", gamesPlayed: 79, stats: { points: 30.1, rebounds: 5.4, assists: 6.7, steals: 2.1, blocks: 0.2, fgPct: 50.4, threePct: 45.4, ftPct: 90.8, minutes: 34.2 } },
    ],
  },
  {
    id: "jokic", name: "Nikola Jokic", sport: "NBA", position: "C", team: "Nuggets", teamAbbr: "DEN",
    seasons: [
      { year: "2024-25", team: "DEN", gamesPlayed: 50, stats: { points: 29.7, rebounds: 13.0, assists: 10.2, steals: 1.7, blocks: 0.8, fgPct: 56.1, threePct: 38.4, ftPct: 81.7, minutes: 37.1 } },
      { year: "2023-24", team: "DEN", gamesPlayed: 79, stats: { points: 26.4, rebounds: 12.4, assists: 9.0, steals: 1.4, blocks: 0.9, fgPct: 58.3, threePct: 35.9, ftPct: 81.7, minutes: 34.6 } },
      { year: "2022-23", team: "DEN", gamesPlayed: 69, stats: { points: 24.5, rebounds: 11.8, assists: 9.8, steals: 1.3, blocks: 0.7, fgPct: 63.2, threePct: 38.3, ftPct: 82.2, minutes: 33.7 } },
      { year: "2021-22", team: "DEN", gamesPlayed: 74, stats: { points: 27.1, rebounds: 13.8, assists: 7.9, steals: 1.5, blocks: 0.9, fgPct: 58.3, threePct: 33.7, ftPct: 81.0, minutes: 33.5 } },
      { year: "2020-21", team: "DEN", gamesPlayed: 72, stats: { points: 26.4, rebounds: 10.8, assists: 8.3, steals: 1.3, blocks: 0.7, fgPct: 56.6, threePct: 38.8, ftPct: 86.8, minutes: 34.6 } },
    ],
  },
  {
    id: "ad", name: "Anthony Davis", sport: "NBA", position: "PF", team: "Lakers", teamAbbr: "LAL",
    seasons: [
      { year: "2024-25", team: "LAL", gamesPlayed: 48, stats: { points: 25.2, rebounds: 11.8, assists: 3.5, steals: 1.3, blocks: 2.2, fgPct: 53.2, threePct: 28.5, ftPct: 78.9, minutes: 35.4 } },
      { year: "2023-24", team: "LAL", gamesPlayed: 76, stats: { points: 24.7, rebounds: 12.6, assists: 3.5, steals: 1.2, blocks: 2.3, fgPct: 55.6, threePct: 27.1, ftPct: 81.6, minutes: 35.4 } },
      { year: "2022-23", team: "LAL", gamesPlayed: 56, stats: { points: 25.9, rebounds: 12.5, assists: 2.6, steals: 1.1, blocks: 2.0, fgPct: 56.3, threePct: 25.7, ftPct: 78.4, minutes: 34.0 } },
    ],
  },
];

// ── NFL Players ────────────────────────────────────────────────────

export const nflHistoricalTeams: TeamHistorical[] = [
  {
    id: "kc", name: "Chiefs", abbreviation: "KC", city: "Kansas City", sport: "NFL", conference: "AFC",
    seasons: [
      { year: "2024", record: "12-3", winPct: .800, homeRecord: "7-1", awayRecord: "5-2", ppg: 23.3, oppPpg: 17.8, last5: "W-W-W-L-W", playoffs: "TBD" },
      { year: "2023", record: "11-6", winPct: .647, homeRecord: "7-2", awayRecord: "4-4", ppg: 21.8, oppPpg: 17.3, last5: "W-W-L-W-W", playoffs: "Champions" },
      { year: "2022", record: "14-3", winPct: .824, homeRecord: "8-1", awayRecord: "6-2", ppg: 29.2, oppPpg: 21.5, last5: "W-W-W-W-L", playoffs: "Champions" },
      { year: "2021", record: "12-5", winPct: .706, homeRecord: "7-2", awayRecord: "5-3", ppg: 28.2, oppPpg: 21.4, last5: "W-W-L-W-W", playoffs: "Conf Championship" },
      { year: "2020", record: "14-2", winPct: .875, homeRecord: "8-0", awayRecord: "6-2", ppg: 29.6, oppPpg: 22.6, last5: "W-W-W-L-W", playoffs: "Super Bowl" },
      { year: "2019", record: "12-4", winPct: .750, homeRecord: "7-1", awayRecord: "5-3", ppg: 28.2, oppPpg: 19.3, last5: "W-W-W-W-W", playoffs: "Champions" },
    ],
    h2h: { BUF: { wins: 12, losses: 6 } },
  },
  {
    id: "buf", name: "Bills", abbreviation: "BUF", city: "Buffalo", sport: "NFL", conference: "AFC",
    seasons: [
      { year: "2024", record: "11-4", winPct: .733, homeRecord: "6-1", awayRecord: "5-3", ppg: 28.6, oppPpg: 22.1, last5: "W-W-L-W-W", playoffs: "TBD" },
      { year: "2023", record: "11-6", winPct: .647, homeRecord: "6-2", awayRecord: "5-4", ppg: 25.5, oppPpg: 22.8, last5: "W-L-W-W-L", playoffs: "Divisional" },
      { year: "2022", record: "13-3", winPct: .813, homeRecord: "7-1", awayRecord: "6-2", ppg: 28.4, oppPpg: 17.9, last5: "W-W-W-L-W", playoffs: "Divisional" },
    ],
    h2h: { KC: { wins: 6, losses: 12 } },
  },
];

export const nflHistoricalPlayers: PlayerHistorical[] = [
  {
    id: "mahomes", name: "Patrick Mahomes", sport: "NFL", position: "QB", team: "Chiefs", teamAbbr: "KC",
    seasons: [
      { year: "2024", team: "KC", gamesPlayed: 15, stats: { passYards: 3744, passTD: 24, interceptions: 10, completionPct: 66.8, qbRating: 93.2, rushYards: 285 } },
      { year: "2023", team: "KC", gamesPlayed: 16, stats: { passYards: 4183, passTD: 27, interceptions: 14, completionPct: 67.2, qbRating: 92.6, rushYards: 389 } },
      { year: "2022", team: "KC", gamesPlayed: 17, stats: { passYards: 5250, passTD: 41, interceptions: 12, completionPct: 67.1, qbRating: 105.2, rushYards: 358 } },
      { year: "2021", team: "KC", gamesPlayed: 17, stats: { passYards: 4839, passTD: 37, interceptions: 13, completionPct: 66.3, qbRating: 98.5, rushYards: 381 } },
      { year: "2020", team: "KC", gamesPlayed: 16, stats: { passYards: 4740, passTD: 38, interceptions: 6, completionPct: 66.3, qbRating: 108.2, rushYards: 308 } },
      { year: "2019", team: "KC", gamesPlayed: 14, stats: { passYards: 4031, passTD: 26, interceptions: 5, completionPct: 65.9, qbRating: 105.3, rushYards: 218 } },
      { year: "2018", team: "KC", gamesPlayed: 16, stats: { passYards: 5097, passTD: 50, interceptions: 12, completionPct: 66.0, qbRating: 113.8, rushYards: 272 } },
    ],
  },
  {
    id: "jallen", name: "Josh Allen", sport: "NFL", position: "QB", team: "Bills", teamAbbr: "BUF",
    seasons: [
      { year: "2024", team: "BUF", gamesPlayed: 15, stats: { passYards: 3549, passTD: 26, interceptions: 6, completionPct: 63.8, qbRating: 101.2, rushYards: 482, rushTD: 10 } },
      { year: "2023", team: "BUF", gamesPlayed: 17, stats: { passYards: 4306, passTD: 29, interceptions: 18, completionPct: 64.3, qbRating: 88.6, rushYards: 524, rushTD: 15 } },
      { year: "2022", team: "BUF", gamesPlayed: 16, stats: { passYards: 4283, passTD: 35, interceptions: 14, completionPct: 63.3, qbRating: 96.6, rushYards: 746, rushTD: 7 } },
      { year: "2021", team: "BUF", gamesPlayed: 17, stats: { passYards: 4407, passTD: 36, interceptions: 15, completionPct: 63.3, qbRating: 92.2, rushYards: 763, rushTD: 6 } },
      { year: "2020", team: "BUF", gamesPlayed: 16, stats: { passYards: 4544, passTD: 37, interceptions: 10, completionPct: 69.2, qbRating: 107.2, rushYards: 421, rushTD: 8 } },
    ],
  },
];

// ── Soccer Players ─────────────────────────────────────────────────

export const soccerHistoricalTeams: TeamHistorical[] = [
  {
    id: "ars", name: "Arsenal", abbreviation: "ARS", city: "London", sport: "Soccer", conference: "Premier League",
    seasons: [
      { year: "2024-25", record: "18-3-2", winPct: .826, homeRecord: "10-1-0", awayRecord: "8-2-2", ppg: 2.3, oppPpg: 0.7, last5: "W-W-D-W-W" },
      { year: "2023-24", record: "28-5-5", winPct: .763, homeRecord: "16-1-2", awayRecord: "12-4-3", ppg: 2.3, oppPpg: 0.7, last5: "W-W-W-D-W", playoffs: "2nd Place" },
      { year: "2022-23", record: "26-6-6", winPct: .711, homeRecord: "15-2-2", awayRecord: "11-4-4", ppg: 2.3, oppPpg: 0.8, last5: "W-L-W-L-W", playoffs: "2nd Place" },
    ],
    h2h: { MCI: { wins: 4, losses: 6 }, LIV: { wins: 5, losses: 4 } },
  },
  {
    id: "mci", name: "Manchester City", abbreviation: "MCI", city: "Manchester", sport: "Soccer", conference: "Premier League",
    seasons: [
      { year: "2024-25", record: "17-4-2", winPct: .783, homeRecord: "10-1-1", awayRecord: "7-3-1", ppg: 2.5, oppPpg: 0.9, last5: "W-L-W-W-W" },
      { year: "2023-24", record: "28-7-3", winPct: .763, homeRecord: "15-3-1", awayRecord: "13-4-2", ppg: 2.5, oppPpg: 0.9, last5: "W-W-W-L-W", playoffs: "Champions" },
      { year: "2022-23", record: "28-5-5", winPct: .763, homeRecord: "16-1-2", awayRecord: "12-4-3", ppg: 2.5, oppPpg: 0.9, last5: "W-W-W-W-W", playoffs: "Treble Winners" },
    ],
    h2h: { ARS: { wins: 6, losses: 4 }, LIV: { wins: 6, losses: 5 } },
  },
];

export const soccerHistoricalPlayers: PlayerHistorical[] = [
  {
    id: "haaland", name: "Erling Haaland", sport: "Soccer", position: "ST", team: "Manchester City", teamAbbr: "MCI",
    seasons: [
      { year: "2024-25", team: "MCI", gamesPlayed: 22, stats: { goals: 18, assists: 4, shotsOnTarget: 52, shotsPerGame: 4.2, passAccuracy: 72.1, minutesPlayed: 1890 } },
      { year: "2023-24", team: "MCI", gamesPlayed: 31, stats: { goals: 27, assists: 5, shotsOnTarget: 78, shotsPerGame: 4.5, passAccuracy: 70.8, minutesPlayed: 2650 } },
      { year: "2022-23", team: "MCI", gamesPlayed: 35, stats: { goals: 36, assists: 8, shotsOnTarget: 98, shotsPerGame: 4.8, passAccuracy: 68.4, minutesPlayed: 2960 } },
    ],
  },
  {
    id: "salah", name: "Mohamed Salah", sport: "Soccer", position: "RW", team: "Liverpool", teamAbbr: "LIV",
    seasons: [
      { year: "2024-25", team: "LIV", gamesPlayed: 22, stats: { goals: 14, assists: 10, shotsOnTarget: 42, shotsPerGame: 3.2, passAccuracy: 78.5, minutesPlayed: 1900 } },
      { year: "2023-24", team: "LIV", gamesPlayed: 32, stats: { goals: 18, assists: 10, shotsOnTarget: 58, shotsPerGame: 3.0, passAccuracy: 77.2, minutesPlayed: 2750 } },
      { year: "2022-23", team: "LIV", gamesPlayed: 38, stats: { goals: 19, assists: 12, shotsOnTarget: 62, shotsPerGame: 2.8, passAccuracy: 79.1, minutesPlayed: 3200 } },
      { year: "2021-22", team: "LIV", gamesPlayed: 35, stats: { goals: 23, assists: 13, shotsOnTarget: 72, shotsPerGame: 3.5, passAccuracy: 76.8, minutesPlayed: 3050 } },
      { year: "2020-21", team: "LIV", gamesPlayed: 37, stats: { goals: 22, assists: 5, shotsOnTarget: 65, shotsPerGame: 3.2, passAccuracy: 77.5, minutesPlayed: 3100 } },
    ],
  },
  {
    id: "saka", name: "Bukayo Saka", sport: "Soccer", position: "RW", team: "Arsenal", teamAbbr: "ARS",
    seasons: [
      { year: "2024-25", team: "ARS", gamesPlayed: 20, stats: { goals: 8, assists: 9, shotsOnTarget: 28, shotsPerGame: 2.4, passAccuracy: 81.2, minutesPlayed: 1720 } },
      { year: "2023-24", team: "ARS", gamesPlayed: 35, stats: { goals: 16, assists: 9, shotsOnTarget: 48, shotsPerGame: 2.5, passAccuracy: 80.5, minutesPlayed: 2900 } },
      { year: "2022-23", team: "ARS", gamesPlayed: 38, stats: { goals: 14, assists: 11, shotsOnTarget: 45, shotsPerGame: 2.2, passAccuracy: 79.8, minutesPlayed: 3100 } },
    ],
  },
];

// ── NHL Players ────────────────────────────────────────────────────

export const nhlHistoricalTeams: TeamHistorical[] = [
  {
    id: "edm", name: "Oilers", abbreviation: "EDM", city: "Edmonton", sport: "NHL", conference: "Western",
    seasons: [
      { year: "2024-25", record: "35-18-4", winPct: .649, homeRecord: "20-7-1", awayRecord: "15-11-3", ppg: 3.4, oppPpg: 2.8, last5: "W-W-L-W-OTL" },
      { year: "2023-24", record: "49-27-6", winPct: .634, homeRecord: "27-11-3", awayRecord: "22-16-3", ppg: 3.6, oppPpg: 2.8, last5: "W-W-W-L-W", playoffs: "Stanley Cup Final" },
    ],
    h2h: { FLA: { wins: 3, losses: 5 } },
  },
];

export const nhlHistoricalPlayers: PlayerHistorical[] = [
  {
    id: "mcdavid", name: "Connor McDavid", sport: "NHL", position: "C", team: "Oilers", teamAbbr: "EDM",
    seasons: [
      { year: "2024-25", team: "EDM", gamesPlayed: 50, stats: { goals: 22, assists: 45, points: 67, plusMinus: 12, penaltyMinutes: 18, shotsOnGoal: 142 } },
      { year: "2023-24", team: "EDM", gamesPlayed: 76, stats: { goals: 32, assists: 68, points: 100, plusMinus: 18, penaltyMinutes: 22, shotsOnGoal: 238 } },
      { year: "2022-23", team: "EDM", gamesPlayed: 82, stats: { goals: 64, assists: 89, points: 153, plusMinus: 22, penaltyMinutes: 36, shotsOnGoal: 322 } },
      { year: "2021-22", team: "EDM", gamesPlayed: 80, stats: { goals: 44, assists: 79, points: 123, plusMinus: 14, penaltyMinutes: 36, shotsOnGoal: 290 } },
      { year: "2020-21", team: "EDM", gamesPlayed: 56, stats: { goals: 33, assists: 72, points: 105, plusMinus: 21, penaltyMinutes: 20, shotsOnGoal: 188 } },
      { year: "2019-20", team: "EDM", gamesPlayed: 64, stats: { goals: 34, assists: 63, points: 97, plusMinus: 9, penaltyMinutes: 28, shotsOnGoal: 215 } },
      { year: "2018-19", team: "EDM", gamesPlayed: 78, stats: { goals: 41, assists: 75, points: 116, plusMinus: 3, penaltyMinutes: 20, shotsOnGoal: 274 } },
      { year: "2017-18", team: "EDM", gamesPlayed: 82, stats: { goals: 41, assists: 67, points: 108, plusMinus: -3, penaltyMinutes: 26, shotsOnGoal: 274 } },
      { year: "2016-17", team: "EDM", gamesPlayed: 82, stats: { goals: 30, assists: 70, points: 100, plusMinus: 27, penaltyMinutes: 26, shotsOnGoal: 251 } },
      { year: "2015-16", team: "EDM", gamesPlayed: 45, stats: { goals: 16, assists: 32, points: 48, plusMinus: -1, penaltyMinutes: 18, shotsOnGoal: 132 } },
    ],
  },
];

// ── MLB Players ────────────────────────────────────────────────────

export const mlbHistoricalTeams: TeamHistorical[] = [
  {
    id: "nyy", name: "Yankees", abbreviation: "NYY", city: "New York", sport: "MLB", conference: "AL East",
    seasons: [
      { year: "2024", record: "94-68", winPct: .580, homeRecord: "50-31", awayRecord: "44-37", ppg: 4.8, oppPpg: 4.2, last5: "W-L-W-W-L", playoffs: "World Series" },
      { year: "2023", record: "82-80", winPct: .506, homeRecord: "44-37", awayRecord: "38-43", ppg: 4.5, oppPpg: 4.4, last5: "L-W-L-W-L" },
      { year: "2022", record: "99-63", winPct: .611, homeRecord: "57-24", awayRecord: "42-39", ppg: 5.0, oppPpg: 3.7, last5: "W-W-W-L-W", playoffs: "ALCS" },
    ],
    h2h: { BOS: { wins: 62, losses: 58 } },
  },
];

export const mlbHistoricalPlayers: PlayerHistorical[] = [
  {
    id: "judge", name: "Aaron Judge", sport: "MLB", position: "RF", team: "Yankees", teamAbbr: "NYY",
    seasons: [
      { year: "2024", team: "NYY", gamesPlayed: 158, stats: { avg: .322, homeRuns: 58, rbi: 144, obp: .458, slg: .701, ops: 1.159, runs: 122, hits: 180 } },
      { year: "2023", team: "NYY", gamesPlayed: 106, stats: { avg: .267, homeRuns: 37, rbi: 75, obp: .395, slg: .613, ops: 1.008, runs: 73, hits: 103 } },
      { year: "2022", team: "NYY", gamesPlayed: 157, stats: { avg: .311, homeRuns: 62, rbi: 131, obp: .425, slg: .686, ops: 1.111, runs: 133, hits: 177 } },
      { year: "2021", team: "NYY", gamesPlayed: 148, stats: { avg: .287, homeRuns: 39, rbi: 98, obp: .373, slg: .544, ops: .916, runs: 89, hits: 158 } },
      { year: "2020", team: "NYY", gamesPlayed: 28, stats: { avg: .257, homeRuns: 9, rbi: 22, obp: .336, slg: .554, ops: .891, runs: 23, hits: 26 } },
      { year: "2019", team: "NYY", gamesPlayed: 102, stats: { avg: .272, homeRuns: 27, rbi: 55, obp: .381, slg: .540, ops: .921, runs: 75, hits: 103 } },
    ],
  },
];

// ── UFC Players ────────────────────────────────────────────────────

export const ufcHistoricalPlayers: PlayerHistorical[] = [
  {
    id: "makhachev", name: "Islam Makhachev", sport: "UFC", position: "Lightweight", team: "AKA", teamAbbr: "MAK",
    seasons: [
      { year: "2024", team: "AKA", gamesPlayed: 2, stats: { wins: 2, losses: 0, koTko: 0, submissions: 1, decisions: 1, strikesLandedPerMin: 4.2, takedownAvg: 3.8, strikingAccuracy: 52 } },
      { year: "2023", team: "AKA", gamesPlayed: 3, stats: { wins: 3, losses: 0, koTko: 1, submissions: 1, decisions: 1, strikesLandedPerMin: 4.5, takedownAvg: 4.1, strikingAccuracy: 54 } },
      { year: "2022", team: "AKA", gamesPlayed: 3, stats: { wins: 3, losses: 0, koTko: 1, submissions: 2, decisions: 0, strikesLandedPerMin: 4.0, takedownAvg: 4.5, strikingAccuracy: 51 } },
    ],
  },
];

// ── Combined Accessors ─────────────────────────────────────────────

export const allHistoricalTeams: TeamHistorical[] = [
  ...nbaHistoricalTeams,
  ...nflHistoricalTeams,
  ...soccerHistoricalTeams,
  ...nhlHistoricalTeams,
  ...mlbHistoricalTeams,
];

export const allHistoricalPlayers: PlayerHistorical[] = [
  ...nbaHistoricalPlayers,
  ...nflHistoricalPlayers,
  ...soccerHistoricalPlayers,
  ...nhlHistoricalPlayers,
  ...mlbHistoricalPlayers,
  ...ufcHistoricalPlayers,
];

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
    teams: allHistoricalTeams.filter((t) => t.name.toLowerCase().includes(q) || t.city.toLowerCase().includes(q) || t.abbreviation.toLowerCase().includes(q)),
    players: allHistoricalPlayers.filter((p) => p.name.toLowerCase().includes(q) || p.teamAbbr.toLowerCase().includes(q)),
  };
}

/** Get stat column labels for a sport's player data */
export function getStatColumns(sport: Sport): string[] {
  switch (sport) {
    case "NBA": case "NCAAB": return ["points", "rebounds", "assists", "steals", "blocks", "fgPct", "threePct", "ftPct", "minutes"];
    case "NFL": return ["passYards", "passTD", "interceptions", "completionPct", "qbRating", "rushYards"];
    case "Soccer": return ["goals", "assists", "shotsOnTarget", "shotsPerGame", "passAccuracy"];
    case "NHL": return ["goals", "assists", "points", "plusMinus", "penaltyMinutes", "shotsOnGoal"];
    case "MLB": return ["avg", "homeRuns", "rbi", "obp", "slg", "ops", "runs"];
    case "UFC": return ["wins", "losses", "koTko", "submissions", "strikesLandedPerMin", "takedownAvg"];
    default: return ["points", "rebounds", "assists"];
  }
}

export function formatStatLabel(key: string): string {
  const map: Record<string, string> = {
    points: "PTS", rebounds: "REB", assists: "AST", steals: "STL", blocks: "BLK",
    fgPct: "FG%", threePct: "3P%", ftPct: "FT%", minutes: "MIN",
    passYards: "PASS YDS", passTD: "TD", interceptions: "INT", completionPct: "CMP%",
    qbRating: "QBR", rushYards: "RUSH YDS", rushTD: "RUSH TD",
    goals: "G", shotsOnTarget: "SOT", shotsPerGame: "S/G", passAccuracy: "PASS%",
    minutesPlayed: "MIN", plusMinus: "+/-", penaltyMinutes: "PIM", shotsOnGoal: "SOG",
    avg: "AVG", homeRuns: "HR", rbi: "RBI", obp: "OBP", slg: "SLG", ops: "OPS",
    runs: "R", hits: "H",
    wins: "W", losses: "L", koTko: "KO/TKO", submissions: "SUB",
    strikesLandedPerMin: "SLpM", takedownAvg: "TD Avg", strikingAccuracy: "STR ACC%",
    decisions: "DEC",
  };
  return map[key] || key.toUpperCase();
}
