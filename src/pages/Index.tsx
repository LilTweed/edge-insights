import { useState } from "react";
import { allGames, type Sport } from "@/data/mockData";
import GameCard from "@/components/GameCard";
import SportFilter from "@/components/SportFilter";

const GamesPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const filtered = allGames.filter(g => g.sport === sport);

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Today's Games</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Moneylines, spreads, and totals across all major sportsbooks
        </p>
      </div>
      <div className="mb-5">
        <SportFilter active={sport} onChange={setSport} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 text-center text-sm text-muted-foreground py-12">No games scheduled</p>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
