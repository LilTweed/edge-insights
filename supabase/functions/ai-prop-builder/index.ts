import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASIC_PROMPT = `You are an elite sports betting analyst and prop builder AI. You specialize in player props, parlays, and value picks across all sports: NBA, NFL, NCAAB, NCAAF, MLB, NHL, and Esports (LoL, CS2, Valorant).

When the user provides player stats, matchup data, or asks for prop analysis, you should:

1. **Best Value Props**: Identify props where the line seems off based on the stats. Look for high hit rates, favorable recent trends, and sportsbook discrepancies.

2. **Full Analysis & Picks**: For each recommended prop, provide:
   - The pick (Over/Under) with the specific line and sportsbook
   - Confidence level (🔥 High, ⚡ Medium, 🧊 Low)
   - Key reasoning (recent performance, matchup advantage, trend data)
   - Hit rate data if available

3. **Custom Parlays**: Build 2-3 parlay combinations ranging from safe (2-leg) to aggressive (4+ legs), with estimated odds.

Format your response with clear sections, use emojis for visual appeal, and be specific with numbers. Always mention which sportsbook has the best line.`;

const ADVANCED_PROMPT = `You are an elite sports betting analyst with access to DEEP, comprehensive data. You specialize in player props, parlays, and value picks across all sports. You have been given extensive data including:

- **Full prop lines** across 4 sportsbooks with hit rates
- **Injury reports** with player statuses (Out/Doubtful/Questionable/Probable/Day-to-Day) and return timelines
- **Head-to-head matchup history** including all-time records, last 5/10 meetings, scoring trends, win streaks, and individual game scores
- **Complete player stats**: season averages, last 10 games, and last 5 games with full stat breakdowns
- **Team stats**: offensive/defensive ratings, shooting splits, pace, turnovers
- **Conference standings** and rankings

Your analysis MUST incorporate ALL of this data. Specifically:

1. **Injury Impact Analysis**: 
   - How does each injury affect the team's offense/defense?
   - Which players see increased usage when key players are out?
   - Prop adjustments based on missing players (e.g., "With Embiid out, Maxey averages +5.2 pts")

2. **H2H Deep Dive**:
   - Historical scoring trends in this matchup
   - Which team has momentum (win streak)?
   - How does the average score compare to today's O/U line?
   - Pace and style matchup analysis

3. **Trend-Based Picks**:
   - Compare season vs L10 vs L5 — is the player trending up or down?
   - Flag players on hot streaks or cold streaks
   - Note significant stat jumps between periods

4. **Value Identification**:
   - Cross-reference sportsbook lines to find the best value
   - Compare hit rates to implied odds
   - Flag lines that seem mispriced given injury/H2H context

5. **Parlay Construction**:
   - Correlate legs (same game, related stats)
   - Avoid injury-risk players
   - Include confidence tiers

Format with clear sections using headers, emojis (🔥🚨⚡🧊📊💰🏥), bullet points, and specific numbers. Reference the actual data provided. Be bold with your picks and explain your reasoning in detail.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, propsData, advanced } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = advanced ? ADVANCED_PROMPT : BASIC_PROMPT;

    const contextMessages = [];
    if (propsData) {
      contextMessages.push({
        role: "user",
        content: advanced
          ? `Here is the COMPLETE dataset for my analysis. This includes prop lines, today's games with team stats, head-to-head matchup histories, full player stats (season/L10/L5), injury reports, and standings:\n\n${propsData}\n\nUse ALL of this data in your analysis. Cross-reference injuries with player props, use H2H history to inform game totals, and compare recent trends to season averages.`
          : `Here is the current props data I'm looking at:\n\n${propsData}\n\nUse this data to inform your analysis.`,
      });
      contextMessages.push({
        role: "assistant",
        content: advanced
          ? "Got it! I've ingested all the data — prop lines, injuries, H2H matchup histories, full player stat breakdowns, team stats, and standings. I'm ready to give you deep, data-driven analysis. What would you like me to break down?"
          : "Got it! I've reviewed all the prop lines and player data. What would you like me to analyze?",
      });
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...contextMessages,
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-prop-builder error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
