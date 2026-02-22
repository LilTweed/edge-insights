import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface NFLGame {
  id: string;
  status: string;
  scheduled: string;
  home: { name: string; alias: string; id: string };
  away: { name: string; alias: string; id: string };
  venue?: { name: string; city: string; state: string };
  broadcast?: { network: string };
  home_points?: number;
  away_points?: number;
}

const SportsRadarTestPage = () => {
  const [games, setGames] = useState<NFLGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawJson, setRawJson] = useState<string | null>(null);

  const fetchNFLSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("sportradar-proxy", {
        body: { path: "nfl/official/trial/v7/en/games/2025/REG/01/schedule.json" },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setRawJson(JSON.stringify(data, null, 2).slice(0, 3000));
      const weekGames: NFLGame[] = data?.week?.games || data?.games || [];
      // Map scoring into top-level fields
      const mapped = weekGames.map((g: any) => ({
        ...g,
        away_points: g.scoring?.away_points ?? g.away_points ?? null,
        home_points: g.scoring?.home_points ?? g.home_points ?? null,
      }));
      setGames(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">SportsRadar Test</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fetch NFL schedule data via the <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">sportradar-proxy</code> edge function
        </p>
      </div>

      <Button onClick={fetchNFLSchedule} disabled={loading} className="mb-6">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Fetching…
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Fetch NFL Week 1 Schedule
          </>
        )}
      </Button>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {games.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Away</TableHead>
                <TableHead>Home</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Broadcast</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        game.status === "closed"
                          ? "bg-muted text-muted-foreground"
                          : game.status === "inprogress"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {game.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{game.away?.alias || game.away?.name}</TableCell>
                  <TableCell className="font-medium">{game.home?.alias || game.home?.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {game.scheduled
                      ? new Date(game.scheduled).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {game.venue?.name || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {game.broadcast?.network || "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {game.away_points != null && game.home_points != null
                      ? `${game.away_points} - ${game.home_points}`
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {games.length === 0 && !loading && !error && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Click the button above to fetch NFL schedule data
        </p>
      )}

      {rawJson && (
        <details className="mt-6">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
            Raw JSON (first 3000 chars)
          </summary>
          <pre className="mt-2 max-h-80 overflow-auto rounded-lg border border-border bg-secondary/50 p-4 text-[10px] font-mono text-muted-foreground">
            {rawJson}
          </pre>
        </details>
      )}
    </div>
  );
};

export default SportsRadarTestPage;
