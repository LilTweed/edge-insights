import { useState, useMemo } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeGate from "@/components/UpgradeGate";
import { propLines, type Sport, type PropLine, formatOdds } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import { Link } from "react-router-dom";
import {
  Search,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Beginner-friendly tooltip definitions ─────────────────────────

const TERMS: Record<string, string> = {
  "Prop":
    "A prop (proposition) bet is a wager on a specific player stat — like how many points they'll score — rather than the game outcome.",
  "Line":
    "The number set by sportsbooks. You bet whether the player will go OVER or UNDER this number.",
  "Hit Rate":
    "How often the player has gone over the line this season, shown as a percentage. Higher = more consistent.",
  "Over":
    "A bet that the player will exceed the line.",
  "Under":
    "A bet that the player will stay below the line.",
  "Edge":
    "The difference between the actual hit rate and what the odds imply. Positive edge = potential value.",
  "Last 10":
    "Hit rate based only on the player's most recent 10 games, showing current form.",
  "Games Played":
    "Total games this season where this stat was tracked. More games = more reliable hit rate.",
};

function TermTooltip({ term, children }: { term: string; children: React.ReactNode }) {
  const explanation = TERMS[term];
  if (!explanation) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-0.5 cursor-help border-b border-dotted border-muted-foreground/40">
          {children}
          <HelpCircle className="h-3 w-3 text-muted-foreground/60" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
        <p className="font-semibold text-foreground mb-0.5">{term}</p>
        <p className="text-muted-foreground">{explanation}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Confidence badge ──────────────────────────────────────────────

function ConfidenceBadge({ gamesPlayed }: { gamesPlayed: number }) {
  if (gamesPlayed >= 30)
    return <span className="rounded-full bg-success/15 px-1.5 py-0.5 text-[9px] font-bold text-success">Reliable</span>;
  if (gamesPlayed >= 15)
    return <span className="rounded-full bg-yellow-500/15 px-1.5 py-0.5 text-[9px] font-bold text-yellow-500">Moderate</span>;
  return <span className="rounded-full bg-destructive/15 px-1.5 py-0.5 text-[9px] font-bold text-destructive">Small sample</span>;
}

// ─── Trend indicator ───────────────────────────────────────────────

function TrendIndicator({ hitRate, hitRateLast10 }: { hitRate: number; hitRateLast10: number }) {
  const diff = hitRateLast10 - hitRate;
  if (Math.abs(diff) < 3)
    return (
      <span className="inline-flex items-center gap-0.5 text-muted-foreground">
        <Minus className="h-3 w-3" />
        <span className="text-[10px] font-mono">Stable</span>
      </span>
    );
  if (diff > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-success">
        <TrendingUp className="h-3 w-3" />
        <span className="text-[10px] font-mono">+{diff.toFixed(0)}%</span>
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-destructive">
      <TrendingDown className="h-3 w-3" />
      <span className="text-[10px] font-mono">{diff.toFixed(0)}%</span>
    </span>
  );
}

// ─── Page ──────────────────────────────────────────────────────────

const PropExplorerPage = ({ embedded }: { embedded?: boolean }) => {
  const { tier, isAdvanced: hasAdvanced } = useSubscription();
  const [sport, setSport] = useState<Sport>("NBA");
  const [search, setSearch] = useState("");
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [minHitRate, setMinHitRate] = useState<number>(0);

  const allProps = useMemo(() => propLines.filter((p) => p.sport === sport), [sport]);
  const stats = useMemo(() => Array.from(new Set(allProps.map((p) => p.stat))).sort(), [allProps]);

  const filtered = useMemo(() => {
    let list = allProps;
    if (selectedStat) list = list.filter((p) => p.stat === selectedStat);
    if (minHitRate > 0) list = list.filter((p) => p.hitRate >= minHitRate);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.playerName.toLowerCase().includes(q) ||
          p.teamAbbr.toLowerCase().includes(q) ||
          p.stat.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.hitRate - a.hitRate);
  }, [allProps, selectedStat, minHitRate, search]);

  const hasFilters = selectedStat || minHitRate > 0 || search;

  if (!hasAdvanced) {
    return (
      <div className="container py-10">
        <UpgradeGate requiredTier="advanced" currentTier={tier} feature="Prop Explorer">
          <div />
        </UpgradeGate>
      </div>
    );
  }

  return (
    <div className={`${embedded ? "" : "container py-6"} max-w-4xl ${hasAdvanced && !embedded ? "animate-pro-shimmer" : ""}`}>
      {/* Header */}
      {!embedded && (
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Prop Explorer</h1>
            {hasAdvanced && (
              <span className="rounded-md pro-gradient px-2 py-0.5 text-[9px] font-bold text-pro-foreground tracking-wider">
                PRO
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasAdvanced
              ? <>Deep-dive analysis with confidence scoring & odds comparison. <TermTooltip term="Prop"><span className="text-pro">What's a prop?</span></TermTooltip></>
              : "Discover player props with simple hit rates"}
          </p>
        </div>
      )}

      {/* Sport filter */}
      <div className="mb-4">
        <SportFilter active={sport} onChange={(s) => { setSport(s); setSelectedStat(null); }} />
      </div>

      {/* Search + quick filters */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by player, team, or stat…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {/* Stat chips */}
        <div className="flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground mr-1">
            <Filter className="h-3 w-3" /> Stat:
          </span>
          <button
            onClick={() => setSelectedStat(null)}
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
              !selectedStat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {stats.map((stat) => (
            <button
              key={stat}
              onClick={() => setSelectedStat(selectedStat === stat ? null : stat)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                selectedStat === stat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {stat}
            </button>
          ))}
        </div>

        {/* Hit rate slider — Advanced only */}
        {hasAdvanced && (
          <div className="flex items-center gap-3">
            <TermTooltip term="Hit Rate">
              <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                Min Hit Rate
              </span>
            </TermTooltip>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={minHitRate}
              onChange={(e) => setMinHitRate(Number(e.target.value))}
              className="flex-1 accent-primary h-1.5"
            />
            <span className="font-mono text-xs font-semibold text-foreground w-10 text-right">
              {minHitRate}%
            </span>
          </div>
        )}

        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setSelectedStat(null); setMinHitRate(0); }}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="mb-3 text-[11px] text-muted-foreground">
        {filtered.length} prop{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Props list */}
      <div className="space-y-2">
        {filtered.map((prop) =>
          hasAdvanced ? (
            <AdvancedExplorerCard key={prop.id} prop={prop} />
          ) : (
            <SimpleExplorerCard key={prop.id} prop={prop} />
          )
        )}
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">No props match your filters</p>
            <button
              onClick={() => { setSearch(""); setSelectedStat(null); setMinHitRate(0); }}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Glossary — Advanced only */}
      {hasAdvanced && (
        <div className="mt-10 rounded-xl border border-border/60 bg-card/50 p-5">
          <h2 className="mb-3 text-sm font-bold text-foreground">📖 Quick Glossary</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(TERMS).map(([term, desc]) => (
              <div key={term} className="flex gap-2">
                <span className="text-xs font-semibold text-foreground whitespace-nowrap">{term}:</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Simple card for Basic tier ────────────────────────────────────

function SimpleExplorerCard({ prop }: { prop: PropLine }) {
  const gamesOver = Math.round((prop.hitRate / 100) * prop.gamesPlayed);

  return (
    <Link
      to={`/player/${prop.playerId}`}
      className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 transition-all hover:border-primary/20 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-[10px] font-bold text-secondary-foreground">
          {prop.teamAbbr}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{prop.playerName}</p>
          <p className="text-xs text-muted-foreground">{prop.stat} · Line {prop.line}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className={`font-mono text-lg font-bold ${prop.hitRate >= 60 ? "text-success" : prop.hitRate <= 40 ? "text-destructive" : "text-foreground"}`}>
            {prop.hitRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">{gamesOver}/{prop.gamesPlayed}</p>
        </div>
        <TrendIndicator hitRate={prop.hitRate} hitRateLast10={prop.hitRateLast10} />
      </div>
    </Link>
  );
}

// ─── Advanced card with full detail ────────────────────────────────

function AdvancedExplorerCard({ prop }: { prop: PropLine }) {
  const gamesOver = Math.round((prop.hitRate / 100) * prop.gamesPlayed);
  const bestOver = prop.sportsbooks.length > 0
    ? prop.sportsbooks.reduce((best, sb) => (sb.over > best.over ? sb : best))
    : null;
  const bestUnder = prop.sportsbooks.length > 0
    ? prop.sportsbooks.reduce((best, sb) => (sb.under > best.under ? sb : best))
    : null;

  // Calculate edge for value indicator
  const bestOverOdds = bestOver ? bestOver.over : 0;
  const impliedProb = bestOverOdds < 0 ? (-bestOverOdds / (-bestOverOdds + 100)) * 100 : (100 / (bestOverOdds + 100)) * 100;
  const edge = prop.hitRate - impliedProb;
  const hasEdge = edge > 5;

  return (
    <div className={`rounded-xl border p-4 transition-all hover:shadow-md ${
      hasEdge
        ? "border-pro/30 bg-pro/5 hover:border-pro/50 hover:shadow-[0_0_12px_hsl(var(--pro)/0.1)]"
        : "border-border bg-card hover:border-primary/20"
    }`}>
      {/* Top row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to={`/player/${prop.playerId}`}
            className="text-sm font-semibold text-foreground hover:text-pro transition-colors"
          >
            {prop.playerName}
          </Link>
          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {prop.teamAbbr}
          </span>
          {hasEdge && (
            <span className="rounded-md pro-gradient px-1.5 py-0.5 text-[8px] font-bold text-pro-foreground tracking-wider">
              +{edge.toFixed(0)}% EDGE
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TrendIndicator hitRate={prop.hitRate} hitRateLast10={prop.hitRateLast10} />
          <ConfidenceBadge gamesPlayed={prop.gamesPlayed} />
        </div>
      </div>

      {/* Middle: stat + line + hit rate */}
      <div className="mb-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <TermTooltip term="Line">
              <span className="text-xs text-muted-foreground">{prop.stat}</span>
            </TermTooltip>
            <span className="font-mono text-xl font-bold text-foreground">{prop.line}</span>
          </div>
        </div>
        <div className="text-right">
          <TermTooltip term="Hit Rate">
            <span className="text-[10px] text-muted-foreground">Season</span>
          </TermTooltip>
          <p className="font-mono text-lg font-bold text-foreground">{prop.hitRate}%</p>
          <p className="text-[10px] font-mono text-muted-foreground">
            {gamesOver}/{prop.gamesPlayed} over
          </p>
        </div>
      </div>

      {/* Hit rate bar */}
      <div className="mb-3">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-l-full transition-all ${hasEdge ? "pro-gradient" : "bg-foreground/30"}`}
            style={{ width: `${prop.hitRate}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
          <span>0%</span>
          <TermTooltip term="Last 10">
            <span className="font-mono">L10: {prop.hitRateLast10}%</span>
          </TermTooltip>
          <span>100%</span>
        </div>
      </div>

      {/* Best odds row */}
      {(bestOver || bestUnder) && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Best odds:</span>
          {bestOver && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-success cursor-help">
                  O {formatOdds(bestOver.over)}
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Best Over odds at {bestOver.sportsbook}</TooltipContent>
            </Tooltip>
          )}
          {bestUnder && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-destructive cursor-help">
                  U {formatOdds(bestUnder.under)}
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Best Under odds at {bestUnder.sportsbook}</TooltipContent>
            </Tooltip>
          )}
          <span className="ml-auto text-[9px] text-muted-foreground">
            {prop.sportsbooks.length} book{prop.sportsbooks.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

export default PropExplorerPage;