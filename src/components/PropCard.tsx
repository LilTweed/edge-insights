import type { PropLine } from "@/data/mockData";
import { formatOdds } from "@/data/mockData";
import { Link } from "react-router-dom";

interface PropCardProps {
  prop: PropLine;
  showPlayer?: boolean;
}

/** Convert American odds to implied probability % */
const impliedProb = (odds: number): number => {
  if (odds < 0) return (-odds / (-odds + 100)) * 100;
  return (100 / (odds + 100)) * 100;
};

const PropCard = ({ prop, showPlayer = true }: PropCardProps) => {
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

      {/* Transparent Hit Rate */}
      <div className="mb-3 rounded-lg border border-border/50 bg-secondary/30 p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Actual Hit Rate</span>
          <span className="text-[10px] text-muted-foreground">{prop.gamesPlayed} GP sample</span>
        </div>

        {/* Season bar — shows over vs under split */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Season</span>
            <span className="font-mono text-[11px] font-semibold text-foreground">
              {gamesOver}–{gamesUnder} <span className="text-muted-foreground">(O–U)</span>
            </span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-foreground/50 transition-all"
              style={{ width: `${prop.hitRate}%` }}
              title={`Over: ${prop.hitRate}%`}
            />
          </div>
          <div className="mt-0.5 flex justify-between text-[9px] text-muted-foreground">
            <span>Over {prop.hitRate}%</span>
            <span>Under {(100 - prop.hitRate).toFixed(0)}%</span>
          </div>
        </div>

        {/* Last 10 bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Last 10</span>
            <span className="font-mono text-[11px] font-semibold text-foreground">
              {gamesOverL10}–{gamesUnderL10} <span className="text-muted-foreground">(O–U)</span>
            </span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-foreground/40 transition-all"
              style={{ width: `${prop.hitRateLast10}%` }}
              title={`Over L10: ${prop.hitRateLast10}%`}
            />
          </div>
          <div className="mt-0.5 flex justify-between text-[9px] text-muted-foreground">
            <span>Over {prop.hitRateLast10}%</span>
            <span>Under {(100 - prop.hitRateLast10).toFixed(0)}%</span>
          </div>
        </div>

        {/* Implied prob vs actual — no bias, just data */}
        <div className="border-t border-border/50 pt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Market vs Actual</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-secondary/60 p-2 text-center">
              <p className="text-[9px] text-muted-foreground mb-0.5">Over</p>
              <p className="font-mono text-[11px] text-foreground">
                <span className="text-muted-foreground">Mkt </span>{avgImpliedOver.toFixed(1)}%
              </p>
              <p className="font-mono text-[11px] text-foreground">
                <span className="text-muted-foreground">Act </span>{prop.hitRate}%
              </p>
              <p className={`font-mono text-[10px] font-bold mt-0.5 ${Math.abs(edgeOver) < 2 ? "text-muted-foreground" : edgeOver > 0 ? "text-green-400" : "text-red-400"}`}>
                {edgeOver > 0 ? "+" : ""}{edgeOver.toFixed(1)}% edge
              </p>
            </div>
            <div className="rounded-md bg-secondary/60 p-2 text-center">
              <p className="text-[9px] text-muted-foreground mb-0.5">Under</p>
              <p className="font-mono text-[11px] text-foreground">
                <span className="text-muted-foreground">Mkt </span>{avgImpliedUnder.toFixed(1)}%
              </p>
              <p className="font-mono text-[11px] text-foreground">
                <span className="text-muted-foreground">Act </span>{(100 - prop.hitRate).toFixed(1)}%
              </p>
              <p className={`font-mono text-[10px] font-bold mt-0.5 ${Math.abs(edgeUnder) < 2 ? "text-muted-foreground" : edgeUnder > 0 ? "text-green-400" : "text-red-400"}`}>
                {edgeUnder > 0 ? "+" : ""}{edgeUnder.toFixed(1)}% edge
              </p>
            </div>
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

      <div className="mt-2.5 text-center">
        <span className="text-[10px] text-muted-foreground">
          Based on {prop.gamesPlayed} games played · Hit rates reflect actual results, not projections
        </span>
      </div>
    </div>
  );
};

export default PropCard;
