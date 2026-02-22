import { propLines, type Sport } from "@/data/mockData";
import PropCard from "@/components/PropCard";
import SportFilter from "@/components/SportFilter";
import { useState } from "react";

const statFilters = ["All", "Points", "Rebounds", "Assists"];

const PropsPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = propLines
    .filter(p => p.sport === sport)
    .filter(p => activeFilter === "All" || p.stat === activeFilter);

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Player Props</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare lines across FanDuel, DraftKings, Fanatics & BetMGM
        </p>
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
    </div>
  );
};

export default PropsPage;
