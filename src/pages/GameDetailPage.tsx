import { useParams, Link } from "react-router-dom";
import { allGames, getPropsForGame, getMatchupHistory, formatOdds } from "@/data/mockData";
import PropCard from "@/components/PropCard";

const GameDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const game = allGames.find((g) => g.id === id);
  const props = getPropsForGame(id || "");
  const matchup = game ? getMatchupHistory(game.homeTeam.id, game.awayTeam.id) : undefined;

  if (!game) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Game not found</p>
        <Link to="/" className="mt-2 inline-block text-sm text-primary underline">Back to games</Link>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Games
      </Link>

      {/* Game Header */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{game.sport}</span>
          <span className="text-xs text-muted-foreground">{game.time}</span>
        </div>
        <div className="my-4 flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
              {game.awayTeam.abbreviation}
            </div>
            <p className="text-sm font-semibold text-foreground">{game.awayTeam.city}</p>
            <p className="text-xs font-bold text-foreground">{game.awayTeam.name}</p>
            <p className="text-[10px] text-muted-foreground">{game.awayTeam.record}</p>
            {game.awayTeam.ranking && <p className="text-[10px] font-semibold text-muted-foreground">#{game.awayTeam.ranking}</p>}
          </div>
          <span className="text-lg font-bold text-muted-foreground">@</span>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
              {game.homeTeam.abbreviation}
            </div>
            <p className="text-sm font-semibold text-foreground">{game.homeTeam.city}</p>
            <p className="text-xs font-bold text-foreground">{game.homeTeam.name}</p>
            <p className="text-[10px] text-muted-foreground">{game.homeTeam.record}</p>
            {game.homeTeam.ranking && <p className="text-[10px] font-semibold text-muted-foreground">#{game.homeTeam.ranking}</p>}
          </div>
        </div>
      </div>

      {/* Matchup History */}
      {matchup && (
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
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Avg Score</span>
              <span className="font-mono text-xs font-semibold text-foreground">{matchup.avgScore.team1} - {matchup.avgScore.team2}</span>
            </div>
            <div className="space-y-1.5 mt-3">
              <span className="text-[10px] font-medium text-muted-foreground">Recent Meetings</span>
              {matchup.last5.results.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/50 px-2.5 py-1.5">
                  <span className="text-[11px] text-muted-foreground">{r.date}</span>
                  <span className="font-mono text-[11px] font-semibold text-foreground">{r.team1Score} - {r.team2Score}</span>
                  <span className="text-[10px] text-muted-foreground">{r.location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Stats Comparison */}
      {game.homeTeam.stats && game.awayTeam.stats && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-foreground">Team Stats Comparison</h2>
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
                {(game.sport === "NCAAF" ? [
                  { label: "PPG", a: game.awayTeam.stats!.ppg, h: game.homeTeam.stats!.ppg },
                  { label: "Opp PPG", a: game.awayTeam.stats!.oppPpg, h: game.homeTeam.stats!.oppPpg },
                  { label: "YPG", a: game.awayTeam.stats!.ypg, h: game.homeTeam.stats!.ypg },
                  { label: "Rush YPG", a: game.awayTeam.stats!.rushYpg, h: game.homeTeam.stats!.rushYpg },
                  { label: "Pass YPG", a: game.awayTeam.stats!.passYpg, h: game.homeTeam.stats!.passYpg },
                  { label: "3rd Down %", a: game.awayTeam.stats!.thirdDownPct, h: game.homeTeam.stats!.thirdDownPct },
                  { label: "Red Zone %", a: game.awayTeam.stats!.redZonePct, h: game.homeTeam.stats!.redZonePct },
                  { label: "Sacks", a: game.awayTeam.stats!.sacks, h: game.homeTeam.stats!.sacks },
                  { label: "Takeaways", a: game.awayTeam.stats!.takeaways, h: game.homeTeam.stats!.takeaways },
                ] : [
                  { label: "PPG", a: game.awayTeam.stats!.ppg, h: game.homeTeam.stats!.ppg },
                  { label: "Opp PPG", a: game.awayTeam.stats!.oppPpg, h: game.homeTeam.stats!.oppPpg },
                  { label: "RPG", a: game.awayTeam.stats!.rpg, h: game.homeTeam.stats!.rpg },
                  { label: "APG", a: game.awayTeam.stats!.apg, h: game.homeTeam.stats!.apg },
                  { label: "FG%", a: game.awayTeam.stats!.fgPct, h: game.homeTeam.stats!.fgPct },
                  { label: "3P%", a: game.awayTeam.stats!.threePct, h: game.homeTeam.stats!.threePct },
                  { label: "FT%", a: game.awayTeam.stats!.ftPct, h: game.homeTeam.stats!.ftPct },
                  { label: "TO", a: game.awayTeam.stats!.turnovers, h: game.homeTeam.stats!.turnovers },
                  { label: "STL", a: game.awayTeam.stats!.steals, h: game.homeTeam.stats!.steals },
                  { label: "BLK", a: game.awayTeam.stats!.blocks, h: game.homeTeam.stats!.blocks },
                ]).map((row) => (
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

      {/* Spreads */}
      {game.spread && game.spread.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-foreground">Spread</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Book</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">{game.awayTeam.abbreviation}</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">{game.homeTeam.abbreviation}</th>
                </tr>
              </thead>
              <tbody>
                {game.spread.map((sp) => (
                  <tr key={sp.sportsbook} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">{sp.sportsbook}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs font-semibold text-foreground">{formatOdds(sp.away)}</span>
                      <span className="ml-1 text-[10px] text-muted-foreground">({formatOdds(sp.awayOdds)})</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs font-semibold text-foreground">{sp.home}</span>
                      <span className="ml-1 text-[10px] text-muted-foreground">({formatOdds(sp.homeOdds)})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Moneylines */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">Moneylines</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Book</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">{game.awayTeam.abbreviation}</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">{game.homeTeam.abbreviation}</th>
              </tr>
            </thead>
            <tbody>
              {game.moneyline.map((ml) => (
                <tr key={ml.sportsbook} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">{ml.sportsbook}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{formatOdds(ml.away)}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{formatOdds(ml.home)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Over/Under */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-foreground">Over/Under</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Book</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Over</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Under</th>
              </tr>
            </thead>
            <tbody>
              {game.overUnder.map((ou) => (
                <tr key={ou.sportsbook} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">{ou.sportsbook}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">{ou.total}</td>
                  <td className="px-4 py-2.5 text-right"><span className="line-badge-over">{formatOdds(ou.over)}</span></td>
                  <td className="px-4 py-2.5 text-right"><span className="line-badge-under">{formatOdds(ou.under)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player Props */}
      {props.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-bold text-foreground">Player Props</h2>
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
