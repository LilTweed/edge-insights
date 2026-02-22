import type { Player } from "@/data/mockData";
import { Link } from "react-router-dom";

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const avg = player.seasonAverages;

  return (
    <Link
      to={`/player/${player.id}`}
      className="group block animate-fade-in rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            #{player.number}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{player.name}</p>
            <p className="text-xs text-muted-foreground">{player.teamAbbr} · {player.position}</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{player.stats.gamesPlayed} GP</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "PTS", value: avg.points },
          { label: "REB", value: avg.rebounds },
          { label: "AST", value: avg.assists },
          { label: "MIN", value: avg.minutes },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg bg-secondary/60 p-2 text-center">
            <p className="font-mono text-base font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] font-medium text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2">
        {[
          { label: "FG%", value: avg.fgPct },
          { label: "3P%", value: avg.threePct },
          { label: "FT%", value: avg.ftPct },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-mono text-xs font-semibold text-foreground">{stat.value}%</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </Link>
  );
};

export default PlayerCard;
