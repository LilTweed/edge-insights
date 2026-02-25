import type { Game } from "@/data/mockData";
import { formatOdds } from "@/data/mockData";
import { Link } from "react-router-dom";
import { AlertTriangle, Lock } from "lucide-react";

interface GameCardProps {
  game: Game;
  tier?: "free" | "basic" | "advanced";
}

const statusColors = {
  scheduled: "bg-secondary text-muted-foreground",
  live: "bg-destructive/15 text-destructive animate-pulse",
  final: "bg-muted text-muted-foreground",
};

// Mock recent news per game (keyed by game id)
const mockNews: Record<string, string[]> = {
  "nba-1": [
    "LeBron James limited in shootaround — listed questionable for tonight",
    "Celtics riding 7-game home win streak entering matchup",
  ],
  "nba-2": [
    "Jokic has recorded a triple-double in 4 of his last 5 games",
    "Warriors experimenting with small-ball lineup tonight",
  ],
  "nfl-1": [
    "Chiefs have won 12 straight at Arrowhead vs AFC opponents",
    "Josh Allen practicing fully Thursday — expected to play",
  ],
  "ncaab-1": [
    "Cooper Flagg averaging 22.4 PPG over his last 5 games",
  ],
  "mlb-1": [
    "Gerrit Cole has a 1.82 ERA in last 4 starts",
    "Judge has 3 HRs in last 5 games vs Boston",
  ],
  "nhl-1": [
    "McDavid on a 6-game point streak (4G, 8A)",
  ],
  "soc-1": [
    "Arsenal unbeaten in last 11 Premier League home games",
    "Haaland has scored in 6 of his last 8 away matches",
  ],
  "soc-2": [
    "Salah has 14 goals and 10 assists this season",
  ],
};

const GameCard = ({ game, tier = "advanced" }: GameCardProps) => {
  const bestML = game.moneyline[0];
  const bestOU = game.overUnder[0];
  const bestSpread = game.spread?.[0];
  const isLive = game.status === "live";
  const isFree = tier === "free";
  const isBasic = tier === "basic";
  const isPremium = tier === "advanced";
  const news = mockNews[game.id] || [];

  return (
    <Link
      to={`/game/${game.id}`}
      className="group block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm"
    >
      {/* Top bar: sport badge, status, date/time */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{game.sport}</span>
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${statusColors[game.status]}`}>
            {game.status === "live" ? "● LIVE" : game.status === "final" ? "FINAL" : "SCHEDULED"}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{game.date} · {game.time}</span>
      </div>

      {/* Teams with scores */}
      <div className="space-y-2">
        {/* Away team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-secondary-foreground">
              {game.awayTeam.abbreviation}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {game.awayTeam.ranking ? <span className="text-muted-foreground">#{game.awayTeam.ranking} </span> : ""}
                {game.awayTeam.city ? `${game.awayTeam.city} ` : ""}{game.awayTeam.name}
              </p>
              <p className="text-[10px] text-muted-foreground">{game.awayTeam.record}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isLive && game.awayScore !== undefined && (
              <span className="font-mono text-lg font-bold text-foreground">{game.awayScore}</span>
            )}
          </div>
        </div>

        {/* Home team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-secondary-foreground">
              {game.homeTeam.abbreviation}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {game.homeTeam.ranking ? <span className="text-muted-foreground">#{game.homeTeam.ranking} </span> : ""}
                {game.homeTeam.city ? `${game.homeTeam.city} ` : ""}{game.homeTeam.name}
              </p>
              <p className="text-[10px] text-muted-foreground">{game.homeTeam.record}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isLive && game.homeScore !== undefined && (
              <span className="font-mono text-lg font-bold text-foreground">{game.homeScore}</span>
            )}
          </div>
        </div>
      </div>

      {/* Quarter/Period scores — Basic + Premium */}
      {!isFree && game.quarterScores && game.quarterScores.length > 0 && (
        <div className="mt-2.5 flex gap-1">
          {game.quarterScores.map((qs) => (
            <div key={qs.period} className="flex-1 rounded-md bg-secondary/60 px-1.5 py-1 text-center">
              <span className="block text-[8px] font-bold text-muted-foreground">{qs.period}</span>
              <span className="block text-[10px] font-mono text-foreground">{qs.away}-{qs.home}</span>
            </div>
          ))}
        </div>
      )}

      {/* Betting Lines: Spread + ML + O/U */}
      {!isFree ? (
        <div className="mt-3 flex gap-2">
          {bestSpread && (
            <div className="flex-1 rounded-lg bg-secondary/60 px-3 py-2">
              <span className="text-[10px] font-medium text-muted-foreground">Spread</span>
              <p className="font-mono text-xs font-semibold text-foreground mt-0.5">
                {game.homeTeam.abbreviation} {bestSpread.home > 0 ? "+" : ""}{bestSpread.home}
              </p>
            </div>
          )}
          {bestML && (
            <div className="flex-1 rounded-lg bg-secondary/60 px-3 py-2">
              <span className="text-[10px] font-medium text-muted-foreground">Moneyline</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-semibold text-foreground">{game.awayTeam.abbreviation} {formatOdds(bestML.away)}</span>
                <span className="font-mono text-xs font-semibold text-foreground">{game.homeTeam.abbreviation} {formatOdds(bestML.home)}</span>
              </div>
            </div>
          )}
          {bestOU && (
            <div className="flex-1 rounded-lg bg-secondary/60 px-3 py-2">
              <span className="text-[10px] font-medium text-muted-foreground">O/U</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-semibold text-foreground">{bestOU.total}</span>
                <span className="rounded bg-success/10 px-1 py-0.5 text-[9px] font-bold text-success">O {formatOdds(bestOU.over)}</span>
                <span className="rounded bg-destructive/10 px-1 py-0.5 text-[9px] font-bold text-destructive">U {formatOdds(bestOU.under)}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2">
          <Lock className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground">Spread, Moneyline & O/U lines</span>
          <Link
            to="/pricing"
            onClick={(e) => e.stopPropagation()}
            className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary hover:bg-primary/20 transition-colors"
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* Recent News — All tiers */}
      {news.length > 0 && (
        <div className="mt-2.5 border-t border-border/50 pt-2">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Recent News</span>
          <div className="space-y-1">
            {news.map((headline, i) => (
              <p key={i} className="text-[10px] text-muted-foreground leading-relaxed">
                • {headline}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Key Injuries — All tiers */}
      {game.keyInjuries && game.keyInjuries.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0" />
          {game.keyInjuries.map((inj, i) => (
            <span key={i} className="rounded-md bg-secondary/60 px-1.5 py-0.5 text-[9px] text-muted-foreground">
              <span className="font-semibold text-foreground">{inj.player}</span>
              <span className="mx-0.5">·</span>
              <span className={
                inj.status === "Out" ? "text-destructive" :
                inj.status === "Questionable" ? "text-yellow-500" :
                "text-muted-foreground"
              }>{inj.status}</span>
              <span className="mx-0.5 text-muted-foreground/60">({inj.injury})</span>
            </span>
          ))}
        </div>
      )}

      {/* Player Props — Premium only */}
      {isPremium && game.playerProps && game.playerProps.length > 0 && (
        <div className="mt-2.5 border-t border-border/50 pt-2">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Player Props</span>
          <div className="flex flex-wrap gap-1.5">
            {game.playerProps.map((pp, i) => (
              <span key={i} className="rounded-md bg-primary/5 border border-primary/10 px-2 py-1 text-[10px] text-foreground">
                <span className="font-semibold">{pp.playerName}</span>
                <span className="text-muted-foreground"> {pp.stat} </span>
                <span className="font-mono font-bold text-primary">{pp.line}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Player Props locked hint — Free & Basic */}
      {!isPremium && game.playerProps && game.playerProps.length > 0 && (
        <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-3 py-1.5">
          <Lock className="h-3 w-3 text-muted-foreground/60 flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground">
            {game.playerProps.length} player props available
          </span>
          <Link
            to="/pricing"
            onClick={(e) => e.stopPropagation()}
            className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary hover:bg-primary/20 transition-colors"
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* Books count — Premium only */}
      {isPremium && (
        <div className="mt-2.5 flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">{game.moneyline.length} book{game.moneyline.length !== 1 ? "s" : ""}</span>
          <div className="flex gap-0.5">
            {game.moneyline.map((_, i) => (
              <div key={i} className="h-1 w-3 rounded-full bg-primary/20" />
            ))}
          </div>
        </div>
      )}
    </Link>
  );
};

export default GameCard;
