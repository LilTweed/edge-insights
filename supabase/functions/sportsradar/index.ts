const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SR_BASE = 'https://api.sportradar.com';

interface SportConfig {
  path: string;
  scheduleFormat: string;
}

const SPORT_CONFIG: Record<string, SportConfig> = {
  NBA: { path: 'nba/trial/v8/en', scheduleFormat: 'games/{date}/schedule.json' },
  NFL: { path: 'nfl/official/trial/v7/en', scheduleFormat: 'games/{year}/{week}/schedule.json' },
  MLB: { path: 'mlb/trial/v7/en', scheduleFormat: 'games/{date}/schedule.json' },
  NHL: { path: 'nhl/trial/v7/en', scheduleFormat: 'games/{date}/schedule.json' },
  NCAAB: { path: 'ncaamb/trial/v8/en', scheduleFormat: 'games/{date}/schedule.json' },
  NCAAF: { path: 'ncaafb/trial/v7/en', scheduleFormat: 'games/{date}/schedule.json' },
  WNBA: { path: 'wnba/trial/v8/en', scheduleFormat: 'games/{date}/schedule.json' },
};

function todayParts() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { yyyy, mm, dd, date: `${yyyy}/${mm}/${dd}` };
}

function getApiKey(): string | undefined {
  return Deno.env.get('SPORTRADAR_API_KEY') || Deno.env.get('SPORTSRADAR_API_KEY');
}

async function srFetch(url: string) {
  const apiKey = getApiKey()!;
  const separator = url.includes('?') ? '&' : '?';
  const fullUrl = `${url}${separator}api_key=${apiKey}`;
  console.log('SR fetch:', fullUrl.replace(apiKey, '***'));
  const res = await fetch(fullUrl);
  if (!res.ok) {
    const text = await res.text();
    console.error('SR error:', res.status, text.slice(0, 500));
    throw new Error(`SportsRadar API error [${res.status}]`);
  }
  return res.json();
}

// ========== PARSERS ==========

function parseScheduleGames(games: any[]) {
  return games.map((game: any) => ({
    id: game.id,
    status: game.status,
    scheduled: game.scheduled,
    homeTeam: {
      id: game.home?.id,
      name: game.home?.name || game.home?.market,
      abbreviation: game.home?.alias,
      logo: '',
      record: '',
      score: game.home_points ?? game.home?.runs ?? null,
    },
    awayTeam: {
      id: game.away?.id,
      name: game.away?.name || game.away?.market,
      abbreviation: game.away?.alias,
      logo: '',
      record: '',
      score: game.away_points ?? game.away?.runs ?? null,
    },
    venue: game.venue?.name,
    broadcast: game.broadcasts?.map((b: any) => b.network) || [],
  }));
}

function parseStandings(data: any) {
  const standings: any[] = [];
  const conferences = data.conferences || data.divisions || [];
  for (const conf of conferences) {
    const confName = conf.name || conf.alias || '';
    const divisions = conf.divisions || [conf];
    for (const div of divisions) {
      const divName = div.name || '';
      const teams = div.teams || [];
      for (const t of teams) {
        const wins = t.wins || t.win || 0;
        const losses = t.losses || t.loss || 0;
        const pct = wins + losses > 0 ? (wins / (wins + losses)).toFixed(3) : '.000';
        standings.push({
          team: {
            id: t.id,
            name: t.name || t.market,
            abbreviation: t.alias || '',
            logo: '',
          },
          conference: confName,
          division: divName,
          wins: String(wins),
          losses: String(losses),
          pct,
          streak: t.streak?.desc || '',
          sport: '',
        });
      }
    }
  }
  return standings;
}

function parseTeams(data: any) {
  const teams: any[] = [];
  const conferences = data.conferences || data.divisions || data.leagues || [];
  for (const conf of conferences) {
    const divisions = conf.divisions || [conf];
    for (const div of divisions) {
      const divTeams = div.teams || [];
      for (const t of divTeams) {
        teams.push({
          id: t.id,
          name: `${t.market || ''} ${t.name || ''}`.trim(),
          abbreviation: t.alias || '',
          logo: '',
          record: '',
          sport: '',
          standingSummary: '',
          conference: conf.name || conf.alias || '',
          division: div.name || div.alias || '',
        });
      }
    }
  }
  return teams;
}

function parseRoster(data: any, teamId: string) {
  const players = data.players || data.roster || [];
  return players.map((p: any) => ({
    id: p.id,
    name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
    firstName: p.first_name || '',
    lastName: p.last_name || '',
    position: p.primary_position || p.position || '',
    number: p.jersey_number || p.number || '',
    headshot: '',
    teamId,
    sport: '',
    age: p.age || 0,
    height: p.height ? `${Math.floor(p.height / 12)}'${p.height % 12}"` : '',
    weight: p.weight ? `${p.weight} lbs` : '',
    experience: p.experience || 0,
    college: p.college || p.school?.name || '',
    birthPlace: p.birth_place ? `${p.birth_place.city || ''}, ${p.birth_place.state || p.birth_place.country || ''}` : '',
    status: p.status || 'ACT',
  }));
}

function parsePlayerProfile(data: any) {
  const p = data;
  const seasons: any[] = [];

  // Parse season averages if available
  const playerSeasons = p.seasons || [];
  for (const season of playerSeasons) {
    const teams = season.teams || [];
    for (const team of teams) {
      const stats = team.statistics || team.average || {};
      if (typeof stats === 'object' && Object.keys(stats).length > 0) {
        // Flatten nested stats
        const flatStats: Record<string, string> = {};
        for (const [key, val] of Object.entries(stats)) {
          if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            for (const [subKey, subVal] of Object.entries(val as Record<string, any>)) {
              if (typeof subVal !== 'object') {
                flatStats[subKey] = String(subVal);
              }
            }
          } else if (typeof val !== 'object') {
            flatStats[key] = String(val);
          }
        }
        if (Object.keys(flatStats).length > 0) {
          seasons.push({
            season: `${season.year || ''} ${season.type || ''}`.trim(),
            category: team.name || 'Stats',
            stats: flatStats,
          });
        }
      }
    }
  }

  return {
    athlete: {
      id: p.id,
      name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
      team: p.team?.name || p.team?.market || '',
      teamAbbr: p.team?.alias || '',
      position: p.primary_position || p.position || '',
      number: p.jersey_number || '',
      headshot: '',
    },
    seasons,
    career: null,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'SPORTRADAR_API_KEY not configured', needsApiKey: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { sport, type, teamId, playerId, athleteId } = body;

    const config = SPORT_CONFIG[sport];
    if (!config) {
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported sport: ${sport}. Supported: ${Object.keys(SPORT_CONFIG).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { date } = todayParts();
    const now = new Date().toISOString();

    // ====== SCHEDULE / SCOREBOARD ======
    if (type === 'schedule' || type === 'scoreboard') {
      const scheduleEndpoint = config.scheduleFormat.replace('{date}', date);
      const url = `${SR_BASE}/${config.path}/${scheduleEndpoint}`;
      const data = await srFetch(url);
      const games = parseScheduleGames(data.games || []);
      return new Response(
        JSON.stringify({ success: true, games, gamesCount: games.length, fetchedAt: now, source: 'sportsradar' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ====== STANDINGS ======
    if (type === 'standings') {
      const url = `${SR_BASE}/${config.path}/seasons/2025/REG/standings.json`;
      const data = await srFetch(url);
      const standings = parseStandings(data);
      standings.forEach((s: any) => { s.sport = sport; });
      return new Response(
        JSON.stringify({ success: true, standings, fetchedAt: now, source: 'sportsradar' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ====== TEAMS (hierarchy) ======
    if (type === 'teams') {
      const url = `${SR_BASE}/${config.path}/league/hierarchy.json`;
      const data = await srFetch(url);
      const teams = parseTeams(data);
      teams.forEach((t: any) => { t.sport = sport; });
      return new Response(
        JSON.stringify({ success: true, teams, fetchedAt: now, source: 'sportsradar' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ====== ROSTER ======
    if (type === 'roster') {
      const tid = teamId;
      if (!tid) {
        return new Response(
          JSON.stringify({ success: false, error: 'teamId required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const url = `${SR_BASE}/${config.path}/teams/${tid}/profile.json`;
      const data = await srFetch(url);
      const roster = parseRoster(data, tid);
      roster.forEach((p: any) => { p.sport = sport; });
      return new Response(
        JSON.stringify({ success: true, roster, fetchedAt: now, source: 'sportsradar' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ====== PLAYER STATS / PROFILE ======
    if (type === 'player' || type === 'player-stats') {
      const pid = playerId || athleteId;
      if (!pid) {
        return new Response(
          JSON.stringify({ success: false, error: 'playerId or athleteId required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const url = `${SR_BASE}/${config.path}/players/${pid}/profile.json`;
      const data = await srFetch(url);
      const parsed = parsePlayerProfile(data);
      return new Response(
        JSON.stringify({ success: true, ...parsed, fetchedAt: now, source: 'sportsradar' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: `Unknown type: ${type}. Supported: schedule, scoreboard, standings, teams, roster, player, player-stats` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SportsRadar error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
