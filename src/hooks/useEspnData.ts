import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LiveGame {
  id: string;
  sport: string;
  status: string;
  statusDetail: string;
  date: string;
  homeTeam: {
    id: string;
    name: string;
    abbreviation: string;
    logo: string;
    record: string;
  };
  awayTeam: {
    id: string;
    name: string;
    abbreviation: string;
    logo: string;
    record: string;
  };
  homeScore?: number;
  awayScore?: number;
  odds: {
    provider: string;
    spread: number;
    overUnder: number;
    homeMoneyLine: number;
    awayMoneyLine: number;
  }[];
  broadcasts: string[];
}

export interface LiveStanding {
  team: {
    id: string;
    name: string;
    abbreviation: string;
    logo: string;
  };
  conference: string;
  division: string;
  wins: string;
  losses: string;
  pct: string;
  streak: string;
  sport: string;
}

export interface EspnTeam {
  id: string;
  name: string;
  abbreviation: string;
  logo: string;
  record: string;
  sport: string;
  standingSummary: string;
}

export interface EspnRosterPlayer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  number: string;
  headshot: string;
  teamId: string;
  sport: string;
  age: number;
  height: string;
  weight: string;
  experience: number;
  college: string;
  birthPlace: string;
  status: string;
}

export interface EspnSeasonStat {
  season: string;
  category: string;
  stats: Record<string, string>;
}

export interface EspnAthleteInfo {
  id: string;
  name: string;
  team: string;
  teamAbbr: string;
  position: string;
  number: string;
  headshot: string;
}

export interface EspnPlayerStats {
  athlete: EspnAthleteInfo | null;
  seasons: EspnSeasonStat[];
  career: any;
  fetchedAt: string;
}

type EspnEndpoint = "scoreboard" | "teams" | "standings" | "roster" | "player-stats" | "game-log" | "splits" | "search";
export type EspnSport = "NBA" | "NFL" | "MLB" | "NHL" | "NCAAB" | "NCAAF" | "UFC" | "PGA" | "WNBA";

export interface GameLogEntry {
  eventId: string;
  date: string;
  opponent: string;
  opponentAbbr: string;
  opponentLogo: string;
  homeAway: string;
  atVs: string;
  result: string;
  score: string;
  stats: Record<string, string>;
  category: string;
  seasonType: string;
  isTotal?: boolean;
}

export interface GameLogData {
  games: GameLogEntry[];
  labels: string[];
  seasonType: string;
  fetchedAt: string;
}

async function fetchEspn(sport: EspnSport, endpoint: EspnEndpoint, extra?: Record<string, string>) {
  const { data, error } = await supabase.functions.invoke("espn-data", {
    body: { sport, endpoint, ...extra },
  });
  if (error) throw new Error(error.message);
  if (!data?.success) throw new Error(data?.error || "Failed to fetch");
  return data;
}

export function useLiveScoreboard(sport: EspnSport) {
  return useQuery({
    queryKey: ["espn", "scoreboard", sport],
    queryFn: () => fetchEspn(sport, "scoreboard"),
    refetchInterval: 30_000,
    staleTime: 15_000,
    select: (data) => ({
      games: (data.games || []) as LiveGame[],
      fetchedAt: data.fetchedAt as string,
    }),
  });
}

export function useLiveStandings(sport: EspnSport) {
  return useQuery({
    queryKey: ["espn", "standings", sport],
    queryFn: () => fetchEspn(sport, "standings"),
    refetchInterval: 60_000,
    staleTime: 30_000,
    select: (data) => ({
      standings: (data.standings || []) as LiveStanding[],
      fetchedAt: data.fetchedAt as string,
    }),
  });
}

export function useEspnTeams(sport: EspnSport) {
  return useQuery({
    queryKey: ["espn", "teams", sport],
    queryFn: () => fetchEspn(sport, "teams"),
    staleTime: 5 * 60_000, // 5 min
    select: (data) => (data.teams || []) as EspnTeam[],
  });
}

export function useTeamRoster(sport: EspnSport, teamId: string | undefined) {
  return useQuery({
    queryKey: ["espn", "roster", sport, teamId],
    queryFn: () => fetchEspn(sport, "roster", { teamId: teamId! }),
    enabled: !!teamId,
    staleTime: 5 * 60_000,
    select: (data) => (data.roster || []) as EspnRosterPlayer[],
  });
}

export function usePlayerStats(sport: EspnSport, athleteId: string | undefined) {
  return useQuery({
    queryKey: ["espn", "player-stats", sport, athleteId],
    queryFn: () => fetchEspn(sport, "player-stats", { athleteId: athleteId! }),
    enabled: !!athleteId,
    staleTime: 2 * 60_000, // 2 min
    select: (data): EspnPlayerStats => ({
      athlete: data.athlete || null,
      seasons: data.seasons || [],
      career: data.career || null,
      fetchedAt: data.fetchedAt,
    }),
  });
}

export function usePlayerSearch(sport: EspnSport, query: string) {
  return useQuery({
    queryKey: ["espn", "search", sport, query],
    queryFn: () => fetchEspn(sport, "search", { query }),
    enabled: query.length >= 2,
    staleTime: 30_000,
    select: (data) => data.athletes || [],
  });
}

export function usePlayerGameLog(sport: EspnSport, athleteId: string | undefined) {
  return useQuery({
    queryKey: ["espn", "game-log", sport, athleteId],
    queryFn: () => fetchEspn(sport, "game-log", { athleteId: athleteId! }),
    enabled: !!athleteId,
    staleTime: 2 * 60_000,
    select: (data): GameLogData => ({
      games: (data.games || []) as GameLogEntry[],
      labels: data.labels || [],
      seasonType: data.seasonType || '',
      fetchedAt: data.fetchedAt,
    }),
  });
}
