import { useState, useCallback, useEffect } from "react";
import { allTeams, allPlayers, type Team } from "@/data/mockData";

const STORAGE_KEY = "lvrg_notifications";
const LAST_GEN_KEY = "lvrg_notifications_lastGen";

export interface Notification {
  id: string;
  teamId: string;
  teamAbbr: string;
  teamName: string;
  title: string;
  body: string;
  type: "stats" | "player" | "news";
  timestamp: number;
  read: boolean;
}

function getStored(): Notification[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(notifications: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

const NEWS_TEMPLATES = [
  (t: Team) => ({ title: `${t.name} Weekly Recap`, body: `${t.city} ${t.name} (${t.record ?? "—"}) had a strong week with key performances across the roster. Check the research tab for full breakdown.`, type: "news" as const }),
  (t: Team) => ({ title: `${t.name} Injury Update`, body: `Several roster updates for the ${t.name} this week. Monitor the injury report before locking in props.`, type: "news" as const }),
  (t: Team) => ({ title: `${t.name} Trending Up`, body: `The ${t.name} have been on a hot streak. Their offensive numbers are above season averages in recent games.`, type: "news" as const }),
];

const STAT_TEMPLATES = [
  (t: Team) => ({ title: `${t.name} Stat Alert`, body: `${t.city} ${t.name} are averaging ${t.stats?.ppg?.toFixed(1) ?? "—"} PPG this season. ${(t.stats?.ppg ?? 0) > (t.stats?.oppPpg ?? 0) ? "Outscoring opponents" : "Being outscored"} by ${Math.abs((t.stats?.ppg ?? 0) - (t.stats?.oppPpg ?? 0)).toFixed(1)} per game.`, type: "stats" as const }),
  (t: Team) => ({ title: `${t.name} Defensive Update`, body: `The ${t.name} are allowing ${t.stats?.oppPpg?.toFixed(1) ?? "—"} PPG to opponents this season. Defensive metrics trending ${(t.stats?.oppPpg ?? 100) < 100 ? "positively" : "in line with league average"}.`, type: "stats" as const }),
];

const PLAYER_TEMPLATES = (t: Team) => {
  const teamPlayers = allPlayers.filter(p => p.teamAbbr === t.abbreviation);
  if (teamPlayers.length === 0) return null;
  const player = teamPlayers[Math.floor(Math.random() * teamPlayers.length)];
  return {
    title: `${player.name} Update`,
    body: `${player.name} (${t.abbreviation}) is averaging ${player.seasonAverages.points.toFixed(1)} pts over the season. Last 5 games: ${player.last5.points.toFixed(1)} pts — ${player.last5.points > player.seasonAverages.points ? "trending up 📈" : "slight dip 📉"}.`,
    type: "player" as const,
  };
};

/** Generate weekly-ish notifications for favorited teams (simulated) */
function generateNotifications(favoriteTeamIds: string[]): Notification[] {
  const now = Date.now();
  const lastGen = parseInt(localStorage.getItem(LAST_GEN_KEY) || "0", 10);
  
  // Only generate new ones every 30 minutes (simulates weekly cadence in dev)
  if (now - lastGen < 30 * 60 * 1000 && getStored().length > 0) return getStored();

  const existing = getStored();
  const newNotifs: Notification[] = [];

  for (const teamId of favoriteTeamIds) {
    const team = allTeams.find(t => t.id === teamId);
    if (!team) continue;

    // Pick 1-2 random notifications per team
    const templates = [...NEWS_TEMPLATES, ...STAT_TEMPLATES];
    const picked = templates[Math.floor(Math.random() * templates.length)](team);
    const playerNotif = PLAYER_TEMPLATES(team);

    const baseTime = now - Math.floor(Math.random() * 6 * 24 * 60 * 60 * 1000); // within last 6 days

    newNotifs.push({
      id: `notif_${teamId}_${baseTime}`,
      teamId,
      teamAbbr: team.abbreviation,
      teamName: team.name,
      title: picked.title,
      body: picked.body,
      type: picked.type,
      timestamp: baseTime,
      read: false,
    });

    if (playerNotif) {
      newNotifs.push({
        id: `notif_${teamId}_player_${baseTime}`,
        teamId,
        teamAbbr: team.abbreviation,
        teamName: team.name,
        title: playerNotif.title,
        body: playerNotif.body,
        type: playerNotif.type,
        timestamp: baseTime - Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000),
        read: false,
      });
    }
  }

  // Merge: keep existing read ones, add new unread
  const existingIds = new Set(existing.map(n => n.id));
  const merged = [
    ...existing,
    ...newNotifs.filter(n => !existingIds.has(n.id)),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 50); // cap at 50

  localStorage.setItem(LAST_GEN_KEY, String(now));
  save(merged);
  return merged;
}

export function useNotifications(favoriteTeamIds: string[]) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const notifs = generateNotifications(favoriteTeamIds);
    setNotifications(notifs);
  }, [favoriteTeamIds.join(",")]);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      save(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      save(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    save([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, markRead, markAllRead, clearAll };
}
