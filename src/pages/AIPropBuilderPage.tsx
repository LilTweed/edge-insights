import { useState, useRef, useEffect } from "react";
import { propLines, type Sport } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import { Bot, Send, Loader2, Sparkles, TrendingUp, Layers } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const FUNC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-prop-builder`;

const quickPrompts = [
  { icon: TrendingUp, label: "Best value props today", prompt: "What are the best value props today? Find the ones with the highest hit rates and best odds discrepancies across sportsbooks." },
  { icon: Layers, label: "Build me a parlay", prompt: "Build me 3 parlay options: a safe 2-leg, a moderate 3-leg, and an aggressive 4+ leg parlay with the best expected value." },
  { icon: Sparkles, label: "Full analysis & picks", prompt: "Give me your top 5 picks today with full analysis, confidence levels, and reasoning for each one." },
];

export default function AIPropBuilderPage() {
  const [sport, setSport] = useState<Sport>("NBA");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Build props context string for selected sport
  const propsContext = () => {
    const sportProps = propLines.filter((p) => p.sport === sport);
    if (!sportProps.length) return "";
    return sportProps
      .map(
        (p) =>
          `${p.playerName} (${p.teamAbbr}) - ${p.stat}: Line ${p.line} | Season Hit Rate: ${p.hitRate}% | Last 10 Hit Rate: ${p.hitRateLast10}% | Lines: ${p.sportsbooks.map((s) => `${s.sportsbook}: ${s.line} (O ${s.over}/U ${s.under})`).join(", ")}`
      )
      .join("\n");
  };

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
          propsData: propsContext(),
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

  return (
    <div className="container flex h-[calc(100vh-3.5rem)] flex-col py-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
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

      <div className="mb-3">
        <SportFilter active={sport} onChange={setSport} />
      </div>

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
                I'll analyze {propLines.filter((p) => p.sport === sport).length} props across 4 sportsbooks
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
                  <span className="text-sm font-medium text-foreground">
                    {qp.label}
                  </span>
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
          placeholder="Ask about props, parlays, or specific players..."
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
