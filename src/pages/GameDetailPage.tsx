import { useParams, Link } from "react-router-dom";
import { allGames, getPropsForGame, getMatchupHistory, formatOdds } from "@/data/mockData";
import { getHistoricalTeam, getStatColumns, formatStatLabel, allHistoricalPlayers } from "@/data/historicalStats";
import PropCard from "@/components/PropCard";
import { AlertTriangle, CloudRain, Wind, Droplets, Thermometer } from "lucide-react";

const GameDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const game = allGames.find((g) => g.id === id);
  const props = getPropsForGame(id || "");
  const matchup = game ? getMatchupHistory(game.homeTeam.id, game.awayTeam.id) : undefined;

  // Historical data
  const homeHistory = game ? getHistoricalTeam(game.homeTeam.id) : undefined;
  const awayHistory = game ? getHistoricalTeam(game.awayTeam.id) : undefined;

  // Top players for each team (from historical data)
  const homeTopPlayers = game ? allHistoricalPlayers.filter((p) => p.teamAbbr === game.homeTeam.abbreviation).slice(0, 3) : [];
  const awayTopPlayers = game ? allHistoricalPlayers.filter((p) => p.teamAbbr === game.awayTeam.abbreviation).slice(0, 3) : [];
  const statCols = game ? getStatColumns(game.sport).slice(0, 5) : [];

  if (!game) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Game not found</p>
        <Link to="/" className="mt-2 inline-block text-sm text-primary underline">Back to games</Link>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Games
      </Link>

      {/* Game Header */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{game.sport}</span>
          <span className="text-xs text-muted-foreground">{game.date} · {game.time}</span>
        </div>
        <div className="my-4 flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
              {game.awayTeam.abbreviation}
            </div>
            <p className="text-sm font-semibold text-foreground">{game.awayTeam.city}</p>
            <p className="text-xs font-bold text-foreground">{game.awayTeam.name}</p>
            <p className="text-[10px] text-muted-foreground">{game.awayTeam.record}</p>
            {game.awayScore !== undefined && (
              <p className="mt-1 font-mono text-2xl font-bold text-foreground">{game.awayScore}</p>
            )}
          </div>
          <span className="text-lg font-bold text-muted-foreground">@</span>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
              {game.homeTeam.abbreviation}
            </div>
            <p className="text-sm font-semibold text-foreground">{game.homeTeam.city}</p>
            <p className="text-xs font-bold text-foreground">{game.homeTeam.name}</p>
            <p className="text-[10px] text-muted-foreground">{game.homeTeam.record}</p>
            {game.homeScore !== undefined && (
              <p className="mt-1 font-mono text-2xl font-bold text-foreground">{game.homeScore}</p>
            )}
          </div>
        </div>

        {/* Quarter/Period Scores */}
        {game.quarterScores && game.quarterScores.length > 0 && (
          <div className="flex gap-1 justify-center mt-2">
            {game.quarterScores.map((qs) => (
              <div key={qs.period} className="rounded-md bg-secondary/60 px-2.5 py-1 text-center">
                <span className="block text-[8px] font-bold text-muted-foreground">{qs.period}</span>
                <span className="block text-[10px] font-mono text-foreground">{qs.away}-{qs.home}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weather Projection (outdoor sports) */}
      {game.weather && (
        <div className={`mb-6 rounded-xl border p-4 ${
          game.weather.impact === "high" ? "border-destructive/30 bg-destructive/5" :
          game.weather.impact === "moderate" ? "border-yellow-500/30 bg-yellow-500/5" :
          "border-border bg-card"
        }`}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="text-xl">{game.weather.icon}</span> Weather Projection
            {game.weather.impact !== "none" && (
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                game.weather.impact === "high" ? "bg-destructive/15 text-destructive" :
                game.weather.impact === "moderate" ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400" :
                "bg-secondary text-muted-foreground"
              }`}>
                {game.weather.impact} impact
              </span>
            )}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[9px] text-muted-foreground">Temp</p>
                <p className="font-mono text-sm font-bold text-foreground">{game.weather.tempF}°F</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[9px] text-muted-foreground">Wind</p>
                <p className="font-mono text-sm font-bold text-foreground">{game.weather.windMph} mph {game.weather.windDir}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[9px] text-muted-foreground">Humidity</p>
                <p className="font-mono text-sm font-bold text-foreground">{game.weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
              <CloudRain className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[9px] text-muted-foreground">Precip</p>
                <p className="font-mono text-sm font-bold text-foreground">{game.weather.precipChance}%</p>
              </div>
            </div>
          </div>
          {game.weather.impactNote && (
            <p className={`text-xs ${
              game.weather.impact === "high" ? "text-destructive font-semibold" :
              game.weather.impact === "moderate" ? "text-yellow-600 dark:text-yellow-400" :
              "text-muted-foreground"
            }`}>
              💡 {game.weather.impactNote}
            </p>
          )}
        </div>
      )}

      {/* Injury Report */}
      {game.keyInjuries && game.keyInjuries.length > 0 && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <AlertTriangle className="h-4 w-4 text-yellow-500" /> Injury Report
          </h2>
          <div className="flex flex-wrap gap-2">
            {game.keyInjuries.map((inj, i) => (
              <span key={i} className="rounded-lg bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{inj.player}</span>
                <span className="mx-1">·</span>
                <span className={
                  inj.status === "Out" ? "text-destructive" :
                  inj.status === "Questionable" ? "text-yellow-500" :
                  "text-muted-foreground"
                }>{inj.status}</span>
                <span className="mx-1 text-muted-foreground/60">({inj.injury})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last 5 Games for each team */}
      {(homeHistory || awayHistory) && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {[
            { team: game.awayTeam, history: awayHistory },
            { team: game.homeTeam, history: homeHistory },
          ].map(({ team, history }) => history && (
            <div key={team.id} className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-2 text-xs font-bold text-foreground">{team.abbreviation} — Last 5 & Splits</h3>
              <div className="mb-2 flex gap-1">
                {history.seasons[0]?.last5.split("-").map((r, i) => (
                  <span
                    key={i}
                    className={`inline-flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold ${
                      r === "W" ? "bg-success/15 text-success" : r === "L" ? "bg-destructive/15 text-destructive" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {r}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-lg bg-secondary/60 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Home</span>
                  <span className="ml-1 font-mono font-semibold text-foreground">{history.seasons[0]?.homeRecord}</span>
                </div>
                <div className="rounded-lg bg-secondary/60 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Away</span>
                  <span className="ml-1 font-mono font-semibold text-foreground">{history.seasons[0]?.awayRecord}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* H2H History */}
      {homeHistory && awayHistory && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-bold text-foreground">Head-to-Head History</h2>
          {(() => {
            const h2hHome = homeHistory.h2h[awayHistory.abbreviation];
            const h2hAway = awayHistory.h2h[homeHistory.abbreviation];
            const rec = h2hHome || h2hAway;
            if (!rec) return <p className="text-xs text-muted-foreground">No head-to-head data available</p>;
            return (
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-xs font-bold text-foreground">{homeHistory.abbreviation}</p>
                  <p className="font-mono text-2xl font-bold text-foreground">{h2hHome ? h2hHome.wins : h2hAway?.losses}</p>
                  <p className="text-[10px] text-muted-foreground">Wins</p>
                </div>
                <span className="text-lg text-muted-foreground">—</span>
                <div className="text-center">
                  <p className="text-xs font-bold text-foreground">{awayHistory.abbreviation}</p>
                  <p className="font-mono text-2xl font-bold text-foreground">{h2hHome ? h2hHome.losses : h2hAway?.wins}</p>
                  <p className="text-[10px] text-muted-foreground">Wins</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legacy H2H from mockData */}
      {matchup && !homeHistory && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-foreground">Head-to-Head History</h2>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
              <div className="text-center">
                <p className="font-mono text-lg font-bold text-foreground">{matchup.allTime.wins}-{matchup.allTime.losses}</p>
                <p className="text-[10px] text-muted-foreground">All-Time</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-lg font-bold text-foreground">{matchup.last10.team1Wins}-{matchup.last10.team2Wins}</p>
                <p className="text-[10px] text-muted-foreground">Last 10</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-lg font-bold text-foreground">{matchup.last5.team1Wins}-{matchup.last5.team2Wins}</p>
                <p className="text-[10px] text-muted-foreground">Last 5</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-sm font-bold text-foreground">{matchup.streak}</p>
                <p className="text-[10px] text-muted-foreground">Streak</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Players Current Season Stats */}
      {(homeTopPlayers.length > 0 || awayTopPlayers.length > 0) && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-bold text-foreground">Top Players — Current Season</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { team: game.awayTeam, players: awayTopPlayers },
              { team: game.homeTeam, players: homeTopPlayers },
            ].map(({ team, players }) => players.length > 0 && (
              <div key={team.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="border-b border-border bg-secondary/30 px-3 py-2">
                  <span className="text-xs font-bold text-foreground">{team.abbreviation}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="px-2 py-1.5 text-left font-bold text-muted-foreground">Player</th>
                        {statCols.map((col) => (
                          <th key={col} className="px-2 py-1.5 text-center font-bold text-muted-foreground">{formatStatLabel(col)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((p) => {
                        const current = p.seasons[0];
                        if (!current) return null;
                        return (
                          <tr key={p.id} className="border-b border-border/30 last:border-0">
                            <td className="px-2 py-1.5">
                              <p className="font-semibold text-foreground">{p.name}</p>
                              <p className="text-[9px] text-muted-foreground">{p.position}</p>
                            </td>
                            {statCols.map((col) => (
                              <td key={col} className="px-2 py-1.5 text-center font-mono text-foreground">
                                {current.stats[col] != null
                                  ? typeof current.stats[col] === "number" && !Number.isInteger(current.stats[col])
                                    ? current.stats[col].toFixed(1)
                                    : current.stats[col]
                                  : "—"}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Stats Comparison */}
      {game.homeTeam.stats && game.awayTeam.stats && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-bold text-foreground">Team Stats Comparison</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">{game.awayTeam.abbreviation}</th>
                  <th className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">Stat</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">{game.homeTeam.abbreviation}</th>
                </tr>
              </thead>
              <tbody>
                {(game.sport === "NCAAF" || game.sport === "NFL" ? [
                  { label: "PPG", a: game.awayTeam.stats!.ppg, h: game.homeTeam.stats!.ppg },
                  { label: "Opp PPG", a: game.awayTeam.stats!.oppPpg, h: game.homeTeam.stats!.oppPpg },
                  { label: "YPG", a: game.awayTeam.stats!.ypg, h: game.homeTeam.stats!.ypg },
                  { label: "Rush YPG", a: game.awayTeam.stats!.rushYpg, h: game.homeTeam.stats!.rushYpg },
                  { label: "Pass YPG", a: game.awayTeam.stats!.passYpg, h: game.homeTeam.stats!.passYpg },
                ] : [
                  { label: "PPG", a: game.awayTeam.stats!.ppg, h: game.homeTeam.stats!.ppg },
                  { label: "Opp PPG", a: game.awayTeam.stats!.oppPpg, h: game.homeTeam.stats!.oppPpg },
                  { label: "RPG", a: game.awayTeam.stats!.rpg, h: game.homeTeam.stats!.rpg },
                  { label: "APG", a: game.awayTeam.stats!.apg, h: game.homeTeam.stats!.apg },
                  { label: "FG%", a: game.awayTeam.stats!.fgPct, h: game.homeTeam.stats!.fgPct },
                ]).filter(r => r.a != null && r.h != null).map((row) => (
                  <tr key={row.label} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2 text-right font-mono text-xs font-semibold text-foreground">{row.a}</td>
                    <td className="px-4 py-2 text-center text-xs font-medium text-muted-foreground">{row.label}</td>
                    <td className="px-4 py-2 text-left font-mono text-xs font-semibold text-foreground">{row.h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Betting Lines */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {/* Spread */}
        {game.spread && game.spread.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Spread</h3>
            {game.spread.map((sp) => (
              <div key={sp.sportsbook} className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{sp.sportsbook}</span>
                <span className="font-mono font-semibold text-foreground">{game.homeTeam.abbreviation} {sp.home > 0 ? "+" : ""}{sp.home}</span>
              </div>
            ))}
          </div>
        )}

        {/* Moneyline */}
        {game.moneyline.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Moneyline</h3>
            {game.moneyline.map((ml) => (
              <div key={ml.sportsbook} className="mb-1">
                <span className="text-[9px] text-muted-foreground">{ml.sportsbook}</span>
                <div className="flex justify-between text-xs font-mono font-semibold text-foreground">
                  <span>{game.awayTeam.abbreviation} {formatOdds(ml.away)}</span>
                  <span>{game.homeTeam.abbreviation} {formatOdds(ml.home)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Over/Under */}
        {game.overUnder.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Over/Under</h3>
            {game.overUnder.map((ou) => (
              <div key={ou.sportsbook} className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{ou.sportsbook}</span>
                <div className="flex gap-2">
                  <span className="font-mono font-semibold text-foreground">{ou.total}</span>
                  <span className="rounded bg-success/10 px-1 py-0.5 text-[9px] font-bold text-success">O {formatOdds(ou.over)}</span>
                  <span className="rounded bg-destructive/10 px-1 py-0.5 text-[9px] font-bold text-destructive">U {formatOdds(ou.under)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player Props */}
      {game.playerProps && game.playerProps.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-bold text-foreground">Player Props</h2>
          <div className="flex flex-wrap gap-2">
            {game.playerProps.map((pp, i) => (
              <span key={i} className="rounded-lg bg-primary/5 border border-primary/10 px-3 py-1.5 text-xs text-foreground">
                <span className="font-semibold">{pp.playerName}</span>
                <span className="text-muted-foreground"> {pp.stat} </span>
                <span className="font-mono font-bold text-primary">{pp.line}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* PropCard props */}
      {props.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-bold text-foreground">Detailed Player Props</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {props.map((prop) => (
              <PropCard key={prop.id} prop={prop} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GameDetailPage;
