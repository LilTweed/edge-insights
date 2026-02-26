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

// ===================== MOCK TEAMS =====================

function mkAvg(pts: number, reb: number, ast: number, fg: number, tp: number, ft: number): SeasonAverages {
  return { points: pts, rebounds: reb, assists: ast, steals: +(pts * 0.04).toFixed(1), blocks: +(reb * 0.08).toFixed(1), turnovers: +(ast * 0.35).toFixed(1), minutes: 34, fgPct: fg, threePct: tp, ftPct: ft };
}

function mkTeam(id: string, name: string, abbr: string, city: string, record: string, conf: string, div: string, sport: Sport, stats: TeamStats): Team {
  return { id, name, abbreviation: abbr, city, record, conference: conf, division: div, sport, stats };
}

function mkTeamStats(ppg: number, opp: number, rpg = 44, apg = 25, fg = 46.5, tp = 36, ft = 78, to = 13, stl = 7, blk = 5, extra?: Partial<TeamStats>): TeamStats {
  return { ppg, oppPpg: opp, rpg, apg, fgPct: fg, threePct: tp, ftPct: ft, turnovers: to, steals: stl, blocks: blk, ...extra };
}

export const nbaTeams: Team[] = [
  mkTeam("lal","Los Angeles Lakers","LAL","Los Angeles","42-30","Western","Pacific","NBA", mkTeamStats(114.2,112.5)),
  mkTeam("bos","Boston Celtics","BOS","Boston","54-18","Eastern","Atlantic","NBA", mkTeamStats(120.1,108.3,46,27,48.5,39.2,80)),
  mkTeam("gsw","Golden State Warriors","GSW","San Francisco","38-34","Western","Pacific","NBA", mkTeamStats(117.5,115.8,43,28,47.2,38.5,79)),
  mkTeam("den","Denver Nuggets","DEN","Denver","50-22","Western","Northwest","NBA", mkTeamStats(115.8,110.2,44,27,48,36.8,79)),
  mkTeam("dal","Dallas Mavericks","DAL","Dallas","43-29","Western","Southwest","NBA", mkTeamStats(118.3,114.5,42,25,47.5,37,80)),
  mkTeam("mil","Milwaukee Bucks","MIL","Milwaukee","46-26","Eastern","Central","NBA", mkTeamStats(119.5,113.8,46,26,47.8,36.5,78)),
  mkTeam("okc","Oklahoma City Thunder","OKC","Oklahoma City","55-17","Western","Northwest","NBA", mkTeamStats(121.2,108.1,45,27,49,38,81)),
  mkTeam("cle","Cleveland Cavaliers","CLE","Cleveland","48-24","Eastern","Central","NBA", mkTeamStats(116.8,109.5,44,26,47,37.5,79)),
  mkTeam("phx","Phoenix Suns","PHX","Phoenix","44-28","Western","Pacific","NBA", mkTeamStats(115.2,113.8,43,25,46.8,36.2,80)),
];

export const ncaabTeams: Team[] = [];
export const ncaafTeams: Team[] = [];

const nflTeams: Team[] = [
  mkTeam("kc","Kansas City Chiefs","KC","Kansas City","14-3","AFC","West","NFL", mkTeamStats(27.5,18.2,0,0,0,0,0,0,0,0,{ypg:375,rushYpg:120,passYpg:255,takeaways:28})),
  mkTeam("buf","Buffalo Bills","BUF","Buffalo","13-4","AFC","East","NFL", mkTeamStats(28.8,20.5,0,0,0,0,0,0,0,0,{ypg:390,rushYpg:135,passYpg:255,takeaways:25})),
  mkTeam("bal","Baltimore Ravens","BAL","Baltimore","13-4","AFC","North","NFL", mkTeamStats(30.2,19.8,0,0,0,0,0,0,0,0,{ypg:405,rushYpg:180,passYpg:225,takeaways:30})),
  mkTeam("mia","Miami Dolphins","MIA","Miami","9-8","AFC","East","NFL", mkTeamStats(24.5,23.2,0,0,0,0,0,0,0,0,{ypg:365,rushYpg:110,passYpg:255,takeaways:18})),
  mkTeam("cin","Cincinnati Bengals","CIN","Cincinnati","10-7","AFC","North","NFL", mkTeamStats(25.8,22.5,0,0,0,0,0,0,0,0,{ypg:355,rushYpg:100,passYpg:255,takeaways:22})),
  mkTeam("ari","Arizona Cardinals","ARI","Arizona","7-10","NFC","West","NFL", mkTeamStats(21.2,25.8,0,0,0,0,0,0,0,0,{ypg:320,rushYpg:105,passYpg:215,takeaways:15})),
];

const mlbTeams: Team[] = [
  mkTeam("nyy","New York Yankees","NYY","New York","95-67","AL","East","MLB", mkTeamStats(5.2,3.8)),
  mkTeam("lad","Los Angeles Dodgers","LAD","Los Angeles","98-64","NL","West","MLB", mkTeamStats(5.5,3.5)),
  mkTeam("laa","Los Angeles Angels","LAA","Anaheim","73-89","AL","West","MLB", mkTeamStats(4.2,4.8)),
  mkTeam("atl","Atlanta Braves","ATL","Atlanta","88-74","NL","East","MLB", mkTeamStats(4.9,3.9)),
];

const nhlTeams: Team[] = [
  mkTeam("edm","Edmonton Oilers","EDM","Edmonton","49-25-8","Western","Pacific","NHL", mkTeamStats(3.5,2.8)),
  mkTeam("tbl","Tampa Bay Lightning","TBL","Tampa Bay","46-28-8","Eastern","Atlantic","NHL", mkTeamStats(3.3,2.9)),
  mkTeam("tor","Toronto Maple Leafs","TOR","Toronto","48-26-8","Eastern","Atlantic","NHL", mkTeamStats(3.4,2.7)),
  mkTeam("col","Colorado Avalanche","COL","Denver","50-24-8","Western","Central","NHL", mkTeamStats(3.6,2.6)),
  mkTeam("bos2","Boston Bruins","BOS","Boston","47-27-8","Eastern","Atlantic","NHL", mkTeamStats(3.2,2.5)),
];

const soccerTeams: Team[] = [
  mkTeam("mci","Manchester City","MCI","Manchester","28-5-5","Premier League","N/A","Soccer", mkTeamStats(2.5,0.8)),
  mkTeam("liv","Liverpool","LIV","Liverpool","26-7-5","Premier League","N/A","Soccer", mkTeamStats(2.3,0.9)),
  mkTeam("ars","Arsenal","ARS","London","27-5-6","Premier League","N/A","Soccer", mkTeamStats(2.2,0.7)),
  mkTeam("rma","Real Madrid","RMA","Madrid","28-4-6","La Liga","N/A","Soccer", mkTeamStats(2.4,0.8)),
];

export const allTeams: Team[] = [...nbaTeams, ...nflTeams, ...mlbTeams, ...nhlTeams, ...soccerTeams];

// ===================== MOCK PLAYERS =====================

function mkPlayer(id: string, name: string, team: string, abbr: string, pos: string, num: number, sport: Sport, gp: number, sa: SeasonAverages): Player {
  const l10: SeasonAverages = { ...sa, points: +(sa.points * (0.9 + Math.abs(id.charCodeAt(0) % 20) / 100)).toFixed(1), rebounds: +(sa.rebounds * (0.95 + Math.abs(id.charCodeAt(1) % 10) / 100)).toFixed(1), assists: +(sa.assists * (0.92 + Math.abs(id.charCodeAt(0) % 15) / 100)).toFixed(1) };
  const l5: SeasonAverages = { ...sa, points: +(sa.points * (0.85 + Math.abs(id.charCodeAt(1) % 30) / 100)).toFixed(1), rebounds: +(sa.rebounds * (0.9 + Math.abs(id.charCodeAt(0) % 20) / 100)).toFixed(1), assists: +(sa.assists * (0.88 + Math.abs(id.charCodeAt(1) % 25) / 100)).toFixed(1) };
  return { id, name, team, teamAbbr: abbr, position: pos, number: num, sport, stats: { gamesPlayed: gp }, seasonAverages: sa, last10: l10, last5: l5 };
}

export const allPlayers: Player[] = [
  // NBA
  mkPlayer("lb23","LeBron James","Los Angeles Lakers","LAL","SF",23,"NBA",55, mkAvg(25.8,7.9,8.1,50.5,35.2,75)),
  mkPlayer("ad3","Anthony Davis","Los Angeles Lakers","LAL","PF/C",3,"NBA",50, mkAvg(26.2,12.1,3.5,55.8,28.5,80)),
  mkPlayer("jt0","Jayson Tatum","Boston Celtics","BOS","SF",0,"NBA",52, mkAvg(28.1,8.8,4.9,47.2,37.5,85)),
  mkPlayer("jb7","Jaylen Brown","Boston Celtics","BOS","SG",7,"NBA",48, mkAvg(23.5,5.8,3.8,49.1,35.8,74)),
  mkPlayer("sc30","Steph Curry","Golden State Warriors","GSW","PG",30,"NBA",50, mkAvg(29.2,5.5,6.2,47.5,41.2,91)),
  mkPlayer("nj15","Nikola Jokic","Denver Nuggets","DEN","C",15,"NBA",54, mkAvg(27.1,13.2,10.1,58.2,35.5,82)),
  mkPlayer("le11","Luka Doncic","Dallas Mavericks","DAL","PG",77,"NBA",45, mkAvg(33.5,9.2,9.8,48.5,36.2,78)),
  mkPlayer("ga34","Giannis Antetokounmpo","Milwaukee Bucks","MIL","PF",34,"NBA",51, mkAvg(31.2,12.1,5.8,61.2,28.5,68)),
  mkPlayer("se1","Shai Gilgeous-Alexander","Oklahoma City Thunder","OKC","PG",2,"NBA",53, mkAvg(32.1,5.5,6.5,53.5,35.8,87)),
  mkPlayer("dm25","Donovan Mitchell","Cleveland Cavaliers","CLE","SG",45,"NBA",49, mkAvg(25.2,4.5,5.1,46.8,37.2,86)),
  mkPlayer("kd35","Kevin Durant","Phoenix Suns","PHX","SF",35,"NBA",40, mkAvg(28.5,6.5,5.2,52.5,40.2,89)),

  // NFL
  mkPlayer("pm15","Patrick Mahomes","Kansas City Chiefs","KC","QB",15,"NFL",17, mkAvg(0,0,0,0,0,0)),
  mkPlayer("ja17","Josh Allen","Buffalo Bills","BUF","QB",17,"NFL",16, mkAvg(0,0,0,0,0,0)),
  mkPlayer("lj8","Lamar Jackson","Baltimore Ravens","BAL","QB",8,"NFL",16, mkAvg(0,0,0,0,0,0)),
  mkPlayer("jh10","Tyreek Hill","Miami Dolphins","MIA","WR",10,"NFL",15, mkAvg(0,0,0,0,0,0)),
  mkPlayer("dh4","Derrick Henry","Baltimore Ravens","BAL","RB",22,"NFL",16, mkAvg(0,0,0,0,0,0)),
  mkPlayer("cm1","Ja'Marr Chase","Cincinnati Bengals","CIN","WR",1,"NFL",16, mkAvg(0,0,0,0,0,0)),
  mkPlayer("jj99","J.J. Watt","Arizona Cardinals","ARI","DE",99,"NFL",14, mkAvg(0,0,0,0,0,0)),

  // MLB
  mkPlayer("aj99","Aaron Judge","New York Yankees","NYY","RF",99,"MLB",120, mkAvg(0,0,0,0,0,0)),
  mkPlayer("so17","Shohei Ohtani","Los Angeles Dodgers","LAD","DH",17,"MLB",130, mkAvg(0,0,0,0,0,0)),
  mkPlayer("mt27","Mike Trout","Los Angeles Angels","LAA","CF",27,"MLB",80, mkAvg(0,0,0,0,0,0)),
  mkPlayer("gc28","Gerrit Cole","New York Yankees","NYY","SP",45,"MLB",25, mkAvg(0,0,0,0,0,0)),
  mkPlayer("ra45","Spencer Strider","Atlanta Braves","ATL","SP",65,"MLB",22, mkAvg(0,0,0,0,0,0)),
  mkPlayer("fs27","Freddie Freeman","Los Angeles Dodgers","LAD","1B",5,"MLB",135, mkAvg(0,0,0,0,0,0)),
  mkPlayer("ra22","Ronald Acuna Jr.","Atlanta Braves","ATL","RF",13,"MLB",100, mkAvg(0,0,0,0,0,0)),

  // NHL
  mkPlayer("cm97","Connor McDavid","Edmonton Oilers","EDM","C",97,"NHL",60, mkAvg(0,0,0,0,0,0)),
  mkPlayer("nk86","Nikita Kucherov","Tampa Bay Lightning","TBL","RW",86,"NHL",58, mkAvg(0,0,0,0,0,0)),
  mkPlayer("am34","Auston Matthews","Toronto Maple Leafs","TOR","C",34,"NHL",55, mkAvg(0,0,0,0,0,0)),
  mkPlayer("lm8","Cale Makar","Colorado Avalanche","COL","D",8,"NHL",56, mkAvg(0,0,0,0,0,0)),
  mkPlayer("dk71","David Pastrnak","Boston Bruins","BOS","RW",88,"NHL",57, mkAvg(0,0,0,0,0,0)),

  // Soccer
  mkPlayer("eh9","Erling Haaland","Manchester City","MCI","ST",9,"Soccer",28, mkAvg(0,0,0,0,0,0)),
  mkPlayer("ms11","Mohamed Salah","Liverpool","LIV","RW",11,"Soccer",30, mkAvg(0,0,0,0,0,0)),
  mkPlayer("bs7","Bukayo Saka","Arsenal","ARS","RW",7,"Soccer",27, mkAvg(0,0,0,0,0,0)),
  mkPlayer("km10","Kylian Mbappe","Real Madrid","RMA","ST",10,"Soccer",25, mkAvg(0,0,0,0,0,0)),

  // UFC
  mkPlayer("im1","Islam Makhachev","UFC","UFC","LW",0,"UFC",5, mkAvg(0,0,0,0,0,0)),
  mkPlayer("co1","Charles Oliveira","UFC","UFC","LW",0,"UFC",5, mkAvg(0,0,0,0,0,0)),
  mkPlayer("aj1","Alex Pereira","UFC","UFC","LHW",0,"UFC",4, mkAvg(0,0,0,0,0,0)),
  mkPlayer("im2","Israel Adesanya","UFC","UFC","MW",0,"UFC",4, mkAvg(0,0,0,0,0,0)),
];

export const allGames: Game[] = [];

// ===================== MOCK INJURIES =====================

export const injuries: Injury[] = [
  { player: "Anthony Davis", teamAbbr: "LAL", status: "Questionable", injury: "Right knee soreness" },
  { player: "Luka Doncic", teamAbbr: "DAL", status: "Out", injury: "Left calf strain" },
  { player: "Kevin Durant", teamAbbr: "PHX", status: "Day-to-Day", injury: "Left ankle sprain" },
  { player: "Mike Trout", teamAbbr: "LAA", status: "Out", injury: "Left knee meniscus surgery" },
  { player: "Derrick Henry", teamAbbr: "BAL", status: "Probable", injury: "Right hamstring tightness" },
  { player: "David Pastrnak", teamAbbr: "BOS", status: "Questionable", injury: "Upper body" },
  { player: "Spencer Strider", teamAbbr: "ATL", status: "Out", injury: "Right elbow UCL" },
  { player: "Jaylen Brown", teamAbbr: "BOS", status: "Probable", injury: "Left hip flexor" },
  { player: "Steph Curry", teamAbbr: "GSW", status: "Day-to-Day", injury: "Right ankle soreness" },
  { player: "Erling Haaland", teamAbbr: "MCI", status: "Probable", injury: "Foot contusion" },
];

export const injuryHistories: PlayerInjuryHistory[] = [];

// ===================== MOCK MATCHUP HISTORIES =====================

export const matchupHistories: MatchupHistory[] = [
  { team1Id: "lal", team2Id: "bos", allTime: { wins: 65, losses: 55 }, last5: { team1Wins: 2, team2Wins: 3, results: [
    { date: "2025-12-25", team1Score: 108, team2Score: 115, location: "TD Garden" },
    { date: "2025-02-01", team1Score: 120, team2Score: 112, location: "Crypto.com Arena" },
    { date: "2024-12-25", team1Score: 105, team2Score: 118, location: "TD Garden" },
    { date: "2024-03-15", team1Score: 110, team2Score: 108, location: "Crypto.com Arena" },
    { date: "2024-01-28", team1Score: 98, team2Score: 114, location: "TD Garden" },
  ]}, last10: { team1Wins: 4, team2Wins: 6 }, streak: "BOS W2", avgScore: { team1: 108.2, team2: 113.4 }, lastMeeting: "Dec 25, 2025" },
  { team1Id: "den", team2Id: "dal", allTime: { wins: 42, losses: 38 }, last5: { team1Wins: 3, team2Wins: 2, results: [
    { date: "2025-11-15", team1Score: 122, team2Score: 118, location: "Ball Arena" },
    { date: "2025-03-02", team1Score: 115, team2Score: 120, location: "American Airlines Center" },
    { date: "2025-01-10", team1Score: 128, team2Score: 110, location: "Ball Arena" },
    { date: "2024-11-20", team1Score: 105, team2Score: 112, location: "American Airlines Center" },
    { date: "2024-04-05", team1Score: 118, team2Score: 108, location: "Ball Arena" },
  ]}, last10: { team1Wins: 6, team2Wins: 4 }, streak: "DEN W1", avgScore: { team1: 117.6, team2: 113.6 }, lastMeeting: "Nov 15, 2025" },
  { team1Id: "okc", team2Id: "mil", allTime: { wins: 28, losses: 25 }, last5: { team1Wins: 3, team2Wins: 2, results: [
    { date: "2025-10-28", team1Score: 125, team2Score: 118, location: "Paycom Center" },
    { date: "2025-02-14", team1Score: 112, team2Score: 115, location: "Fiserv Forum" },
    { date: "2024-12-01", team1Score: 130, team2Score: 122, location: "Paycom Center" },
    { date: "2024-03-25", team1Score: 108, team2Score: 110, location: "Fiserv Forum" },
    { date: "2024-01-05", team1Score: 115, team2Score: 105, location: "Paycom Center" },
  ]}, last10: { team1Wins: 6, team2Wins: 4 }, streak: "OKC W1", avgScore: { team1: 118, team2: 114 }, lastMeeting: "Oct 28, 2025" },
  { team1Id: "kc", team2Id: "buf", allTime: { wins: 32, losses: 30 }, last5: { team1Wins: 4, team2Wins: 1, results: [
    { date: "2025-01-19", team1Score: 32, team2Score: 29, location: "Arrowhead Stadium" },
    { date: "2024-11-03", team1Score: 27, team2Score: 24, location: "Highmark Stadium" },
    { date: "2024-01-21", team1Score: 27, team2Score: 24, location: "Highmark Stadium" },
    { date: "2023-12-10", team1Score: 17, team2Score: 20, location: "Arrowhead Stadium" },
    { date: "2022-01-23", team1Score: 42, team2Score: 36, location: "Arrowhead Stadium" },
  ]}, last10: { team1Wins: 7, team2Wins: 3 }, streak: "KC W3", avgScore: { team1: 29, team2: 26.6 }, lastMeeting: "Jan 19, 2025" },
];

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
