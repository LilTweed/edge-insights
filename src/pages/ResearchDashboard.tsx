import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  allPlayers,
  allTeams,
  propLines,
  matchupHistories,
  injuries,
  type Sport,
  type Player,
  type PropLine,
} from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import { EnhancedH2HPanel } from "@/components/AdvancedStatsPanel";
import { useFavoriteTeams } from "@/hooks/useFavoriteTeams";
import { useEspnTeams, useTeamRoster, type EspnSport } from "@/hooks/useEspnData";
import EspnPlayerCard from "@/components/EspnPlayerCard";
import PlayerCard from "@/components/PlayerCard";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  BarChart3,
  Users,
  Swords,
  Activity,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Heart,
  Shield,
  RefreshCw,
  UserCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";

type Tab = "stats" | "trends" | "matchups" | "teams" | "roster";

const ESPN_SPORTS = ["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF", "UFC", "PGA", "MLS", "WNBA", "NASCAR", "TENNIS"] as const;

/** Deterministic pseudo-random seeded by string */
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = h ^ (h >>> 16);
    return (h >>> 0) / 4294967296;
  };
}

function getTrend(player: Player): { dir: "up" | "down" | "flat"; pct: number } {
  const l5 = player.last5;
  const l10 = player.last10;
  const diff = ((l5.points - l10.points) / (l10.points || 1)) * 100;
  if (Math.abs(diff) < 3) return { dir: "flat", pct: Math.round(diff * 10) / 10 };
  return { dir: diff > 0 ? "up" : "down", pct: Math.round(diff * 10) / 10 };
}

function generateSparkline(player: Player, stat: "points" | "rebounds" | "assists") {
  const rng = seededRandom(player.id + stat);
  const avg = player.seasonAverages[stat];
  const data = [];
  for (let i = 0; i < 15; i++) {
    const val = Math.max(0, avg + (rng() - 0.5) * avg * 0.6);
    data.push({ g: i + 1, v: Math.round(val * 10) / 10 });
  }
  return data;
}

const ResearchDashboard = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const [tab, setTab] = useState<Tab>("stats");
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState<string>("All");
  const [teamFilter, setTeamFilter] = useState<string>("All");
  const [statSort, setStatSort] = useState<string>("points");
  const [sortAsc, setSortAsc] = useState(false);
  const [minGames, setMinGames] = useState(0);
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { toggle, isFavorite } = useFavoriteTeams();
  const [selectedRosterTeamId, setSelectedRosterTeamId] = useState<string>("");

  const isEspnSport = (ESPN_SPORTS as readonly string[]).includes(sport);
  const { data: espnTeams, isLoading: espnTeamsLoading } = useEspnTeams(sport as EspnSport);
  const espnTeamList = espnTeams || [];
  const effectiveRosterTeamId = selectedRosterTeamId || (espnTeamList.length > 0 ? espnTeamList[0].id : "");
  const { data: rosterData, isLoading: rosterLoading } = useTeamRoster(sport as EspnSport, effectiveRosterTeamId || undefined);
  const selectedEspnTeam = espnTeamList.find((t) => t.id === effectiveRosterTeamId);

  const filteredRoster = useMemo(() => {
    if (!rosterData) return [];
    return rosterData
      .filter((p) => posFilter === "All" || p.position === posFilter)
      .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  }, [rosterData, posFilter, search]);

  const rosterPositions = useMemo(() => {
    if (!rosterData) return ["All"];
    return ["All", ...Array.from(new Set(rosterData.map((p) => p.position))).sort()];
  }, [rosterData]);

  const players = useMemo(() => allPlayers.filter((p) => p.sport === sport), [sport]);
  const teams = useMemo(() => allTeams.filter((t) => t.sport === sport), [sport]);
  const props = useMemo(() => propLines.filter((p) => p.sport === sport), [sport]);
  const sportInjuries = useMemo(() => injuries.filter((i) => teams.some((t) => t.abbreviation === i.teamAbbr)), [teams]);

  const positions = useMemo(() => ["All", ...Array.from(new Set(players.map((p) => p.position))).sort()], [players]);
  const teamOptions = useMemo(() => ["All", ...Array.from(new Set(players.map((p) => p.teamAbbr))).sort()], [players]);

  const isBasketball = sport === "NBA" || sport === "NCAAB";
  const statOptions = isBasketball
    ? ["points", "rebounds", "assists", "steals", "blocks", "minutes"]
    : ["points", "rebounds", "assists", "steals", "blocks"];

  const filtered = useMemo(() => {
    let list = players;
    if (posFilter !== "All") list = list.filter((p) => p.position === posFilter);
    if (teamFilter !== "All") list = list.filter((p) => p.teamAbbr === teamFilter);
    if (minGames > 0) list = list.filter((p) => p.stats.gamesPlayed >= minGames);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.teamAbbr.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const aVal = a.seasonAverages[statSort as keyof typeof a.seasonAverages] as number;
      const bVal = b.seasonAverages[statSort as keyof typeof b.seasonAverages] as number;
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
    return list;
  }, [players, posFilter, teamFilter, minGames, search, statSort, sortAsc]);

  const trendPlayers = useMemo(() => {
    return filtered.map((p) => ({ player: p, trend: getTrend(p) })).sort((a, b) => Math.abs(b.trend.pct) - Math.abs(a.trend.pct));
  }, [filtered]);

  const sportMatchups = useMemo(() => {
    const teamIds = teams.map((t) => t.id);
    return matchupHistories.filter((m) => teamIds.includes(m.team1Id) || teamIds.includes(m.team2Id));
  }, [teams]);

  const toggleSort = (key: string) => {
    if (statSort === key) setSortAsc(!sortAsc);
    else { setStatSort(key); setSortAsc(false); }
  };

  const playerProps = (playerId: string): PropLine[] => props.filter((p) => p.playerId === playerId);

  const teamStatColumns = (s: Sport) => {
    if (s === "NCAAF" || s === "NFL") {
      return (t: typeof allTeams[0]) => [
        { label: "PPG", value: t.stats?.ppg },
        { label: "YPG", value: t.stats?.ypg },
        { label: "OPP PPG", value: t.stats?.oppPpg },
        { label: "TO", value: t.stats?.takeaways },
      ];
    }
    if (s === "MLB") {
      return (t: typeof allTeams[0]) => [
        { label: "R/G", value: t.stats?.ppg },
        { label: "OPP R/G", value: t.stats?.oppPpg },
      ];
    }
    if (s === "NHL") {
      return (t: typeof allTeams[0]) => [
        { label: "G/G", value: t.stats?.ppg },
        { label: "GA/G", value: t.stats?.oppPpg },
      ];
    }
    return (t: typeof allTeams[0]) => [
      { label: "PPG", value: t.stats?.ppg },
      { label: "OPP", value: t.stats?.oppPpg },
      { label: "FG%", value: t.stats?.fgPct },
      { label: "3P%", value: t.stats?.threePct },
    ];
  };

  const filteredTeams = useMemo(() => {
    let list = teams;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.city.toLowerCase().includes(q) || t.abbreviation.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const aFav = isFavorite(a.id) ? 0 : 1;
      const bFav = isFavorite(b.id) ? 0 : 1;
      return aFav - bFav;
    });
  }, [teams, search, isFavorite]);

  const byConference = useMemo(() => {
    const grouped = filteredTeams.reduce<Record<string, typeof filteredTeams>>((acc, team) => {
      if (!acc[team.conference]) acc[team.conference] = [];
      acc[team.conference].push(team);
      return acc;
    }, {});
    return Object.entries(grouped).sort(([, a], [, b]) => {
      const aHasFav = a.some((t) => isFavorite(t.id)) ? 0 : 1;
      const bHasFav = b.some((t) => isFavorite(t.id)) ? 0 : 1;
      return aHasFav - bHasFav;
    });
  }, [filteredTeams, isFavorite]);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "stats", label: "Player Stats", icon: BarChart3 },
    { key: "roster", label: "Rosters", icon: UserCircle },
    { key: "teams", label: "Teams", icon: Shield },
    { key: "trends", label: "Trends", icon: Activity },
    { key: "matchups", label: "Matchups", icon: Swords },
  ];

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Research Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Deep-dive into player stats, trends, and matchup data</p>
      </div>

      <div className="mb-4">
        <SportFilter active={sport} onChange={(s) => { setSport(s); setSearch(""); setPosFilter("All"); setTeamFilter("All"); setSelectedRosterTeamId(""); }} />
      </div>

      {/* Injury Ticker */}
      {sportInjuries.length > 0 && (
        <div className="mb-4 flex items-center gap-2 overflow-x-auto rounded-lg border border-border bg-card px-3 py-2 scrollbar-thin">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-yellow-500" />
          <span className="text-[10px] font-bold text-muted-foreground flex-shrink-0">INJURIES</span>
          {sportInjuries.slice(0, 8).map((inj, i) => (
            <span key={i} className="flex-shrink-0 rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground">{inj.player}</span>
              <span className="mx-1">·</span>
              <span className={inj.status === "Out" ? "text-red-400" : inj.status === "Questionable" ? "text-yellow-400" : "text-muted-foreground"}>
                {inj.status}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-border bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
              tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── STATS TAB ─── */}
      {tab === "stats" && (
        <div>
          {/* Filters */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="mb-3 flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {filtersOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {filtersOpen && (
            <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground">Position</label>
                <select value={posFilter} onChange={(e) => setPosFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground">
                  {positions.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground">Team</label>
                <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground">
                  {teamOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground">Min Games</label>
                <input type="number" value={minGames} onChange={(e) => setMinGames(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground" min={0} />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground">Sort By</label>
                <select value={statSort} onChange={(e) => setStatSort(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground">
                  {statOptions.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player or team…"
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          {/* Stat Column Headers */}
          <div className="mb-2 hidden sm:grid grid-cols-[2fr_repeat(6,1fr)] gap-1 px-3">
            <span className="text-[9px] font-bold uppercase text-muted-foreground">Player</span>
            {statOptions.map((s) => (
              <button key={s} onClick={() => toggleSort(s)} className={`text-[9px] font-bold uppercase text-center transition-colors ${statSort === s ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {s.slice(0, 3).toUpperCase()}
                {statSort === s && (sortAsc ? " ↑" : " ↓")}
              </button>
            ))}
          </div>

          {/* Player Rows */}
          <div className="space-y-1">
            {filtered.map((player) => {
              const avg = player.seasonAverages;
              const trend = getTrend(player);
              const pProps = playerProps(player.id);
              const isExpanded = expandedPlayer === player.id;
              const TIcon = trend.dir === "up" ? TrendingUp : trend.dir === "down" ? TrendingDown : Minus;

              return (
                <div key={player.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setExpandedPlayer(isExpanded ? null : player.id)}
                    className="w-full grid grid-cols-[2fr_repeat(6,1fr)] gap-1 items-center px-3 py-2.5 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-[9px] font-bold text-secondary-foreground flex-shrink-0">
                        {player.teamAbbr}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{player.name}</p>
                        <p className="text-[9px] text-muted-foreground">{player.position} · #{player.number}</p>
                      </div>
                      <TIcon className={`h-3 w-3 flex-shrink-0 ${trend.dir === "up" ? "text-emerald-500" : trend.dir === "down" ? "text-red-400" : "text-muted-foreground"}`} />
                    </div>
                    {statOptions.map((s) => (
                      <span key={s} className="text-center font-mono text-xs font-semibold text-foreground">
                        {(avg[s as keyof typeof avg] as number).toFixed(1)}
                      </span>
                    ))}
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="border-t border-border px-4 py-4 space-y-4 animate-fade-in">
                      {/* Split: Season / L10 / L5 */}
                      <div className="grid grid-cols-3 gap-2">
                        {(["seasonAverages", "last10", "last5"] as const).map((period) => {
                          const label = period === "seasonAverages" ? "Season" : period === "last10" ? "Last 10" : "Last 5";
                          const data = player[period];
                          return (
                            <div key={period} className="rounded-lg bg-secondary/40 p-2.5">
                              <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1.5">{label}</p>
                              <div className="space-y-1">
                                {statOptions.slice(0, 4).map((s) => (
                                  <div key={s} className="flex items-center justify-between">
                                    <span className="text-[9px] text-muted-foreground">{s.slice(0, 3).toUpperCase()}</span>
                                    <span className="font-mono text-[11px] font-semibold text-foreground">
                                      {(data[s as keyof typeof data] as number).toFixed(1)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Sparkline Chart */}
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Last 15 Games — {statSort.charAt(0).toUpperCase() + statSort.slice(1)}</p>
                        <div className="h-24 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={generateSparkline(player, statSort as any)} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                              <XAxis dataKey="g" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                              <ReferenceLine y={avg[statSort as keyof typeof avg] as number} stroke="hsl(var(--primary))" strokeDasharray="4 3" strokeWidth={1.5} />
                              <Tooltip
                                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px", color: "hsl(var(--foreground))" }}
                              />
                              <Bar dataKey="v" radius={[2, 2, 0, 0]} fill="hsl(var(--primary) / 0.5)" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Active Props */}
                      {pProps.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5">Active Props</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {pProps.map((prop) => (
                              <div key={prop.id} className="rounded-lg border border-border/50 bg-secondary/30 px-2.5 py-2 flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] text-muted-foreground">{prop.stat}</span>
                                  <span className="ml-1.5 font-mono text-xs font-bold text-foreground">{prop.line}</span>
                                </div>
                                <span className={`font-mono text-[10px] font-bold ${prop.hitRate >= 60 ? "text-emerald-500" : prop.hitRate <= 40 ? "text-red-400" : "text-muted-foreground"}`}>
                                  {prop.hitRate}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Link
                        to={`/player/${player.id}`}
                        className="block text-center text-[10px] font-semibold text-primary hover:underline"
                      >
                        View Full Profile →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-12">No players match your filters</p>
            )}
          </div>

          <p className="mt-3 text-center text-[10px] text-muted-foreground">{filtered.length} player{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      )}

      {/* ─── TRENDS TAB ─── */}
      {tab === "trends" && (
        <div>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player…"
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Hot */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-secondary/30 px-3 py-2 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-bold text-foreground">Trending Up</span>
              </div>
              <div className="divide-y divide-border/30">
                {trendPlayers.filter((t) => t.trend.dir === "up").slice(0, 8).map(({ player, trend }) => (
                  <Link key={player.id} to={`/player/${player.id}`} className="flex items-center justify-between px-3 py-2 hover:bg-secondary/30 transition-colors">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{player.name}</p>
                      <p className="text-[9px] text-muted-foreground">{player.teamAbbr} · {player.position}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-mono text-xs font-bold text-emerald-500">+{trend.pct}%</span>
                      <p className="text-[9px] text-muted-foreground">{player.last5.points.toFixed(1)} L5 PPG</p>
                    </div>
                  </Link>
                ))}
                {trendPlayers.filter((t) => t.trend.dir === "up").length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-6">No upward trends found</p>
                )}
              </div>
            </div>

            {/* Cold */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-secondary/30 px-3 py-2 flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs font-bold text-foreground">Trending Down</span>
              </div>
              <div className="divide-y divide-border/30">
                {trendPlayers.filter((t) => t.trend.dir === "down").slice(0, 8).map(({ player, trend }) => (
                  <Link key={player.id} to={`/player/${player.id}`} className="flex items-center justify-between px-3 py-2 hover:bg-secondary/30 transition-colors">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{player.name}</p>
                      <p className="text-[9px] text-muted-foreground">{player.teamAbbr} · {player.position}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-mono text-xs font-bold text-red-400">{trend.pct}%</span>
                      <p className="text-[9px] text-muted-foreground">{player.last5.points.toFixed(1)} L5 PPG</p>
                    </div>
                  </Link>
                ))}
                {trendPlayers.filter((t) => t.trend.dir === "down").length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-6">No downward trends found</p>
                )}
              </div>
            </div>
          </div>

          {/* Props Value Finder */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-secondary/30 px-3 py-2">
              <span className="text-xs font-bold text-foreground">🎯 High Hit Rate Props (≥65%)</span>
            </div>
            <div className="divide-y divide-border/30">
              {props.filter((p) => p.hitRate >= 65).sort((a, b) => b.hitRate - a.hitRate).slice(0, 12).map((prop) => (
                <div key={prop.id} className="flex items-center justify-between px-3 py-2">
                  <div>
                    <Link to={`/player/${prop.playerId}`} className="text-xs font-semibold text-foreground hover:text-primary transition-colors">{prop.playerName}</Link>
                    <p className="text-[9px] text-muted-foreground">{prop.teamAbbr} · {prop.stat} {prop.line}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${prop.hitRate}%` }} />
                    </div>
                    <span className="font-mono text-[11px] font-bold text-emerald-500">{prop.hitRate}%</span>
                  </div>
                </div>
              ))}
              {props.filter((p) => p.hitRate >= 65).length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-6">No high hit-rate props found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MATCHUPS TAB ─── */}
      {tab === "matchups" && (
        <div>
          {/* Team selector */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {teams.map((t) => {
              const hasMatchup = sportMatchups.some((m) => m.team1Id === t.id || m.team2Id === t.id);
              if (!hasMatchup) return null;
              return (
                <button
                  key={t.id}
                  onClick={() => setTeamFilter(teamFilter === t.abbreviation ? "All" : t.abbreviation)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    teamFilter === t.abbreviation ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.abbreviation}
                </button>
              );
            })}
          </div>

          {sportMatchups.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">No matchup history available for {sport}</p>
          ) : (
            <>
              {teams
                .filter((t) => teamFilter === "All" || t.abbreviation === teamFilter)
                .map((team) => {
                  const teamMatchups = sportMatchups.filter((m) => m.team1Id === team.id || m.team2Id === team.id);
                  if (teamMatchups.length === 0) return null;
                  return (
                    <div key={team.id} className="mb-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Link to={`/team/${team.id}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                          {team.city} {team.name}
                        </Link>
                        <span className="text-[10px] text-muted-foreground">({team.record})</span>
                      </div>
                      <EnhancedH2HPanel matchups={teamMatchups} teamId={team.id} compact />
                    </div>
                  );
                })}
            </>
          )}
        </div>
      )}

      {/* ─── ROSTER TAB ─── */}
      {tab === "roster" && (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
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
                value={selectedRosterTeamId || effectiveRosterTeamId}
                onChange={(e) => { setSelectedRosterTeamId(e.target.value); setPosFilter("All"); }}
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                {espnTeamsLoading && <option>Loading teams...</option>}
                {espnTeamList.map((t) => (
                  <option key={t.id} value={t.id}>{t.abbreviation} — {t.name}</option>
                ))}
              </select>
            )}

            <select
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              {(tab === "roster" ? rosterPositions : positions).map((pos) => (
                <option key={pos} value={pos}>{pos === "All" ? "All Positions" : pos}</option>
              ))}
            </select>
          </div>

          {isEspnSport && (
            <>
              {(espnTeamsLoading || rosterLoading) && (
                <div className="flex flex-col items-center gap-2 py-16">
                  <RefreshCw size={24} className="animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading {selectedEspnTeam?.name || sport} roster…</p>
                </div>
              )}

              {!espnTeamsLoading && !rosterLoading && filteredRoster.length > 0 && (
                <>
                  <p className="mb-3 text-xs text-muted-foreground">
                    {filteredRoster.length} players · {selectedEspnTeam?.name} {selectedEspnTeam?.record ? `(${selectedEspnTeam.record})` : ""}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredRoster.map((player) => (
                      <EspnPlayerCard
                        key={player.id}
                        player={player}
                        sport={sport as EspnSport}
                        teamName={selectedEspnTeam?.name}
                        teamAbbr={selectedEspnTeam?.abbreviation}
                      />
                    ))}
                  </div>
                </>
              )}

              {!espnTeamsLoading && !rosterLoading && filteredRoster.length === 0 && rosterData && (
                <p className="py-12 text-center text-sm text-muted-foreground">No players match your filters</p>
              )}
            </>
          )}

          {!isEspnSport && (
            <>
              <p className="mb-3 text-xs text-muted-foreground">{players.length} players</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {players.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase())).filter((p) => posFilter === "All" || p.position === posFilter).map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── TEAMS TAB ─── */}
      {tab === "teams" && (
        <div>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teams…"
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          {byConference.map(([conf, confTeams]) => (
            <div key={conf} className="mb-6">
              <h2 className="mb-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">{conf}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {confTeams.map((team) => {
                  const fav = isFavorite(team.id);
                  const getStats = teamStatColumns(sport);
                  const stats = team.stats ? getStats(team) : [];
                  const teamPlayers = players.filter((p) => p.teamAbbr === team.abbreviation);
                  const teamProps = props.filter((p) => p.teamAbbr === team.abbreviation);
                  const teamInjuries = sportInjuries.filter((i) => i.teamAbbr === team.abbreviation);

                  return (
                    <div key={team.id} className="group relative animate-fade-in rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm">
                      <button
                        onClick={(e) => { e.preventDefault(); toggle(team.id); }}
                        className="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-colors hover:bg-secondary"
                        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart size={16} className={fav ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                      </button>
                      <Link to={`/team/${team.id}`}>
                        <div className="mb-3 flex items-center gap-2.5 pr-8">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-primary-foreground">
                            {team.abbreviation}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {team.ranking ? `#${team.ranking} ` : ""}{team.city} {team.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{team.record} · {team.conference}</p>
                          </div>
                        </div>
                      </Link>

                      {/* Team Stats */}
                      {stats.length > 0 && (
                        <div className="mb-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)` }}>
                          {stats.filter((s) => s.value != null).map((s) => (
                            <div key={s.label} className="rounded-lg bg-secondary/60 p-1.5 text-center">
                              <p className="font-mono text-sm font-bold text-foreground">{s.value}</p>
                              <p className="text-[9px] font-medium text-muted-foreground">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Key Players */}
                      {teamPlayers.length > 0 && (
                        <div className="mb-2">
                          <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Key Players</p>
                          <div className="flex flex-wrap gap-1">
                            {teamPlayers.slice(0, 3).map((p) => (
                              <Link key={p.id} to={`/player/${p.id}`} className="rounded-md bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-foreground hover:bg-secondary transition-colors">
                                {p.name.split(" ").pop()} · {p.seasonAverages.points.toFixed(1)}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Active Props */}
                      {teamProps.length > 0 && (
                        <div className="mb-2">
                          <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Props ({teamProps.length})</p>
                          <div className="flex flex-wrap gap-1">
                            {teamProps.slice(0, 3).map((p) => (
                              <span key={p.id} className="rounded-md bg-secondary/40 px-1.5 py-0.5 text-[9px] text-muted-foreground">
                                {p.playerName.split(" ").pop()} {p.stat} {p.line} <span className={`font-bold ${p.hitRate >= 60 ? "text-emerald-500" : "text-foreground"}`}>{p.hitRate}%</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Injuries */}
                      {teamInjuries.length > 0 && (
                        <div>
                          <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Injuries</p>
                          <div className="flex flex-wrap gap-1">
                            {teamInjuries.map((inj, i) => (
                              <span key={i} className="rounded-md bg-secondary/40 px-1.5 py-0.5 text-[9px] text-muted-foreground">
                                {inj.player} · <span className={inj.status === "Out" ? "text-destructive" : "text-yellow-500"}>{inj.status}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredTeams.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-12">No teams match your search</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearchDashboard;
