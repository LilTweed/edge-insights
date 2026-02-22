import { useParams, useSearchParams, Link } from "react-router-dom";
import { getPlayer, getPropsForPlayer, injuries, matchupHistories, allGames, allTeams, allPlayers, formatOdds, getInjuryHistory } from "@/data/mockData";
import { InjuryHistoryPanel, EnhancedH2HPanel } from "@/components/AdvancedStatsPanel";
import ExportableDataView from "@/components/ExportableDataView";
import PropCard from "@/components/PropCard";
import { useState } from "react";
import { Share2, RefreshCw } from "lucide-react";
import { usePlayerStats, type EspnSport } from "@/hooks/useEspnData";

const ESPN_SPORTS = ["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF"];

const PlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const sportParam = searchParams.get("sport") as EspnSport | null;
  const teamAbbr = searchParams.get("team") || "";

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const isEspnSport = sportParam && ESPN_SPORTS.includes(sportParam);

  // ESPN live stats
  const { data: espnStats, isLoading: statsLoading } = usePlayerStats(
    (sportParam || "NBA") as EspnSport,
    isEspnSport ? id : undefined
  );

  // Mock fallback for esports
  const mockPlayer = getPlayer(id || "");
  const props = getPropsForPlayer(id || "");

  // If it's an ESPN sport, use ESPN data
  if (isEspnSport) {
    return (
      <EspnPlayerDetail
        athleteId={id || ""}
        sport={sportParam!}
        teamAbbr={teamAbbr}
        espnStats={espnStats}
        isLoading={statsLoading}
        showAdvanced={showAdvanced}
        setShowAdvanced={setShowAdvanced}
      />
    );
  }

  // Mock player fallback (esports)
  if (!mockPlayer) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Player not found</p>
        <Link to="/players" className="mt-2 inline-block text-sm text-primary underline">Back to players</Link>
      </div>
    );
  }

  return <MockPlayerDetail player={mockPlayer} props={props} showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced} exportOpen={exportOpen} setExportOpen={setExportOpen} />;
};

// ======================== ESPN Player Detail ========================

function EspnPlayerDetail({
  athleteId,
  sport,
  teamAbbr,
  espnStats,
  isLoading,
  showAdvanced,
  setShowAdvanced,
}: {
  athleteId: string;
  sport: EspnSport;
  teamAbbr: string;
  espnStats: any;
  isLoading: boolean;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean) => void;
}) {
  const athlete = espnStats?.athlete;
  const seasons = espnStats?.seasons || [];

  return (
    <div className="container py-6">
      <Link to="/players" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Players
      </Link>

      {isLoading && (
        <div className="flex flex-col items-center gap-2 py-20">
          <RefreshCw size={28} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading player stats…</p>
        </div>
      )}

      {!isLoading && !athlete && seasons.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-2">No stats available for this player</p>
          <p className="text-xs text-muted-foreground">ESPN may not have data for this athlete yet.</p>
        </div>
      )}

      {!isLoading && (athlete || seasons.length > 0) && (
        <>
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {athlete?.headshot ? (
                <img
                  src={athlete.headshot}
                  alt={athlete.name}
                  className="h-16 w-16 rounded-xl bg-secondary object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                  #{athlete?.number || '?'}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {athlete?.name || `Player ${athleteId}`}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {athlete?.teamAbbr || teamAbbr} · {athlete?.position || ''} · {sport}
                </p>
                {athlete?.team && (
                  <p className="text-xs text-muted-foreground mt-0.5">{athlete.team}</p>
                )}
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
              {showAdvanced ? "⚡ All Seasons" : "📊 All Seasons"}
            </button>
          </div>

          {/* Stats tables by category */}
          {seasons.length > 0 ? (
            <div className="space-y-6">
              {groupSeasonsByCategory(seasons, showAdvanced).map(({ category, items }) => (
                <div key={category} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="border-b border-border bg-secondary/30 px-4 py-2.5">
                    <h3 className="text-sm font-bold text-foreground">{category || 'Stats'}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground sticky left-0 bg-secondary/50">Season</th>
                          {getStatHeaders(items).map(h => (
                            <th key={h} className="px-3 py-2.5 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={idx} className="border-b border-border/50 last:border-0">
                            <td className="px-4 py-2.5 text-xs font-semibold text-foreground sticky left-0 bg-card whitespace-nowrap">
                              {item.season}
                            </td>
                            {getStatHeaders(items).map(h => (
                              <td key={h} className="px-3 py-2.5 text-right font-mono text-xs text-foreground">
                                {item.stats[h] || '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No detailed stats available</p>
          )}

          <p className="mt-4 text-[10px] text-muted-foreground">
            Data sourced from ESPN · All-time career stats included regardless of team changes · Updated {espnStats?.fetchedAt ? new Date(espnStats.fetchedAt).toLocaleTimeString() : ''}
          </p>
        </>
      )}
    </div>
  );
}

function groupSeasonsByCategory(seasons: any[], showAll: boolean) {
  const groups: Record<string, any[]> = {};
  for (const s of seasons) {
    const cat = s.category || 'Stats';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  }

  // If not showing all, only show first 3 items per category
  return Object.entries(groups).map(([category, items]) => ({
    category,
    items: showAll ? items : items.slice(0, 3),
  }));
}

function getStatHeaders(items: any[]): string[] {
  const allHeaders = new Set<string>();
  for (const item of items) {
    for (const key of Object.keys(item.stats)) {
      allHeaders.add(key);
    }
  }
  return Array.from(allHeaders);
}

// ======================== Mock Player Detail (esports) ========================

function MockPlayerDetail({
  player,
  props,
  showAdvanced,
  setShowAdvanced,
  exportOpen,
  setExportOpen,
}: {
  player: NonNullable<ReturnType<typeof getPlayer>>;
  props: ReturnType<typeof getPropsForPlayer>;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean) => void;
  exportOpen: boolean;
  setExportOpen: (v: boolean) => void;
}) {
  const avg = player.seasonAverages;
  const l10 = player.last10;
  const l5 = player.last5;
  const sport = player.sport;

  const statRows = getStatRows(player);
  const playerInjuries = injuries.filter(i => i.player === player.name || i.teamAbbr === player.teamAbbr);
  const playerTeam = allTeams.find(t => t.abbreviation === player.teamAbbr && t.sport === player.sport);
  const teammates = allPlayers.filter(p => p.teamAbbr === player.teamAbbr && p.sport === player.sport && p.id !== player.id);
  const teamGames = allGames.filter(g => (g.homeTeam.abbreviation === player.teamAbbr || g.awayTeam.abbreviation === player.teamAbbr) && g.sport === player.sport);
  const teamMatchups = playerTeam ? matchupHistories.filter(m => m.team1Id === playerTeam.id || m.team2Id === playerTeam.id) : [];

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

  const getTrendIndicator = (season: number, last5: number) => {
    const pctChange = ((last5 - season) / season) * 100;
    if (pctChange > 5) return { icon: "🔥", label: "Hot", color: "text-green-500" };
    if (pctChange > 2) return { icon: "📈", label: "Trending Up", color: "text-green-400" };
    if (pctChange < -5) return { icon: "🧊", label: "Cold", color: "text-red-500" };
    if (pctChange < -2) return { icon: "📉", label: "Trending Down", color: "text-red-400" };
    return { icon: "➡️", label: "Steady", color: "text-muted-foreground" };
  };

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
        <div className="flex items-center gap-2">
          {props.length > 0 && (
            <button
              onClick={() => setExportOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Export
            </button>
          )}
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
      </div>

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

      {/* Advanced sections for mock data */}
      {showAdvanced && (
        <>
          {props.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">📊 Prop Lines</h2>
              <div className="space-y-3">
                {props.map((prop) => (
                  <div key={prop.id} className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="border-b border-border bg-secondary/30 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-foreground">{prop.stat}</span>
                        <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">Line: {prop.line}</span>
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

          {/* Injury History */}
          <InjuryHistoryPanel injuryHistory={getInjuryHistory(player.id)} playerName={player.name} />

          {/* Teammates */}
          {allPlayers.filter(p => p.teamAbbr === player.teamAbbr && p.sport === player.sport && p.id !== player.id).length > 0 && (
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
                    {allPlayers.filter(p => p.teamAbbr === player.teamAbbr && p.sport === player.sport && p.id !== player.id).map((t) => (
                      <tr key={t.id} className="border-b border-border/30 last:border-0">
                        <td className="px-4 py-2 font-mono font-bold text-foreground">{t.number}</td>
                        <td className="px-4 py-2">
                          <Link to={`/player/${t.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{t.name}</Link>
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
        </>
      )}

      {/* Basic Props */}
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

      <ExportableDataView
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title={`${player.name} — ${player.teamAbbr} Props`}
        props={props}
      />
    </div>
  );
}

// ======================== Stat helpers for mock data ========================

const getStatRows = (player: ReturnType<typeof getPlayer>) => {
  if (!player) return [];
  const avg = player.seasonAverages;
  const l10 = player.last10;
  const l5 = player.last5;
  const sport = player.sport;


  return [
    { label: "Points", season: avg.points, last10: l10.points, last5: l5.points },
    { label: "Rebounds", season: avg.rebounds, last10: l10.rebounds, last5: l5.rebounds },
    { label: "Assists", season: avg.assists, last10: l10.assists, last5: l5.assists },
    { label: "Steals", season: avg.steals, last10: l10.steals, last5: l5.steals },
    { label: "Blocks", season: avg.blocks, last10: l10.blocks, last5: l5.blocks },
    { label: "Turnovers", season: avg.turnovers, last10: l10.turnovers, last5: l5.turnovers },
    { label: "Minutes", season: avg.minutes, last10: l10.minutes, last5: l5.minutes },
  ];
};

export default PlayerDetailPage;
