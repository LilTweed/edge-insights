import { buildTeams, buildPlayers, type TeamDef, type PlayerDef } from './generator';

const T: TeamDef[] = [
  { id: "ars", name: "Arsenal", abbr: "ARS", city: "London", conf: "Premier League", baseWin: 0.62, basePpg: 2.2, baseOpp: 0.7, rivals: { TOT: [16,8], CHE: [12,10], MCI: [6,10] } },
  { id: "avl", name: "Aston Villa", abbr: "AVL", city: "Birmingham", conf: "Premier League", baseWin: 0.48, basePpg: 1.5, baseOpp: 1.2, rivals: { WOL: [10,8], LEI: [10,8] } },
  { id: "bou", name: "Bournemouth", abbr: "BOU", city: "Bournemouth", conf: "Premier League", baseWin: 0.40, basePpg: 1.3, baseOpp: 1.5, rivals: { SOU: [6,4] } },
  { id: "bre", name: "Brentford", abbr: "BRE", city: "London", conf: "Premier League", baseWin: 0.45, basePpg: 1.5, baseOpp: 1.4, rivals: { FUL: [4,4] } },
  { id: "bha", name: "Brighton", abbr: "BHA", city: "Brighton", conf: "Premier League", baseWin: 0.48, basePpg: 1.5, baseOpp: 1.2, rivals: { CRY: [6,4] } },
  { id: "che", name: "Chelsea", abbr: "CHE", city: "London", conf: "Premier League", baseWin: 0.52, basePpg: 1.7, baseOpp: 1.1, rivals: { ARS: [10,12], TOT: [12,8], MUN: [10,12] } },
  { id: "cry", name: "Crystal Palace", abbr: "CRY", city: "London", conf: "Premier League", baseWin: 0.38, basePpg: 1.2, baseOpp: 1.4, rivals: { BHA: [4,6] } },
  { id: "eve", name: "Everton", abbr: "EVE", city: "Liverpool", conf: "Premier League", baseWin: 0.35, basePpg: 1.1, baseOpp: 1.5, rivals: { LIV: [4,14] } },
  { id: "ful", name: "Fulham", abbr: "FUL", city: "London", conf: "Premier League", baseWin: 0.42, basePpg: 1.3, baseOpp: 1.4, rivals: { BRE: [4,4], CHE: [4,8] } },
  { id: "ips", name: "Ipswich Town", abbr: "IPS", city: "Ipswich", conf: "Premier League", baseWin: 0.30, basePpg: 0.9, baseOpp: 1.6, rivals: { NOR: [6,6] } },
  { id: "lei", name: "Leicester City", abbr: "LEI", city: "Leicester", conf: "Premier League", baseWin: 0.40, basePpg: 1.3, baseOpp: 1.4, rivals: { AVL: [8,10] } },
  { id: "liv", name: "Liverpool", abbr: "LIV", city: "Liverpool", conf: "Premier League", baseWin: 0.65, basePpg: 2.3, baseOpp: 0.8, rivals: { MUN: [12,10], MCI: [8,10], EVE: [14,4], ARS: [10,8] } },
  { id: "mci", name: "Manchester City", abbr: "MCI", city: "Manchester", conf: "Premier League", baseWin: 0.70, basePpg: 2.5, baseOpp: 0.8, rivals: { MUN: [14,8], LIV: [10,8], ARS: [10,6] } },
  { id: "mun", name: "Manchester United", abbr: "MUN", city: "Manchester", conf: "Premier League", baseWin: 0.48, basePpg: 1.6, baseOpp: 1.2, rivals: { MCI: [8,14], LIV: [10,12], CHE: [12,10] } },
  { id: "new", name: "Newcastle United", abbr: "NEW", city: "Newcastle", conf: "Premier League", baseWin: 0.50, basePpg: 1.6, baseOpp: 1.1, rivals: { SUN: [8,4], TOT: [8,8] } },
  { id: "nfo", name: "Nottingham Forest", abbr: "NFO", city: "Nottingham", conf: "Premier League", baseWin: 0.42, basePpg: 1.3, baseOpp: 1.3, rivals: { LEI: [4,4] } },
  { id: "sou", name: "Southampton", abbr: "SOU", city: "Southampton", conf: "Premier League", baseWin: 0.32, basePpg: 1.0, baseOpp: 1.6, rivals: { BOU: [4,6] } },
  { id: "tot", name: "Tottenham Hotspur", abbr: "TOT", city: "London", conf: "Premier League", baseWin: 0.52, basePpg: 1.8, baseOpp: 1.2, rivals: { ARS: [8,16], CHE: [8,12], NEW: [8,8] } },
  { id: "whu", name: "West Ham United", abbr: "WHU", city: "London", conf: "Premier League", baseWin: 0.42, basePpg: 1.3, baseOpp: 1.4, rivals: { TOT: [6,10], CHE: [6,10] } },
  { id: "wol", name: "Wolverhampton", abbr: "WOL", city: "Wolverhampton", conf: "Premier League", baseWin: 0.40, basePpg: 1.2, baseOpp: 1.4, rivals: { AVL: [8,10] } },
];

const P: PlayerDef[] = [
  { id: "haaland", name: "Erling Haaland", pos: "ST", team: "Manchester City", teamAbbr: "MCI", yrs: 3, base: { goals: 30, assists: 5, shotsOnTarget: 80, shotsPerGame: 4.2, passAccuracy: 72, minutesPlayed: 2800 } },
  { id: "salah", name: "Mohamed Salah", pos: "RW", team: "Liverpool", teamAbbr: "LIV", base: { goals: 20, assists: 10, shotsOnTarget: 55, shotsPerGame: 3.0, passAccuracy: 78, minutesPlayed: 2900 } },
  { id: "saka", name: "Bukayo Saka", pos: "RW", team: "Arsenal", teamAbbr: "ARS", yrs: 6, base: { goals: 13, assists: 10, shotsOnTarget: 38, shotsPerGame: 2.4, passAccuracy: 80, minutesPlayed: 2800 } },
  { id: "kdb", name: "Kevin De Bruyne", pos: "CM", team: "Manchester City", teamAbbr: "MCI", base: { goals: 8, assists: 14, shotsOnTarget: 25, shotsPerGame: 1.8, passAccuracy: 85, minutesPlayed: 2400 } },
  { id: "palmer", name: "Cole Palmer", pos: "AM", team: "Chelsea", teamAbbr: "CHE", yrs: 2, base: { goals: 18, assists: 10, shotsOnTarget: 42, shotsPerGame: 2.8, passAccuracy: 82, minutesPlayed: 2700 } },
  { id: "son", name: "Son Heung-min", pos: "LW", team: "Tottenham Hotspur", teamAbbr: "TOT", base: { goals: 16, assists: 8, shotsOnTarget: 42, shotsPerGame: 2.5, passAccuracy: 78, minutesPlayed: 2800 } },
  { id: "watkins", name: "Ollie Watkins", pos: "ST", team: "Aston Villa", teamAbbr: "AVL", yrs: 5, base: { goals: 14, assists: 8, shotsOnTarget: 38, shotsPerGame: 2.2, passAccuracy: 75, minutesPlayed: 2700 } },
  { id: "isak", name: "Alexander Isak", pos: "ST", team: "Newcastle United", teamAbbr: "NEW", yrs: 3, base: { goals: 18, assists: 4, shotsOnTarget: 48, shotsPerGame: 3.0, passAccuracy: 76, minutesPlayed: 2600 } },
  { id: "rice", name: "Declan Rice", pos: "DM", team: "Arsenal", teamAbbr: "ARS", yrs: 8, base: { goals: 4, assists: 5, shotsOnTarget: 12, shotsPerGame: 0.8, passAccuracy: 88, minutesPlayed: 3100 } },
  { id: "odegaard", name: "Martin Odegaard", pos: "AM", team: "Arsenal", teamAbbr: "ARS", yrs: 5, base: { goals: 9, assists: 10, shotsOnTarget: 28, shotsPerGame: 1.8, passAccuracy: 86, minutesPlayed: 2600 } },
  { id: "bruno", name: "Bruno Fernandes", pos: "AM", team: "Manchester United", teamAbbr: "MUN", yrs: 5, base: { goals: 10, assists: 10, shotsOnTarget: 30, shotsPerGame: 2.0, passAccuracy: 82, minutesPlayed: 3000 } },
  { id: "diaz_l", name: "Luis Diaz", pos: "LW", team: "Liverpool", teamAbbr: "LIV", yrs: 4, base: { goals: 10, assists: 5, shotsOnTarget: 32, shotsPerGame: 2.2, passAccuracy: 80, minutesPlayed: 2400 } },
  { id: "gordon", name: "Anthony Gordon", pos: "LW", team: "Newcastle United", teamAbbr: "NEW", yrs: 4, base: { goals: 10, assists: 8, shotsOnTarget: 28, shotsPerGame: 1.8, passAccuracy: 79, minutesPlayed: 2500 } },
  { id: "rodri", name: "Rodri", pos: "DM", team: "Manchester City", teamAbbr: "MCI", yrs: 6, base: { goals: 5, assists: 6, shotsOnTarget: 15, shotsPerGame: 1.0, passAccuracy: 92, minutesPlayed: 3000 } },
];

export const soccerTeams = buildTeams(T, 'Soccer');
export const soccerPlayers = buildPlayers(P, 'Soccer');
