import { useState, useMemo } from "react";
import { type Sport } from "@/data/mockData";
import { allPlayers } from "@/data/mockData";
import PlayerCard from "@/components/PlayerCard";
import EspnPlayerCard from "@/components/EspnPlayerCard";
import SportFilter from "@/components/SportFilter";
import { useEspnTeams, useTeamRoster, type EspnSport, type EspnRosterPlayer } from "@/hooks/useEspnData";
import { RefreshCw, Search } from "lucide-react";

const ESPN_SPORTS = ["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF"] as const;

const PlayersPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("All");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const isEspnSport = (ESPN_SPORTS as readonly string[]).includes(sport);

  // ESPN data
  const { data: espnTeams, isLoading: teamsLoading } = useEspnTeams(sport as EspnSport);
  const { data: roster, isLoading: rosterLoading } = useTeamRoster(
    sport as EspnSport,
    selectedTeamId || undefined
  );

  // Auto-select first team
  const teams = espnTeams || [];
  const effectiveTeamId = selectedTeamId || (teams.length > 0 ? teams[0].id : "");

  // Fetch roster for effective team
  const { data: effectiveRoster, isLoading: effectiveRosterLoading } = useTeamRoster(
    sport as EspnSport,
    !selectedTeamId && effectiveTeamId ? effectiveTeamId : undefined
  );

  const currentRoster = selectedTeamId ? roster : effectiveRoster;
  const isRosterLoading = selectedTeamId ? rosterLoading : effectiveRosterLoading;

  const selectedTeam = teams.find(t => t.id === (selectedTeamId || effectiveTeamId));

  // Filter roster
  const positions = useMemo(() => {
    if (!currentRoster) return ["All"];
    const posSet = new Set(currentRoster.map(p => p.position));
    return ["All", ...Array.from(posSet).sort()];
  }, [currentRoster]);

  const filteredRoster = useMemo(() => {
    if (!currentRoster) return [];
    return currentRoster
      .filter(p => posFilter === "All" || p.position === posFilter)
      .filter(p => {
        if (!search) return true;
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.position.toLowerCase().includes(q);
      });
  }, [currentRoster, posFilter, search]);

  // Fallback for esports
  const mockPlayers = allPlayers.filter(p => p.sport === sport);
  const filteredMock = mockPlayers
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => posFilter === "All" || p.position === posFilter);

  const handleSportChange = (s: Sport) => {
    setSport(s);
    setPosFilter("All");
    setSelectedTeamId("");
    setSearch("");
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Players</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEspnSport
            ? "Live rosters & career stats from ESPN — select a team to view roster"
            : "Season averages and detailed stats"}
        </p>
      </div>

      <div className="mb-4">
        <SportFilter active={sport} onChange={handleSportChange} />
      </div>

      {/* Filters */}
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

        {isEspnSport && (
          <select
            value={selectedTeamId || effectiveTeamId}
            onChange={(e) => {
              setSelectedTeamId(e.target.value);
              setPosFilter("All");
            }}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          >
            {teamsLoading && <option>Loading teams...</option>}
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.abbreviation} — {t.name}</option>
            ))}
          </select>
        )}

        <select
          value={posFilter}
          onChange={(e) => setPosFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          {positions.map(pos => (
            <option key={pos} value={pos}>
              {pos === "All" ? "All Positions" : pos}
            </option>
          ))}
        </select>
      </div>

      {/* ESPN Players */}
      {isEspnSport && (
        <>
          {(teamsLoading || isRosterLoading) && (
            <div className="flex flex-col items-center gap-2 py-16">
              <RefreshCw size={24} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading {selectedTeam?.name || sport} roster…</p>
            </div>
          )}

          {!teamsLoading && !isRosterLoading && filteredRoster.length > 0 && (
            <>
              <p className="mb-3 text-xs text-muted-foreground">
                {filteredRoster.length} players · {selectedTeam?.name} {selectedTeam?.record ? `(${selectedTeam.record})` : ''}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRoster.map(player => (
                  <EspnPlayerCard
                    key={player.id}
                    player={player}
                    sport={sport as EspnSport}
                    teamName={selectedTeam?.name}
                    teamAbbr={selectedTeam?.abbreviation}
                  />
                ))}
              </div>
            </>
          )}

          {!teamsLoading && !isRosterLoading && filteredRoster.length === 0 && currentRoster && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No players match your filters
            </p>
          )}
        </>
      )}

      {/* Esports fallback */}
      {!isEspnSport && (
        <>
          <p className="mb-3 text-xs text-muted-foreground">{filteredMock.length} players</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMock.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
            {filteredMock.length === 0 && (
              <p className="col-span-3 py-12 text-center text-sm text-muted-foreground">
                No players found
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayersPage;
