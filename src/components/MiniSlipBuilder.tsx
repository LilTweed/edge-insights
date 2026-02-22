import React, { useState, useEffect } from "react";
import { type PropLine, formatOdds } from "@/data/mockData";
import { X, Star, Wrench, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SlipLeg {
  id: string;
  prop: PropLine;
  side: "over" | "under";
}

const impliedProb = (odds: number) =>
  odds < 0 ? (-odds / (-odds + 100)) * 100 : (100 / (odds + 100)) * 100;

const getEdge = (prop: PropLine, side: "over" | "under") => {
  const best =
    side === "over"
      ? prop.sportsbooks.reduce((a, b) => (b.over > a.over ? b : a))
      : prop.sportsbooks.reduce((a, b) => (b.under > a.under ? b : a));
  const odds = side === "over" ? best.over : best.under;
  const ip = impliedProb(odds);
  return side === "over" ? prop.hitRate - ip : 100 - prop.hitRate - ip;
};

interface MiniSlipBuilderProps {
  props: PropLine[];
}

const MiniSlipBuilder = ({ props }: MiniSlipBuilderProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [slip, setSlip] = useState<SlipLeg[]>([]);

  // Listen for add-to-slip events from PropCard
  useEffect(() => {
    const handler = (e: Event) => {
      const { prop, side } = (e as CustomEvent).detail as { prop: PropLine; side: "over" | "under" };
      setSlip((prev) => {
        if (prev.find((l) => l.prop.id === prop.id)) return prev;
        return [...prev, { id: `${prop.id}-${side}`, prop, side }];
      });
      setOpen(true);
    };
    window.addEventListener("lvrg-add-to-slip", handler);
    return () => window.removeEventListener("lvrg-add-to-slip", handler);
  }, []);

  const addToSlip = (prop: PropLine, side: "over" | "under") => {
    if (slip.find((l) => l.prop.id === prop.id)) return;
    setSlip((prev) => [...prev, { id: `${prop.id}-${side}`, prop, side }]);
  };

  const removeFromSlip = (id: string) =>
    setSlip((prev) => prev.filter((l) => l.id !== id));

  // Top 5 value suggestions from visible props
  const suggestions = props
    .filter((p) => !slip.some((l) => l.prop.id === p.id))
    .map((p) => {
      const oe = getEdge(p, "over");
      const ue = getEdge(p, "under");
      return {
        prop: p,
        side: (oe >= ue ? "over" : "under") as "over" | "under",
        edge: Math.max(oe, ue),
      };
    })
    .filter((s) => s.edge > 0)
    .sort((a, b) => b.edge - a.edge)
    .slice(0, 3);

  return (
    <>
      {/* Toggle tab */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-0 top-1/2 z-40 -translate-y-1/2 rounded-l-lg border border-r-0 border-border bg-card px-1.5 py-4 shadow-lg hover:bg-secondary transition-colors"
        aria-label={open ? "Close slip builder" : "Open slip builder"}
      >
        <div className="flex flex-col items-center gap-1">
          {open ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          <Wrench size={14} className="text-primary" />
          {slip.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {slip.length}
            </span>
          )}
        </div>
      </button>

      {/* Slide-out panel */}
      <div
        className={`fixed right-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-80 border-l border-border bg-card shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Wrench size={14} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">Quick Slip</h3>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {slip.length} leg{slip.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && slip.length === 0 && (
            <div className="border-b border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Star size={10} className="text-primary" />
                <span className="text-[10px] font-bold text-primary">
                  Top Value Picks
                </span>
              </div>
              <div className="space-y-1">
                {suggestions.map(({ prop, side, edge }) => {
                  const best =
                    side === "over"
                      ? prop.sportsbooks.reduce((a, b) =>
                          b.over > a.over ? b : a
                        )
                      : prop.sportsbooks.reduce((a, b) =>
                          b.under > a.under ? b : a
                        );
                  const odds = side === "over" ? best.over : best.under;
                  return (
                    <button
                      key={prop.id}
                      onClick={() => addToSlip(prop, side)}
                      className="flex w-full items-center justify-between rounded-lg border border-primary/20 bg-card p-2 text-left hover:border-primary/40 transition-colors"
                    >
                      <div>
                        <span className="text-[10px] font-semibold text-foreground">
                          {prop.playerName}
                        </span>
                        <span className="ml-1.5 text-[9px] text-muted-foreground">
                          {prop.stat} {side === "over" ? "O" : "U"} {prop.line}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-primary/10 px-1 py-0.5 text-[8px] font-bold text-primary">
                          +{edge.toFixed(1)}%
                        </span>
                        <span className="font-mono text-[9px] font-bold text-foreground">
                          {formatOdds(odds)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Slip legs */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {slip.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <Wrench size={20} className="text-muted-foreground/40" />
                <p className="text-[11px] text-muted-foreground">
                  Click O/U on any prop card below to add legs, or use the suggestions above
                </p>
              </div>
            )}
            {slip.map((leg) => {
              const bestBook =
                leg.side === "over"
                  ? leg.prop.sportsbooks.reduce((a, b) =>
                      b.over > a.over ? b : a
                    )
                  : leg.prop.sportsbooks.reduce((a, b) =>
                      b.under > a.under ? b : a
                    );
              const odds =
                leg.side === "over" ? bestBook.over : bestBook.under;
              const edge = getEdge(leg.prop, leg.side);
              return (
                <div
                  key={leg.id}
                  className="rounded-lg border border-border bg-secondary/40 p-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-foreground">
                        {leg.prop.playerName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {leg.prop.stat} —{" "}
                        {leg.side === "over" ? "Over" : "Under"}{" "}
                        {leg.prop.line}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-primary">
                          {formatOdds(odds)} ({bestBook.sportsbook})
                        </span>
                        {edge > 0 && (
                          <span className="rounded bg-primary/10 px-1 py-0.5 text-[8px] font-bold text-primary">
                            +{edge.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromSlip(leg.id)}
                      className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {slip.length > 0 && (
            <div className="border-t border-border p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Total Legs</span>
                <span className="font-bold text-foreground">{slip.length}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Avg Edge</span>
                <span className="font-bold text-primary">
                  +
                  {(
                    slip.reduce(
                      (sum, l) => sum + Math.max(0, getEdge(l.prop, l.side)),
                      0
                    ) / slip.length
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <button
                onClick={() => {
                  const slipText = slip
                    .map((l) => {
                      const best =
                        l.side === "over"
                          ? l.prop.sportsbooks.reduce((a, b) =>
                              b.over > a.over ? b : a
                            )
                          : l.prop.sportsbooks.reduce((a, b) =>
                              b.under > a.under ? b : a
                            );
                      return `${l.prop.playerName} ${l.prop.stat} ${l.side === "over" ? "Over" : "Under"} ${l.prop.line} (Best: ${formatOdds(l.side === "over" ? best.over : best.under)} @ ${best.sportsbook}, Edge: ${getEdge(l.prop, l.side).toFixed(1)}%)`;
                    })
                    .join("\n");
                  navigate(
                    `/ai-chat?slip=${encodeURIComponent(slipText)}`
                  );
                }}
                className="w-full rounded-lg bg-primary py-2 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                🤖 Analyze with AI
              </button>
              <button
                onClick={() => setSlip([])}
                className="w-full rounded-lg border border-border py-1.5 text-[10px] font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                Clear Slip
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MiniSlipBuilder;
