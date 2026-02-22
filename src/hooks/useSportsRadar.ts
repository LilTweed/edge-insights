import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EspnSport } from "./useEspnData";

export interface SRGame {
  id: string;
  status: string;
  scheduled: string;
  homeTeam: {
    name: string;
    abbreviation: string;
    id: string;
    score: number | null;
  };
  awayTeam: {
    name: string;
    abbreviation: string;
    id: string;
    score: number | null;
  };
  venue: string;
  broadcast: string[];
}

export interface SRScheduleResult {
  games: SRGame[];
  gamesCount: number;
  fetchedAt: string;
  needsApiKey?: boolean;
  source: string;
}

async function fetchSRSchedule(sport: EspnSport): Promise<SRScheduleResult> {
  const { data, error } = await supabase.functions.invoke("sportsradar", {
    body: { sport, type: "schedule" },
  });
  if (error) throw new Error(error.message);
  if (!data?.success) {
    if (data?.needsApiKey) {
      return { games: [], gamesCount: 0, fetchedAt: "", needsApiKey: true, source: "sportsradar" };
    }
    throw new Error(data?.error || "Failed to fetch SportsRadar data");
  }
  return data as SRScheduleResult;
}

async function fetchSRStandings(sport: EspnSport) {
  const { data, error } = await supabase.functions.invoke("sportsradar", {
    body: { sport, type: "standings" },
  });
  if (error) throw new Error(error.message);
  if (!data?.success) throw new Error(data?.error || "Failed to fetch standings");
  return data;
}

async function fetchSRPlayer(sport: EspnSport, playerId: string) {
  const { data, error } = await supabase.functions.invoke("sportsradar", {
    body: { sport, type: "player", playerId },
  });
  if (error) throw new Error(error.message);
  if (!data?.success) throw new Error(data?.error || "Failed to fetch player");
  return data;
}

const SUPPORTED_SPORTS = ["NBA", "NFL", "MLB", "NHL", "NCAAB"];

export function useSportsRadarSchedule(sport: EspnSport, enabled: boolean) {
  return useQuery({
    queryKey: ["sportsradar-schedule", sport],
    queryFn: () => fetchSRSchedule(sport),
    enabled: enabled && SUPPORTED_SPORTS.includes(sport),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useSportsRadarStandings(sport: EspnSport, enabled: boolean) {
  return useQuery({
    queryKey: ["sportsradar-standings", sport],
    queryFn: () => fetchSRStandings(sport),
    enabled: enabled && SUPPORTED_SPORTS.includes(sport),
    staleTime: 300_000, // 5 min
  });
}

export function useSportsRadarPlayer(sport: EspnSport, playerId: string | null) {
  return useQuery({
    queryKey: ["sportsradar-player", sport, playerId],
    queryFn: () => fetchSRPlayer(sport, playerId!),
    enabled: !!playerId && SUPPORTED_SPORTS.includes(sport),
    staleTime: 300_000,
  });
}
