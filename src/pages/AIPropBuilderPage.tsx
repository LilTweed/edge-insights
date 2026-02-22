import { useState, useRef, useEffect } from "react";
import {
  propLines, allPlayers, allGames, allTeams, matchupHistories, injuries,
  type Sport, type Injury,
} from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import { Bot, Send, Loader2, Sparkles, TrendingUp, Layers, Zap, Shield } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const FUNC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-prop-builder`;

const quickPrompts = [
  { icon: TrendingUp, label: "Best value props today", prompt: "What are the best value props today? Find the ones with the highest hit rates and best odds discrepancies across sportsbooks." },
  { icon: Layers, label: "Build me a parlay", prompt: "Build me 3 parlay options: a safe 2-leg, a moderate 3-leg, and an aggressive 4+ leg parlay with the best expected value." },
  { icon: Sparkles, label: "Full analysis & picks", prompt: "Give me your top 5 picks today with full analysis, confidence levels, and reasoning for each one." },
];

// Build basic props context
function buildBasicContext(sport: Sport): string {
  const sportProps = propLines.filter((p) => p.sport === sport);
  if (!sportProps.length) return "";
  return sportProps
    .map(
      (p) =>
        `${p.playerName} (${p.teamAbbr}) - ${p.stat}: Line ${p.line} | Season HR: ${p.hitRate}% | L10 HR: ${p.hitRateLast10}% | Lines: ${p.sportsbooks.map((s) => `${s.sportsbook}: ${s.line} (O${s.over}/U${s.under})`).join(", ")}`
    )
    .join("\n");
}

// Build deep advanced context with injuries, H2H, full player/team stats
function buildAdvancedContext(sport: Sport): string {
  const sections: string[] = [];

  // 1. Props data
  const propsStr = buildBasicContext(sport);
  if (propsStr) sections.push(`=== PROP LINES ===\n${propsStr}`);

  // 2. Today's games with full team stats
  const sportGames = allGames.filter((g) => g.sport === sport);
  if (sportGames.length) {
    const gamesStr = sportGames.map((g) => {
      const home = g.homeTeam;
      const away = g.awayTeam;
      let line = `${away.city} ${away.name} (${away.record}) @ ${home.city} ${home.name} (${home.record}) — ${g.time}`;

      // Team stats comparison
      if (home.stats && away.stats) {
        const hs = home.stats;
        const as = away.stats;
        if (sport === "NFL" || sport === "NCAAF") {
          line += `\n  Home: PPG ${hs.ppg} | OPP PPG ${hs.oppPpg} | YPG ${hs.ypg || "N/A"} | Rush YPG ${hs.rushYpg || "N/A"} | Pass YPG ${hs.passYpg || "N/A"} | 3rd% ${hs.thirdDownPct || "N/A"} | RZ% ${hs.redZonePct || "N/A"} | Sacks ${hs.sacks || 0} | Takeaways ${hs.takeaways || 0}`;
          line += `\n  Away: PPG ${as.ppg} | OPP PPG ${as.oppPpg} | YPG ${as.ypg || "N/A"} | Rush YPG ${as.rushYpg || "N/A"} | Pass YPG ${as.passYpg || "N/A"} | 3rd% ${as.thirdDownPct || "N/A"} | RZ% ${as.redZonePct || "N/A"} | Sacks ${as.sacks || 0} | Takeaways ${as.takeaways || 0}`;
        } else {
          line += `\n  Home: PPG ${hs.ppg} | OPP PPG ${hs.oppPpg} | FG% ${hs.fgPct} | 3P% ${hs.threePct}`;
          line += `\n  Away: PPG ${as.ppg} | OPP PPG ${as.oppPpg} | FG% ${as.fgPct} | 3P% ${as.threePct}`;
        }
      }

      // Spread / ML / O-U best lines
      if (g.moneyline?.length) {
        const best = g.moneyline.reduce((a, b) => (b.home > a.home ? b : a));
        line += `\n  Best ML: ${best.sportsbook} Home ${best.home} / Away ${best.away}`;
      }
      if (g.spread?.length) {
        line += `\n  Spread: ${g.spread[0].home} (${g.spread[0].sportsbook})`;
      }
      if (g.overUnder?.length) {
        line += `\n  O/U: ${g.overUnder[0].total} (${g.overUnder[0].sportsbook})`;
      }

      return line;
    }).join("\n\n");
    sections.push(`=== TODAY'S GAMES ===\n${gamesStr}`);
  }

  // 3. Head-to-head matchup histories for today's games
  if (sportGames.length) {
    const h2hStr = sportGames.map((g) => {
      const h2h = matchupHistories.find(
        (m) =>
          (m.team1Id === g.homeTeam.id && m.team2Id === g.awayTeam.id) ||
          (m.team1Id === g.awayTeam.id && m.team2Id === g.homeTeam.id)
      );
      if (!h2h) return null;
      const t1 = allTeams.find((t) => t.id === h2h.team1Id);
      const t2 = allTeams.find((t) => t.id === h2h.team2Id);
      let str = `${t1?.name || h2h.team1Id} vs ${t2?.name || h2h.team2Id}`;
      str += `\n  All-time: ${h2h.allTime.wins}-${h2h.allTime.losses}`;
      str += ` | Last 10: ${h2h.last10.team1Wins}-${h2h.last10.team2Wins}`;
      str += ` | Last 5: ${h2h.last5.team1Wins}-${h2h.last5.team2Wins}`;
      str += ` | Streak: ${h2h.streak}`;
      str += ` | Avg Score: ${h2h.avgScore.team1}-${h2h.avgScore.team2}`;
      str += `\n  Last meeting: ${h2h.lastMeeting}`;
      if (h2h.last5.results?.length) {
        str += `\n  Recent results:`;
        h2h.last5.results.forEach((r) => {
          str += `\n    ${r.date}: ${r.team1Score}-${r.team2Score} (${r.location})`;
        });
      }
      return str;
    }).filter(Boolean).join("\n\n");
    if (h2hStr) sections.push(`=== HEAD-TO-HEAD HISTORY ===\n${h2hStr}`);
  }

  // 4. Full player stats (season, L10, L5) for players in today's games
  const gameTeamAbbrs = new Set(
    sportGames.flatMap((g) => [g.homeTeam.abbreviation, g.awayTeam.abbreviation])
  );
  const relevantPlayers = allPlayers.filter(
    (p) => p.sport === sport && gameTeamAbbrs.has(p.teamAbbr)
  );
  if (relevantPlayers.length) {
    const playersStr = relevantPlayers.map((p) => {
      const a = p.seasonAverages;
      const l = p.last10;
      const l5 = p.last5;
      let str = `${p.name} (${p.teamAbbr}, ${p.position}, #${p.number}) — ${p.stats.gamesPlayed} GP`;
      if (sport === "NBA" || sport === "NCAAB") {
        str += `\n  Season: ${a.points}pts ${a.rebounds}reb ${a.assists}ast ${a.steals}stl ${a.blocks}blk ${a.turnovers}to ${a.minutes}min | ${a.fgPct}FG% ${a.threePct}3P% ${a.ftPct}FT%`;
        str += `\n  Last10: ${l.points}pts ${l.rebounds}reb ${l.assists}ast ${l.steals}stl ${l.blocks}blk ${l.turnovers}to | ${l.fgPct}FG% ${l.threePct}3P% ${l.ftPct}FT%`;
        str += `\n  Last5:  ${l5.points}pts ${l5.rebounds}reb ${l5.assists}ast ${l5.steals}stl ${l5.blocks}blk ${l5.turnovers}to | ${l5.fgPct}FG% ${l5.threePct}3P% ${l5.ftPct}FT%`;
      } else if (sport === "NFL") {
        if (p.position === "QB") {
          str += `\n  Season: ${a.points}passYd/G ${a.assists}TDs/G ${a.fgPct}CMP% ${a.rebounds}rushYd/G ${a.turnovers}INT/G QBR:${a.ftPct}`;
          str += `\n  Last10: ${l.points}passYd/G ${l.assists}TDs/G ${l.fgPct}CMP% ${l.rebounds}rushYd/G ${l.turnovers}INT/G`;
          str += `\n  Last5:  ${l5.points}passYd/G ${l5.assists}TDs/G ${l5.fgPct}CMP% ${l5.rebounds}rushYd/G ${l5.turnovers}INT/G`;
        } else {
          str += `\n  Season: ${a.points}yd/G ${a.assists}TDs/G ${a.rebounds}rec/G`;
          str += `\n  Last10: ${l.points}yd/G ${l.assists}TDs/G ${l.rebounds}rec/G`;
        }
      } else {
        str += `\n  Season: PTS:${a.points} REB:${a.rebounds} AST:${a.assists} STL:${a.steals} BLK:${a.blocks} TO:${a.turnovers}`;
        str += `\n  Last10: PTS:${l.points} REB:${l.rebounds} AST:${l.assists}`;
      }
      return str;
    }).join("\n\n");
    sections.push(`=== PLAYER STATS (GAME-RELEVANT) ===\n${playersStr}`);
  }

  // 5. Injury report
  const sportTeamAbbrs = new Set(allTeams.filter((t) => t.sport === sport).map((t) => t.abbreviation));
  const sportInjuries = injuries.filter((inj) => sportTeamAbbrs.has(inj.teamAbbr));
  if (sportInjuries.length) {
    const injStr = sportInjuries
      .map((inj) => `${inj.player} (${inj.teamAbbr}) — ${inj.status}: ${inj.injury}${inj.returnDate ? ` | ETA: ${inj.returnDate}` : ""}`)
      .join("\n");
    sections.push(`=== INJURY REPORT ===\n${injStr}`);
  }

  // 6. Conference/division standings snapshot
  const sportTeams = allTeams.filter((t) => t.sport === sport);
  if (sportTeams.length) {
    const byConf = sportTeams.reduce<Record<string, typeof sportTeams>>((acc, t) => {
      if (!acc[t.conference]) acc[t.conference] = [];
      acc[t.conference].push(t);
      return acc;
    }, {});
    const standingsStr = Object.entries(byConf)
      .map(([conf, teams]) => {
        const sorted = [...teams].sort((a, b) => (a.ranking || 99) - (b.ranking || 99));
        return `${conf}:\n` + sorted.map((t) => `  ${t.ranking ? `#${t.ranking}` : "  "} ${t.city} ${t.name} (${t.record})`).join("\n");
      })
      .join("\n\n");
    sections.push(`=== STANDINGS ===\n${standingsStr}`);
  }

  return sections.join("\n\n");
}

export default function AIPropBuilderPage() {
  const [sport, setSport] = useState<Sport>("NBA");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(FUNC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          propsData: advanced ? buildAdvancedContext(sport) : buildBasicContext(sport),
          advanced,
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error || "Failed to get response");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${e.message || "Something went wrong. Try again."}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sportInjuryCount = injuries.filter((inj) => {
    const teamAbbrs = new Set(allTeams.filter((t) => t.sport === sport).map((t) => t.abbreviation));
    return teamAbbrs.has(inj.teamAbbr);
  }).length;

  return (
    <div className="container flex h-[calc(100vh-3.5rem)] flex-col py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Bot size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Prop Builder</h1>
            <p className="text-xs text-muted-foreground">
              Analysis, picks & parlays powered by AI
            </p>
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setAdvanced((v) => !v)}
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
            advanced
              ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20"
              : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
          }`}
        >
          <Zap size={14} className={advanced ? "text-primary" : ""} />
          Advanced
          {advanced && (
            <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">ON</span>
          )}
        </button>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      {/* Advanced mode indicator */}
      {advanced && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2.5">
          <Shield size={14} className="text-primary" />
          <span className="text-xs font-medium text-primary">Deep analysis mode</span>
          <span className="text-[10px] text-muted-foreground">
            Sending injuries ({sportInjuryCount}), H2H matchup history, full player stats (season/L10/L5), team standings & game lines
          </span>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card/50 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles size={32} className="text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">
                What do you want to bet on?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {advanced
                  ? `Deep mode: injuries, H2H, full stats for ${propLines.filter((p) => p.sport === sport).length} props`
                  : `Analyzing ${propLines.filter((p) => p.sport === sport).length} props across 4 sportsbooks`}
              </p>
            </div>
            <div className="grid w-full max-w-lg gap-2">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => send(qp.prompt)}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:border-primary/30 hover:bg-secondary"
                >
                  <qp.icon size={18} className="shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">{qp.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-secondary px-4 py-3">
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
          placeholder={advanced ? "Ask for deep analysis with injuries & H2H..." : "Ask about props, parlays, or specific players..."}
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          disabled={isLoading}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || isLoading}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
