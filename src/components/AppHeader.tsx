import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Crown, HelpCircle, Lock, LogIn, LogOut, User, Zap, Wrench, FileText } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, type SubscriptionTier } from "@/hooks/useSubscription";

type NavItem = { label: string; path: string; minTier: "free" | "basic" | "advanced"; proOnly?: boolean };

const navItems: NavItem[] = [
  { label: "Games", path: "/", minTier: "free" },
  { label: "Props", path: "/props", minTier: "basic" },
  { label: "Insights", path: "/insights", minTier: "basic" },
  { label: "Edge", path: "/edge", minTier: "basic" },
  { label: "Notes", path: "/notes", minTier: "advanced", proOnly: true },
];

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { previewTier, setPreviewTier, tier, isBasicOrAbove, isAdvanced } = useSubscription();

  const hasAccess = (minTier: "free" | "basic" | "advanced") => {
    const effectiveTier = previewTier ?? tier;
    if (minTier === "free") return true;
    if (minTier === "basic") return effectiveTier === "basic" || effectiveTier === "advanced";
    return effectiveTier === "advanced";
  };

  const tierOptions: { label: string; value: SubscriptionTier | null }[] = [
    { label: "Off", value: null },
    { label: "Free", value: "free" },
    { label: "Basic", value: "basic" },
    { label: "Adv", value: "advanced" },
  ];

  const visibleNavItems = navItems.filter((item) => !item.proOnly || isAdvanced);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/70 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300",
        isAdvanced
          ? "border-pro/20 shadow-[0_1px_12px_-2px_hsl(var(--pro)/0.15)]"
          : "border-border/60"
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
            isAdvanced ? "pro-gradient shadow-[0_0_10px_hsl(var(--pro)/0.3)]" : "bg-primary"
          )}>
            <span className={cn(
              "font-display text-sm font-bold tracking-tight",
              isAdvanced ? "text-pro-foreground" : "text-primary-foreground"
            )}>LV</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">LVRG</span>
          {isAdvanced && (
            <span className="ml-0.5 rounded-md pro-gradient px-1.5 py-0.5 text-[9px] font-bold text-pro-foreground tracking-wider animate-pro-glow">
              PRO
            </span>
          )}
        </Link>

        <nav className="flex items-center gap-0.5">
          {visibleNavItems.map((item) => {
            const locked = !hasAccess(item.minTier);
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                  isActive && item.proOnly
                    ? "pro-gradient text-pro-foreground shadow-sm"
                    : isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                  locked && "opacity-60"
                )}
              >
                <span className="flex items-center gap-1">
                  {item.proOnly && <Zap className="h-3 w-3" />}
                  {item.label}
                  {locked && <Lock className="h-3 w-3" />}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-0.5">
          {/* Tier Preview Toggle */}
          <div className="flex items-center gap-0.5 rounded-lg border border-border/60 px-1 py-0.5">
            <Crown className="h-3 w-3 text-muted-foreground ml-1" />
            {tierOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setPreviewTier(opt.value)}
                className={cn(
                  "rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                  (previewTier === opt.value || (opt.value === null && previewTier === null))
                    ? opt.value === "advanced" ? "pro-gradient text-pro-foreground" : "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <NotificationBell />
          <button
            onClick={() => window.dispatchEvent(new Event("lvrg-restart-tour"))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
            aria-label="Restart onboarding tour"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-0.5">
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                Profile
              </Link>
              <button
                onClick={async () => { await signOut(); navigate("/"); }}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;