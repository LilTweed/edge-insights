import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import {
  searchHistorical,
  getStatColumns,
  formatStatLabel,
  type TeamHistorical,
  type PlayerHistorical,
} from "@/data/historicalStats";

const HistoricalSearch = () => {
  const [query, setQuery] = useState("");
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const results = useMemo(() => searchHistorical(query), [query]);
  const hasResults = results.teams.length > 0 || results.players.length > 0;

  return (
    <div>
      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any team or player for historical stats…"
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {!query && (
        <div className="text-center py-12">
          <Search className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">Search for a team or player</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try "LeBron", "Lakers", "Mahomes", "Arsenal", "McDavid"…
          </p>
        </div>
      )}

      {query && !hasResults && (
        <p className="text-center text-sm text-muted-foreground py-12">No results for "{query}"</p>
      )}

      {/* Teams */}
      {results.teams.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">
            Teams ({results.teams.length})
          </h3>
          <div className="space-y-2">
            {results.teams.map((team) => (
              <TeamHistoryCard
                key={team.id}
                team={team}
                isExpanded={expandedTeam === team.id}
                onToggle={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Players */}
      {results.players.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">
            Players ({results.players.length})
          </h3>
          <div className="space-y-2">
            {results.players.map((player) => (
              <PlayerHistoryCard
                key={player.id}
                player={player}
                isExpanded={expandedPlayer === player.id}
                onToggle={() => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function TeamHistoryCard({ team, isExpanded, onToggle }: { team: TeamHistorical; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-primary-foreground">
            {team.abbreviation}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{team.city} {team.name}</p>
            <p className="text-[10px] text-muted-foreground">{team.sport} · {team.conference} · {team.seasons.length} seasons</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {isExpanded && (
        <div className="border-t border-border px-4 py-4 space-y-4 animate-fade-in">
          {/* Season-by-season table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-2 text-left font-bold text-muted-foreground">Season</th>
                  <th className="px-2 py-2 text-center font-bold text-muted-foreground">Record</th>
                  <th className="px-2 py-2 text-center font-bold text-muted-foreground">Win%</th>
                  <th className="px-2 py-2 text-center font-bold text-muted-foreground">Home</th>
                  <th className="px-2 py-2 text-center font-bold text-muted-foreground">Away</th>
                  <th className="px-2 py-2 text-center font-bold text-muted-foreground">{team.sport === "Soccer" ? "GF/G" : "PPG"}</th>
                  <th className="px-2 py-2 text-center font-bold text-muted-foreground">{team.sport === "Soccer" ? "GA/G" : "OPP"}</th>
                  <th className="px-2 py-2 text-center font-bold text-muted-foreground">Last 5</th>
                  <th className="px-2 py-2 text-left font-bold text-muted-foreground">Postseason</th>
                </tr>
              </thead>
              <tbody>
                {team.seasons.map((s) => (
                  <tr key={s.year} className="border-b border-border/30 last:border-0">
                    <td className="px-2 py-2 font-semibold text-foreground">{s.year}</td>
                    <td className="px-2 py-2 text-center font-mono text-foreground">{s.record}</td>
                    <td className="px-2 py-2 text-center font-mono text-foreground">{(s.winPct * 100).toFixed(1)}%</td>
                    <td className="px-2 py-2 text-center font-mono text-muted-foreground">{s.homeRecord}</td>
                    <td className="px-2 py-2 text-center font-mono text-muted-foreground">{s.awayRecord}</td>
                    <td className="px-2 py-2 text-center font-mono text-foreground">{s.ppg}</td>
                    <td className="px-2 py-2 text-center font-mono text-foreground">{s.oppPpg}</td>
                    <td className="px-2 py-2 text-center">
                      <div className="flex justify-center gap-0.5">
                        {s.last5.split("-").map((r, i) => (
                          <span
                            key={i}
                            className={`inline-flex h-4 w-4 items-center justify-center rounded-sm text-[8px] font-bold ${
                              r === "W" ? "bg-success/15 text-success" : r === "L" ? "bg-destructive/15 text-destructive" : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-[10px] text-muted-foreground">{s.playoffs || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* H2H */}
          {Object.keys(team.h2h).length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase text-muted-foreground mb-2">Head-to-Head Records</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(team.h2h).map(([opp, rec]) => (
                  <div key={opp} className="rounded-lg bg-secondary/60 px-3 py-1.5">
                    <span className="text-[10px] font-bold text-foreground">vs {opp}</span>
                    <span className="ml-2 font-mono text-[10px] text-muted-foreground">{rec.wins}-{rec.losses}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlayerHistoryCard({ player, isExpanded, onToggle }: { player: PlayerHistorical; isExpanded: boolean; onToggle: () => void }) {
  const columns = getStatColumns(player.sport);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-[10px] font-bold text-secondary-foreground">
            {player.teamAbbr}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{player.name}</p>
            <p className="text-[10px] text-muted-foreground">{player.sport} · {player.position} · {player.team} · {player.seasons.length} seasons</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {isExpanded && (
        <div className="border-t border-border px-4 py-4 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-2 text-left font-bold text-muted-foreground">Season</th>
                  <th className="px-2 py-2 text-left font-bold text-muted-foreground">Team</th>
                  <th className="px-2 py-2 text-center font-bold text-muted-foreground">GP</th>
                  {columns.map((col) => (
                    <th key={col} className="px-2 py-2 text-center font-bold text-muted-foreground">
                      {formatStatLabel(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {player.seasons.map((s) => (
                  <tr key={s.year} className="border-b border-border/30 last:border-0">
                    <td className="px-2 py-2 font-semibold text-foreground">{s.year}</td>
                    <td className="px-2 py-2 text-muted-foreground">{s.team}</td>
                    <td className="px-2 py-2 text-center font-mono text-muted-foreground">{s.gamesPlayed}</td>
                    {columns.map((col) => (
                      <td key={col} className="px-2 py-2 text-center font-mono text-foreground">
                        {s.stats[col] != null ? (
                          typeof s.stats[col] === "number" && !Number.isInteger(s.stats[col])
                            ? s.stats[col].toFixed(1)
                            : s.stats[col]
                        ) : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoricalSearch;
