import { useMemo } from "react";
import type { PropLine } from "@/data/mockData";
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
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";

interface PropStatsPanelProps {
  prop: PropLine;
}

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

interface GameLog {
  game: number;
  label: string;
  value: number;
  hit: boolean;
}

function generateGameLog(prop: PropLine): GameLog[] {
  const rng = seededRandom(prop.id + prop.playerName);
  const count = prop.gamesPlayed;
  const avg = prop.line * (prop.hitRate / 100 + (1 - prop.hitRate / 100) * 0.85);
  const stddev = prop.line * 0.25;

  const logs: GameLog[] = [];
  for (let i = 0; i < count; i++) {
    // Box-Muller transform for gaussian
    const u1 = rng();
    const u2 = rng();
    const z = Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.cos(2 * Math.PI * u2);
    const value = Math.max(0, Math.round((avg + z * stddev) * 10) / 10);
    logs.push({
      game: i + 1,
      label: `G${i + 1}`,
      value,
      hit: value > prop.line,
    });
  }

  // Adjust to match approximate hit rate
  const targetHits = Math.round((prop.hitRate / 100) * count);
  const sorted = [...logs].sort((a, b) => b.value - a.value);
  sorted.forEach((entry, idx) => {
    entry.hit = idx < targetHits;
  });

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

const PropStatsPanel = ({ prop }: PropStatsPanelProps) => {
  const gameLog = useMemo(() => generateGameLog(prop), [prop]);
  const trend = useMemo(() => computeTrend(gameLog), [gameLog]);

  const last20 = gameLog.slice(-20);
  const last10 = gameLog.slice(-10);
  const last5 = gameLog.slice(-5);

  const avgAll = gameLog.reduce((s, g) => s + g.value, 0) / gameLog.length;
  const avgL10 = last10.reduce((s, g) => s + g.value, 0) / last10.length;
  const avgL5 = last5.reduce((s, g) => s + g.value, 0) / last5.length;

  const hitL5 = last5.filter((g) => g.hit).length;
  const hitL10 = last10.filter((g) => g.hit).length;

  // Cumulative hit rate for area chart
  const cumulativeData = useMemo(() => {
    let hits = 0;
    return gameLog.map((g, i) => {
      if (g.hit) hits++;
      return { game: i + 1, hitRate: Math.round((hits / (i + 1)) * 100) };
    });
  }, [gameLog]);

  const TrendIcon = trend.direction === "up" ? TrendingUp : trend.direction === "down" ? TrendingDown : Minus;

  return (
    <div className="mt-3 space-y-4 border-t border-border pt-3 animate-fade-in">
      {/* Trend + Averages */}
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-lg bg-secondary/50 p-2 text-center">
          <p className="text-[9px] font-bold uppercase text-muted-foreground">Season</p>
          <p className="font-mono text-sm font-bold text-foreground">{avgAll.toFixed(1)}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-2 text-center">
          <p className="text-[9px] font-bold uppercase text-muted-foreground">L10</p>
          <p className="font-mono text-sm font-bold text-foreground">{avgL10.toFixed(1)}</p>
          <p className="text-[8px] font-mono text-muted-foreground">{hitL10}/10 hit</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-2 text-center">
          <p className="text-[9px] font-bold uppercase text-muted-foreground">L5</p>
          <p className="font-mono text-sm font-bold text-foreground">{avgL5.toFixed(1)}</p>
          <p className="text-[8px] font-mono text-muted-foreground">{hitL5}/5 hit</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-2 text-center">
          <p className="text-[9px] font-bold uppercase text-muted-foreground">Trend</p>
          <div className="flex items-center justify-center gap-1">
            <TrendIcon className={`h-3.5 w-3.5 ${
              trend.direction === "up" ? "text-emerald-500" : trend.direction === "down" ? "text-red-400" : "text-muted-foreground"
            }`} />
            <span className={`font-mono text-xs font-bold ${
              trend.direction === "up" ? "text-emerald-500" : trend.direction === "down" ? "text-red-400" : "text-muted-foreground"
            }`}>
              {trend.pct > 0 ? "+" : ""}{trend.pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Game-by-Game Bar Chart (last 20) */}
      <div>
        <div className="mb-1.5 flex items-center gap-1.5">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Last {last20.length} Games vs Line ({prop.line})
          </span>
        </div>
        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last20} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                interval={Math.floor(last20.length / 6)}
              />
              <YAxis
                tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
              />
              <ReferenceLine
                y={prop.line}
                stroke="hsl(var(--primary))"
                strokeDasharray="4 3"
                strokeWidth={1.5}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => [value, prop.stat]}
                labelFormatter={(label) => label}
              />
              <Bar
                dataKey="value"
                radius={[2, 2, 0, 0]}
                fill="hsl(var(--muted-foreground) / 0.3)"
                // Color is handled via shape for hit/miss
                shape={(barProps: any) => {
                  const { x, y, width, height, payload } = barProps;
                  const fill = payload.hit
                    ? "hsl(var(--primary) / 0.7)"
                    : "hsl(var(--muted-foreground) / 0.25)";
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={2}
                      fill={fill}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Hit Rate Area Chart */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Cumulative Hit Rate Trend
        </span>
        <div className="h-20 w-full mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id={`grad-${prop.id}`} x1="0" y1="0" x2="0" y2="1">
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
              <ReferenceLine
                y={50}
                stroke="hsl(var(--muted-foreground) / 0.2)"
                strokeDasharray="3 3"
              />
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
                fill={`url(#grad-${prop.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-center text-[9px] text-muted-foreground">
        Simulated game log based on {prop.gamesPlayed} GP · Connect a live stats API for real game-by-game data
      </p>
    </div>
  );
};

export default PropStatsPanel;
