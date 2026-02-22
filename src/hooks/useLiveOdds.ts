import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EspnSport } from "./useEspnData";
import type { PropLine, Sportsbook } from "@/data/mockData";

export interface LiveProp {
  id: string;
  playerName: string;
  stat: string;
  line: number;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  sport: string;
  sportsbooks: {
    sportsbook: string;
    over: number;
    under: number;
    line: number;
  }[];
}

export interface LiveOddsResult {
  props: LiveProp[];
  eventsCount: number;
  apiUsage: { remaining: string | null; used: string | null };
  fetchedAt: string;
  needsApiKey?: boolean;
}

async function fetchLiveOdds(sport: EspnSport): Promise<LiveOddsResult> {
  const { data, error } = await supabase.functions.invoke("live-odds", {
    body: { sport },
  });
  if (error) throw new Error(error.message);
  if (!data?.success) {
    if (data?.needsApiKey) {
      return { props: [], eventsCount: 0, apiUsage: { remaining: null, used: null }, fetchedAt: "", needsApiKey: true };
    }
    throw new Error(data?.error || "Failed to fetch odds");
  }
  return data as LiveOddsResult;
}

/** Convert live odds format to PropLine format for compatibility with existing components */
function toMockFormat(liveProp: LiveProp, sport: string): PropLine {
  const sbMap: Record<string, Sportsbook> = {
    fanduel: "FanDuel",
    draftkings: "DraftKings",
    betmgm: "BetMGM",
    bovada: "Bovada",
    fanatics: "Fanatics",
  };

  return {
    id: liveProp.id,
    playerId: liveProp.playerName.toLowerCase().replace(/\s+/g, "-"),
    playerName: liveProp.playerName,
    teamAbbr: "", // Not available from odds API
    stat: liveProp.stat,
    line: liveProp.line,
    sport: sport as PropLine["sport"],
    sportsbooks: liveProp.sportsbooks.map((sb) => ({
      sportsbook: (sbMap[sb.sportsbook.toLowerCase()] || sb.sportsbook) as Sportsbook,
      over: sb.over,
      under: sb.under,
      line: sb.line,
    })),
    hitRate: 0, // Not available without historical data
    hitRateLast10: 0,
    gamesPlayed: 0,
  };
}

export function useLiveOdds(sport: EspnSport, enabled: boolean) {
  return useQuery({
    queryKey: ["live-odds", sport],
    queryFn: () => fetchLiveOdds(sport),
    enabled,
    refetchInterval: 60_000, // Refresh every 60s
    staleTime: 30_000,
    select: (data): { props: PropLine[]; needsApiKey: boolean; fetchedAt: string; apiUsage: LiveOddsResult["apiUsage"] } => ({
      props: data.props.map((p) => toMockFormat(p, sport)),
      needsApiKey: data.needsApiKey ?? false,
      fetchedAt: data.fetchedAt,
      apiUsage: data.apiUsage,
    }),
  });
}
