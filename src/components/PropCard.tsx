import type { PropLine } from "@/data/mockData";
import { formatOdds } from "@/data/mockData";
import { Link } from "react-router-dom";

interface PropCardProps {
  prop: PropLine;
  showPlayer?: boolean;
  onAddToSlip?: (prop: PropLine, side: "over" | "under") => void;
}

/** Convert American odds to implied probability % */
const impliedProb = (odds: number): number => {
  if (odds < 0) return (-odds / (-odds + 100)) * 100;
  return (100 / (odds + 100)) * 100;
};

const PropCard = ({ prop, showPlayer = true, onAddToSlip }: PropCardProps) => {
  // Compute consensus implied probability from all sportsbooks (average of over odds)
  const avgImpliedOver = prop.sportsbooks.reduce((sum, sb) => sum + impliedProb(sb.over), 0) / prop.sportsbooks.length;
  const avgImpliedUnder = prop.sportsbooks.reduce((sum, sb) => sum + impliedProb(sb.under), 0) / prop.sportsbooks.length;

  // Compute actual over/under counts from hit rate + games played
  const gamesOver = Math.round((prop.hitRate / 100) * prop.gamesPlayed);
  const gamesUnder = prop.gamesPlayed - gamesOver;
  const gamesOverL10 = Math.round((prop.hitRateLast10 / 100) * Math.min(10, prop.gamesPlayed));
  const gamesUnderL10 = Math.min(10, prop.gamesPlayed) - gamesOverL10;

  // Edge: actual hit rate vs implied probability (positive = value on over)
  const edgeOver = prop.hitRate - avgImpliedOver;
  const edgeUnder = (100 - prop.hitRate) - avgImpliedUnder;

  return (
    <div className="animate-fade-in rounded-xl border border-border bg-card p-4">
      {/* Header */}
      {showPlayer && (
        <div className="mb-3 flex items-center justify-between">
          <Link
            to={`/player/${prop.playerId}`}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            {prop.playerName}
          </Link>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {prop.teamAbbr}
          </span>
        </div>
      )}

      {/* Stat & Line */}
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-xs font-medium text-muted-foreground">{prop.stat}</span>
        <span className="font-mono text-xl font-bold text-foreground">{prop.line}</span>
      </div>

      {/* Hit Rate — neutral, transparent */}
      <div className="mb-3 rounded-lg border border-border/50 bg-secondary/30 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Hit Rate</span>
          <span className="text-[10px] text-muted-foreground">{prop.gamesPlayed} games</span>
        </div>

        {/* Season split */}
        <div className="space-y-1">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-l-full bg-foreground/40 transition-all"
              style={{ width: `${prop.hitRate}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>Over {gamesOver}/{prop.gamesPlayed}</span>
            <span>Under {gamesUnder}/{prop.gamesPlayed}</span>
          </div>
        </div>

        {/* Last 10 split */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Last 10</span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-l-full bg-foreground/30 transition-all"
              style={{ width: `${prop.hitRateLast10}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>Over {gamesOverL10}/{Math.min(10, prop.gamesPlayed)}</span>
            <span>Under {gamesUnderL10}/{Math.min(10, prop.gamesPlayed)}</span>
          </div>
        </div>
      </div>

      {/* Sportsbook Lines */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-medium text-muted-foreground">Lines by Book</span>
        <div className="space-y-1">
          {prop.sportsbooks.map((sb) => (
            <div key={sb.sportsbook} className="flex items-center justify-between rounded-lg bg-secondary/50 px-2.5 py-1.5">
              <span className="text-[11px] font-medium text-muted-foreground">{sb.sportsbook}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-foreground">{sb.line}</span>
                <span className="line-badge-over">O {formatOdds(sb.over)}</span>
                <span className="line-badge-under">U {formatOdds(sb.under)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick add to slip */}
      {onAddToSlip && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => onAddToSlip(prop, "over")}
            className="flex-1 rounded-lg border border-border bg-secondary/50 py-1.5 text-[10px] font-bold text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            + Over {prop.line}
          </button>
          <button
            onClick={() => onAddToSlip(prop, "under")}
            className="flex-1 rounded-lg border border-border bg-secondary/50 py-1.5 text-[10px] font-bold text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            + Under {prop.line}
          </button>
        </div>
      )}

      <div className="mt-2.5 text-center">
        <span className="text-[10px] text-muted-foreground">
          Based on {prop.gamesPlayed} games played · Hit rates reflect actual results, not projections
        </span>
      </div>
    </div>
  );
};

export default PropCard;
