import { buildTeams, buildPlayers, type TeamDef, type PlayerDef } from './generator';

const T: TeamDef[] = [
  // AL East
  { id: "bal_b", name: "Orioles", abbr: "BAL", city: "Baltimore", conf: "AL East", baseWin: 0.48, basePpg: 4.3, baseOpp: 4.2, rivals: { NYY: [38,42], BOS: [40,38] } },
  { id: "bos_b", name: "Red Sox", abbr: "BOS", city: "Boston", conf: "AL East", baseWin: 0.52, basePpg: 4.6, baseOpp: 4.3, rivals: { NYY: [42,48], BAL: [38,40] } },
  { id: "nyy", name: "Yankees", abbr: "NYY", city: "New York", conf: "AL East", baseWin: 0.58, basePpg: 4.8, baseOpp: 4.1, rivals: { BOS: [48,42], TB: [38,35] } },
  { id: "tb", name: "Rays", abbr: "TB", city: "Tampa Bay", conf: "AL East", baseWin: 0.55, basePpg: 4.2, baseOpp: 3.9, rivals: { NYY: [35,38], BOS: [36,34] } },
  { id: "tor_b", name: "Blue Jays", abbr: "TOR", city: "Toronto", conf: "AL East", baseWin: 0.48, basePpg: 4.4, baseOpp: 4.3, rivals: { NYY: [30,40], BOS: [34,36] } },
  // AL Central
  { id: "chw", name: "White Sox", abbr: "CWS", city: "Chicago", conf: "AL Central", baseWin: 0.38, basePpg: 3.8, baseOpp: 4.5, rivals: { CLE: [32,38], MIN: [34,34] } },
  { id: "cle_b", name: "Guardians", abbr: "CLE", city: "Cleveland", conf: "AL Central", baseWin: 0.55, basePpg: 4.2, baseOpp: 3.9, rivals: { CWS: [38,32], MIN: [38,34] } },
  { id: "det_b", name: "Tigers", abbr: "DET", city: "Detroit", conf: "AL Central", baseWin: 0.42, basePpg: 3.8, baseOpp: 4.3, rivals: { CLE: [32,38], MIN: [34,34] } },
  { id: "kcr", name: "Royals", abbr: "KC", city: "Kansas City", conf: "AL Central", baseWin: 0.42, basePpg: 4.0, baseOpp: 4.4, rivals: { CLE: [30,36], MIN: [34,32] } },
  { id: "min_b", name: "Twins", abbr: "MIN", city: "Minnesota", conf: "AL Central", baseWin: 0.50, basePpg: 4.3, baseOpp: 4.2, rivals: { CLE: [34,38], CWS: [34,34] } },
  // AL West
  { id: "hou_b", name: "Astros", abbr: "HOU", city: "Houston", conf: "AL West", baseWin: 0.60, basePpg: 4.8, baseOpp: 3.8, rivals: { TEX: [42,32], SEA: [40,32] } },
  { id: "laa", name: "Angels", abbr: "LAA", city: "Los Angeles", conf: "AL West", baseWin: 0.42, basePpg: 4.1, baseOpp: 4.5, rivals: { HOU: [28,38], SEA: [34,34] } },
  { id: "oak", name: "Athletics", abbr: "OAK", city: "Oakland", conf: "AL West", baseWin: 0.38, basePpg: 3.7, baseOpp: 4.5, rivals: { HOU: [26,40], SEA: [30,36] } },
  { id: "sea_b", name: "Mariners", abbr: "SEA", city: "Seattle", conf: "AL West", baseWin: 0.50, basePpg: 4.0, baseOpp: 3.9, rivals: { HOU: [32,40], TEX: [34,34] } },
  { id: "tex", name: "Rangers", abbr: "TEX", city: "Texas", conf: "AL West", baseWin: 0.50, basePpg: 4.5, baseOpp: 4.3, rivals: { HOU: [32,42], SEA: [34,34] } },
  // NL East
  { id: "atl_b", name: "Braves", abbr: "ATL", city: "Atlanta", conf: "NL East", baseWin: 0.58, basePpg: 4.8, baseOpp: 4.0, rivals: { NYM: [42,34], PHI: [38,36] } },
  { id: "mia_b", name: "Marlins", abbr: "MIA", city: "Miami", conf: "NL East", baseWin: 0.40, basePpg: 3.6, baseOpp: 4.4, rivals: { ATL: [28,38], NYM: [32,34] } },
  { id: "nym", name: "Mets", abbr: "NYM", city: "New York", conf: "NL East", baseWin: 0.48, basePpg: 4.3, baseOpp: 4.2, rivals: { ATL: [34,42], PHI: [36,38] } },
  { id: "phi_b", name: "Phillies", abbr: "PHI", city: "Philadelphia", conf: "NL East", baseWin: 0.55, basePpg: 4.6, baseOpp: 4.0, rivals: { ATL: [36,38], NYM: [38,36] } },
  { id: "wsh", name: "Nationals", abbr: "WSH", city: "Washington", conf: "NL East", baseWin: 0.42, basePpg: 4.0, baseOpp: 4.4, rivals: { ATL: [28,38], PHI: [30,36] } },
  // NL Central
  { id: "chc", name: "Cubs", abbr: "CHC", city: "Chicago", conf: "NL Central", baseWin: 0.48, basePpg: 4.2, baseOpp: 4.2, rivals: { STL: [36,40], MIL: [36,36] } },
  { id: "cin_b", name: "Reds", abbr: "CIN", city: "Cincinnati", conf: "NL Central", baseWin: 0.45, basePpg: 4.3, baseOpp: 4.5, rivals: { STL: [32,38], MIL: [34,34] } },
  { id: "mil_b", name: "Brewers", abbr: "MIL", city: "Milwaukee", conf: "NL Central", baseWin: 0.55, basePpg: 4.4, baseOpp: 4.0, rivals: { STL: [38,36], CHC: [36,36] } },
  { id: "pit_b", name: "Pirates", abbr: "PIT", city: "Pittsburgh", conf: "NL Central", baseWin: 0.40, basePpg: 3.8, baseOpp: 4.4, rivals: { STL: [28,38], CHC: [30,34] } },
  { id: "stl", name: "Cardinals", abbr: "STL", city: "St. Louis", conf: "NL Central", baseWin: 0.52, basePpg: 4.4, baseOpp: 4.1, rivals: { CHC: [40,36], MIL: [36,38] } },
  // NL West
  { id: "ari_b", name: "Diamondbacks", abbr: "ARI", city: "Arizona", conf: "NL West", baseWin: 0.48, basePpg: 4.3, baseOpp: 4.3, rivals: { LAD: [30,40], SF: [34,34] } },
  { id: "col", name: "Rockies", abbr: "COL", city: "Colorado", conf: "NL West", baseWin: 0.38, basePpg: 4.2, baseOpp: 5.0, rivals: { LAD: [24,42], SF: [28,36] } },
  { id: "lad", name: "Dodgers", abbr: "LAD", city: "Los Angeles", conf: "NL West", baseWin: 0.62, basePpg: 5.0, baseOpp: 3.8, rivals: { SF: [42,38], SD: [40,32] } },
  { id: "sd", name: "Padres", abbr: "SD", city: "San Diego", conf: "NL West", baseWin: 0.50, basePpg: 4.3, baseOpp: 4.2, rivals: { LAD: [32,40], SF: [36,34] } },
  { id: "sfg", name: "Giants", abbr: "SF", city: "San Francisco", conf: "NL West", baseWin: 0.48, basePpg: 4.1, baseOpp: 4.2, rivals: { LAD: [38,42], SD: [34,36] } },
];

const P: PlayerDef[] = [
  { id: "judge", name: "Aaron Judge", pos: "RF", team: "Yankees", teamAbbr: "NYY", yrs: 9, base: { avg: 0.284, homeRuns: 42, rbi: 105, obp: 0.394, slg: 0.620, ops: 1.014, runs: 100, hits: 148 } },
  { id: "ohtani", name: "Shohei Ohtani", pos: "DH", team: "Dodgers", teamAbbr: "LAD", yrs: 8, base: { avg: 0.275, homeRuns: 38, rbi: 95, obp: 0.365, slg: 0.580, ops: 0.945, runs: 90, hits: 140 } },
  { id: "acuna", name: "Ronald Acuna Jr.", pos: "RF", team: "Braves", teamAbbr: "ATL", yrs: 7, base: { avg: 0.282, homeRuns: 30, rbi: 85, obp: 0.370, slg: 0.540, ops: 0.910, runs: 100, hits: 155 } },
  { id: "soto", name: "Juan Soto", pos: "RF", team: "Mets", teamAbbr: "NYM", yrs: 7, base: { avg: 0.285, homeRuns: 30, rbi: 90, obp: 0.410, slg: 0.530, ops: 0.940, runs: 95, hits: 145 } },
  { id: "trout", name: "Mike Trout", pos: "CF", team: "Angels", teamAbbr: "LAA", base: { avg: 0.280, homeRuns: 35, rbi: 85, obp: 0.395, slg: 0.580, ops: 0.975, runs: 90, hits: 140 } },
  { id: "betts", name: "Mookie Betts", pos: "SS", team: "Dodgers", teamAbbr: "LAD", base: { avg: 0.290, homeRuns: 28, rbi: 80, obp: 0.380, slg: 0.530, ops: 0.910, runs: 100, hits: 160 } },
  { id: "tatis", name: "Fernando Tatis Jr.", pos: "RF", team: "Padres", teamAbbr: "SD", yrs: 5, base: { avg: 0.278, homeRuns: 32, rbi: 80, obp: 0.355, slg: 0.560, ops: 0.915, runs: 85, hits: 130 } },
  { id: "vlad_jr", name: "Vladimir Guerrero Jr.", pos: "1B", team: "Blue Jays", teamAbbr: "TOR", yrs: 6, base: { avg: 0.290, homeRuns: 30, rbi: 95, obp: 0.360, slg: 0.520, ops: 0.880, runs: 80, hits: 160 } },
  { id: "tucker", name: "Kyle Tucker", pos: "LF", team: "Cubs", teamAbbr: "CHC", yrs: 6, base: { avg: 0.278, homeRuns: 28, rbi: 85, obp: 0.365, slg: 0.520, ops: 0.885, runs: 85, hits: 148 } },
  { id: "freeman", name: "Freddie Freeman", pos: "1B", team: "Dodgers", teamAbbr: "LAD", base: { avg: 0.295, homeRuns: 25, rbi: 90, obp: 0.385, slg: 0.510, ops: 0.895, runs: 95, hits: 175 } },
  { id: "ramirez_j", name: "Jose Ramirez", pos: "3B", team: "Guardians", teamAbbr: "CLE", base: { avg: 0.280, homeRuns: 28, rbi: 95, obp: 0.355, slg: 0.520, ops: 0.875, runs: 90, hits: 155 } },
  { id: "altuve", name: "Jose Altuve", pos: "2B", team: "Astros", teamAbbr: "HOU", base: { avg: 0.290, homeRuns: 22, rbi: 70, obp: 0.355, slg: 0.470, ops: 0.825, runs: 85, hits: 168 } },
  { id: "arenado", name: "Nolan Arenado", pos: "3B", team: "Cardinals", teamAbbr: "STL", base: { avg: 0.280, homeRuns: 28, rbi: 90, obp: 0.340, slg: 0.510, ops: 0.850, runs: 75, hits: 155 } },
  { id: "devers", name: "Rafael Devers", pos: "3B", team: "Red Sox", teamAbbr: "BOS", yrs: 8, base: { avg: 0.280, homeRuns: 30, rbi: 90, obp: 0.345, slg: 0.520, ops: 0.865, runs: 85, hits: 160 } },
  { id: "lindor", name: "Francisco Lindor", pos: "SS", team: "Mets", teamAbbr: "NYM", base: { avg: 0.268, homeRuns: 26, rbi: 85, obp: 0.340, slg: 0.480, ops: 0.820, runs: 90, hits: 148 } },
];

export const mlbTeams = buildTeams(T, 'MLB');
export const mlbPlayers = buildPlayers(P, 'MLB');
