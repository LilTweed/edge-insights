import { useParams, Link } from "react-router-dom";
import { games, getPropsForGame, formatOdds } from "@/data/mockData";
import PropCard from "@/components/PropCard";

const GameDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const game = games.find((g) => g.id === id);
  const props = getPropsForGame(id || "");

  if (!game) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Game not found</p>
        <Link to="/" className="mt-2 inline-block text-sm text-primary underline">
          Back to games
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Games
      </Link>

      {/* Game Header */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{game.date}</span>
          <span className="text-xs text-muted-foreground">{game.time}</span>
        </div>

        <div className="my-4 flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
              {game.awayTeam.abbreviation}
            </div>
            <p className="text-sm font-semibold text-foreground">{game.awayTeam.city}</p>
            <p className="text-xs font-bold text-foreground">{game.awayTeam.name}</p>
            <p className="text-[10px] text-muted-foreground">{game.awayTeam.record}</p>
          </div>

          <span className="text-lg font-bold text-muted-foreground">@</span>

          <div className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
              {game.homeTeam.abbreviation}
            </div>
            <p className="text-sm font-semibold text-foreground">{game.homeTeam.city}</p>
            <p className="text-xs font-bold text-foreground">{game.homeTeam.name}</p>
            <p className="text-[10px] text-muted-foreground">{game.homeTeam.record}</p>
          </div>
        </div>
      </div>

      {/* Moneylines by Book */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">Moneylines</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Book</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">{game.awayTeam.abbreviation}</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">{game.homeTeam.abbreviation}</th>
              </tr>
            </thead>
            <tbody>
              {game.moneyline.map((ml) => (
                <tr key={ml.sportsbook} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">{ml.sportsbook}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{formatOdds(ml.away)}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{formatOdds(ml.home)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Over/Under by Book */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-foreground">Over/Under</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Book</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Over</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Under</th>
              </tr>
            </thead>
            <tbody>
              {game.overUnder.map((ou) => (
                <tr key={ou.sportsbook} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">{ou.sportsbook}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{ou.total}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="line-badge-over">{formatOdds(ou.over)}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="line-badge-under">{formatOdds(ou.under)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player Props for this Game */}
      {props.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-bold text-foreground">Player Props</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {props.map((prop) => (
              <PropCard key={prop.id} prop={prop} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GameDetailPage;
