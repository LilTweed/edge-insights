import { useState, useEffect } from "react";
import { X } from "lucide-react";

const TOUR_STEPS = [
  {
    title: "Welcome to LVRG 👋",
    body: "Your hub for player props & game lines across every major sportsbook. Let's walk through the basics.",
    icon: "🏠",
  },
  {
    title: "What's a Prop?",
    body: "A prop (proposition) is a bet on a specific player stat — like \"Will Jayson Tatum score over 26.5 points?\" The number (26.5) is the line.",
    icon: "🎯",
  },
  {
    title: "Over / Under",
    body: "You pick Over (player exceeds the line) or Under (player falls short). The odds next to each tell you the payout — negative odds mean that side is favored.",
    icon: "📊",
  },
  {
    title: "Hit Rate",
    body: "We show you how often a player has actually gone over the line this season. A 65% hit rate means they've beaten the line in 65 out of 100 games — no spin, just data.",
    icon: "✅",
  },
  {
    title: "Comparing Books",
    body: "Every prop shows lines from FanDuel, DraftKings, Fanatics & BetMGM side-by-side so you can find the best value.",
    icon: "📖",
  },
  {
    title: "You're all set!",
    body: "Explore Props, Players, and Teams from the nav bar. Toggle Advanced mode on any page for deeper stats. Have fun!",
    icon: "🚀",
  },
];

const STORAGE_KEY = "lvrg-onboarding-complete";

const OnboardingTour = () => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const next = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!visible) return null;

  const current = TOUR_STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-scale-in">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Skip tour"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Step indicator */}
        <div className="mb-4 flex items-center gap-1.5">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
          {current.icon}
        </div>

        {/* Content */}
        <h2 className="mb-2 text-lg font-bold text-foreground">{current.title}</h2>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{current.body}</p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={dismiss}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={prev}
                className="rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={next}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {step < TOUR_STEPS.length - 1 ? "Next" : "Get Started"}
            </button>
          </div>
        </div>

        {/* Step count */}
        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          {step + 1} of {TOUR_STEPS.length}
        </p>
      </div>
    </div>
  );
};

export default OnboardingTour;
