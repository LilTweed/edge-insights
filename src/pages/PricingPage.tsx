import { useState } from "react";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    tier: "free" as const,
    monthly: 0,
    annual: 0,
    annualSavings: 0,
    icon: Sparkles,
    description: "Get started with the basics",
    features: [
      "Live games & scores on Games tab",
      "Basic live game stats",
      "Basic player stats",
    ],
    cta: "Current Plan",
  },
  {
    name: "Basic",
    tier: "basic" as const,
    monthly: 12.99,
    annual: 9.99,
    annualTotal: 119.88,
    annualSavings: 36,
    icon: Zap,
    description: "For the everyday researcher",
    features: [
      "Everything in Free",
      "In-depth live game stats",
      "Recent news per game",
      "Access to Props tab",
    ],
    cta: "Get Basic",
  },
  {
    name: "Premium",
    tier: "advanced" as const,
    monthly: 24.99,
    annual: 19.99,
    annualTotal: 239.88,
    annualSavings: 60,
    icon: Crown,
    description: "Full access for the serious analyst",
    features: [
      "Everything in Basic",
      "Full access — Insights, Edge, Notes",
      "Spread, moneyline & over/under lines",
      "Best odds parlay builder",
      "Full historical stats",
      "AI Analysis in Edge tab",
    ],
    cta: "Go Premium",
    popular: true,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const isAnnual = billing === "annual";

  return (
    <div className="container py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Choose Your Plan</h1>
        <p className="mt-2 text-muted-foreground">Pick the plan that fits your research needs</p>
      </div>

      {/* Billing toggle */}
      <div className="mx-auto mb-10 flex w-fit items-center gap-3 rounded-full border border-border bg-card p-1">
        <button
          onClick={() => setBilling("monthly")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            !isAnnual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("annual")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            isAnnual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Annual
        </button>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = tier === plan.tier;
          const price = isAnnual ? plan.annual : plan.monthly;
          const showSavings = isAnnual && plan.annualSavings > 0;

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
                <span className="text-3xl font-bold text-foreground">
                  {price === 0 ? "$0" : `$${price.toFixed(2)}`}
                </span>
                <span className="text-sm text-muted-foreground">
                  {price === 0 ? "/forever" : "/mo"}
                </span>
              </div>

              {showSavings && (
                <p className="mt-1 text-xs">
                  <span className="text-success font-semibold">Save ${plan.annualSavings}</span>
                  <span className="text-muted-foreground"> · ${plan.annualTotal}/yr</span>
                </p>
              )}

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
        LVRG is a research and analytics tool. Not financial advice. Please research responsibly.
      </p>
    </div>
  );
}
