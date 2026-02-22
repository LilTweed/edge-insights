import { useState } from "react";
import { allTeams, type Sport } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavoriteTeams } from "@/hooks/useFavoriteTeams";

const TeamsPage = () => {
  const [sport, setSport] = useState<Sport>("NCAAB");
  const [search, setSearch] = useState("");
  const { toggle, isFavorite } = useFavoriteTeams();

  const filtered = allTeams
    .filter(t => t.sport === sport)
    .filter(t =>
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.abbreviation.toLowerCase().includes(search.toLowerCase())
    );

  // Sort favorites first
  const sorted = [...filtered].sort((a, b) => {
    const aFav = isFavorite(a.id) ? 0 : 1;
    const bFav = isFavorite(b.id) ? 0 : 1;
    return aFav - bFav;
  });

  // Group by conference
  const byConference = sorted.reduce<Record<string, typeof sorted>>((acc, team) => {
    if (!acc[team.conference]) acc[team.conference] = [];
    acc[team.conference].push(team);
    return acc;
  }, {});

  // Put conferences with favorites first
  const confEntries = Object.entries(byConference).sort(([, a], [, b]) => {
    const aHasFav = a.some(t => isFavorite(t.id)) ? 0 : 1;
    const bHasFav = b.some(t => isFavorite(t.id)) ? 0 : 1;
    return aHasFav - bHasFav;
  });

  const statColumns = (s: Sport) => {
    if (s === "NCAAF" || s === "NFL") {
      return (t: typeof allTeams[0]) => [
        { label: "PPG", value: t.stats?.ppg },
        { label: "YPG", value: t.stats?.ypg },
        { label: "OPP PPG", value: t.stats?.oppPpg },
        { label: "TO", value: t.stats?.takeaways },
      ];
    }
    if (s === "MLB") {
      return (t: typeof allTeams[0]) => [
        { label: "R/G", value: t.stats?.ppg },
        { label: "OPP R/G", value: t.stats?.oppPpg },
      ];
    }
    if (s === "NHL") {
      return (t: typeof allTeams[0]) => [
        { label: "G/G", value: t.stats?.ppg },
        { label: "GA/G", value: t.stats?.oppPpg },
      ];
    }
    return (t: typeof allTeams[0]) => [
      { label: "PPG", value: t.stats?.ppg },
      { label: "OPP", value: t.stats?.oppPpg },
      { label: "FG%", value: t.stats?.fgPct },
      { label: "3P%", value: t.stats?.threePct },
    ];
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Teams</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Team stats, records, and rankings by conference. Tap ❤️ to favorite.
        </p>
      </div>

      <div className="mb-4">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-border bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {confEntries.map(([conf, teams]) => (
        <div key={conf} className="mb-6">
          <h2 className="mb-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">{conf}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
              const fav = isFavorite(team.id);
              const getStats = statColumns(sport);
              const stats = team.stats ? getStats(team) : [];

              return (
                <div key={team.id} className="group relative animate-fade-in rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm">
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(team.id); }}
                    className="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-colors hover:bg-secondary"
                    aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      size={18}
                      className={fav ? "fill-red-500 text-red-500" : "text-muted-foreground"}
                    />
                  </button>
                  <Link to={`/team/${team.id}`}>
                    <div className="mb-3 flex items-center gap-2.5 pr-8">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-primary-foreground">
                        {team.abbreviation}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {team.ranking ? `#${team.ranking} ` : ""}{team.city} {team.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{team.record} · {team.conference}</p>
                      </div>
                    </div>
                    {stats.length > 0 && (
                      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)` }}>
                        {stats.filter(s => s.value != null).map(s => (
                          <div key={s.label} className="rounded-lg bg-secondary/60 p-1.5 text-center">
                            <p className="font-mono text-sm font-bold text-foreground">{s.value}</p>
                            <p className="text-[9px] font-medium text-muted-foreground">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsPage;
