import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EspnSport } from "./useEspnData";
import type { PropLine, Sportsbook } from "@/data/mockData";

export interface SRProp {
  id: string;
  playerName: string;
  stat: string;
  line: number;
  homeTeam: string;
  awayTeam: string;
  homeAbbr: string;
  awayAbbr: string;
  commenceTime: string;
  sport: string;
  sportsbooks: {
    sportsbook: string;
    sportsbookKey: string;
    over: number;
    under: number;
    line: number;
  }[];
}

export interface SRResult {
  props: SRProp[];
  eventsCount: number;
  fetchedAt: string;
  needsApiKey?: boolean;
  source: string;
}

async function fetchSRProps(sport: EspnSport): Promise<SRResult> {
  const { data, error } = await supabase.functions.invoke("sportsradar", {
    body: { sport, type: "props" },
  });
  if (error) throw new Error(error.message);
  if (!data?.success) {
    if (data?.needsApiKey) {
      return { props: [], eventsCount: 0, fetchedAt: "", needsApiKey: true, source: "sportsradar" };
    }
    throw new Error(data?.error || "Failed to fetch SportsRadar data");
  }
  return data as SRResult;
}

const SB_NAME_MAP: Record<string, Sportsbook> = {
  fanduel: "FanDuel",
  draftkings: "DraftKings",
  betmgm: "BetMGM",
  bovada: "Bovada",
  fanatics: "Fanatics",
};

function normalizeSportsbook(name: string): Sportsbook {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(SB_NAME_MAP)) {
    if (lower.includes(key)) return val;
  }
  return name as Sportsbook;
}

function toMockFormat(prop: SRProp, sport: string): PropLine {
  return {
    id: prop.id,
    playerId: prop.playerName.toLowerCase().replace(/\s+/g, "-"),
    playerName: prop.playerName,
    teamAbbr: prop.homeAbbr || "",
    stat: prop.stat,
    line: prop.line,
    sport: sport as PropLine["sport"],
    sportsbooks: prop.sportsbooks.map((sb) => ({
      sportsbook: normalizeSportsbook(sb.sportsbook),
      over: sb.over,
      under: sb.under,
      line: sb.line,
    })),
    hitRate: 0,
    hitRateLast10: 0,
    gamesPlayed: 0,
  };
}

export function useSportsRadar(sport: EspnSport, enabled: boolean) {
  return useQuery({
    queryKey: ["sportsradar-props", sport],
    queryFn: () => fetchSRProps(sport),
    enabled,
    refetchInterval: 60_000,
    staleTime: 30_000,
    select: (data) => ({
      props: data.props.map((p) => toMockFormat(p, sport)),
      needsApiKey: data.needsApiKey ?? false,
      fetchedAt: data.fetchedAt,
      source: data.source,
    }),
  });
}
