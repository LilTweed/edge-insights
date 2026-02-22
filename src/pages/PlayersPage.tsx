import { allPlayers, type Sport } from "@/data/mockData";
import PlayerCard from "@/components/PlayerCard";
import SportFilter from "@/components/SportFilter";
import { useState, useMemo } from "react";

const PlayersPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("All");
  const [teamFilter, setTeamFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const sportPlayers = useMemo(
    () => allPlayers.filter((p) => p.sport === sport),
    [sport]
  );

  // Unique positions and teams for current sport
  const positions = useMemo(
    () => ["All", ...Array.from(new Set(sportPlayers.map((p) => p.position))).sort()],
    [sportPlayers]
  );
  const teams = useMemo(
    () => ["All", ...Array.from(new Set(sportPlayers.map((p) => p.teamAbbr))).sort()],
    [sportPlayers]
  );

  // Reset filters on sport change
  const handleSportChange = (s: Sport) => {
    setSport(s);
    setPosFilter("All");
    setTeamFilter("All");
  };

  const filtered = sportPlayers
    .filter((p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.teamAbbr.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => posFilter === "All" || p.position === posFilter)
    .filter((p) => teamFilter === "All" || p.teamAbbr === teamFilter)
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "team") return a.teamAbbr.localeCompare(b.teamAbbr);
      if (sortBy === "ppg") return b.seasonAverages.points - a.seasonAverages.points;
      if (sortBy === "gp") return b.stats.gamesPlayed - a.stats.gamesPlayed;
      return 0;
    });

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Players</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Season averages, shooting splits, and detailed stats
        </p>
      </div>

      <div className="mb-4">
        <SportFilter active={sport} onChange={handleSportChange} />
      </div>

      {/* Filters row */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-[200px] rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        />

        {/* Position filter */}
        <select
          value={posFilter}
          onChange={(e) => setPosFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos === "All" ? "All Positions" : pos}
            </option>
          ))}
        </select>

        {/* Team filter */}
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          {teams.map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "All Teams" : t}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          <option value="name">Sort: Name</option>
          <option value="team">Sort: Team</option>
          <option value="ppg">Sort: Top Stat</option>
          <option value="gp">Sort: Games Played</option>
        </select>
      </div>

      <p className="mb-3 text-xs text-muted-foreground">{filtered.length} players</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-3 py-12 text-center text-sm text-muted-foreground">
            No players found
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayersPage;
