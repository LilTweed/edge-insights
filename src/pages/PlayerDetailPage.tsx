import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { getPropsForPlayer, propLines, formatOdds } from "@/data/mockData";
import type { PropLine } from "@/data/mockData";
import { getPlayerProfile, getInitials } from "@/data/playerProfiles";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { Badge } from "@/components/ui/badge";

/* ───── seeded RNG ───── */
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return () => {
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = h ^ (h >>> 16);
    return (h >>> 0) / 4294967296;
  };
}

interface GameLog {
  game: number;
  label: string;
  opponent: string;
  date: string;
  value: number;
  hit: boolean;
  // supporting stats
  secondary: { label: string; value: number }[];
}

const OPPONENTS = ["SAS", "ORL", "NOP", "CHA", "SAC", "LAC", "WAS", "HOU", "MIA", "PHX", "BOS", "DEN", "DAL", "MIL", "CLE", "GSW", "NYK", "ATL", "IND", "POR"];

function generateFullGameLog(prop: PropLine): GameLog[] {
  const rng = seededRandom(prop.id + prop.playerName);
  const count = prop.gamesPlayed;
  const avg = prop.line * (prop.hitRate / 100 + (1 - prop.hitRate / 100) * 0.85);
  const stddev = prop.line * 0.25;
  const logs: GameLog[] = [];

  for (let i = 0; i < count; i++) {
    const u1 = rng(), u2 = rng();
    const z = Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.cos(2 * Math.PI * u2);
    const value = Math.max(0, Math.round((avg + z * stddev) * 10) / 10);
    const month = 1 + Math.floor((i / count) * 5);
    const day = 1 + Math.floor(rng() * 28);
    logs.push({
      game: i + 1,
      label: `${month}/${day}`,
      opponent: OPPONENTS[Math.floor(rng() * OPPONENTS.length)],
      date: `${month}/${day}`,
      value,
      hit: false,
      secondary: [
        { label: "AST", value: Math.round(rng() * 10) },
        { label: "REB", value: Math.round(rng() * 12) },
        { label: "STL", value: Math.round(rng() * 3) },
      ],
    });
  }

  // adjust hit flags to match hit rate
  const targetHits = Math.round((prop.hitRate / 100) * count);
  const sorted = [...logs].sort((a, b) => b.value - a.value);
  sorted.forEach((entry, idx) => { entry.hit = idx < targetHits; });
  return logs;
}

function computeTrend(logs: GameLog[]): { direction: "up" | "down" | "flat"; pct: number } {
  if (logs.length < 10) return { direction: "flat", pct: 0 };
  const recent5 = logs.slice(-5).reduce((s, g) => s + g.value, 0) / 5;
  const prev5 = logs.slice(-10, -5).reduce((s, g) => s + g.value, 0) / 5;
  const diff = ((recent5 - prev5) / prev5) * 100;
  if (Math.abs(diff) < 2) return { direction: "flat", pct: Math.round(diff * 10) / 10 };
  return { direction: diff > 0 ? "up" : "down", pct: Math.round(diff * 10) / 10 };
}

/* ───── Line movement mock ───── */
function generateLineMovement(prop: PropLine) {
  const rng = seededRandom("lm-" + prop.id);
  const movements: { time: string; line: number; change: number }[] = [];
  let line = prop.line;
  const hours = ["5:29 AM", "5:11 AM", "11:45 PM", "9:30 PM", "6:15 PM"];
  for (let i = 0; i < 5; i++) {
    const delta = (rng() - 0.5) * 2;
    const rounded = Math.round(delta * 2) / 2;
    movements.push({ time: hours[i], line: +(line + rounded).toFixed(1), change: rounded });
    line = +(line + rounded).toFixed(1);
  }
  return movements;
}

/* ───── Defensive rankings mock ───── */
function generateDefensiveRankings(prop: PropLine) {
  const rng = seededRandom("def-" + prop.id);
  return [
    { stat: "Points", rank: Math.ceil(rng() * 30), value: +(100 + rng() * 25).toFixed(1) },
    { stat: "Field Goal Pct", rank: Math.ceil(rng() * 30), value: +(44 + rng() * 10).toFixed(1) },
    { stat: "2-Point Pct", rank: Math.ceil(rng() * 30), value: +(50 + rng() * 10).toFixed(1) },
    { stat: "3-Point Pct", rank: Math.ceil(rng() * 30), value: +(33 + rng() * 10).toFixed(1) },
    { stat: "Free Throw Pct", rank: Math.ceil(rng() * 30), value: +(72 + rng() * 12).toFixed(1) },
    { stat: "Rebounds", rank: Math.ceil(rng() * 30), value: +(38 + rng() * 8).toFixed(1) },
  ];
}

/* ───── Page ───── */
const PlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const playerProps = useMemo(() => getPropsForPlayer(id ?? ""), [id]);
  const profile = id ? getPlayerProfile(id) : undefined;

  const statCategories = useMemo(
    () => [...new Set(playerProps.map((p) => p.stat))],
    [playerProps]
  );

  const [selectedStat, setSelectedStat] = useState<string>("");
  const [timeRange, setTimeRange] = useState<"L5" | "L10" | "L20" | "Season">("L10");
  const [showLineMovement, setShowLineMovement] = useState(true);

  // Initialize selected stat
  const activeStat = selectedStat || statCategories[0] || "";
  const activeProp = playerProps.find((p) => p.stat === activeStat);

  const gameLog = useMemo(() => (activeProp ? generateFullGameLog(activeProp) : []), [activeProp]);
  const trend = useMemo(() => computeTrend(gameLog), [gameLog]);
  const lineMovement = useMemo(() => (activeProp ? generateLineMovement(activeProp) : []), [activeProp]);
  const defenseRankings = useMemo(() => (activeProp ? generateDefensiveRankings(activeProp) : []), [activeProp]);

  // Filtered game log based on time range
  const filteredLog = useMemo(() => {
    if (timeRange === "L5") return gameLog.slice(-5);
    if (timeRange === "L10") return gameLog.slice(-10);
    if (timeRange === "L20") return gameLog.slice(-20);
    return gameLog;
  }, [gameLog, timeRange]);

  const hitCount = filteredLog.filter((g) => g.hit).length;
  const hitPct = filteredLog.length > 0 ? Math.round((hitCount / filteredLog.length) * 100) : 0;
  const avgValue = filteredLog.length > 0 ? filteredLog.reduce((s, g) => s + g.value, 0) / filteredLog.length : 0;

  // Supporting stats averages
  const supportingStats = useMemo(() => {
    if (gameLog.length === 0) return [];
    const keys = gameLog[0].secondary.map((s) => s.label);
    return keys.map((k) => {
      const vals = gameLog.map((g) => g.secondary.find((s) => s.label === k)?.value ?? 0);
      const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
      const median = [...vals].sort((a, b) => a - b)[Math.floor(vals.length / 2)];
      return { label: k, avg: avg.toFixed(1), median: median.toFixed(1) };
    });
  }, [gameLog]);

  const TrendIcon = trend.direction === "up" ? TrendingUp : trend.direction === "down" ? TrendingDown : Minus;

  if (playerProps.length === 0) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">No prop data available for this player</p>
        <Link to="/props" className="mt-2 inline-block text-sm text-primary underline">Back to props</Link>
      </div>
    );
  }

  const playerName = playerProps[0].playerName;
  const teamAbbr = playerProps[0].teamAbbr;

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Player Header ─── */}
      <div className="bg-gradient-to-b from-primary/15 to-background px-4 pt-4 pb-3">
        <Link to="/props" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Props
        </Link>

        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 border-2 border-primary/30 text-2xl">
            {profile ? profile.avatarEmoji : <span className="text-sm font-bold text-primary">{getInitials(playerName)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">{playerName}</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {teamAbbr}
              </Badge>
              {profile && (
                <>
                  <span>#{profile.number}</span>
                  <span>·</span>
                  <span>{profile.position}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Active prop line badge */}
        {activeProp && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-bold px-2.5 py-1">
              {activeStat} — Over {activeProp.line}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {activeProp.sportsbooks[0]?.sportsbook}: {formatOdds(activeProp.sportsbooks[0]?.over)}
            </span>
          </div>
        )}
      </div>

      {/* ─── Stat Category Tabs ─── */}
      <div className="border-b border-border overflow-x-auto scrollbar-hide">
        <div className="flex px-4 gap-0.5">
          {statCategories.map((stat) => (
            <button
              key={stat}
              onClick={() => setSelectedStat(stat)}
              className={`whitespace-nowrap px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors min-h-[44px] ${
                stat === activeStat
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* ─── Time Range Filters ─── */}
        <div className="flex gap-1.5">
          {(["L5", "L10", "L20", "Season"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold min-h-[36px] transition-colors ${
                timeRange === range
                  ? "bg-secondary text-foreground"
                  : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* ─── Hit Rate Header ─── */}
        {activeProp && (
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                % {playerName} — {activeStat}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {timeRange === "Season" ? "Season" : `Last ${timeRange.slice(1)}`}{" "}
                <span className="font-mono font-bold text-foreground">{hitPct}%</span>{" "}
                <span className="text-muted-foreground">{hitCount} of {filteredLog.length}</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <TrendIcon className={`h-4 w-4 ${
                trend.direction === "up" ? "text-emerald-500" : trend.direction === "down" ? "text-red-400" : "text-muted-foreground"
              }`} />
              <span className={`font-mono text-xs font-bold ${
                trend.direction === "up" ? "text-emerald-500" : trend.direction === "down" ? "text-red-400" : "text-muted-foreground"
              }`}>
                {trend.pct > 0 ? "+" : ""}{trend.pct}%
              </span>
            </div>
          </div>
        )}

        {/* ─── Game-by-Game Bar Chart ─── */}
        {activeProp && (
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredLog} margin={{ top: 16, right: 4, bottom: 0, left: -16 }}>
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    interval={Math.max(0, Math.floor(filteredLog.length / 6) - 1)}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, "auto"]}
                  />
                  <ReferenceLine
                    y={activeProp.line}
                    stroke="hsl(var(--primary))"
                    strokeDasharray="4 3"
                    strokeWidth={1.5}
                    label={{
                      value: activeProp.line.toString(),
                      position: "left",
                      fill: "hsl(var(--primary))",
                      fontSize: 10,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [value, activeStat]}
                    labelFormatter={(_, payload) => {
                      if (payload?.[0]?.payload) {
                        const d = payload[0].payload as GameLog;
                        return `${d.date} vs ${d.opponent}`;
                      }
                      return "";
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[3, 3, 0, 0]}
                    shape={(barProps: any) => {
                      const { x, y, width, height, payload } = barProps;
                      const isHit = payload.hit;
                      return (
                        <g>
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            rx={3}
                            fill={isHit ? "hsl(var(--primary) / 0.7)" : "hsl(var(--muted-foreground) / 0.2)"}
                          />
                          {/* Value label on top */}
                          <text
                            x={x + width / 2}
                            y={y - 4}
                            textAnchor="middle"
                            fontSize={8}
                            fill="hsl(var(--foreground))"
                            fontWeight="bold"
                          >
                            {payload.value}
                          </text>
                        </g>
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Opponent labels underneath */}
            <div className="flex mt-1 overflow-x-auto scrollbar-hide">
              {filteredLog.map((g, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 text-center text-[7px] text-muted-foreground"
                  style={{ width: `${100 / filteredLog.length}%` }}
                >
                  vs {g.opponent}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Average Stats Row ─── */}
        {activeProp && (
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-lg bg-secondary/40 p-2.5 text-center">
              <p className="text-[9px] font-bold uppercase text-muted-foreground">Avg</p>
              <p className="font-mono text-base font-bold text-foreground">{avgValue.toFixed(1)}</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-2.5 text-center">
              <p className="text-[9px] font-bold uppercase text-muted-foreground">Line</p>
              <p className="font-mono text-base font-bold text-foreground">{activeProp.line}</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-2.5 text-center">
              <p className="text-[9px] font-bold uppercase text-muted-foreground">Hit %</p>
              <p className="font-mono text-base font-bold text-foreground">{hitPct}%</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-2.5 text-center">
              <p className="text-[9px] font-bold uppercase text-muted-foreground">Games</p>
              <p className="font-mono text-base font-bold text-foreground">{filteredLog.length}</p>
            </div>
          </div>
        )}

        {/* ─── Line Movement ─── */}
        {activeProp && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setShowLineMovement(!showLineMovement)}
              className="flex w-full items-center justify-between px-3 py-2.5 min-h-[44px] hover:bg-secondary/20 transition-colors"
            >
              <span className="text-xs font-bold text-foreground">Line Movement</span>
              {showLineMovement ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {showLineMovement && (
              <div className="border-t border-border">
                <div className="grid grid-cols-3 px-3 py-1.5 text-[9px] font-bold uppercase text-muted-foreground border-b border-border/50">
                  <span>Time</span>
                  <span className="text-right">Line</span>
                  <span className="text-right">Change</span>
                </div>
                {lineMovement.map((m, i) => (
                  <div key={i} className="grid grid-cols-3 px-3 py-2 text-xs border-b border-border/30 last:border-0">
                    <span className="text-muted-foreground">{m.time}</span>
                    <span className="text-right font-mono font-semibold text-foreground">{m.line}</span>
                    <span className={`text-right font-mono font-semibold ${
                      m.change > 0 ? "text-emerald-500" : m.change < 0 ? "text-red-400" : "text-muted-foreground"
                    }`}>
                      {m.change > 0 ? "+" : ""}{m.change}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Sportsbook Comparison ─── */}
        {activeProp && (
          <div className="rounded-xl border border-border bg-card p-3 space-y-2">
            <h3 className="text-xs font-bold text-foreground">Lines by Book</h3>
            {activeProp.sportsbooks.map((sb) => (
              <div key={sb.sportsbook} className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2 min-h-[44px]">
                <span className="text-xs font-medium text-muted-foreground">{sb.sportsbook}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">{sb.line}</span>
                  <span className="rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                    O {formatOdds(sb.over)}
                  </span>
                  <span className="rounded bg-secondary border border-border px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                    U {formatOdds(sb.under)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Supporting Stats ─── */}
        <div className="rounded-xl border border-border bg-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground">Supporting Stats</h3>
            <div className="flex gap-1">
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Average</Badge>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0">Median</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {supportingStats.map((s) => (
              <div key={s.label} className="rounded-lg bg-secondary/30 p-2.5 text-center">
                <p className="text-[9px] font-bold uppercase text-muted-foreground">{s.label}</p>
                <p className="font-mono text-sm font-bold text-foreground">{s.avg}</p>
                <p className="font-mono text-[9px] text-muted-foreground">med: {s.median}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Opponent Defense Rankings ─── */}
        <div className="rounded-xl border border-border bg-card p-3 space-y-2">
          <h3 className="text-xs font-bold text-foreground">Opponent Defense Rankings</h3>
          <div className="space-y-0.5">
            <div className="grid grid-cols-3 px-2 py-1 text-[9px] font-bold uppercase text-muted-foreground">
              <span>Stat</span>
              <span className="text-center">Rank</span>
              <span className="text-right">Value</span>
            </div>
            {defenseRankings.map((r) => (
              <div key={r.stat} className="grid grid-cols-3 items-center px-2 py-2 rounded-lg hover:bg-secondary/20 transition-colors">
                <span className="text-xs font-medium text-foreground">{r.stat}</span>
                <span className={`text-center font-mono text-xs font-bold ${
                  r.rank <= 10 ? "text-emerald-500" : r.rank >= 21 ? "text-red-400" : "text-foreground"
                }`}>
                  {r.rank}th
                </span>
                <span className="text-right font-mono text-xs text-muted-foreground">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Cumulative Hit Rate Chart ─── */}
        {activeProp && (
          <div className="rounded-xl border border-border bg-card p-3">
            <h3 className="text-xs font-bold text-foreground mb-2">Cumulative Hit Rate Trend</h3>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={gameLog.map((g, i) => {
                    let hits = 0;
                    for (let j = 0; j <= i; j++) if (gameLog[j].hit) hits++;
                    return { game: i + 1, hitRate: Math.round((hits / (i + 1)) * 100) };
                  })}
                  margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                >
                  <defs>
                    <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="game" hide />
                  <YAxis
                    tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    ticks={[25, 50, 75]}
                  />
                  <ReferenceLine y={50} stroke="hsl(var(--muted-foreground) / 0.2)" strokeDasharray="3 3" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [`${value}%`, "Hit Rate"]}
                    labelFormatter={(label) => `Game ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="hitRate"
                    stroke="hsl(var(--primary))"
                    strokeWidth={1.5}
                    fill="url(#cumGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ─── Other Props for This Player ─── */}
        {playerProps.length > 1 && (
          <div className="rounded-xl border border-border bg-card p-3 space-y-2">
            <h3 className="text-xs font-bold text-foreground">All Props — {playerName}</h3>
            {playerProps.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedStat(p.stat)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 min-h-[44px] transition-colors ${
                  p.stat === activeStat
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-secondary/30 hover:bg-secondary/50"
                }`}
              >
                <span className="text-xs font-semibold text-foreground">{p.stat}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-foreground">{p.line}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{p.hitRate}% hit</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="text-center text-[9px] text-muted-foreground pb-4">
          ⚠️ Simulated data · Connect a live stats API for real-time accuracy
        </p>
      </div>
    </div>
  );
};

export default PlayerDetailPage;
