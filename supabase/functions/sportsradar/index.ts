const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// SportsRadar League-Specific APIs
// NBA v8, NFL v7, MLB v7, NHL v7
// Docs: https://developer.sportradar.com/basketball/docs/nba-ig-api-basics

const SR_BASE = 'https://api.sportradar.com';

interface SportConfig {
  path: string;      // e.g. "nba/trial/v8/en"
  scheduleFormat: string; // endpoint for daily schedule
}

const SPORT_CONFIG: Record<string, SportConfig> = {
  NBA: { path: 'nba/trial/v8/en', scheduleFormat: 'games/{date}/schedule.json' },
  NFL: { path: 'nfl/official/trial/v7/en', scheduleFormat: 'games/{year}/{week}/schedule.json' },
  MLB: { path: 'mlb/trial/v7/en', scheduleFormat: 'games/{date}/schedule.json' },
  NHL: { path: 'nhl/trial/v7/en', scheduleFormat: 'games/{date}/schedule.json' },
  NCAAB: { path: 'ncaamb/trial/v8/en', scheduleFormat: 'games/{date}/schedule.json' },
  WNBA: { path: 'wnba/trial/v8/en', scheduleFormat: 'games/{date}/schedule.json' },
};

function todayParts() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { yyyy, mm, dd, date: `${yyyy}/${mm}/${dd}` };
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
    const { sport, type } = body; // type: "schedule" | "standings" | "player"

    const config = SPORT_CONFIG[sport];
    if (!config) {
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported sport: ${sport}. Supported: ${Object.keys(SPORT_CONFIG).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { date } = todayParts();

    if (type === 'standings') {
      const url = `${SR_BASE}/${config.path}/seasons/2025/REG/standings.json?api_key=${apiKey}`;
      console.log('Fetching SR standings:', url.replace(apiKey, '***'));
      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        console.error('SR standings error:', res.status, text.slice(0, 500));
        return new Response(
          JSON.stringify({ success: false, error: `SportsRadar API error [${res.status}]` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const data = await res.json();
      return new Response(
        JSON.stringify({ success: true, data, fetchedAt: new Date().toISOString(), source: 'sportsradar' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (type === 'player') {
      const playerId = body.playerId;
      if (!playerId) {
        return new Response(
          JSON.stringify({ success: false, error: 'playerId required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const url = `${SR_BASE}/${config.path}/players/${playerId}/profile.json?api_key=${apiKey}`;
      console.log('Fetching SR player:', url.replace(apiKey, '***'));
      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        console.error('SR player error:', res.status, text.slice(0, 500));
        return new Response(
          JSON.stringify({ success: false, error: `SportsRadar API error [${res.status}]` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const data = await res.json();
      return new Response(
        JSON.stringify({ success: true, data, fetchedAt: new Date().toISOString(), source: 'sportsradar' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default: daily schedule with game details
    const scheduleEndpoint = config.scheduleFormat.replace('{date}', date);
    const url = `${SR_BASE}/${config.path}/${scheduleEndpoint}?api_key=${apiKey}`;
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
    const games = data.games || [];

    // Transform games into a clean format
    const formattedGames = games.map((game: any) => ({
      id: game.id,
      status: game.status,
      scheduled: game.scheduled,
      homeTeam: {
        name: game.home?.name || game.home?.market,
        abbreviation: game.home?.alias,
        id: game.home?.id,
        score: game.home_points ?? game.home?.runs ?? null,
      },
      awayTeam: {
        name: game.away?.name || game.away?.market,
        abbreviation: game.away?.alias,
        id: game.away?.id,
        score: game.away_points ?? game.away?.runs ?? null,
      },
      venue: game.venue?.name,
      broadcast: game.broadcasts?.map((b: any) => b.network) || [],
    }));

    return new Response(
      JSON.stringify({
        success: true,
        games: formattedGames,
        gamesCount: formattedGames.length,
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
