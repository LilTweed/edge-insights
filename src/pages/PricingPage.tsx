import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    tier: "free" as const,
    price: "$0",
    period: "forever",
    icon: Sparkles,
    description: "Get started with the basics",
    features: [
      "Live game scores",
      "Basic prop lines",
      "Sport filtering",
    ],
    cta: "Current Plan",
  },
  {
    name: "Basic",
    tier: "basic" as const,
    price: "$4.99",
    period: "/month",
    icon: Zap,
    description: "For the everyday bettor",
    features: [
      "Everything in Free",
      "AI Quick Picks chat",
      "Research dashboard",
      "Player & team stats",
      "Injury reports",
    ],
    cta: "Get Basic",
    popular: true,
  },
  {
    name: "Premium",
    tier: "advanced" as const,
    price: "$9.99",
    period: "/month",
    icon: Crown,
    description: "For the serious analyst",
    features: [
      "Everything in Basic",
      "AI Pro Analyst mode",
      "Advanced statistical edge detection",
      "Correlated parlay builder",
      "H2H matchup deep dives",
      "Priority support",
    ],
    cta: "Go Premium",
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { tier } = useSubscription();

  return (
    <div className="container py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Choose Your Edge</h1>
        <p className="mt-2 text-muted-foreground">Pick the plan that fits your game</p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = tier === plan.tier;
          return (
            <div
              key={plan.tier}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Most Popular
                </span>
              )}

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <plan.icon className="h-5 w-5 text-primary" />
              </div>

              <h2 className="text-lg font-bold text-foreground">{plan.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <div className="w-full rounded-xl border border-border bg-secondary py-2.5 text-center text-sm font-semibold text-muted-foreground">
                    Current Plan
                  </div>
                ) : !user ? (
                  <Link
                    to="/login"
                    className="block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Sign in to subscribe
                  </Link>
                ) : (
                  <button
                    className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    onClick={() => {
                      // Payment integration placeholder
                      alert("Payment integration coming soon! Contact support to upgrade.");
                    }}
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Payment processing coming soon. Contact support to activate your plan.
      </p>
    </div>
  );
}
