// Additional sports data: NFL, MLB, NHL, Esports
import type { Team, Game, Player, PropLine, MatchupHistory, Sport, SeasonAverages } from "./mockData";

function calcHitRate(avg: number, line: number): number {
  const diff = avg - line;
  const base = 50 + (diff / avg) * 100;
  return Math.max(15, Math.min(92, Math.round(base)));
}

// ===================== NFL =====================
export const nflTeams: Team[] = [
  { id: "kc", name: "Chiefs", abbreviation: "KC", city: "Kansas City", record: "15-2", conference: "AFC", division: "West", sport: "NFL", ranking: 1, stats: { ppg: 28.2, oppPpg: 17.8, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0.8, steals: 0, blocks: 0, ypg: 385.5, rushYpg: 128.2, passYpg: 257.3, oppYpg: 310.2, thirdDownPct: 44.8, redZonePct: 62.5, sacks: 45, takeaways: 28 } },
  { id: "det", name: "Lions", abbreviation: "DET", city: "Detroit", record: "15-2", conference: "NFC", division: "North", sport: "NFL", ranking: 2, stats: { ppg: 33.2, oppPpg: 20.1, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0.7, steals: 0, blocks: 0, ypg: 410.8, rushYpg: 148.5, passYpg: 262.3, oppYpg: 325.5, thirdDownPct: 46.2, redZonePct: 68.5, sacks: 52, takeaways: 30 } },
  { id: "buf", name: "Bills", abbreviation: "BUF", city: "Buffalo", record: "13-4", conference: "AFC", division: "East", sport: "NFL", ranking: 3, stats: { ppg: 30.5, oppPpg: 19.5, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0.9, steals: 0, blocks: 0, ypg: 395.2, rushYpg: 155.8, passYpg: 239.4, oppYpg: 315.8, thirdDownPct: 45.5, redZonePct: 65.2, sacks: 48, takeaways: 26 } },
  { id: "phi", name: "Eagles", abbreviation: "PHI", city: "Philadelphia", record: "14-3", conference: "NFC", division: "East", sport: "NFL", ranking: 4, stats: { ppg: 27.8, oppPpg: 16.2, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0.6, steals: 0, blocks: 0, ypg: 375.8, rushYpg: 192.5, passYpg: 183.3, oppYpg: 292.5, thirdDownPct: 42.8, redZonePct: 60.2, sacks: 55, takeaways: 32 } },
  { id: "bal", name: "Ravens", abbreviation: "BAL", city: "Baltimore", record: "12-5", conference: "AFC", division: "North", sport: "NFL", ranking: 5, stats: { ppg: 30.8, oppPpg: 21.5, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 1.0, steals: 0, blocks: 0, ypg: 425.2, rushYpg: 198.5, passYpg: 226.7, oppYpg: 335.8, thirdDownPct: 47.2, redZonePct: 70.5, sacks: 50, takeaways: 22 } },
  { id: "sf", name: "49ers", abbreviation: "SF", city: "San Francisco", record: "6-11", conference: "NFC", division: "West", sport: "NFL", stats: { ppg: 22.5, oppPpg: 24.8, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 1.2, steals: 0, blocks: 0, ypg: 345.2, rushYpg: 115.8, passYpg: 229.4, oppYpg: 355.8, thirdDownPct: 38.5, redZonePct: 55.2, sacks: 38, takeaways: 18 } },
];

export const nflGames: Game[] = [
  {
    id: "nfl1", homeTeam: nflTeams[0], awayTeam: nflTeams[2], time: "1:00 PM ET", date: "Sunday", status: "scheduled", sport: "NFL",
    moneyline: [
      { sportsbook: "FanDuel", home: -165, away: 140 }, { sportsbook: "DraftKings", home: -160, away: 135 },
      { sportsbook: "Fanatics", home: -170, away: 145 }, { sportsbook: "BetMGM", home: -158, away: 132 },
    ],
    spread: [
      { sportsbook: "FanDuel", home: -3.5, away: 3.5, homeOdds: -110, awayOdds: -110 },
      { sportsbook: "DraftKings", home: -3.0, away: 3.0, homeOdds: -115, awayOdds: -105 },
      { sportsbook: "Fanatics", home: -3.5, away: 3.5, homeOdds: -108, awayOdds: -112 },
      { sportsbook: "BetMGM", home: -3.5, away: 3.5, homeOdds: -110, awayOdds: -110 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 51.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 52.0, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 51.5, over: -112, under: -108 }, { sportsbook: "BetMGM", total: 52.5, over: -110, under: -110 },
    ],
  },
  {
    id: "nfl2", homeTeam: nflTeams[1], awayTeam: nflTeams[3], time: "4:25 PM ET", date: "Sunday", status: "scheduled", sport: "NFL",
    moneyline: [
      { sportsbook: "FanDuel", home: -140, away: 120 }, { sportsbook: "DraftKings", home: -135, away: 115 },
      { sportsbook: "Fanatics", home: -145, away: 125 }, { sportsbook: "BetMGM", home: -138, away: 118 },
    ],
    spread: [
      { sportsbook: "FanDuel", home: -2.5, away: 2.5, homeOdds: -110, awayOdds: -110 },
      { sportsbook: "DraftKings", home: -3.0, away: 3.0, homeOdds: -105, awayOdds: -115 },
      { sportsbook: "Fanatics", home: -2.5, away: 2.5, homeOdds: -112, awayOdds: -108 },
      { sportsbook: "BetMGM", home: -2.5, away: 2.5, homeOdds: -110, awayOdds: -110 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 48.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 49.0, over: -110, under: -110 },
      { sportsbook: "Fanatics", total: 48.0, over: -108, under: -112 }, { sportsbook: "BetMGM", total: 49.5, over: -112, under: -108 },
    ],
  },
];

// NFL players: points=passYd/G, rebounds=rushYd/G, assists=TDs/G, steals=targets, turnovers=INT/G, fgPct=cmp%, ftPct=QBR
export const nflPlayers: Player[] = [
  {
    id: "pm15", name: "Patrick Mahomes", team: "Chiefs", teamAbbr: "KC", position: "QB", number: 15, sport: "NFL",
    stats: { gamesPlayed: 16 },
    seasonAverages: { points: 278.5, rebounds: 25.2, assists: 2.1, steals: 0, blocks: 0, turnovers: 0.7, minutes: 0, fgPct: 67.2, threePct: 0, ftPct: 82.5 },
    last10: { points: 285.2, rebounds: 28.5, assists: 2.3, steals: 0, blocks: 0, turnovers: 0.6, minutes: 0, fgPct: 68.5, threePct: 0, ftPct: 85.2 },
    last5: { points: 295.8, rebounds: 32.1, assists: 2.6, steals: 0, blocks: 0, turnovers: 0.5, minutes: 0, fgPct: 70.1, threePct: 0, ftPct: 88.1 },
  },
  {
    id: "ja5", name: "Josh Allen", team: "Bills", teamAbbr: "BUF", position: "QB", number: 17, sport: "NFL",
    stats: { gamesPlayed: 16 },
    seasonAverages: { points: 265.2, rebounds: 52.8, assists: 2.4, steals: 0, blocks: 0, turnovers: 0.8, minutes: 0, fgPct: 63.8, threePct: 0, ftPct: 78.2 },
    last10: { points: 272.5, rebounds: 55.2, assists: 2.6, steals: 0, blocks: 0, turnovers: 0.7, minutes: 0, fgPct: 65.2, threePct: 0, ftPct: 80.5 },
    last5: { points: 280.1, rebounds: 58.5, assists: 2.8, steals: 0, blocks: 0, turnovers: 0.6, minutes: 0, fgPct: 66.8, threePct: 0, ftPct: 82.8 },
  },
  {
    id: "lj8", name: "Lamar Jackson", team: "Ravens", teamAbbr: "BAL", position: "QB", number: 8, sport: "NFL",
    stats: { gamesPlayed: 16 },
    seasonAverages: { points: 245.8, rebounds: 72.5, assists: 2.6, steals: 0, blocks: 0, turnovers: 0.6, minutes: 0, fgPct: 66.5, threePct: 0, ftPct: 85.8 },
    last10: { points: 255.2, rebounds: 78.2, assists: 2.8, steals: 0, blocks: 0, turnovers: 0.5, minutes: 0, fgPct: 68.2, threePct: 0, ftPct: 88.2 },
    last5: { points: 262.5, rebounds: 82.5, assists: 3.0, steals: 0, blocks: 0, turnovers: 0.4, minutes: 0, fgPct: 70.5, threePct: 0, ftPct: 90.5 },
  },
  {
    id: "dh4", name: "Derrick Henry", team: "Ravens", teamAbbr: "BAL", position: "RB", number: 22, sport: "NFL",
    stats: { gamesPlayed: 16 },
    seasonAverages: { points: 108.5, rebounds: 2.5, assists: 1.2, steals: 18.2, blocks: 0, turnovers: 0.3, minutes: 0, fgPct: 5.2, threePct: 0, ftPct: 0 },
    last10: { points: 115.2, rebounds: 2.8, assists: 1.4, steals: 20.5, blocks: 0, turnovers: 0.2, minutes: 0, fgPct: 5.5, threePct: 0, ftPct: 0 },
    last5: { points: 122.8, rebounds: 3.2, assists: 1.6, steals: 22.8, blocks: 0, turnovers: 0.2, minutes: 0, fgPct: 5.8, threePct: 0, ftPct: 0 },
  },
  {
    id: "jj23", name: "Ja'Marr Chase", team: "Bengals", teamAbbr: "CIN", position: "WR", number: 1, sport: "NFL",
    stats: { gamesPlayed: 16 },
    seasonAverages: { points: 6.8, rebounds: 98.5, assists: 0.8, steals: 9.2, blocks: 0, turnovers: 0.1, minutes: 0, fgPct: 14.5, threePct: 0, ftPct: 0 },
    last10: { points: 7.2, rebounds: 105.2, assists: 0.9, steals: 9.8, blocks: 0, turnovers: 0.1, minutes: 0, fgPct: 15.2, threePct: 0, ftPct: 0 },
    last5: { points: 7.8, rebounds: 112.5, assists: 1.0, steals: 10.5, blocks: 0, turnovers: 0.0, minutes: 0, fgPct: 15.8, threePct: 0, ftPct: 0 },
  },
];

export const nflProps: PropLine[] = [
  { id: "nflp1", playerId: "pm15", playerName: "Patrick Mahomes", teamAbbr: "KC", stat: "Pass Yards", line: 275.5, gamesPlayed: 16, sport: "NFL", hitRate: 62, hitRateLast10: 68, sportsbooks: [{ sportsbook: "FanDuel", line: 275.5, over: -115, under: -105 }, { sportsbook: "DraftKings", line: 278.5, over: -110, under: -110 }, { sportsbook: "Fanatics", line: 275.5, over: -112, under: -108 }, { sportsbook: "BetMGM", line: 280.5, over: -105, under: -115 }] },
  { id: "nflp2", playerId: "pm15", playerName: "Patrick Mahomes", teamAbbr: "KC", stat: "Pass TDs", line: 2.5, gamesPlayed: 16, sport: "NFL", hitRate: 55, hitRateLast10: 60, sportsbooks: [{ sportsbook: "FanDuel", line: 2.5, over: 120, under: -145 }, { sportsbook: "DraftKings", line: 2.5, over: 115, under: -140 }, { sportsbook: "Fanatics", line: 2.5, over: 125, under: -150 }, { sportsbook: "BetMGM", line: 2.5, over: 118, under: -142 }] },
  { id: "nflp3", playerId: "ja5", playerName: "Josh Allen", teamAbbr: "BUF", stat: "Pass Yards", line: 265.5, gamesPlayed: 16, sport: "NFL", hitRate: 58, hitRateLast10: 65, sportsbooks: [{ sportsbook: "FanDuel", line: 265.5, over: -112, under: -108 }, { sportsbook: "DraftKings", line: 268.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 265.5, over: -110, under: -110 }, { sportsbook: "BetMGM", line: 270.5, over: -105, under: -115 }] },
  { id: "nflp4", playerId: "ja5", playerName: "Josh Allen", teamAbbr: "BUF", stat: "Rush Yards", line: 42.5, gamesPlayed: 16, sport: "NFL", hitRate: 60, hitRateLast10: 62, sportsbooks: [{ sportsbook: "FanDuel", line: 42.5, over: -110, under: -110 }, { sportsbook: "DraftKings", line: 44.5, over: -105, under: -115 }, { sportsbook: "Fanatics", line: 42.5, over: -108, under: -112 }, { sportsbook: "BetMGM", line: 43.5, over: -110, under: -110 }] },
];

// ===================== MLB =====================
export const mlbTeams: Team[] = [
  { id: "lad", name: "Dodgers", abbreviation: "LAD", city: "Los Angeles", record: "98-64", conference: "NL", division: "West", sport: "MLB", ranking: 1, stats: { ppg: 5.5, oppPpg: 3.8, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "nyy", name: "Yankees", abbreviation: "NYY", city: "New York", record: "94-68", conference: "AL", division: "East", sport: "MLB", ranking: 2, stats: { ppg: 5.2, oppPpg: 4.0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "atl", name: "Braves", abbreviation: "ATL", city: "Atlanta", record: "89-73", conference: "NL", division: "East", sport: "MLB", ranking: 5, stats: { ppg: 4.8, oppPpg: 3.9, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "hou_mlb", name: "Astros", abbreviation: "HOU", city: "Houston", record: "88-74", conference: "AL", division: "West", sport: "MLB", ranking: 6, stats: { ppg: 4.6, oppPpg: 3.8, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "phi_mlb", name: "Phillies", abbreviation: "PHI", city: "Philadelphia", record: "95-67", conference: "NL", division: "East", sport: "MLB", ranking: 3, stats: { ppg: 5.1, oppPpg: 3.7, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "cle_mlb", name: "Guardians", abbreviation: "CLE", city: "Cleveland", record: "92-70", conference: "AL", division: "Central", sport: "MLB", ranking: 4, stats: { ppg: 4.5, oppPpg: 3.5, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
];

export const mlbGames: Game[] = [
  {
    id: "mlb1", homeTeam: mlbTeams[0], awayTeam: mlbTeams[1], time: "7:10 PM ET", date: "Today", status: "scheduled", sport: "MLB",
    moneyline: [
      { sportsbook: "FanDuel", home: -155, away: 132 }, { sportsbook: "DraftKings", home: -150, away: 128 },
      { sportsbook: "Fanatics", home: -160, away: 135 }, { sportsbook: "BetMGM", home: -152, away: 130 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 8.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 8.5, over: -105, under: -115 },
      { sportsbook: "Fanatics", total: 9.0, over: -112, under: -108 }, { sportsbook: "BetMGM", total: 8.5, over: -108, under: -112 },
    ],
  },
  {
    id: "mlb2", homeTeam: mlbTeams[4], awayTeam: mlbTeams[2], time: "7:05 PM ET", date: "Today", status: "scheduled", sport: "MLB",
    moneyline: [
      { sportsbook: "FanDuel", home: -135, away: 115 }, { sportsbook: "DraftKings", home: -130, away: 110 },
      { sportsbook: "Fanatics", home: -140, away: 120 }, { sportsbook: "BetMGM", home: -132, away: 112 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 7.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 8.0, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 7.5, over: -115, under: -105 }, { sportsbook: "BetMGM", total: 7.5, over: -110, under: -110 },
    ],
  },
];

// MLB players: points=HR, rebounds=RBI, assists=Hits, steals=SB, blocks=BB, fgPct=AVG(x1000), threePct=OPS
export const mlbPlayers: Player[] = [
  {
    id: "so17", name: "Shohei Ohtani", team: "Dodgers", teamAbbr: "LAD", position: "DH", number: 17, sport: "MLB",
    stats: { gamesPlayed: 159 },
    seasonAverages: { points: 54, rebounds: 130, assists: 197, steals: 59, blocks: 81, turnovers: 0, minutes: 0, fgPct: 304, threePct: 1.036, ftPct: 0 },
    last10: { points: 4, rebounds: 12, assists: 14, steals: 5, blocks: 8, turnovers: 0, minutes: 0, fgPct: 340, threePct: 1.125, ftPct: 0 },
    last5: { points: 3, rebounds: 8, assists: 8, steals: 3, blocks: 5, turnovers: 0, minutes: 0, fgPct: 360, threePct: 1.180, ftPct: 0 },
  },
  {
    id: "aj99", name: "Aaron Judge", team: "Yankees", teamAbbr: "NYY", position: "RF", number: 99, sport: "MLB",
    stats: { gamesPlayed: 158 },
    seasonAverages: { points: 58, rebounds: 144, assists: 180, steals: 3, blocks: 92, turnovers: 0, minutes: 0, fgPct: 322, threePct: 1.089, ftPct: 0 },
    last10: { points: 5, rebounds: 14, assists: 13, steals: 0, blocks: 10, turnovers: 0, minutes: 0, fgPct: 350, threePct: 1.145, ftPct: 0 },
    last5: { points: 3, rebounds: 9, assists: 7, steals: 0, blocks: 6, turnovers: 0, minutes: 0, fgPct: 368, threePct: 1.200, ftPct: 0 },
  },
  {
    id: "mt27", name: "Mike Trout", team: "Angels", teamAbbr: "LAA", position: "CF", number: 27, sport: "MLB",
    stats: { gamesPlayed: 82 },
    seasonAverages: { points: 18, rebounds: 44, assists: 72, steals: 2, blocks: 52, turnovers: 0, minutes: 0, fgPct: 282, threePct: 0.918, ftPct: 0 },
    last10: { points: 2, rebounds: 6, assists: 8, steals: 1, blocks: 6, turnovers: 0, minutes: 0, fgPct: 310, threePct: 0.985, ftPct: 0 },
    last5: { points: 1, rebounds: 4, assists: 5, steals: 0, blocks: 3, turnovers: 0, minutes: 0, fgPct: 325, threePct: 1.010, ftPct: 0 },
  },
];

export const mlbProps: PropLine[] = [
  { id: "mlbp1", playerId: "so17", playerName: "Shohei Ohtani", teamAbbr: "LAD", stat: "Total Bases", line: 1.5, gamesPlayed: 159, sport: "MLB", hitRate: 65, hitRateLast10: 72, sportsbooks: [{ sportsbook: "FanDuel", line: 1.5, over: -145, under: 120 }, { sportsbook: "DraftKings", line: 1.5, over: -140, under: 118 }, { sportsbook: "Fanatics", line: 1.5, over: -148, under: 125 }, { sportsbook: "BetMGM", line: 1.5, over: -142, under: 120 }] },
  { id: "mlbp2", playerId: "so17", playerName: "Shohei Ohtani", teamAbbr: "LAD", stat: "Hits+Runs+RBI", line: 2.5, gamesPlayed: 159, sport: "MLB", hitRate: 58, hitRateLast10: 64, sportsbooks: [{ sportsbook: "FanDuel", line: 2.5, over: -105, under: -115 }, { sportsbook: "DraftKings", line: 2.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 2.5, over: -102, under: -118 }, { sportsbook: "BetMGM", line: 2.5, over: -110, under: -110 }] },
  { id: "mlbp3", playerId: "aj99", playerName: "Aaron Judge", teamAbbr: "NYY", stat: "Total Bases", line: 1.5, gamesPlayed: 158, sport: "MLB", hitRate: 62, hitRateLast10: 68, sportsbooks: [{ sportsbook: "FanDuel", line: 1.5, over: -138, under: 115 }, { sportsbook: "DraftKings", line: 1.5, over: -135, under: 112 }, { sportsbook: "Fanatics", line: 1.5, over: -140, under: 118 }, { sportsbook: "BetMGM", line: 1.5, over: -136, under: 114 }] },
];

// ===================== NHL =====================
export const nhlTeams: Team[] = [
  { id: "wpg", name: "Jets", abbreviation: "WPG", city: "Winnipeg", record: "42-18-4", conference: "Western", division: "Central", sport: "NHL", ranking: 1, stats: { ppg: 3.5, oppPpg: 2.4, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "wsh", name: "Capitals", abbreviation: "WSH", city: "Washington", record: "38-20-5", conference: "Eastern", division: "Metropolitan", sport: "NHL", ranking: 2, stats: { ppg: 3.4, oppPpg: 2.6, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "vgk", name: "Golden Knights", abbreviation: "VGK", city: "Vegas", record: "36-20-7", conference: "Western", division: "Pacific", sport: "NHL", ranking: 4, stats: { ppg: 3.2, oppPpg: 2.5, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "fla_nhl", name: "Panthers", abbreviation: "FLA", city: "Florida", record: "37-21-5", conference: "Eastern", division: "Atlantic", sport: "NHL", ranking: 3, stats: { ppg: 3.3, oppPpg: 2.5, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "tor", name: "Maple Leafs", abbreviation: "TOR", city: "Toronto", record: "36-20-6", conference: "Eastern", division: "Atlantic", sport: "NHL", ranking: 5, stats: { ppg: 3.4, oppPpg: 2.7, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "dal_nhl", name: "Stars", abbreviation: "DAL", city: "Dallas", record: "37-21-4", conference: "Western", division: "Central", sport: "NHL", ranking: 6, stats: { ppg: 3.1, oppPpg: 2.4, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
];

export const nhlGames: Game[] = [
  {
    id: "nhl1", homeTeam: nhlTeams[0], awayTeam: nhlTeams[4], time: "7:00 PM ET", date: "Today", status: "scheduled", sport: "NHL",
    moneyline: [
      { sportsbook: "FanDuel", home: -165, away: 140 }, { sportsbook: "DraftKings", home: -160, away: 135 },
      { sportsbook: "Fanatics", home: -170, away: 145 }, { sportsbook: "BetMGM", home: -162, away: 138 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 6.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 6.5, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 6.5, over: -115, under: -105 }, { sportsbook: "BetMGM", total: 6.0, over: -105, under: -115 },
    ],
  },
  {
    id: "nhl2", homeTeam: nhlTeams[3], awayTeam: nhlTeams[1], time: "7:30 PM ET", date: "Today", status: "scheduled", sport: "NHL",
    moneyline: [
      { sportsbook: "FanDuel", home: -125, away: 105 }, { sportsbook: "DraftKings", home: -120, away: 100 },
      { sportsbook: "Fanatics", home: -130, away: 110 }, { sportsbook: "BetMGM", home: -122, away: 102 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 6.0, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 6.0, over: -105, under: -115 },
      { sportsbook: "Fanatics", total: 5.5, over: -105, under: -115 }, { sportsbook: "BetMGM", total: 6.0, over: -112, under: -108 },
    ],
  },
];

// NHL players: points=Goals, rebounds=TotalPts, assists=Assists, steals=+/-, blocks=SOG, turnovers=PIM, minutes=TOI
export const nhlPlayers: Player[] = [
  {
    id: "ao8", name: "Alex Ovechkin", team: "Capitals", teamAbbr: "WSH", position: "LW", number: 8, sport: "NHL",
    stats: { gamesPlayed: 58 },
    seasonAverages: { points: 28, rebounds: 52, assists: 24, steals: 12, blocks: 225, turnovers: 42, minutes: 18.5, fgPct: 0, threePct: 0, ftPct: 0 },
    last10: { points: 5, rebounds: 9, assists: 4, steals: 3, blocks: 42, turnovers: 8, minutes: 19.2, fgPct: 0, threePct: 0, ftPct: 0 },
    last5: { points: 3, rebounds: 5, assists: 2, steals: 2, blocks: 22, turnovers: 4, minutes: 19.8, fgPct: 0, threePct: 0, ftPct: 0 },
  },
  {
    id: "cm97", name: "Connor McDavid", team: "Oilers", teamAbbr: "EDM", position: "C", number: 97, sport: "NHL",
    stats: { gamesPlayed: 60 },
    seasonAverages: { points: 22, rebounds: 82, assists: 60, steals: 18, blocks: 198, turnovers: 28, minutes: 21.5, fgPct: 0, threePct: 0, ftPct: 0 },
    last10: { points: 4, rebounds: 15, assists: 11, steals: 5, blocks: 38, turnovers: 4, minutes: 22.1, fgPct: 0, threePct: 0, ftPct: 0 },
    last5: { points: 3, rebounds: 9, assists: 6, steals: 3, blocks: 20, turnovers: 2, minutes: 22.5, fgPct: 0, threePct: 0, ftPct: 0 },
  },
  {
    id: "am34", name: "Auston Matthews", team: "Maple Leafs", teamAbbr: "TOR", position: "C", number: 34, sport: "NHL",
    stats: { gamesPlayed: 55 },
    seasonAverages: { points: 30, rebounds: 55, assists: 25, steals: 15, blocks: 210, turnovers: 22, minutes: 20.8, fgPct: 0, threePct: 0, ftPct: 0 },
    last10: { points: 6, rebounds: 10, assists: 4, steals: 4, blocks: 42, turnovers: 2, minutes: 21.2, fgPct: 0, threePct: 0, ftPct: 0 },
    last5: { points: 4, rebounds: 6, assists: 2, steals: 3, blocks: 22, turnovers: 0, minutes: 21.5, fgPct: 0, threePct: 0, ftPct: 0 },
  },
];

export const nhlProps: PropLine[] = [
  { id: "nhlp1", playerId: "ao8", playerName: "Alex Ovechkin", teamAbbr: "WSH", stat: "Shots on Goal", line: 3.5, gamesPlayed: 58, sport: "NHL", hitRate: 55, hitRateLast10: 60, sportsbooks: [{ sportsbook: "FanDuel", line: 3.5, over: -115, under: -105 }, { sportsbook: "DraftKings", line: 3.5, over: -110, under: -110 }, { sportsbook: "Fanatics", line: 3.5, over: -118, under: -102 }, { sportsbook: "BetMGM", line: 4.5, over: 125, under: -150 }] },
  { id: "nhlp2", playerId: "ao8", playerName: "Alex Ovechkin", teamAbbr: "WSH", stat: "Points", line: 0.5, gamesPlayed: 58, sport: "NHL", hitRate: 68, hitRateLast10: 72, sportsbooks: [{ sportsbook: "FanDuel", line: 0.5, over: -142, under: 118 }, { sportsbook: "DraftKings", line: 0.5, over: -138, under: 115 }, { sportsbook: "Fanatics", line: 0.5, over: -145, under: 120 }, { sportsbook: "BetMGM", line: 0.5, over: -140, under: 118 }] },
];

// ===================== ESPORTS =====================
export const esportsTeams: Team[] = [
  // League of Legends
  { id: "t1", name: "T1", abbreviation: "T1", city: "Seoul", record: "14-2", conference: "LCK", division: "LCK", sport: "LOL", ranking: 1, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "geng", name: "Gen.G", abbreviation: "GEN", city: "Seoul", record: "13-3", conference: "LCK", division: "LCK", sport: "LOL", ranking: 2, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "blg", name: "Bilibili Gaming", abbreviation: "BLG", city: "Shanghai", record: "12-4", conference: "LPL", division: "LPL", sport: "LOL", ranking: 3, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "fnc", name: "Fnatic", abbreviation: "FNC", city: "London", record: "11-5", conference: "LEC", division: "LEC", sport: "LOL", ranking: 5, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  // CS2
  { id: "navi", name: "Natus Vincere", abbreviation: "NAVI", city: "Kyiv", record: "22-5", conference: "Tier 1", division: "Europe", sport: "CS2", ranking: 1, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "faze", name: "FaZe Clan", abbreviation: "FAZE", city: "Los Angeles", record: "20-7", conference: "Tier 1", division: "International", sport: "CS2", ranking: 2, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "vitality", name: "Team Vitality", abbreviation: "VIT", city: "Paris", record: "19-8", conference: "Tier 1", division: "Europe", sport: "CS2", ranking: 3, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "spirit", name: "Team Spirit", abbreviation: "SPR", city: "Moscow", record: "18-9", conference: "Tier 1", division: "CIS", sport: "CS2", ranking: 4, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  // Valorant
  { id: "sen", name: "Sentinels", abbreviation: "SEN", city: "Los Angeles", record: "10-3", conference: "VCT Americas", division: "Americas", sport: "VAL", ranking: 1, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "loud", name: "LOUD", abbreviation: "LOUD", city: "São Paulo", record: "9-4", conference: "VCT Americas", division: "Americas", sport: "VAL", ranking: 2, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "prx", name: "Paper Rex", abbreviation: "PRX", city: "Singapore", record: "11-2", conference: "VCT Pacific", division: "Pacific", sport: "VAL", ranking: 3, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "fnc_val", name: "Fnatic", abbreviation: "FNC", city: "London", record: "10-3", conference: "VCT EMEA", division: "EMEA", sport: "VAL", ranking: 4, stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
];

export const esportsGames: Game[] = [
  // LoL
  {
    id: "lol1", homeTeam: esportsTeams[0], awayTeam: esportsTeams[1], time: "5:00 AM ET", date: "Today", status: "scheduled", sport: "LOL",
    moneyline: [
      { sportsbook: "FanDuel", home: -145, away: 122 }, { sportsbook: "DraftKings", home: -140, away: 118 },
      { sportsbook: "Fanatics", home: -150, away: 125 }, { sportsbook: "BetMGM", home: -142, away: 120 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 3.5, over: -115, under: -105 }, { sportsbook: "DraftKings", total: 3.5, over: -110, under: -110 },
      { sportsbook: "Fanatics", total: 3.5, over: -112, under: -108 }, { sportsbook: "BetMGM", total: 3.5, over: -108, under: -112 },
    ],
  },
  {
    id: "lol2", homeTeam: esportsTeams[2], awayTeam: esportsTeams[3], time: "8:00 AM ET", date: "Today", status: "scheduled", sport: "LOL",
    moneyline: [
      { sportsbook: "FanDuel", home: -200, away: 168 }, { sportsbook: "DraftKings", home: -195, away: 162 },
      { sportsbook: "Fanatics", home: -205, away: 172 }, { sportsbook: "BetMGM", home: -198, away: 165 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 3.5, over: -105, under: -115 }, { sportsbook: "DraftKings", total: 3.5, over: -102, under: -118 },
      { sportsbook: "Fanatics", total: 3.5, over: -108, under: -112 }, { sportsbook: "BetMGM", total: 3.5, over: -105, under: -115 },
    ],
  },
  // CS2
  {
    id: "cs1", homeTeam: esportsTeams[4], awayTeam: esportsTeams[5], time: "11:00 AM ET", date: "Today", status: "scheduled", sport: "CS2",
    moneyline: [
      { sportsbook: "FanDuel", home: -135, away: 115 }, { sportsbook: "DraftKings", home: -130, away: 110 },
      { sportsbook: "Fanatics", home: -140, away: 118 }, { sportsbook: "BetMGM", home: -132, away: 112 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 2.5, over: -110, under: -110 }, { sportsbook: "DraftKings", total: 2.5, over: -108, under: -112 },
      { sportsbook: "Fanatics", total: 2.5, over: -105, under: -115 }, { sportsbook: "BetMGM", total: 2.5, over: -112, under: -108 },
    ],
  },
  // Valorant
  {
    id: "val1", homeTeam: esportsTeams[8], awayTeam: esportsTeams[9], time: "3:00 PM ET", date: "Today", status: "scheduled", sport: "VAL",
    moneyline: [
      { sportsbook: "FanDuel", home: -125, away: 105 }, { sportsbook: "DraftKings", home: -120, away: 100 },
      { sportsbook: "Fanatics", home: -130, away: 110 }, { sportsbook: "BetMGM", home: -122, away: 102 },
    ],
    overUnder: [
      { sportsbook: "FanDuel", total: 2.5, over: -115, under: -105 }, { sportsbook: "DraftKings", total: 2.5, over: -110, under: -110 },
      { sportsbook: "Fanatics", total: 2.5, over: -112, under: -108 }, { sportsbook: "BetMGM", total: 2.5, over: -108, under: -112 },
    ],
  },
];
