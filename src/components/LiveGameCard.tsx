import type { LiveGame } from "@/hooks/useEspnData";

interface LiveGameCardProps {
  game: LiveGame;
}

const LiveGameCard = ({ game }: LiveGameCardProps) => {
  const isLive = game.status === "in";
  const isFinal = game.status === "post";

  return (
    <div className="animate-fade-in rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30">
      {/* Status badge */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
              LIVE
            </span>
          )}
          {isFinal && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {game.statusDetail}
            </span>
          )}
          {!isLive && !isFinal && (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {game.statusDetail || new Date(game.date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
          )}
        </div>
        {game.broadcasts.length > 0 && (
          <span className="text-[9px] text-muted-foreground">
            {game.broadcasts[0]}
          </span>
        )}
      </div>

      {/* Teams & scores */}
      <div className="space-y-2.5">
        {/* Away team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {game.awayTeam.logo && (
              <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="h-7 w-7 object-contain" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">{game.awayTeam.name}</p>
              <p className="text-[10px] text-muted-foreground">{game.awayTeam.record}</p>
            </div>
          </div>
          {(isLive || isFinal) && (
            <span className={`font-mono text-lg font-bold ${
              game.awayScore != null && game.homeScore != null && game.awayScore > game.homeScore
                ? "text-foreground"
                : "text-muted-foreground"
            }`}>
              {game.awayScore}
            </span>
          )}
        </div>

        {/* Home team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {game.homeTeam.logo && (
              <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="h-7 w-7 object-contain" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">{game.homeTeam.name}</p>
              <p className="text-[10px] text-muted-foreground">{game.homeTeam.record}</p>
            </div>
          </div>
          {(isLive || isFinal) && (
            <span className={`font-mono text-lg font-bold ${
              game.homeScore != null && game.awayScore != null && game.homeScore > game.awayScore
                ? "text-foreground"
                : "text-muted-foreground"
            }`}>
              {game.homeScore}
            </span>
          )}
        </div>
      </div>

      {/* Odds row */}
      {game.odds.length > 0 && (
        <div className="mt-3 space-y-1">
          {game.odds.slice(0, 2).map((o, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/50 px-2.5 py-1.5 text-[10px]">
              <span className="text-muted-foreground">{o.provider}</span>
              <div className="flex items-center gap-3">
                {o.spread != null && (
                  <span className="font-mono text-foreground">
                    SPR {o.spread > 0 ? "+" : ""}{o.spread}
                  </span>
                )}
                {o.overUnder != null && (
                  <span className="font-mono text-foreground">O/U {o.overUnder}</span>
                )}
                {o.homeMoneyLine != null && (
                  <span className="font-mono text-foreground">
                    ML {o.homeMoneyLine > 0 ? "+" : ""}{o.homeMoneyLine}
                  </span>
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
