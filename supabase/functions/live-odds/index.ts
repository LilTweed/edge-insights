const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// This edge function fetches live odds from The Odds API (https://the-odds-api.com)
// Requires ODDS_API_KEY secret to be configured

const SPORT_MAP: Record<string, string> = {
  NBA: 'basketball_nba',
  NFL: 'americanfootball_nfl',
  MLB: 'baseball_mlb',
  NHL: 'icehockey_nhl',
  NCAAB: 'basketball_ncaab',
  NCAAF: 'americanfootball_ncaaf',
  MLS: 'soccer_usa_mls',
  WNBA: 'basketball_wnba',
  UFC: 'mma_mixed_martial_arts',
};

const BOOKMAKERS = 'fanduel,draftkings,betmgm,bovada';

interface OddsOutcome {
  name: string;
  price: number;
  point?: number;
}

interface OddsMarket {
  key: string;
  outcomes: OddsOutcome[];
}

interface OddsBookmaker {
  key: string;
  title: string;
  markets: OddsMarket[];
}

interface OddsEvent {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: OddsBookmaker[];
}

function parsePlayerProps(events: OddsEvent[], sport: string) {
  const props: any[] = [];

  for (const event of events) {
    for (const bookmaker of event.bookmakers) {
      for (const market of bookmaker.markets) {
        // Player prop markets have keys like "player_points", "player_rebounds", etc.
        if (!market.key.startsWith('player_')) continue;

        const statName = market.key
          .replace('player_', '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        for (let i = 0; i < market.outcomes.length; i += 2) {
          const over = market.outcomes.find((o) => o.name === 'Over');
          const under = market.outcomes.find((o) => o.name === 'Under');
          if (!over || !under) continue;

          const playerName = over.description || over.name;
          const propId = `${event.id}-${market.key}-${playerName}-${bookmaker.key}`;

          props.push({
            id: propId,
            eventId: event.id,
            playerName,
            stat: statName,
            line: over.point ?? 0,
            homeTeam: event.home_team,
            awayTeam: event.away_team,
            commenceTime: event.commence_time,
            sportsbook: bookmaker.title,
            sportsbookKey: bookmaker.key,
            overOdds: over.price,
            underOdds: under.price,
            sport,
          });
        }
      }
    }
  }

  // Group by player + stat + line, aggregate sportsbooks
  const grouped: Record<string, any> = {};
  for (const p of props) {
    const key = `${p.playerName}|${p.stat}|${p.line}`;
    if (!grouped[key]) {
      grouped[key] = {
        id: `${p.eventId}-${p.stat}-${p.playerName}`,
        playerName: p.playerName,
        stat: p.stat,
        line: p.line,
        homeTeam: p.homeTeam,
        awayTeam: p.awayTeam,
        commenceTime: p.commenceTime,
        sport: p.sport,
        sportsbooks: [],
      };
    }
    grouped[key].sportsbooks.push({
      sportsbook: p.sportsbook,
      over: p.overOdds,
      under: p.underOdds,
      line: p.line,
    });
  }

  return Object.values(grouped);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ODDS_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'ODDS_API_KEY not configured',
          needsApiKey: true,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { sport, markets } = body;

    const oddsApiSport = SPORT_MAP[sport];
    if (!oddsApiSport) {
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported sport: ${sport}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default to player props; can also fetch h2h, spreads, totals
    const marketTypes = markets || 'player_points,player_rebounds,player_assists,player_threes,player_blocks,player_steals,player_turnovers,player_pass_tds,player_pass_yds,player_rush_yds,player_reception_yds,player_receptions,player_hits_runs_rbis,player_total_bases,player_strikeouts,player_pitcher_strikeouts,player_goals,player_shots_on_goal,player_saves';

    const url = `https://api.the-odds-api.com/v4/sports/${oddsApiSport}/events?apiKey=${apiKey}&bookmakers=${BOOKMAKERS}&markets=${marketTypes}&oddsFormat=american`;

    console.log('Fetching odds for:', oddsApiSport);
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Odds API error:', res.status, text.slice(0, 300));
      return new Response(
        JSON.stringify({ success: false, error: `Odds API error [${res.status}]` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const events: OddsEvent[] = await res.json();
    const remaining = res.headers.get('x-requests-remaining');
    const used = res.headers.get('x-requests-used');

    const playerProps = parsePlayerProps(events, sport);

    return new Response(
      JSON.stringify({
        success: true,
        props: playerProps,
        eventsCount: events.length,
        apiUsage: { remaining, used },
        fetchedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Live odds error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
