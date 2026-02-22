import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SubscriptionTier = "free" | "basic" | "advanced";

interface SubscriptionState {
  tier: SubscriptionTier;
  loading: boolean;
  isBasicOrAbove: boolean;
  isAdvanced: boolean;
  previewTier: SubscriptionTier | null;
  setPreviewTier: (tier: SubscriptionTier | null) => void;
}

export function useSubscription(): SubscriptionState {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [loading, setLoading] = useState(true);
  const [previewTier, setPreviewTier] = useState<SubscriptionTier | null>(() => {
    const stored = localStorage.getItem("lvrg-preview-tier");
    return stored ? (stored as SubscriptionTier) : null;
  });

  useEffect(() => {
    if (previewTier) {
      localStorage.setItem("lvrg-preview-tier", previewTier);
    } else {
      localStorage.removeItem("lvrg-preview-tier");
    }
  }, [previewTier]);

  useEffect(() => {
    if (!user) {
      setTier("free");
      setLoading(false);
      return;
    }

    const fetchTier = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("user_id", user.id)
        .single();

      setTier((data?.subscription_tier as SubscriptionTier) || "free");
      setLoading(false);
    };

    fetchTier();
  }, [user]);

  const effectiveTier = previewTier ?? tier;

  return {
    tier: effectiveTier,
    loading,
    isBasicOrAbove: effectiveTier === "basic" || effectiveTier === "advanced",
    isAdvanced: effectiveTier === "advanced",
    previewTier,
    setPreviewTier,
  };
}
