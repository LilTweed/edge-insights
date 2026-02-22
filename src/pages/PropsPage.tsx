import { propLines, type Sport } from "@/data/mockData";
import PropCard from "@/components/PropCard";
import SportFilter from "@/components/SportFilter";
import ExportableDataView from "@/components/ExportableDataView";
import { useState } from "react";
import { Share2 } from "lucide-react";

const statFilters = ["All", "Points", "Rebounds", "Assists"];

const PropsPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const [activeFilter, setActiveFilter] = useState("All");
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = propLines
    .filter(p => p.sport === sport)
    .filter(p => activeFilter === "All" || p.stat === activeFilter);

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

      <div className="mb-5 flex gap-1.5">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((prop) => (
          <PropCard key={prop.id} prop={prop} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-3 text-center text-sm text-muted-foreground py-12">No props available</p>
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
