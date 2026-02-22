import { Link } from "react-router-dom";
import type { PlayerInjuryHistory, MatchupHistory, Team } from "@/data/mockData";
import { allTeams } from "@/data/mockData";

const severityColor = (severity: string) => {
  switch (severity) {
    case "Season-Ending": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "Major": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "Moderate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Minor": return "bg-green-500/20 text-green-400 border-green-500/30";
    default: return "bg-muted text-muted-foreground";
  }
};

const severityBarWidth = (severity: string) => {
  switch (severity) {
    case "Season-Ending": return "w-full";
    case "Major": return "w-3/4";
    case "Moderate": return "w-1/2";
    case "Minor": return "w-1/4";
    default: return "w-0";
  }
};

const severityBarColor = (severity: string) => {
  switch (severity) {
    case "Season-Ending": return "bg-red-500";
    case "Major": return "bg-orange-500";
    case "Moderate": return "bg-yellow-500";
    case "Minor": return "bg-green-500";
    default: return "bg-muted";
  }
};

// ─── Injury History Panel ───────────────────────────────────────
interface InjuryHistoryPanelProps {
  injuryHistory: PlayerInjuryHistory | undefined;
  playerName?: string;
}

export const InjuryHistoryPanel = ({ injuryHistory, playerName }: InjuryHistoryPanelProps) => {
  if (!injuryHistory || injuryHistory.history.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">🩺 Injury History</h2>
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            ✅ {playerName || "Player"} has no recorded injury history — clean bill of health
          </p>
        </div>
      </div>
    );
  }

  const totalMissed = injuryHistory.history.reduce((sum, h) => sum + h.missedGames, 0);
  const bodyParts = [...new Set(injuryHistory.history.map(h => h.bodyPart))];
  const majorCount = injuryHistory.history.filter(h => h.severity === "Major" || h.severity === "Season-Ending").length;

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-foreground">🩺 Injury History</h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Summary Row */}
        <div className="border-b border-border bg-secondary/30 px-4 py-3 flex flex-wrap items-center gap-4">
          <div className="text-center">
            <p className="font-mono text-lg font-bold text-foreground">{injuryHistory.history.length}</p>
            <p className="text-[9px] font-medium text-muted-foreground">Injuries</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg font-bold text-foreground">{totalMissed}</p>
            <p className="text-[9px] font-medium text-muted-foreground">Games Missed</p>
          </div>
          <div className="text-center">
            <p className={`font-mono text-lg font-bold ${majorCount > 0 ? "text-red-400" : "text-green-400"}`}>{majorCount}</p>
            <p className="text-[9px] font-medium text-muted-foreground">Major / S.E.</p>
          </div>
          <div className="flex flex-wrap gap-1 ml-auto">
            {bodyParts.map(bp => (
              <span key={bp} className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {bp}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {injuryHistory.history.map((entry, idx) => (
            <div key={idx} className="flex items-start gap-3 border-b border-border/30 last:border-0 px-4 py-3">
              {/* Timeline dot + line */}
              <div className="flex flex-col items-center pt-1">
                <div className={`h-2.5 w-2.5 rounded-full ${severityBarColor(entry.severity)}`} />
                {idx < injuryHistory.history.length - 1 && (
                  <div className="mt-1 h-full w-px bg-border flex-1 min-h-[20px]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-foreground">{entry.injury}</span>
                  <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${severityColor(entry.severity)}`}>
                    {entry.severity}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground">{entry.date}</span>
                  <span className="text-[11px] text-muted-foreground">•</span>
                  <span className={`text-[11px] font-semibold ${entry.missedGames > 5 ? "text-red-400" : entry.missedGames > 0 ? "text-yellow-400" : "text-green-400"}`}>
                    {entry.missedGames === 0 ? "No games missed" : `${entry.missedGames} games missed`}
                  </span>
                </div>
                {/* Severity bar */}
                <div className="mt-1.5 h-1 w-full rounded-full bg-secondary/60 overflow-hidden">
                  <div className={`h-full rounded-full ${severityBarColor(entry.severity)} ${severityBarWidth(entry.severity)} transition-all`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// ─── Enhanced H2H Panel ─────────────────────────────────────────
interface EnhancedH2HProps {
  matchups: MatchupHistory[];
  teamId: string;
  compact?: boolean;
}

export const EnhancedH2HPanel = ({ matchups, teamId, compact }: EnhancedH2HProps) => {
  if (matchups.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-foreground">⚔️ Head-to-Head Breakdown</h2>
      <div className="space-y-4">
        {matchups.map((m) => {
          const isTeam1 = m.team1Id === teamId;
          const oppId = isTeam1 ? m.team2Id : m.team1Id;
          const oppTeam = allTeams.find(t => t.id === oppId);
          if (!oppTeam) return null;

          const wins = isTeam1 ? m.allTime.wins : m.allTime.losses;
          const losses = isTeam1 ? m.allTime.losses : m.allTime.wins;
          const winPct = ((wins / (wins + losses)) * 100).toFixed(1);
          const l5Wins = isTeam1 ? m.last5.team1Wins : m.last5.team2Wins;
          const l5Losses = isTeam1 ? m.last5.team2Wins : m.last5.team1Wins;
          const l10Wins = isTeam1 ? m.last10.team1Wins : m.last10.team2Wins;
          const l10Losses = isTeam1 ? m.last10.team2Wins : m.last10.team1Wins;
          const avgFor = isTeam1 ? m.avgScore.team1 : m.avgScore.team2;
          const avgAgainst = isTeam1 ? m.avgScore.team2 : m.avgScore.team1;
          const scoreDiff = (avgFor - avgAgainst).toFixed(1);

          return (
            <div key={oppId} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Header */}
              <div className="border-b border-border bg-secondary/30 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-[9px] font-bold text-secondary-foreground">
                    {oppTeam.abbreviation}
                  </div>
                  <Link to={`/team/${oppId}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                    vs {oppTeam.city} {oppTeam.name}
                  </Link>
                </div>
                <span className="font-mono text-sm font-bold text-primary">{wins}-{losses}</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-border border-b border-border">
                {[
                  { label: "All-Time", value: `${wins}-${losses}` },
                  { label: "Win %", value: `${winPct}%` },
                  { label: "Last 10", value: `${l10Wins}-${l10Losses}` },
                  { label: "Last 5", value: `${l5Wins}-${l5Losses}` },
                  { label: "Avg Score", value: `${avgFor}-${avgAgainst}` },
                  { label: "Avg Diff", value: `${Number(scoreDiff) > 0 ? "+" : ""}${scoreDiff}`, color: Number(scoreDiff) > 0 ? "text-green-400" : "text-red-400" },
                ].map((s) => (
                  <div key={s.label} className="bg-card p-2.5 text-center">
                    <p className={`font-mono text-xs font-bold ${(s as any).color || "text-foreground"}`}>{s.value}</p>
                    <p className="text-[9px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Streak */}
              <div className="border-b border-border/50 px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground">Current Streak</span>
                <span className="font-mono text-xs font-bold text-foreground">{m.streak}</span>
              </div>

              {/* Recent Results with W/L badges */}
              {!compact && (
                <div className="px-4 py-3">
                  <span className="text-[10px] font-medium text-muted-foreground mb-2 block">Recent Meetings</span>
                  <div className="space-y-1.5">
                    {m.last5.results.map((r, i) => {
                      const teamScore = isTeam1 ? r.team1Score : r.team2Score;
                      const oppScore = isTeam1 ? r.team2Score : r.team1Score;
                      const won = teamScore > oppScore;

                      return (
                        <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2">
                          <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold ${won ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {won ? "W" : "L"}
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-foreground">
                            {teamScore} - {oppScore}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-auto">{r.date}</span>
                          <span className="text-[10px] text-muted-foreground max-w-[100px] truncate hidden sm:inline">{r.location}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
