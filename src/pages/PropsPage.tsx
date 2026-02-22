import { propLines, type Sport, type PropLine } from "@/data/mockData";
import PropCard from "@/components/PropCard";
import SportFilter from "@/components/SportFilter";
import ExportableDataView from "@/components/ExportableDataView";
import AdvancedSearch, { type AdvancedFilters } from "@/components/AdvancedSearch";
import MiniSlipBuilder from "@/components/MiniSlipBuilder";
import { useLiveScoreboard, type EspnSport } from "@/hooks/useEspnData";
import { useState, useMemo } from "react";
import { Share2, Search, ArrowUpDown, LayoutList, LayoutGrid, ChevronDown, ChevronUp, Radio } from "lucide-react";

type SortKey = "player" | "line" | "hitRate" | "edge";
type ViewMode = "basic" | "advanced";

const defaultAdvanced: AdvancedFilters = {
  teams: [],
  players: [],
  stats: [],
  minHitRate: 0,
  minLine: null,
  maxLine: null,
};

const ESPN_SPORTS: EspnSport[] = ["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF"];

const PropsPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const [exportOpen, setExportOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("hitRate");
  const [sortAsc, setSortAsc] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedFilters>(defaultAdvanced);
  const [viewMode, setViewMode] = useState<ViewMode>("advanced");
  const [scoresOpen, setScoresOpen] = useState(true);

  const isEspnSport = ESPN_SPORTS.includes(sport as EspnSport);
  const scoreboard = useLiveScoreboard(isEspnSport ? (sport as EspnSport) : "NBA");
  const games = isEspnSport ? (scoreboard.data?.games || []) : [];

  const sportProps = useMemo(() => propLines.filter((p) => p.sport === sport), [sport]);

  // Derive available filter options from the current sport's props
  const availableTeams = useMemo(() => Array.from(new Set(sportProps.map((p) => p.teamAbbr))).sort(), [sportProps]);
  const availablePlayers = useMemo(() => Array.from(new Set(sportProps.map((p) => p.playerName))).sort(), [sportProps]);
  const availableStats = useMemo(() => Array.from(new Set(sportProps.map((p) => p.stat))).sort(), [sportProps]);

  const filtered = useMemo(() => {
    let list = sportProps;

    // Advanced per-field filters
    if (advanced.teams.length > 0) list = list.filter((p) => advanced.teams.includes(p.teamAbbr));
    if (advanced.players.length > 0) list = list.filter((p) => advanced.players.includes(p.playerName));
    if (advanced.stats.length > 0) list = list.filter((p) => advanced.stats.includes(p.stat));
    if (advanced.minHitRate > 0) list = list.filter((p) => p.hitRate >= advanced.minHitRate);
    if (advanced.minLine !== null) list = list.filter((p) => p.line >= advanced.minLine!);
    if (advanced.maxLine !== null) list = list.filter((p) => p.line <= advanced.maxLine!);

    // Text search
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

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc(!sortAsc);
    else { setSortBy(key); setSortAsc(false); }
  };

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Player Props</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare lines across FanDuel, DraftKings, Fanatics & BetMGM
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="inline-flex rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => setViewMode("basic")}
              className={`inline-flex items-center gap-1 px-3 py-2 text-[10px] font-semibold transition-colors ${
                viewMode === "basic"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList className="h-3.5 w-3.5" />
              Basic
            </button>
            <button
              onClick={() => setViewMode("advanced")}
              className={`inline-flex items-center gap-1 px-3 py-2 text-[10px] font-semibold transition-colors ${
                viewMode === "advanced"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Advanced
            </button>
          </div>
          <button
            onClick={() => setExportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      <div className="mb-4">
        <SportFilter active={sport} onChange={setSport} />
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
              {scoreboard.isFetching && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              )}
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
                      <div
                        key={game.id}
                        className={`flex-shrink-0 w-52 rounded-lg border p-3 space-y-2 ${
                          isLive ? "border-destructive/30 bg-destructive/5" : "border-border bg-secondary/30"
                        }`}
                      >
                        {/* Status */}
                        <div className="flex items-center justify-between">
                          {isLive ? (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-destructive">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
                              LIVE
                            </span>
                          ) : isFinal ? (
                            <span className="text-[9px] font-medium text-muted-foreground">Final</span>
                          ) : (
                            <span className="text-[9px] text-muted-foreground">
                              {new Date(game.date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                            </span>
                          )}
                          {game.broadcasts[0] && (
                            <span className="text-[8px] text-muted-foreground">{game.broadcasts[0]}</span>
                          )}
                        </div>

                        {/* Away */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {game.awayTeam.logo && (
                              <img src={game.awayTeam.logo} alt="" className="h-4 w-4 object-contain" />
                            )}
                            <span className="text-[11px] font-semibold text-foreground">{game.awayTeam.abbreviation}</span>
                          </div>
                          {(isLive || isFinal) && (
                            <span className={`font-mono text-sm font-bold ${
                              game.awayScore != null && game.homeScore != null && game.awayScore > game.homeScore
                                ? "text-foreground" : "text-muted-foreground"
                            }`}>{game.awayScore}</span>
                          )}
                        </div>

                        {/* Home */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {game.homeTeam.logo && (
                              <img src={game.homeTeam.logo} alt="" className="h-4 w-4 object-contain" />
                            )}
                            <span className="text-[11px] font-semibold text-foreground">{game.homeTeam.abbreviation}</span>
                          </div>
                          {(isLive || isFinal) && (
                            <span className={`font-mono text-sm font-bold ${
                              game.homeScore != null && game.awayScore != null && game.homeScore > game.awayScore
                                ? "text-foreground" : "text-muted-foreground"
                            }`}>{game.homeScore}</span>
                          )}
                        </div>

                        {/* O/U line */}
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

      <div className="mb-4">
        <AdvancedSearch
          availableTeams={availableTeams}
          availablePlayers={availablePlayers}
          availableStats={availableStats}
          filters={advanced}
          onChange={setAdvanced}
        />
      </div>

      {/* Search + sort bar */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Quick search player, team, or stat…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground">
            {filtered.length} prop{filtered.length !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            {([["hitRate", "Hit Rate"], ["line", "Line"], ["player", "Name"], ["edge", "Edge"]] as [SortKey, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
                  sortBy === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                {sortBy === key && <ArrowUpDown size={10} />}
              </button>
            ))}
          </div>
        </div>
      </div>

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
