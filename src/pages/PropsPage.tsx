import { propLines, allGames, type Sport, type PropLine, type Game, formatOdds } from "@/data/mockData";
import HitRateTransparencyPanel from "@/components/HitRateTransparencyPanel";
import PropCard from "@/components/PropCard";
import SportsbookComparisonWidget from "@/components/SportsbookComparisonWidget";
import SportFilter from "@/components/SportFilter";
import ExportableDataView from "@/components/ExportableDataView";
import AdvancedSearch, { type AdvancedFilters } from "@/components/AdvancedSearch";
import MiniSlipBuilder from "@/components/MiniSlipBuilder";
import { useState, useMemo } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeGate from "@/components/UpgradeGate";
import { Share2, Search, ArrowUpDown, LayoutList, LayoutGrid, Table2, DollarSign, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

type SortKey = "player" | "line" | "hitRate" | "edge";
type ViewMode = "basic" | "advanced" | "compare";
type PropsTab = "props" | "moneylines" | "overunders";

const defaultAdvanced: AdvancedFilters = {
  teams: [],
  players: [],
  stats: [],
  minHitRate: 0,
  minLine: null,
  maxLine: null,
};

const PropsPage = () => {
  const { tier, isBasicOrAbove, isAdvanced: hasAdvanced } = useSubscription();
  const [sport, setSport] = useState<Sport>("NBA");
  const [exportOpen, setExportOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("hitRate");
  const [sortAsc, setSortAsc] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedFilters>(defaultAdvanced);
  const [viewMode, setViewMode] = useState<ViewMode>("basic");
  const [activeTab, setActiveTab] = useState<PropsTab>("props");

  const sportProps = useMemo(() => propLines.filter((p) => p.sport === sport), [sport]);
  const sportGames = useMemo(() => allGames.filter((g) => g.sport === sport), [sport]);

  const filteredGames = useMemo(() => {
    if (!search) return sportGames;
    const q = search.toLowerCase();
    return sportGames.filter(
      (g) =>
        g.homeTeam.name.toLowerCase().includes(q) ||
        g.awayTeam.name.toLowerCase().includes(q)
    );
  }, [sportGames, search]);

  const availableTeams = useMemo(() => Array.from(new Set(sportProps.map((p) => p.teamAbbr))).sort() as string[], [sportProps]);
  const availablePlayers = useMemo(() => Array.from(new Set(sportProps.map((p) => p.playerName))).sort() as string[], [sportProps]);
  const availableStats = useMemo(() => Array.from(new Set(sportProps.map((p) => p.stat))).sort() as string[], [sportProps]);

  const filtered = useMemo(() => {
    let list = sportProps;
    if (hasAdvanced) {
      if (advanced.teams.length > 0) list = list.filter((p) => advanced.teams.includes(p.teamAbbr));
      if (advanced.players.length > 0) list = list.filter((p) => advanced.players.includes(p.playerName));
      if (advanced.stats.length > 0) list = list.filter((p) => advanced.stats.includes(p.stat));
      if (advanced.minHitRate > 0) list = list.filter((p) => p.hitRate >= advanced.minHitRate);
      if (advanced.minLine !== null) list = list.filter((p) => p.line >= advanced.minLine!);
      if (advanced.maxLine !== null) list = list.filter((p) => p.line <= advanced.maxLine!);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.playerName.toLowerCase().includes(q) ||
          p.teamAbbr.toLowerCase().includes(q) ||
          p.stat.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let diff = 0;
      if (sortBy === "player") diff = a.playerName.localeCompare(b.playerName);
      else if (sortBy === "line") diff = a.line - b.line;
      else if (sortBy === "hitRate") diff = a.hitRate - b.hitRate;
      else {
        const edgeA = a.hitRate - (a.sportsbooks[0] ? 100 / (1 + 100 / Math.abs(a.sportsbooks[0].over)) : 50);
        const edgeB = b.hitRate - (b.sportsbooks[0] ? 100 / (1 + 100 / Math.abs(b.sportsbooks[0].over)) : 50);
        diff = edgeA - edgeB;
      }
      return sortAsc ? diff : -diff;
    });
    return list;
  }, [sportProps, advanced, search, sortBy, sortAsc, hasAdvanced]);

  const hitRateByStat = useMemo(() => {
    const stats = new Map<string, { total: number; sumHR: number; sumHRL10: number; count: number }>();
    filtered.forEach((p) => {
      const entry = stats.get(p.stat) || { total: 0, sumHR: 0, sumHRL10: 0, count: 0 };
      entry.total += p.gamesPlayed;
      entry.sumHR += p.hitRate;
      entry.sumHRL10 += p.hitRateLast10;
      entry.count += 1;
      stats.set(p.stat, entry);
    });
    return Array.from(stats.entries())
      .map(([stat, d]) => ({
        stat,
        avgHitRate: d.count ? Math.round((d.sumHR / d.count) * 10) / 10 : 0,
        avgHitRateL10: d.count ? Math.round((d.sumHRL10 / d.count) * 10) / 10 : 0,
        count: d.count,
      }))
      .sort((a, b) => b.avgHitRate - a.avgHitRate);
  }, [filtered]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc(!sortAsc);
    else { setSortBy(key); setSortAsc(false); }
  };

  const tabs: { key: PropsTab; label: string; icon: React.ElementType; count: number }[] = [
    { key: "props", label: "Player Props", icon: Users, count: filtered.length },
    { key: "moneylines", label: "Money Lines", icon: DollarSign, count: filteredGames.filter((g) => g.moneyline.length > 0).length },
    { key: "overunders", label: "Over/Unders", icon: TrendingUp, count: filteredGames.filter((g) => g.overUnder.length > 0).length },
  ];

  if (!isBasicOrAbove) {
    return (
      <div className="container py-10">
        <UpgradeGate requiredTier="basic" currentTier={tier} feature="Props Overview">
          <div />
        </UpgradeGate>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Props Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasAdvanced
              ? "Player props, money lines & over/unders across all sportsbooks"
              : "Browse today's player props at a glance"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "props" && hasAdvanced && (
            <>
              <div className="inline-flex rounded-lg border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setViewMode("basic")}
                  className={`inline-flex items-center gap-1 px-3 py-2 text-[10px] font-semibold transition-colors ${
                    viewMode === "basic" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutList className="h-3.5 w-3.5" /> Basic
                </button>
                <button
                  onClick={() => setViewMode("advanced")}
                  className={`inline-flex items-center gap-1 px-3 py-2 text-[10px] font-semibold transition-colors ${
                    viewMode === "advanced" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Advanced
                </button>
                <button
                  onClick={() => setViewMode("compare")}
                  className={`inline-flex items-center gap-1 px-3 py-2 text-[10px] font-semibold transition-colors ${
                    viewMode === "compare" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Table2 className="h-3.5 w-3.5" /> Compare
                </button>
              </div>
              <button
                onClick={() => setExportOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" /> Export
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      {/* Tab navigation — Advanced gets all tabs, Basic just props */}
      {hasAdvanced ? (
        <div className="mb-4 flex gap-1 rounded-xl border border-border bg-card p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === tab.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player, team, or stat…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {/* Player Props Tab (or always visible for basic) */}
      {(activeTab === "props" || !hasAdvanced) && (
        <>
          {/* Advanced filters — only for advanced tier */}
          {hasAdvanced && (
            <div className="mb-4">
              <AdvancedSearch
                availableTeams={availableTeams}
                availablePlayers={availablePlayers}
                availableStats={availableStats}
                filters={advanced}
                onChange={setAdvanced}
              />
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold text-muted-foreground">No props available</p>
              <p className="mt-1 text-sm text-muted-foreground">Check back when {sport} games are scheduled</p>
            </div>
          ) : (
            <>
              {/* Sort controls */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">
                  {filtered.length} prop{filtered.length !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-2">
                  {(hasAdvanced
                    ? [["hitRate", "Hit Rate"], ["line", "Line"], ["player", "Name"], ["edge", "Edge"]] as [SortKey, string][]
                    : [["hitRate", "Hit Rate"], ["player", "Name"]] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => toggleSort(key)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                        sortBy === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic tier: simple clean list */}
              {!hasAdvanced ? (
                <div className="space-y-2">
                  {filtered.map((prop) => (
                    <SimpleCleanPropCard key={prop.id} prop={prop} />
                  ))}
                </div>
              ) : (
                <>
                  {viewMode === "compare" ? (
                    <SportsbookComparisonWidget props={filtered} />
                  ) : (
                    <div className={viewMode === "advanced" ? "grid gap-4 sm:grid-cols-2" : "space-y-3"}>
                      {filtered.map((prop) => (
                        <PropCard key={prop.id} prop={prop} viewMode={viewMode} />
                      ))}
                    </div>
                  )}

                  {viewMode !== "compare" && filtered.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <HitRateTransparencyPanel props={filtered} hitRateByStat={hitRateByStat} />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Moneylines Tab — Advanced only */}
      {hasAdvanced && activeTab === "moneylines" && (
        filteredGames.filter((g) => g.moneyline.length > 0).length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No money lines available for {sport}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredGames.filter((g) => g.moneyline.length > 0).map((game) => (
              <div key={game.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>{game.awayTeam.abbreviation}</span>
                  <span className="text-[10px] text-muted-foreground">@</span>
                  <span>{game.homeTeam.abbreviation}</span>
                </div>
                {game.moneyline.map((ml, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{ml.sportsbook}</span>
                    <div className="flex gap-4 font-mono">
                      <span className="text-foreground">{formatOdds(ml.away)}</span>
                      <span className="text-foreground">{formatOdds(ml.home)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      )}

      {/* Over/Unders Tab — Advanced only */}
      {hasAdvanced && activeTab === "overunders" && (
        filteredGames.filter((g) => g.overUnder.length > 0).length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No over/unders available for {sport}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredGames.filter((g) => g.overUnder.length > 0).map((game) => (
              <div key={game.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>{game.awayTeam.abbreviation}</span>
                  <span className="text-[10px] text-muted-foreground">@</span>
                  <span>{game.homeTeam.abbreviation}</span>
                </div>
                {game.overUnder.map((ou, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{ou.sportsbook}</span>
                    <div className="flex gap-3 font-mono">
                      <span className="text-foreground">O/U {ou.total}</span>
                      <span className="text-muted-foreground">O {formatOdds(ou.over)}</span>
                      <span className="text-muted-foreground">U {formatOdds(ou.under)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      )}

      {hasAdvanced && <MiniSlipBuilder props={filtered} />}
      {exportOpen && <ExportableDataView open={exportOpen} onClose={() => setExportOpen(false)} title="Props Export" props={filtered} />}
    </div>
  );
};

/** Simple, clean prop card for Basic tier — modern & minimal */
function SimpleCleanPropCard({ prop }: { prop: PropLine }) {
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
      <div className="text-right">
        <p className={`font-mono text-lg font-bold ${prop.hitRate >= 60 ? "text-success" : prop.hitRate <= 40 ? "text-destructive" : "text-foreground"}`}>
          {prop.hitRate}%
        </p>
        <p className="text-[10px] text-muted-foreground">{gamesOver}/{prop.gamesPlayed} over</p>
      </div>
    </Link>
  );
}

export default PropsPage;
