import type { LiveGame } from "@/hooks/useEspnData";

interface LiveGameCardProps {
  game: LiveGame;
}

const LiveGameCard = ({ game }: LiveGameCardProps) => {
  const isLive = game.status === "in";
  const isFinal = game.status === "post";

  return (
    <div className="animate-slide-up rounded-2xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      {/* Status badge */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-2xs font-bold uppercase tracking-wider text-destructive">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
              Live
            </span>
          )}
          {isFinal && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-2xs font-medium text-muted-foreground">
              {game.statusDetail}
            </span>
          )}
          {!isLive && !isFinal && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-2xs font-medium text-muted-foreground">
              {game.statusDetail || new Date(game.date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
          )}
        </div>
        {game.broadcasts.length > 0 && (
          <span className="text-2xs font-medium text-muted-foreground/70">
            {game.broadcasts[0]}
          </span>
        )}
      </div>

      {/* Teams & scores */}
      <div className="space-y-3">
        {/* Away team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {game.awayTeam.logo && (
              <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="h-8 w-8 object-contain" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">{game.awayTeam.name}</p>
              <p className="text-2xs text-muted-foreground">{game.awayTeam.record}</p>
            </div>
          </div>
          {(isLive || isFinal) && (
            <span className={`font-mono text-xl font-bold tabular-nums ${
              game.awayScore != null && game.homeScore != null && game.awayScore > game.homeScore
                ? "text-foreground"
                : "text-muted-foreground/60"
            }`}>
              {game.awayScore}
            </span>
          )}
        </div>

        <div className="border-t border-border/40" />

        {/* Home team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {game.homeTeam.logo && (
              <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="h-8 w-8 object-contain" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">{game.homeTeam.name}</p>
              <p className="text-2xs text-muted-foreground">{game.homeTeam.record}</p>
            </div>
          </div>
          {(isLive || isFinal) && (
            <span className={`font-mono text-xl font-bold tabular-nums ${
              game.homeScore != null && game.awayScore != null && game.homeScore > game.awayScore
                ? "text-foreground"
                : "text-muted-foreground/60"
            }`}>
              {game.homeScore}
            </span>
          )}
        </div>
      </div>

      {/* Odds row */}
      {game.odds.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {game.odds.slice(0, 2).map((o, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-secondary/40 px-3 py-2 text-2xs">
              <span className="font-medium text-muted-foreground">{o.provider}</span>
              <div className="flex items-center gap-3 font-mono font-medium text-foreground">
                {o.spread != null && (
                  <span>SPR {o.spread > 0 ? "+" : ""}{o.spread}</span>
                )}
                {o.overUnder != null && (
                  <span>O/U {o.overUnder}</span>
                )}
                {o.homeMoneyLine != null && (
                  <span>ML {o.homeMoneyLine > 0 ? "+" : ""}{o.homeMoneyLine}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveGameCard;
