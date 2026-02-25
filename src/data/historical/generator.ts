// Deterministic data generator for comprehensive historical stats
import type { Sport } from "../mockData";

// ── Types ──────────────────────────────────────────────────────────

export interface TeamSeason {
  year: string; record: string; winPct: number; homeRecord: string; awayRecord: string;
  ppg: number; oppPpg: number; last5: string; playoffs?: string;
}

export interface TeamHistorical {
  id: string; name: string; abbreviation: string; city: string; sport: Sport; conference: string;
  seasons: TeamSeason[]; h2h: Record<string, { wins: number; losses: number }>;
}

export interface PlayerSeason {
  year: string; team: string; gamesPlayed: number; stats: Record<string, number>;
}

export interface PlayerHistorical {
  id: string; name: string; sport: Sport; position: string; team: string; teamAbbr: string;
  seasons: PlayerSeason[];
}

// ── Seeded RNG ─────────────────────────────────────────────────────

function seeded(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return () => {
    h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b);
    h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b);
    h ^= h >>> 16; return (h >>> 0) / 4294967296;
  };
}

function vary(rng: () => number, base: number, pct: number): number {
  return base * (1 + (rng() - 0.5) * 2 * pct);
}
function r1(n: number): number { return Math.round(n * 10) / 10; }
function r3(n: number): number { return Math.round(n * 1000) / 1000; }

// ── Constants ──────────────────────────────────────────────────────

const DUAL_YEARS = ['2024-25','2023-24','2022-23','2021-22','2020-21','2019-20','2018-19','2017-18','2016-17','2015-16'];
const SINGLE_YEARS = ['2024','2023','2022','2021','2020','2019','2018','2017','2016','2015'];

function getYears(sport: Sport): string[] {
  return (sport === 'NFL' || sport === 'MLB' || sport === 'UFC') ? SINGLE_YEARS : DUAL_YEARS;
}

function getTotalGames(sport: Sport, yearIdx: number): number {
  if (sport === 'NFL') return yearIdx >= 3 ? 16 : 17; // 17 games from 2021+
  if (sport === 'MLB') return yearIdx === 4 ? 60 : 162; // 2020 COVID season
  if (sport === 'Soccer') return 38;
  if (sport === 'UFC') return Math.ceil(Math.random() * 3) + 1;
  return 82; // NBA, NHL
}

// ── Team Definition ────────────────────────────────────────────────

export interface TeamDef {
  id: string; name: string; abbr: string; city: string; conf: string;
  baseWin: number; basePpg: number; baseOpp: number;
  rivals?: Record<string, [number, number]>;
  po?: Record<string, string>; // year → playoff result
}

export function buildTeam(def: TeamDef, sport: Sport): TeamHistorical {
  const rng = seeded(def.id + sport + 'ts');
  const years = getYears(sport);
  const isNHL = sport === 'NHL';
  const isSoccer = sport === 'Soccer';

  const seasons: TeamSeason[] = years.map((year, i) => {
    const totalG = getTotalGames(sport, i);
    const drift = (rng() - 0.5) * 0.2;
    const wp = Math.max(0.22, Math.min(0.82, def.baseWin + drift));
    const wins = Math.round(wp * totalG);

    let losses: number, otl = 0, draws = 0;
    if (isNHL) { otl = Math.min(Math.round(rng() * 8), totalG - wins); losses = totalG - wins - otl; }
    else if (isSoccer) { draws = Math.min(Math.round(rng() * 8), totalG - wins); losses = totalG - wins - draws; }
    else { losses = totalG - wins; }

    const record = isNHL ? `${wins}-${losses}-${otl}` : isSoccer ? `${wins}-${draws}-${losses}` : `${wins}-${losses}`;

    const homeG = Math.round(totalG / 2);
    const awayG = totalG - homeG;
    const hw = Math.min(Math.round(wins * (0.54 + rng() * 0.12)), homeG);
    const aw = wins - hw;

    let homeRecord: string, awayRecord: string;
    if (isNHL) {
      const ho = Math.min(Math.round(otl * 0.4), homeG - hw);
      homeRecord = `${hw}-${Math.max(0, homeG - hw - ho)}-${ho}`;
      awayRecord = `${aw}-${Math.max(0, awayG - aw - (otl - ho))}-${otl - ho}`;
    } else if (isSoccer) {
      const hd = Math.min(Math.round(draws * 0.4), homeG - hw);
      homeRecord = `${hw}-${hd}-${Math.max(0, homeG - hw - hd)}`;
      awayRecord = `${aw}-${draws - hd}-${Math.max(0, awayG - aw - (draws - hd))}`;
    } else {
      homeRecord = `${hw}-${Math.max(0, homeG - hw)}`;
      awayRecord = `${aw}-${Math.max(0, awayG - aw)}`;
    }

    const ppg = r1(vary(rng, def.basePpg, 0.08));
    const oppPpg = r1(vary(rng, def.baseOpp, 0.08));

    const l5: string[] = [];
    for (let j = 0; j < 5; j++) {
      const r = rng();
      if (isSoccer) l5.push(r < wp ? 'W' : r < wp + 0.15 ? 'D' : 'L');
      else if (isNHL) l5.push(r < wp ? 'W' : r < wp + 0.08 ? 'OTL' : 'L');
      else l5.push(r < wp ? 'W' : 'L');
    }

    return { year, record, winPct: r3(wp), homeRecord, awayRecord, ppg, oppPpg, last5: l5.join('-'), playoffs: def.po?.[year] };
  });

  const h2h: Record<string, { wins: number; losses: number }> = {};
  if (def.rivals) for (const [opp, [w, l]] of Object.entries(def.rivals)) h2h[opp] = { wins: w, losses: l };

  return { id: def.id, name: def.name, abbreviation: def.abbr, city: def.city, sport, conference: def.conf, seasons, h2h };
}

// ── Player Definition ──────────────────────────────────────────────

export interface PlayerDef {
  id: string; name: string; pos: string; team: string; teamAbbr: string;
  yrs?: number; base: Record<string, number>;
}

export function buildPlayer(def: PlayerDef, sport: Sport): PlayerHistorical {
  const rng = seeded(def.id + sport + 'ps');
  const years = getYears(sport);
  const numYears = def.yrs ?? 10;

  const seasons: PlayerSeason[] = [];
  for (let i = 0; i < numYears && i < years.length; i++) {
    const maxG = getTotalGames(sport, i);
    const gp = sport === 'UFC' ? Math.min(Math.round(1 + rng() * 2.5), 4) : Math.round(maxG * (0.7 + rng() * 0.3));
    const stats: Record<string, number> = {};

    for (const [key, base] of Object.entries(def.base)) {
      const ageDrift = 1 + (rng() - 0.5) * 0.04 * i;
      const val = vary(rng, base * ageDrift, 0.1);
      if (key === 'avg' || key === 'obp' || key === 'slg' || key === 'ops') stats[key] = r3(val);
      else if (key.includes('Pct') || key.includes('Accuracy') || key === 'passAccuracy') stats[key] = r1(val);
      else stats[key] = r1(val);
    }
    seasons.push({ year: years[i], team: def.teamAbbr, gamesPlayed: gp, stats });
  }

  return { id: def.id, name: def.name, sport, position: def.pos, team: def.team, teamAbbr: def.teamAbbr, seasons };
}

export function buildTeams(defs: TeamDef[], sport: Sport): TeamHistorical[] { return defs.map(d => buildTeam(d, sport)); }
export function buildPlayers(defs: PlayerDef[], sport: Sport): PlayerHistorical[] { return defs.map(d => buildPlayer(d, sport)); }
