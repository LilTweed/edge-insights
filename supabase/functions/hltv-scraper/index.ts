const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { type } = await req.json();

    let url: string;
    let prompt: string;

    if (type === 'players') {
      url = 'https://www.hltv.org/stats/players';
      prompt = 'Return a JSON array of the top 15 CS2 players with fields: name, team, rating, maps, kpr, dpr, kd, hsPct';
    } else if (type === 'teams') {
      url = 'https://www.hltv.org/ranking/teams';
      prompt = 'Return a JSON array of the top 15 CS2 teams with fields: rank, name, points, players (array of names)';
    } else if (type === 'matches') {
      url = 'https://www.hltv.org/matches';
      prompt = 'Return a JSON array of upcoming CS2 matches with fields: team1, team2, event, date, format, score';
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid type. Use: players, teams, or matches' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Scraping HLTV: ${type} from ${url}`);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['extract'],
        extract: { prompt },
        waitFor: 2000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Firecrawl error ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const extractedData = data?.data?.extract || data?.extract || data?.data || null;
    console.log(`HLTV ${type} scrape successful, data keys:`, extractedData ? Object.keys(extractedData) : 'null');

    return new Response(
      JSON.stringify({ success: true, type, data: extractedData, scrapedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error scraping HLTV:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed to scrape HLTV' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
