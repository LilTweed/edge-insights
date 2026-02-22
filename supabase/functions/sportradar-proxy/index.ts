const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('SPORTRADAR_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'SPORTRADAR_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { path } = await req.json();
    if (!path || typeof path !== 'string') {
      return new Response(
        JSON.stringify({ error: '`path` string is required in the request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const url = `https://api.sportradar.com/${path}`;
    console.log('Proxying →', url);

    const upstream = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-api-key': apiKey,
      },
    });

    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('sportradar-proxy error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
