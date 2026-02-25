import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { type Sport, type Game } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import GameCard from "@/components/GameCard";
import { useSubscription } from "@/hooks/useSubscription";
import { Zap, TrendingUp, SearchIcon, ArrowRight } from "lucide-react";

// ── ESPN-style mock games for all sports ────────────────────────────

function makeMockTeam(id: string, name: string, abbr: string, city: string, record: string, sport: Sport) {
  return { id, name, abbreviation: abbr, city, record, conference: "", division: "", sport } as const;
}

const mockGames: Game[] = [
  // NBA
  {
    id: "nba-1", sport: "NBA", date: "Today", time: "7:30 PM ET", status: "scheduled",
    homeTeam: makeMockTeam("cel", "Celtics", "BOS", "Boston", "38-15", "NBA"),
    awayTeam: makeMockTeam("lak", "Lakers", "LAL", "Los Angeles", "32-21", "NBA"),
    spread: [{ sportsbook: "FanDuel", home: -4.5, away: 4.5, homeOdds: -110, awayOdds: -110 }],
    moneyline: [{ sportsbook: "FanDuel", home: -195, away: 165 }],
    overUnder: [{ sportsbook: "FanDuel", total: 224.5, over: -110, under: -110 }],
    keyInjuries: [
      { player: "LeBron James", status: "Questionable", injury: "ankle" },
      { player: "Jaylen Brown", status: "Probable", injury: "knee" },
    ],
    playerProps: [
      { playerName: "LeBron James", stat: "Points", line: 24.5 },
      { playerName: "Anthony Davis", stat: "Rebounds", line: 11.5 },
      { playerName: "Jayson Tatum", stat: "Points", line: 27.5 },
    ],
  },
  {
    id: "nba-2", sport: "NBA", date: "Today", time: "10:00 PM ET", status: "live",
    homeTeam: makeMockTeam("gsw", "Warriors", "GSW", "Golden State", "28-25", "NBA"),
    awayTeam: makeMockTeam("den", "Nuggets", "DEN", "Denver", "35-18", "NBA"),
    homeScore: 58, awayScore: 62,
    quarterScores: [{ period: "Q1", home: 28, away: 31 }, { period: "Q2", home: 30, away: 31 }],
    spread: [{ sportsbook: "DraftKings", home: 2.5, away: -2.5, homeOdds: -110, awayOdds: -110 }],
    moneyline: [{ sportsbook: "DraftKings", home: 120, away: -140 }],
    overUnder: [{ sportsbook: "DraftKings", total: 231.5, over: -110, under: -110 }],
    keyInjuries: [{ player: "Steph Curry", status: "Probable", injury: "knee" }],
    playerProps: [
      { playerName: "Steph Curry", stat: "Points", line: 28.5 },
      { playerName: "Nikola Jokic", stat: "Rebounds", line: 12.5 },
    ],
  },
  // NFL
  {
    id: "nfl-1", sport: "NFL", date: "Sunday", time: "4:25 PM ET", status: "scheduled",
    homeTeam: makeMockTeam("kc", "Chiefs", "KC", "Kansas City", "12-3", "NFL"),
    awayTeam: makeMockTeam("buf", "Bills", "BUF", "Buffalo", "11-4", "NFL"),
    spread: [{ sportsbook: "FanDuel", home: -3, away: 3, homeOdds: -110, awayOdds: -110 }],
    moneyline: [{ sportsbook: "FanDuel", home: -155, away: 130 }],
    overUnder: [{ sportsbook: "FanDuel", total: 48.5, over: -110, under: -110 }],
    keyInjuries: [{ player: "Josh Allen", status: "Probable", injury: "elbow" }],
    playerProps: [
      { playerName: "Patrick Mahomes", stat: "Pass Yards", line: 285.5 },
      { playerName: "Josh Allen", stat: "Pass Yards", line: 275.5 },
    ],
  },
  // NCAAB
  {
    id: "ncaab-1", sport: "NCAAB", date: "Today", time: "9:00 PM ET", status: "scheduled",
    homeTeam: makeMockTeam("duke", "Blue Devils", "DUKE", "Duke", "22-4", "NCAAB"),
    awayTeam: makeMockTeam("unc", "Tar Heels", "UNC", "North Carolina", "18-8", "NCAAB"),
    spread: [{ sportsbook: "BetMGM", home: -6.5, away: 6.5, homeOdds: -110, awayOdds: -110 }],
    moneyline: [{ sportsbook: "BetMGM", home: -280, away: 220 }],
    overUnder: [{ sportsbook: "BetMGM", total: 148.5, over: -110, under: -110 }],
    keyInjuries: [],
    playerProps: [{ playerName: "Cooper Flagg", stat: "Points", line: 18.5 }],
  },
  // NCAAF
  {
    id: "ncaaf-1", sport: "NCAAF", date: "Saturday", time: "3:30 PM ET", status: "scheduled",
    homeTeam: makeMockTeam("osu", "Buckeyes", "OSU", "Ohio State", "10-1", "NCAAF"),
    awayTeam: makeMockTeam("mich", "Wolverines", "MICH", "Michigan", "9-2", "NCAAF"),
    spread: [{ sportsbook: "FanDuel", home: -7, away: 7, homeOdds: -110, awayOdds: -110 }],
    moneyline: [{ sportsbook: "FanDuel", home: -300, away: 240 }],
    overUnder: [{ sportsbook: "FanDuel", total: 45.5, over: -110, under: -110 }],
    keyInjuries: [],
    playerProps: [],
  },
  // MLB
  {
    id: "mlb-1", sport: "MLB", date: "Today", time: "7:10 PM ET", status: "scheduled",
    homeTeam: makeMockTeam("nyy", "Yankees", "NYY", "New York", "58-38", "MLB"),
    awayTeam: makeMockTeam("bos", "Red Sox", "BOS", "Boston", "50-46", "MLB"),
    spread: [{ sportsbook: "DraftKings", home: -1.5, away: 1.5, homeOdds: 135, awayOdds: -160 }],
    moneyline: [{ sportsbook: "DraftKings", home: -155, away: 130 }],
    overUnder: [{ sportsbook: "DraftKings", total: 9.5, over: -105, under: -115 }],
    keyInjuries: [{ player: "Aaron Judge", status: "Probable", injury: "hip" }],
    playerProps: [
      { playerName: "Aaron Judge", stat: "HRs", line: 0.5 },
      { playerName: "Gerrit Cole", stat: "Strikeouts", line: 7.5 },
    ],
  },
  // NHL
  {
    id: "nhl-1", sport: "NHL", date: "Today", time: "7:00 PM ET", status: "scheduled",
    homeTeam: makeMockTeam("edm", "Oilers", "EDM", "Edmonton", "35-18-4", "NHL"),
    awayTeam: makeMockTeam("fla", "Panthers", "FLA", "Florida", "34-19-5", "NHL"),
    spread: [{ sportsbook: "Bovada", home: -1.5, away: 1.5, homeOdds: 160, awayOdds: -190 }],
    moneyline: [{ sportsbook: "Bovada", home: -140, away: 120 }],
    overUnder: [{ sportsbook: "Bovada", total: 6.5, over: -110, under: -110 }],
    keyInjuries: [],
    playerProps: [
      { playerName: "Connor McDavid", stat: "Points", line: 1.5 },
    ],
  },
  // UFC
  {
    id: "ufc-1", sport: "UFC", date: "Saturday", time: "10:00 PM ET", status: "scheduled",
    homeTeam: makeMockTeam("fighter1", "Islam Makhachev", "MAK", "", "26-1", "UFC"),
    awayTeam: makeMockTeam("fighter2", "Charles Oliveira", "OLI", "", "34-9", "UFC"),
    spread: [],
    moneyline: [{ sportsbook: "FanDuel", home: -220, away: 180 }],
    overUnder: [{ sportsbook: "FanDuel", total: 2.5, over: -130, under: 110 }],
    keyInjuries: [],
    playerProps: [],
  },
  // PGA
  {
    id: "pga-1", sport: "PGA", date: "Thursday", time: "7:00 AM ET", status: "scheduled",
    homeTeam: makeMockTeam("sj", "Scottie Scheffler", "SCH", "", "1st (OWGR)", "PGA"),
    awayTeam: makeMockTeam("rm", "Rory McIlroy", "MCI", "", "3rd (OWGR)", "PGA"),
    spread: [],
    moneyline: [{ sportsbook: "DraftKings", home: -150, away: 130 }],
    overUnder: [{ sportsbook: "DraftKings", total: 68.5, over: -110, under: -110 }],
    keyInjuries: [],
    playerProps: [{ playerName: "Scottie Scheffler", stat: "1st Round Score", line: 67.5 }],
  },
  // Soccer
  {
    id: "soc-1", sport: "Soccer", date: "Today", time: "3:00 PM ET", status: "scheduled",
    homeTeam: makeMockTeam("ars", "Arsenal", "ARS", "London", "18-3-2", "Soccer"),
    awayTeam: makeMockTeam("mci", "Manchester City", "MCI", "Manchester", "17-4-2", "Soccer"),
    spread: [{ sportsbook: "FanDuel", home: -0.5, away: 0.5, homeOdds: -115, awayOdds: -105 }],
    moneyline: [{ sportsbook: "FanDuel", home: 140, away: 180 }],
    overUnder: [{ sportsbook: "FanDuel", total: 2.5, over: -120, under: 100 }],
    keyInjuries: [{ player: "Bukayo Saka", status: "Questionable", injury: "hamstring" }],
    playerProps: [
      { playerName: "Erling Haaland", stat: "Shots on Target", line: 2.5 },
      { playerName: "Bukayo Saka", stat: "Assists", line: 0.5 },
    ],
  },
  {
    id: "soc-2", sport: "Soccer", date: "Today", time: "12:30 PM ET", status: "live",
    homeTeam: makeMockTeam("liv", "Liverpool", "LIV", "Liverpool", "19-2-2", "Soccer"),
    awayTeam: makeMockTeam("che", "Chelsea", "CHE", "London", "14-6-3", "Soccer"),
    homeScore: 2, awayScore: 1,
    quarterScores: [{ period: "1H", home: 1, away: 1 }],
    spread: [{ sportsbook: "DraftKings", home: -1, away: 1, homeOdds: -110, awayOdds: -110 }],
    moneyline: [{ sportsbook: "DraftKings", home: -175, away: 420 }],
    overUnder: [{ sportsbook: "DraftKings", total: 3.5, over: -105, under: -115 }],
    keyInjuries: [],
    playerProps: [
      { playerName: "Mohamed Salah", stat: "Shots on Target", line: 2.5 },
    ],
  },
];

// ── Page ────────────────────────────────────────────────────────────

const GamesPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const { isBasicOrAbove, isAdvanced: hasAdvanced } = useSubscription();

  const games = useMemo(() => mockGames.filter((g) => g.sport === sport), [sport]);

  return (
    <div className="container py-6 max-w-4xl">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Today's Games
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Live scores, lines & odds across every sport. Your starting point for smarter bets.
        </p>
      </div>

      <div className="mb-6">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      {/* Games list */}
      {games.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-8 text-center mb-8">
          <p className="text-lg font-semibold text-foreground mb-1">
            No {sport} games scheduled today
          </p>
          <p className="text-sm text-muted-foreground">
            Check back when games are live for scores and odds
          </p>
        </div>
      )}

      {/* Quick action cards — adapt to tier */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isBasicOrAbove && (
          <Link to="/props" className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Browse Props</h3>
            <p className="text-xs text-muted-foreground">View player props and hit rates</p>
            <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 group-hover:text-primary transition-colors" />
          </Link>
        )}

        {isBasicOrAbove && (
          <Link to="/edge" className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Edge</h3>
            <p className="text-xs text-muted-foreground">AI Chat, Prop Builder & edge detection</p>
            <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 group-hover:text-primary transition-colors" />
          </Link>
        )}

        {!isBasicOrAbove && (
          <Link to="/pricing" className="group rounded-xl border border-primary/20 bg-primary/5 p-5 transition-all hover:border-primary/40 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-primary mb-1">Unlock More</h3>
            <p className="text-xs text-muted-foreground">Get props, AI chat & research tools</p>
            <ArrowRight className="h-4 w-4 text-primary mt-2" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
