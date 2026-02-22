import { Link } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { SubscriptionTier } from "@/hooks/useSubscription";

interface UpgradeGateProps {
  requiredTier: "basic" | "advanced";
  currentTier: SubscriptionTier;
  feature: string;
  children: React.ReactNode;
}

const tierLabels = { basic: "Basic", advanced: "Advanced" };
const tierPrices = { basic: "$4.99/mo", advanced: "$9.99/mo" };

export default function UpgradeGate({ requiredTier, currentTier, feature, children }: UpgradeGateProps) {
  const { user } = useAuth();

  const hasAccess =
    requiredTier === "basic"
      ? currentTier === "basic" || currentTier === "advanced"
      : currentTier === "advanced";

  if (hasAccess) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Lock className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground">{feature}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        This feature requires a <span className="font-semibold text-primary">{tierLabels[requiredTier]}</span> plan ({tierPrices[requiredTier]}).
      </p>
      {!user ? (
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Sign in to get started
        </Link>
      ) : (
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Upgrade to {tierLabels[requiredTier]}
        </Link>
      )}
    </div>
  );
}
