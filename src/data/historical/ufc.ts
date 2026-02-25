import { buildPlayers, type PlayerDef } from './generator';
import type { TeamHistorical } from './generator';

// UFC doesn't have traditional "teams" — we model weight classes as teams
export const ufcTeams: TeamHistorical[] = []; // no team seasons for UFC

const P: PlayerDef[] = [
  // Heavyweight
  { id: "aspinall", name: "Tom Aspinall", pos: "Heavyweight", team: "UFC", teamAbbr: "HW", yrs: 5, base: { wins: 1, losses: 0, koTko: 0.6, submissions: 0.2, decisions: 0.2, strikesLandedPerMin: 5.2, takedownAvg: 1.5, strikingAccuracy: 58 } },
  { id: "jones", name: "Jon Jones", pos: "Heavyweight", team: "UFC", teamAbbr: "HW", base: { wins: 1, losses: 0, koTko: 0.3, submissions: 0.3, decisions: 0.4, strikesLandedPerMin: 4.3, takedownAvg: 2.8, strikingAccuracy: 57 } },
  { id: "miocic", name: "Stipe Miocic", pos: "Heavyweight", team: "UFC", teamAbbr: "HW", yrs: 8, base: { wins: 0.7, losses: 0.3, koTko: 0.5, submissions: 0.1, decisions: 0.4, strikesLandedPerMin: 4.5, takedownAvg: 2.2, strikingAccuracy: 52 } },
  // Light Heavyweight
  { id: "pereira", name: "Alex Pereira", pos: "Light Heavyweight", team: "UFC", teamAbbr: "LHW", yrs: 4, base: { wins: 1, losses: 0, koTko: 0.7, submissions: 0, decisions: 0.3, strikesLandedPerMin: 5.5, takedownAvg: 0.2, strikingAccuracy: 56 } },
  { id: "ankalaev", name: "Magomed Ankalaev", pos: "Light Heavyweight", team: "UFC", teamAbbr: "LHW", yrs: 6, base: { wins: 0.8, losses: 0.1, koTko: 0.4, submissions: 0.1, decisions: 0.5, strikesLandedPerMin: 3.8, takedownAvg: 2.0, strikingAccuracy: 52 } },
  // Middleweight
  { id: "duplesis", name: "Dricus Du Plessis", pos: "Middleweight", team: "UFC", teamAbbr: "MW", yrs: 5, base: { wins: 1, losses: 0, koTko: 0.5, submissions: 0.3, decisions: 0.2, strikesLandedPerMin: 5.8, takedownAvg: 1.2, strikingAccuracy: 55 } },
  { id: "adesanya", name: "Israel Adesanya", pos: "Middleweight", team: "UFC", teamAbbr: "MW", yrs: 7, base: { wins: 0.7, losses: 0.3, koTko: 0.5, submissions: 0, decisions: 0.5, strikesLandedPerMin: 3.6, takedownAvg: 0.3, strikingAccuracy: 48 } },
  // Welterweight
  { id: "belal", name: "Belal Muhammad", pos: "Welterweight", team: "UFC", teamAbbr: "WW", yrs: 8, base: { wins: 0.8, losses: 0.1, koTko: 0.1, submissions: 0.1, decisions: 0.8, strikesLandedPerMin: 4.0, takedownAvg: 3.2, strikingAccuracy: 46 } },
  { id: "shavkat", name: "Shavkat Rakhmonov", pos: "Welterweight", team: "UFC", teamAbbr: "WW", yrs: 5, base: { wins: 1, losses: 0, koTko: 0.4, submissions: 0.5, decisions: 0.1, strikesLandedPerMin: 4.8, takedownAvg: 2.5, strikingAccuracy: 54 } },
  // Lightweight
  { id: "makhachev", name: "Islam Makhachev", pos: "Lightweight", team: "UFC", teamAbbr: "LW", yrs: 8, base: { wins: 1, losses: 0, koTko: 0.2, submissions: 0.4, decisions: 0.4, strikesLandedPerMin: 4.2, takedownAvg: 4.0, strikingAccuracy: 52 } },
  { id: "oliveira", name: "Charles Oliveira", pos: "Lightweight", team: "UFC", teamAbbr: "LW", base: { wins: 0.7, losses: 0.3, koTko: 0.3, submissions: 0.5, decisions: 0.2, strikesLandedPerMin: 3.5, takedownAvg: 2.8, strikingAccuracy: 49 } },
  // Featherweight
  { id: "topuria", name: "Ilia Topuria", pos: "Featherweight", team: "UFC", teamAbbr: "FW", yrs: 5, base: { wins: 1, losses: 0, koTko: 0.6, submissions: 0.2, decisions: 0.2, strikesLandedPerMin: 5.0, takedownAvg: 2.0, strikingAccuracy: 55 } },
  { id: "volkanovski", name: "Alexander Volkanovski", pos: "Featherweight", team: "UFC", teamAbbr: "FW", yrs: 8, base: { wins: 0.8, losses: 0.2, koTko: 0.3, submissions: 0.1, decisions: 0.6, strikesLandedPerMin: 6.2, takedownAvg: 1.8, strikingAccuracy: 56 } },
  // Bantamweight
  { id: "merab", name: "Merab Dvalishvili", pos: "Bantamweight", team: "UFC", teamAbbr: "BW", yrs: 7, base: { wins: 0.8, losses: 0.1, koTko: 0.1, submissions: 0.1, decisions: 0.8, strikesLandedPerMin: 5.8, takedownAvg: 5.5, strikingAccuracy: 42 } },
  { id: "omalley", name: "Sean O'Malley", pos: "Bantamweight", team: "UFC", teamAbbr: "BW", yrs: 7, base: { wins: 0.8, losses: 0.2, koTko: 0.6, submissions: 0.1, decisions: 0.3, strikesLandedPerMin: 5.5, takedownAvg: 0.5, strikingAccuracy: 58 } },
  // Flyweight
  { id: "pantoja", name: "Alexandre Pantoja", pos: "Flyweight", team: "UFC", teamAbbr: "FLW", yrs: 8, base: { wins: 0.7, losses: 0.3, koTko: 0.2, submissions: 0.4, decisions: 0.4, strikesLandedPerMin: 4.8, takedownAvg: 2.5, strikingAccuracy: 50 } },
  { id: "royval", name: "Brandon Royval", pos: "Flyweight", team: "UFC", teamAbbr: "FLW", yrs: 6, base: { wins: 0.7, losses: 0.3, koTko: 0.3, submissions: 0.4, decisions: 0.3, strikesLandedPerMin: 5.2, takedownAvg: 1.8, strikingAccuracy: 48 } },
];

export const ufcPlayers = buildPlayers(P, 'UFC');
