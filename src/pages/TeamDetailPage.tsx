import { useParams, Link } from "react-router-dom";
import { getTeam, matchupHistories, allGames, allPlayers, allTeams, injuries, propLines, getTeamsBySport, formatOdds } from "@/data/mockData";
import PlayerCard from "@/components/PlayerCard";
import { useState } from "react";

const injuryStatusColor = (status: string) => {
  switch (status) {
    case "Out": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "Doubtful": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "Questionable": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Probable": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Day-to-Day": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "bg-muted text-muted-foreground";
  }
};

const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [showAdvanced, setShowAdvanced] = useState(false);
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
  const isFootball = team.sport === "NCAAF" || team.sport === "NFL";
  const teamMatchups = matchupHistories.filter(m => m.team1Id === team.id || m.team2Id === team.id);
  const teamGames = allGames.filter(g => g.homeTeam.id === team.id || g.awayTeam.id === team.id);
  const teamPlayers = allPlayers.filter(p => p.teamAbbr === team.abbreviation && p.sport === team.sport);
  const teamInjuries = injuries.filter(i => i.teamAbbr === team.abbreviation);
  const teamProps = propLines.filter(p => p.teamAbbr === team.abbreviation);
  const conferenceTeams = getTeamsBySport(team.sport).filter(t => t.conference === team.conference);

  // Compute point differential
  const pointDiff = stats ? (stats.ppg - stats.oppPpg).toFixed(1) : null;

  return (
    <div className="container py-6">
      <Link to="/teams" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Teams
      </Link>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`rounded-lg border px-4 py-2 text-xs font-bold transition-all ${
            showAdvanced
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40"
          }`}
        >
          {showAdvanced ? "⚡ Advanced" : "📊 Advanced"}
        </button>
      </div>

      {/* Team Injuries Alert */}
      {teamInjuries.length > 0 && (
        <div className="mb-4 rounded-xl border border-border bg-card p-3">
          <h3 className="mb-2 text-xs font-bold text-muted-foreground">🏥 INJURY REPORT</h3>
          <div className="flex flex-wrap gap-2">
            {teamInjuries.map((inj, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${injuryStatusColor(inj.status)}`}>
                {inj.player} — {inj.status}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Team Stats */}
      {stats && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-foreground">Team Statistics</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-px bg-border">
              {(isFootball ? [
                { label: "PPG", value: stats.ppg },
                { label: "Opp PPG", value: stats.oppPpg },
                { label: "Pt Diff", value: `${Number(pointDiff) > 0 ? "+" : ""}${pointDiff}` },
                { label: "YPG", value: stats.ypg },
                { label: "Rush YPG", value: stats.rushYpg },
                { label: "Pass YPG", value: stats.passYpg },
                { label: "Opp YPG", value: stats.oppYpg },
                { label: "3rd Down %", value: stats.thirdDownPct },
                { label: "Red Zone %", value: stats.redZonePct },
                { label: "Sacks", value: stats.sacks },
                { label: "Takeaways", value: stats.takeaways },
                { label: "Turnovers", value: stats.turnovers },
              ] : [
                { label: "PPG", value: stats.ppg },
                { label: "Opp PPG", value: stats.oppPpg },
                { label: "Pt Diff", value: `${Number(pointDiff) > 0 ? "+" : ""}${pointDiff}` },
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

      {/* Advanced sections */}
      {showAdvanced && (
        <>
          {/* Conference Standings */}
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-bold text-foreground">🏆 {team.conference} Standings</h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-2 text-left text-muted-foreground">#</th>
                    <th className="px-4 py-2 text-left text-muted-foreground">Team</th>
                    <th className="px-4 py-2 text-right text-muted-foreground">Record</th>
                    <th className="px-4 py-2 text-right text-muted-foreground">PPG</th>
                    <th className="px-4 py-2 text-right text-muted-foreground">Opp PPG</th>
                    <th className="px-4 py-2 text-right text-muted-foreground">Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {conferenceTeams
                    .sort((a, b) => {
                      const aWins = parseInt(a.record.split("-")[0]);
                      const bWins = parseInt(b.record.split("-")[0]);
                      return bWins - aWins;
                    })
                    .map((ct, idx) => (
                      <tr key={ct.id} className={`border-b border-border/30 last:border-0 ${ct.id === team.id ? "bg-primary/10" : ""}`}>
                        <td className="px-4 py-2 font-mono font-bold text-muted-foreground">{idx + 1}</td>
                        <td className="px-4 py-2">
                          <Link to={`/team/${ct.id}`} className={`font-medium transition-colors ${ct.id === team.id ? "text-primary font-bold" : "text-foreground hover:text-primary"}`}>
                            {ct.ranking ? `#${ct.ranking} ` : ""}{ct.city} {ct.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-foreground">{ct.record}</td>
                        <td className="px-4 py-2 text-right font-mono text-foreground">{ct.stats?.ppg ?? "—"}</td>
                        <td className="px-4 py-2 text-right font-mono text-foreground">{ct.stats?.oppPpg ?? "—"}</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold">
                          {ct.stats ? (
                            <span className={ct.stats.ppg - ct.stats.oppPpg > 0 ? "text-green-400" : "text-red-400"}>
                              {ct.stats.ppg - ct.stats.oppPpg > 0 ? "+" : ""}{(ct.stats.ppg - ct.stats.oppPpg).toFixed(1)}
                            </span>
                          ) : "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Props */}
          {teamProps.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">📊 All Player Props — {team.abbreviation}</h2>
              <div className="space-y-3">
                {teamProps.map((prop) => (
                  <div key={prop.id} className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="border-b border-border bg-secondary/30 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Link to={`/player/${prop.playerId}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                          {prop.playerName}
                        </Link>
                        <span className="text-xs text-muted-foreground">{prop.stat}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                          Line: {prop.line}
                        </span>
                        <span className={`text-xs font-bold ${prop.hitRate >= 60 ? "text-green-400" : prop.hitRate >= 45 ? "text-yellow-400" : "text-red-400"}`}>
                          {prop.hitRate}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="px-4 py-1.5 text-left text-muted-foreground">Book</th>
                            <th className="px-4 py-1.5 text-right text-muted-foreground">Line</th>
                            <th className="px-4 py-1.5 text-right text-muted-foreground">Over</th>
                            <th className="px-4 py-1.5 text-right text-muted-foreground">Under</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prop.sportsbooks.map((sb) => (
                            <tr key={sb.sportsbook} className="border-b border-border/30 last:border-0">
                              <td className="px-4 py-1.5 font-medium text-foreground">{sb.sportsbook}</td>
                              <td className="px-4 py-1.5 text-right font-mono font-bold text-foreground">{sb.line}</td>
                              <td className="px-4 py-1.5 text-right font-mono font-semibold text-green-400">{formatOdds(sb.over)}</td>
                              <td className="px-4 py-1.5 text-right font-mono font-semibold text-red-400">{formatOdds(sb.under)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Injury Report */}
          {teamInjuries.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">🏥 Detailed Injury Report</h2>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-4 py-2 text-left text-muted-foreground">Player</th>
                      <th className="px-4 py-2 text-left text-muted-foreground">Status</th>
                      <th className="px-4 py-2 text-left text-muted-foreground">Injury</th>
                      <th className="px-4 py-2 text-left text-muted-foreground">Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamInjuries.map((inj, i) => (
                      <tr key={i} className="border-b border-border/30 last:border-0">
                        <td className="px-4 py-2.5 font-medium text-foreground">{inj.player}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${injuryStatusColor(inj.status)}`}>
                            {inj.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{inj.injury}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{inj.returnDate || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Game Lines Detail */}
          {teamGames.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">🎰 Game Lines — Full Breakdown</h2>
              <div className="space-y-4">
                {teamGames.map((g) => {
                  const isHome = g.homeTeam.id === team.id;
                  const opp = isHome ? g.awayTeam : g.homeTeam;
                  return (
                    <div key={g.id} className="rounded-xl border border-border bg-card overflow-hidden">
                      <div className="border-b border-border bg-secondary/30 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{isHome ? "vs" : "@"}</span>
                          <Link to={`/game/${g.id}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                            {opp.city} {opp.name}
                          </Link>
                          {opp.ranking && <span className="text-[10px] text-muted-foreground">#{opp.ranking}</span>}
                        </div>
                        <span className="text-xs text-muted-foreground">{g.date} · {g.time}</span>
                      </div>

                      {/* Moneyline */}
                      <div className="border-b border-border/50 px-4 py-2">
                        <p className="mb-1 text-[10px] font-bold text-muted-foreground uppercase">Moneyline</p>
                        <div className="grid grid-cols-4 gap-2">
                          {g.moneyline.map((ml) => (
                            <div key={ml.sportsbook} className="text-center">
                              <p className="text-[9px] text-muted-foreground">{ml.sportsbook}</p>
                              <p className="font-mono text-xs font-bold text-foreground">
                                {formatOdds(isHome ? ml.home : ml.away)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Spread */}
                      {g.spread && (
                        <div className="border-b border-border/50 px-4 py-2">
                          <p className="mb-1 text-[10px] font-bold text-muted-foreground uppercase">Spread</p>
                          <div className="grid grid-cols-4 gap-2">
                            {g.spread.map((sp) => (
                              <div key={sp.sportsbook} className="text-center">
                                <p className="text-[9px] text-muted-foreground">{sp.sportsbook}</p>
                                <p className="font-mono text-xs font-bold text-foreground">
                                  {isHome ? sp.home : sp.away} ({formatOdds(isHome ? sp.homeOdds : sp.awayOdds)})
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* O/U */}
                      <div className="px-4 py-2">
                        <p className="mb-1 text-[10px] font-bold text-muted-foreground uppercase">Over/Under</p>
                        <div className="grid grid-cols-4 gap-2">
                          {g.overUnder.map((ou) => (
                            <div key={ou.sportsbook} className="text-center">
                              <p className="text-[9px] text-muted-foreground">{ou.sportsbook}</p>
                              <p className="font-mono text-xs font-bold text-foreground">{ou.total}</p>
                              <p className="font-mono text-[10px] text-muted-foreground">
                                O {formatOdds(ou.over)} / U {formatOdds(ou.under)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Head-to-Head Records */}
      {teamMatchups.length > 0 && (
        <div className="mb-6">
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

                  <div className={`grid gap-2 mb-3 ${showAdvanced ? "grid-cols-4" : "grid-cols-3"}`}>
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
                    {showAdvanced && (
                      <div className="rounded-lg bg-secondary/60 p-2 text-center">
                        <p className="font-mono text-xs font-bold text-foreground">
                          {isTeam1 ? m.avgScore.team1 : m.avgScore.team2}-{isTeam1 ? m.avgScore.team2 : m.avgScore.team1}
                        </p>
                        <p className="text-[9px] text-muted-foreground">Avg Score</p>
                      </div>
                    )}
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
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-foreground">Roster</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Games (basic) */}
      {!showAdvanced && teamGames.length > 0 && (
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
