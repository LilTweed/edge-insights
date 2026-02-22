import { useState, useMemo } from "react";
import type { PropLine, Sportsbook } from "@/data/mockData";
import { formatOdds } from "@/data/mockData";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  props: PropLine[];
}

const BOOKS: Sportsbook[] = ["FanDuel", "DraftKings", "Fanatics", "BetMGM", "Bovada"];
const BOOK_SHORT: Record<Sportsbook, string> = {
  FanDuel: "FD",
  DraftKings: "DK",
  Fanatics: "FAN",
  BetMGM: "MGM",
  Bovada: "BOV",
};

type SortCol = "player" | "stat" | "line" | Sportsbook;

const SportsbookComparisonWidget = ({ props }: Props) => {
  const [sortCol, setSortCol] = useState<SortCol>("player");
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = props;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.playerName.toLowerCase().includes(q) ||
          p.stat.toLowerCase().includes(q) ||
          p.teamAbbr.toLowerCase().includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      let diff = 0;
      if (sortCol === "player") diff = a.playerName.localeCompare(b.playerName);
      else if (sortCol === "stat") diff = a.stat.localeCompare(b.stat);
      else if (sortCol === "line") diff = a.line - b.line;
      else {
        const sbA = a.sportsbooks.find((s) => s.sportsbook === sortCol);
        const sbB = b.sportsbooks.find((s) => s.sportsbook === sortCol);
        diff = (sbA?.over ?? 0) - (sbB?.over ?? 0);
      }
      return sortAsc ? diff : -diff;
    });

    return list;
  }, [props, search, sortCol, sortAsc]);

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  // Find best over/under odds per prop
  const getBestOdds = (prop: PropLine) => {
    let bestOver = { book: "" as Sportsbook, odds: -Infinity };
    let bestUnder = { book: "" as Sportsbook, odds: -Infinity };
    for (const sb of prop.sportsbooks) {
      if (sb.over > bestOver.odds) bestOver = { book: sb.sportsbook, odds: sb.over };
      if (sb.under > bestUnder.odds) bestUnder = { book: sb.sportsbook, odds: sb.under };
    }
    return { bestOver, bestUnder };
  };

  // Line deviation indicator
  const getLineDeviation = (prop: PropLine, sb: { line: number }) => {
    const avg = prop.sportsbooks.reduce((s, b) => s + b.line, 0) / prop.sportsbooks.length;
    const diff = sb.line - avg;
    if (Math.abs(diff) < 0.25) return null;
    return diff > 0 ? "higher" : "lower";
  };

  const headerBtn = (label: string, col: SortCol) => (
    <button
      onClick={() => toggleSort(col)}
      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
        sortCol === col ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {sortCol === col && <ArrowUpDown className="h-2.5 w-2.5" />}
    </button>
  );

  if (props.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Line Comparison</h3>
          <p className="text-[10px] text-muted-foreground">
            Compare odds across FanDuel, DraftKings, Fanatics, BetMGM & Bovada
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter…"
          className="w-36 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/30"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-3 py-2.5 w-36">{headerBtn("Player", "player")}</th>
              <th className="px-3 py-2.5 w-24">{headerBtn("Stat", "stat")}</th>
              <th className="px-3 py-2.5 w-16 text-center">{headerBtn("Line", "line")}</th>
              {BOOKS.map((book) => (
                <th key={book} className="px-2 py-2.5 text-center min-w-[100px]">
                  {headerBtn(BOOK_SHORT[book], book)}
                </th>
              ))}
              <th className="px-3 py-2.5 w-20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Best
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.slice(0, 30).map((prop) => {
              const { bestOver, bestUnder } = getBestOdds(prop);
              return (
                <tr key={prop.id} className="hover:bg-secondary/20 transition-colors">
                  {/* Player */}
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] font-semibold text-foreground">{prop.playerName}</span>
                    <span className="ml-1.5 text-[9px] text-muted-foreground">{prop.teamAbbr}</span>
                  </td>
                  {/* Stat */}
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] text-muted-foreground">{prop.stat}</span>
                  </td>
                  {/* Consensus Line */}
                  <td className="px-3 py-2.5 text-center">
                    <span className="font-mono text-sm font-bold text-foreground">{prop.line}</span>
                  </td>
                  {/* Each book */}
                  {BOOKS.map((book) => {
                    const sb = prop.sportsbooks.find((s) => s.sportsbook === book);
                    if (!sb) {
                      return (
                        <td key={book} className="px-2 py-2.5 text-center">
                          <span className="text-[10px] text-muted-foreground">—</span>
                        </td>
                      );
                    }
                    const dev = getLineDeviation(prop, sb);
                    const isBestOver = bestOver.book === book;
                    const isBestUnder = bestUnder.book === book;
                    return (
                      <td key={book} className="px-2 py-2.5">
                        <div className="flex flex-col items-center gap-0.5">
                          {/* Line with deviation */}
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[11px] font-medium text-foreground">
                              {sb.line}
                            </span>
                            {dev === "higher" && <TrendingUp className="h-2.5 w-2.5 text-destructive/70" />}
                            {dev === "lower" && <TrendingDown className="h-2.5 w-2.5 text-success/70" />}
                          </div>
                          {/* Over / Under */}
                          <div className="flex items-center gap-1">
                            <span
                              className={`rounded px-1 py-0.5 font-mono text-[9px] font-semibold ${
                                isBestOver
                                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                                  : "text-muted-foreground"
                              }`}
                            >
                              O {formatOdds(sb.over)}
                            </span>
                            <span
                              className={`rounded px-1 py-0.5 font-mono text-[9px] font-semibold ${
                                isBestUnder
                                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                                  : "text-muted-foreground"
                              }`}
                            >
                              U {formatOdds(sb.under)}
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                  {/* Best value */}
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">
                        O {formatOdds(bestOver.odds)}
                      </span>
                      <span className="text-[8px] text-muted-foreground">{BOOK_SHORT[bestOver.book]}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">No props match your filter</p>
        )}
        {filtered.length > 30 && (
          <p className="border-t border-border py-2 text-center text-[10px] text-muted-foreground">
            Showing 30 of {filtered.length} props
          </p>
        )}
      </div>
    </div>
  );
};

export default SportsbookComparisonWidget;
