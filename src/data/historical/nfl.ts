import { buildTeams, buildPlayers, type TeamDef, type PlayerDef } from './generator';

const T: TeamDef[] = [
  // AFC East
  { id: "buf", name: "Bills", abbr: "BUF", city: "Buffalo", conf: "AFC East", baseWin: 0.62, basePpg: 27, baseOpp: 21, rivals: { MIA: [14,10], NE: [12,14], KC: [6,12] } },
  { id: "mia", name: "Dolphins", abbr: "MIA", city: "Miami", conf: "AFC East", baseWin: 0.52, basePpg: 24, baseOpp: 22, rivals: { BUF: [10,14], NE: [12,12], NYJ: [14,10] } },
  { id: "ne", name: "Patriots", abbr: "NE", city: "New England", conf: "AFC East", baseWin: 0.52, basePpg: 23, baseOpp: 21, rivals: { BUF: [14,12], MIA: [12,12], NYJ: [16,10] } },
  { id: "nyj", name: "Jets", abbr: "NYJ", city: "New York", conf: "AFC East", baseWin: 0.35, basePpg: 19, baseOpp: 24, rivals: { NE: [10,16], MIA: [10,14], BUF: [8,14] } },
  // AFC North
  { id: "bal", name: "Ravens", abbr: "BAL", city: "Baltimore", conf: "AFC North", baseWin: 0.62, basePpg: 27, baseOpp: 20, rivals: { PIT: [14,12], CIN: [14,10], CLE: [16,8] } },
  { id: "cin", name: "Bengals", abbr: "CIN", city: "Cincinnati", conf: "AFC North", baseWin: 0.48, basePpg: 24, baseOpp: 23, rivals: { BAL: [10,14], PIT: [12,12], CLE: [14,10] } },
  { id: "cle_f", name: "Browns", abbr: "CLE", city: "Cleveland", conf: "AFC North", baseWin: 0.38, basePpg: 20, baseOpp: 24, rivals: { BAL: [8,16], PIT: [8,14], CIN: [10,14] } },
  { id: "pit", name: "Steelers", abbr: "PIT", city: "Pittsburgh", conf: "AFC North", baseWin: 0.55, basePpg: 22, baseOpp: 21, rivals: { BAL: [12,14], CIN: [12,12], CLE: [14,8] } },
  // AFC South
  { id: "hou_f", name: "Texans", abbr: "HOU", city: "Houston", conf: "AFC South", baseWin: 0.48, basePpg: 23, baseOpp: 22, rivals: { IND: [12,12], JAX: [14,10], TEN: [12,12] } },
  { id: "ind_f", name: "Colts", abbr: "IND", city: "Indianapolis", conf: "AFC South", baseWin: 0.50, basePpg: 24, baseOpp: 23, rivals: { HOU: [12,12], TEN: [12,12], JAX: [14,10] } },
  { id: "jax", name: "Jaguars", abbr: "JAX", city: "Jacksonville", conf: "AFC South", baseWin: 0.38, basePpg: 21, baseOpp: 25, rivals: { TEN: [10,12], HOU: [10,14], IND: [10,14] } },
  { id: "ten", name: "Titans", abbr: "TEN", city: "Tennessee", conf: "AFC South", baseWin: 0.45, basePpg: 22, baseOpp: 23, rivals: { IND: [12,12], HOU: [12,12], JAX: [12,10] } },
  // AFC West
  { id: "den_f", name: "Broncos", abbr: "DEN", city: "Denver", conf: "AFC West", baseWin: 0.42, basePpg: 21, baseOpp: 23, rivals: { KC: [6,18], LV: [12,10], LAC: [10,12] } },
  { id: "kc", name: "Chiefs", abbr: "KC", city: "Kansas City", conf: "AFC West", baseWin: 0.72, basePpg: 27, baseOpp: 19, rivals: { BUF: [12,6], LV: [16,6], DEN: [18,6], LAC: [16,8] } },
  { id: "lv", name: "Raiders", abbr: "LV", city: "Las Vegas", conf: "AFC West", baseWin: 0.40, basePpg: 21, baseOpp: 24, rivals: { KC: [6,16], DEN: [10,12], LAC: [10,12] } },
  { id: "lac", name: "Chargers", abbr: "LAC", city: "Los Angeles", conf: "AFC West", baseWin: 0.48, basePpg: 24, baseOpp: 23, rivals: { KC: [8,16], DEN: [12,10], LV: [12,10] } },
  // NFC East
  { id: "dal_f", name: "Cowboys", abbr: "DAL", city: "Dallas", conf: "NFC East", baseWin: 0.52, basePpg: 25, baseOpp: 22, rivals: { PHI: [10,14], NYG: [16,10], WAS: [16,8] } },
  { id: "nyg", name: "Giants", abbr: "NYG", city: "New York", conf: "NFC East", baseWin: 0.38, basePpg: 20, baseOpp: 24, rivals: { DAL: [10,16], PHI: [8,14], WAS: [12,10] } },
  { id: "phi_f", name: "Eagles", abbr: "PHI", city: "Philadelphia", conf: "NFC East", baseWin: 0.58, basePpg: 26, baseOpp: 21, rivals: { DAL: [14,10], NYG: [14,8], WAS: [14,8] } },
  { id: "was_f", name: "Commanders", abbr: "WAS", city: "Washington", conf: "NFC East", baseWin: 0.38, basePpg: 20, baseOpp: 25, rivals: { DAL: [8,16], PHI: [8,14], NYG: [10,12] } },
  // NFC North
  { id: "chi_f", name: "Bears", abbr: "CHI", city: "Chicago", conf: "NFC North", baseWin: 0.38, basePpg: 20, baseOpp: 24, rivals: { GB: [8,16], MIN: [10,12], DET: [12,10] } },
  { id: "det_f", name: "Lions", abbr: "DET", city: "Detroit", conf: "NFC North", baseWin: 0.48, basePpg: 24, baseOpp: 23, rivals: { GB: [10,14], MIN: [12,10], CHI: [10,12] } },
  { id: "gb", name: "Packers", abbr: "GB", city: "Green Bay", conf: "NFC North", baseWin: 0.58, basePpg: 26, baseOpp: 21, rivals: { CHI: [16,8], MIN: [14,10], DET: [14,10] } },
  { id: "min_f", name: "Vikings", abbr: "MIN", city: "Minnesota", conf: "NFC North", baseWin: 0.50, basePpg: 24, baseOpp: 23, rivals: { GB: [10,14], CHI: [12,10], DET: [10,12] } },
  // NFC South
  { id: "atl_f", name: "Falcons", abbr: "ATL", city: "Atlanta", conf: "NFC South", baseWin: 0.42, basePpg: 22, baseOpp: 24, rivals: { NO: [10,14], TB: [10,12], CAR: [14,10] } },
  { id: "car", name: "Panthers", abbr: "CAR", city: "Carolina", conf: "NFC South", baseWin: 0.35, basePpg: 19, baseOpp: 25, rivals: { ATL: [10,14], TB: [8,14], NO: [8,14] } },
  { id: "no", name: "Saints", abbr: "NO", city: "New Orleans", conf: "NFC South", baseWin: 0.52, basePpg: 25, baseOpp: 22, rivals: { ATL: [14,10], TB: [10,12], CAR: [14,8] } },
  { id: "tb", name: "Buccaneers", abbr: "TB", city: "Tampa Bay", conf: "NFC South", baseWin: 0.50, basePpg: 24, baseOpp: 22, rivals: { NO: [12,10], ATL: [12,10], CAR: [14,8] } },
  // NFC West
  { id: "ari", name: "Cardinals", abbr: "ARI", city: "Arizona", conf: "NFC West", baseWin: 0.40, basePpg: 22, baseOpp: 25, rivals: { SF: [8,14], LAR: [10,12], SEA: [10,12] } },
  { id: "lar", name: "Rams", abbr: "LAR", city: "Los Angeles", conf: "NFC West", baseWin: 0.52, basePpg: 24, baseOpp: 22, rivals: { SF: [10,14], SEA: [12,10], ARI: [12,10] } },
  { id: "sf", name: "49ers", abbr: "SF", city: "San Francisco", conf: "NFC West", baseWin: 0.60, basePpg: 27, baseOpp: 20, rivals: { SEA: [14,10], LAR: [14,10], ARI: [14,8] } },
  { id: "sea", name: "Seahawks", abbr: "SEA", city: "Seattle", conf: "NFC West", baseWin: 0.52, basePpg: 24, baseOpp: 22, rivals: { SF: [10,14], LAR: [10,12], ARI: [12,10] } },
];

const P: PlayerDef[] = [
  // QBs
  { id: "mahomes", name: "Patrick Mahomes", pos: "QB", team: "Chiefs", teamAbbr: "KC", yrs: 8, base: { passYards: 4600, passTD: 35, interceptions: 11, completionPct: 66.5, qbRating: 102, rushYards: 320 } },
  { id: "jallen", name: "Josh Allen", pos: "QB", team: "Bills", teamAbbr: "BUF", yrs: 7, base: { passYards: 4200, passTD: 32, interceptions: 13, completionPct: 64, qbRating: 96, rushYards: 580, rushTD: 8 } },
  { id: "lamar", name: "Lamar Jackson", pos: "QB", team: "Ravens", teamAbbr: "BAL", yrs: 7, base: { passYards: 3400, passTD: 26, interceptions: 9, completionPct: 64, qbRating: 100, rushYards: 850, rushTD: 5 } },
  { id: "burrow", name: "Joe Burrow", pos: "QB", team: "Bengals", teamAbbr: "CIN", yrs: 5, base: { passYards: 4200, passTD: 30, interceptions: 11, completionPct: 68, qbRating: 98, rushYards: 150 } },
  { id: "hurts", name: "Jalen Hurts", pos: "QB", team: "Eagles", teamAbbr: "PHI", yrs: 5, base: { passYards: 3600, passTD: 24, interceptions: 8, completionPct: 66, qbRating: 96, rushYards: 650, rushTD: 10 } },
  { id: "purdy", name: "Brock Purdy", pos: "QB", team: "49ers", teamAbbr: "SF", yrs: 3, base: { passYards: 4100, passTD: 30, interceptions: 10, completionPct: 68, qbRating: 104, rushYards: 180 } },
  { id: "love_j", name: "Jordan Love", pos: "QB", team: "Packers", teamAbbr: "GB", yrs: 3, base: { passYards: 3900, passTD: 26, interceptions: 12, completionPct: 64, qbRating: 92, rushYards: 220 } },
  { id: "stroud", name: "C.J. Stroud", pos: "QB", team: "Texans", teamAbbr: "HOU", yrs: 2, base: { passYards: 4100, passTD: 24, interceptions: 8, completionPct: 64, qbRating: 98, rushYards: 180 } },
  { id: "tua", name: "Tua Tagovailoa", pos: "QB", team: "Dolphins", teamAbbr: "MIA", yrs: 5, base: { passYards: 3800, passTD: 26, interceptions: 10, completionPct: 67, qbRating: 96, rushYards: 80 } },
  { id: "dak", name: "Dak Prescott", pos: "QB", team: "Cowboys", teamAbbr: "DAL", yrs: 9, base: { passYards: 4100, passTD: 28, interceptions: 10, completionPct: 66, qbRating: 96, rushYards: 250, rushTD: 3 } },
  { id: "herb", name: "Justin Herbert", pos: "QB", team: "Chargers", teamAbbr: "LAC", yrs: 5, base: { passYards: 4300, passTD: 28, interceptions: 12, completionPct: 66, qbRating: 95, rushYards: 200 } },
  { id: "goff", name: "Jared Goff", pos: "QB", team: "Lions", teamAbbr: "DET", yrs: 9, base: { passYards: 4100, passTD: 28, interceptions: 10, completionPct: 66, qbRating: 94, rushYards: 60 } },
  { id: "stafford", name: "Matthew Stafford", pos: "QB", team: "Rams", teamAbbr: "LAR", base: { passYards: 4100, passTD: 28, interceptions: 12, completionPct: 65, qbRating: 94, rushYards: 70 } },
  { id: "wilson_r", name: "Russell Wilson", pos: "QB", team: "Steelers", teamAbbr: "PIT", base: { passYards: 3600, passTD: 26, interceptions: 8, completionPct: 65, qbRating: 96, rushYards: 260 } },
  // RBs
  { id: "henry", name: "Derrick Henry", pos: "RB", team: "Ravens", teamAbbr: "BAL", base: { rushYards: 1400, rushTD: 12, carries: 310, receptions: 18, recYards: 150 } },
  { id: "chubb", name: "Nick Chubb", pos: "RB", team: "Browns", teamAbbr: "CLE", yrs: 7, base: { rushYards: 1200, rushTD: 10, carries: 260, receptions: 25, recYards: 200 } },
  { id: "mccaffrey", name: "Christian McCaffrey", pos: "RB", team: "49ers", teamAbbr: "SF", base: { rushYards: 1100, rushTD: 10, carries: 240, receptions: 65, recYards: 480, recTD: 3 } },
  { id: "bijan", name: "Bijan Robinson", pos: "RB", team: "Falcons", teamAbbr: "ATL", yrs: 2, base: { rushYards: 1300, rushTD: 8, carries: 270, receptions: 45, recYards: 380 } },
  // WRs
  { id: "hill_t", name: "Tyreek Hill", pos: "WR", team: "Dolphins", teamAbbr: "MIA", yrs: 9, base: { receptions: 105, recYards: 1400, recTD: 10, targets: 145 } },
  { id: "chase_j", name: "Ja'Marr Chase", pos: "WR", team: "Bengals", teamAbbr: "CIN", yrs: 4, base: { receptions: 90, recYards: 1300, recTD: 10, targets: 135 } },
  { id: "jefferson", name: "Justin Jefferson", pos: "WR", team: "Vikings", teamAbbr: "MIN", yrs: 5, base: { receptions: 95, recYards: 1450, recTD: 8, targets: 140 } },
  { id: "lamb", name: "CeeDee Lamb", pos: "WR", team: "Cowboys", teamAbbr: "DAL", yrs: 5, base: { receptions: 100, recYards: 1350, recTD: 9, targets: 150 } },
  { id: "aj_brown", name: "A.J. Brown", pos: "WR", team: "Eagles", teamAbbr: "PHI", yrs: 6, base: { receptions: 85, recYards: 1250, recTD: 8, targets: 125 } },
  { id: "adams_d", name: "Davante Adams", pos: "WR", team: "Jets", teamAbbr: "NYJ", base: { receptions: 95, recYards: 1250, recTD: 10, targets: 140 } },
];

export const nflTeams = buildTeams(T, 'NFL');
export const nflPlayers = buildPlayers(P, 'NFL');
