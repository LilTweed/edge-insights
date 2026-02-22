import { games } from "@/data/mockData";
import GameCard from "@/components/GameCard";

const GamesPage = () => {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Today's Games</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Moneylines and totals across all major sportsbooks
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
