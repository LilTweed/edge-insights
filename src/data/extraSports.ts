// Additional sports data: NFL, MLB, NHL
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

// ===================== UFC =====================
export const ufcTeams: Team[] = [
  { id: "ufc_hw", name: "Heavyweight", abbreviation: "HW", city: "UFC", record: "", conference: "Men's", division: "Heavyweight", sport: "UFC", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "ufc_lhw", name: "Light Heavyweight", abbreviation: "LHW", city: "UFC", record: "", conference: "Men's", division: "Light Heavyweight", sport: "UFC", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "ufc_mw", name: "Middleweight", abbreviation: "MW", city: "UFC", record: "", conference: "Men's", division: "Middleweight", sport: "UFC", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "ufc_ww", name: "Welterweight", abbreviation: "WW", city: "UFC", record: "", conference: "Men's", division: "Welterweight", sport: "UFC", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "ufc_lw", name: "Lightweight", abbreviation: "LW", city: "UFC", record: "", conference: "Men's", division: "Lightweight", sport: "UFC", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
];

export const ufcGames: Game[] = [];

// UFC players: stats repurposed — points=wins, rebounds=losses, assists=KOs, steals=submissions
export const ufcPlayers: Player[] = [
  { id: "ufc_ip", name: "Islam Makhachev", team: "Lightweight", teamAbbr: "LW", position: "Champion", number: 0, sport: "UFC", stats: { gamesPlayed: 26 }, seasonAverages: { points: 26, rebounds: 1, assists: 5, steals: 11, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last10: { points: 10, rebounds: 0, assists: 3, steals: 4, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last5: { points: 5, rebounds: 0, assists: 2, steals: 2, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 } },
  { id: "ufc_ad", name: "Alex Pereira", team: "Light Heavyweight", teamAbbr: "LHW", position: "Champion", number: 0, sport: "UFC", stats: { gamesPlayed: 12 }, seasonAverages: { points: 11, rebounds: 1, assists: 8, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last10: { points: 9, rebounds: 1, assists: 7, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last5: { points: 5, rebounds: 0, assists: 4, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 } },
  { id: "ufc_jj", name: "Jon Jones", team: "Heavyweight", teamAbbr: "HW", position: "Champion", number: 0, sport: "UFC", stats: { gamesPlayed: 29 }, seasonAverages: { points: 28, rebounds: 1, assists: 10, steals: 6, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last10: { points: 9, rebounds: 1, assists: 3, steals: 3, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last5: { points: 4, rebounds: 1, assists: 1, steals: 2, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 } },
  { id: "ufc_sd", name: "Sean O'Malley", team: "Bantamweight", teamAbbr: "BW", position: "Fighter", number: 0, sport: "UFC", stats: { gamesPlayed: 20 }, seasonAverages: { points: 18, rebounds: 2, assists: 11, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last10: { points: 8, rebounds: 2, assists: 5, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last5: { points: 4, rebounds: 1, assists: 3, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 } },
];

export const ufcProps: PropLine[] = [
  { id: "ufcp1", playerId: "ufc_ip", playerName: "Islam Makhachev", teamAbbr: "LW", stat: "Total Rounds", line: 2.5, gamesPlayed: 26, sport: "UFC", hitRate: 58, hitRateLast10: 62, sportsbooks: [{ sportsbook: "FanDuel", line: 2.5, over: -130, under: 108 }, { sportsbook: "DraftKings", line: 2.5, over: -125, under: 105 }, { sportsbook: "Fanatics", line: 2.5, over: -135, under: 112 }, { sportsbook: "BetMGM", line: 2.5, over: -128, under: 106 }] },
  { id: "ufcp2", playerId: "ufc_ad", playerName: "Alex Pereira", teamAbbr: "LHW", stat: "Total Rounds", line: 1.5, gamesPlayed: 12, sport: "UFC", hitRate: 42, hitRateLast10: 40, sportsbooks: [{ sportsbook: "FanDuel", line: 1.5, over: 105, under: -125 }, { sportsbook: "DraftKings", line: 1.5, over: 110, under: -130 }, { sportsbook: "Fanatics", line: 1.5, over: 108, under: -128 }, { sportsbook: "BetMGM", line: 1.5, over: 102, under: -122 }] },
  { id: "ufcp3", playerId: "ufc_jj", playerName: "Jon Jones", teamAbbr: "HW", stat: "Total Rounds", line: 3.5, gamesPlayed: 29, sport: "UFC", hitRate: 55, hitRateLast10: 50, sportsbooks: [{ sportsbook: "FanDuel", line: 3.5, over: -110, under: -110 }, { sportsbook: "DraftKings", line: 3.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 3.5, over: -115, under: -105 }, { sportsbook: "BetMGM", line: 3.5, over: -105, under: -115 }] },
];

// ===================== PGA (Golf) =====================
export const pgaTeams: Team[] = [
  { id: "pga_tour", name: "PGA Tour", abbreviation: "PGA", city: "PGA", record: "", conference: "PGA", division: "Tour", sport: "PGA", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "pga_liv", name: "LIV Golf", abbreviation: "LIV", city: "LIV", record: "", conference: "LIV", division: "LIV", sport: "PGA", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
];

export const pgaGames: Game[] = [];

// Golf players: points=wins(season), rebounds=top10s, assists=cuts made, fgPct=scoring avg, threePct=driving distance
export const pgaPlayers: Player[] = [
  { id: "pga_ss", name: "Scottie Scheffler", team: "PGA Tour", teamAbbr: "PGA", position: "No. 1", number: 0, sport: "PGA", stats: { gamesPlayed: 18 }, seasonAverages: { points: 9, rebounds: 14, assists: 17, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 68.2, threePct: 302.5, ftPct: 0 }, last10: { points: 5, rebounds: 8, assists: 10, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 67.8, threePct: 305.2, ftPct: 0 }, last5: { points: 3, rebounds: 4, assists: 5, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 67.5, threePct: 308.1, ftPct: 0 } },
  { id: "pga_rm", name: "Rory McIlroy", team: "PGA Tour", teamAbbr: "PGA", position: "No. 3", number: 0, sport: "PGA", stats: { gamesPlayed: 16 }, seasonAverages: { points: 3, rebounds: 10, assists: 14, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 69.1, threePct: 318.8, ftPct: 0 }, last10: { points: 2, rebounds: 6, assists: 9, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 68.8, threePct: 320.5, ftPct: 0 }, last5: { points: 1, rebounds: 3, assists: 5, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 69.2, threePct: 322.1, ftPct: 0 } },
  { id: "pga_xc", name: "Xander Schauffele", team: "PGA Tour", teamAbbr: "PGA", position: "No. 2", number: 0, sport: "PGA", stats: { gamesPlayed: 17 }, seasonAverages: { points: 4, rebounds: 11, assists: 15, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 68.5, threePct: 305.8, ftPct: 0 }, last10: { points: 3, rebounds: 7, assists: 9, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 68.2, threePct: 308.2, ftPct: 0 }, last5: { points: 2, rebounds: 4, assists: 5, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 67.9, threePct: 310.5, ftPct: 0 } },
];

export const pgaProps: PropLine[] = [
  { id: "pgap1", playerId: "pga_ss", playerName: "Scottie Scheffler", teamAbbr: "PGA", stat: "Top 10 Finish", line: 0.5, gamesPlayed: 18, sport: "PGA", hitRate: 78, hitRateLast10: 82, sportsbooks: [{ sportsbook: "FanDuel", line: 0.5, over: -220, under: 175 }, { sportsbook: "DraftKings", line: 0.5, over: -210, under: 168 }, { sportsbook: "Fanatics", line: 0.5, over: -225, under: 180 }, { sportsbook: "BetMGM", line: 0.5, over: -215, under: 172 }] },
  { id: "pgap2", playerId: "pga_rm", playerName: "Rory McIlroy", teamAbbr: "PGA", stat: "Top 10 Finish", line: 0.5, gamesPlayed: 16, sport: "PGA", hitRate: 62, hitRateLast10: 65, sportsbooks: [{ sportsbook: "FanDuel", line: 0.5, over: -155, under: 130 }, { sportsbook: "DraftKings", line: 0.5, over: -150, under: 125 }, { sportsbook: "Fanatics", line: 0.5, over: -160, under: 135 }, { sportsbook: "BetMGM", line: 0.5, over: -152, under: 128 }] },
];

// ===================== MLS =====================
export const mlsTeams: Team[] = [
  { id: "mls_lafc", name: "LAFC", abbreviation: "LAFC", city: "Los Angeles", record: "18-8-8", conference: "Western", division: "Western", sport: "MLS", stats: { ppg: 1.8, oppPpg: 1.1, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "mls_inter", name: "Inter Miami", abbreviation: "MIA", city: "Fort Lauderdale", record: "22-4-8", conference: "Eastern", division: "Eastern", sport: "MLS", ranking: 1, stats: { ppg: 2.3, oppPpg: 1.0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "mls_cin", name: "FC Cincinnati", abbreviation: "CIN", city: "Cincinnati", record: "17-9-8", conference: "Eastern", division: "Eastern", sport: "MLS", stats: { ppg: 1.6, oppPpg: 1.2, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "mls_col", name: "Columbus Crew", abbreviation: "CLB", city: "Columbus", record: "19-7-8", conference: "Eastern", division: "Eastern", sport: "MLS", ranking: 2, stats: { ppg: 1.9, oppPpg: 1.0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
];

export const mlsGames: Game[] = [];

export const mlsPlayers: Player[] = [
  { id: "mls_lm", name: "Lionel Messi", team: "Inter Miami", teamAbbr: "MIA", position: "FW", number: 10, sport: "MLS", stats: { gamesPlayed: 19 }, seasonAverages: { points: 15, rebounds: 16, assists: 15, steals: 0, blocks: 0, turnovers: 0, minutes: 75, fgPct: 0, threePct: 0, ftPct: 0 }, last10: { points: 8, rebounds: 9, assists: 8, steals: 0, blocks: 0, turnovers: 0, minutes: 78, fgPct: 0, threePct: 0, ftPct: 0 }, last5: { points: 5, rebounds: 5, assists: 4, steals: 0, blocks: 0, turnovers: 0, minutes: 80, fgPct: 0, threePct: 0, ftPct: 0 } },
  { id: "mls_dc", name: "Denis Bouanga", team: "LAFC", teamAbbr: "LAFC", position: "FW", number: 99, sport: "MLS", stats: { gamesPlayed: 32 }, seasonAverages: { points: 20, rebounds: 8, assists: 20, steals: 0, blocks: 0, turnovers: 0, minutes: 85, fgPct: 0, threePct: 0, ftPct: 0 }, last10: { points: 6, rebounds: 3, assists: 7, steals: 0, blocks: 0, turnovers: 0, minutes: 86, fgPct: 0, threePct: 0, ftPct: 0 }, last5: { points: 4, rebounds: 2, assists: 3, steals: 0, blocks: 0, turnovers: 0, minutes: 88, fgPct: 0, threePct: 0, ftPct: 0 } },
];

export const mlsProps: PropLine[] = [
  { id: "mlsp1", playerId: "mls_lm", playerName: "Lionel Messi", teamAbbr: "MIA", stat: "Shots on Target", line: 2.5, gamesPlayed: 19, sport: "MLS", hitRate: 60, hitRateLast10: 65, sportsbooks: [{ sportsbook: "FanDuel", line: 2.5, over: -115, under: -105 }, { sportsbook: "DraftKings", line: 2.5, over: -110, under: -110 }, { sportsbook: "Fanatics", line: 2.5, over: -118, under: -102 }, { sportsbook: "BetMGM", line: 2.5, over: -112, under: -108 }] },
  { id: "mlsp2", playerId: "mls_dc", playerName: "Denis Bouanga", teamAbbr: "LAFC", stat: "Shots on Target", line: 1.5, gamesPlayed: 32, sport: "MLS", hitRate: 68, hitRateLast10: 72, sportsbooks: [{ sportsbook: "FanDuel", line: 1.5, over: -145, under: 120 }, { sportsbook: "DraftKings", line: 1.5, over: -140, under: 118 }, { sportsbook: "Fanatics", line: 1.5, over: -148, under: 125 }, { sportsbook: "BetMGM", line: 1.5, over: -142, under: 120 }] },
];

// ===================== WNBA =====================
export const wnbaTeams: Team[] = [
  { id: "wnba_lv", name: "Aces", abbreviation: "LV", city: "Las Vegas", record: "34-6", conference: "Western", division: "Western", sport: "WNBA", ranking: 1, stats: { ppg: 92.5, oppPpg: 80.2, rpg: 38.5, apg: 22.8, fgPct: 47.2, threePct: 35.8, ftPct: 82.5, turnovers: 12.8, steals: 8.5, blocks: 4.2 } },
  { id: "wnba_ny", name: "Liberty", abbreviation: "NY", city: "New York", record: "32-8", conference: "Eastern", division: "Eastern", sport: "WNBA", ranking: 2, stats: { ppg: 88.2, oppPpg: 78.5, rpg: 36.2, apg: 21.5, fgPct: 46.8, threePct: 36.2, ftPct: 80.8, turnovers: 13.2, steals: 7.8, blocks: 5.1 } },
  { id: "wnba_ind", name: "Fever", abbreviation: "IND", city: "Indiana", record: "20-20", conference: "Eastern", division: "Eastern", sport: "WNBA", stats: { ppg: 85.5, oppPpg: 84.2, rpg: 35.8, apg: 20.2, fgPct: 44.5, threePct: 34.2, ftPct: 78.5, turnovers: 14.5, steals: 7.2, blocks: 3.8 } },
  { id: "wnba_min", name: "Lynx", abbreviation: "MIN", city: "Minnesota", record: "30-10", conference: "Western", division: "Western", sport: "WNBA", ranking: 3, stats: { ppg: 86.8, oppPpg: 79.5, rpg: 37.2, apg: 22.5, fgPct: 46.2, threePct: 37.5, ftPct: 81.2, turnovers: 12.5, steals: 8.8, blocks: 4.5 } },
];

export const wnbaGames: Game[] = [];

export const wnbaPlayers: Player[] = [
  { id: "wnba_cc", name: "Caitlin Clark", team: "Fever", teamAbbr: "IND", position: "G", number: 22, sport: "WNBA", stats: { gamesPlayed: 40 }, seasonAverages: { points: 19.2, rebounds: 5.7, assists: 8.4, steals: 1.3, blocks: 0.7, turnovers: 5.6, minutes: 35.4, fgPct: 41.7, threePct: 34.4, ftPct: 90.6 }, last10: { points: 22.5, rebounds: 6.2, assists: 9.1, steals: 1.5, blocks: 0.8, turnovers: 4.8, minutes: 36.2, fgPct: 43.5, threePct: 36.8, ftPct: 91.2 }, last5: { points: 24.8, rebounds: 6.8, assists: 9.8, steals: 1.6, blocks: 0.9, turnovers: 4.2, minutes: 37.1, fgPct: 45.2, threePct: 38.5, ftPct: 92.1 } },
  { id: "wnba_aj", name: "A'ja Wilson", team: "Aces", teamAbbr: "LV", position: "F", number: 22, sport: "WNBA", stats: { gamesPlayed: 38 }, seasonAverages: { points: 26.9, rebounds: 11.9, assists: 2.3, steals: 1.3, blocks: 2.6, turnovers: 2.1, minutes: 34.5, fgPct: 51.8, threePct: 28.5, ftPct: 85.2 }, last10: { points: 28.5, rebounds: 12.5, assists: 2.5, steals: 1.4, blocks: 2.8, turnovers: 2.0, minutes: 35.2, fgPct: 52.5, threePct: 30.2, ftPct: 86.5 }, last5: { points: 30.2, rebounds: 13.1, assists: 2.8, steals: 1.5, blocks: 3.0, turnovers: 1.8, minutes: 36.1, fgPct: 53.8, threePct: 31.5, ftPct: 87.8 } },
  { id: "wnba_bs", name: "Breanna Stewart", team: "Liberty", teamAbbr: "NY", position: "F", number: 30, sport: "WNBA", stats: { gamesPlayed: 40 }, seasonAverages: { points: 20.1, rebounds: 8.5, assists: 3.5, steals: 1.5, blocks: 1.8, turnovers: 2.5, minutes: 33.8, fgPct: 46.5, threePct: 35.2, ftPct: 88.5 }, last10: { points: 21.8, rebounds: 9.2, assists: 3.8, steals: 1.6, blocks: 2.0, turnovers: 2.2, minutes: 34.5, fgPct: 47.8, threePct: 36.8, ftPct: 89.2 }, last5: { points: 23.5, rebounds: 9.8, assists: 4.1, steals: 1.8, blocks: 2.2, turnovers: 2.0, minutes: 35.2, fgPct: 48.5, threePct: 38.1, ftPct: 90.5 } },
];

export const wnbaProps: PropLine[] = [
  { id: "wnbap1", playerId: "wnba_cc", playerName: "Caitlin Clark", teamAbbr: "IND", stat: "Points", line: 18.5, gamesPlayed: 40, sport: "WNBA", hitRate: 55, hitRateLast10: 65, sportsbooks: [{ sportsbook: "FanDuel", line: 18.5, over: -108, under: -112 }, { sportsbook: "DraftKings", line: 19.5, over: -105, under: -115 }, { sportsbook: "Fanatics", line: 18.5, over: -110, under: -110 }, { sportsbook: "BetMGM", line: 18.5, over: -112, under: -108 }] },
  { id: "wnbap2", playerId: "wnba_cc", playerName: "Caitlin Clark", teamAbbr: "IND", stat: "Assists", line: 7.5, gamesPlayed: 40, sport: "WNBA", hitRate: 60, hitRateLast10: 68, sportsbooks: [{ sportsbook: "FanDuel", line: 7.5, over: -115, under: -105 }, { sportsbook: "DraftKings", line: 7.5, over: -112, under: -108 }, { sportsbook: "Fanatics", line: 8.5, over: 105, under: -125 }, { sportsbook: "BetMGM", line: 7.5, over: -110, under: -110 }] },
  { id: "wnbap3", playerId: "wnba_aj", playerName: "A'ja Wilson", teamAbbr: "LV", stat: "Points", line: 25.5, gamesPlayed: 38, sport: "WNBA", hitRate: 62, hitRateLast10: 70, sportsbooks: [{ sportsbook: "FanDuel", line: 25.5, over: -115, under: -105 }, { sportsbook: "DraftKings", line: 26.5, over: -105, under: -115 }, { sportsbook: "Fanatics", line: 25.5, over: -112, under: -108 }, { sportsbook: "BetMGM", line: 25.5, over: -118, under: -102 }] },
  { id: "wnbap4", playerId: "wnba_aj", playerName: "A'ja Wilson", teamAbbr: "LV", stat: "Rebounds", line: 11.5, gamesPlayed: 38, sport: "WNBA", hitRate: 55, hitRateLast10: 62, sportsbooks: [{ sportsbook: "FanDuel", line: 11.5, over: -110, under: -110 }, { sportsbook: "DraftKings", line: 11.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 11.5, over: -112, under: -108 }, { sportsbook: "BetMGM", line: 12.5, over: 105, under: -125 }] },
];

// ===================== NASCAR =====================
export const nascarTeams: Team[] = [
  { id: "nsc_hms", name: "Hendrick Motorsports", abbreviation: "HMS", city: "Charlotte", record: "", conference: "Cup", division: "Cup Series", sport: "NASCAR", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "nsc_jgr", name: "Joe Gibbs Racing", abbreviation: "JGR", city: "Huntersville", record: "", conference: "Cup", division: "Cup Series", sport: "NASCAR", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "nsc_tfr", name: "Team Penske", abbreviation: "PEN", city: "Mooresville", record: "", conference: "Cup", division: "Cup Series", sport: "NASCAR", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
];

export const nascarGames: Game[] = [];
export const nascarPlayers: Player[] = [
  { id: "nsc_ke", name: "Kyle Larson", team: "Hendrick Motorsports", teamAbbr: "HMS", position: "Driver", number: 5, sport: "NASCAR", stats: { gamesPlayed: 36 }, seasonAverages: { points: 6, rebounds: 18, assists: 4, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last10: { points: 2, rebounds: 6, assists: 1, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last5: { points: 1, rebounds: 3, assists: 1, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 } },
  { id: "nsc_cb", name: "Christopher Bell", team: "Joe Gibbs Racing", teamAbbr: "JGR", position: "Driver", number: 20, sport: "NASCAR", stats: { gamesPlayed: 36 }, seasonAverages: { points: 5, rebounds: 16, assists: 3, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last10: { points: 2, rebounds: 5, assists: 1, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 }, last5: { points: 1, rebounds: 3, assists: 0, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 0, threePct: 0, ftPct: 0 } },
];
export const nascarProps: PropLine[] = [];

// ===================== TENNIS =====================
export const tennisTeams: Team[] = [
  { id: "ten_atp", name: "ATP Tour", abbreviation: "ATP", city: "ATP", record: "", conference: "Men's", division: "ATP", sport: "TENNIS", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
  { id: "ten_wta", name: "WTA Tour", abbreviation: "WTA", city: "WTA", record: "", conference: "Women's", division: "WTA", sport: "TENNIS", stats: { ppg: 0, oppPpg: 0, rpg: 0, apg: 0, fgPct: 0, threePct: 0, ftPct: 0, turnovers: 0, steals: 0, blocks: 0 } },
];

export const tennisGames: Game[] = [];

export const tennisPlayers: Player[] = [
  { id: "ten_js", name: "Jannik Sinner", team: "ATP Tour", teamAbbr: "ATP", position: "No. 1", number: 0, sport: "TENNIS", stats: { gamesPlayed: 58 }, seasonAverages: { points: 48, rebounds: 6, assists: 48, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 67.5, threePct: 0, ftPct: 0 }, last10: { points: 9, rebounds: 1, assists: 9, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 68.2, threePct: 0, ftPct: 0 }, last5: { points: 5, rebounds: 0, assists: 5, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 69.5, threePct: 0, ftPct: 0 } },
  { id: "ten_ca", name: "Carlos Alcaraz", team: "ATP Tour", teamAbbr: "ATP", position: "No. 2", number: 0, sport: "TENNIS", stats: { gamesPlayed: 55 }, seasonAverages: { points: 44, rebounds: 8, assists: 44, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 65.8, threePct: 0, ftPct: 0 }, last10: { points: 8, rebounds: 2, assists: 8, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 66.5, threePct: 0, ftPct: 0 }, last5: { points: 5, rebounds: 0, assists: 5, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 67.8, threePct: 0, ftPct: 0 } },
  { id: "ten_nd", name: "Novak Djokovic", team: "ATP Tour", teamAbbr: "ATP", position: "No. 5", number: 0, sport: "TENNIS", stats: { gamesPlayed: 42 }, seasonAverages: { points: 38, rebounds: 5, assists: 38, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 64.2, threePct: 0, ftPct: 0 }, last10: { points: 7, rebounds: 2, assists: 7, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 63.8, threePct: 0, ftPct: 0 }, last5: { points: 3, rebounds: 2, assists: 3, steals: 0, blocks: 0, turnovers: 0, minutes: 0, fgPct: 62.5, threePct: 0, ftPct: 0 } },
];

export const tennisProps: PropLine[] = [
  { id: "tenp1", playerId: "ten_js", playerName: "Jannik Sinner", teamAbbr: "ATP", stat: "Total Games", line: 21.5, gamesPlayed: 58, sport: "TENNIS", hitRate: 52, hitRateLast10: 55, sportsbooks: [{ sportsbook: "FanDuel", line: 21.5, over: -110, under: -110 }, { sportsbook: "DraftKings", line: 22.5, over: -105, under: -115 }, { sportsbook: "Fanatics", line: 21.5, over: -108, under: -112 }, { sportsbook: "BetMGM", line: 21.5, over: -112, under: -108 }] },
  { id: "tenp2", playerId: "ten_ca", playerName: "Carlos Alcaraz", teamAbbr: "ATP", stat: "Total Games", line: 22.5, gamesPlayed: 55, sport: "TENNIS", hitRate: 55, hitRateLast10: 58, sportsbooks: [{ sportsbook: "FanDuel", line: 22.5, over: -108, under: -112 }, { sportsbook: "DraftKings", line: 22.5, over: -110, under: -110 }, { sportsbook: "Fanatics", line: 23.5, over: -102, under: -118 }, { sportsbook: "BetMGM", line: 22.5, over: -105, under: -115 }] },
  { id: "tenp3", playerId: "ten_nd", playerName: "Novak Djokovic", teamAbbr: "ATP", stat: "Aces", line: 5.5, gamesPlayed: 42, sport: "TENNIS", hitRate: 48, hitRateLast10: 45, sportsbooks: [{ sportsbook: "FanDuel", line: 5.5, over: -105, under: -115 }, { sportsbook: "DraftKings", line: 5.5, over: -108, under: -112 }, { sportsbook: "Fanatics", line: 5.5, over: -102, under: -118 }, { sportsbook: "BetMGM", line: 6.5, over: 115, under: -138 }] },
];

