import React, { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeGate from "@/components/UpgradeGate";
import {
  propLines, type Sport, type PropLine, type Sportsbook, formatOdds,
} from "@/data/mockData";
import { getPlayerProfile } from "@/data/playerProfiles";
import SportFilter from "@/components/SportFilter";
import {
  Search, Star, X, ChevronDown, ChevronUp, BookOpen, Wrench, Trophy, DollarSign, CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SlipLeg {
  id: string;
  prop: PropLine;
  side: "over" | "under";
}

// All 5 sportsbooks we compare across
const ALL_BOOKS: Sportsbook[] = ["FanDuel", "DraftKings", "BetMGM", "Bovada", "Fanatics"];
const BOOK_SHORT: Record<Sportsbook, string> = {
  FanDuel: "FD", DraftKings: "DK", BetMGM: "MGM", Bovada: "BOV", Fanatics: "FAN",
};

// Generate mock odds for books not already in the prop's sportsbooks
function getAllBookOdds(prop: PropLine): { sportsbook: Sportsbook; line: number; over: number; under: number }[] {
  const existing = new Map(prop.sportsbooks.map((sb) => [sb.sportsbook, sb]));
  return ALL_BOOKS.map((book, i) => {
    if (existing.has(book)) return existing.get(book)!;
    // Generate realistic variation from first sportsbook
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

/** Convert decimal multiplier back to American odds */
function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) return Math.round((decimal - 1) * 100);
  return Math.round(-100 / (decimal - 1));
}

/** Convert American odds to decimal multiplier */
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

export default function PropBuilderPage({ embedded }: { embedded?: boolean } = {}) {
  const { tier, isAdvanced: hasAdvanced } = useSubscription();
  const navigate = useNavigate();
  const [sport, setSport] = useState<Sport>("NBA");
  const [slip, setSlip] = useState<SlipLeg[]>([]);
  const [builderSearch, setBuilderSearch] = useState("");
  const [builderSort, setBuilderSort] = useState<"edge" | "hitRate" | "line">("edge");
  const [expandedProp, setExpandedProp] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const availableProps = propLines
    .filter((p) => p.sport === sport && (builderSearch === "" || p.playerName.toLowerCase().includes(builderSearch.toLowerCase()) || p.stat.toLowerCase().includes(builderSearch.toLowerCase()) || p.teamAbbr.toLowerCase().includes(builderSearch.toLowerCase())))
    .sort((a, b) => {
      if (builderSort === "edge") return Math.max(getEdge(b, "over"), getEdge(b, "under")) - Math.max(getEdge(a, "over"), getEdge(a, "under"));
      if (builderSort === "hitRate") return Math.max(b.hitRate, 100 - b.hitRate) - Math.max(a.hitRate, 100 - a.hitRate);
      return b.line - a.line;
    });

  const suggestedProps = propLines
    .filter((p) => p.sport === sport && !slip.some((l) => l.prop.id === p.id))
    .map((p) => {
      const overEdge = getEdge(p, "over");
      const underEdge = getEdge(p, "under");
      return { prop: p, side: (overEdge >= underEdge ? "over" : "under") as "over" | "under", edge: Math.max(overEdge, underEdge) };
    })
    .filter((s) => s.edge > 0)
    .sort((a, b) => b.edge - a.edge)
    .slice(0, 5);

  const addToSlip = (prop: PropLine, side: "over" | "under") => {
    if (slip.find((l) => l.prop.id === prop.id)) return;
    setSlip((prev) => [...prev, { id: `${prop.id}-${side}`, prop, side }]);
  };

  const removeFromSlip = (id: string) => setSlip((prev) => prev.filter((l) => l.id !== id));

  // ─── Parlay calculator ───────────────────────────────────────
  const parlayLegs = slip.map((leg) => {
    const allBooks = getAllBookOdds(leg.prop);
    const best = getBestBook(allBooks, leg.side);
    const odds = leg.side === "over" ? best.over : best.under;
    return { leg, bestBook: best, odds, decimal: americanToDecimal(odds), edge: getEdge(leg.prop, leg.side) };
  });

  const combinedDecimal = parlayLegs.reduce((acc, l) => acc * l.decimal, 1);
  const combinedAmerican = slip.length > 0 ? decimalToAmerican(combinedDecimal) : 0;
  const mockBet = 100;
  const mockPayout = Math.round(combinedDecimal * mockBet * 100) / 100;

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
      {/* Header */}
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

          {/* Auto-suggestions */}
          {showSuggestions && suggestedProps.length > 0 && !builderSearch && (
            <div className="border-b border-primary/20 bg-primary/5 p-2.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-primary" />
                  <span className="text-[10px] font-bold text-primary">Auto-Suggested High Activity</span>
                </div>
                <button onClick={() => setShowSuggestions(false)} className="text-muted-foreground hover:text-foreground"><X size={12} /></button>
              </div>
              <div className="space-y-1">
                {suggestedProps.map(({ prop, side, edge }) => {
                  const allBooks = getAllBookOdds(prop);
                  const best = getBestBook(allBooks, side);
                  const odds = side === "over" ? best.over : best.under;
                  const inSlip = slip.some((l) => l.prop.id === prop.id);
                  return (
                    <button
                      key={prop.id}
                      onClick={() => !inSlip && addToSlip(prop, side)}
                      disabled={inSlip}
                      className={`flex w-full items-center justify-between rounded-lg border p-2 text-left transition-colors ${
                        inSlip ? "border-primary/30 bg-primary/10 opacity-50" : "border-primary/20 bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-foreground">{prop.playerName}</span>
                        <span className="text-[9px] text-muted-foreground">{prop.stat} {side === "over" ? "O" : "U"} {prop.line}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">+{edge.toFixed(1)}% edge</span>
                        <span className="font-mono text-[10px] font-bold text-foreground">{formatOdds(odds)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Props list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {availableProps.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">No props for {sport}</p>
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

              // Best odds badge — pick overall best side
              const bestSide = overEdge >= underEdge ? "over" : "under";
              const bestBookForBadge = bestSide === "over" ? bestOver : bestUnder;

              return (
                <div key={prop.id} className={`rounded-lg border transition-colors ${inSlip ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card hover:border-border"}`}>
                  <div className="p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {/* Player icon */}
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
                        {/* Best Odds Badge */}
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

                  {/* Expanded: all 5 sportsbooks side by side */}
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

        {/* ─── Bet Slip with Parlay Calculator ─── */}
        <div className="flex w-80 shrink-0 flex-col rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">🎫 Your Slip</h3>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{slip.length} leg{slip.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {slip.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <Wrench size={24} className="text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">Click Over/Under on any prop to add it to your slip</p>
                {suggestedProps.length > 0 && (
                  <button
                    onClick={() => { suggestedProps.slice(0, 3).forEach((s) => addToSlip(s.prop, s.side)); }}
                    className="mt-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-[10px] font-semibold text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Star size={12} className="inline mr-1" />
                    Auto-fill top 3 value props
                  </button>
                )}
              </div>
            )}

            {/* Slip legs with multi-book comparison */}
            {parlayLegs.map(({ leg, bestBook, odds, edge }, i) => {
              const allBooks = getAllBookOdds(leg.prop);
              return (
                <div key={leg.id} className="rounded-lg border border-border bg-secondary/40 p-2.5 space-y-2">
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

                  {/* All books for this leg */}
                  <div className="grid grid-cols-5 gap-1">
                    {allBooks.map((sb) => {
                      const sbOdds = leg.side === "over" ? sb.over : sb.under;
                      const isBest = sb.sportsbook === bestBook.sportsbook;
                      return (
                        <div
                          key={sb.sportsbook}
                          className={`flex flex-col items-center rounded-md p-1.5 text-center transition-colors ${
                            isBest
                              ? "bg-emerald-500/15 border border-emerald-500/30"
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
              );
            })}
          </div>

          {/* ─── Parlay Summary Footer ─── */}
          {slip.length > 0 && (
            <div className="border-t border-border p-3 space-y-3">
              {/* Combined parlay odds */}
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Trophy size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Best Odds Parlay</span>
                </div>

                {/* Per-leg breakdown */}
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
                      <span>${mockBet} bet pays</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-foreground">${mockPayout.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Avg Edge</span>
                <span className="font-bold text-primary">
                  +{(slip.reduce((sum, l) => sum + Math.max(0, getEdge(l.prop, l.side)), 0) / slip.length).toFixed(1)}%
                </span>
              </div>

              <button
                onClick={() => {
                  const slipText = parlayLegs.map(({ leg, bestBook, odds }, i) =>
                    `Leg ${i + 1}: ${leg.prop.playerName} ${leg.prop.stat} ${leg.side === "over" ? "Over" : "Under"} ${leg.prop.line} — Best odds ${formatOdds(odds)} @ ${bestBook.sportsbook} (Edge: ${getEdge(leg.prop, leg.side).toFixed(1)}%)`
                  ).join("\n") + `\n\nCombined parlay odds: ${formatOdds(combinedAmerican)}\n$${mockBet} bet pays $${mockPayout.toFixed(2)}`;
                  navigate(`/edge?slip=${encodeURIComponent(slipText)}`);
                }}
                className="w-full rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                🤖 Analyze with AI
              </button>
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
