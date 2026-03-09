import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SubscriptionTier = "free" | "advanced";

interface SubscriptionState {
  tier: SubscriptionTier;
  loading: boolean;
  isAdvanced: boolean;
  previewTier: SubscriptionTier | null;
  setPreviewTier: (tier: SubscriptionTier | null) => void;
  isTrial: boolean;
  trialEndsAt: string | null;
  startTrial: () => Promise<void>;
}

export function useSubscription(): SubscriptionState {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [loading, setLoading] = useState(true);
  const [isTrial, setIsTrial] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [previewTier, setPreviewTier] = useState<SubscriptionTier | null>(() => {
    const stored = localStorage.getItem("lvrg-preview-tier");
    if (stored === "basic") return "free"; // migrate old basic preview
    return stored ? (stored as SubscriptionTier) : null;
  });

  useEffect(() => {
    if (previewTier) {
      localStorage.setItem("lvrg-preview-tier", previewTier);
    } else {
      localStorage.removeItem("lvrg-preview-tier");
    }
  }, [previewTier]);

  const fetchProfile = async () => {
    if (!user) {
      setTier("free");
      setIsTrial(false);
      setTrialEndsAt(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("subscription_tier, trial_started_at, trial_ends_at")
      .eq("user_id", user.id)
      .single();

    let resolvedTier: SubscriptionTier = (data?.subscription_tier === "advanced" ? "advanced" : "free");
    let trialActive = false;

    if (data?.trial_ends_at) {
      const endsAt = new Date(data.trial_ends_at);
      if (endsAt > new Date()) {
        resolvedTier = "advanced";
        trialActive = true;
      }
    }

    setTier(resolvedTier);
    setIsTrial(trialActive);
    setTrialEndsAt(data?.trial_ends_at ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const startTrial = async () => {
    if (!user) return;
    const now = new Date();
    const endsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await supabase
      .from("profiles")
      .update({
        trial_started_at: now.toISOString(),
        trial_ends_at: endsAt.toISOString(),
      })
      .eq("user_id", user.id);

    await fetchProfile();
  };

  const effectiveTier = previewTier ?? tier;

  return {
    tier: effectiveTier,
    loading,
    isAdvanced: effectiveTier === "advanced",
    previewTier,
    setPreviewTier,
    isTrial,
    trialEndsAt,
    startTrial,
  };
}
