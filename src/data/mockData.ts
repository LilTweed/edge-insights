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

// ===================== MOCK PROP LINES =====================

const sbooks: Sportsbook[] = ["FanDuel", "DraftKings", "BetMGM", "Bovada"];

function mkSb(line: number, overBase: number): SportsbookLine[] {
  return sbooks.map((sb, i) => ({
    sportsbook: sb,
    line: +(line + (i % 2 === 0 ? 0 : 0.5)).toFixed(1),
    over: overBase - (i * 2),
    under: -(overBase - (i * 2)) + (i % 2 === 0 ? -10 : 10),
  }));
}

function mkProp(id: string, playerId: string, name: string, team: string, stat: string, line: number, sport: Sport, hitRate: number, hitRateL10: number, gp: number): PropLine {
  return { id, playerId, playerName: name, teamAbbr: team, stat, line, sport, sportsbooks: mkSb(line, -110), hitRate, hitRateLast10: hitRateL10, gamesPlayed: gp };
}

export const propLines: PropLine[] = [
  // NBA
  mkProp("p1","lb23","LeBron James","LAL","Points",24.5,"NBA",62,70,55),
  mkProp("p2","lb23","LeBron James","LAL","Assists",7.5,"NBA",55,60,55),
  mkProp("p3","lb23","LeBron James","LAL","Rebounds",7.5,"NBA",58,50,55),
  mkProp("p4","ad3","Anthony Davis","LAL","Points",25.5,"NBA",57,60,50),
  mkProp("p5","ad3","Anthony Davis","LAL","Rebounds",11.5,"NBA",64,70,50),
  mkProp("p6","jt0","Jayson Tatum","BOS","Points",27.5,"NBA",60,65,52),
  mkProp("p7","jt0","Jayson Tatum","BOS","Rebounds",8.5,"NBA",53,50,52),
  mkProp("p8","jb7","Jaylen Brown","BOS","Points",22.5,"NBA",58,55,48),
  mkProp("p9","sc30","Steph Curry","GSW","Points",28.5,"NBA",55,45,50),
  mkProp("p10","sc30","Steph Curry","GSW","3-Pointers Made",4.5,"NBA",48,40,50),
  mkProp("p11","nj15","Nikola Jokic","DEN","Points",26.5,"NBA",63,70,54),
  mkProp("p12","nj15","Nikola Jokic","DEN","Rebounds",12.5,"NBA",60,65,54),
  mkProp("p13","nj15","Nikola Jokic","DEN","Assists",9.5,"NBA",58,55,54),
  mkProp("p14","le11","Luka Doncic","DAL","Points",32.5,"NBA",52,55,45),
  mkProp("p15","le11","Luka Doncic","DAL","Assists",8.5,"NBA",56,60,45),
  mkProp("p16","ga34","Giannis Antetokounmpo","MIL","Points",30.5,"NBA",59,65,51),
  mkProp("p17","ga34","Giannis Antetokounmpo","MIL","Rebounds",11.5,"NBA",62,60,51),
  mkProp("p18","se1","Shai Gilgeous-Alexander","OKC","Points",31.5,"NBA",61,70,53),
  mkProp("p19","dm25","Donovan Mitchell","CLE","Points",24.5,"NBA",57,50,49),
  mkProp("p20","kd35","Kevin Durant","PHX","Points",27.5,"NBA",60,55,40),

  // NFL
  mkProp("p30","pm15","Patrick Mahomes","KC","Pass Yards",275.5,"NFL",58,60,17),
  mkProp("p31","pm15","Patrick Mahomes","KC","Pass TDs",1.5,"NFL",76,80,17),
  mkProp("p32","ja17","Josh Allen","BUF","Pass Yards",265.5,"NFL",55,50,16),
  mkProp("p33","ja17","Josh Allen","BUF","Rush Yards",35.5,"NFL",52,60,16),
  mkProp("p34","lj8","Lamar Jackson","BAL","Pass Yards",225.5,"NFL",53,55,16),
  mkProp("p35","lj8","Lamar Jackson","BAL","Rush Yards",65.5,"NFL",60,70,16),
  mkProp("p36","jh10","Tyreek Hill","MIA","Rec Yards",75.5,"NFL",52,40,15),
  mkProp("p37","dh4","Derrick Henry","BAL","Rush Yards",85.5,"NFL",55,60,16),
  mkProp("p38","cm1","Ja'Marr Chase","CIN","Rec Yards",80.5,"NFL",54,65,16),
  mkProp("p39","jj99","J.J. Watt","ARI","Sacks",0.5,"NFL",35,30,14),

  // MLB
  mkProp("p40","aj99","Aaron Judge","NYY","Total Bases",1.5,"MLB",68,75,120),
  mkProp("p41","aj99","Aaron Judge","NYY","HRs",0.5,"MLB",38,45,120),
  mkProp("p42","so17","Shohei Ohtani","LAD","Total Bases",1.5,"MLB",65,70,130),
  mkProp("p43","so17","Shohei Ohtani","LAD","HRs",0.5,"MLB",35,40,130),
  mkProp("p44","mt27","Mike Trout","LAA","Hits",0.5,"MLB",70,65,80),
  mkProp("p45","gc28","Gerrit Cole","NYY","Strikeouts",7.5,"MLB",55,60,25),
  mkProp("p46","ra45","Spencer Strider","ATL","Strikeouts",8.5,"MLB",52,55,22),
  mkProp("p47","fs27","Freddie Freeman","LAD","Hits",1.5,"MLB",48,55,135),
  mkProp("p48","ra22","Ronald Acuna Jr.","ATL","Stolen Bases",0.5,"MLB",45,50,100),

  // NHL
  mkProp("p50","cm97","Connor McDavid","EDM","Points",1.5,"NHL",55,60,60),
  mkProp("p51","cm97","Connor McDavid","EDM","Assists",0.5,"NHL",68,75,60),
  mkProp("p52","nk86","Nikita Kucherov","TBL","Points",1.5,"NHL",52,55,58),
  mkProp("p53","am34","Auston Matthews","TOR","Goals",0.5,"NHL",48,55,55),
  mkProp("p54","am34","Auston Matthews","TOR","Shots on Goal",3.5,"NHL",60,65,55),
  mkProp("p55","lm8","Cale Makar","COL","Points",0.5,"NHL",62,60,56),
  mkProp("p56","dk71","David Pastrnak","BOS","Goals",0.5,"NHL",45,50,57),

  // Soccer
  mkProp("p60","eh9","Erling Haaland","MCI","Shots on Target",2.5,"Soccer",52,60,28),
  mkProp("p61","eh9","Erling Haaland","MCI","Goals",0.5,"Soccer",55,65,28),
  mkProp("p62","ms11","Mohamed Salah","LIV","Shots on Target",2.5,"Soccer",50,45,30),
  mkProp("p63","bs7","Bukayo Saka","ARS","Assists",0.5,"Soccer",40,50,27),
  mkProp("p64","km10","Kylian Mbappe","RMA","Shots on Target",3.5,"Soccer",48,55,25),
  mkProp("p65","km10","Kylian Mbappe","RMA","Goals",0.5,"Soccer",52,60,25),

  // UFC
  mkProp("p70","im1","Islam Makhachev","UFC","Takedowns",2.5,"UFC",65,70,5),
  mkProp("p71","co1","Charles Oliveira","UFC","Sig. Strikes",45.5,"UFC",55,50,5),
  mkProp("p72","aj1","Alex Pereira","UFC","Sig. Strikes",35.5,"UFC",60,65,4),
  mkProp("p73","im2","Israel Adesanya","UFC","Sig. Strikes",50.5,"UFC",52,55,4),
];

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
