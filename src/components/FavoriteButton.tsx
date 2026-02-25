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
          "transition-all",
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          favorited ? "fill-destructive text-destructive scale-110" : "text-muted-foreground hover:text-destructive"
        )}
      />
    </button>
  );
};

export default FavoriteButton;
