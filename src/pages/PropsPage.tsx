import { propLines, allGames, type Sport, type PropLine, type Game, formatOdds } from "@/data/mockData";
import HitRateTransparencyPanel from "@/components/HitRateTransparencyPanel";
import PropCard from "@/components/PropCard";
import SportsbookComparisonWidget from "@/components/SportsbookComparisonWidget";
import SportFilter from "@/components/SportFilter";
import ExportableDataView from "@/components/ExportableDataView";
import AdvancedSearch, { type AdvancedFilters } from "@/components/AdvancedSearch";
import MiniSlipBuilder from "@/components/MiniSlipBuilder";
import { useLiveScoreboard, type EspnSport } from "@/hooks/useEspnData";
import { useLiveOdds } from "@/hooks/useLiveOdds";
import { useSportsRadarSchedule } from "@/hooks/useSportsRadar";
import { useState, useMemo } from "react";
import { Share2, Search, ArrowUpDown, LayoutList, LayoutGrid, ChevronDown, ChevronUp, Radio, Table2, Zap, AlertTriangle, RefreshCw, DollarSign, TrendingUp, Users } from "lucide-react";

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

const ESPN_SPORTS: EspnSport[] = ["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF", "UFC", "PGA"];

const PropsPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const [exportOpen, setExportOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("hitRate");
  const [sortAsc, setSortAsc] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedFilters>(defaultAdvanced);
  const [viewMode, setViewMode] = useState<ViewMode>("advanced");
  const [scoresOpen, setScoresOpen] = useState(true);
  const [liveMode, setLiveMode] = useState(false);
  
  const [activeTab, setActiveTab] = useState<PropsTab>("props");

  const isEspnSport = ESPN_SPORTS.includes(sport as EspnSport);
  const scoreboard = useLiveScoreboard(isEspnSport ? (sport as EspnSport) : "NBA");
  const games = isEspnSport ? (scoreboard.data?.games || []) : [];

  const { data: liveOddsData, isLoading: liveLoading, isFetching: liveFetching } = useLiveOdds(
    sport as EspnSport,
    liveMode && isEspnSport
  );

  const _srSchedule = useSportsRadarSchedule(sport as EspnSport, liveMode && isEspnSport);

  const mockProps = useMemo(() => propLines.filter((p) => p.sport === sport), [sport]);
  const isLiveActive = liveMode && liveOddsData && !liveOddsData.needsApiKey && liveOddsData.props.length > 0;
  const sportProps = isLiveActive ? liveOddsData.props : mockProps;

  // Games for ML / O/U tabs
  const sportGames = useMemo(() => allGames.filter((g) => g.sport === sport), [sport]);

  const filteredGames = useMemo(() => {
    if (!search) return sportGames;
    const q = search.toLowerCase();
    return sportGames.filter(
      (g) =>
        g.homeTeam.name.toLowerCase().includes(q) ||
        g.awayTeam.name.toLowerCase().includes(q) ||
        g.homeTeam.abbreviation.toLowerCase().includes(q) ||
        g.awayTeam.abbreviation.toLowerCase().includes(q)
    );
  }, [sportGames, search]);

  // Props filters
  const availableTeams = useMemo(() => Array.from(new Set(sportProps.map((p) => p.teamAbbr))).sort() as string[], [sportProps]);
  const availablePlayers = useMemo(() => Array.from(new Set(sportProps.map((p) => p.playerName))).sort() as string[], [sportProps]);
  const availableStats = useMemo(() => Array.from(new Set(sportProps.map((p) => p.stat))).sort() as string[], [sportProps]);

  const filtered = useMemo(() => {
    let list = sportProps;
    if (advanced.teams.length > 0) list = list.filter((p) => advanced.teams.includes(p.teamAbbr));
    if (advanced.players.length > 0) list = list.filter((p) => advanced.players.includes(p.playerName));
    if (advanced.stats.length > 0) list = list.filter((p) => advanced.stats.includes(p.stat));
    if (advanced.minHitRate > 0) list = list.filter((p) => p.hitRate >= advanced.minHitRate);
    if (advanced.minLine !== null) list = list.filter((p) => p.line >= advanced.minLine!);
    if (advanced.maxLine !== null) list = list.filter((p) => p.line <= advanced.maxLine!);
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
  }, [sportProps, advanced, search, sortBy, sortAsc]);

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

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Props Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Player props, money lines & over/unders across all sportsbooks
          </p>
          {!liveMode && (
            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-destructive/70 font-medium">
              <AlertTriangle className="h-3 w-3" />
              Sample data — toggle Live to connect real odds
            </p>
          )}
          {liveMode && liveOddsData?.needsApiKey && (
            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-destructive/70 font-medium">
              <AlertTriangle className="h-3 w-3" />
              API key needed — add ODDS_API_KEY in backend secrets
            </p>
          )}
          {isLiveActive && (
            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-primary font-medium">
              <Zap className="h-3 w-3" />
              Live odds · {liveOddsData.props.length} props · Updated {new Date(liveOddsData.fetchedAt).toLocaleTimeString()}
              {liveFetching && <RefreshCw className="h-2.5 w-2.5 animate-spin" />}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-bold transition-all ${
              liveMode
                ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {liveMode ? <Zap className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
            {liveMode ? "Live" : "Sample"}
            {liveLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
          </button>

          {activeTab === "props" && (
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

      {/* Tab navigation */}
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

      {/* Live Scores Panel */}
      {isEspnSport && (
        <div className="mb-4 rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setScoresOpen(!scoresOpen)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-secondary/50"
          >
            <div className="flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-destructive animate-pulse" />
              <span className="text-xs font-bold text-foreground">Live Scores</span>
              <span className="text-[10px] text-muted-foreground">
                {games.length} game{games.length !== 1 ? "s" : ""} · 30s refresh
              </span>
              {scoreboard.isFetching && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
            </div>
            {scoresOpen ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
          {scoresOpen && (
            <div className="border-t border-border px-4 py-3">
              {scoreboard.isLoading ? (
                <p className="text-xs text-muted-foreground text-center py-4">Loading scores…</p>
              ) : games.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No games scheduled today</p>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
                  {games.map((game) => {
                    const isLive = game.status === "in";
                    const isFinal = game.status === "post";
                    return (
                      <div key={game.id} className={`flex-shrink-0 w-52 rounded-lg border p-3 space-y-2 ${isLive ? "border-destructive/30 bg-destructive/5" : "border-border bg-secondary/30"}`}>
                        <div className="flex items-center justify-between">
                          {isLive ? (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-destructive"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />LIVE</span>
                          ) : isFinal ? (
                            <span className="text-[9px] font-medium text-muted-foreground">Final</span>
                          ) : (
                            <span className="text-[9px] text-muted-foreground">{new Date(game.date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                          )}
                          {game.broadcasts[0] && <span className="text-[8px] text-muted-foreground">{game.broadcasts[0]}</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {game.awayTeam.logo && <img src={game.awayTeam.logo} alt="" className="h-4 w-4 object-contain" />}
                            <span className="text-[11px] font-semibold text-foreground">{game.awayTeam.abbreviation}</span>
                          </div>
                          {(isLive || isFinal) && (
                            <span className={`font-mono text-sm font-bold ${game.awayScore != null && game.homeScore != null && game.awayScore > game.homeScore ? "text-foreground" : "text-muted-foreground"}`}>{game.awayScore}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {game.homeTeam.logo && <img src={game.homeTeam.logo} alt="" className="h-4 w-4 object-contain" />}
                            <span className="text-[11px] font-semibold text-foreground">{game.homeTeam.abbreviation}</span>
                          </div>
                          {(isLive || isFinal) && (
                            <span className={`font-mono text-sm font-bold ${game.homeScore != null && game.awayScore != null && game.homeScore > game.awayScore ? "text-foreground" : "text-muted-foreground"}`}>{game.homeScore}</span>
                          )}
                        </div>
                        {game.odds[0]?.overUnder != null && (
                          <div className="text-[9px] font-mono text-muted-foreground text-center border-t border-border/50 pt-1.5">
                            O/U {game.odds[0].overUnder} · SPR {game.odds[0].spread > 0 ? "+" : ""}{game.odds[0].spread}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search bar (shared across all tabs) */}
      <div className="mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === "props" ? "Search player, team, or stat…" : "Search teams…"}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {/* ═══════════ PLAYER PROPS TAB ═══════════ */}
      {activeTab === "props" && (
        <>
          <div className="mb-4">
            <AdvancedSearch
              availableTeams={availableTeams}
              availablePlayers={availablePlayers}
              availableStats={availableStats}
              filters={advanced}
              onChange={setAdvanced}
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="text-[11px] text-muted-foreground">
              {filtered.length} prop{filtered.length !== 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-2">
              {([["hitRate", "Hit Rate"], ["line", "Line"], ["player", "Name"], ["edge", "Edge"]] as [SortKey, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleSort(key)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
                    sortBy === key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                  {sortBy === key && <ArrowUpDown size={10} />}
                </button>
              ))}
            </div>
          </div>

          {/* Hit Rate Transparency Panel */}
          <div className="mb-4">
            <HitRateTransparencyPanel props={filtered} hitRateByStat={hitRateByStat} />
          </div>

          {viewMode === "compare" ? (
            <SportsbookComparisonWidget props={filtered} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((prop) => (
                <PropCard
                  key={prop.id}
                  prop={prop}
                  viewMode={viewMode}
                  onAddToSlip={(p, side) => {
                    window.dispatchEvent(new CustomEvent("lvrg-add-to-slip", { detail: { prop: p, side } }));
                  }}
                />
              ))}
              {filtered.length === 0 && (
                <p className="col-span-3 text-center text-sm text-muted-foreground py-12">No props match your filters</p>
              )}
            </div>
          )}
        </>
      )}

      {/* ═══════════ MONEY LINES TAB ═══════════ */}
      {activeTab === "moneylines" && (
        <div className="space-y-3">
          {filteredGames.filter((g) => g.moneyline.length > 0).length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">No money line data available for {sport}</p>
          ) : (
            filteredGames
              .filter((g) => g.moneyline.length > 0)
              .map((game) => (
                <div key={game.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  {/* Game header */}
                  <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {game.awayTeam.logo && <img src={game.awayTeam.logo} alt="" className="h-5 w-5 object-contain" />}
                        <span className="text-sm font-bold text-foreground">{game.awayTeam.abbreviation}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">@</span>
                      <div className="flex items-center gap-1.5">
                        {game.homeTeam.logo && <img src={game.homeTeam.logo} alt="" className="h-5 w-5 object-contain" />}
                        <span className="text-sm font-bold text-foreground">{game.homeTeam.abbreviation}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {game.status === "live" ? "LIVE" : game.time}
                      </span>
                      {game.spread?.[0] && (
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                          SPR {game.spread[0].home > 0 ? "+" : ""}{game.spread[0].home}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Sportsbook lines */}
                  <div className="divide-y divide-border/50">
                    <div className="grid grid-cols-3 px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <span>Sportsbook</span>
                      <span className="text-center">{game.awayTeam.abbreviation}</span>
                      <span className="text-center">{game.homeTeam.abbreviation}</span>
                    </div>
                    {game.moneyline.map((ml) => {
                      const bestHome = Math.max(...game.moneyline.map((m) => m.home));
                      const bestAway = Math.max(...game.moneyline.map((m) => m.away));
                      return (
                        <div key={ml.sportsbook} className="grid grid-cols-3 px-4 py-2.5 text-sm">
                          <span className="text-xs font-medium text-foreground">{ml.sportsbook}</span>
                          <span className={`text-center font-mono font-bold ${ml.away === bestAway ? "text-primary" : "text-foreground"}`}>
                            {formatOdds(ml.away)}
                          </span>
                          <span className={`text-center font-mono font-bold ${ml.home === bestHome ? "text-primary" : "text-foreground"}`}>
                            {formatOdds(ml.home)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* ═══════════ OVER/UNDERS TAB ═══════════ */}
      {activeTab === "overunders" && (
        <div className="space-y-3">
          {filteredGames.filter((g) => g.overUnder.length > 0).length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">No over/under data available for {sport}</p>
          ) : (
            filteredGames
              .filter((g) => g.overUnder.length > 0)
              .map((game) => (
                <div key={game.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  {/* Game header */}
                  <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {game.awayTeam.logo && <img src={game.awayTeam.logo} alt="" className="h-5 w-5 object-contain" />}
                        <span className="text-sm font-bold text-foreground">{game.awayTeam.abbreviation}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">@</span>
                      <div className="flex items-center gap-1.5">
                        {game.homeTeam.logo && <img src={game.homeTeam.logo} alt="" className="h-5 w-5 object-contain" />}
                        <span className="text-sm font-bold text-foreground">{game.homeTeam.abbreviation}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {game.status === "live" ? "LIVE" : game.time}
                    </span>
                  </div>
                  {/* O/U lines */}
                  <div className="divide-y divide-border/50">
                    <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <span>Sportsbook</span>
                      <span className="text-center">Total</span>
                      <span className="text-center">Over</span>
                      <span className="text-center">Under</span>
                    </div>
                    {game.overUnder.map((ou) => {
                      const bestTotal = Math.max(...game.overUnder.map((o) => o.total));
                      return (
                        <div key={ou.sportsbook} className="grid grid-cols-4 px-4 py-2.5 text-sm">
                          <span className="text-xs font-medium text-foreground">{ou.sportsbook}</span>
                          <span className={`text-center font-mono font-bold ${ou.total === bestTotal ? "text-primary" : "text-foreground"}`}>
                            {ou.total}
                          </span>
                          <span className="text-center font-mono text-foreground">{formatOdds(ou.over)}</span>
                          <span className="text-center font-mono text-foreground">{formatOdds(ou.under)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      <MiniSlipBuilder props={filtered} />

      <ExportableDataView
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title={`${sport} Props${advanced.stats.length > 0 ? ` — ${advanced.stats.join(", ")}` : ""}`}
        props={filtered}
      />
    </div>
  );
};

export default PropsPage;
