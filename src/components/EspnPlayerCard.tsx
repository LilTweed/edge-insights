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
      className="group block animate-fade-in rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        {player.headshot ? (
          <img
            src={player.headshot}
            alt={player.name}
            className="h-12 w-12 rounded-lg bg-secondary object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            #{player.number || '—'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{player.name}</p>
          <p className="text-xs text-muted-foreground">
            {teamAbbr || ''} · {player.position} {player.number ? `· #${player.number}` : ''}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {player.experience > 0 && (
          <div className="rounded-lg bg-secondary/60 p-1.5 text-center">
            <p className="font-mono text-xs font-bold text-foreground">{player.experience}</p>
            <p className="text-[9px] font-medium text-muted-foreground">YRS EXP</p>
          </div>
        )}
        {player.age > 0 && (
          <div className="rounded-lg bg-secondary/60 p-1.5 text-center">
            <p className="font-mono text-xs font-bold text-foreground">{player.age}</p>
            <p className="text-[9px] font-medium text-muted-foreground">AGE</p>
          </div>
        )}
        {player.height && (
          <div className="rounded-lg bg-secondary/60 p-1.5 text-center">
            <p className="font-mono text-xs font-bold text-foreground">{player.height}</p>
            <p className="text-[9px] font-medium text-muted-foreground">HT</p>
          </div>
        )}
      </div>

      {player.college && (
        <p className="mt-2 text-[10px] text-muted-foreground truncate">🎓 {player.college}</p>
      )}
    </Link>
  );
};

export default EspnPlayerCard;
