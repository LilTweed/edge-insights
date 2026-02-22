import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Trophy, Users, Crosshair } from "lucide-react";

interface HltvTeam {
  rank: number;
  name: string;
  points: number;
  players?: string[];
}

interface HltvPlayer {
  name: string;
  team: string;
  rating: number;
  maps: number;
  kpr: number;
  dpr: number;
  kd: number;
  hsPct: number;
}

interface HltvMatch {
  team1: string;
  team2: string;
  event: string;
  date: string;
  format: string;
  score: string;
}

type Tab = "teams" | "players" | "matches";

const HltvStatsPanel = () => {
  const [tab, setTab] = useState<Tab>("teams");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<HltvTeam[] | null>(null);
  const [players, setPlayers] = useState<HltvPlayer[] | null>(null);
  const [matches, setMatches] = useState<HltvMatch[] | null>(null);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  const fetchData = async (type: Tab) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("hltv-scraper", {
        body: { type },
      });

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error || "Failed to fetch data");

      const result = data.data;

      // Handle different response shapes — data might be an array or an object with an array
      const normalize = (d: any): any[] => {
        if (Array.isArray(d)) return d;
        if (d && typeof d === "object") {
          // Look for the first array property
          const firstArr = Object.values(d).find(Array.isArray);
          if (firstArr) return firstArr as any[];
        }
        return [];
      };

      if (type === "teams") setTeams(normalize(result) as HltvTeam[]);
      if (type === "players") setPlayers(normalize(result) as HltvPlayer[]);
      if (type === "matches") setMatches(normalize(result) as HltvMatch[]);
      setLastFetched(data.scrapedAt);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const currentData = tab === "teams" ? teams : tab === "players" ? players : matches;

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Crosshair size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">HLTV CS2 Stats</h3>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">LIVE</span>
        </div>
        {lastFetched && (
          <span className="text-[9px] text-muted-foreground">
            Updated {new Date(lastFetched).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {([
          ["teams", "Rankings", Trophy],
          ["players", "Players", Users],
          ["matches", "Matches", Crosshair],
        ] as [Tab, string, any][]).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors ${
              tab === key
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {!currentData && !loading && !error && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Crosshair size={24} className="text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground text-center">
              Fetch live CS2 {tab} data from HLTV
            </p>
            <button
              onClick={() => fetchData(tab)}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Load {tab}
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-2 py-8">
            <RefreshCw size={20} className="animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Scraping HLTV…</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center">
            <p className="text-xs text-destructive">{error}</p>
            <button
              onClick={() => fetchData(tab)}
              className="mt-2 text-[10px] font-medium text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Teams table */}
        {tab === "teams" && teams && !loading && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">World Rankings</span>
              <button onClick={() => fetchData("teams")} className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw size={12} />
              </button>
            </div>
            {teams.map((team, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] font-bold text-muted-foreground w-5 text-right">
                    {team.rank || i + 1}
                  </span>
                  <span className="text-xs font-semibold text-foreground">{team.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {team.players && (
                    <span className="text-[9px] text-muted-foreground hidden sm:block">
                      {team.players.slice(0, 3).join(", ")}
                      {team.players.length > 3 && "…"}
                    </span>
                  )}
                  <span className="font-mono text-[11px] font-bold text-primary">
                    {team.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Players table */}
        {tab === "players" && players && !loading && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Top Players</span>
              <button onClick={() => fetchData("players")} className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw size={12} />
              </button>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 gap-y-0.5 text-[10px] px-3 mb-1">
              <span className="font-medium text-muted-foreground">Player</span>
              <span className="font-medium text-muted-foreground text-right">Rating</span>
              <span className="font-medium text-muted-foreground text-right">K/D</span>
              <span className="font-medium text-muted-foreground text-right">HS%</span>
            </div>
            {players.map((player, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 items-center rounded-lg bg-secondary/40 px-3 py-2">
                <div>
                  <span className="text-xs font-semibold text-foreground">{player.name}</span>
                  <span className="ml-1.5 text-[9px] text-muted-foreground">{player.team}</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-primary text-right">
                  {typeof player.rating === "number" ? player.rating.toFixed(2) : player.rating}
                </span>
                <span className="font-mono text-[11px] text-foreground text-right">
                  {typeof player.kd === "number" ? player.kd.toFixed(2) : player.kd}
                </span>
                <span className="font-mono text-[11px] text-foreground text-right">
                  {player.hsPct != null ? `${player.hsPct}%` : "–"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Matches */}
        {tab === "matches" && matches && !loading && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Upcoming / Recent</span>
              <button onClick={() => fetchData("matches")} className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw size={12} />
              </button>
            </div>
            {matches.map((match, i) => (
              <div key={i} className="rounded-lg bg-secondary/40 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{match.team1}</span>
                    <span className="text-[10px] text-muted-foreground">vs</span>
                    <span className="text-xs font-bold text-foreground">{match.team2}</span>
                  </div>
                  {match.score && (
                    <span className="font-mono text-[11px] font-bold text-primary">{match.score}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                  {match.event && <span>{match.event}</span>}
                  {match.format && <span>· {match.format}</span>}
                  {match.date && <span>· {match.date}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HltvStatsPanel;
