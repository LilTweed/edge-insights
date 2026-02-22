import { useParams, Link } from "react-router-dom";
import { getTeam, matchupHistories, allGames, allPlayers, allTeams, getPropsForPlayer } from "@/data/mockData";
import PlayerCard from "@/components/PlayerCard";

const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const team = getTeam(id || "");

  if (!team) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Team not found</p>
        <Link to="/teams" className="mt-2 inline-block text-sm text-primary underline">Back to teams</Link>
      </div>
    );
  }

  const stats = team.stats;
  const isFootball = team.sport === "NCAAF";

  // Find matchups involving this team
  const teamMatchups = matchupHistories.filter(m => m.team1Id === team.id || m.team2Id === team.id);

  // Find games for this team
  const teamGames = allGames.filter(g => g.homeTeam.id === team.id || g.awayTeam.id === team.id);

  // Find players on this team
  const teamPlayers = allPlayers.filter(p => p.teamAbbr === team.abbreviation && p.sport === team.sport);

  return (
    <div className="container py-6">
      <Link to="/teams" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Teams
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          {team.abbreviation}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {team.ranking ? `#${team.ranking} ` : ""}{team.city} {team.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {team.record} · {team.conference} · {team.sport}
          </p>
        </div>
      </div>

      {/* Team Stats */}
      {stats && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-foreground">Team Statistics</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-px bg-border">
              {(isFootball ? [
                { label: "PPG", value: stats.ppg },
                { label: "Opp PPG", value: stats.oppPpg },
                { label: "YPG", value: stats.ypg },
                { label: "Rush YPG", value: stats.rushYpg },
                { label: "Pass YPG", value: stats.passYpg },
                { label: "Opp YPG", value: stats.oppYpg },
                { label: "3rd Down %", value: stats.thirdDownPct },
                { label: "Red Zone %", value: stats.redZonePct },
                { label: "Sacks", value: stats.sacks },
                { label: "Takeaways", value: stats.takeaways },
              ] : [
                { label: "PPG", value: stats.ppg },
                { label: "Opp PPG", value: stats.oppPpg },
                { label: "RPG", value: stats.rpg },
                { label: "APG", value: stats.apg },
                { label: "FG%", value: stats.fgPct },
                { label: "3P%", value: stats.threePct },
                { label: "FT%", value: stats.ftPct },
                { label: "Turnovers", value: stats.turnovers },
                { label: "Steals", value: stats.steals },
                { label: "Blocks", value: stats.blocks },
              ]).map((s) => (
                <div key={s.label} className="bg-card p-3 text-center">
                  <p className="font-mono text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] font-medium text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Head-to-Head Records */}
      {teamMatchups.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-foreground">Head-to-Head Records</h2>
          <div className="space-y-4">
            {teamMatchups.map((m) => {
              const isTeam1 = m.team1Id === team.id;
              const oppId = isTeam1 ? m.team2Id : m.team1Id;
              const oppTeam = allTeams.find(t => t.id === oppId);
              if (!oppTeam) return null;

              const record = isTeam1
                ? `${m.allTime.wins}-${m.allTime.losses}`
                : `${m.allTime.losses}-${m.allTime.wins}`;

              return (
                <div key={oppId} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-[9px] font-bold text-secondary-foreground">
                        {oppTeam.abbreviation}
                      </div>
                      <Link to={`/team/${oppId}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                        vs {oppTeam.city} {oppTeam.name}
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-foreground">{record}</p>
                      <p className="text-[10px] text-muted-foreground">All-Time</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="rounded-lg bg-secondary/60 p-2 text-center">
                      <p className="font-mono text-sm font-bold text-foreground">
                        {isTeam1 ? m.last10.team1Wins : m.last10.team2Wins}-{isTeam1 ? m.last10.team2Wins : m.last10.team1Wins}
                      </p>
                      <p className="text-[9px] text-muted-foreground">Last 10</p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 p-2 text-center">
                      <p className="font-mono text-sm font-bold text-foreground">
                        {isTeam1 ? m.last5.team1Wins : m.last5.team2Wins}-{isTeam1 ? m.last5.team2Wins : m.last5.team1Wins}
                      </p>
                      <p className="text-[9px] text-muted-foreground">Last 5</p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 p-2 text-center">
                      <p className="font-mono text-xs font-bold text-foreground">{m.streak}</p>
                      <p className="text-[9px] text-muted-foreground">Streak</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-muted-foreground">Recent Meetings</span>
                    {m.last5.results.map((r, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/40 px-2.5 py-1.5">
                        <span className="text-[11px] text-muted-foreground">{r.date}</span>
                        <span className="font-mono text-[11px] font-semibold text-foreground">
                          {isTeam1 ? r.team1Score : r.team2Score} - {isTeam1 ? r.team2Score : r.team1Score}
                        </span>
                        <span className="text-[10px] text-muted-foreground max-w-[120px] truncate">{r.location}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Roster */}
      {teamPlayers.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-foreground">Roster</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Games */}
      {teamGames.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-bold text-foreground">Games</h2>
          <div className="space-y-2">
            {teamGames.map((g) => {
              const isHome = g.homeTeam.id === team.id;
              const opp = isHome ? g.awayTeam : g.homeTeam;
              return (
                <Link key={g.id} to={`/game/${g.id}`} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{isHome ? "vs" : "@"}</span>
                    <span className="text-sm font-semibold text-foreground">{opp.city} {opp.name}</span>
                    {opp.ranking && <span className="text-[10px] text-muted-foreground">#{opp.ranking}</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">{g.time}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetailPage;
