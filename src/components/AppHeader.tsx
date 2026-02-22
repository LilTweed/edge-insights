import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Crown, HelpCircle, Lock, LogIn, LogOut, User } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, type SubscriptionTier } from "@/hooks/useSubscription";

type NavItem = { label: string; path: string; minTier: "free" | "basic" | "advanced" };

const navItems: NavItem[] = [
  { label: "Games", path: "/", minTier: "free" },
  { label: "Props", path: "/props", minTier: "basic" },
  { label: "Explore", path: "/explore", minTier: "basic" },
  { label: "Research", path: "/research", minTier: "basic" },
  { label: "AI Chat", path: "/ai-chat", minTier: "basic" },
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

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-2xl backdrop-saturate-150">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105">
            <span className="font-display text-sm font-bold text-primary-foreground tracking-tight">LV</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">LVRG</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const locked = !hasAccess(item.minTier);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                  locked && "opacity-60"
                )}
              >
                <span className="flex items-center gap-1">
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
                    ? "bg-primary text-primary-foreground"
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
