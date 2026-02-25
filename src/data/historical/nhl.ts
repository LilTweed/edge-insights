import { buildTeams, buildPlayers, type TeamDef, type PlayerDef } from './generator';

const T: TeamDef[] = [
  // Atlantic
  { id: "bos_h", name: "Bruins", abbr: "BOS", city: "Boston", conf: "Atlantic", baseWin: 0.58, basePpg: 3.2, baseOpp: 2.7, rivals: { TOR: [28,24], MTL: [30,22], FLA: [22,20] } },
  { id: "buf_h", name: "Sabres", abbr: "BUF", city: "Buffalo", conf: "Atlantic", baseWin: 0.40, basePpg: 2.7, baseOpp: 3.2, rivals: { TOR: [18,28], BOS: [18,26] } },
  { id: "det_h", name: "Red Wings", abbr: "DET", city: "Detroit", conf: "Atlantic", baseWin: 0.42, basePpg: 2.8, baseOpp: 3.1, rivals: { TOR: [20,24], BOS: [18,24] } },
  { id: "fla_h", name: "Panthers", abbr: "FLA", city: "Florida", conf: "Atlantic", baseWin: 0.58, basePpg: 3.4, baseOpp: 2.8, rivals: { TBL: [24,22], BOS: [20,22], TOR: [22,20] } },
  { id: "mtl", name: "Canadiens", abbr: "MTL", city: "Montreal", conf: "Atlantic", baseWin: 0.40, basePpg: 2.6, baseOpp: 3.2, rivals: { TOR: [22,28], BOS: [22,30] } },
  { id: "ott", name: "Senators", abbr: "OTT", city: "Ottawa", conf: "Atlantic", baseWin: 0.42, basePpg: 2.8, baseOpp: 3.1, rivals: { TOR: [20,24], MTL: [22,22] } },
  { id: "tbl", name: "Lightning", abbr: "TBL", city: "Tampa Bay", conf: "Atlantic", baseWin: 0.60, basePpg: 3.4, baseOpp: 2.7, rivals: { FLA: [22,24], BOS: [22,22] } },
  { id: "tor_h", name: "Maple Leafs", abbr: "TOR", city: "Toronto", conf: "Atlantic", baseWin: 0.55, basePpg: 3.2, baseOpp: 2.9, rivals: { BOS: [24,28], MTL: [28,22], FLA: [20,22] } },
  // Metropolitan
  { id: "car_h", name: "Hurricanes", abbr: "CAR", city: "Carolina", conf: "Metropolitan", baseWin: 0.58, basePpg: 3.2, baseOpp: 2.6, rivals: { NYR: [20,18], NJD: [22,18] } },
  { id: "cbj", name: "Blue Jackets", abbr: "CBJ", city: "Columbus", conf: "Metropolitan", baseWin: 0.40, basePpg: 2.7, baseOpp: 3.2, rivals: { PIT: [18,24], CAR: [16,22] } },
  { id: "njd", name: "Devils", abbr: "NJD", city: "New Jersey", conf: "Metropolitan", baseWin: 0.48, basePpg: 3.0, baseOpp: 3.0, rivals: { NYR: [22,24], NYI: [22,20] } },
  { id: "nyi", name: "Islanders", abbr: "NYI", city: "New York", conf: "Metropolitan", baseWin: 0.48, basePpg: 2.8, baseOpp: 2.9, rivals: { NYR: [22,24], NJD: [20,22] } },
  { id: "nyr", name: "Rangers", abbr: "NYR", city: "New York", conf: "Metropolitan", baseWin: 0.55, basePpg: 3.1, baseOpp: 2.7, rivals: { NJD: [24,22], NYI: [24,22], PIT: [22,20] } },
  { id: "phi_h", name: "Flyers", abbr: "PHI", city: "Philadelphia", conf: "Metropolitan", baseWin: 0.42, basePpg: 2.7, baseOpp: 3.1, rivals: { PIT: [18,24], NYR: [18,22] } },
  { id: "pit_h", name: "Penguins", abbr: "PIT", city: "Pittsburgh", conf: "Metropolitan", baseWin: 0.55, basePpg: 3.2, baseOpp: 2.8, rivals: { PHI: [24,18], CBJ: [24,18], WSH: [22,22] } },
  { id: "wsh_h", name: "Capitals", abbr: "WSH", city: "Washington", conf: "Metropolitan", baseWin: 0.52, basePpg: 3.1, baseOpp: 2.9, rivals: { PIT: [22,22], NYR: [20,22] } },
  // Central
  { id: "chi_h", name: "Blackhawks", abbr: "CHI", city: "Chicago", conf: "Central", baseWin: 0.38, basePpg: 2.6, baseOpp: 3.3, rivals: { STL: [20,26], NSH: [18,22] } },
  { id: "col_h", name: "Avalanche", abbr: "COL", city: "Colorado", conf: "Central", baseWin: 0.60, basePpg: 3.5, baseOpp: 2.7, rivals: { DAL: [22,20], STL: [24,20], MIN: [22,18] } },
  { id: "dal_h", name: "Stars", abbr: "DAL", city: "Dallas", conf: "Central", baseWin: 0.58, basePpg: 3.2, baseOpp: 2.7, rivals: { COL: [20,22], STL: [22,20] } },
  { id: "min_h", name: "Wild", abbr: "MIN", city: "Minnesota", conf: "Central", baseWin: 0.52, basePpg: 3.0, baseOpp: 2.8, rivals: { COL: [18,22], STL: [20,20] } },
  { id: "nsh", name: "Predators", abbr: "NSH", city: "Nashville", conf: "Central", baseWin: 0.52, basePpg: 2.9, baseOpp: 2.8, rivals: { DAL: [20,22], STL: [22,20] } },
  { id: "stl_h", name: "Blues", abbr: "STL", city: "St. Louis", conf: "Central", baseWin: 0.50, basePpg: 3.0, baseOpp: 2.9, rivals: { CHI: [26,20], COL: [20,24] } },
  { id: "wpg", name: "Jets", abbr: "WPG", city: "Winnipeg", conf: "Central", baseWin: 0.55, basePpg: 3.1, baseOpp: 2.8, rivals: { MIN: [22,20], COL: [18,22] } },
  { id: "uta_h", name: "Utah HC", abbr: "UTA", city: "Utah", conf: "Central", baseWin: 0.42, basePpg: 2.7, baseOpp: 3.1, rivals: { COL: [16,22], DAL: [16,20] } },
  // Pacific
  { id: "ana", name: "Ducks", abbr: "ANA", city: "Anaheim", conf: "Pacific", baseWin: 0.38, basePpg: 2.5, baseOpp: 3.3, rivals: { LAK: [20,24], SJS: [22,20] } },
  { id: "cgy", name: "Flames", abbr: "CGY", city: "Calgary", conf: "Pacific", baseWin: 0.48, basePpg: 2.9, baseOpp: 3.0, rivals: { EDM: [22,24], VAN: [22,20] } },
  { id: "edm", name: "Oilers", abbr: "EDM", city: "Edmonton", conf: "Pacific", baseWin: 0.58, basePpg: 3.4, baseOpp: 2.8, rivals: { CGY: [24,22], VAN: [24,18], FLA: [3,5] } },
  { id: "lak", name: "Kings", abbr: "LAK", city: "Los Angeles", conf: "Pacific", baseWin: 0.52, basePpg: 2.9, baseOpp: 2.8, rivals: { ANA: [24,20], SJS: [24,20] } },
  { id: "sjs", name: "Sharks", abbr: "SJS", city: "San Jose", conf: "Pacific", baseWin: 0.38, basePpg: 2.5, baseOpp: 3.3, rivals: { LAK: [20,24], ANA: [20,22] } },
  { id: "sea_h", name: "Kraken", abbr: "SEA", city: "Seattle", conf: "Pacific", baseWin: 0.48, basePpg: 3.0, baseOpp: 3.0, rivals: { VAN: [6,6], EDM: [4,6] } },
  { id: "van", name: "Canucks", abbr: "VAN", city: "Vancouver", conf: "Pacific", baseWin: 0.52, basePpg: 3.1, baseOpp: 2.9, rivals: { EDM: [18,24], CGY: [20,22] } },
  { id: "vgk", name: "Golden Knights", abbr: "VGK", city: "Vegas", conf: "Pacific", baseWin: 0.60, basePpg: 3.3, baseOpp: 2.7, rivals: { COL: [10,12], EDM: [8,10] } },
];

const P: PlayerDef[] = [
  { id: "mcdavid", name: "Connor McDavid", pos: "C", team: "Oilers", teamAbbr: "EDM", base: { goals: 40, assists: 72, points: 112, plusMinus: 15, penaltyMinutes: 24, shotsOnGoal: 265 } },
  { id: "draisaitl", name: "Leon Draisaitl", pos: "C", team: "Oilers", teamAbbr: "EDM", yrs: 10, base: { goals: 42, assists: 55, points: 97, plusMinus: 10, penaltyMinutes: 40, shotsOnGoal: 250 } },
  { id: "mackinnon", name: "Nathan MacKinnon", pos: "C", team: "Avalanche", teamAbbr: "COL", base: { goals: 35, assists: 60, points: 95, plusMinus: 18, penaltyMinutes: 30, shotsOnGoal: 280 } },
  { id: "makar", name: "Cale Makar", pos: "D", team: "Avalanche", teamAbbr: "COL", yrs: 6, base: { goals: 18, assists: 50, points: 68, plusMinus: 22, penaltyMinutes: 18, shotsOnGoal: 205 } },
  { id: "kucherov", name: "Nikita Kucherov", pos: "RW", team: "Lightning", teamAbbr: "TBL", base: { goals: 38, assists: 65, points: 103, plusMinus: 12, penaltyMinutes: 32, shotsOnGoal: 240 } },
  { id: "matthews", name: "Auston Matthews", pos: "C", team: "Maple Leafs", teamAbbr: "TOR", yrs: 9, base: { goals: 48, assists: 32, points: 80, plusMinus: 8, penaltyMinutes: 20, shotsOnGoal: 310 } },
  { id: "marner", name: "Mitch Marner", pos: "RW", team: "Maple Leafs", teamAbbr: "TOR", yrs: 8, base: { goals: 22, assists: 60, points: 82, plusMinus: 5, penaltyMinutes: 18, shotsOnGoal: 180 } },
  { id: "barkov", name: "Aleksander Barkov", pos: "C", team: "Panthers", teamAbbr: "FLA", base: { goals: 28, assists: 42, points: 70, plusMinus: 14, penaltyMinutes: 22, shotsOnGoal: 195 } },
  { id: "ovi", name: "Alex Ovechkin", pos: "LW", team: "Capitals", teamAbbr: "WSH", base: { goals: 38, assists: 22, points: 60, plusMinus: 2, penaltyMinutes: 40, shotsOnGoal: 290 } },
  { id: "crosby", name: "Sidney Crosby", pos: "C", team: "Penguins", teamAbbr: "PIT", base: { goals: 28, assists: 55, points: 83, plusMinus: 8, penaltyMinutes: 28, shotsOnGoal: 240 } },
  { id: "panarin", name: "Artemi Panarin", pos: "LW", team: "Rangers", teamAbbr: "NYR", yrs: 9, base: { goals: 28, assists: 50, points: 78, plusMinus: 12, penaltyMinutes: 22, shotsOnGoal: 210 } },
  { id: "pastrnak", name: "David Pastrnak", pos: "RW", team: "Bruins", teamAbbr: "BOS", yrs: 10, base: { goals: 40, assists: 38, points: 78, plusMinus: 10, penaltyMinutes: 24, shotsOnGoal: 270 } },
  { id: "aho", name: "Sebastian Aho", pos: "C", team: "Hurricanes", teamAbbr: "CAR", yrs: 9, base: { goals: 30, assists: 35, points: 65, plusMinus: 10, penaltyMinutes: 18, shotsOnGoal: 220 } },
  { id: "robertson_j", name: "Jason Robertson", pos: "LW", team: "Stars", teamAbbr: "DAL", yrs: 5, base: { goals: 35, assists: 40, points: 75, plusMinus: 14, penaltyMinutes: 12, shotsOnGoal: 230 } },
  { id: "kaprizov", name: "Kirill Kaprizov", pos: "LW", team: "Wild", teamAbbr: "MIN", yrs: 5, base: { goals: 38, assists: 40, points: 78, plusMinus: 8, penaltyMinutes: 20, shotsOnGoal: 250 } },
  { id: "hischier", name: "Nico Hischier", pos: "C", team: "Devils", teamAbbr: "NJD", yrs: 8, base: { goals: 22, assists: 30, points: 52, plusMinus: 4, penaltyMinutes: 22, shotsOnGoal: 175 } },
  { id: "pettersson", name: "Elias Pettersson", pos: "C", team: "Canucks", teamAbbr: "VAN", yrs: 7, base: { goals: 28, assists: 42, points: 70, plusMinus: 6, penaltyMinutes: 20, shotsOnGoal: 210 } },
];

export const nhlTeams = buildTeams(T, 'NHL');
export const nhlPlayers = buildPlayers(P, 'NHL');
