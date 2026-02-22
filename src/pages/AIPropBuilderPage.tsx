import { useState, useRef, useEffect } from "react";
import {
  propLines, allPlayers, allGames, allTeams, matchupHistories, injuries,
  type Sport, type PropLine, formatOdds,
} from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import {
  Bot, Send, Loader2, Sparkles, TrendingUp, Layers, Zap, Shield,
  DollarSign, Flame, Target, ThumbsUp, BarChart3, Activity,
  Plus, Trash2, StickyNote, Wrench, MessageSquare, X, Check, Search,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };
type Tab = "chat" | "builder" | "notes";

interface SlipLeg {
  id: string;
  prop: PropLine;
  side: "over" | "under";
}

interface StatNote {
  id: string;
  title: string;
  body: string;
  sport: Sport;
  timestamp: number;
  tags: string[];
}

const FUNC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-prop-builder`;

// ── Simple mode: big friendly buttons, zero jargon ──
const simpleQuickPrompts = [
  { icon: Flame, label: "🔥 What should I bet on?", description: "Just tell me the best bets right now", prompt: "Give me the absolute best bets for today. Keep it super simple — just tell me who to pick, over or under, and why in plain English. No jargon. Rate each pick with fire emojis (🔥🔥🔥 = lock, 🔥🔥 = solid, 🔥 = risky but fun)." },
  { icon: DollarSign, label: "💰 Make me money", description: "Build a parlay that could actually hit", prompt: "Build me a parlay that has a real shot at hitting. I want one safe option and one that pays big. Keep the explanation simple — I just want to know what to pick and roughly how much I could win on a $10 bet." },
  { icon: ThumbsUp, label: "👍 Easiest wins today", description: "The safest bets with the best chances", prompt: "What are the safest, most likely bets to win today? I don't need huge payouts, I just want to WIN. Give me the bets that hit most often. Explain it like I'm brand new to sports betting." },
  { icon: Target, label: "🎯 Pick a player for me", description: "One player, one bet, keep it simple", prompt: "Pick ONE player bet for me — the single best player prop right now. Tell me the player, what the bet is, over or under, and which app to use. Explain it like I've never placed a bet before." },
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
        const hs = home.stats; const as = away.stats;
        if (sport === "NFL" || sport === "NCAAF") {
          line += `\n  Home: PPG ${hs.ppg} | OPP ${hs.oppPpg} | YPG ${hs.ypg || "—"} | Rush ${hs.rushYpg || "—"} | Pass ${hs.passYpg || "—"} | 3rd% ${hs.thirdDownPct || "—"} | RZ% ${hs.redZonePct || "—"} | Sacks ${hs.sacks || 0} | TO ${hs.takeaways || 0}`;
          line += `\n  Away: PPG ${as.ppg} | OPP ${as.oppPpg} | YPG ${as.ypg || "—"} | Rush ${as.rushYpg || "—"} | Pass ${as.passYpg || "—"} | 3rd% ${as.thirdDownPct || "—"} | RZ% ${as.redZonePct || "—"} | Sacks ${as.sacks || 0} | TO ${as.takeaways || 0}`;
        } else {
          line += `\n  Home: PPG ${hs.ppg} | OPP ${hs.oppPpg} | FG% ${hs.fgPct} | 3P% ${hs.threePct}`;
          line += `\n  Away: PPG ${as.ppg} | OPP ${as.oppPpg} | FG% ${as.fgPct} | 3P% ${as.threePct}`;
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

// ── Implied probability helper ──
const impliedProb = (odds: number) => odds < 0 ? (-odds / (-odds + 100)) * 100 : (100 / (odds + 100)) * 100;

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════
export default function AIPropBuilderPage() {
  const [sport, setSport] = useState<Sport>("NBA");
  const [tab, setTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Builder state
  const [slip, setSlip] = useState<SlipLeg[]>([]);
  const [builderSearch, setBuilderSearch] = useState("");

  // Notes state
  const [notes, setNotes] = useState<StatNote[]>(() => {
    try { return JSON.parse(localStorage.getItem("lvrg-stat-notes") || "[]"); } catch { return []; }
  });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteBody, setNewNoteBody] = useState("");
  const [newNoteTags, setNewNoteTags] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [noteSportFilter, setNoteSportFilter] = useState<Sport | "ALL">("ALL");

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { localStorage.setItem("lvrg-stat-notes", JSON.stringify(notes)); }, [notes]);

  // ── Chat send ──
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

  // ── Builder helpers ──
  const availableProps = propLines.filter((p) => p.sport === sport && (builderSearch === "" || p.playerName.toLowerCase().includes(builderSearch.toLowerCase()) || p.stat.toLowerCase().includes(builderSearch.toLowerCase())));

  const addToSlip = (prop: PropLine, side: "over" | "under") => {
    if (slip.find((l) => l.prop.id === prop.id)) return;
    setSlip((prev) => [...prev, { id: `${prop.id}-${side}`, prop, side }]);
  };

  const removeFromSlip = (id: string) => setSlip((prev) => prev.filter((l) => l.id !== id));

  // ── Notes helpers ──
  const addNote = () => {
    if (!newNoteTitle.trim()) return;
    const note: StatNote = {
      id: Date.now().toString(),
      title: newNoteTitle.trim(),
      body: newNoteBody.trim(),
      sport,
      timestamp: Date.now(),
      tags: newNoteTags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setNotes((prev) => [note, ...prev]);
    setNewNoteTitle("");
    setNewNoteBody("");
    setNewNoteTags("");
  };

  const deleteNote = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));

  // Notes filtering
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const filteredNotes = notes.filter((n) => {
    if (noteSportFilter !== "ALL" && n.sport !== noteSportFilter) return false;
    if (activeTagFilter && !n.tags.includes(activeTagFilter)) return false;
    if (noteSearch) {
      const q = noteSearch.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  });

  const sportInjuryCount = injuries.filter((inj) => { const ta = new Set(allTeams.filter((t) => t.sport === sport).map((t) => t.abbreviation)); return ta.has(inj.teamAbbr); }).length;
  const sportPropCount = propLines.filter((p) => p.sport === sport).length;
  const sportGameCount = allGames.filter((g) => g.sport === sport).length;
  const prompts = advanced ? advancedQuickPrompts : simpleQuickPrompts;

  const tabs: { id: Tab; label: string; icon: typeof MessageSquare }[] = [
    { id: "chat", label: "AI Chat", icon: MessageSquare },
    { id: "builder", label: "Prop Builder", icon: Wrench },
    { id: "notes", label: "Stat Notes", icon: StickyNote },
  ];

  return (
    <div className="container flex h-[calc(100vh-3.5rem)] flex-col py-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${advanced ? "bg-primary" : "bg-green-600"}`}>
            {advanced ? <BarChart3 size={20} className="text-primary-foreground" /> : <Sparkles size={20} className="text-white" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {advanced ? "Pro Analyst" : "Quick Picks"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {advanced ? "Deep statistical analysis & edge detection" : "Tap a button, get winning bets 🎉"}
            </p>
          </div>
        </div>

        <div className="flex items-center rounded-xl border border-border bg-card p-0.5">
          <button onClick={() => setAdvanced(false)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${!advanced ? "bg-green-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            😎 Easy
          </button>
          <button onClick={() => setAdvanced(true)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${advanced ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <span className="flex items-center gap-1"><Zap size={12} /> Pro</span>
          </button>
        </div>
      </div>

      <div className="mb-3">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      {/* Tabs */}
      <div className="mb-3 flex items-center gap-1 rounded-xl border border-border bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Advanced info bar */}
      {advanced && tab === "chat" && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2">
          <Shield size={13} className="text-primary" />
          <span className="text-[11px] font-medium text-primary">Feeding AI:</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">{sportPropCount} props</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">{sportGameCount} games</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">{sportInjuryCount} injuries</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">H2H + standings</span>
        </div>
      )}

      {/* ═══ TAB: CHAT ═══ */}
      {tab === "chat" && (
        <>
          <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card/50 p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-5">
                {!advanced ? (
                  <>
                    <div className="text-center">
                      <p className="text-4xl">🎰</p>
                      <h2 className="mt-3 text-xl font-bold text-foreground">What do you wanna bet on?</h2>
                      <p className="mt-1.5 text-sm text-muted-foreground">Just tap a button — I'll do the rest 👇</p>
                    </div>
                    <div className="grid w-full max-w-md gap-2.5">
                      {prompts.map((qp) => (
                        <button key={qp.label} onClick={() => send(qp.prompt)} className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:scale-[1.01] hover:border-green-500/30 hover:shadow-md active:scale-[0.99]">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600/10">
                            <qp.icon size={20} className="text-green-500" />
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
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <BarChart3 size={28} className="text-primary" />
                    </div>
                    <div className="text-center">
                      <h2 className="text-lg font-semibold text-foreground">Statistical Analysis Engine</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{sportPropCount} props · {sportGameCount} games · {sportInjuryCount} injuries · H2H · L10/L5 splits</p>
                    </div>
                    <div className="grid w-full max-w-lg gap-2">
                      {prompts.map((qp) => (
                        <button key={qp.label} onClick={() => send(qp.prompt)} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:border-primary/30 hover:bg-secondary">
                          <qp.icon size={16} className="shrink-0 text-primary" />
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
            <button onClick={() => send(input)} disabled={!input.trim() || isLoading} className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors disabled:opacity-50 ${advanced ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-green-600 text-white hover:bg-green-700"}`}>
              <Send size={18} />
            </button>
          </div>
        </>
      )}

      {/* ═══ TAB: PROP BUILDER ═══ */}
      {tab === "builder" && (
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Available Props */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card/50">
            <div className="border-b border-border p-3">
              <input
                value={builderSearch}
                onChange={(e) => setBuilderSearch(e.target.value)}
                placeholder="Search player or stat…"
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {availableProps.length === 0 && (
                <p className="py-8 text-center text-xs text-muted-foreground">No props for {sport}</p>
              )}
              {availableProps.map((prop) => {
                const bestOver = prop.sportsbooks.reduce((a, b) => (b.over > a.over ? b : a));
                const bestUnder = prop.sportsbooks.reduce((a, b) => (b.under > a.under ? b : a));
                const inSlip = slip.some((l) => l.prop.id === prop.id);
                return (
                  <div key={prop.id} className={`rounded-lg border p-2.5 transition-colors ${inSlip ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card hover:border-border"}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-xs font-semibold text-foreground">{prop.playerName}</span>
                        <span className="ml-1.5 text-[10px] text-muted-foreground">{prop.teamAbbr} · {prop.stat}</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-foreground">{prop.line}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span>{prop.hitRate}% szn</span>
                        <span>·</span>
                        <span>{prop.hitRateLast10}% L10</span>
                      </div>
                      <button
                        onClick={() => addToSlip(prop, "over")}
                        disabled={inSlip}
                        className="rounded-md border border-green-500/30 bg-green-500/10 px-2 py-1 text-[10px] font-bold text-green-500 hover:bg-green-500/20 transition-colors disabled:opacity-30"
                      >
                        O {formatOdds(bestOver.over)}
                      </button>
                      <button
                        onClick={() => addToSlip(prop, "under")}
                        disabled={inSlip}
                        className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-30"
                      >
                        U {formatOdds(bestUnder.under)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bet Slip */}
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
                </div>
              )}
              {slip.map((leg) => {
                const bestBook = leg.side === "over"
                  ? leg.prop.sportsbooks.reduce((a, b) => (b.over > a.over ? b : a))
                  : leg.prop.sportsbooks.reduce((a, b) => (b.under > a.under ? b : a));
                const odds = leg.side === "over" ? bestBook.over : bestBook.under;
                return (
                  <div key={leg.id} className="rounded-lg border border-border bg-secondary/40 p-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{leg.prop.playerName}</p>
                        <p className="text-[10px] text-muted-foreground">{leg.prop.stat} — {leg.side === "over" ? "Over" : "Under"} {leg.prop.line}</p>
                        <p className="mt-1 font-mono text-[10px] font-bold text-primary">
                          {formatOdds(odds)} ({bestBook.sportsbook})
                        </p>
                      </div>
                      <button onClick={() => removeFromSlip(leg.id)} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {slip.length > 0 && (
              <div className="border-t border-border p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Legs</span>
                  <span className="font-bold text-foreground">{slip.length}</span>
                </div>
                <button
                  onClick={() => {
                    const slipText = slip.map((l) => `${l.prop.playerName} ${l.prop.stat} ${l.side === "over" ? "Over" : "Under"} ${l.prop.line}`).join("\n");
                    send(`Analyze this prop slip I built and tell me if it's good:\n${slipText}`);
                    setTab("chat");
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
      )}

      {/* ═══ TAB: STAT NOTES ═══ */}
      {tab === "notes" && (
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card/50">
          {/* New note form */}
          <div className="border-b border-border p-4 space-y-2">
            <input
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Note title… e.g. 'Tatum averaging +4 PTS in last 5'"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <textarea
              value={newNoteBody}
              onChange={(e) => setNewNoteBody(e.target.value)}
              placeholder="Details, reasoning, observations…"
              rows={2}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none"
            />
            <div className="flex items-center gap-2">
              <input
                value={newNoteTags}
                onChange={(e) => setNewNoteTags(e.target.value)}
                placeholder="Tags (comma separated)… e.g. trending, over"
                className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <button
                onClick={addNote}
                disabled={!newNoteTitle.trim()}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Plus size={14} />
                Save
              </button>
            </div>
          </div>

          {/* Search & filter bar */}
          <div className="border-b border-border px-4 py-2.5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  placeholder="Search notes…"
                  className="w-full rounded-lg border border-border bg-card pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <select
                value={noteSportFilter}
                onChange={(e) => setNoteSportFilter(e.target.value as Sport | "ALL")}
                className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="ALL">All Sports</option>
                {(["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF", "Soccer", "Tennis", "Golf", "MMA"] as Sport[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {activeTagFilter && (
                  <button
                    onClick={() => setActiveTagFilter(null)}
                    className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[9px] font-medium text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    ✕ Clear
                  </button>
                )}
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTagFilter(activeTagFilter === tag ? null : tag)}
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-medium transition-colors ${
                      activeTagFilter === tag
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
            <div className="text-[10px] text-muted-foreground">
              {filteredNotes.length} of {notes.length} note{notes.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredNotes.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <StickyNote size={28} className="text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">
                  {notes.length === 0 ? "No notes yet — add observations, trends, and stat notes above" : "No notes match your filters"}
                </p>
              </div>
            )}
            {filteredNotes.map((note) => (
              <div key={note.id} className="rounded-xl border border-border bg-card p-3.5 animate-fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">{note.sport}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(note.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">{note.title}</h4>
                    {note.body && <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{note.body}</p>}
                    {note.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setActiveTagFilter(tag)}
                            className={`rounded-full border px-2 py-0.5 text-[9px] font-medium transition-colors cursor-pointer ${
                              activeTagFilter === tag
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => deleteNote(note.id)} className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
