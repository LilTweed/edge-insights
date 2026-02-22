const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// SportsRadar Odds Comparison Player Props API v2
// Docs: https://developer.sportradar.com/odds/reference/oc-player-props-overview

const SR_BASE = 'https://api.sportradar.com';

// Sport IDs used by SportsRadar OC Player Props
const SPORT_MAP: Record<string, string> = {
  NBA: 'sr:sport:2',
  NFL: 'sr:sport:16',
  MLB: 'sr:sport:3',
  NHL: 'sr:sport:4',
  NCAAB: 'sr:sport:2',   // basketball — filtered by competition
  NCAAF: 'sr:sport:16',  // football — filtered by competition
  MLS: 'sr:sport:1',
  WNBA: 'sr:sport:2',
  UFC: 'sr:sport:117',
};

// Competition IDs to distinguish pro vs college
const COMPETITION_MAP: Record<string, string> = {
  NBA: 'sr:competition:132',
  NFL: 'sr:competition:23',
  MLB: 'sr:competition:109',
  NHL: 'sr:competition:234',
  NCAAB: 'sr:competition:136',
  NCAAF: 'sr:competition:730',
  MLS: 'sr:competition:242',
  WNBA: 'sr:competition:584',
};

interface SROutcome {
  type: string;
  odds_american: number;
  odds_decimal: number;
  open?: boolean;
  player?: { id: string; name: string };
  total?: number;
}

interface SRMarket {
  id: string;
  name: string;
  outcomes: SROutcome[];
}

interface SRBook {
  id: string;
  name: string;
  markets: SRMarket[];
}

interface SREvent {
  id: string;
  scheduled: string;
  competitors: { id: string; name: string; abbreviation?: string; qualifier: string }[];
  markets?: {
    books: SRBook[];
  };
}

function todayStr(): string {
  const d = new Date();
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

function parsePlayerProps(events: SREvent[], sport: string) {
  const props: any[] = [];

  for (const event of events) {
    const home = event.competitors?.find(c => c.qualifier === 'home');
    const away = event.competitors?.find(c => c.qualifier === 'away');

    const books = event.markets?.books || [];
    for (const book of books) {
      for (const market of book.markets || []) {
        // Group outcomes by player
        const playerOutcomes: Record<string, { over?: SROutcome; under?: SROutcome; line: number }> = {};

        for (const outcome of market.outcomes || []) {
          if (!outcome.player) continue;
          const key = outcome.player.id;
          if (!playerOutcomes[key]) playerOutcomes[key] = { line: outcome.total ?? 0 };
          if (outcome.type === 'over') playerOutcomes[key].over = outcome;
          if (outcome.type === 'under') playerOutcomes[key].under = outcome;
        }

        for (const [playerId, po] of Object.entries(playerOutcomes)) {
          if (!po.over || !po.under) continue;
          const playerName = po.over.player?.name || playerId;
          const propId = `${event.id}-${market.id}-${playerId}-${book.id}`;

          props.push({
            id: propId,
            eventId: event.id,
            playerName,
            stat: market.name,
            line: po.over.total ?? po.line,
            homeTeam: home?.name || '',
            awayTeam: away?.name || '',
            homeAbbr: home?.abbreviation || '',
            awayAbbr: away?.abbreviation || '',
            commenceTime: event.scheduled,
            sportsbook: book.name,
            sportsbookKey: book.id,
            overOdds: po.over.odds_american,
            underOdds: po.under.odds_american,
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
        id: `${p.eventId}-${p.stat}-${p.playerName}`.replace(/\s+/g, '-'),
        playerName: p.playerName,
        stat: p.stat,
        line: p.line,
        homeTeam: p.homeTeam,
        awayTeam: p.awayTeam,
        homeAbbr: p.homeAbbr,
        awayAbbr: p.awayAbbr,
        commenceTime: p.commenceTime,
        sport: p.sport,
        sportsbooks: [],
      };
    }
    grouped[key].sportsbooks.push({
      sportsbook: p.sportsbook,
      sportsbookKey: p.sportsbookKey,
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
    const apiKey = Deno.env.get('SPORTSRADAR_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'SPORTSRADAR_API_KEY not configured', needsApiKey: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { sport, type } = body; // type: "props" | "schedule"

    const sportId = SPORT_MAP[sport];
    if (!sportId) {
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported sport: ${sport}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const competitionId = COMPETITION_MAP[sport];
    const date = todayStr();

    if (type === 'schedule') {
      // Fetch daily schedule for the competition
      const url = `${SR_BASE}/oddscomparison-player-props/trial/v2/en/sports/${encodeURIComponent(sportId)}/schedules/${date}/sport_events.json?api_key=${apiKey}`;
      console.log('Fetching SR schedule:', url.replace(apiKey, '***'));

      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        console.error('SR schedule error:', res.status, text.slice(0, 500));
        return new Response(
          JSON.stringify({ success: false, error: `SportsRadar API error [${res.status}]` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await res.json();
      return new Response(
        JSON.stringify({ success: true, schedule: data, fetchedAt: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default: fetch player props
    // Try daily sport player props endpoint
    const url = `${SR_BASE}/oddscomparison-player-props/trial/v2/en/sports/${encodeURIComponent(sportId)}/schedules/${date}/sport_events_player_props.json?api_key=${apiKey}`;
    console.log('Fetching SR player props:', url.replace(apiKey, '***'));

    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error('SR props error:', res.status, text.slice(0, 500));
      return new Response(
        JSON.stringify({ success: false, error: `SportsRadar API error [${res.status}]` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    const events: SREvent[] = data.sport_events || [];

    // Filter by competition if needed (e.g., separate NBA from NCAAB)
    const filteredEvents = competitionId
      ? events.filter((e: any) => e.sport_event?.tournament?.id === competitionId || !competitionId)
      : events;

    const playerProps = parsePlayerProps(filteredEvents.length > 0 ? filteredEvents : events, sport);

    return new Response(
      JSON.stringify({
        success: true,
        props: playerProps,
        eventsCount: events.length,
        fetchedAt: new Date().toISOString(),
        source: 'sportsradar',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SportsRadar error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
