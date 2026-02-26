import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeGate from "@/components/UpgradeGate";
import {
  propLines, type Sport, type PropLine, type Sportsbook, formatOdds,
} from "@/data/mockData";
import { getPlayerProfile } from "@/data/playerProfiles";
import SportFilter from "@/components/SportFilter";
import {
  Search, X, ChevronDown, ChevronUp, BookOpen, Wrench, Trophy, DollarSign, CheckCircle, Copy, Share2, Filter,
} from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";

interface SlipLeg {
  id: string;
  prop: PropLine;
  side: "over" | "under";
}

const ALL_BOOKS: Sportsbook[] = ["FanDuel", "DraftKings", "BetMGM", "Bovada", "Fanatics"];
const BOOK_SHORT: Record<Sportsbook, string> = {
  FanDuel: "FD", DraftKings: "DK", BetMGM: "MGM", Bovada: "BOV", Fanatics: "FAN",
};

const STAT_FILTERS = ["All", "Points", "Rebounds", "Assists", "3-Pointers", "Strikeouts", "Passing Yards", "Rushing Yards"] as const;

function getAllBookOdds(prop: PropLine): { sportsbook: Sportsbook; line: number; over: number; under: number }[] {
  const existing = new Map(prop.sportsbooks.map((sb) => [sb.sportsbook, sb]));
  return ALL_BOOKS.map((book, i) => {
    if (existing.has(book)) return existing.get(book)!;
    const base = prop.sportsbooks[0];
    const seed = (prop.id.charCodeAt(0) + i * 7) % 20;
    const lineVariation = i % 3 === 0 ? 0.5 : 0;
    const oddsVariation = (seed - 10) * 2;
    return {
      sportsbook: book,
      line: +(base.line + lineVariation).toFixed(1),
      over: base.over + oddsVariation,
      under: base.under - oddsVariation + (i % 2 === 0 ? -5 : 5),
    };
  });
}

const impliedProb = (odds: number) => odds < 0 ? (-odds / (-odds + 100)) * 100 : (100 / (odds + 100)) * 100;

function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) return Math.round((decimal - 1) * 100);
  return Math.round(-100 / (decimal - 1));
}

function americanToDecimal(odds: number): number {
  if (odds > 0) return 1 + odds / 100;
  return 1 + 100 / Math.abs(odds);
}

function getBestBook(allBooks: ReturnType<typeof getAllBookOdds>, side: "over" | "under") {
  return allBooks.reduce((best, sb) => {
    const current = side === "over" ? sb.over : sb.under;
    const bestVal = side === "over" ? best.over : best.under;
    return current > bestVal ? sb : best;
  });
}

const getEdge = (prop: PropLine, side: "over" | "under") => {
  const allBooks = getAllBookOdds(prop);
  const best = getBestBook(allBooks, side);
  const odds = side === "over" ? best.over : best.under;
  const ip = impliedProb(odds);
  return side === "over" ? prop.hitRate - ip : (100 - prop.hitRate) - ip;
};

export default function PropBuilderPage({ embedded, onLegCountChange }: { embedded?: boolean; onLegCountChange?: (count: number) => void } = {}) {
  const { tier, isAdvanced: hasAdvanced } = useSubscription();
  const [sport, setSport] = useState<Sport>("NBA");
  const [slip, setSlip] = useState<SlipLeg[]>([]);
  const [builderSearch, setBuilderSearch] = useState("");
  const [builderSort, setBuilderSort] = useState<"edge" | "hitRate" | "line">("edge");
  const [expandedProp, setExpandedProp] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [myBooks, setMyBooks] = useState<Set<Sportsbook>>(new Set(ALL_BOOKS));
  const [statFilter, setStatFilter] = useState<string>("All");
  const [animatingLeg, setAnimatingLeg] = useState<string | null>(null);
  const slipRef = useRef<HTMLDivElement>(null);

  const visibleBooks = ALL_BOOKS.filter((b) => myBooks.has(b));

  useEffect(() => {
    onLegCountChange?.(slip.length);
  }, [slip.length, onLegCountChange]);

  const availableProps = propLines
    .filter((p) => {
      if (p.sport !== sport) return false;
      if (statFilter !== "All" && !p.stat.toLowerCase().includes(statFilter.toLowerCase())) return false;
      if (builderSearch && !p.playerName.toLowerCase().includes(builderSearch.toLowerCase()) && !p.stat.toLowerCase().includes(builderSearch.toLowerCase()) && !p.teamAbbr.toLowerCase().includes(builderSearch.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (builderSort === "edge") return Math.max(getEdge(b, "over"), getEdge(b, "under")) - Math.max(getEdge(a, "over"), getEdge(a, "under"));
      if (builderSort === "hitRate") return Math.max(b.hitRate, 100 - b.hitRate) - Math.max(a.hitRate, 100 - a.hitRate);
      return b.line - a.line;
    });

  // Derive unique stat types from current sport props for filter pills
  const availableStatTypes = Array.from(new Set(propLines.filter((p) => p.sport === sport).map((p) => p.stat)));

  const addToSlip = useCallback((prop: PropLine, side: "over" | "under") => {
    if (slip.find((l) => l.prop.id === prop.id)) return;
    const legId = `${prop.id}-${side}`;
    setSlip((prev) => [...prev, { id: legId, prop, side }]);
    setAnimatingLeg(legId);
    setTimeout(() => setAnimatingLeg(null), 600);
  }, [slip]);

  const removeFromSlip = (id: string) => setSlip((prev) => prev.filter((l) => l.id !== id));

  const toggleBook = (book: Sportsbook) => {
    setMyBooks((prev) => {
      const next = new Set(prev);
      if (next.has(book)) { if (next.size > 1) next.delete(book); }
      else next.add(book);
      return next;
    });
  };

  const parlayLegs = slip.map((leg) => {
    const allBooks = getAllBookOdds(leg.prop).filter((sb) => myBooks.has(sb.sportsbook));
    const best = getBestBook(allBooks, leg.side);
    const odds = leg.side === "over" ? best.over : best.under;
    return { leg, bestBook: best, odds, decimal: americanToDecimal(odds), edge: getEdge(leg.prop, leg.side), allBooks };
  });

  const combinedDecimal = parlayLegs.reduce((acc, l) => acc * l.decimal, 1);
  const combinedAmerican = slip.length > 0 ? decimalToAmerican(combinedDecimal) : 0;
  const payout = Math.round(combinedDecimal * betAmount * 100) / 100;

  const copySlip = async () => {
    const slipText = parlayLegs.map(({ leg, bestBook, odds }, i) =>
      `Leg ${i + 1}: ${leg.prop.playerName} ${leg.prop.stat} ${leg.side === "over" ? "Over" : "Under"} ${leg.prop.line} — Best odds ${formatOdds(odds)} @ ${bestBook.sportsbook} (Edge: ${getEdge(leg.prop, leg.side).toFixed(1)}%)`
    ).join("\n") + `\n\nCombined parlay odds: ${formatOdds(combinedAmerican)}\n$${betAmount} bet pays $${payout.toFixed(2)}`;
    await navigator.clipboard.writeText(slipText);
    toast.success("Slip copied to clipboard!");
  };

  const shareSlip = async () => {
    if (!slipRef.current) return;
    try {
      const dataUrl = await toPng(slipRef.current, { backgroundColor: "#1a1a2e" });
      const link = document.createElement("a");
      link.download = "parlay-slip.png";
      link.href = dataUrl;
      link.click();
      toast.success("Slip screenshot downloaded!");
    } catch {
      await copySlip();
    }
  };

  if (!hasAdvanced) {
    return (
      <div className="container py-10">
        <UpgradeGate requiredTier="advanced" currentTier={tier} feature="Prop Builder">
          <div />
        </UpgradeGate>
      </div>
    );
  }

  return (
    <div className={`${embedded ? "" : "container py-4"} flex h-full flex-col`}>
      {!embedded && (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Wrench size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Prop Builder</h1>
              <p className="text-xs text-muted-foreground">Build your slip with odds comparison & data analysis</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* ─── Available Props ─── */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card/50">
          <div className="border-b border-border p-3 space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={builderSearch}
                onChange={(e) => setBuilderSearch(e.target.value)}
                placeholder="Search player, team, or stat…"
                className="w-full rounded-lg border border-border bg-card pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* Stat filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter size={10} className="text-muted-foreground" />
              {["All", ...availableStatTypes].map((stat) => (
                <button
                  key={stat}
                  onClick={() => setStatFilter(stat)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                    statFilter === stat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">Sort:</span>
              {([["edge", "Best Edge"], ["hitRate", "Hit Rate"], ["line", "Line"]] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setBuilderSort(key)}
                  className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                    builderSort === key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
              <span className="ml-auto text-[10px] text-muted-foreground">{availableProps.length} props</span>
            </div>
          </div>

          {/* Props list — no auto-suggestions section */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {availableProps.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">No props for {sport}{statFilter !== "All" ? ` (${statFilter})` : ""}</p>
            )}
            {availableProps.map((prop) => {
              const allBooks = getAllBookOdds(prop);
              const bestOver = getBestBook(allBooks, "over");
              const bestUnder = getBestBook(allBooks, "under");
              const overEdge = getEdge(prop, "over");
              const underEdge = getEdge(prop, "under");
              const inSlip = slip.some((l) => l.prop.id === prop.id);
              const isExpanded = expandedProp === prop.id;
              const profile = getPlayerProfile(prop.playerId);
              const bestSide = overEdge >= underEdge ? "over" : "under";
              const bestBookForBadge = bestSide === "over" ? bestOver : bestUnder;

              return (
                <div key={prop.id} className={`rounded-lg border transition-colors ${inSlip ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card hover:border-border"}`}>
                  <div className="p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {profile && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs">{profile.avatarEmoji}</span>
                        )}
                        <span className="text-xs font-semibold text-foreground">{prop.playerName}</span>
                        <span className="text-[10px] text-muted-foreground">{prop.teamAbbr} · {prop.stat}</span>
                        {Math.max(overEdge, underEdge) > 5 && (
                          <span className="rounded bg-primary/10 px-1 py-0.5 text-[8px] font-bold text-primary">🔥 VALUE</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400">
                          <Trophy size={8} />
                          Best: {BOOK_SHORT[bestBookForBadge.sportsbook]}
                        </span>
                        <span className="font-mono text-sm font-bold text-foreground">{prop.line}</span>
                        <button
                          onClick={() => setExpandedProp(isExpanded ? null : prop.id)}
                          className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span>{prop.hitRate}% szn</span>
                        <span>·</span>
                        <span>{prop.hitRateLast10}% L10</span>
                        {overEdge > 0 && <span className="text-primary">· O+{overEdge.toFixed(1)}%</span>}
                        {underEdge > 0 && <span className="text-primary">· U+{underEdge.toFixed(1)}%</span>}
                      </div>
                      <button
                        onClick={() => addToSlip(prop, "over")}
                        disabled={inSlip}
                        className={`rounded-md border px-2 py-1 text-[10px] font-bold transition-colors disabled:opacity-30 ${
                          overEdge > underEdge && overEdge > 0
                            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                            : "border-accent/30 bg-accent/10 text-accent-foreground hover:bg-accent/20"
                        }`}
                      >
                        O {formatOdds(bestOver.over)}
                      </button>
                      <button
                        onClick={() => addToSlip(prop, "under")}
                        disabled={inSlip}
                        className={`rounded-md border px-2 py-1 text-[10px] font-bold transition-colors disabled:opacity-30 ${
                          underEdge > overEdge && underEdge > 0
                            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                            : "border-accent/30 bg-accent/10 text-accent-foreground hover:bg-accent/20"
                        }`}
                      >
                        U {formatOdds(bestUnder.under)}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border/50 bg-secondary/30 px-2.5 py-2 space-y-1">
                      <div className="flex items-center gap-1 mb-1">
                        <BookOpen size={10} className="text-muted-foreground" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">All Sportsbook Lines</span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 gap-y-0.5 text-[10px]">
                        <span className="font-medium text-muted-foreground">Book</span>
                        <span className="font-medium text-muted-foreground text-right">Line</span>
                        <span className="font-medium text-muted-foreground text-right">Over</span>
                        <span className="font-medium text-muted-foreground text-right">Under</span>
                        {allBooks.map((sb) => {
                          const isBestOver = sb.sportsbook === bestOver.sportsbook;
                          const isBestUnder = sb.sportsbook === bestUnder.sportsbook;
                          return (
                            <React.Fragment key={sb.sportsbook}>
                              <span className="text-foreground font-medium">{sb.sportsbook}</span>
                              <span className={`text-right font-mono ${sb.line !== prop.line ? "text-primary font-bold" : "text-foreground"}`}>{sb.line}</span>
                              <span className={`text-right font-mono ${isBestOver ? "text-emerald-400 font-bold" : "text-foreground"}`}>
                                {isBestOver && "★ "}{formatOdds(sb.over)}
                              </span>
                              <span className={`text-right font-mono ${isBestUnder ? "text-emerald-400 font-bold" : "text-foreground"}`}>
                                {isBestUnder && "★ "}{formatOdds(sb.under)}
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-[9px] text-muted-foreground">
                        <span className="text-emerald-400">★ = Best odds</span>
                        {allBooks.some((sb) => sb.line !== prop.line) && <span>· Highlighted lines differ from consensus</span>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Bet Slip ─── */}
        <div className="flex w-80 shrink-0 flex-col rounded-xl border border-border bg-card">
          {/* My Books filter */}
          <div className="border-b border-border px-4 py-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">My Books</span>
            <div className="flex items-center gap-1 mt-1.5">
              {ALL_BOOKS.map((book) => (
                <button
                  key={book}
                  onClick={() => toggleBook(book)}
                  className={`rounded-md px-2 py-1 text-[9px] font-bold transition-colors ${
                    myBooks.has(book)
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-muted/30 text-muted-foreground border border-transparent hover:border-border"
                  }`}
                >
                  {BOOK_SHORT[book]}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">🎫 Your Slip</h3>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{slip.length} leg{slip.length !== 1 ? "s" : ""}</span>
          </div>

          <div ref={slipRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {slip.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <Wrench size={24} className="text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">Click Over/Under on any prop to add it to your slip</p>
              </div>
            )}

            {parlayLegs.map(({ leg, bestBook, odds, edge, allBooks }, i) => (
              <div
                key={leg.id}
                className={`rounded-lg border border-border bg-secondary/40 p-2.5 space-y-2 transition-all ${
                  animatingLeg === leg.id ? "animate-slide-in-right ring-2 ring-primary/50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[8px] font-bold text-primary">{i + 1}</span>
                      <p className="text-xs font-semibold text-foreground">{leg.prop.playerName}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground ml-5.5">{leg.prop.stat} — {leg.side === "over" ? "Over" : "Under"} {leg.prop.line}</p>
                  </div>
                  <button onClick={() => removeFromSlip(leg.id)} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <X size={14} />
                  </button>
                </div>

                {/* Sportsbook columns — only visible books, best highlighted green */}
                <div className={`grid gap-1`} style={{ gridTemplateColumns: `repeat(${visibleBooks.length}, 1fr)` }}>
                  {allBooks.filter((sb) => myBooks.has(sb.sportsbook)).map((sb) => {
                    const sbOdds = leg.side === "over" ? sb.over : sb.under;
                    const isBest = sb.sportsbook === bestBook.sportsbook;
                    return (
                      <div
                        key={sb.sportsbook}
                        className={`flex flex-col items-center rounded-md p-1.5 text-center transition-colors ${
                          isBest
                            ? "bg-emerald-500/20 border-2 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                            : "bg-muted/50 border border-transparent"
                        }`}
                      >
                        <span className={`text-[8px] font-bold ${isBest ? "text-emerald-400" : "text-muted-foreground"}`}>
                          {BOOK_SHORT[sb.sportsbook]}
                        </span>
                        <span className={`font-mono text-[9px] font-bold ${isBest ? "text-emerald-400" : "text-foreground"}`}>
                          {formatOdds(sbOdds)}
                        </span>
                        {isBest && <CheckCircle size={8} className="text-emerald-400 mt-0.5" />}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400">
                    <Trophy size={8} /> Best: {bestBook.sportsbook} {formatOdds(odds)}
                  </span>
                  {edge > 0 && (
                    <span className="rounded bg-primary/10 px-1 py-0.5 text-[8px] font-bold text-primary">+{edge.toFixed(1)}% edge</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ─── Parlay Summary Footer ─── */}
          {slip.length > 0 && (
            <div className="border-t border-border p-3 space-y-3">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Trophy size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Best Odds Parlay</span>
                </div>

                <div className="space-y-1">
                  {parlayLegs.map(({ leg, bestBook, odds }, i) => (
                    <div key={leg.id} className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground truncate max-w-[140px]">
                        Leg {i + 1} — {leg.prop.playerName} {leg.side === "over" ? "O" : "U"} {leg.prop.line}
                      </span>
                      <span className="font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {formatOdds(odds)} <span className="text-[8px] text-muted-foreground">({BOOK_SHORT[bestBook.sportsbook]})</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-emerald-500/20 pt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Combined Parlay Odds</span>
                    <span className="font-mono text-base font-black text-emerald-400">{formatOdds(combinedAmerican)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <DollarSign size={10} />
                      <span>$</span>
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                        className="w-16 rounded border border-border bg-secondary/50 px-1.5 py-0.5 text-[11px] font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-ring/30"
                        min={0}
                      />
                      <span>bet pays</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-foreground">${payout.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Avg Edge</span>
                <span className="font-bold text-primary">
                  +{(slip.reduce((sum, l) => sum + Math.max(0, getEdge(l.prop, l.side)), 0) / slip.length).toFixed(1)}%
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copySlip}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <Copy size={12} /> Copy Slip
                </button>
                <button
                  onClick={shareSlip}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Share2 size={12} /> Share
                </button>
              </div>

              <button
                onClick={() => setSlip([])}
                className="w-full rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                Clear Slip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
