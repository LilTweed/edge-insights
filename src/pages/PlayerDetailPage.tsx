import { useParams, Link } from "react-router-dom";
import { getPlayer, getPropsForPlayer } from "@/data/mockData";
import PropCard from "@/components/PropCard";

const PlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const player = getPlayer(id || "");
  const props = getPropsForPlayer(id || "");

  if (!player) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Player not found</p>
        <Link to="/players" className="mt-2 inline-block text-sm text-primary underline">
          Back to players
        </Link>
      </div>
    );
  }

  const avg = player.seasonAverages;
  const l10 = player.last10;
  const l5 = player.last5;

  const statRows = [
    { label: "Points", season: avg.points, last10: l10.points, last5: l5.points },
    { label: "Rebounds", season: avg.rebounds, last10: l10.rebounds, last5: l5.rebounds },
    { label: "Assists", season: avg.assists, last10: l10.assists, last5: l5.assists },
    { label: "Steals", season: avg.steals, last10: l10.steals, last5: l5.steals },
    { label: "Blocks", season: avg.blocks, last10: l10.blocks, last5: l5.blocks },
    { label: "Turnovers", season: avg.turnovers, last10: l10.turnovers, last5: l5.turnovers },
    { label: "Minutes", season: avg.minutes, last10: l10.minutes, last5: l5.minutes },
    { label: "FG%", season: avg.fgPct, last10: l10.fgPct, last5: l5.fgPct },
    { label: "3P%", season: avg.threePct, last10: l10.threePct, last5: l5.threePct },
    { label: "FT%", season: avg.ftPct, last10: l10.ftPct, last5: l5.ftPct },
  ];

  return (
    <div className="container py-6">
      <Link to="/players" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Players
      </Link>

      {/* Player Header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
          #{player.number}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{player.name}</h1>
          <p className="text-sm text-muted-foreground">
            {player.teamAbbr} · {player.position} · {player.stats.gamesPlayed} GP
          </p>
        </div>
      </div>

      {/* Stats Table */}
      <div className="mb-8 overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Stat</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Season</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Last 10</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Last 5</th>
              </tr>
            </thead>
            <tbody>
              {statRows.map((row) => (
                <tr key={row.label} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-xs font-medium text-foreground">{row.label}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{row.season}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{row.last10}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{row.last5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player Props */}
      {props.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-bold text-foreground">Available Props</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {props.map((prop) => (
              <PropCard key={prop.id} prop={prop} showPlayer={false} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerDetailPage;
