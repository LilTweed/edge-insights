import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Gamepad2, BarChart3, Search, Zap, Lock } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
const tabs = [
  { label: "Games", path: "/", icon: Gamepad2, minTier: "free" as const },
  { label: "Props", path: "/props", icon: BarChart3, minTier: "basic" as const },
  { label: "Research", path: "/research", icon: Search, minTier: "basic" as const },
  { label: "Edge", path: "/edge", icon: Zap, minTier: "advanced" as const },
];

const BottomTabBar = () => {
  const location = useLocation();
  const { tier, previewTier } = useSubscription();

  const effectiveTier = previewTier ?? tier;

  const hasAccess = (minTier: "free" | "basic" | "advanced") => {
    if (minTier === "free") return true;
    if (minTier === "basic") return effectiveTier === "basic" || effectiveTier === "advanced";
    return effectiveTier === "advanced";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg safe-area-bottom">
      <div className="mx-auto flex max-w-[390px] items-center justify-around px-1 py-1">
        {tabs.map((tab) => {
          const locked = !hasAccess(tab.minTier);
          const isActive = tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={locked ? "/pricing" : tab.path}
              className={cn(
                "flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 transition-colors",
                isActive && !locked
                  ? "text-primary"
                  : locked
                  ? "text-muted-foreground/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {locked && <Lock className="absolute -right-1.5 -top-1 h-2.5 w-2.5 text-muted-foreground/50" />}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
