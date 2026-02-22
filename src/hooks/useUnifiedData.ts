import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  LiveGame,
  LiveStanding,
  EspnTeam,
  EspnRosterPlayer,
  EspnPlayerStats,
  EspnSport,
  GameLogData,
} from "./useEspnData";

/**
 * Unified data hooks: SportsRadar primary → ESPN fallback
 * Returns data in the same interfaces as useEspnData hooks.
 */

const SR_SPORTS = ["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF"];

// ─── helpers ───────────────────────────────────────────────────────

async function fetchSR(sport: EspnSport, type: string, extra?: Record<string, string>) {
  const { data, error } = await supabase.functions.invoke("sportsradar", {
    body: { sport, type, ...extra },
  });
  if (error) throw new Error(error.message);
  if (!data?.success) throw new Error(data?.error || "SR fetch failed");
  return data;
}

async function fetchESPN(sport: EspnSport, endpoint: string, extra?: Record<string, string>) {
  const { data, error } = await supabase.functions.invoke("espn-data", {
    body: { sport, endpoint, ...extra },
  });
  if (error) throw new Error(error.message);
  if (!data?.success) throw new Error(data?.error || "ESPN fetch failed");
  return data;
}

/** Try SR first, fall back to ESPN */
async function srThenEspn<T>(
  sport: EspnSport,
  srType: string,
  espnEndpoint: string,
  srExtra: Record<string, string> | undefined,
  espnExtra: Record<string, string> | undefined,
  transform: (data: any, source: "sr" | "espn") => T
): Promise<T> {
  if (SR_SPORTS.includes(sport)) {
    try {
      const srData = await fetchSR(sport, srType, srExtra);
      if (!srData.needsApiKey) {
        return transform(srData, "sr");
      }
    } catch (e) {
      console.warn(`[Unified] SR ${srType} failed for ${sport}, falling back to ESPN:`, e);
    }
  }
  const espnData = await fetchESPN(sport, espnEndpoint, espnExtra);
  return transform(espnData, "espn");
}

// ─── SCOREBOARD ────────────────────────────────────────────────────

function transformScoreboard(data: any, source: "sr" | "espn"): { games: LiveGame[]; fetchedAt: string } {
  if (source === "espn") {
    return { games: (data.games || []) as LiveGame[], fetchedAt: data.fetchedAt };
  }
  // Map SR schedule → LiveGame format
  const games: LiveGame[] = (data.games || []).map((g: any) => ({
    id: g.id,
    sport: "",
    status: g.status === "closed" ? "post" : g.status === "inprogress" ? "in" : "pre",
    statusDetail: g.status || "",
    date: g.scheduled || "",
    homeTeam: {
      id: g.homeTeam?.id || "",
      name: g.homeTeam?.name || "",
      abbreviation: g.homeTeam?.abbreviation || "",
      logo: g.homeTeam?.logo || "",
      record: g.homeTeam?.record || "",
    },
    awayTeam: {
      id: g.awayTeam?.id || "",
      name: g.awayTeam?.name || "",
      abbreviation: g.awayTeam?.abbreviation || "",
      logo: g.awayTeam?.logo || "",
      record: g.awayTeam?.record || "",
    },
    homeScore: g.homeTeam?.score ?? undefined,
    awayScore: g.awayTeam?.score ?? undefined,
    odds: [],
    broadcasts: g.broadcast || [],
  }));
  return { games, fetchedAt: data.fetchedAt };
}

export function useUnifiedScoreboard(sport: EspnSport) {
  return useQuery({
    queryKey: ["unified", "scoreboard", sport],
    queryFn: () =>
      srThenEspn(sport, "scoreboard", "scoreboard", undefined, undefined, transformScoreboard),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

// ─── STANDINGS ─────────────────────────────────────────────────────

function transformStandings(data: any, source: "sr" | "espn"): { standings: LiveStanding[]; fetchedAt: string } {
  if (source === "espn") {
    return { standings: (data.standings || []) as LiveStanding[], fetchedAt: data.fetchedAt };
  }
  const standings: LiveStanding[] = (data.standings || []).map((s: any) => ({
    team: {
      id: s.team?.id || "",
      name: s.team?.name || "",
      abbreviation: s.team?.abbreviation || "",
      logo: s.team?.logo || "",
    },
    conference: s.conference || "",
    division: s.division || "",
    wins: s.wins || "0",
    losses: s.losses || "0",
    pct: s.pct || "",
    streak: s.streak || "",
    sport: s.sport || "",
  }));
  return { standings, fetchedAt: data.fetchedAt };
}

export function useUnifiedStandings(sport: EspnSport) {
  return useQuery({
    queryKey: ["unified", "standings", sport],
    queryFn: () =>
      srThenEspn(sport, "standings", "standings", undefined, undefined, transformStandings),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

// ─── TEAMS ─────────────────────────────────────────────────────────

function transformTeams(data: any, source: "sr" | "espn"): EspnTeam[] {
  if (source === "espn") {
    return (data.teams || []) as EspnTeam[];
  }
  return (data.teams || []).map((t: any) => ({
    id: t.id || "",
    name: t.name || "",
    abbreviation: t.abbreviation || "",
    logo: t.logo || "",
    record: t.record || "",
    sport: t.sport || "",
    standingSummary: t.standingSummary || "",
  }));
}

export function useUnifiedTeams(sport: EspnSport) {
  return useQuery({
    queryKey: ["unified", "teams", sport],
    queryFn: () =>
      srThenEspn(sport, "teams", "teams", undefined, undefined, transformTeams),
    staleTime: 5 * 60_000,
  });
}

// ─── ROSTER ────────────────────────────────────────────────────────

function transformRoster(data: any, source: "sr" | "espn"): EspnRosterPlayer[] {
  return (data.roster || []) as EspnRosterPlayer[];
}

export function useUnifiedRoster(sport: EspnSport, teamId: string | undefined) {
  return useQuery({
    queryKey: ["unified", "roster", sport, teamId],
    queryFn: () =>
      srThenEspn(
        sport,
        "roster",
        "roster",
        teamId ? { teamId } : undefined,
        teamId ? { teamId } : undefined,
        transformRoster
      ),
    enabled: !!teamId,
    staleTime: 5 * 60_000,
  });
}

// ─── PLAYER STATS ──────────────────────────────────────────────────

function transformPlayerStats(data: any, source: "sr" | "espn"): EspnPlayerStats {
  return {
    athlete: data.athlete || null,
    seasons: data.seasons || [],
    career: data.career || null,
    fetchedAt: data.fetchedAt,
  };
}

export function useUnifiedPlayerStats(sport: EspnSport, athleteId: string | undefined) {
  return useQuery({
    queryKey: ["unified", "player-stats", sport, athleteId],
    queryFn: () =>
      srThenEspn(
        sport,
        "player-stats",
        "player-stats",
        athleteId ? { playerId: athleteId } : undefined,
        athleteId ? { athleteId } : undefined,
        transformPlayerStats
      ),
    enabled: !!athleteId,
    staleTime: 2 * 60_000,
  });
}

// ─── GAME LOG (ESPN only — SR doesn't have equivalent trial endpoint) ──

export function useUnifiedGameLog(sport: EspnSport, athleteId: string | undefined) {
  return useQuery({
    queryKey: ["unified", "game-log", sport, athleteId],
    queryFn: async (): Promise<GameLogData> => {
      const data = await fetchESPN(sport, "game-log", { athleteId: athleteId! });
      return {
        games: data.games || [],
        labels: data.labels || [],
        seasonType: data.seasonType || "",
        fetchedAt: data.fetchedAt,
      };
    },
    enabled: !!athleteId,
    staleTime: 2 * 60_000,
  });
}

// ─── SEARCH (ESPN only) ────────────────────────────────────────────

export function useUnifiedPlayerSearch(sport: EspnSport, query: string) {
  return useQuery({
    queryKey: ["unified", "search", sport, query],
    queryFn: async () => {
      const data = await fetchESPN(sport, "search", { query });
      return data.athletes || [];
    },
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}
