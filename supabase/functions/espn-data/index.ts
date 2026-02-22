const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports';
const ESPN_COMMON = 'https://site.api.espn.com/apis/common/v3/sports';
const ESPN_CORE = 'https://sports.core.api.espn.com/v2/sports';

const SPORT_MAP: Record<string, { sport: string; league: string }> = {
  NBA: { sport: 'basketball', league: 'nba' },
  NFL: { sport: 'football', league: 'nfl' },
  MLB: { sport: 'baseball', league: 'mlb' },
  NHL: { sport: 'hockey', league: 'nhl' },
  NCAAB: { sport: 'basketball', league: 'mens-college-basketball' },
  NCAAF: { sport: 'football', league: 'college-football' },
  UFC: { sport: 'mma', league: 'ufc' },
  PGA: { sport: 'golf', league: 'pga' },
  MLS: { sport: 'soccer', league: 'usa.1' },
  WNBA: { sport: 'basketball', league: 'wnba' },
  NASCAR: { sport: 'racing', league: 'nascar-cup' },  // Note: changed from 'nascar' to 'nascar-cup' which is ESPN's league identifier
  TENNIS: { sport: 'tennis', league: 'atp' },
};

function espnUrl(sportCode: string, endpoint: string, params = ''): string {
  const map = SPORT_MAP[sportCode];
  if (!map) throw new Error(`Unsupported sport: ${sportCode}`);
  return `${ESPN_BASE}/${map.sport}/${map.league}/${endpoint}${params ? '?' + params : ''}`;
}

async function fetchJson(url: string) {
  console.log('Fetching:', url);
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ESPN API error [${res.status}]: ${text.slice(0, 300)}`);
  }
  return res.json();
}

// Parse ESPN scoreboard
function parseScoreboard(data: any, sportCode: string) {
  const events = data?.events || [];
  return events.map((event: any) => {
    const competition = event.competitions?.[0];
    const home = competition?.competitors?.find((c: any) => c.homeAway === 'home');
    const away = competition?.competitors?.find((c: any) => c.homeAway === 'away');
    return {
      id: event.id,
      sport: sportCode,
      status: competition?.status?.type?.state || 'scheduled',
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

// Parse roster - ESPN returns athletes as flat array
function parseRoster(data: any, sportCode: string, teamId: string) {
  const athletes: any[] = [];
  const rawAthletes = data?.athletes || [];
  
  for (const athlete of rawAthletes) {
    // Each athlete might be a direct object OR wrapped in a group with items
    if (athlete.items) {
      // Grouped by position
      const posName = athlete.position || '';
      for (const item of athlete.items) {
        athletes.push(mapAthlete(item, posName, teamId, sportCode));
      }
    } else if (athlete.displayName || athlete.fullName || athlete.firstName) {
      // Direct athlete object
      athletes.push(mapAthlete(athlete, '', teamId, sportCode));
    }
  }
  
  return athletes;
}

function mapAthlete(athlete: any, positionFallback: string, teamId: string, sportCode: string) {
  return {
    id: athlete.id,
    name: athlete.displayName || athlete.fullName || `${athlete.firstName || ''} ${athlete.lastName || ''}`.trim(),
    firstName: athlete.firstName || '',
    lastName: athlete.lastName || '',
    position: athlete.position?.abbreviation || athlete.position?.name || positionFallback || '',
    number: athlete.jersey || '',
    headshot: athlete.headshot?.href || '',
    teamId,
    sport: sportCode,
    age: athlete.age || 0,
    height: athlete.displayHeight || '',
    weight: athlete.displayWeight || '',
    experience: athlete.experience?.years ?? 0,
    college: athlete.college?.name || '',
    birthPlace: athlete.birthPlace?.city ? `${athlete.birthPlace.city}, ${athlete.birthPlace.state || athlete.birthPlace.country || ''}` : '',
    status: athlete.status?.type || 'active',
  };
}

// Parse athlete stats from the common/v3 API
function parseAthleteStats(data: any) {
  const result: any = {
    athlete: null,
    seasons: [],
    career: null,
  };

  // Parse athlete info - check multiple possible locations in ESPN response
  const athleteData = data?.athlete 
    || data?.filters?.find((f: any) => f.displayName === 'Athlete')?.athletes?.[0]
    || data?.results?.[0]?.athlete;
  
  // Also try to extract from teams array if athlete is nested there
  const teamAthleteData = !athleteData && data?.teams?.[0]?.athlete ? data.teams[0].athlete : null;
  const finalAthlete = athleteData || teamAthleteData;
  
  if (finalAthlete) {
    result.athlete = {
      id: finalAthlete.id,
      name: finalAthlete.displayName || finalAthlete.fullName,
      team: finalAthlete.team?.displayName || '',
      teamAbbr: finalAthlete.team?.abbreviation || '',
      position: finalAthlete.position?.abbreviation || '',
      number: finalAthlete.jersey || '',
      headshot: finalAthlete.headshot?.href || '',
    };
  }

  // The stats come in "categories" - each category has labels and statistics/splitCategories
  const categories = data?.categories || [];
  
  // Also check teams[].categories which ESPN sometimes uses
  const teamCategories = data?.teams?.[0]?.categories || [];
  const allCategories = [...categories, ...teamCategories];
  
  for (const cat of allCategories) {
    const categoryName = cat.displayName || cat.name || 'Stats';
    const labels: string[] = cat.labels || [];
    
    // ESPN uses "statistics" key for the season rows
    const statSplits = cat.statistics || cat.stats || [];
    
    if (Array.isArray(statSplits) && statSplits.length > 0) {
      for (const split of statSplits) {
        const splitName = split.displayName || split.name || split.season?.displayName || '';
        const values: string[] = split.displayValues || split.stats?.map((s: any) => String(s)) || [];
        
        const statObj: Record<string, string> = {};
        labels.forEach((abbr: string, i: number) => {
          if (values[i] !== undefined) {
            statObj[abbr] = values[i];
          }
        });
        
        if (Object.keys(statObj).length > 0) {
          result.seasons.push({
            season: splitName,
            category: categoryName,
            stats: statObj,
          });
        }
      }
    }
    
    // Handle splitCategories (deeper nesting ESPN sometimes uses)
    const splitCats = cat.splitCategories || [];
    for (const sc of splitCats) {
      const scName = sc.displayName || sc.name || '';
      const splits = sc.splits || sc.stats || [];
      for (const split of splits) {
        const splitName = split.displayName || split.name || '';
        const values: string[] = split.displayValues || split.stats?.map((s: any) => String(s)) || [];
        
        const statObj: Record<string, string> = {};
        labels.forEach((abbr: string, i: number) => {
          if (values[i] !== undefined) {
            statObj[abbr] = values[i];
          }
        });
        
        if (Object.keys(statObj).length > 0) {
          result.seasons.push({
            season: `${splitName}${scName ? ` (${scName})` : ''}`,
            category: categoryName,
            stats: statObj,
          });
        }
      }
    }
  }
  
  // Also add totals if available
  for (const cat of allCategories) {
    const categoryName = cat.displayName || cat.name || 'Stats';
    const labels: string[] = cat.labels || [];
    const totals = cat.totals;
    if (Array.isArray(totals) && totals.length > 0) {
      const statObj: Record<string, string> = {};
      labels.forEach((abbr: string, i: number) => {
        if (totals[i] !== undefined) {
          statObj[abbr] = String(totals[i]);
        }
      });
      if (Object.keys(statObj).length > 0) {
        result.seasons.push({
          season: 'Career Totals',
          category: categoryName,
          stats: statObj,
        });
      }
    }
  }

  return result;
}

// Parse game log from common/v3 gamelog endpoint
function parseGameLog(data: any) {
  const result: any = {
    games: [],
    labels: [],
    seasonType: '',
  };

  // Top-level labels (stat column names) and displayNames
  const labels: string[] = data?.labels || [];
  const displayNames: string[] = data?.displayNames || [];
  result.labels = displayNames.length > 0 ? displayNames : labels;
  
  // Events map: eventId -> { opponent, atVs, gameDate, score, gameResult, ... }
  const eventsMap: Record<string, any> = data?.events || {};
  
  const seasonTypes = data?.seasonTypes || [];
  
  for (const st of seasonTypes) {
    const stName = st?.displayName || st?.name || '';
    if (!result.seasonType) result.seasonType = stName;
    const categories = st?.categories || [];
    
    for (const cat of categories) {
      const catName = cat.displayName || cat.name || '';
      const events = cat.events || [];
      
      for (const event of events) {
        const eventId = event.eventId || event.id || '';
        const eventMeta = eventsMap[eventId] || {};
        
        // Map stats array to labels
        const stats: Record<string, string> = {};
        const values = event.stats || [];
        result.labels.forEach((label: string, i: number) => {
          if (values[i] !== undefined) {
            stats[label] = String(values[i]);
          }
        });
        
        // Event metadata
        const opponent = eventMeta.opponent?.displayName || eventMeta.opponent?.shortDisplayName || eventMeta.opponent?.abbreviation || '';
        const opponentAbbr = eventMeta.opponent?.abbreviation || '';
        const opponentLogo = eventMeta.opponent?.logo || '';
        const atVs = eventMeta.atVs || '';
        const homeAway = eventMeta.homeAway || (atVs === 'vs' ? 'home' : atVs === '@' ? 'away' : '');
        const gameResult = eventMeta.gameResult || '';
        const gameDate = eventMeta.gameDate || '';
        const score = eventMeta.score || '';
        
        result.games.push({
          eventId,
          date: gameDate,
          opponent,
          opponentAbbr,
          opponentLogo,
          homeAway,
          atVs,
          result: gameResult,
          score,
          stats,
          category: catName,
          seasonType: stName,
        });
      }
      
      // Also capture totals if available
      if (cat.totals && Array.isArray(cat.totals)) {
        const totalStats: Record<string, string> = {};
        result.labels.forEach((label: string, i: number) => {
          if (cat.totals[i] !== undefined) {
            totalStats[label] = String(cat.totals[i]);
          }
        });
        if (Object.keys(totalStats).length > 0) {
          result.games.push({
            eventId: `total-${catName}`,
            date: '',
            opponent: 'TOTAL',
            opponentAbbr: '',
            opponentLogo: '',
            homeAway: '',
            atVs: '',
            result: '',
            score: '',
            stats: totalStats,
            category: catName,
            seasonType: stName,
            isTotal: true,
          });
        }
      }
    }
  }
  
  return result;
}

// Parse splits from common/v3 splits endpoint
function parseSplits(data: any) {
  const result: any = {
    categories: [],
    labels: [],
  };

  // Top-level labels
  const topLabels: string[] = data?.labels || data?.displayNames || [];
  result.labels = topLabels;
  
  console.log('Splits top keys:', Object.keys(data || {}));
  
  const splitCategories = data?.splitCategories || data?.categories || [];
  
  for (const sc of splitCategories) {
    const categoryName = sc.displayName || sc.name || '';
    const labels: string[] = sc.labels || sc.displayNames || topLabels;
    const splits = sc.splits || sc.stats || sc.statistics || [];
    
    const parsedSplits: any[] = [];
    
    for (const split of splits) {
      const splitName = split.displayName || split.name || split.abbreviation || '';
      const values: string[] = split.displayValues || split.stats?.map((s: any) => String(s)) || [];
      
      const stats: Record<string, string> = {};
      labels.forEach((label: string, i: number) => {
        if (values[i] !== undefined) {
          stats[label] = values[i];
        }
      });
      
      if (Object.keys(stats).length > 0) {
        parsedSplits.push({
          name: splitName,
          stats,
        });
      }
    }
    
    if (parsedSplits.length > 0) {
      result.categories.push({
        name: categoryName,
        labels,
        splits: parsedSplits,
      });
    }
  }
  
  return result;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { sport, endpoint, teamId, athleteId, query } = body;

    if (!sport || !SPORT_MAP[sport]) {
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported sport: ${sport}. Supported: ${Object.keys(SPORT_MAP).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result: any;
    const now = new Date().toISOString();
    const map = SPORT_MAP[sport];

    switch (endpoint) {
      case 'scoreboard': {
        const url = espnUrl(sport, 'scoreboard');
        const data = await fetchJson(url);
        result = { games: parseScoreboard(data, sport), fetchedAt: now };
        break;
      }
      case 'teams': {
        const url = espnUrl(sport, 'teams');
        const data = await fetchJson(url);
        result = { teams: parseTeams(data, sport), fetchedAt: now };
        break;
      }
      case 'standings': {
        const url = `${ESPN_BASE}/${map.sport}/${map.league}/standings`;
        const data = await fetchJson(url);
        result = { standings: parseStandings(data, sport), fetchedAt: now };
        break;
      }
      case 'roster': {
        if (!teamId) {
          return new Response(
            JSON.stringify({ success: false, error: 'teamId required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const url = espnUrl(sport, `teams/${teamId}/roster`);
        const data = await fetchJson(url);
        console.log('Roster keys:', Object.keys(data));
        console.log('Athletes groups:', data?.athletes?.length, 'first group keys:', data?.athletes?.[0] ? Object.keys(data.athletes[0]) : 'none');
        console.log('First group items count:', data?.athletes?.[0]?.items?.length);
        const roster = parseRoster(data, sport, teamId);
        result = { roster, fetchedAt: now };
        break;
      }
      case 'player-stats': {
        if (!athleteId) {
          return new Response(
            JSON.stringify({ success: false, error: 'athleteId required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        // Use the common/v3 API via site.api.espn.com (site.web.espn.com doesn't resolve in edge functions)
        const url = `${ESPN_COMMON}/${map.sport}/${map.league}/athletes/${athleteId}/stats`;
        console.log('Fetching player stats:', url);
        try {
          const data = await fetchJson(url);
          console.log('Stats response keys:', Object.keys(data));
          console.log('Teams count:', data?.teams?.length);
          console.log('Categories count:', data?.categories?.length);
          if (data?.categories?.[0]) {
            const c = data.categories[0];
            console.log('First category:', c.displayName, 'labels:', c.labels?.slice(0, 5));
            console.log('First cat keys:', Object.keys(c));
            // Check what sub-structure holds the actual stats
            console.log('First cat splitCategories?', c.splitCategories?.length);
            if (c.splitCategories?.[0]) {
              const sc = c.splitCategories[0];
              console.log('SplitCat keys:', Object.keys(sc));
              console.log('SplitCat splits?', sc.splits?.length, 'stats?', sc.stats?.length);
              if (sc.splits?.[0]) {
                console.log('Split[0] keys:', Object.keys(sc.splits[0]));
                console.log('Split[0] displayValues sample:', sc.splits[0].displayValues?.slice(0, 3));
              }
            }
          }
          if (data?.teams?.[0]) {
            const t = data.teams[0];
            console.log('Teams[0] keys:', Object.keys(t));
            console.log('Teams[0] categories?', t.categories?.length);
            if (t.categories?.[0]) {
              const tc = t.categories[0];
              console.log('TeamCat[0] name:', tc.displayName, 'labels:', tc.labels?.slice(0, 5), 'stats:', tc.stats?.length);
              if (tc.stats?.[0]) {
                console.log('TeamCat[0].stats[0] keys:', Object.keys(tc.stats[0]));
                console.log('TeamCat[0].stats[0] name:', tc.stats[0].displayName, 'values:', tc.stats[0].displayValues?.slice(0, 3));
              }
            }
          }
          const parsed = parseAthleteStats(data);
          result = { ...parsed, fetchedAt: now };
        } catch (e) {
          console.error('Common API failed:', e);
          // Fallback: try core API
          try {
            const coreUrl = `${ESPN_CORE}/${map.sport}/leagues/${map.league}/athletes/${athleteId}/statistics`;
            const coreData = await fetchJson(coreUrl);
            console.log('Core stats keys:', Object.keys(coreData));
            result = { athlete: null, seasons: [], career: null, fetchedAt: now, raw: 'core-fallback' };
          } catch (e2) {
            console.error('Core API also failed:', e2);
            result = { athlete: null, seasons: [], career: null, fetchedAt: now };
          }
        }
        break;
      }
      case 'search': {
        if (!query) {
          return new Response(
            JSON.stringify({ success: false, error: 'query required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const url = `https://site.api.espn.com/apis/common/v3/search?query=${encodeURIComponent(query)}&limit=25&type=player&sport=${map.sport}&league=${map.league}`;
        const data = await fetchJson(url);
        const items = data?.items || data?.results || [];
        const athletes = items.map((item: any) => ({
          id: item.id,
          name: item.displayName || item.name || item.title,
          team: item.team?.displayName || '',
          teamAbbr: item.team?.abbreviation || '',
          position: item.position || '',
          headshot: item.headshot?.href || item.image || '',
        }));
        result = { athletes, fetchedAt: now };
        break;
      }
      case 'game-log': {
        if (!athleteId) {
          return new Response(
            JSON.stringify({ success: false, error: 'athleteId required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const url = `${ESPN_COMMON}/${map.sport}/${map.league}/athletes/${athleteId}/gamelog`;
        console.log('Fetching game log:', url);
        try {
          const data = await fetchJson(url);
          const gameLog = parseGameLog(data);
          result = { ...gameLog, fetchedAt: now };
        } catch (e) {
          console.error('Game log failed:', e);
          result = { games: [], labels: [], seasonType: '', fetchedAt: now };
        }
        break;
      }
      case 'splits': {
        if (!athleteId) {
          return new Response(
            JSON.stringify({ success: false, error: 'athleteId required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const url = `${ESPN_COMMON}/${map.sport}/${map.league}/athletes/${athleteId}/splits`;
        console.log('Fetching splits:', url);
        try {
          const data = await fetchJson(url);
          const splits = parseSplits(data);
          result = { ...splits, fetchedAt: now };
        } catch (e) {
          console.error('Splits failed:', e);
          result = { categories: [], fetchedAt: now };
        }
        break;
      }
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid endpoint. Use: scoreboard, teams, standings, roster, player-stats, game-log, splits, search' }),
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
