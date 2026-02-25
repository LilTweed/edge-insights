import { buildTeams, buildPlayers, type TeamDef, type PlayerDef } from './generator';

const T: TeamDef[] = [
  { id: "atl", name: "Hawks", abbr: "ATL", city: "Atlanta", conf: "Eastern", baseWin: 0.45, basePpg: 113, baseOpp: 114, rivals: { BOS: [18,22], MIA: [20,18] } },
  { id: "bos", name: "Celtics", abbr: "BOS", city: "Boston", conf: "Eastern", baseWin: 0.65, basePpg: 115, baseOpp: 108, rivals: { LAL: [38,45], PHI: [25,20], MIA: [22,18] } },
  { id: "bkn", name: "Nets", abbr: "BKN", city: "Brooklyn", conf: "Eastern", baseWin: 0.42, basePpg: 110, baseOpp: 112, rivals: { NYK: [22,28], PHI: [20,22] } },
  { id: "cha", name: "Hornets", abbr: "CHA", city: "Charlotte", conf: "Eastern", baseWin: 0.38, basePpg: 107, baseOpp: 112, rivals: { ATL: [18,20], MIA: [15,22] } },
  { id: "chi", name: "Bulls", abbr: "CHI", city: "Chicago", conf: "Eastern", baseWin: 0.42, basePpg: 108, baseOpp: 110, rivals: { MIL: [18,22], CLE: [20,18] } },
  { id: "cle", name: "Cavaliers", abbr: "CLE", city: "Cleveland", conf: "Eastern", baseWin: 0.55, basePpg: 111, baseOpp: 108, rivals: { CHI: [18,20], BOS: [19,24] } },
  { id: "dal", name: "Mavericks", abbr: "DAL", city: "Dallas", conf: "Western", baseWin: 0.52, basePpg: 114, baseOpp: 112, rivals: { HOU: [24,20], SAS: [22,25] } },
  { id: "den", name: "Nuggets", abbr: "DEN", city: "Denver", conf: "Western", baseWin: 0.62, basePpg: 116, baseOpp: 110, rivals: { LAL: [22,28], GSW: [18,20] } },
  { id: "det", name: "Pistons", abbr: "DET", city: "Detroit", conf: "Eastern", baseWin: 0.30, basePpg: 104, baseOpp: 113, rivals: { CHI: [16,22], CLE: [15,22] } },
  { id: "gsw", name: "Warriors", abbr: "GSW", city: "Golden State", conf: "Western", baseWin: 0.58, basePpg: 114, baseOpp: 110, rivals: { LAL: [29,32], BOS: [14,18], CLE: [15,12] } },
  { id: "hou", name: "Rockets", abbr: "HOU", city: "Houston", conf: "Western", baseWin: 0.45, basePpg: 110, baseOpp: 111, rivals: { DAL: [20,24], SAS: [22,20] } },
  { id: "ind", name: "Pacers", abbr: "IND", city: "Indiana", conf: "Eastern", baseWin: 0.50, basePpg: 113, baseOpp: 112, rivals: { MIL: [18,20], CHI: [20,16] } },
  { id: "lac", name: "Clippers", abbr: "LAC", city: "Los Angeles", conf: "Western", baseWin: 0.50, basePpg: 112, baseOpp: 111, rivals: { LAL: [22,25], PHX: [20,18] } },
  { id: "lal", name: "Lakers", abbr: "LAL", city: "Los Angeles", conf: "Western", baseWin: 0.55, basePpg: 112, baseOpp: 110, rivals: { BOS: [45,38], GSW: [32,29], DEN: [28,22] } },
  { id: "mem", name: "Grizzlies", abbr: "MEM", city: "Memphis", conf: "Western", baseWin: 0.48, basePpg: 111, baseOpp: 112, rivals: { DAL: [18,20], NOP: [20,16] } },
  { id: "mia", name: "Heat", abbr: "MIA", city: "Miami", conf: "Eastern", baseWin: 0.54, basePpg: 110, baseOpp: 108, rivals: { BOS: [18,22], PHI: [22,18] } },
  { id: "mil", name: "Bucks", abbr: "MIL", city: "Milwaukee", conf: "Eastern", baseWin: 0.58, basePpg: 115, baseOpp: 110, rivals: { BOS: [18,22], CHI: [22,18] } },
  { id: "min", name: "Timberwolves", abbr: "MIN", city: "Minnesota", conf: "Western", baseWin: 0.50, basePpg: 110, baseOpp: 111, rivals: { DEN: [16,22], OKC: [18,20] } },
  { id: "nop", name: "Pelicans", abbr: "NOP", city: "New Orleans", conf: "Western", baseWin: 0.42, basePpg: 111, baseOpp: 113, rivals: { MEM: [16,20], HOU: [18,18] } },
  { id: "nyk", name: "Knicks", abbr: "NYK", city: "New York", conf: "Eastern", baseWin: 0.48, basePpg: 110, baseOpp: 111, rivals: { BKN: [28,22], BOS: [20,24] } },
  { id: "okc", name: "Thunder", abbr: "OKC", city: "Oklahoma City", conf: "Western", baseWin: 0.55, basePpg: 114, baseOpp: 110, rivals: { DAL: [20,18], DEN: [18,20] } },
  { id: "orl", name: "Magic", abbr: "ORL", city: "Orlando", conf: "Eastern", baseWin: 0.42, basePpg: 107, baseOpp: 110, rivals: { MIA: [16,22], ATL: [18,18] } },
  { id: "phi", name: "76ers", abbr: "PHI", city: "Philadelphia", conf: "Eastern", baseWin: 0.52, basePpg: 112, baseOpp: 110, rivals: { BOS: [20,25], NYK: [22,18] } },
  { id: "phx", name: "Suns", abbr: "PHX", city: "Phoenix", conf: "Western", baseWin: 0.50, basePpg: 113, baseOpp: 112, rivals: { LAL: [18,22], LAC: [18,20] } },
  { id: "por", name: "Trail Blazers", abbr: "POR", city: "Portland", conf: "Western", baseWin: 0.42, basePpg: 109, baseOpp: 112, rivals: { GSW: [14,22], LAL: [16,20] } },
  { id: "sac", name: "Kings", abbr: "SAC", city: "Sacramento", conf: "Western", baseWin: 0.45, basePpg: 112, baseOpp: 113, rivals: { GSW: [16,22], LAL: [18,20] } },
  { id: "sas", name: "Spurs", abbr: "SAS", city: "San Antonio", conf: "Western", baseWin: 0.42, basePpg: 108, baseOpp: 111, rivals: { DAL: [25,22], HOU: [20,22] } },
  { id: "tor", name: "Raptors", abbr: "TOR", city: "Toronto", conf: "Eastern", baseWin: 0.48, basePpg: 110, baseOpp: 111, rivals: { BOS: [18,22], PHI: [20,18] } },
  { id: "uta", name: "Jazz", abbr: "UTA", city: "Utah", conf: "Western", baseWin: 0.45, basePpg: 109, baseOpp: 111, rivals: { DEN: [18,22], OKC: [20,16] } },
  { id: "was", name: "Wizards", abbr: "WAS", city: "Washington", conf: "Eastern", baseWin: 0.33, basePpg: 106, baseOpp: 114, rivals: { PHI: [14,22], ATL: [16,18] } },
];

const P: PlayerDef[] = [
  // ATL
  { id: "trae", name: "Trae Young", pos: "PG", team: "Hawks", teamAbbr: "ATL", yrs: 7, base: { points: 26, rebounds: 3.8, assists: 9.5, steals: 1.0, blocks: 0.2, fgPct: 43.5, threePct: 35, ftPct: 87, minutes: 35 } },
  { id: "murray_d", name: "Dejounte Murray", pos: "PG", team: "Hawks", teamAbbr: "ATL", yrs: 5, base: { points: 18, rebounds: 6, assists: 6, steals: 1.8, blocks: 0.5, fgPct: 45, threePct: 34, ftPct: 80, minutes: 34 } },
  // BOS
  { id: "tatum", name: "Jayson Tatum", pos: "SF", team: "Celtics", teamAbbr: "BOS", yrs: 8, base: { points: 27, rebounds: 8, assists: 4.8, steals: 1.0, blocks: 0.6, fgPct: 46, threePct: 37, ftPct: 84, minutes: 36 } },
  { id: "brown_j", name: "Jaylen Brown", pos: "SG", team: "Celtics", teamAbbr: "BOS", yrs: 8, base: { points: 22, rebounds: 5.5, assists: 3.2, steals: 1.0, blocks: 0.4, fgPct: 47, threePct: 36, ftPct: 76, minutes: 34 } },
  // BKN
  { id: "bridges_m", name: "Mikal Bridges", pos: "SF", team: "Nets", teamAbbr: "BKN", yrs: 7, base: { points: 18, rebounds: 4, assists: 3, steals: 1.0, blocks: 0.5, fgPct: 47, threePct: 37, ftPct: 82, minutes: 34 } },
  // CHA
  { id: "ball_l", name: "LaMelo Ball", pos: "PG", team: "Hornets", teamAbbr: "CHA", yrs: 4, base: { points: 20, rebounds: 6, assists: 7.5, steals: 1.5, blocks: 0.4, fgPct: 43, threePct: 36, ftPct: 87, minutes: 33 } },
  // CHI
  { id: "lavine", name: "Zach LaVine", pos: "SG", team: "Bulls", teamAbbr: "CHI", yrs: 9, base: { points: 24, rebounds: 4.5, assists: 4.2, steals: 0.8, blocks: 0.4, fgPct: 47, threePct: 38, ftPct: 83, minutes: 35 } },
  // CLE
  { id: "mitchell_d", name: "Donovan Mitchell", pos: "SG", team: "Cavaliers", teamAbbr: "CLE", yrs: 8, base: { points: 26, rebounds: 4.2, assists: 5, steals: 1.4, blocks: 0.4, fgPct: 45, threePct: 36, ftPct: 84, minutes: 34 } },
  { id: "garland", name: "Darius Garland", pos: "PG", team: "Cavaliers", teamAbbr: "CLE", yrs: 6, base: { points: 20, rebounds: 2.8, assists: 7.5, steals: 1.2, blocks: 0.1, fgPct: 46, threePct: 38, ftPct: 86, minutes: 33 } },
  // DAL
  { id: "luka", name: "Luka Doncic", pos: "PG", team: "Mavericks", teamAbbr: "DAL", yrs: 7, base: { points: 28.5, rebounds: 8.5, assists: 8.5, steals: 1.2, blocks: 0.4, fgPct: 46, threePct: 35, ftPct: 76, minutes: 36 } },
  { id: "kyrie", name: "Kyrie Irving", pos: "PG", team: "Mavericks", teamAbbr: "DAL", yrs: 10, base: { points: 24, rebounds: 4.2, assists: 5.5, steals: 1.2, blocks: 0.4, fgPct: 47, threePct: 39, ftPct: 88, minutes: 34 } },
  // DEN
  { id: "jokic", name: "Nikola Jokic", pos: "C", team: "Nuggets", teamAbbr: "DEN", yrs: 10, base: { points: 26, rebounds: 12, assists: 8.5, steals: 1.4, blocks: 0.8, fgPct: 57, threePct: 36, ftPct: 82, minutes: 34 } },
  { id: "murray_ja", name: "Jamal Murray", pos: "PG", team: "Nuggets", teamAbbr: "DEN", yrs: 8, base: { points: 19, rebounds: 4, assists: 5, steals: 1.0, blocks: 0.3, fgPct: 45, threePct: 37, ftPct: 85, minutes: 33 } },
  // DET
  { id: "cade", name: "Cade Cunningham", pos: "PG", team: "Pistons", teamAbbr: "DET", yrs: 4, base: { points: 22, rebounds: 4.5, assists: 7, steals: 1.0, blocks: 0.4, fgPct: 44, threePct: 35, ftPct: 84, minutes: 34 } },
  // GSW
  { id: "curry", name: "Stephen Curry", pos: "PG", team: "Warriors", teamAbbr: "GSW", base: { points: 27, rebounds: 5, assists: 6, steals: 1.2, blocks: 0.3, fgPct: 47, threePct: 42, ftPct: 91, minutes: 33 } },
  { id: "klay", name: "Klay Thompson", pos: "SG", team: "Warriors", teamAbbr: "GSW", yrs: 8, base: { points: 20, rebounds: 3.5, assists: 2.5, steals: 0.8, blocks: 0.5, fgPct: 45, threePct: 41, ftPct: 85, minutes: 33 } },
  // HOU
  { id: "sengun", name: "Alperen Sengun", pos: "C", team: "Rockets", teamAbbr: "HOU", yrs: 4, base: { points: 18, rebounds: 9, assists: 5, steals: 1.0, blocks: 0.8, fgPct: 53, threePct: 32, ftPct: 72, minutes: 31 } },
  { id: "green_j", name: "Jalen Green", pos: "SG", team: "Rockets", teamAbbr: "HOU", yrs: 4, base: { points: 21, rebounds: 3.5, assists: 3.5, steals: 0.6, blocks: 0.3, fgPct: 43, threePct: 35, ftPct: 81, minutes: 33 } },
  // IND
  { id: "haliburton", name: "Tyrese Haliburton", pos: "PG", team: "Pacers", teamAbbr: "IND", yrs: 5, base: { points: 20, rebounds: 3.8, assists: 10, steals: 1.5, blocks: 0.3, fgPct: 47, threePct: 40, ftPct: 85, minutes: 34 } },
  // LAC
  { id: "kawhi", name: "Kawhi Leonard", pos: "SF", team: "Clippers", teamAbbr: "LAC", base: { points: 24, rebounds: 6.5, assists: 4, steals: 1.7, blocks: 0.5, fgPct: 50, threePct: 38, ftPct: 87, minutes: 33 } },
  // LAL
  { id: "lebron", name: "LeBron James", pos: "SF", team: "Lakers", teamAbbr: "LAL", base: { points: 27, rebounds: 7.5, assists: 8.5, steals: 1.3, blocks: 0.7, fgPct: 51, threePct: 35, ftPct: 73, minutes: 35 } },
  { id: "ad", name: "Anthony Davis", pos: "PF", team: "Lakers", teamAbbr: "LAL", yrs: 7, base: { points: 25, rebounds: 12, assists: 3.2, steals: 1.2, blocks: 2.2, fgPct: 54, threePct: 27, ftPct: 80, minutes: 35 } },
  // MEM
  { id: "ja", name: "Ja Morant", pos: "PG", team: "Grizzlies", teamAbbr: "MEM", yrs: 6, base: { points: 25, rebounds: 5.5, assists: 7, steals: 1.0, blocks: 0.4, fgPct: 47, threePct: 32, ftPct: 76, minutes: 33 } },
  // MIA
  { id: "butler", name: "Jimmy Butler", pos: "SF", team: "Heat", teamAbbr: "MIA", base: { points: 22, rebounds: 6, assists: 5.5, steals: 1.8, blocks: 0.5, fgPct: 49, threePct: 33, ftPct: 85, minutes: 34 } },
  { id: "bam", name: "Bam Adebayo", pos: "C", team: "Heat", teamAbbr: "MIA", yrs: 8, base: { points: 19, rebounds: 10, assists: 3.5, steals: 1.1, blocks: 0.8, fgPct: 53, threePct: 26, ftPct: 75, minutes: 33 } },
  // MIL
  { id: "giannis", name: "Giannis Antetokounmpo", pos: "PF", team: "Bucks", teamAbbr: "MIL", base: { points: 28, rebounds: 11, assists: 5.5, steals: 1.1, blocks: 1.3, fgPct: 55, threePct: 29, ftPct: 70, minutes: 35 } },
  { id: "dame", name: "Damian Lillard", pos: "PG", team: "Bucks", teamAbbr: "MIL", base: { points: 26, rebounds: 4.2, assists: 6.8, steals: 0.9, blocks: 0.3, fgPct: 44, threePct: 37, ftPct: 90, minutes: 35 } },
  // MIN
  { id: "ant", name: "Anthony Edwards", pos: "SG", team: "Timberwolves", teamAbbr: "MIN", yrs: 5, base: { points: 25, rebounds: 5.5, assists: 4.5, steals: 1.5, blocks: 0.6, fgPct: 45, threePct: 36, ftPct: 78, minutes: 35 } },
  { id: "kat", name: "Karl-Anthony Towns", pos: "C", team: "Timberwolves", teamAbbr: "MIN", base: { points: 22, rebounds: 10, assists: 3.2, steals: 0.7, blocks: 1.2, fgPct: 51, threePct: 39, ftPct: 83, minutes: 33 } },
  // NOP
  { id: "zion", name: "Zion Williamson", pos: "PF", team: "Pelicans", teamAbbr: "NOP", yrs: 5, base: { points: 25, rebounds: 7, assists: 4.5, steals: 1.0, blocks: 0.6, fgPct: 59, threePct: 33, ftPct: 70, minutes: 30 } },
  // NYK
  { id: "brunson", name: "Jalen Brunson", pos: "PG", team: "Knicks", teamAbbr: "NYK", yrs: 7, base: { points: 24, rebounds: 3.5, assists: 6.5, steals: 0.9, blocks: 0.2, fgPct: 47, threePct: 37, ftPct: 84, minutes: 35 } },
  // OKC
  { id: "shai", name: "Shai Gilgeous-Alexander", pos: "PG", team: "Thunder", teamAbbr: "OKC", yrs: 7, base: { points: 28, rebounds: 5.5, assists: 6, steals: 1.8, blocks: 0.8, fgPct: 51, threePct: 35, ftPct: 87, minutes: 34 } },
  // ORL
  { id: "paolo", name: "Paolo Banchero", pos: "PF", team: "Magic", teamAbbr: "ORL", yrs: 3, base: { points: 22, rebounds: 7, assists: 5, steals: 0.8, blocks: 0.5, fgPct: 46, threePct: 33, ftPct: 75, minutes: 34 } },
  // PHI
  { id: "embiid", name: "Joel Embiid", pos: "C", team: "76ers", teamAbbr: "PHI", yrs: 8, base: { points: 28, rebounds: 11, assists: 3.5, steals: 1.0, blocks: 1.7, fgPct: 51, threePct: 34, ftPct: 86, minutes: 34 } },
  { id: "maxey", name: "Tyrese Maxey", pos: "PG", team: "76ers", teamAbbr: "PHI", yrs: 5, base: { points: 22, rebounds: 3.5, assists: 5, steals: 0.9, blocks: 0.3, fgPct: 46, threePct: 38, ftPct: 87, minutes: 35 } },
  // PHX
  { id: "kd", name: "Kevin Durant", pos: "SF", team: "Suns", teamAbbr: "PHX", base: { points: 27, rebounds: 7, assists: 5, steals: 0.9, blocks: 1.3, fgPct: 52, threePct: 38, ftPct: 88, minutes: 36 } },
  { id: "booker", name: "Devin Booker", pos: "SG", team: "Suns", teamAbbr: "PHX", yrs: 10, base: { points: 26, rebounds: 4.5, assists: 5.5, steals: 0.8, blocks: 0.3, fgPct: 46, threePct: 36, ftPct: 87, minutes: 35 } },
  // POR
  { id: "scoot", name: "Scoot Henderson", pos: "PG", team: "Trail Blazers", teamAbbr: "POR", yrs: 2, base: { points: 14, rebounds: 3, assists: 5, steals: 0.8, blocks: 0.3, fgPct: 40, threePct: 31, ftPct: 76, minutes: 28 } },
  // SAC
  { id: "fox", name: "De'Aaron Fox", pos: "PG", team: "Kings", teamAbbr: "SAC", yrs: 8, base: { points: 24, rebounds: 4, assists: 6.5, steals: 1.5, blocks: 0.4, fgPct: 47, threePct: 33, ftPct: 75, minutes: 34 } },
  { id: "sabonis", name: "Domantas Sabonis", pos: "C", team: "Kings", teamAbbr: "SAC", yrs: 9, base: { points: 19, rebounds: 12.5, assists: 7, steals: 0.8, blocks: 0.5, fgPct: 55, threePct: 32, ftPct: 74, minutes: 35 } },
  // SAS
  { id: "wemby", name: "Victor Wembanyama", pos: "C", team: "Spurs", teamAbbr: "SAS", yrs: 2, base: { points: 22, rebounds: 10.5, assists: 3.5, steals: 1.1, blocks: 3.5, fgPct: 47, threePct: 33, ftPct: 80, minutes: 31 } },
  // TOR
  { id: "barnes_s", name: "Scottie Barnes", pos: "SF", team: "Raptors", teamAbbr: "TOR", yrs: 4, base: { points: 18, rebounds: 7.5, assists: 5.5, steals: 1.0, blocks: 0.8, fgPct: 47, threePct: 32, ftPct: 77, minutes: 34 } },
  // UTA
  { id: "lauri", name: "Lauri Markkanen", pos: "PF", team: "Jazz", teamAbbr: "UTA", yrs: 7, base: { points: 22, rebounds: 8, assists: 2, steals: 0.6, blocks: 0.5, fgPct: 49, threePct: 39, ftPct: 88, minutes: 34 } },
  // WAS
  { id: "poole", name: "Jordan Poole", pos: "SG", team: "Wizards", teamAbbr: "WAS", yrs: 5, base: { points: 17, rebounds: 3, assists: 4.5, steals: 0.8, blocks: 0.2, fgPct: 43, threePct: 34, ftPct: 84, minutes: 31 } },
];

export const nbaTeams = buildTeams(T, 'NBA');
export const nbaPlayers = buildPlayers(P, 'NBA');
