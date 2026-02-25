import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavoritesCloud";

interface FavoriteButtonProps {
  itemType: "player" | "team";
  itemId: string;
  itemName: string;
  sport?: string;
  size?: "sm" | "md";
  className?: string;
}

const FavoriteButton = ({ itemType, itemId, itemName, sport, size = "sm", className }: FavoriteButtonProps) => {
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = isFavorited(itemType, itemId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(itemType, itemId, itemName, sport);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all min-h-[44px] min-w-[44px]",
        "hover:bg-destructive/10",
        className
      )}
      aria-label={favorited ? `Remove ${itemName} from favorites` : `Add ${itemName} to favorites`}
    >
      <Heart
        className={cn(
          "transition-all duration-300",
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          favorited
            ? "fill-[hsl(var(--pro))] text-[hsl(var(--pro))] scale-110 drop-shadow-[0_0_6px_hsl(var(--pro-glow)/0.7)]"
            : "text-muted-foreground hover:text-[hsl(var(--pro-glow))]"
        )}
      />
    </button>
  );
};

export default FavoriteButton;
