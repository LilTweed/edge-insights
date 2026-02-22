// Mock data layer for sports stats app
// All statistics are structured to be accurate representations
import { nflTeams, nflGames, nflPlayers, nflProps, mlbTeams, mlbGames, mlbPlayers, mlbProps, nhlTeams, nhlGames, nhlPlayers, nhlProps } from "./extraSports";

export type Sport = "NBA" | "NCAAB" | "NCAAF" | "NFL" | "MLB" | "NHL";
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
  // Football specific
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
}

// ===================== TEAMS =====================

// --- NBA Teams ---
export const nbaTeams: Team[] = [
  { id: "bos", name: "Celtics", abbreviation: "BOS", city: "Boston", record: "42-14", conference: "Eastern", division: "Atlantic", sport: "NBA", stats: { ppg: 120.1, oppPpg: 110.3, rpg: 45.8, apg: 27.2, fgPct: 48.6, threePct: 38.9, ftPct: 80.1, turnovers: 13.2, steals: 7.8, blocks: 5.4 } },
  { id: "nyk", name: "Knicks", abbreviation: "NYK", city: "New York", record: "38-18", conference: "Eastern", division: "Atlantic", sport: "NBA", stats: { ppg: 115.4, oppPpg: 109.8, rpg: 44.2, apg: 25.8, fgPct: 47.8, threePct: 37.2, ftPct: 79.5, turnovers: 13.8, steals: 7.2, blocks: 4.8 } },
  { id: "mil", name: "Bucks", abbreviation: "MIL", city: "Milwaukee", record: "35-21", conference: "Eastern", division: "Central", sport: "NBA", stats: { ppg: 118.2, oppPpg: 112.5, rpg: 47.1, apg: 26.4, fgPct: 49.1, threePct: 36.5, ftPct: 76.8, turnovers: 14.5, steals: 7.5, blocks: 5.8 } },
  { id: "den", name: "Nuggets", abbreviation: "DEN", city: "Denver", record: "38-18", conference: "Western", division: "Northwest", sport: "NBA", stats: { ppg: 116.8, oppPpg: 111.2, rpg: 46.5, apg: 28.8, fgPct: 49.5, threePct: 37.8, ftPct: 79.2, turnovers: 14.1, steals: 8.1, blocks: 4.5 } },
  { id: "okc", name: "Thunder", abbreviation: "OKC", city: "Oklahoma City", record: "42-13", conference: "Western", division: "Northwest", sport: "NBA", stats: { ppg: 119.5, oppPpg: 108.9, rpg: 44.8, apg: 26.9, fgPct: 48.8, threePct: 37.4, ftPct: 81.2, turnovers: 12.8, steals: 9.2, blocks: 5.6 } },
  { id: "lal", name: "Lakers", abbreviation: "LAL", city: "Los Angeles", record: "33-23", conference: "Western", division: "Pacific", sport: "NBA", stats: { ppg: 113.5, oppPpg: 112.1, rpg: 43.8, apg: 27.5, fgPct: 48.2, threePct: 36.8, ftPct: 77.5, turnovers: 14.8, steals: 7.6, blocks: 4.9 } },
  { id: "gsw", name: "Warriors", abbreviation: "GSW", city: "Golden State", record: "30-26", conference: "Western", division: "Pacific", sport: "NBA", stats: { ppg: 112.8, oppPpg: 113.4, rpg: 42.5, apg: 28.2, fgPct: 46.9, threePct: 38.5, ftPct: 80.8, turnovers: 14.2, steals: 7.1, blocks: 4.2 } },
  { id: "phi", name: "76ers", abbreviation: "PHI", city: "Philadelphia", record: "28-28", conference: "Eastern", division: "Atlantic", sport: "NBA", stats: { ppg: 111.2, oppPpg: 112.8, rpg: 43.1, apg: 24.5, fgPct: 47.5, threePct: 36.2, ftPct: 79.8, turnovers: 15.1, steals: 6.8, blocks: 5.2 } },
  { id: "cle", name: "Cavaliers", abbreviation: "CLE", city: "Cleveland", record: "41-15", conference: "Eastern", division: "Central", sport: "NBA", stats: { ppg: 117.5, oppPpg: 107.8, rpg: 44.5, apg: 27.8, fgPct: 49.8, threePct: 38.2, ftPct: 78.5, turnovers: 12.5, steals: 7.9, blocks: 5.1 } },
  { id: "min", name: "Timberwolves", abbreviation: "MIN", city: "Minnesota", record: "36-20", conference: "Western", division: "Northwest", sport: "NBA", stats: { ppg: 112.4, oppPpg: 106.8, rpg: 45.2, apg: 25.1, fgPct: 47.2, threePct: 36.1, ftPct: 78.2, turnovers: 13.5, steals: 8.4, blocks: 6.2 } },
];

// --- NCAAB Teams ---
export const ncaabTeams: Team[] = [
  { id: "aub", name: "Tigers", abbreviation: "AUB", city: "Auburn", record: "25-4", conference: "SEC", division: "SEC", sport: "NCAAB", ranking: 1, stats: { ppg: 82.5, oppPpg: 65.8, rpg: 38.2, apg: 16.5, fgPct: 48.2, threePct: 36.8, ftPct: 74.5, turnovers: 11.2, steals: 8.5, blocks: 4.8 } },
  { id: "ala", name: "Crimson Tide", abbreviation: "BAMA", city: "Alabama", record: "21-8", conference: "SEC", division: "SEC", sport: "NCAAB", ranking: 12, stats: { ppg: 85.1, oppPpg: 72.4, rpg: 36.8, apg: 17.2, fgPct: 46.5, threePct: 37.5, ftPct: 76.2, turnovers: 13.5, steals: 9.1, blocks: 3.5 } },
  { id: "duk", name: "Blue Devils", abbreviation: "DUKE", city: "Duke", record: "24-5", conference: "ACC", division: "ACC", sport: "NCAAB", ranking: 3, stats: { ppg: 80.8, oppPpg: 67.2, rpg: 37.5, apg: 15.8, fgPct: 49.1, threePct: 35.2, ftPct: 77.8, turnovers: 10.8, steals: 7.2, blocks: 5.5 } },
  { id: "unc", name: "Tar Heels", abbreviation: "UNC", city: "North Carolina", record: "20-9", conference: "ACC", division: "ACC", sport: "NCAAB", ranking: 15, stats: { ppg: 78.5, oppPpg: 71.8, rpg: 39.1, apg: 16.2, fgPct: 47.8, threePct: 34.5, ftPct: 73.2, turnovers: 12.8, steals: 6.8, blocks: 4.2 } },
  { id: "hou", name: "Cougars", abbreviation: "HOU", city: "Houston", record: "26-3", conference: "Big 12", division: "Big 12", sport: "NCAAB", ranking: 2, stats: { ppg: 74.2, oppPpg: 58.5, rpg: 37.8, apg: 14.2, fgPct: 46.8, threePct: 33.8, ftPct: 71.5, turnovers: 10.5, steals: 9.8, blocks: 5.8 } },
  { id: "ten", name: "Volunteers", abbreviation: "TENN", city: "Tennessee", record: "23-6", conference: "SEC", division: "SEC", sport: "NCAAB", ranking: 5, stats: { ppg: 76.8, oppPpg: 62.5, rpg: 36.2, apg: 15.5, fgPct: 45.2, threePct: 35.8, ftPct: 75.8, turnovers: 11.8, steals: 8.2, blocks: 4.5 } },
  { id: "pur", name: "Boilermakers", abbreviation: "PUR", city: "Purdue", record: "22-7", conference: "Big Ten", division: "Big Ten", sport: "NCAAB", ranking: 8, stats: { ppg: 79.5, oppPpg: 68.2, rpg: 38.5, apg: 16.8, fgPct: 48.5, threePct: 36.2, ftPct: 78.5, turnovers: 11.5, steals: 6.5, blocks: 5.2 } },
  { id: "uconn", name: "Huskies", abbreviation: "UCONN", city: "UConn", record: "23-6", conference: "Big East", division: "Big East", sport: "NCAAB", ranking: 6, stats: { ppg: 81.2, oppPpg: 66.8, rpg: 37.2, apg: 17.5, fgPct: 49.5, threePct: 37.2, ftPct: 76.5, turnovers: 12.2, steals: 7.8, blocks: 4.8 } },
  { id: "kan", name: "Jayhawks", abbreviation: "KU", city: "Kansas", record: "21-8", conference: "Big 12", division: "Big 12", sport: "NCAAB", ranking: 10, stats: { ppg: 77.8, oppPpg: 69.5, rpg: 35.8, apg: 16.1, fgPct: 47.2, threePct: 35.5, ftPct: 74.8, turnovers: 12.5, steals: 7.5, blocks: 4.1 } },
  { id: "ken", name: "Wildcats", abbreviation: "UK", city: "Kentucky", record: "20-9", conference: "SEC", division: "SEC", sport: "NCAAB", ranking: 14, stats: { ppg: 80.2, oppPpg: 72.1, rpg: 36.5, apg: 15.2, fgPct: 46.2, threePct: 34.8, ftPct: 75.2, turnovers: 13.2, steals: 7.1, blocks: 4.5 } },
  { id: "fla", name: "Gators", abbreviation: "FLA", city: "Florida", record: "22-7", conference: "SEC", division: "SEC", sport: "NCAAB", ranking: 7, stats: { ppg: 78.8, oppPpg: 66.5, rpg: 37.8, apg: 15.8, fgPct: 47.5, threePct: 36.5, ftPct: 76.8, turnovers: 11.8, steals: 8.2, blocks: 3.8 } },
  { id: "msu", name: "Spartans", abbreviation: "MSU", city: "Michigan State", record: "20-9", conference: "Big Ten", division: "Big Ten", sport: "NCAAB", ranking: 16, stats: { ppg: 75.5, oppPpg: 68.8, rpg: 36.8, apg: 14.8, fgPct: 45.8, threePct: 34.2, ftPct: 73.5, turnovers: 12.1, steals: 7.5, blocks: 3.8 } },
];

// --- NCAAF Teams ---
export const ncaafTeams: Team[] = [
  { id: "aub_fb", name: "Tigers", abbreviation: "AUB", city: "Auburn", record: "6-6", conference: "SEC", division: "SEC", sport: "NCAAF", stats: { ppg: 28.5, oppPpg: 24.2, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 1.2, steals: 0, blocks: 0, ypg: 405.2, rushYpg: 175.8, passYpg: 229.4, oppYpg: 352.1, thirdDownPct: 41.2, redZonePct: 82.5, sacks: 32, takeaways: 18 } },
  { id: "ala_fb", name: "Crimson Tide", abbreviation: "BAMA", city: "Alabama", record: "9-3", conference: "SEC", division: "SEC", sport: "NCAAF", ranking: 8, stats: { ppg: 35.2, oppPpg: 18.5, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0.8, steals: 0, blocks: 0, ypg: 445.8, rushYpg: 185.2, passYpg: 260.6, oppYpg: 310.5, thirdDownPct: 45.8, redZonePct: 88.2, sacks: 38, takeaways: 22 } },
  { id: "osu_fb", name: "Buckeyes", abbreviation: "OSU", city: "Ohio State", record: "11-2", conference: "Big Ten", division: "Big Ten", sport: "NCAAF", ranking: 1, stats: { ppg: 38.5, oppPpg: 15.8, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0.7, steals: 0, blocks: 0, ypg: 465.2, rushYpg: 195.5, passYpg: 269.7, oppYpg: 295.8, thirdDownPct: 48.2, redZonePct: 91.5, sacks: 42, takeaways: 25 } },
  { id: "tex_fb", name: "Longhorns", abbreviation: "TEX", city: "Texas", record: "10-2", conference: "SEC", division: "SEC", sport: "NCAAF", ranking: 3, stats: { ppg: 34.8, oppPpg: 17.2, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0.9, steals: 0, blocks: 0, ypg: 438.5, rushYpg: 178.2, passYpg: 260.3, oppYpg: 318.2, thirdDownPct: 44.5, redZonePct: 86.8, sacks: 36, takeaways: 21 } },
  { id: "uga_fb", name: "Bulldogs", abbreviation: "UGA", city: "Georgia", record: "10-2", conference: "SEC", division: "SEC", sport: "NCAAF", ranking: 2, stats: { ppg: 36.2, oppPpg: 16.5, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0.8, steals: 0, blocks: 0, ypg: 452.8, rushYpg: 192.4, passYpg: 260.4, oppYpg: 302.5, thirdDownPct: 46.2, redZonePct: 89.5, sacks: 40, takeaways: 24 } },
  { id: "ore_fb", name: "Ducks", abbreviation: "ORE", city: "Oregon", record: "12-1", conference: "Big Ten", division: "Big Ten", sport: "NCAAF", ranking: 4, stats: { ppg: 37.5, oppPpg: 18.2, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0.9, steals: 0, blocks: 0, ypg: 458.5, rushYpg: 188.8, passYpg: 269.7, oppYpg: 325.2, thirdDownPct: 47.5, redZonePct: 87.2, sacks: 35, takeaways: 20 } },
];

export const allTeams: Team[] = [...nbaTeams, ...ncaabTeams, ...ncaafTeams, ...nflTeams, ...mlbTeams, ...nhlTeams];

// ===================== MATCHUP HISTORY =====================

export const matchupHistories: MatchupHistory[] = [
  // Auburn vs Alabama (Iron Bowl - Basketball)
  {
    team1Id: "aub", team2Id: "ala",
    allTime: { wins: 108, losses: 112 },
    last5: {
      team1Wins: 3, team2Wins: 2,
      results: [
        { date: "Feb 15, 2025", team1Score: 78, team2Score: 72, location: "Auburn Arena" },
        { date: "Jan 18, 2025", team1Score: 85, team2Score: 81, location: "Coleman Coliseum" },
        { date: "Feb 24, 2024", team1Score: 68, team2Score: 75, location: "Coleman Coliseum" },
        { date: "Jan 20, 2024", team1Score: 82, team2Score: 78, location: "Auburn Arena" },
        { date: "Feb 11, 2023", team1Score: 70, team2Score: 76, location: "Coleman Coliseum" },
      ],
    },
    last10: { team1Wins: 6, team2Wins: 4 },
    streak: "Auburn W2",
    avgScore: { team1: 76.8, team2: 74.2 },
    lastMeeting: "Feb 15, 2025",
  },
  // Auburn vs Alabama (Iron Bowl - Football)
  {
    team1Id: "aub_fb", team2Id: "ala_fb",
    allTime: { wins: 37, losses: 49 },
    last5: {
      team1Wins: 1, team2Wins: 4,
      results: [
        { date: "Nov 30, 2024", team1Score: 21, team2Score: 28, location: "Jordan-Hare Stadium" },
        { date: "Nov 25, 2023", team1Score: 24, team2Score: 27, location: "Bryant-Denny Stadium" },
        { date: "Nov 26, 2022", team1Score: 10, team2Score: 49, location: "Jordan-Hare Stadium" },
        { date: "Nov 27, 2021", team1Score: 10, team2Score: 24, location: "Bryant-Denny Stadium" },
        { date: "Nov 28, 2020", team1Score: 13, team2Score: 42, location: "Bryant-Denny Stadium" },
      ],
    },
    last10: { team1Wins: 3, team2Wins: 7 },
    streak: "Alabama W4",
    avgScore: { team1: 17.5, team2: 31.2 },
    lastMeeting: "Nov 30, 2024",
  },
  // Duke vs UNC
  {
    team1Id: "duk", team2Id: "unc",
    allTime: { wins: 112, losses: 141 },
    last5: {
      team1Wins: 3, team2Wins: 2,
      results: [
        { date: "Mar 8, 2025", team1Score: 82, team2Score: 78, location: "Cameron Indoor" },
        { date: "Feb 1, 2025", team1Score: 74, team2Score: 79, location: "Dean Smith Center" },
        { date: "Mar 9, 2024", team1Score: 88, team2Score: 72, location: "Cameron Indoor" },
        { date: "Feb 3, 2024", team1Score: 79, team2Score: 85, location: "Dean Smith Center" },
        { date: "Mar 4, 2023", team1Score: 81, team2Score: 68, location: "Cameron Indoor" },
      ],
    },
    last10: { team1Wins: 6, team2Wins: 4 },
    streak: "Duke W1",
    avgScore: { team1: 78.5, team2: 76.2 },
    lastMeeting: "Mar 8, 2025",
  },
  // Ohio State vs Oregon (Football)
  {
    team1Id: "osu_fb", team2Id: "ore_fb",
    allTime: { wins: 10, losses: 11 },
    last5: {
      team1Wins: 3, team2Wins: 2,
      results: [
        { date: "Jan 13, 2025", team1Score: 41, team2Score: 21, location: "Mercedes-Benz Stadium" },
        { date: "Oct 12, 2024", team1Score: 31, team2Score: 32, location: "Autzen Stadium" },
        { date: "Jan 1, 2022", team1Score: 48, team2Score: 45, location: "Rose Bowl" },
        { date: "Sep 11, 2021", team1Score: 35, team2Score: 28, location: "Ohio Stadium" },
        { date: "Jan 1, 2010", team1Score: 26, team2Score: 17, location: "Rose Bowl" },
      ],
    },
    last10: { team1Wins: 6, team2Wins: 4 },
    streak: "Ohio State W1",
    avgScore: { team1: 34.2, team2: 28.5 },
    lastMeeting: "Jan 13, 2025",
  },
  // Kansas vs Kentucky
  {
    team1Id: "kan", team2Id: "ken",
    allTime: { wins: 24, losses: 10 },
    last5: {
      team1Wins: 3, team2Wins: 2,
      results: [
        { date: "Jan 28, 2025", team1Score: 75, team2Score: 71, location: "Allen Fieldhouse" },
        { date: "Jan 27, 2024", team1Score: 68, team2Score: 72, location: "Rupp Arena" },
        { date: "Jan 28, 2023", team1Score: 77, team2Score: 68, location: "Allen Fieldhouse" },
        { date: "Jan 29, 2022", team1Score: 80, team2Score: 62, location: "Allen Fieldhouse" },
        { date: "Jan 30, 2021", team1Score: 63, team2Score: 65, location: "Rupp Arena" },
      ],
    },
    last10: { team1Wins: 7, team2Wins: 3 },
    streak: "Kansas W1",
    avgScore: { team1: 74.5, team2: 68.2 },
    lastMeeting: "Jan 28, 2025",
  },
  // Georgia vs Alabama (Football)
  {
    team1Id: "uga_fb", team2Id: "ala_fb",
    allTime: { wins: 28, losses: 42 },
    last5: {
      team1Wins: 4, team2Wins: 1,
      results: [
        { date: "Dec 7, 2024", team1Score: 22, team2Score: 19, location: "Mercedes-Benz Stadium" },
        { date: "Sep 28, 2024", team1Score: 41, team2Score: 34, location: "Bryant-Denny Stadium" },
        { date: "Dec 2, 2023", team1Score: 27, team2Score: 24, location: "Mercedes-Benz Stadium" },
        { date: "Jan 10, 2022", team1Score: 33, team2Score: 18, location: "Lucas Oil Stadium" },
        { date: "Dec 4, 2021", team1Score: 24, team2Score: 41, location: "Mercedes-Benz Stadium" },
      ],
    },
    last10: { team1Wins: 5, team2Wins: 5 },
    streak: "Georgia W4",
    avgScore: { team1: 29.4, team2: 27.2 },
    lastMeeting: "Dec 7, 2024",
  },
];

// ===================== PLAYERS =====================

export const nbaPlayers: Player[] = [
  {
    id: "jt0", name: "Jayson Tatum", team: "Celtics", teamAbbr: "BOS", position: "SF", number: 0, sport: "NBA",
    stats: { gamesPlayed: 55 },
    seasonAverages: { points: 27.1, rebounds: 8.4, assists: 5.2, steals: 1.1, blocks: 0.6, turnovers: 2.8, minutes: 36.2, fgPct: 47.1, threePct: 37.6, ftPct: 83.2 },
    last10: { points: 29.3, rebounds: 9.1, assists: 5.8, steals: 1.3, blocks: 0.7, turnovers: 2.5, minutes: 37.1, fgPct: 48.2, threePct: 39.1, ftPct: 85.0 },
    last5: { points: 31.2, rebounds: 8.8, assists: 6.0, steals: 1.0, blocks: 0.8, turnovers: 2.4, minutes: 37.8, fgPct: 49.5, threePct: 40.2, ftPct: 86.1 },
  },
  {
    id: "jb30", name: "Jalen Brunson", team: "Knicks", teamAbbr: "NYK", position: "PG", number: 11, sport: "NBA",
    stats: { gamesPlayed: 54 },
    seasonAverages: { points: 28.4, rebounds: 3.5, assists: 7.3, steals: 0.9, blocks: 0.2, turnovers: 2.6, minutes: 35.8, fgPct: 48.3, threePct: 38.9, ftPct: 84.7 },
    last10: { points: 30.1, rebounds: 3.8, assists: 7.8, steals: 1.0, blocks: 0.3, turnovers: 2.4, minutes: 36.5, fgPct: 49.1, threePct: 40.2, ftPct: 86.0 },
    last5: { points: 32.4, rebounds: 4.0, assists: 8.2, steals: 1.1, blocks: 0.2, turnovers: 2.2, minutes: 37.2, fgPct: 50.5, threePct: 41.8, ftPct: 87.3 },
  },
  {
    id: "ga34", name: "Giannis Antetokounmpo", team: "Bucks", teamAbbr: "MIL", position: "PF", number: 34, sport: "NBA",
    stats: { gamesPlayed: 50 },
    seasonAverages: { points: 31.5, rebounds: 11.8, assists: 6.2, steals: 1.1, blocks: 1.4, turnovers: 3.5, minutes: 35.4, fgPct: 61.2, threePct: 27.4, ftPct: 65.8 },
    last10: { points: 33.2, rebounds: 12.4, assists: 6.8, steals: 1.2, blocks: 1.6, turnovers: 3.3, minutes: 36.1, fgPct: 62.5, threePct: 28.9, ftPct: 67.2 },
    last5: { points: 34.8, rebounds: 13.0, assists: 7.0, steals: 1.0, blocks: 1.8, turnovers: 3.1, minutes: 36.8, fgPct: 63.8, threePct: 30.1, ftPct: 68.5 },
  },
  {
    id: "nj15", name: "Nikola Jokic", team: "Nuggets", teamAbbr: "DEN", position: "C", number: 15, sport: "NBA",
    stats: { gamesPlayed: 56 },
    seasonAverages: { points: 26.8, rebounds: 12.5, assists: 9.4, steals: 1.4, blocks: 0.9, turnovers: 3.2, minutes: 34.8, fgPct: 56.7, threePct: 33.8, ftPct: 81.5 },
    last10: { points: 28.4, rebounds: 13.2, assists: 10.1, steals: 1.6, blocks: 1.0, turnovers: 3.0, minutes: 35.5, fgPct: 58.2, threePct: 35.1, ftPct: 83.0 },
    last5: { points: 30.2, rebounds: 14.0, assists: 10.8, steals: 1.8, blocks: 1.2, turnovers: 2.8, minutes: 36.2, fgPct: 59.5, threePct: 36.4, ftPct: 84.2 },
  },
  {
    id: "sga2", name: "Shai Gilgeous-Alexander", team: "Thunder", teamAbbr: "OKC", position: "SG", number: 2, sport: "NBA",
    stats: { gamesPlayed: 54 },
    seasonAverages: { points: 31.2, rebounds: 5.5, assists: 6.1, steals: 2.0, blocks: 1.1, turnovers: 2.4, minutes: 34.2, fgPct: 53.5, threePct: 35.3, ftPct: 87.4 },
    last10: { points: 33.5, rebounds: 5.8, assists: 6.5, steals: 2.2, blocks: 1.3, turnovers: 2.2, minutes: 35.0, fgPct: 54.8, threePct: 36.8, ftPct: 88.5 },
    last5: { points: 35.0, rebounds: 6.0, assists: 7.0, steals: 2.4, blocks: 1.4, turnovers: 2.0, minutes: 35.8, fgPct: 56.1, threePct: 38.2, ftPct: 89.8 },
  },
  {
    id: "lj23", name: "LeBron James", team: "Lakers", teamAbbr: "LAL", position: "SF", number: 23, sport: "NBA",
    stats: { gamesPlayed: 52 },
    seasonAverages: { points: 23.8, rebounds: 7.2, assists: 8.8, steals: 1.3, blocks: 0.5, turnovers: 3.4, minutes: 35.0, fgPct: 51.2, threePct: 38.1, ftPct: 75.8 },
    last10: { points: 25.1, rebounds: 7.5, assists: 9.2, steals: 1.4, blocks: 0.6, turnovers: 3.2, minutes: 35.8, fgPct: 52.5, threePct: 39.5, ftPct: 77.0 },
    last5: { points: 26.4, rebounds: 7.8, assists: 9.8, steals: 1.6, blocks: 0.7, turnovers: 3.0, minutes: 36.5, fgPct: 53.8, threePct: 40.8, ftPct: 78.2 },
  },
  {
    id: "dm1", name: "Donovan Mitchell", team: "Cavaliers", teamAbbr: "CLE", position: "SG", number: 45, sport: "NBA",
    stats: { gamesPlayed: 53 },
    seasonAverages: { points: 24.1, rebounds: 4.2, assists: 4.5, steals: 1.5, blocks: 0.4, turnovers: 2.5, minutes: 33.6, fgPct: 46.8, threePct: 37.2, ftPct: 86.5 },
    last10: { points: 25.8, rebounds: 4.5, assists: 4.8, steals: 1.6, blocks: 0.5, turnovers: 2.3, minutes: 34.2, fgPct: 48.1, threePct: 38.5, ftPct: 87.8 },
    last5: { points: 27.2, rebounds: 4.8, assists: 5.2, steals: 1.8, blocks: 0.6, turnovers: 2.1, minutes: 35.0, fgPct: 49.5, threePct: 39.8, ftPct: 89.0 },
  },
  {
    id: "ae1", name: "Anthony Edwards", team: "Timberwolves", teamAbbr: "MIN", position: "SG", number: 5, sport: "NBA",
    stats: { gamesPlayed: 55 },
    seasonAverages: { points: 25.8, rebounds: 5.6, assists: 4.1, steals: 1.3, blocks: 0.6, turnovers: 2.9, minutes: 35.2, fgPct: 46.2, threePct: 36.8, ftPct: 82.5 },
    last10: { points: 27.5, rebounds: 5.9, assists: 4.5, steals: 1.5, blocks: 0.7, turnovers: 2.7, minutes: 35.8, fgPct: 47.5, threePct: 38.2, ftPct: 84.0 },
    last5: { points: 29.0, rebounds: 6.2, assists: 4.8, steals: 1.6, blocks: 0.8, turnovers: 2.5, minutes: 36.5, fgPct: 48.8, threePct: 39.5, ftPct: 85.2 },
  },
];

// NCAAB players
export const ncaabPlayers: Player[] = [
  {
    id: "jb_aub", name: "Johni Broome", team: "Tigers", teamAbbr: "AUB", position: "C", number: 10, sport: "NCAAB",
    stats: { gamesPlayed: 28 },
    seasonAverages: { points: 18.2, rebounds: 11.5, assists: 3.2, steals: 0.8, blocks: 2.5, turnovers: 2.1, minutes: 30.5, fgPct: 52.8, threePct: 28.5, ftPct: 72.1 },
    last10: { points: 19.5, rebounds: 12.1, assists: 3.5, steals: 0.9, blocks: 2.8, turnovers: 2.0, minutes: 31.2, fgPct: 54.2, threePct: 30.1, ftPct: 74.5 },
    last5: { points: 21.2, rebounds: 12.8, assists: 3.8, steals: 1.0, blocks: 3.0, turnovers: 1.8, minutes: 32.0, fgPct: 55.5, threePct: 31.8, ftPct: 75.8 },
  },
  {
    id: "mc_ala", name: "Mark Sears", team: "Crimson Tide", teamAbbr: "BAMA", position: "PG", number: 1, sport: "NCAAB",
    stats: { gamesPlayed: 27 },
    seasonAverages: { points: 19.8, rebounds: 4.2, assists: 5.5, steals: 1.2, blocks: 0.2, turnovers: 2.5, minutes: 33.2, fgPct: 46.5, threePct: 38.2, ftPct: 82.5 },
    last10: { points: 21.2, rebounds: 4.5, assists: 5.8, steals: 1.4, blocks: 0.3, turnovers: 2.3, minutes: 34.0, fgPct: 47.8, threePct: 39.5, ftPct: 84.0 },
    last5: { points: 22.8, rebounds: 4.8, assists: 6.2, steals: 1.5, blocks: 0.2, turnovers: 2.1, minutes: 34.8, fgPct: 49.1, threePct: 41.2, ftPct: 85.5 },
  },
  {
    id: "cc_duk", name: "Cooper Flagg", team: "Blue Devils", teamAbbr: "DUKE", position: "PF", number: 2, sport: "NCAAB",
    stats: { gamesPlayed: 28 },
    seasonAverages: { points: 20.1, rebounds: 8.5, assists: 3.8, steals: 1.5, blocks: 1.2, turnovers: 2.8, minutes: 32.5, fgPct: 48.2, threePct: 32.5, ftPct: 74.8 },
    last10: { points: 22.5, rebounds: 9.2, assists: 4.2, steals: 1.8, blocks: 1.4, turnovers: 2.5, minutes: 33.5, fgPct: 49.8, threePct: 34.2, ftPct: 76.5 },
    last5: { points: 24.2, rebounds: 9.8, assists: 4.5, steals: 2.0, blocks: 1.6, turnovers: 2.2, minutes: 34.5, fgPct: 51.2, threePct: 35.8, ftPct: 78.2 },
  },
  {
    id: "rj_unc", name: "RJ Davis", team: "Tar Heels", teamAbbr: "UNC", position: "PG", number: 4, sport: "NCAAB",
    stats: { gamesPlayed: 27 },
    seasonAverages: { points: 18.5, rebounds: 3.8, assists: 4.8, steals: 1.0, blocks: 0.1, turnovers: 2.2, minutes: 34.8, fgPct: 44.5, threePct: 36.8, ftPct: 85.2 },
    last10: { points: 19.8, rebounds: 4.0, assists: 5.2, steals: 1.1, blocks: 0.2, turnovers: 2.0, minutes: 35.5, fgPct: 45.8, threePct: 38.2, ftPct: 86.5 },
    last5: { points: 21.5, rebounds: 4.2, assists: 5.5, steals: 1.2, blocks: 0.2, turnovers: 1.8, minutes: 36.2, fgPct: 47.2, threePct: 39.5, ftPct: 87.8 },
  },
];

export const allPlayers: Player[] = [...nbaPlayers, ...ncaabPlayers, ...nflPlayers, ...mlbPlayers, ...nhlPlayers];

// ===================== GAMES =====================

export const nbaGames: Game[] = [
  {
    id: "g1", homeTeam: nbaTeams[0], awayTeam: nbaTeams[1], time: "7:30 PM ET", date: "Today", status: "scheduled", sport: "NBA",
    moneyline: [
      { sportsbook: "FanDuel", home: -185, away: 155 }, { sportsbook: "DraftKings", home: -180, away: 150 },
      { sportsbook: "Fanatics", home: -190, away: 160 }, { sportsbook: "BetMGM", home: -175, away: 145 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 223.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 224.0, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 223.5, over: -112, under: -108 }, { sportsbook: "BetMGM", total: 224.5, over: -110, under: -110 },
    ],
  },
  {
    id: "g2", homeTeam: nbaTeams[2], awayTeam: nbaTeams[3], time: "8:00 PM ET", date: "Today", status: "scheduled", sport: "NBA",
    moneyline: [
      { sportsbook: "FanDuel", home: -125, away: 105 }, { sportsbook: "DraftKings", home: -130, away: 110 },
      { sportsbook: "Fanatics", home: -120, away: 100 }, { sportsbook: "BetMGM", home: -128, away: 108 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 232.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 233.0, over: -105, under: -115 },
      { sportsbook: "Fanatics", total: 232.0, over: -108, under: -112 }, { sportsbook: "BetMGM", total: 232.5, over: -112, under: -108 },
    ],
  },
  {
    id: "g3", homeTeam: nbaTeams[4], awayTeam: nbaTeams[5], time: "9:30 PM ET", date: "Today", status: "scheduled", sport: "NBA",
    moneyline: [
      { sportsbook: "FanDuel", home: -280, away: 230 }, { sportsbook: "DraftKings", home: -275, away: 225 },
      { sportsbook: "Fanatics", home: -285, away: 235 }, { sportsbook: "BetMGM", home: -270, away: 220 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 218.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 219.0, over: -110, under: -110 },
      { sportsbook: "Fanatics", total: 218.0, over: -108, under: -112 }, { sportsbook: "BetMGM", total: 219.5, over: -112, under: -108 },
    ],
  },
  {
    id: "g4", homeTeam: nbaTeams[8], awayTeam: nbaTeams[9], time: "7:00 PM ET", date: "Today", status: "scheduled", sport: "NBA",
    moneyline: [
      { sportsbook: "FanDuel", home: -210, away: 175 }, { sportsbook: "DraftKings", home: -205, away: 170 },
      { sportsbook: "Fanatics", home: -215, away: 180 }, { sportsbook: "BetMGM", home: -200, away: 165 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 215.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 216.0, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 215.0, over: -112, under: -108 }, { sportsbook: "BetMGM", total: 216.5, over: -110, under: -110 },
    ],
  },
];

export const collegeGames: Game[] = [
  {
    id: "cg1", homeTeam: ncaabTeams[0], awayTeam: ncaabTeams[1], time: "6:00 PM ET", date: "Today", status: "scheduled", sport: "NCAAB",
    moneyline: [
      { sportsbook: "FanDuel", home: -350, away: 275 }, { sportsbook: "DraftKings", home: -340, away: 270 },
      { sportsbook: "Fanatics", home: -360, away: 280 }, { sportsbook: "BetMGM", home: -345, away: 272 },
    ],
    spread: [
      { sportsbook: "FanDuel", home: -8.5, away: 8.5, homeOdds: -110, awayOdds: -110 },
      { sportsbook: "DraftKings", home: -8.0, away: 8.0, homeOdds: -112, awayOdds: -108 },
      { sportsbook: "Fanatics", home: -9.0, away: 9.0, homeOdds: -108, awayOdds: -112 },
      { sportsbook: "BetMGM", home: -8.5, away: 8.5, homeOdds: -110, awayOdds: -110 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 148.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 149.0, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 148.0, over: -112, under: -108 }, { sportsbook: "BetMGM", total: 149.5, over: -110, under: -110 },
    ],
  },
  {
    id: "cg2", homeTeam: ncaabTeams[2], awayTeam: ncaabTeams[3], time: "8:00 PM ET", date: "Today", status: "scheduled", sport: "NCAAB",
    moneyline: [
      { sportsbook: "FanDuel", home: -280, away: 230 }, { sportsbook: "DraftKings", home: -275, away: 225 },
      { sportsbook: "Fanatics", home: -285, away: 235 }, { sportsbook: "BetMGM", home: -270, away: 220 },
    ],
    spread: [
      { sportsbook: "FanDuel", home: -6.5, away: 6.5, homeOdds: -110, awayOdds: -110 },
      { sportsbook: "DraftKings", home: -6.0, away: 6.0, homeOdds: -115, awayOdds: -105 },
      { sportsbook: "Fanatics", home: -7.0, away: 7.0, homeOdds: -105, awayOdds: -115 },
      { sportsbook: "BetMGM", home: -6.5, away: 6.5, homeOdds: -110, awayOdds: -110 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 152.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 153.0, over: -105, under: -115 },
      { sportsbook: "Fanatics", total: 152.0, over: -108, under: -112 }, { sportsbook: "BetMGM", total: 152.5, over: -112, under: -108 },
    ],
  },
  {
    id: "cg3", homeTeam: ncaabTeams[4], awayTeam: ncaabTeams[8], time: "9:00 PM ET", date: "Today", status: "scheduled", sport: "NCAAB",
    moneyline: [
      { sportsbook: "FanDuel", home: -420, away: 330 }, { sportsbook: "DraftKings", home: -410, away: 325 },
      { sportsbook: "Fanatics", home: -430, away: 340 }, { sportsbook: "BetMGM", home: -415, away: 328 },
    ],
    spread: [
      { sportsbook: "FanDuel", home: -10.5, away: 10.5, homeOdds: -110, awayOdds: -110 },
      { sportsbook: "DraftKings", home: -10.0, away: 10.0, homeOdds: -112, awayOdds: -108 },
      { sportsbook: "Fanatics", home: -11.0, away: 11.0, homeOdds: -108, awayOdds: -112 },
      { sportsbook: "BetMGM", home: -10.5, away: 10.5, homeOdds: -110, awayOdds: -110 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 138.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 139.0, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 138.0, over: -112, under: -108 }, { sportsbook: "BetMGM", total: 139.5, over: -110, under: -110 },
    ],
  },
  {
    id: "cg4", homeTeam: ncaabTeams[5], awayTeam: ncaabTeams[10], time: "7:00 PM ET", date: "Today", status: "scheduled", sport: "NCAAB",
    moneyline: [
      { sportsbook: "FanDuel", home: -240, away: 200 }, { sportsbook: "DraftKings", home: -235, away: 195 },
      { sportsbook: "Fanatics", home: -245, away: 205 }, { sportsbook: "BetMGM", home: -238, away: 198 },
    ],
    spread: [
      { sportsbook: "FanDuel", home: -5.5, away: 5.5, homeOdds: -110, awayOdds: -110 },
      { sportsbook: "DraftKings", home: -5.0, away: 5.0, homeOdds: -115, awayOdds: -105 },
      { sportsbook: "Fanatics", home: -6.0, away: 6.0, homeOdds: -105, awayOdds: -115 },
      { sportsbook: "BetMGM", home: -5.5, away: 5.5, homeOdds: -110, awayOdds: -110 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 141.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 142.0, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 141.0, over: -112, under: -108 }, { sportsbook: "BetMGM", total: 142.5, over: -110, under: -110 },
    ],
  },
];

export const allGames: Game[] = [...nbaGames, ...collegeGames, ...nflGames, ...mlbGames, ...nhlGames];

// ===================== PROPS =====================

function calcHitRate(avg: number, line: number): number {
  const diff = avg - line;
  const base = 50 + (diff / avg) * 100;
  return Math.max(15, Math.min(92, Math.round(base)));
}

export const propLines: PropLine[] = [
  // NBA props
  { id: "p1", playerId: "jt0", playerName: "Jayson Tatum", teamAbbr: "BOS", stat: "Points", line: 26.5, gamesPlayed: 55, sport: "NBA", hitRate: calcHitRate(27.1, 26.5), hitRateLast10: calcHitRate(29.3, 26.5), sportsbooks: [{ sportsbook: "FanDuel", line: 26.5, over: -115, under: -105 }, { sportsbook: "DraftKings", line: 27.0, over: -110, under: -110 }, { sportsbook: "Fanatics", line: 26.5, over: -112, under: -108 }, { sportsbook: "BetMGM", line: 27.5, over: -105, under: -115 }] },
  { id: "p2", playerId: "jt0", playerName: "Jayson Tatum", teamAbbr: "BOS", stat: "Rebounds", line: 8.5, gamesPlayed: 55, sport: "NBA", hitRate: calcHitRate(8.4, 8.5), hitRateLast10: calcHitRate(9.1, 8.5), sportsbooks: [{ sportsbook: "FanDuel", line: 8.5, over: -105, under: -115 }, { sportsbook: "DraftKings", line: 8.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 8.5, over: -110, under: -110 }, { sportsbook: "BetMGM", line: 8.0, over: -120, under: 100 }] },
  { id: "p3", playerId: "jb30", playerName: "Jalen Brunson", teamAbbr: "NYK", stat: "Points", line: 28.5, gamesPlayed: 54, sport: "NBA", hitRate: calcHitRate(28.4, 28.5), hitRateLast10: calcHitRate(30.1, 28.5), sportsbooks: [{ sportsbook: "FanDuel", line: 28.5, over: -108, under: -112 }, { sportsbook: "DraftKings", line: 29.0, over: -105, under: -115 }, { sportsbook: "Fanatics", line: 28.5, over: -110, under: -110 }, { sportsbook: "BetMGM", line: 28.0, over: -115, under: -105 }] },
  { id: "p4", playerId: "ga34", playerName: "Giannis Antetokounmpo", teamAbbr: "MIL", stat: "Points", line: 31.5, gamesPlayed: 50, sport: "NBA", hitRate: calcHitRate(31.5, 31.5), hitRateLast10: calcHitRate(33.2, 31.5), sportsbooks: [{ sportsbook: "FanDuel", line: 31.5, over: -110, under: -110 }, { sportsbook: "DraftKings", line: 32.0, over: -105, under: -115 }, { sportsbook: "Fanatics", line: 31.5, over: -108, under: -112 }, { sportsbook: "BetMGM", line: 31.0, over: -115, under: -105 }] },
  { id: "p5", playerId: "nj15", playerName: "Nikola Jokic", teamAbbr: "DEN", stat: "Points", line: 26.5, gamesPlayed: 56, sport: "NBA", hitRate: calcHitRate(26.8, 26.5), hitRateLast10: calcHitRate(28.4, 26.5), sportsbooks: [{ sportsbook: "FanDuel", line: 26.5, over: -112, under: -108 }, { sportsbook: "DraftKings", line: 27.0, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 26.5, over: -110, under: -110 }, { sportsbook: "BetMGM", line: 26.5, over: -115, under: -105 }] },
  { id: "p6", playerId: "sga2", playerName: "Shai Gilgeous-Alexander", teamAbbr: "OKC", stat: "Points", line: 31.5, gamesPlayed: 54, sport: "NBA", hitRate: calcHitRate(31.2, 31.5), hitRateLast10: calcHitRate(33.5, 31.5), sportsbooks: [{ sportsbook: "FanDuel", line: 31.5, over: -105, under: -115 }, { sportsbook: "DraftKings", line: 31.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 31.0, over: -112, under: -108 }, { sportsbook: "BetMGM", line: 32.0, over: -102, under: -118 }] },
  { id: "p7", playerId: "lj23", playerName: "LeBron James", teamAbbr: "LAL", stat: "Points", line: 23.5, gamesPlayed: 52, sport: "NBA", hitRate: calcHitRate(23.8, 23.5), hitRateLast10: calcHitRate(25.1, 23.5), sportsbooks: [{ sportsbook: "FanDuel", line: 23.5, over: -112, under: -108 }, { sportsbook: "DraftKings", line: 24.0, over: -105, under: -115 }, { sportsbook: "Fanatics", line: 23.5, over: -108, under: -112 }, { sportsbook: "BetMGM", line: 23.5, over: -115, under: -105 }] },
  { id: "p8", playerId: "dm1", playerName: "Donovan Mitchell", teamAbbr: "CLE", stat: "Points", line: 24.5, gamesPlayed: 53, sport: "NBA", hitRate: calcHitRate(24.1, 24.5), hitRateLast10: calcHitRate(25.8, 24.5), sportsbooks: [{ sportsbook: "FanDuel", line: 24.5, over: -105, under: -115 }, { sportsbook: "DraftKings", line: 24.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 24.0, over: -112, under: -108 }, { sportsbook: "BetMGM", line: 24.5, over: -102, under: -118 }] },
  { id: "p9", playerId: "ae1", playerName: "Anthony Edwards", teamAbbr: "MIN", stat: "Points", line: 25.5, gamesPlayed: 55, sport: "NBA", hitRate: calcHitRate(25.8, 25.5), hitRateLast10: calcHitRate(27.5, 25.5), sportsbooks: [{ sportsbook: "FanDuel", line: 25.5, over: -112, under: -108 }, { sportsbook: "DraftKings", line: 26.0, over: -105, under: -115 }, { sportsbook: "Fanatics", line: 25.5, over: -110, under: -110 }, { sportsbook: "BetMGM", line: 25.5, over: -115, under: -105 }] },
  // NCAAB props
  { id: "cp1", playerId: "jb_aub", playerName: "Johni Broome", teamAbbr: "AUB", stat: "Points", line: 18.5, gamesPlayed: 28, sport: "NCAAB", hitRate: calcHitRate(18.2, 18.5), hitRateLast10: calcHitRate(19.5, 18.5), sportsbooks: [{ sportsbook: "FanDuel", line: 18.5, over: -108, under: -112 }, { sportsbook: "DraftKings", line: 18.5, over: -110, under: -110 }, { sportsbook: "Fanatics", line: 18.0, over: -115, under: -105 }, { sportsbook: "BetMGM", line: 19.0, over: -105, under: -115 }] },
  { id: "cp2", playerId: "jb_aub", playerName: "Johni Broome", teamAbbr: "AUB", stat: "Rebounds", line: 11.5, gamesPlayed: 28, sport: "NCAAB", hitRate: calcHitRate(11.5, 11.5), hitRateLast10: calcHitRate(12.1, 11.5), sportsbooks: [{ sportsbook: "FanDuel", line: 11.5, over: -110, under: -110 }, { sportsbook: "DraftKings", line: 11.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 12.0, over: -105, under: -115 }, { sportsbook: "BetMGM", line: 11.5, over: -112, under: -108 }] },
  { id: "cp3", playerId: "mc_ala", playerName: "Mark Sears", teamAbbr: "BAMA", stat: "Points", line: 19.5, gamesPlayed: 27, sport: "NCAAB", hitRate: calcHitRate(19.8, 19.5), hitRateLast10: calcHitRate(21.2, 19.5), sportsbooks: [{ sportsbook: "FanDuel", line: 19.5, over: -112, under: -108 }, { sportsbook: "DraftKings", line: 20.0, over: -105, under: -115 }, { sportsbook: "Fanatics", line: 19.5, over: -110, under: -110 }, { sportsbook: "BetMGM", line: 19.5, over: -108, under: -112 }] },
  { id: "cp4", playerId: "cc_duk", playerName: "Cooper Flagg", teamAbbr: "DUKE", stat: "Points", line: 19.5, gamesPlayed: 28, sport: "NCAAB", hitRate: calcHitRate(20.1, 19.5), hitRateLast10: calcHitRate(22.5, 19.5), sportsbooks: [{ sportsbook: "FanDuel", line: 19.5, over: -115, under: -105 }, { sportsbook: "DraftKings", line: 20.0, over: -110, under: -110 }, { sportsbook: "Fanatics", line: 19.5, over: -112, under: -108 }, { sportsbook: "BetMGM", line: 20.5, over: -105, under: -115 }] },
  { id: "cp5", playerId: "cc_duk", playerName: "Cooper Flagg", teamAbbr: "DUKE", stat: "Rebounds", line: 8.5, gamesPlayed: 28, sport: "NCAAB", hitRate: calcHitRate(8.5, 8.5), hitRateLast10: calcHitRate(9.2, 8.5), sportsbooks: [{ sportsbook: "FanDuel", line: 8.5, over: -110, under: -110 }, { sportsbook: "DraftKings", line: 8.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 8.5, over: -112, under: -108 }, { sportsbook: "BetMGM", line: 8.0, over: -118, under: -102 }] },
  { id: "cp6", playerId: "rj_unc", playerName: "RJ Davis", teamAbbr: "UNC", stat: "Points", line: 18.5, gamesPlayed: 27, sport: "NCAAB", hitRate: calcHitRate(18.5, 18.5), hitRateLast10: calcHitRate(19.8, 18.5), sportsbooks: [{ sportsbook: "FanDuel", line: 18.5, over: -110, under: -110 }, { sportsbook: "DraftKings", line: 18.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 18.0, over: -115, under: -105 }, { sportsbook: "BetMGM", line: 19.0, over: -105, under: -115 }] },
  ...nflProps,
  ...mlbProps,
  ...nhlProps,
];

// ===================== HELPERS =====================

export function getGamesBySport(sport: Sport): Game[] {
  return allGames.filter(g => g.sport === sport);
}

export function getPlayersBySport(sport: Sport): Player[] {
  return allPlayers.filter(p => p.sport === sport);
}

export function getTeamsBySport(sport: Sport): Team[] {
  return allTeams.filter(t => t.sport === sport);
}

export function getPropsBySport(sport: Sport): PropLine[] {
  return propLines.filter(p => p.sport === sport);
}

export function getPropsForGame(gameId: string): PropLine[] {
  const game = allGames.find(g => g.id === gameId);
  if (!game) return [];
  const teamAbbrs = [game.homeTeam.abbreviation, game.awayTeam.abbreviation];
  return propLines.filter(p => teamAbbrs.includes(p.teamAbbr));
}

export function getPlayer(playerId: string): Player | undefined {
  return allPlayers.find(p => p.id === playerId);
}

export function getTeam(teamId: string): Team | undefined {
  return allTeams.find(t => t.id === teamId);
}

export function getPropsForPlayer(playerId: string): PropLine[] {
  return propLines.filter(p => p.playerId === playerId);
}

export function getMatchupHistory(team1Id: string, team2Id: string): MatchupHistory | undefined {
  return matchupHistories.find(
    m => (m.team1Id === team1Id && m.team2Id === team2Id) || (m.team1Id === team2Id && m.team2Id === team1Id)
  );
}

export function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

// ===================== INJURY REPORTS =====================
export const injuries: Injury[] = [
  // NBA
  { player: "Joel Embiid", teamAbbr: "PHI", status: "Out", injury: "Left knee meniscus", returnDate: "TBD" },
  { player: "Kawhi Leonard", teamAbbr: "LAC", status: "Out", injury: "Right knee inflammation", returnDate: "Indefinite" },
  { player: "Ja Morant", teamAbbr: "MEM", status: "Day-to-Day", injury: "Right shoulder soreness" },
  { player: "Paolo Banchero", teamAbbr: "ORL", status: "Questionable", injury: "Torn right oblique" },
  { player: "Chet Holmgren", teamAbbr: "OKC", status: "Out", injury: "Right hip fracture", returnDate: "Late Feb" },
  // NFL
  { player: "Chris Jones", teamAbbr: "KC", status: "Questionable", injury: "Knee" },
  { player: "Tua Tagovailoa", teamAbbr: "MIA", status: "Out", injury: "Concussion", returnDate: "TBD" },
  { player: "Nick Bosa", teamAbbr: "SF", status: "Probable", injury: "Oblique" },
  // NCAAB
  { player: "Mark Sears", teamAbbr: "ALA", status: "Probable", injury: "Ankle sprain" },
  { player: "Johni Broome", teamAbbr: "AUB", status: "Day-to-Day", injury: "Left ankle" },
  // MLB
  { player: "Mike Trout", teamAbbr: "LAA", status: "Out", injury: "Torn meniscus", returnDate: "May" },
  { player: "Ronald Acuña Jr.", teamAbbr: "ATL", status: "Out", injury: "Torn ACL", returnDate: "2025" },
  // NHL
  { player: "Gabriel Landeskog", teamAbbr: "COL", status: "Out", injury: "Knee surgery", returnDate: "Indefinite" },
  { player: "Kaapo Kakko", teamAbbr: "NYR", status: "Day-to-Day", injury: "Upper body" },
];

// ===================== INJURY HISTORY =====================
export const injuryHistories: PlayerInjuryHistory[] = [
  // NBA
  {
    playerId: "jt0", playerName: "Jayson Tatum", teamAbbr: "BOS",
    history: [
      { date: "Dec 2024", injury: "Ankle sprain", missedGames: 3, severity: "Minor", bodyPart: "Ankle" },
      { date: "Mar 2024", injury: "Knee tendinitis", missedGames: 5, severity: "Moderate", bodyPart: "Knee" },
      { date: "Nov 2023", injury: "Groin strain", missedGames: 2, severity: "Minor", bodyPart: "Groin" },
    ],
  },
  {
    playerId: "jb30", playerName: "Jalen Brunson", teamAbbr: "NYK",
    history: [
      { date: "Jan 2025", injury: "Hand contusion", missedGames: 1, severity: "Minor", bodyPart: "Hand" },
      { date: "Apr 2024", injury: "Knee injury (playoffs)", missedGames: 4, severity: "Moderate", bodyPart: "Knee" },
      { date: "Feb 2024", injury: "Quad strain", missedGames: 3, severity: "Minor", bodyPart: "Quad" },
    ],
  },
  {
    playerId: "ga34", playerName: "Giannis Antetokounmpo", teamAbbr: "MIL",
    history: [
      { date: "Jan 2025", injury: "Calf strain", missedGames: 7, severity: "Moderate", bodyPart: "Calf" },
      { date: "Nov 2024", injury: "Knee soreness", missedGames: 3, severity: "Minor", bodyPart: "Knee" },
      { date: "Apr 2024", injury: "Achilles strain", missedGames: 10, severity: "Major", bodyPart: "Achilles" },
      { date: "Jan 2024", injury: "Hamstring tightness", missedGames: 2, severity: "Minor", bodyPart: "Hamstring" },
    ],
  },
  {
    playerId: "lj23", playerName: "LeBron James", teamAbbr: "LAL",
    history: [
      { date: "Feb 2025", injury: "Foot soreness", missedGames: 2, severity: "Minor", bodyPart: "Foot" },
      { date: "Dec 2024", injury: "Ankle sprain", missedGames: 4, severity: "Moderate", bodyPart: "Ankle" },
      { date: "Mar 2024", injury: "Knee tendinitis", missedGames: 3, severity: "Minor", bodyPart: "Knee" },
      { date: "Feb 2023", injury: "Foot tendon injury", missedGames: 15, severity: "Major", bodyPart: "Foot" },
    ],
  },
  {
    playerId: "sga2", playerName: "Shai Gilgeous-Alexander", teamAbbr: "OKC",
    history: [
      { date: "Nov 2024", injury: "Hip contusion", missedGames: 1, severity: "Minor", bodyPart: "Hip" },
      { date: "Jan 2024", injury: "Rest / load management", missedGames: 2, severity: "Minor", bodyPart: "General" },
    ],
  },
  {
    playerId: "nj15", playerName: "Nikola Jokic", teamAbbr: "DEN",
    history: [
      { date: "Dec 2024", injury: "Rest / load management", missedGames: 1, severity: "Minor", bodyPart: "General" },
    ],
  },
  // NCAAB
  {
    playerId: "jb_aub", playerName: "Johni Broome", teamAbbr: "AUB",
    history: [
      { date: "Feb 2025", injury: "Left ankle sprain", missedGames: 2, severity: "Minor", bodyPart: "Ankle" },
      { date: "Dec 2024", injury: "Knee contusion", missedGames: 1, severity: "Minor", bodyPart: "Knee" },
    ],
  },
  {
    playerId: "cc_duk", playerName: "Cooper Flagg", teamAbbr: "DUKE",
    history: [
      { date: "Jan 2025", injury: "Ankle tweak", missedGames: 1, severity: "Minor", bodyPart: "Ankle" },
    ],
  },
  {
    playerId: "mc_ala", playerName: "Mark Sears", teamAbbr: "BAMA",
    history: [
      { date: "Feb 2025", injury: "Ankle sprain", missedGames: 0, severity: "Minor", bodyPart: "Ankle" },
      { date: "Nov 2024", injury: "Shoulder soreness", missedGames: 1, severity: "Minor", bodyPart: "Shoulder" },
    ],
  },
];

export const getInjuryHistory = (playerId: string) => injuryHistories.find(h => h.playerId === playerId);
