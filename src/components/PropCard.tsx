import type { PropLine } from "@/data/mockData";
import { formatOdds } from "@/data/mockData";
import { Link } from "react-router-dom";

interface PropCardProps {
  prop: PropLine;
  showPlayer?: boolean;
}

const PropCard = ({ prop, showPlayer = true }: PropCardProps) => {
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

      {/* Hit Rate */}
      <div className="mb-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Season Hit Rate</span>
          <span className="font-mono text-xs font-medium text-foreground">{prop.hitRate}%</span>
        </div>
        <div className="hit-rate-bar">
          <div
            className="h-full rounded-full bg-foreground/60 transition-all"
            style={{ width: `${prop.hitRate}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Last 10 Hit Rate</span>
          <span className="font-mono text-xs font-medium text-foreground">{prop.hitRateLast10}%</span>
        </div>
        <div className="hit-rate-bar">
          <div
            className="h-full rounded-full bg-foreground/40 transition-all"
            style={{ width: `${prop.hitRateLast10}%` }}
          />
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
          Based on {prop.gamesPlayed} games played
        </span>
      </div>
    </div>
  );
};

export default PropCard;
