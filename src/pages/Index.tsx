import { useState } from "react";
import { allGames, type Sport } from "@/data/mockData";
import GameCard from "@/components/GameCard";
import SportFilter from "@/components/SportFilter";

import LiveGameCard from "@/components/LiveGameCard";
import { useUnifiedScoreboard } from "@/hooks/useUnifiedData";
import { RefreshCw } from "lucide-react";

const ESPN_SPORTS = ["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF", "UFC", "PGA"] as const;
type EspnSport = (typeof ESPN_SPORTS)[number];

const GamesPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const isEspnSport = ESPN_SPORTS.includes(sport as EspnSport);
  

  const {
    data: liveData,
    isLoading,
    isFetching,
    dataUpdatedAt,
  } = useUnifiedScoreboard(sport as EspnSport);

  // Fallback to mock data for esports
  const mockGames = allGames.filter((g) => g.sport === sport);

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Today's Games</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isEspnSport
              ? "Live scores & lines — auto-refreshes every 30s"
              : "Moneylines, spreads, and totals across all major sportsbooks"}
          </p>
        </div>
        {isEspnSport && dataUpdatedAt > 0 && (
          <div className="flex items-center gap-2.5">
            {isFetching && <RefreshCw size={12} className="animate-spin text-primary" />}
            <span className="text-2xs text-muted-foreground font-mono">
              {new Date(dataUpdatedAt).toLocaleTimeString()}
            </span>
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" title="Live" />
          </div>
        )}
      </div>

      <div className="mb-5">
        <SportFilter active={sport} onChange={setSport} />
      </div>


      {/* Live ESPN games */}
      {isEspnSport && (
        <>
          {isLoading && (
            <div className="flex flex-col items-center gap-2 py-16">
              <RefreshCw size={24} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading live {sport} scores…</p>
            </div>
          )}

          {!isLoading && liveData?.games && liveData.games.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {liveData.games.map((game) => (
                <LiveGameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          {!isLoading && liveData?.games && liveData.games.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-12">
              No {sport} games scheduled today
            </p>
          )}
        </>
      )}

      {/* Mock/esports games */}
      {!isEspnSport && (
        <div className="grid gap-4 sm:grid-cols-2">
          {mockGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
          {mockGames.length === 0 && (
            <p className="col-span-2 text-center text-sm text-muted-foreground py-12">
              No games scheduled
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GamesPage;
