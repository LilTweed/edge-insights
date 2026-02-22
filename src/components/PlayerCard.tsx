import type { Player, Sport } from "@/data/mockData";
import { Link } from "react-router-dom";

interface PlayerCardProps {
  player: Player;
}

const getStatsForSport = (player: Player) => {
  const avg = player.seasonAverages;
  const sport = player.sport;

  if (sport === "NFL") {
    const pos = player.position;
    if (pos === "QB") {
      return {
        primary: [
          { label: "CMP%", value: avg.fgPct },
          { label: "PASS YD", value: avg.points },
          { label: "TDs", value: avg.assists },
          { label: "INT", value: avg.turnovers },
        ],
        secondary: [
          { label: "RUSH YD", value: avg.rebounds },
          { label: "QBR", value: avg.ftPct },
        ],
      };
    }
    if (pos === "RB") {
      return {
        primary: [
          { label: "RUSH YD", value: avg.points },
          { label: "TDs", value: avg.assists },
          { label: "REC", value: avg.rebounds },
          { label: "YPC", value: avg.fgPct },
        ],
        secondary: [
          { label: "REC YD", value: avg.steals },
          { label: "FUM", value: avg.turnovers },
        ],
      };
    }
    if (pos === "WR" || pos === "TE") {
      return {
        primary: [
          { label: "REC", value: avg.points },
          { label: "REC YD", value: avg.rebounds },
          { label: "TDs", value: avg.assists },
          { label: "TGT", value: avg.steals },
        ],
        secondary: [
          { label: "YPR", value: avg.fgPct },
          { label: "FUM", value: avg.turnovers },
        ],
      };
    }
    return {
      primary: [
        { label: "TACKLES", value: avg.points },
        { label: "SACKS", value: avg.rebounds },
        { label: "INT", value: avg.assists },
        { label: "FF", value: avg.steals },
      ],
      secondary: [],
    };
  }

  if (sport === "MLB") {
    if (player.position === "SP" || player.position === "RP" || player.position === "P") {
      return {
        primary: [
          { label: "ERA", value: avg.points },
          { label: "K", value: avg.rebounds },
          { label: "W-L", value: avg.assists },
          { label: "WHIP", value: avg.fgPct },
        ],
        secondary: [
          { label: "IP", value: avg.minutes },
          { label: "K/9", value: avg.threePct },
        ],
      };
    }
    return {
      primary: [
        { label: "AVG", value: `.${Math.round(avg.fgPct * 10)}` },
        { label: "HR", value: avg.points },
        { label: "RBI", value: avg.rebounds },
        { label: "OPS", value: avg.threePct },
      ],
      secondary: [
        { label: "H", value: avg.assists },
        { label: "SB", value: avg.steals },
        { label: "BB", value: avg.blocks },
      ],
    };
  }

  if (sport === "NHL") {
    if (player.position === "G") {
      return {
        primary: [
          { label: "SV%", value: avg.fgPct },
          { label: "GAA", value: avg.points },
          { label: "W", value: avg.assists },
          { label: "SO", value: avg.steals },
        ],
        secondary: [],
      };
    }
    return {
      primary: [
        { label: "G", value: avg.points },
        { label: "A", value: avg.assists },
        { label: "PTS", value: avg.rebounds },
        { label: "+/-", value: avg.steals },
      ],
      secondary: [
        { label: "SOG", value: avg.blocks },
        { label: "PIM", value: avg.turnovers },
        { label: "TOI", value: `${avg.minutes}` },
      ],
    };
  }

  if (sport === "LOL" || sport === "CS2" || sport === "VAL") {
    if (sport === "CS2" || sport === "VAL") {
      return {
        primary: [
          { label: "K", value: avg.points },
          { label: "D", value: avg.rebounds },
          { label: "A", value: avg.assists },
          { label: "ADR", value: avg.steals },
        ],
        secondary: [
          { label: "K/D", value: avg.fgPct },
          { label: "HS%", value: `${avg.threePct}%` },
          { label: "Rating", value: avg.ftPct },
        ],
      };
    }
    return {
      primary: [
        { label: "K", value: avg.points },
        { label: "D", value: avg.rebounds },
        { label: "A", value: avg.assists },
        { label: "CS/M", value: avg.steals },
      ],
      secondary: [
        { label: "KDA", value: avg.fgPct },
        { label: "DPM", value: avg.blocks },
        { label: "VS%", value: `${avg.threePct}%` },
      ],
    };
  }

  // NBA / NCAAB / NCAAF default
  return {
    primary: [
      { label: "PTS", value: avg.points },
      { label: "REB", value: avg.rebounds },
      { label: "AST", value: avg.assists },
      { label: "MIN", value: avg.minutes },
    ],
    secondary: [
      { label: "FG%", value: `${avg.fgPct}%` },
      { label: "3P%", value: `${avg.threePct}%` },
      { label: "FT%", value: `${avg.ftPct}%` },
    ],
  };
};

const PlayerCard = ({ player }: PlayerCardProps) => {
  const { primary, secondary } = getStatsForSport(player);

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
            <p className="text-xs text-muted-foreground">
              {player.teamAbbr} · {player.position}
            </p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{player.stats.gamesPlayed} GP</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {primary.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-secondary/60 p-2 text-center">
            <p className="font-mono text-base font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] font-medium text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {secondary.length > 0 && (
        <div className={`mt-2.5 grid gap-2`} style={{ gridTemplateColumns: `repeat(${secondary.length}, 1fr)` }}>
          {secondary.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-xs font-semibold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
};

export default PlayerCard;
