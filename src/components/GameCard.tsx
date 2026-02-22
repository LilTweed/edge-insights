import type { Game } from "@/data/mockData";
import { formatOdds } from "@/data/mockData";
import { Link } from "react-router-dom";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const bestML = game.moneyline[0]; // Use first sportsbook as default display
  const bestOU = game.overUnder[0];

  return (
    <Link
      to={`/game/${game.id}`}
      className="group block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{game.date}</span>
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
              <p className="text-sm font-semibold text-foreground">{game.awayTeam.city} {game.awayTeam.name}</p>
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
              <p className="text-sm font-semibold text-foreground">{game.homeTeam.city} {game.homeTeam.name}</p>
              <p className="text-xs text-muted-foreground">{game.homeTeam.record}</p>
            </div>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            {formatOdds(bestML.home)}
          </span>
        </div>
      </div>

      {/* O/U */}
      <div className="mt-3 flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">O/U</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-foreground">{bestOU.total}</span>
          <div className="flex gap-2">
            <span className="line-badge-over">O {formatOdds(bestOU.over)}</span>
            <span className="line-badge-under">U {formatOdds(bestOU.under)}</span>
          </div>
        </div>
      </div>

      {/* Sportsbook count indicator */}
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
