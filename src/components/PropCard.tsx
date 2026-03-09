import { useState } from "react";
import type { PropLine } from "@/data/mockData";
import { formatOdds } from "@/data/mockData";
import { getPlayerProfile } from "@/data/playerProfiles";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, BarChart3, Flame, Snowflake, Minus, Shield, CloudRain, Users, AlertTriangle } from "lucide-react";
import PropStatsPanel from "./PropStatsPanel";
import PlayerAvatar from "./PlayerAvatar";
import FavoriteButton from "./FavoriteButton";
import { useFavorites } from "@/hooks/useFavoritesCloud";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface PropCardProps {
  prop: PropLine;
  showPlayer?: boolean;
  onAddToSlip?: (prop: PropLine, side: "over" | "under") => void;
  viewMode?: "basic" | "advanced";
}

/** Convert American odds to implied probability % */
const impliedProb = (odds: number): number => {
  if (odds < 0) return (-odds / (-odds + 100)) * 100;
  return (100 / (odds + 100)) * 100;
};

/** Determine hot/cold/neutral streak from hit rates */
function getStreak(hitRate: number, hitRateLast10: number): "hot" | "cold" | "neutral" {
  if (hitRateLast10 >= 70) return "hot";
  if (hitRateLast10 <= 35) return "cold";
  if (hitRateLast10 - hitRate >= 10) return "hot";
  if (hitRate - hitRateLast10 >= 10) return "cold";
  return "neutral";
}

/** Mock defensive rank for opponent (fallback when no data) */
function getDefRankFallback(propId: string): number {
  let h = 0;
  for (let i = 0; i < propId.length; i++) h = (Math.imul(31, h) + propId.charCodeAt(i)) | 0;
  return ((h >>> 0) % 30) + 1;
}

const PropCard = ({ prop, showPlayer = true, onAddToSlip, viewMode = "advanced" }: PropCardProps) => {
  const [gameLogOpen, setGameLogOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isFavorited: checkFav } = useFavorites();
  const isFavPlayer = checkFav("player", prop.playerId);
  const profile = getPlayerProfile(prop.playerId);
  const streak = getStreak(prop.hitRate, prop.hitRateLast10);
  const defRank = prop.opponentDefRank ?? getDefRankFallback(prop.id);
  const oppLabel = prop.opponent ?? "OPP";
  const oppFull = prop.opponentFull;

  const gamesOver = Math.round((prop.hitRate / 100) * prop.gamesPlayed);
  const gamesUnder = prop.gamesPlayed - gamesOver;
  const gamesOverL10 = Math.round((prop.hitRateLast10 / 100) * Math.min(10, prop.gamesPlayed));

  // Find best over/under odds
  const bestOver = prop.sportsbooks.reduce((best, sb) => (sb.over > best.over ? sb : best), prop.sportsbooks[0]);
  const bestUnder = prop.sportsbooks.reduce((best, sb) => (sb.under > best.under ? sb : best), prop.sportsbooks[0]);

  return (
    <>
      <div className={`animate-fade-in rounded-xl border bg-card p-4 ${isFavPlayer ? "border-primary/30" : "border-border"}`}>
        {/* Header: player + streak badge */}
        {showPlayer && (
          <div className="mb-3 flex items-center gap-3">
            <PlayerAvatar playerId={prop.playerId} playerName={prop.playerName} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/player/${prop.playerId}`}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate"
                >
                  {prop.playerName}
                </Link>
                {/* Streak badge */}
                {streak === "hot" && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-500/15 px-1.5 py-0.5 text-[9px] font-bold text-orange-500">
                    <Flame className="h-2.5 w-2.5" /> HOT
                  </span>
                )}
                {streak === "cold" && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold text-blue-500">
                    <Snowflake className="h-2.5 w-2.5" /> COLD
                  </span>
                )}
                {streak === "neutral" && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                    <Minus className="h-2.5 w-2.5" /> STEADY
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="rounded-md bg-secondary px-1.5 py-0.5 font-semibold">{prop.teamAbbr}</span>
                {profile && (
                  <>
                    <span>#{profile.number}</span>
                    <span>·</span>
                    <span>{profile.position}</span>
                  </>
                )}
                {profile && (
                  <button
                    onClick={() => setProfileOpen(true)}
                    className="ml-1 text-[9px] font-semibold text-primary hover:underline"
                  >
                    Bio →
                  </button>
                )}
              </div>
            </div>
            <FavoriteButton itemType="player" itemId={prop.playerId} itemName={prop.playerName} sport={prop.sport} />
          </div>
        )}

        {/* Stat & Line */}
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">{prop.stat}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="h-3 w-3 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground">
                vs <span className="font-semibold text-foreground">{oppLabel}</span>
                {" "}· #{defRank} {prop.stat.includes("Point") || prop.stat.includes("Pass") || prop.stat.includes("Rec") || prop.stat === "Goals" || prop.stat === "Shots on Target" ? "scoring" : "stat"} DEF
              </span>
              {defRank <= 5 && <span className="text-[8px] font-bold text-emerald-500 ml-0.5">ELITE</span>}
              {defRank >= 25 && <span className="text-[8px] font-bold text-red-400 ml-0.5">WEAK</span>}
            </div>
          </div>
          <span className="font-mono text-xl font-bold text-foreground">{prop.line}</span>
        </div>

        {/* Hit Rate Bar */}
        <div className="mb-3 rounded-lg border border-border/50 bg-secondary/30 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Hit Rate</span>
            <span className="text-[10px] text-muted-foreground">{prop.gamesPlayed} GP</span>
          </div>
          <div className="space-y-1">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-l-full bg-foreground/40 transition-all" style={{ width: `${prop.hitRate}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>Over {gamesOver}/{prop.gamesPlayed}</span>
              <span>Under {gamesUnder}/{prop.gamesPlayed}</span>
            </div>
          </div>
          {/* L10 mini bar */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground w-8">L10</span>
            <div className="flex-1 flex h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-l-full bg-foreground/30 transition-all" style={{ width: `${prop.hitRateLast10}%` }} />
            </div>
            <span className="text-[9px] font-mono text-muted-foreground">{gamesOverL10}/{Math.min(10, prop.gamesPlayed)}</span>
          </div>
        </div>

        {/* Weather Badge (outdoor sports only) */}
        {prop.weather && (
          <div className={`mb-3 rounded-lg border p-2.5 flex items-center gap-2.5 ${
            prop.weather.impact === "high" ? "border-destructive/30 bg-destructive/5" :
            prop.weather.impact === "moderate" ? "border-yellow-500/30 bg-yellow-500/5" :
            "border-border/50 bg-secondary/20"
          }`}>
            <span className="text-lg">{prop.weather.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-foreground">{prop.weather.tempF}°F</span>
                <span className="text-[9px] text-muted-foreground">·</span>
                <span className="text-[9px] text-muted-foreground">{prop.weather.condition}</span>
                <span className="text-[9px] text-muted-foreground">·</span>
                <span className="text-[9px] text-muted-foreground">{prop.weather.windMph} mph {prop.weather.windDir}</span>
              </div>
              {prop.weather.impactNote && (
                <p className={`text-[8px] mt-0.5 ${
                  prop.weather.impact === "high" ? "text-destructive" :
                  prop.weather.impact === "moderate" ? "text-yellow-600 dark:text-yellow-400" :
                  "text-muted-foreground"
                }`}>
                  {prop.weather.impact !== "none" && <CloudRain className="inline h-2.5 w-2.5 mr-0.5" />}
                  {prop.weather.impactNote}
                </p>
              )}
            </div>
            {prop.weather.impact !== "none" && (
              <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                prop.weather.impact === "high" ? "bg-destructive/15 text-destructive" :
                prop.weather.impact === "moderate" ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400" :
                "bg-secondary text-muted-foreground"
              }`}>
                {prop.weather.impact}
              </span>
            )}
          </div>
        )}
        {viewMode === "advanced" && (
          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Odds by Book</span>
            <div className="grid grid-cols-4 gap-1">
              {prop.sportsbooks.slice(0, 4).map((sb) => {
                const isBestOver = sb.sportsbook === bestOver.sportsbook;
                const isBestUnder = sb.sportsbook === bestUnder.sportsbook;
                return (
                  <div key={sb.sportsbook} className="rounded-lg bg-secondary/50 p-2 text-center">
                    <p className="text-[8px] font-semibold text-muted-foreground truncate">{sb.sportsbook}</p>
                    <p className="font-mono text-[10px] font-semibold text-foreground mt-0.5">{sb.line}</p>
                    <div className="mt-1 space-y-0.5">
                      <p className={`font-mono text-[9px] ${isBestOver ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
                        O {formatOdds(sb.over)}
                      </p>
                      <p className={`font-mono text-[9px] ${isBestUnder ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
                        U {formatOdds(sb.under)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Public Betting Split */}
        {prop.publicBets && (
          <div className="mb-3 rounded-lg border border-border/50 bg-secondary/20 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                <Users className="h-3 w-3" /> Public Action
              </span>
              <span className="text-[9px] text-muted-foreground">
                {prop.publicBets.totalBets.toLocaleString()} bets
              </span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full">
              <div
                className="h-full bg-primary/70 transition-all"
                style={{ width: `${prop.publicBets.overPct}%` }}
              />
              <div
                className="h-full bg-muted-foreground/30 transition-all"
                style={{ width: `${prop.publicBets.underPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-primary font-semibold">Over {prop.publicBets.overPct}%</span>
              <span className="text-muted-foreground">Under {prop.publicBets.underPct}%</span>
            </div>
            <ContrarianIndicator hitRate={prop.hitRate} overPct={prop.publicBets.overPct} />
          </div>
        )}

        {/* Quick add to slip */}
        {onAddToSlip && (
          <div className="mb-2 flex items-center gap-2">
            <button
              onClick={() => onAddToSlip(prop, "over")}
              className="flex-1 rounded-lg border border-border bg-secondary/50 py-1.5 text-[10px] font-bold text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              + Over {prop.line}
            </button>
            <button
              onClick={() => onAddToSlip(prop, "under")}
              className="flex-1 rounded-lg border border-border bg-secondary/50 py-1.5 text-[10px] font-bold text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              + Under {prop.line}
            </button>
          </div>
        )}

        {/* Game log toggle */}
        <button
          onClick={() => setGameLogOpen(!gameLogOpen)}
          className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg border border-border/50 bg-secondary/30 py-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
        >
          <BarChart3 className="h-3 w-3" />
          {gameLogOpen ? "Hide Game Log" : "Game Log & Charts"}
          {gameLogOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {gameLogOpen && <PropStatsPanel prop={prop} />}

        <div className="mt-2 text-center">
          <span className="text-[9px] text-amber-500/80">
            ⚠️ Sample data — not live odds
          </span>
        </div>
      </div>

      {/* Physical Attributes Side Drawer */}
      {profile && (
        <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
          <SheetContent side="right" className="w-[300px] sm:w-[360px]">
            <SheetHeader>
              <SheetTitle>{prop.playerName}</SheetTitle>
              <SheetDescription>Physical attributes & bio</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="flex justify-center">
                <PlayerAvatar playerId={prop.playerId} playerName={prop.playerName} size="lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Height", value: profile.height },
                  { label: "Weight", value: `${profile.weight} lbs` },
                  { label: "Age", value: profile.age },
                  { label: "Experience", value: `${profile.experience} yrs` },
                  ...(profile.draftYear > 0 ? [{ label: "Draft", value: profile.draftYear }] : []),
                  ...(profile.nationality ? [{ label: "Nationality", value: profile.nationality }] : []),
                  ...(profile.college ? [{ label: "College", value: profile.college }] : []),
                  { label: "Position", value: profile.position },
                  { label: "Number", value: `#${profile.number}` },
                ].map((attr) => (
                  <div key={attr.label} className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground">{attr.label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

/** Check if a prop has a contrarian signal */
export function hasContrarianSignal(hitRate: number, overPct: number): boolean {
  const underPct = 100 - overPct;
  return (overPct >= 60 && hitRate <= 45) || (underPct >= 60 && hitRate >= 55);
}

/** Contrarian indicator — flags when public betting diverges from hit rate */
export function ContrarianIndicator({ hitRate, overPct }: { hitRate: number; overPct: number }) {
  const underPct = 100 - overPct;
  // Public heavily on Over but hit rate says Under is more likely
  const publicOverContrarian = overPct >= 60 && hitRate <= 45;
  // Public heavily on Under but hit rate says Over is more likely
  const publicUnderContrarian = underPct >= 60 && hitRate >= 55;

  if (!publicOverContrarian && !publicUnderContrarian) return null;

  const side = publicOverContrarian ? "Under" : "Over";
  const gap = publicOverContrarian
    ? Math.round(overPct - hitRate)
    : Math.round(hitRate - (100 - underPct));

  return (
    <div className="mt-1 flex items-center gap-1.5 rounded-md bg-accent/60 border border-accent px-2 py-1.5">
      <AlertTriangle className="h-3.5 w-3.5 text-chart-4 shrink-0" />
      <span className="text-[10px] leading-tight text-foreground">
        <span className="font-bold text-chart-4">Contrarian {side}</span>
        <span className="text-muted-foreground"> — Public is {gap}% off from the hit rate. Data favors the {side.toLowerCase()}.</span>
      </span>
    </div>
  );
}

export default PropCard;
