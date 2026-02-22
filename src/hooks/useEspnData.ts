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

type EspnEndpoint = "scoreboard" | "teams" | "standings";
type EspnSport = "NBA" | "NFL" | "MLB" | "NHL" | "NCAAB" | "NCAAF";

async function fetchEspn(sport: EspnSport, endpoint: EspnEndpoint) {
  const { data, error } = await supabase.functions.invoke("espn-data", {
    body: { sport, endpoint },
  });
  if (error) throw new Error(error.message);
  if (!data?.success) throw new Error(data?.error || "Failed to fetch");
  return data;
}

export function useLiveScoreboard(sport: EspnSport) {
  return useQuery({
    queryKey: ["espn", "scoreboard", sport],
    queryFn: () => fetchEspn(sport, "scoreboard"),
    refetchInterval: 30_000, // 30 seconds
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
    refetchInterval: 60_000, // 1 minute
    staleTime: 30_000,
    select: (data) => ({
      standings: (data.standings || []) as LiveStanding[],
      fetchedAt: data.fetchedAt as string,
    }),
  });
}
