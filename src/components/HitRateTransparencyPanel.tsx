import { useMemo } from "react";
import type { PropLine } from "@/data/mockData";
import { Info, BarChart3, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface HitRateTransparencyPanelProps {
  props: PropLine[];
  hitRateByStat: {
    stat: string;
    avgHitRate: number;
    avgHitRateL10: number;
    count: number;
  }[];
}

function confidenceLevel(sampleSize: number): { label: string; color: string; note: string } {
  if (sampleSize >= 30) return { label: "High", color: "text-success", note: "30+ game sample" };
  if (sampleSize >= 15) return { label: "Moderate", color: "text-yellow-500", note: "15-29 game sample" };
  return { label: "Low", color: "text-destructive", note: "Under 15 games" };
}

const HitRateTransparencyPanel = ({ props, hitRateByStat }: HitRateTransparencyPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const overallStats = useMemo(() => {
    if (props.length === 0) return null;
    const totalGP = props.reduce((s, p) => s + p.gamesPlayed, 0);
    const avgGP = totalGP / props.length;
    const avgHR = props.reduce((s, p) => s + p.hitRate, 0) / props.length;
    const avgHRL10 = props.reduce((s, p) => s + p.hitRateLast10, 0) / props.length;
    const highConf = props.filter((p) => p.gamesPlayed >= 30).length;
    const medConf = props.filter((p) => p.gamesPlayed >= 15 && p.gamesPlayed < 30).length;
    const lowConf = props.filter((p) => p.gamesPlayed < 15).length;
    return { totalGP, avgGP, avgHR, avgHRL10, highConf, medConf, lowConf };
  }, [props]);

  if (!overallStats) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden transition-all">
      {/* Toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-secondary/30"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">Hit Rate Transparency</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
            {props.length} props · {Math.round(overallStats.avgGP)} avg games
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border/40 p-4 space-y-4 animate-fade-in">
          {/* Confidence breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-secondary/40 p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-[10px] font-bold text-success">High</span>
              </div>
              <p className="font-mono text-lg font-bold text-foreground">{overallStats.highConf}</p>
              <p className="text-[9px] text-muted-foreground">30+ games</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-[10px] font-bold text-yellow-500">Moderate</span>
              </div>
              <p className="font-mono text-lg font-bold text-foreground">{overallStats.medConf}</p>
              <p className="text-[9px] text-muted-foreground">15–29 games</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-[10px] font-bold text-destructive">Low</span>
              </div>
              <p className="font-mono text-lg font-bold text-foreground">{overallStats.lowConf}</p>
              <p className="text-[9px] text-muted-foreground">&lt;15 games</p>
            </div>
          </div>

          {/* Stat-level breakdown */}
          {hitRateByStat.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                By Stat Category
              </h4>
              <div className="space-y-1.5">
                {hitRateByStat.map(({ stat, avgHitRate, avgHitRateL10, count }) => {
                  const avgGPForStat =
                    props.filter((p) => p.stat === stat).reduce((s, p) => s + p.gamesPlayed, 0) / count;
                  const conf = confidenceLevel(avgGPForStat);
                  return (
                    <div
                      key={stat}
                      className="flex items-center gap-3 rounded-lg bg-secondary/30 px-3 py-2"
                    >
                      <span className="min-w-[80px] text-xs font-medium text-foreground truncate">
                        {stat}
                      </span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-foreground/25 transition-all"
                              style={{ width: `${avgHitRate}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-foreground w-10 text-right">
                          {avgHitRate}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold ${conf.color}`}>{conf.label}</span>
                        <span className="text-[9px] text-muted-foreground">
                          ({count} · ~{Math.round(avgGPForStat)}gp)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Methodology */}
          <div>
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Info className="h-3 w-3" />
              {showMethodology ? "Hide" : "How are hit rates calculated?"}
            </button>
            {showMethodology && (
              <div className="mt-2 rounded-lg bg-secondary/20 p-3 space-y-2 text-[10px] text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Season Hit Rate</strong> — percentage of games
                  where the player exceeded the prop line this season. Based on{" "}
                  {Math.round(overallStats.avgGP)} games on average.
                </p>
                <p>
                  <strong className="text-foreground">Last 10 Hit Rate</strong> — same calculation
                  using only the most recent 10 games, reflecting current form.
                </p>
                <p>
                  <strong className="text-foreground">Confidence</strong> — based on sample size.
                  Larger samples produce more reliable hit rates. Props with fewer than 15 games
                  should be treated with caution.
                </p>
                <div className="flex items-start gap-1.5 pt-1 border-t border-border/30">
                  <AlertTriangle className="h-3 w-3 text-yellow-500 shrink-0 mt-0.5" />
                  <p>
                    Hit rates reflect historical performance and do not guarantee future results.
                    Lines and matchups change daily. Always verify with current data before placing
                    wagers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HitRateTransparencyPanel;
