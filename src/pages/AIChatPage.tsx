import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  propLines, allPlayers, allGames, allTeams, matchupHistories, injuries,
  type Sport, type PropLine, formatOdds,
} from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeGate from "@/components/UpgradeGate";
import {
  Send, Loader2, Sparkles, TrendingUp, Layers, Zap, Shield,
  DollarSign, Flame, Target, ThumbsUp, BarChart3, Activity,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const FUNC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-prop-builder`;

// ── Simple mode: big friendly buttons, zero jargon ──
const simpleQuickPrompts = [
  { icon: Flame, label: "🔥 Explore today's matchups", description: "Show me the most interesting stats today", prompt: "Show me the most interesting player props and matchup data for today. Keep it super simple — break down what the numbers say for each one in plain English. No jargon. Rate the data strength with fire emojis (🔥🔥🔥 = strong trend, 🔥🔥 = solid data, 🔥 = small sample)." },
  { icon: DollarSign, label: "📊 Analyze a parlay", description: "Break down a multi-leg parlay with data", prompt: "Build a sample multi-leg parlay and analyze it with data. Show one conservative combination and one aggressive one. Keep the explanation simple — break down what the historical data shows for each leg and what a $10 example payout would look like." },
  { icon: ThumbsUp, label: "👍 High hit-rate props", description: "Props with the strongest historical trends", prompt: "What are the props with the highest historical hit rates today? I want to see the ones with the most consistent data trends. Show me the stats behind each one. Explain it like I'm brand new to sports analytics." },
  { icon: Target, label: "🎯 Spotlight a player", description: "Deep dive on one player's data", prompt: "Spotlight ONE player prop for me — the most statistically interesting player prop right now. Tell me the player, the stat, and what the historical data shows. Present the trends and let me decide what to do with it." },
];

const advancedQuickPrompts = [
  { icon: BarChart3, label: "Statistical edge analysis", description: "Hit rate vs implied probability, line discrepancies", prompt: "Run a full statistical edge analysis. Compare hit rates to implied probabilities across all sportsbooks. Flag any props where the hit rate significantly exceeds the implied probability. Include L10 trend deviation from season averages and identify regression candidates vs sustainable trends." },
  { icon: Activity, label: "Injury-adjusted projections", description: "Recalculate props accounting for active injuries", prompt: "Analyze how current injuries affect today's prop lines. For each injured player, identify which teammates see usage increases. Cross-reference with their L5 performance in games where the injured player was also absent. Flag any props that haven't been adjusted for the injury news." },
  { icon: Layers, label: "Correlated parlay builder", description: "Same-game & cross-game correlation analysis", prompt: "Build correlated parlays using game environment analysis. Identify game scripts (e.g., high-total games favor passing volume), pace matchups, and defensive weaknesses. Build 3 correlated parlays: a 2-leg SGP, a 3-leg cross-game, and an aggressive 5-leg with correlation reasoning for each leg." },
  { icon: TrendingUp, label: "H2H matchup deep dive", description: "Historical trends, pace, scoring patterns", prompt: "Deep dive into head-to-head matchup data for today's games. Compare historical average scores to current O/U lines. Analyze scoring trends, home/away splits, and streaks. Identify if the total or spread is mispriced based on the H2H data. Include specific game results from recent meetings." },
];

// ── Context builders ──
function buildBasicContext(sport: Sport): string {
  const sportProps = propLines.filter((p) => p.sport === sport);
  if (!sportProps.length) return "";
  return sportProps.map((p) => `${p.playerName} (${p.teamAbbr}) - ${p.stat}: Line ${p.line} | Season HR: ${p.hitRate}% | L10 HR: ${p.hitRateLast10}% | Lines: ${p.sportsbooks.map((s) => `${s.sportsbook}: ${s.line} (O${s.over}/U${s.under})`).join(", ")}`).join("\n");
}

function buildAdvancedContext(sport: Sport): string {
  const sections: string[] = [];
  const propsStr = buildBasicContext(sport);
  if (propsStr) sections.push(`=== PROP LINES ===\n${propsStr}`);

  const sportGames = allGames.filter((g) => g.sport === sport);
  if (sportGames.length) {
    const gamesStr = sportGames.map((g) => {
      const home = g.homeTeam; const away = g.awayTeam;
      let line = `${away.city} ${away.name} (${away.record}) @ ${home.city} ${home.name} (${home.record}) — ${g.time}`;
      if (home.stats && away.stats) {
        const hs = home.stats; const as_ = away.stats;
        if (sport === "NFL" || sport === "NCAAF") {
          line += `\n  Home: PPG ${hs.ppg} | OPP ${hs.oppPpg} | YPG ${hs.ypg || "—"} | Rush ${hs.rushYpg || "—"} | Pass ${hs.passYpg || "—"} | 3rd% ${hs.thirdDownPct || "—"} | RZ% ${hs.redZonePct || "—"} | Sacks ${hs.sacks || 0} | TO ${hs.takeaways || 0}`;
          line += `\n  Away: PPG ${as_.ppg} | OPP ${as_.oppPpg} | YPG ${as_.ypg || "—"} | Rush ${as_.rushYpg || "—"} | Pass ${as_.passYpg || "—"} | 3rd% ${as_.thirdDownPct || "—"} | RZ% ${as_.redZonePct || "—"} | Sacks ${as_.sacks || 0} | TO ${as_.takeaways || 0}`;
        } else {
          line += `\n  Home: PPG ${hs.ppg} | OPP ${hs.oppPpg} | FG% ${hs.fgPct} | 3P% ${hs.threePct}`;
          line += `\n  Away: PPG ${as_.ppg} | OPP ${as_.oppPpg} | FG% ${as_.fgPct} | 3P% ${as_.threePct}`;
        }
      }
      if (g.moneyline?.length) { const b = g.moneyline.reduce((a, c) => (c.home > a.home ? c : a)); line += `\n  Best ML: ${b.sportsbook} H${b.home}/A${b.away}`; }
      if (g.spread?.length) line += `\n  Spread: ${g.spread[0].home} (${g.spread[0].sportsbook})`;
      if (g.overUnder?.length) line += `\n  O/U: ${g.overUnder[0].total} (${g.overUnder[0].sportsbook})`;
      return line;
    }).join("\n\n");
    sections.push(`=== TODAY'S GAMES ===\n${gamesStr}`);
  }

  if (sportGames.length) {
    const h2hStr = sportGames.map((g) => {
      const h2h = matchupHistories.find((m) => (m.team1Id === g.homeTeam.id && m.team2Id === g.awayTeam.id) || (m.team1Id === g.awayTeam.id && m.team2Id === g.homeTeam.id));
      if (!h2h) return null;
      const t1 = allTeams.find((t) => t.id === h2h.team1Id); const t2 = allTeams.find((t) => t.id === h2h.team2Id);
      let str = `${t1?.name || h2h.team1Id} vs ${t2?.name || h2h.team2Id}\n  All-time: ${h2h.allTime.wins}-${h2h.allTime.losses} | L10: ${h2h.last10.team1Wins}-${h2h.last10.team2Wins} | L5: ${h2h.last5.team1Wins}-${h2h.last5.team2Wins} | Streak: ${h2h.streak} | AvgScore: ${h2h.avgScore.team1}-${h2h.avgScore.team2}\n  Last: ${h2h.lastMeeting}`;
      if (h2h.last5.results?.length) { str += `\n  Results:`; h2h.last5.results.forEach((r) => { str += `\n    ${r.date}: ${r.team1Score}-${r.team2Score} (${r.location})`; }); }
      return str;
    }).filter(Boolean).join("\n\n");
    if (h2hStr) sections.push(`=== HEAD-TO-HEAD ===\n${h2hStr}`);
  }

  const gameTeamAbbrs = new Set(sportGames.flatMap((g) => [g.homeTeam.abbreviation, g.awayTeam.abbreviation]));
  const relevantPlayers = allPlayers.filter((p) => p.sport === sport && gameTeamAbbrs.has(p.teamAbbr));
  if (relevantPlayers.length) {
    const playersStr = relevantPlayers.map((p) => {
      const a = p.seasonAverages; const l = p.last10; const l5 = p.last5;
      let str = `${p.name} (${p.teamAbbr}, ${p.position}) — ${p.stats.gamesPlayed}GP`;
      if (sport === "NBA" || sport === "NCAAB") {
        str += `\n  SZN: ${a.points}p/${a.rebounds}r/${a.assists}a/${a.steals}s/${a.blocks}b/${a.turnovers}to ${a.minutes}min | ${a.fgPct}/${a.threePct}/${a.ftPct}`;
        str += `\n  L10: ${l.points}p/${l.rebounds}r/${l.assists}a | ${l.fgPct}/${l.threePct}/${l.ftPct}`;
        str += `\n  L5:  ${l5.points}p/${l5.rebounds}r/${l5.assists}a | ${l5.fgPct}/${l5.threePct}/${l5.ftPct}`;
      } else if (sport === "NFL" && p.position === "QB") {
        str += `\n  SZN: ${a.points}yd ${a.assists}td ${a.fgPct}cmp% ${a.rebounds}rush ${a.turnovers}int QBR:${a.ftPct}`;
        str += `\n  L10: ${l.points}yd ${l.assists}td ${l.fgPct}cmp%  L5: ${l5.points}yd ${l5.assists}td`;
      } else {
        str += `\n  SZN: ${a.points}/${a.rebounds}/${a.assists}/${a.steals}/${a.blocks}/${a.turnovers}`;
      }
      return str;
    }).join("\n");
    sections.push(`=== PLAYERS ===\n${playersStr}`);
  }

  const sportTeamAbbrs = new Set(allTeams.filter((t) => t.sport === sport).map((t) => t.abbreviation));
  const sportInjuries = injuries.filter((inj) => sportTeamAbbrs.has(inj.teamAbbr));
  if (sportInjuries.length) {
    sections.push(`=== INJURIES ===\n${sportInjuries.map((inj) => `${inj.player} (${inj.teamAbbr}) ${inj.status}: ${inj.injury}${inj.returnDate ? ` ETA:${inj.returnDate}` : ""}`).join("\n")}`);
  }

  const sportTeams = allTeams.filter((t) => t.sport === sport);
  if (sportTeams.length) {
    const byConf = sportTeams.reduce<Record<string, typeof sportTeams>>((acc, t) => { if (!acc[t.conference]) acc[t.conference] = []; acc[t.conference].push(t); return acc; }, {});
    sections.push(`=== STANDINGS ===\n${Object.entries(byConf).map(([c, ts]) => `${c}: ${[...ts].sort((a, b) => (a.ranking || 99) - (b.ranking || 99)).map((t) => `${t.ranking ? `#${t.ranking}` : ""} ${t.name} (${t.record})`).join(", ")}`).join("\n")}`);
  }

  return sections.join("\n\n");
}

export default function AIChatPage({ embedded }: { embedded?: boolean } = {}) {
  const [searchParams] = useSearchParams();
  const [sport, setSport] = useState<Sport>("NBA");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { tier, isAdvanced: hasAdvanced } = useSubscription();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Handle slip analysis from Prop Builder
  useEffect(() => {
    const slipData = searchParams.get("slip");
    if (slipData && messages.length === 0) {
      send(`Analyze this prop slip I built with multi-book line shopping. Tell me if it's good and if I should swap any books:\n${slipData}`);
    }
  }, []);

  if (!hasAdvanced) {
    return (
      <div className="container py-10">
        <UpgradeGate requiredTier="advanced" currentTier={tier} feature="AI Chat">
          <div />
        </UpgradeGate>
      </div>
    );
  }

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: allMessages, propsData: advanced ? buildAdvancedContext(sport) : buildBasicContext(sport), advanced }),
      });
      if (!resp.ok || !resp.body) { const err = await resp.json().catch(() => ({ error: "Failed" })); throw new Error(err.error || "Failed"); }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let ni: number;
        while ((ni = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, ni); textBuffer = textBuffer.slice(ni + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || !line.trim() || !line.startsWith("data: ")) continue;
          const js = line.slice(6).trim();
          if (js === "[DONE]") break;
          try {
            const c = JSON.parse(js).choices?.[0]?.delta?.content as string | undefined;
            if (c) { assistantSoFar += c; setMessages((prev) => { const last = prev[prev.length - 1]; if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m); return [...prev, { role: "assistant", content: assistantSoFar }]; }); }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${e.message || "Something went wrong."}` }]);
    } finally { setIsLoading(false); }
  };

  const sportInjuryCount = injuries.filter((inj) => { const ta = new Set(allTeams.filter((t) => t.sport === sport).map((t) => t.abbreviation)); return ta.has(inj.teamAbbr); }).length;
  const sportPropCount = propLines.filter((p) => p.sport === sport).length;
  const sportGameCount = allGames.filter((g) => g.sport === sport).length;
  const prompts = advanced ? advancedQuickPrompts : simpleQuickPrompts;

  return (
    <div className={`${embedded ? "" : "container py-4"} flex h-full flex-col ${advanced ? "animate-pro-shimmer" : ""}`}>
      {/* Header */}
      {!embedded && (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${advanced ? "pro-gradient shadow-[0_0_12px_hsl(var(--pro)/0.3)] animate-pro-glow" : "bg-primary"}`}>
              {advanced ? <BarChart3 size={20} className="text-pro-foreground" /> : <Sparkles size={20} className="text-primary-foreground" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  {advanced ? "Pro Analyst" : "Research Assistant"}
                </h1>
                {advanced && (
                  <span className="rounded-md pro-gradient px-2 py-0.5 text-[9px] font-bold text-pro-foreground tracking-wider">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {advanced ? "Quantitative analysis · Statistical modeling · Correlation analysis" : "Tap a button, explore the data 📊"}
              </p>
            </div>
          </div>

          <div className={`flex items-center rounded-xl border p-0.5 ${advanced ? "border-pro/30 bg-pro/5" : "border-border bg-card"}`}>
            <button onClick={() => setAdvanced(false)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${!advanced ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              😎 Easy
            </button>
            <button onClick={() => { if (hasAdvanced) setAdvanced(true); else alert("Pro mode requires the Advanced plan ($9.99/mo). Visit the Pricing page to upgrade."); }} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${advanced ? "pro-gradient text-pro-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <span className="flex items-center gap-1"><Zap size={12} /> Pro {!hasAdvanced && "🔒"}</span>
            </button>
          </div>
        </div>
      )}

      <div className="mb-3">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      {/* Advanced info bar */}
      {advanced && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-pro/20 bg-pro/5 px-3 py-2 animate-pro-glow">
          <Shield size={13} className="text-pro" />
          <span className="text-[11px] font-medium text-pro">Feeding AI:</span>
          <span className="rounded bg-pro/10 px-1.5 py-0.5 text-[10px] font-medium text-pro">{sportPropCount} props</span>
          <span className="rounded bg-pro/10 px-1.5 py-0.5 text-[10px] font-medium text-pro">{sportGameCount} games</span>
          <span className="rounded bg-pro/10 px-1.5 py-0.5 text-[10px] font-medium text-pro">{sportInjuryCount} injuries</span>
          <span className="rounded bg-pro/10 px-1.5 py-0.5 text-[10px] font-medium text-pro">H2H + standings</span>
          <div className="ml-auto flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-pro animate-pulse-dot" />
            <span className="text-[9px] font-bold text-pro">LIVE ANALYSIS</span>
          </div>
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card/50 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-5">
            {!advanced ? (
              <>
                <div className="text-center">
                  <p className="text-4xl">🎰</p>
                   <h2 className="mt-3 text-xl font-bold text-foreground">What do you want to research?</h2>
                   <p className="mt-1.5 text-sm text-muted-foreground">Tap a button to explore the data 👇</p>
                </div>
                <div className="grid w-full max-w-md gap-2.5">
                  {prompts.map((qp) => (
                    <button key={qp.label} onClick={() => send(qp.prompt)} className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:scale-[1.01] hover:border-primary/30 hover:shadow-md active:scale-[0.99]">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <qp.icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{qp.label}</p>
                        <p className="text-xs text-muted-foreground">{qp.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">Or just type what you want below ↓</p>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl pro-gradient shadow-[0_0_20px_hsl(var(--pro)/0.3)] animate-pro-glow">
                  <BarChart3 size={28} className="text-pro-foreground" />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">Statistical Analysis Engine</h2>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-pro animate-pulse-dot" />
                      <span className="text-[9px] font-bold text-pro">ACTIVE</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{sportPropCount} props · {sportGameCount} games · {sportInjuryCount} injuries · H2H · L10/L5 splits</p>
                </div>
                <div className="grid w-full max-w-lg gap-2">
                  {prompts.map((qp) => (
                    <button key={qp.label} onClick={() => send(qp.prompt)} className="flex items-center gap-3 rounded-xl border border-pro/20 bg-card p-3.5 text-left transition-all hover:border-pro/40 hover:bg-pro/5 hover:shadow-[0_0_8px_hsl(var(--pro)/0.1)]">
                      <qp.icon size={16} className="shrink-0 text-pro" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{qp.label}</p>
                        <p className="text-[11px] text-muted-foreground">{qp.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
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
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
          placeholder={advanced ? "Query: e.g. 'edge analysis on Mahomes pass yards L5 trend vs spread'" : "Type anything… like 'who scores the most tonight?'"}
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          disabled={isLoading}
        />
        <button onClick={() => send(input)} disabled={!input.trim() || isLoading} className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
