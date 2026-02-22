const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

// Map our sport codes to ESPN sport/league paths
const SPORT_MAP: Record<string, { sport: string; league: string }> = {
  NBA: { sport: 'basketball', league: 'nba' },
  NFL: { sport: 'football', league: 'nfl' },
  MLB: { sport: 'baseball', league: 'mlb' },
  NHL: { sport: 'hockey', league: 'nhl' },
  NCAAB: { sport: 'basketball', league: 'mens-college-basketball' },
  NCAAF: { sport: 'football', league: 'college-football' },
};

function espnUrl(sportCode: string, endpoint: string, params = ''): string {
  const map = SPORT_MAP[sportCode];
  if (!map) throw new Error(`Unsupported sport: ${sportCode}`);
  return `${ESPN_BASE}/${map.sport}/${map.league}/${endpoint}${params ? '?' + params : ''}`;
}

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ESPN API error [${res.status}]: ${text.slice(0, 200)}`);
  }
  return res.json();
}

// Parse ESPN scoreboard into our Game shape
function parseScoreboard(data: any, sportCode: string) {
  const events = data?.events || [];
  return events.map((event: any) => {
    const competition = event.competitions?.[0];
    const home = competition?.competitors?.find((c: any) => c.homeAway === 'home');
    const away = competition?.competitors?.find((c: any) => c.homeAway === 'away');

    return {
      id: event.id,
      sport: sportCode,
      status: competition?.status?.type?.state || 'scheduled', // pre, in, post
      statusDetail: competition?.status?.type?.shortDetail || '',
      date: event.date,
      homeTeam: {
        id: home?.team?.id,
        name: home?.team?.shortDisplayName || home?.team?.name,
        abbreviation: home?.team?.abbreviation,
        logo: home?.team?.logo,
        record: home?.records?.[0]?.summary || '',
      },
      awayTeam: {
        id: away?.team?.id,
        name: away?.team?.shortDisplayName || away?.team?.name,
        abbreviation: away?.team?.abbreviation,
        logo: away?.team?.logo,
        record: away?.records?.[0]?.summary || '',
      },
      homeScore: home?.score ? parseInt(home.score) : undefined,
      awayScore: away?.score ? parseInt(away.score) : undefined,
      odds: competition?.odds?.map((o: any) => ({
        provider: o.provider?.name,
        spread: o.spread,
        overUnder: o.overUnder,
        homeMoneyLine: o.homeTeamOdds?.moneyLine,
        awayMoneyLine: o.awayTeamOdds?.moneyLine,
      })) || [],
      broadcasts: competition?.broadcasts?.map((b: any) => b.names?.join(', ')).flat().filter(Boolean) || [],
    };
  });
}

// Parse ESPN teams
function parseTeams(data: any, sportCode: string) {
  const teams = data?.sports?.[0]?.leagues?.[0]?.teams || [];
  return teams.map((t: any) => {
    const team = t.team;
    return {
      id: team.id,
      name: team.displayName,
      abbreviation: team.abbreviation,
      logo: team.logos?.[0]?.href,
      record: team.record?.items?.[0]?.summary || '',
      sport: sportCode,
      standingSummary: team.standingSummary || '',
    };
  });
}

// Parse ESPN standings
function parseStandings(data: any, sportCode: string) {
  const groups = data?.children || [];
  const standings: any[] = [];
  for (const group of groups) {
    const confName = group.name || group.abbreviation || '';
    for (const innerGroup of (group.children || [group])) {
      const divName = innerGroup.name || '';
      for (const entry of (innerGroup.standings?.entries || [])) {
        const team = entry.team;
        const statsMap: Record<string, string> = {};
        for (const stat of (entry.stats || [])) {
          statsMap[stat.abbreviation || stat.name] = stat.displayValue || String(stat.value);
        }
        standings.push({
          team: {
            id: team?.id,
            name: team?.displayName,
            abbreviation: team?.abbreviation,
            logo: team?.logos?.[0]?.href,
          },
          conference: confName,
          division: divName,
          wins: statsMap['W'] || statsMap['wins'] || '0',
          losses: statsMap['L'] || statsMap['losses'] || '0',
          pct: statsMap['PCT'] || statsMap['winPercent'] || '',
          streak: statsMap['STRK'] || statsMap['streak'] || '',
          sport: sportCode,
        });
      }
    }
  }
  return standings;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sport, endpoint } = await req.json();

    if (!sport || !SPORT_MAP[sport]) {
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported sport: ${sport}. Supported: ${Object.keys(SPORT_MAP).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result: any;
    const now = new Date().toISOString();

    if (endpoint === 'scoreboard') {
      const url = espnUrl(sport, 'scoreboard');
      console.log('Fetching scoreboard:', url);
      const data = await fetchJson(url);
      result = { games: parseScoreboard(data, sport), fetchedAt: now };
    } else if (endpoint === 'teams') {
      const url = espnUrl(sport, 'teams');
      console.log('Fetching teams:', url);
      const data = await fetchJson(url);
      result = { teams: parseTeams(data, sport), fetchedAt: now };
    } else if (endpoint === 'standings') {
      const url = `${ESPN_BASE}/${SPORT_MAP[sport].sport}/${SPORT_MAP[sport].league}/standings`;
      console.log('Fetching standings:', url);
      const data = await fetchJson(url);
      result = { standings: parseStandings(data, sport), fetchedAt: now };
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid endpoint. Use: scoreboard, teams, or standings' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('ESPN fetch error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
