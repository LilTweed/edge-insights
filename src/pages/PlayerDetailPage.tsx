import { useParams, Link } from "react-router-dom";
import { getPlayer, getPropsForPlayer, injuries, matchupHistories, allGames, allTeams, allPlayers, formatOdds, getInjuryHistory } from "@/data/mockData";
import { InjuryHistoryPanel, EnhancedH2HPanel } from "@/components/AdvancedStatsPanel";
import PropCard from "@/components/PropCard";
import { useState } from "react";

const getStatRows = (player: ReturnType<typeof getPlayer>) => {
  if (!player) return [];
  const avg = player.seasonAverages;
  const l10 = player.last10;
  const l5 = player.last5;
  const sport = player.sport;

  if (sport === "NFL") {
    const pos = player.position;
    if (pos === "QB") {
      return [
        { label: "Pass Yards/G", season: avg.points, last10: l10.points, last5: l5.points },
        { label: "Pass TDs/G", season: avg.assists, last10: l10.assists, last5: l5.assists },
        { label: "Comp %", season: avg.fgPct, last10: l10.fgPct, last5: l5.fgPct },
        { label: "Rush Yards/G", season: avg.rebounds, last10: l10.rebounds, last5: l5.rebounds },
        { label: "INTs/G", season: avg.turnovers, last10: l10.turnovers, last5: l5.turnovers },
        { label: "QBR", season: avg.ftPct, last10: l10.ftPct, last5: l5.ftPct },
      ];
    }
    return [
      { label: "Yards/G", season: avg.points, last10: l10.points, last5: l5.points },
      { label: "TDs/G", season: avg.assists, last10: l10.assists, last5: l5.assists },
      { label: "Receptions/G", season: avg.rebounds, last10: l10.rebounds, last5: l5.rebounds },
      { label: "Targets/G", season: avg.steals, last10: l10.steals, last5: l5.steals },
      { label: "Fumbles/G", season: avg.turnovers, last10: l10.turnovers, last5: l5.turnovers },
    ];
  }

  if (sport === "MLB") {
    return [
      { label: "Batting AVG", season: avg.fgPct, last10: l10.fgPct, last5: l5.fgPct },
      { label: "Home Runs", season: avg.points, last10: l10.points, last5: l5.points },
      { label: "RBI", season: avg.rebounds, last10: l10.rebounds, last5: l5.rebounds },
      { label: "Hits", season: avg.assists, last10: l10.assists, last5: l5.assists },
      { label: "OPS", season: avg.threePct, last10: l10.threePct, last5: l5.threePct },
      { label: "Stolen Bases", season: avg.steals, last10: l10.steals, last5: l5.steals },
      { label: "Walks", season: avg.blocks, last10: l10.blocks, last5: l5.blocks },
    ];
  }

  if (sport === "NHL") {
    return [
      { label: "Goals", season: avg.points, last10: l10.points, last5: l5.points },
      { label: "Assists", season: avg.assists, last10: l10.assists, last5: l5.assists },
      { label: "Points", season: avg.rebounds, last10: l10.rebounds, last5: l5.rebounds },
      { label: "+/-", season: avg.steals, last10: l10.steals, last5: l5.steals },
      { label: "SOG", season: avg.blocks, last10: l10.blocks, last5: l5.blocks },
      { label: "PIM", season: avg.turnovers, last10: l10.turnovers, last5: l5.turnovers },
      { label: "TOI", season: avg.minutes, last10: l10.minutes, last5: l5.minutes },
    ];
  }

  if (sport === "LOL" || sport === "CS2" || sport === "VAL") {
    return [
      { label: "Kills", season: avg.points, last10: l10.points, last5: l5.points },
      { label: "Deaths", season: avg.rebounds, last10: l10.rebounds, last5: l5.rebounds },
      { label: "Assists", season: avg.assists, last10: l10.assists, last5: l5.assists },
      { label: sport === "LOL" ? "CS/min" : "ADR", season: avg.steals, last10: l10.steals, last5: l5.steals },
      { label: sport === "LOL" ? "KDA" : "K/D", season: avg.fgPct, last10: l10.fgPct, last5: l5.fgPct },
      { label: sport === "LOL" ? "VS%" : "HS%", season: avg.threePct, last10: l10.threePct, last5: l5.threePct },
      { label: sport === "LOL" ? "DPM" : "Rating", season: sport === "LOL" ? avg.blocks : avg.ftPct, last10: sport === "LOL" ? l10.blocks : l10.ftPct, last5: sport === "LOL" ? l5.blocks : l5.ftPct },
    ];
  }

  // Basketball
  return [
    { label: "Points", season: avg.points, last10: l10.points, last5: l5.points },
    { label: "Rebounds", season: avg.rebounds, last10: l10.rebounds, last5: l5.rebounds },
    { label: "Assists", season: avg.assists, last10: l10.assists, last5: l5.assists },
    { label: "Steals", season: avg.steals, last10: l10.steals, last5: l5.steals },
    { label: "Blocks", season: avg.blocks, last10: l10.blocks, last5: l5.blocks },
    { label: "Turnovers", season: avg.turnovers, last10: l10.turnovers, last5: l5.turnovers },
    { label: "Minutes", season: avg.minutes, last10: l10.minutes, last5: l5.minutes },
    { label: "FG%", season: avg.fgPct, last10: l10.fgPct, last5: l5.fgPct },
    { label: "3P%", season: avg.threePct, last10: l10.threePct, last5: l5.threePct },
    { label: "FT%", season: avg.ftPct, last10: l10.ftPct, last5: l5.ftPct },
  ];
};

const getTrendIndicator = (season: number, last5: number) => {
  const pctChange = ((last5 - season) / season) * 100;
  if (pctChange > 5) return { icon: "🔥", label: "Hot", color: "text-green-500" };
  if (pctChange > 2) return { icon: "📈", label: "Trending Up", color: "text-green-400" };
  if (pctChange < -5) return { icon: "🧊", label: "Cold", color: "text-red-500" };
  if (pctChange < -2) return { icon: "📉", label: "Trending Down", color: "text-red-400" };
  return { icon: "➡️", label: "Steady", color: "text-muted-foreground" };
};

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

const PlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const player = getPlayer(id || "");
  const props = getPropsForPlayer(id || "");

  if (!player) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Player not found</p>
        <Link to="/players" className="mt-2 inline-block text-sm text-primary underline">Back to players</Link>
      </div>
    );
  }

  const statRows = getStatRows(player);
  const playerInjuries = injuries.filter(i => i.player === player.name || i.teamAbbr === player.teamAbbr);
  const playerTeam = allTeams.find(t => t.abbreviation === player.teamAbbr && t.sport === player.sport);
  const teammates = allPlayers.filter(p => p.teamAbbr === player.teamAbbr && p.sport === player.sport && p.id !== player.id);
  const teamGames = allGames.filter(g => (g.homeTeam.abbreviation === player.teamAbbr || g.awayTeam.abbreviation === player.teamAbbr) && g.sport === player.sport);
  const teamMatchups = playerTeam ? matchupHistories.filter(m => m.team1Id === playerTeam.id || m.team2Id === playerTeam.id) : [];

  return (
    <div className="container py-6">
      <Link to="/players" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Players
      </Link>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            #{player.number}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{player.name}</h1>
            <p className="text-sm text-muted-foreground">
              {player.teamAbbr} · {player.position} · {player.stats.gamesPlayed} GP · {player.sport}
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

      {/* Injury Alert */}
      {playerInjuries.filter(i => i.player === player.name).length > 0 && (
        <div className="mb-4">
          {playerInjuries.filter(i => i.player === player.name).map((inj, idx) => (
            <div key={idx} className={`rounded-lg border p-3 ${injuryStatusColor(inj.status)}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">⚠️ {inj.status}</span>
                <span className="text-xs">{inj.injury}</span>
              </div>
              {inj.returnDate && <p className="mt-1 text-xs opacity-80">Expected return: {inj.returnDate}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Core Stats Table */}
      <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Stat</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Season</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Last 10</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Last 5</th>
                {showAdvanced && <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Trend</th>}
                {showAdvanced && <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Δ%</th>}
              </tr>
            </thead>
            <tbody>
              {statRows.map((row) => {
                const trend = getTrendIndicator(Number(row.season), Number(row.last5));
                const delta = ((Number(row.last5) - Number(row.season)) / Number(row.season) * 100);
                return (
                  <tr key={row.label} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2.5 text-xs font-medium text-foreground">{row.label}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{row.season}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{row.last10}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{row.last5}</td>
                    {showAdvanced && (
                      <td className={`px-4 py-2.5 text-right text-xs font-semibold ${trend.color}`}>
                        {trend.icon} {trend.label}
                      </td>
                    )}
                    {showAdvanced && (
                      <td className={`px-4 py-2.5 text-right font-mono text-xs font-semibold ${delta > 0 ? "text-green-400" : delta < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                        {delta > 0 ? "+" : ""}{isFinite(delta) ? delta.toFixed(1) : "0.0"}%
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Sections */}
      {showAdvanced && (
        <>
          {/* Props with Sportsbook Comparison */}
          {props.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">📊 Prop Lines — Sportsbook Comparison</h2>
              <div className="space-y-3">
                {props.map((prop) => (
                  <div key={prop.id} className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="border-b border-border bg-secondary/30 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-foreground">{prop.stat}</span>
                        <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                          Line: {prop.line}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${prop.hitRate >= 60 ? "text-green-400" : prop.hitRate >= 45 ? "text-yellow-400" : "text-red-400"}`}>
                          {prop.hitRate}% Season
                        </span>
                        <span className={`text-xs font-bold ${prop.hitRateLast10 >= 60 ? "text-green-400" : prop.hitRateLast10 >= 45 ? "text-yellow-400" : "text-red-400"}`}>
                          {prop.hitRateLast10}% L10
                        </span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="px-4 py-2 text-left text-muted-foreground">Book</th>
                            <th className="px-4 py-2 text-right text-muted-foreground">Line</th>
                            <th className="px-4 py-2 text-right text-muted-foreground">Over</th>
                            <th className="px-4 py-2 text-right text-muted-foreground">Under</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prop.sportsbooks.map((sb) => (
                            <tr key={sb.sportsbook} className="border-b border-border/30 last:border-0">
                              <td className="px-4 py-2 font-medium text-foreground">{sb.sportsbook}</td>
                              <td className="px-4 py-2 text-right font-mono font-bold text-foreground">{sb.line}</td>
                              <td className="px-4 py-2 text-right font-mono font-semibold text-green-400">{formatOdds(sb.over)}</td>
                              <td className="px-4 py-2 text-right font-mono font-semibold text-red-400">{formatOdds(sb.under)}</td>
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

          {/* Team Context */}
          {playerTeam && playerTeam.stats && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">🏟️ Team Context — {playerTeam.city} {playerTeam.name}</h2>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{playerTeam.record}</span>
                  <span className="text-xs text-muted-foreground">{playerTeam.conference} · {playerTeam.division}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { label: "PPG", value: playerTeam.stats.ppg },
                    { label: "Opp PPG", value: playerTeam.stats.oppPpg },
                    ...(playerTeam.stats.ypg ? [
                      { label: "YPG", value: playerTeam.stats.ypg },
                      { label: "Rush YPG", value: playerTeam.stats.rushYpg },
                      { label: "Pass YPG", value: playerTeam.stats.passYpg },
                      { label: "3rd Down %", value: playerTeam.stats.thirdDownPct },
                      { label: "Red Zone %", value: playerTeam.stats.redZonePct },
                      { label: "Sacks", value: playerTeam.stats.sacks },
                      { label: "Takeaways", value: playerTeam.stats.takeaways },
                    ] : [
                      { label: "RPG", value: playerTeam.stats.rpg },
                      { label: "APG", value: playerTeam.stats.apg },
                      { label: "FG%", value: playerTeam.stats.fgPct },
                      { label: "3P%", value: playerTeam.stats.threePct },
                      { label: "TO", value: playerTeam.stats.turnovers },
                      { label: "STL", value: playerTeam.stats.steals },
                      { label: "BLK", value: playerTeam.stats.blocks },
                    ]),
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-secondary/60 p-2 text-center">
                      <p className="font-mono text-sm font-bold text-foreground">{s.value}</p>
                      <p className="text-[9px] font-medium text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team Injuries */}
          {playerInjuries.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">🏥 Team Injury Report</h2>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
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
                    {playerInjuries.map((inj, i) => (
                      <tr key={i} className="border-b border-border/30 last:border-0">
                        <td className={`px-4 py-2 font-medium ${inj.player === player.name ? "text-primary font-bold" : "text-foreground"}`}>
                          {inj.player}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${injuryStatusColor(inj.status)}`}>
                            {inj.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{inj.injury}</td>
                        <td className="px-4 py-2 text-muted-foreground">{inj.returnDate || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Injury History */}
          <InjuryHistoryPanel injuryHistory={getInjuryHistory(player.id)} playerName={player.name} />

          {/* H2H Matchups (team-level) */}
          {playerTeam && (
            <EnhancedH2HPanel matchups={teamMatchups} teamId={playerTeam.id} />
          )}

          {/* Teammates */}
          {teammates.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">👥 Teammates</h2>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-4 py-2 text-left text-muted-foreground">#</th>
                      <th className="px-4 py-2 text-left text-muted-foreground">Name</th>
                      <th className="px-4 py-2 text-left text-muted-foreground">POS</th>
                      <th className="px-4 py-2 text-right text-muted-foreground">GP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teammates.map((t) => (
                      <tr key={t.id} className="border-b border-border/30 last:border-0">
                        <td className="px-4 py-2 font-mono font-bold text-foreground">{t.number}</td>
                        <td className="px-4 py-2">
                          <Link to={`/player/${t.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                            {t.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{t.position}</td>
                        <td className="px-4 py-2 text-right font-mono text-muted-foreground">{t.stats.gamesPlayed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upcoming Games */}
          {teamGames.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">📅 Upcoming Games</h2>
              <div className="space-y-2">
                {teamGames.map((g) => {
                  const isHome = g.homeTeam.abbreviation === player.teamAbbr;
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
        </>
      )}

      {/* Basic Props (always shown) */}
      {!showAdvanced && props.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-bold text-foreground">Available Props</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {props.map((prop) => (
              <PropCard key={prop.id} prop={prop} showPlayer={false} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerDetailPage;
