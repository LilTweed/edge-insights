import type { Game } from "@/data/mockData";
import { formatOdds } from "@/data/mockData";
import { Link } from "react-router-dom";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const bestML = game.moneyline[0];
  const bestOU = game.overUnder[0];
  const bestSpread = game.spread?.[0];

  return (
    <Link
      to={`/game/${game.id}`}
      className="group block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{game.sport}</span>
          <span className="text-xs font-medium text-muted-foreground">{game.date}</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{game.time}</span>
      </div>

      {/* Teams */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-secondary-foreground">
              {game.awayTeam.abbreviation}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {game.awayTeam.ranking ? <span className="text-muted-foreground">#{game.awayTeam.ranking} </span> : ""}
                {game.awayTeam.city} {game.awayTeam.name}
              </p>
              <p className="text-xs text-muted-foreground">{game.awayTeam.record}</p>
            </div>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            {formatOdds(bestML.away)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-secondary-foreground">
              {game.homeTeam.abbreviation}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {game.homeTeam.ranking ? <span className="text-muted-foreground">#{game.homeTeam.ranking} </span> : ""}
                {game.homeTeam.city} {game.homeTeam.name}
              </p>
              <p className="text-xs text-muted-foreground">{game.homeTeam.record}</p>
            </div>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            {formatOdds(bestML.home)}
          </span>
        </div>
      </div>

      {/* Spread + O/U */}
      <div className="mt-3 flex gap-2">
        {bestSpread && (
          <div className="flex-1 rounded-lg bg-secondary/60 px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">Spread</span>
            <p className="font-mono text-xs font-semibold text-foreground mt-0.5">{game.homeTeam.abbreviation} {bestSpread.home}</p>
          </div>
        )}
        <div className="flex-1 rounded-lg bg-secondary/60 px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">O/U</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs font-semibold text-foreground">{bestOU.total}</span>
            <span className="line-badge-over text-[10px]">O {formatOdds(bestOU.over)}</span>
            <span className="line-badge-under text-[10px]">U {formatOdds(bestOU.under)}</span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-1">
        <span className="text-[10px] text-muted-foreground">{game.moneyline.length} books</span>
        <div className="flex gap-0.5">
          {game.moneyline.map((_, i) => (
            <div key={i} className="h-1 w-3 rounded-full bg-primary/20" />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
