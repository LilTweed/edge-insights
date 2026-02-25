import { useState } from "react";
import type { PropLine } from "@/data/mockData";
import { Star } from "lucide-react";
import { useFavorites } from "@/hooks/useFavoritesCloud";
import { formatOdds } from "@/data/mockData";
import { getPlayerProfile, getInitials } from "@/data/playerProfiles";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, BarChart3, User, Ruler, Weight, Calendar, GraduationCap, Globe } from "lucide-react";
import PropStatsPanel from "./PropStatsPanel";
import PlayerAvatar from "./PlayerAvatar";
import FavoriteButton from "./FavoriteButton";

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

const PropCard = ({ prop, showPlayer = true, onAddToSlip, viewMode = "advanced" }: PropCardProps) => {
  const [statsOpen, setStatsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isFavorited: checkFav } = useFavorites();
  const isFavPlayer = checkFav("player", prop.playerId);
  const profile = getPlayerProfile(prop.playerId);

  // Compute consensus implied probability from all sportsbooks (average of over odds)
  const avgImpliedOver = prop.sportsbooks.reduce((sum, sb) => sum + impliedProb(sb.over), 0) / prop.sportsbooks.length;
  const avgImpliedUnder = prop.sportsbooks.reduce((sum, sb) => sum + impliedProb(sb.under), 0) / prop.sportsbooks.length;

  // Compute actual over/under counts from hit rate + games played
  const gamesOver = Math.round((prop.hitRate / 100) * prop.gamesPlayed);
  const gamesUnder = prop.gamesPlayed - gamesOver;
  const gamesOverL10 = Math.round((prop.hitRateLast10 / 100) * Math.min(10, prop.gamesPlayed));
  const gamesUnderL10 = Math.min(10, prop.gamesPlayed) - gamesOverL10;

  return (
    <div className={`animate-fade-in rounded-xl border bg-card p-4 ${isFavPlayer ? "border-primary/30" : "border-border"}`}>
      {/* Header with player icon */}
      {showPlayer && (
        <div className="mb-3 flex items-center gap-3">
          {/* Player avatar */}
          <PlayerAvatar playerId={prop.playerId} playerName={prop.playerName} size="md" />
          <div className="flex-1 min-w-0">
            <Link
              to={`/player/${prop.playerId}`}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
            >
              {prop.playerName}
            </Link>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="rounded-md bg-secondary px-1.5 py-0.5 font-semibold">{prop.teamAbbr}</span>
              {profile && (
                <>
                  <span>#{profile.number}</span>
                  <span>·</span>
                  <span>{profile.position}</span>
                </>
              )}
            </div>
          </div>
          <FavoriteButton itemType="player" itemId={prop.playerId} itemName={prop.playerName} sport={prop.sport} />
        </div>
      )}

      {/* Physical attributes toggle */}
      {profile && (
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="mb-3 flex w-full items-center justify-center gap-1 rounded-lg border border-border/50 bg-secondary/30 py-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
        >
          <User className="h-3 w-3" />
          {profileOpen ? "Hide Profile" : "Physical Attributes"}
          {profileOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      )}

      {profileOpen && profile && (
        <div className="mb-3 rounded-lg border border-border/50 bg-secondary/20 p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Ruler className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Height:</span>
              <span className="font-semibold text-foreground">{profile.height}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <Weight className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Weight:</span>
              <span className="font-semibold text-foreground">{profile.weight} lbs</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Age:</span>
              <span className="font-semibold text-foreground">{profile.age}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Exp:</span>
              <span className="font-semibold text-foreground">{profile.experience} yrs</span>
            </div>
            {profile.draftYear > 0 && (
              <div className="flex items-center gap-1.5 text-[11px]">
                <GraduationCap className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Draft:</span>
                <span className="font-semibold text-foreground">{profile.draftYear}</span>
              </div>
            )}
            {profile.nationality && (
              <div className="flex items-center gap-1.5 text-[11px]">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">From:</span>
                <span className="font-semibold text-foreground">{profile.nationality}</span>
              </div>
            )}
            {profile.college && (
              <div className="col-span-2 flex items-center gap-1.5 text-[11px]">
                <GraduationCap className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">College:</span>
                <span className="font-semibold text-foreground">{profile.college}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stat & Line */}
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-xs font-medium text-muted-foreground">{prop.stat}</span>
        <span className="font-mono text-xl font-bold text-foreground">{prop.line}</span>
      </div>

      {/* Basic: simple hit rate line */}
      {viewMode === "basic" && (
        <div className="mb-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-l-full bg-foreground/40 transition-all"
                style={{ width: `${prop.hitRate}%` }}
              />
            </div>
          </div>
          <span className="font-mono text-xs font-semibold text-muted-foreground whitespace-nowrap">
            {gamesOver}/{prop.gamesPlayed} over
          </span>
        </div>
      )}

      {/* Advanced: full hit rate + sportsbooks + slip */}
      {viewMode === "advanced" && (
        <>
          {/* Hit Rate — neutral, transparent */}
          <div className="mb-3 rounded-lg border border-border/50 bg-secondary/30 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Hit Rate</span>
              <span className="text-[10px] text-muted-foreground">{prop.gamesPlayed} games</span>
            </div>

            {/* Season split */}
            <div className="space-y-1">
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-l-full bg-foreground/40 transition-all"
                  style={{ width: `${prop.hitRate}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>Over {gamesOver}/{prop.gamesPlayed}</span>
                <span>Under {gamesUnder}/{prop.gamesPlayed}</span>
              </div>
            </div>

            {/* Last 10 split */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Last 10</span>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-l-full bg-foreground/30 transition-all"
                  style={{ width: `${prop.hitRateLast10}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>Over {gamesOverL10}/{Math.min(10, prop.gamesPlayed)}</span>
                <span>Under {gamesUnderL10}/{Math.min(10, prop.gamesPlayed)}</span>
              </div>
            </div>
          </div>

          {/* Sportsbook Lines */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-medium text-muted-foreground">Lines by Book</span>
            <div className="space-y-1">
              {prop.sportsbooks.map((sb) => (
                <div key={sb.sportsbook} className="flex items-center justify-between rounded-lg bg-secondary/50 px-2.5 py-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">{sb.sportsbook}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-foreground">{sb.line}</span>
                    <span className="line-badge-over">O {formatOdds(sb.over)}</span>
                    <span className="line-badge-under">U {formatOdds(sb.under)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick add to slip */}
          {onAddToSlip && (
            <div className="mt-3 flex items-center gap-2">
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

          <div className="mt-2.5 text-center">
            <span className="text-[10px] text-amber-500/80">
              ⚠️ Sample data — not live odds. Connect a real odds API for accurate lines.
            </span>
          </div>
        </>
      )}

      {/* Expand stats */}
      <button
        onClick={() => setStatsOpen(!statsOpen)}
        className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-border/50 bg-secondary/30 py-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
      >
        <BarChart3 className="h-3 w-3" />
        {statsOpen ? "Hide Stats" : "Game Log & Charts"}
        {statsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {statsOpen && <PropStatsPanel prop={prop} />}
    </div>
  );
};

export default PropCard;
