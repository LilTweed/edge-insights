import { Link } from "react-router-dom";
import type { EspnRosterPlayer, EspnSport } from "@/hooks/useEspnData";

interface EspnPlayerCardProps {
  player: EspnRosterPlayer;
  sport: EspnSport;
  teamName?: string;
  teamAbbr?: string;
}

const EspnPlayerCard = ({ player, sport, teamName, teamAbbr }: EspnPlayerCardProps) => {
  return (
    <Link
      to={`/player/${player.id}?sport=${sport}&team=${teamAbbr || ''}`}
      className="group block animate-slide-up rounded-2xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-center gap-3.5">
        {player.headshot ? (
          <img
            src={player.headshot}
            alt={player.name}
            className="h-12 w-12 rounded-xl bg-secondary object-cover ring-1 ring-border/40"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-display text-xs font-bold text-primary-foreground">
            #{player.number || '—'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{player.name}</p>
          <p className="text-2xs text-muted-foreground">
            {teamAbbr || ''} · {player.position} {player.number ? `· #${player.number}` : ''}
          </p>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-2">
        {player.experience > 0 && (
          <div className="rounded-xl bg-secondary/50 p-2 text-center">
            <p className="font-mono text-xs font-bold text-foreground">{player.experience}</p>
            <p className="text-2xs font-medium text-muted-foreground">YRS</p>
          </div>
        )}
        {player.age > 0 && (
          <div className="rounded-xl bg-secondary/50 p-2 text-center">
            <p className="font-mono text-xs font-bold text-foreground">{player.age}</p>
            <p className="text-2xs font-medium text-muted-foreground">AGE</p>
          </div>
        )}
        {player.height && (
          <div className="rounded-xl bg-secondary/50 p-2 text-center">
            <p className="font-mono text-xs font-bold text-foreground">{player.height}</p>
            <p className="text-2xs font-medium text-muted-foreground">HT</p>
          </div>
        )}
      </div>

      {player.college && (
        <p className="mt-2.5 text-2xs text-muted-foreground truncate">🎓 {player.college}</p>
      )}
    </Link>
  );
};

export default EspnPlayerCard;
