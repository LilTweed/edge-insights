import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Sparkles, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import type { SubscriptionTier } from "@/hooks/useSubscription";

interface UpgradeGateProps {
  requiredTier: "advanced";
  currentTier: SubscriptionTier;
  feature: string;
  children: React.ReactNode;
}

export default function UpgradeGate({ requiredTier, currentTier, feature, children }: UpgradeGateProps) {
  const { user } = useAuth();
  const { startTrial, isTrial, trialEndsAt } = useSubscription();
  const [starting, setStarting] = useState(false);

  const hasAccess = currentTier === "advanced";

  if (hasAccess) return <>{children}</>;

  const handleStartTrial = async () => {
    setStarting(true);
    await startTrial();
    setStarting(false);
  };

  const trialExpired = trialEndsAt && new Date(trialEndsAt) <= new Date();

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Lock className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground">{feature}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        This feature requires a <span className="font-semibold text-primary">Pro</span> plan ($9.99/mo).
      </p>
      {!user ? (
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Sign in to get started
        </Link>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {!trialExpired && (
            <button
              onClick={handleStartTrial}
              disabled={starting}
              className="inline-flex items-center gap-2 rounded-xl border border-primary bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <Clock className="h-4 w-4" />
              {starting ? "Activating…" : "Start 7-day free trial"}
            </button>
          )}
          {trialExpired && (
            <p className="text-xs text-muted-foreground">Your free trial has ended</p>
          )}
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to Pro
          </Link>
        </div>
      )}
    </div>
  );
}
