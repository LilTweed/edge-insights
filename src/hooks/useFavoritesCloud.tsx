import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Favorite {
  id: string;
  item_type: "player" | "team";
  item_id: string;
  item_name: string;
  sport: string | null;
  created_at: string;
}

interface FavoritesCtx {
  favorites: Favorite[];
  loading: boolean;
  isFavorited: (itemType: "player" | "team", itemId: string) => boolean;
  toggleFavorite: (itemType: "player" | "team", itemId: string, itemName: string, sport?: string) => Promise<void>;
  favoritedPlayerIds: Set<string>;
  favoritedTeamIds: Set<string>;
}

const FavoritesContext = createContext<FavoritesCtx>({
  favorites: [],
  loading: true,
  isFavorited: () => false,
  toggleFavorite: async () => {},
  favoritedPlayerIds: new Set(),
  favoritedTeamIds: new Set(),
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setFavorites(data as Favorite[]);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const isFavorited = useCallback(
    (itemType: "player" | "team", itemId: string) => {
      return favorites.some((f) => f.item_type === itemType && f.item_id === itemId);
    },
    [favorites]
  );

  const favoritedPlayerIds = new Set(
    favorites.filter((f) => f.item_type === "player").map((f) => f.item_id)
  );

  const favoritedTeamIds = new Set(
    favorites.filter((f) => f.item_type === "team").map((f) => f.item_id)
  );

  const toggleFavorite = useCallback(
    async (itemType: "player" | "team", itemId: string, itemName: string, sport?: string) => {
      if (!user) {
        toast.error("Sign in to save favorites");
        return;
      }

      const existing = favorites.find((f) => f.item_type === itemType && f.item_id === itemId);

      if (existing) {
        // Remove
        const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
        if (error) {
          toast.error("Failed to remove favorite");
          return;
        }
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
        toast.success(`Removed ${itemName} from favorites`);
      } else {
        // Add
        const { data, error } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            item_type: itemType,
            item_id: itemId,
            item_name: itemName,
            sport: sport || null,
          })
          .select()
          .single();

        if (error) {
          toast.error("Failed to add favorite");
          return;
        }
        setFavorites((prev) => [data as Favorite, ...prev]);
        toast.success(`Added ${itemName} to favorites`);
      }
    },
    [user, favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, loading, isFavorited, toggleFavorite, favoritedPlayerIds, favoritedTeamIds }}>
      {children}
    </FavoritesContext.Provider>
  );
};
