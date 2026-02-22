import { propLines, type Sport } from "@/data/mockData";
import PropCard from "@/components/PropCard";
import SportFilter from "@/components/SportFilter";
import ExportableDataView from "@/components/ExportableDataView";
import { useState, useMemo } from "react";
import { Share2, Search, ArrowUpDown } from "lucide-react";

type SortKey = "player" | "line" | "hitRate" | "edge";

const PropsPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const [activeFilter, setActiveFilter] = useState("All");
  const [exportOpen, setExportOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("hitRate");
  const [sortAsc, setSortAsc] = useState(false);
  const [minHitRate, setMinHitRate] = useState(0);

  const sportProps = useMemo(() => propLines.filter((p) => p.sport === sport), [sport]);
  const statFilters = useMemo(() => {
    const stats = Array.from(new Set(sportProps.map((p) => p.stat)));
    return ["All", ...stats];
  }, [sportProps]);

  const filtered = useMemo(() => {
    let list = sportProps
      .filter((p) => activeFilter === "All" || p.stat === activeFilter)
      .filter((p) => p.hitRate >= minHitRate);

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
  }, [sportProps, activeFilter, search, sortBy, sortAsc, minHitRate]);

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
        <button
          onClick={() => setExportOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          Export
        </button>
      </div>

      <div className="mb-4">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      {/* Search + filters bar */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player, team, or stat…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Stat filters */}
          <div className="flex flex-wrap gap-1.5">
            {statFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={
                  activeFilter === filter
                    ? "rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors"
                    : "rounded-lg bg-secondary px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                }
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Min hit rate filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5">
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">Min HR:</span>
              <input
                type="number"
                min={0}
                max={100}
                value={minHitRate}
                onChange={(e) => setMinHitRate(Number(e.target.value) || 0)}
                className="w-12 bg-transparent text-xs text-foreground outline-none"
              />
              <span className="text-[10px] text-muted-foreground">%</span>
            </div>

            {/* Sort buttons */}
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

        <div className="text-[11px] text-muted-foreground">
          {filtered.length} prop{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((prop) => (
          <PropCard key={prop.id} prop={prop} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-3 text-center text-sm text-muted-foreground py-12">No props match your filters</p>
        )}
      </div>

      <ExportableDataView
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title={`${sport} Props${activeFilter !== "All" ? ` — ${activeFilter}` : ""}`}
        props={filtered}
      />
    </div>
  );
};

export default PropsPage;
