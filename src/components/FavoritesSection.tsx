import { useFavorites } from "@/hooks/useFavoritesCloud";
import { propLines } from "@/data/mockData";
import { getPlayerProfile } from "@/data/playerProfiles";
import PlayerAvatar from "@/components/PlayerAvatar";
import FavoriteButton from "@/components/FavoriteButton";
import { Link } from "react-router-dom";
import { Heart, Star, Users } from "lucide-react";

const FavoritesSection = () => {
  const { favorites, loading } = useFavorites();

  const favPlayers = favorites.filter((f) => f.item_type === "player");
  const favTeams = favorites.filter((f) => f.item_type === "team");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
        <Heart className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">No favorites yet</p>
        <p className="text-xs text-muted-foreground">
          Tap the heart icon on any player or team card to save them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Favorite Players */}
      {favPlayers.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> Players ({favPlayers.length})
          </h3>
          <div className="space-y-2">
            {favPlayers.map((fav) => {
              const profile = getPlayerProfile(fav.item_id);
              const playerProps = propLines.filter((p) => p.playerId === fav.item_id);
              const topProp = playerProps[0];

              return (
                <Link
                  key={fav.id}
                  to={`/player/${fav.item_id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/20"
                >
                  <PlayerAvatar playerId={fav.item_id} playerName={fav.item_name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{fav.item_name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      {fav.sport && <span className="rounded bg-secondary px-1.5 py-0.5 font-bold">{fav.sport}</span>}
                      {profile && <span>#{profile.number} · {profile.position}</span>}
                    </div>
                  </div>
                  {topProp && (
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">{topProp.stat}</p>
                      <p className="font-mono text-xs font-bold text-foreground">{topProp.line}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">{topProp.hitRate}% hit</p>
                    </div>
                  )}
                  <FavoriteButton itemType="player" itemId={fav.item_id} itemName={fav.item_name} sport={fav.sport || undefined} />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Favorite Teams */}
      {favTeams.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5" /> Teams ({favTeams.length})
          </h3>
          <div className="space-y-2">
            {favTeams.map((fav) => (
              <div
                key={fav.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                  {fav.item_id.slice(0, 3).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{fav.item_name}</p>
                  {fav.sport && (
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">{fav.sport}</span>
                  )}
                </div>
                <FavoriteButton itemType="team" itemId={fav.item_id} itemName={fav.item_name} sport={fav.sport || undefined} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
