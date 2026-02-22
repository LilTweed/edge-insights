import { Link } from "react-router-dom";
import { ShieldAlert, AlertTriangle, Scale, HandCoins, ArrowLeft } from "lucide-react";

const sections = [
  {
    icon: ShieldAlert,
    title: "No Guaranteed Outcomes",
    body: `All picks, projections, and analysis provided by LVRG are for informational and entertainment purposes only. Nothing on this platform constitutes a guarantee of any outcome. Sports betting is inherently unpredictable, and past performance does not guarantee future results. No algorithm, trend, or statistical model can predict the outcome of a sporting event with certainty.`,
  },
  {
    icon: AlertTriangle,
    title: "Assumption of Risk",
    body: `By using LVRG, you acknowledge and accept that sports betting involves significant financial risk, including the possibility of losing your entire wager. You are solely responsible for any and all bets you place. LVRG, its creators, contributors, and affiliates shall not be held liable for any financial losses, damages, or negative consequences resulting from your use of this platform or any information provided herein.`,
  },
  {
    icon: HandCoins,
    title: "Not Financial Advice",
    body: `The content provided on LVRG — including AI-generated analysis, prop suggestions, edge calculations, hit rates, and parlay recommendations — does not constitute financial advice, investment advice, or professional gambling consultation. You should never bet more than you can afford to lose. If you believe you may have a gambling problem, please seek help from the National Council on Problem Gambling (1-800-522-4700) or visit www.ncpgambling.org.`,
  },
  {
    icon: Scale,
    title: "Responsible Use",
    body: `You must be of legal gambling age in your jurisdiction to use this platform for betting purposes. It is your responsibility to ensure that online sports betting is legal in your jurisdiction. LVRG does not facilitate, process, or accept any wagers. We provide data analysis tools only. By continuing to use LVRG, you confirm that you have read, understood, and agreed to these terms.`,
  },
];

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} />
        Back to app
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Disclaimer & Terms of Use</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 2026. Please read carefully before using LVRG.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                <s.icon size={18} className="text-destructive" />
              </div>
              <h2 className="text-base font-bold text-foreground">{s.title}</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-center">
        <p className="text-sm font-semibold text-destructive">
          ⚠️ LVRG is NOT responsible for any financial losses incurred through sports betting.
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          By using this platform, you acknowledge full responsibility for your betting decisions.
        </p>
      </div>
    </div>
  );
}
