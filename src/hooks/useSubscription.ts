import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SubscriptionTier = "free" | "basic" | "advanced";

interface SubscriptionState {
  tier: SubscriptionTier;
  loading: boolean;
  isBasicOrAbove: boolean;
  isAdvanced: boolean;
}

export function useSubscription(): SubscriptionState {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [loading, setLoading] = useState(true);

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

  return {
    tier,
    loading,
    isBasicOrAbove: tier === "basic" || tier === "advanced",
    isAdvanced: tier === "advanced",
  };
}
