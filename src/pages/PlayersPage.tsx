import { players } from "@/data/mockData";
import PlayerCard from "@/components/PlayerCard";
import { useState } from "react";

const PlayersPage = () => {
  const [search, setSearch] = useState("");

  const filteredPlayers = search
    ? players.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.teamAbbr.toLowerCase().includes(search.toLowerCase())
      )
    : players;

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Players</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Season averages, shooting splits, and detailed stats
        </p>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Search players or teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-border bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default PlayersPage;
