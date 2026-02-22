import { useState } from "react";
import { type Sport } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import { Search } from "lucide-react";

const PlayersPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const [search, setSearch] = useState("");

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Players</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse player stats and rosters</p>
      </div>

      <div className="mb-4">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-[200px] rounded-lg border border-border bg-card pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      <p className="py-12 text-center text-sm text-muted-foreground">
        No player data available
      </p>
    </div>
  );
};

export default PlayersPage;
