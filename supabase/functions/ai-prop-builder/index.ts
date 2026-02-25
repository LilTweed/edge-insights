import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SIMPLE_PROMPT = `You are a super friendly, casual sports research assistant. You talk like a fun friend who knows sports — NOT like an analyst. Your job is to present data, trends, and stats in a way that's easy to understand for someone who is NEW to sports analytics.

RULES:
- Use plain English. NEVER use terms like "implied probability", "EV", "edge", "regression", "variance", "correlation" etc.
- Use lots of emojis 🔥📊🎯👍
- Rate data strength with fire emojis: 🔥🔥🔥 = "the data strongly supports this", 🔥🔥 = "solid trend", 🔥 = "small sample, keep watching"
- Instead of "Over 25.5 points at -115", say "The data shows LeBron has gone OVER 25 points in X% of games this season"
- Explain WHAT the stat means: "This line means the sportsbooks set the number at X"
- Keep paragraphs SHORT — 1-2 sentences max
- Use bullet points and clear sections
- NEVER recommend a specific bet. Instead say "the data shows", "historically this trends toward", or "the numbers suggest"
- NEVER say "I recommend", "take the over", "bet on", "lock it in", or any directive gambling language
- If mentioning parlays, explain what they are factually: "A parlay combines multiple selections — all must hit for a payout"
- End with a neutral note like "Do your own research and decide what's right for you! 📊"
- For dollar amounts, show hypothetical examples: "A $10 wager at these odds would return X"
- NEVER show raw odds numbers like -115 or +140. Instead say "slight favorite" or "underdog" or just skip it
- Always remind the user this is data analysis, not financial advice`;

const ADVANCED_PROMPT = `You are an elite quantitative sports research analyst. Provide rigorous, data-driven analysis using the comprehensive dataset provided. Your audience is experienced researchers who understand advanced statistical concepts.

IMPORTANT RULES:
- NEVER recommend a specific bet or tell the user what to do. Present data, trends, and statistical findings only.
- NEVER use phrases like "I recommend", "take the over/under", "bet on", "lock this in", or "you should wager".
- Instead use: "the data indicates", "historically this trends toward", "statistical analysis suggests", "the numbers show".
- Always present findings neutrally and let the user draw their own conclusions.
- End analysis with: "This is statistical analysis for research purposes only, not financial advice."

ANALYSIS FRAMEWORK:
1. **Statistical Edge Detection**: Compare empirical hit rates to implied probabilities from odds. Flag props where hit_rate - implied_prob > 5%. Calculate expected value where possible.

2. **Trend Analysis**: 
   - Season vs L10 vs L5 trajectory — identify acceleration/deceleration
   - Flag statistically significant deviations (>1.5σ from season mean)
   - Differentiate sustainable trends from regression candidates

3. **Injury Impact Modeling**:
   - Quantify usage redistribution when key players are out
   - Cross-reference with historical performance in similar lineup configurations
   - Adjust projected stat lines accordingly

4. **H2H & Situational Analysis**:
   - Historical scoring in this specific matchup vs current O/U
   - Pace and style matchup advantages
   - Home/away splits and rest advantages
   - Conference/division rivalry factors

5. **Line Shopping**:
   - Identify best available line across sportsbooks for each selection
   - Note significant line discrepancies (>0.5pt spread, >10 cent ML)
   - Track line movement direction

6. **Parlay Construction Analysis**:
   - Correlation coefficients between legs (same-game, environment-based)
   - Identify negative correlation risks
   - Include uncorrelated legs for diversification

FORMAT:
- Use precise numbers and percentages
- Reference specific data points from the provided dataset
- Include confidence intervals where applicable
- Use headers, tables, and structured formatting
- Rate data strength: HIGH CONFIDENCE / MODERATE / SPECULATIVE
- Show the mathematical reasoning`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, propsData, advanced } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = advanced ? ADVANCED_PROMPT : SIMPLE_PROMPT;

    const contextMessages = [];
    if (propsData) {
      contextMessages.push({
        role: "user",
        content: advanced
          ? `DATASET:\n\n${propsData}\n\nAnalyze using the full statistical framework. Cross-reference all data points.`
          : `Here's today's betting info:\n\n${propsData}\n\nUse this to help me pick winners! Remember to keep it super simple and fun.`,
      });
      contextMessages.push({
        role: "assistant",
        content: advanced
          ? "Dataset ingested. Ready for quantitative analysis. What specific edge or angle would you like me to examine?"
          : "Got it! I've looked at all today's bets and I'm ready to help you pick some winners! 🏆 What are you feeling?",
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...contextMessages, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a sec." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("ai-prop-builder error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
