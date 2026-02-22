import { useState } from "react";
import { allTeams, type Sport } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import { Link } from "react-router-dom";

const TeamsPage = () => {
  const [sport, setSport] = useState<Sport>("NCAAB");
  const [search, setSearch] = useState("");

  const filtered = allTeams
    .filter(t => t.sport === sport)
    .filter(t =>
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.abbreviation.toLowerCase().includes(search.toLowerCase())
    );

  // Group by conference
  const byConference = filtered.reduce<Record<string, typeof filtered>>((acc, team) => {
    if (!acc[team.conference]) acc[team.conference] = [];
    acc[team.conference].push(team);
    return acc;
  }, {});

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Teams</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Team stats, records, and rankings by conference
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

      {Object.entries(byConference).map(([conf, teams]) => (
        <div key={conf} className="mb-6">
          <h2 className="mb-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">{conf}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Link
                key={team.id}
                to={`/team/${team.id}`}
                className="group animate-fade-in rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
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
                </div>
                {team.stats && (
                  <div className="grid grid-cols-4 gap-2">
                    {sport === "NCAAF" ? (
                      <>
                        {[
                          { label: "PPG", value: team.stats.ppg },
                          { label: "YPG", value: team.stats.ypg },
                          { label: "OPP PPG", value: team.stats.oppPpg },
                          { label: "TO", value: team.stats.takeaways },
                        ].map(s => (
                          <div key={s.label} className="rounded-lg bg-secondary/60 p-1.5 text-center">
                            <p className="font-mono text-sm font-bold text-foreground">{s.value}</p>
                            <p className="text-[9px] font-medium text-muted-foreground">{s.label}</p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {[
                          { label: "PPG", value: team.stats.ppg },
                          { label: "OPP", value: team.stats.oppPpg },
                          { label: "FG%", value: team.stats.fgPct },
                          { label: "3P%", value: team.stats.threePct },
                        ].map(s => (
                          <div key={s.label} className="rounded-lg bg-secondary/60 p-1.5 text-center">
                            <p className="font-mono text-sm font-bold text-foreground">{s.value}</p>
                            <p className="text-[9px] font-medium text-muted-foreground">{s.label}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsPage;
