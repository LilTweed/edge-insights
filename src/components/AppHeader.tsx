import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Crown, LogIn, LogOut, User, Zap, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, type SubscriptionTier } from "@/hooks/useSubscription";

type NavItem = { label: string; path: string; minTier: "free" | "advanced"; proOnly?: boolean };

const navItems: NavItem[] = [
  { label: "Games", path: "/", minTier: "free" },
  { label: "Props", path: "/props", minTier: "free" },
  { label: "Research", path: "/research", minTier: "free" },
  { label: "Edge", path: "/edge", minTier: "advanced", proOnly: true },
];

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { previewTier, setPreviewTier, tier, isAdvanced } = useSubscription();

  const hasAccess = (minTier: "free" | "advanced") => {
    const effectiveTier = previewTier ?? tier;
    if (minTier === "free") return true;
    return effectiveTier === "advanced";
  };

  const tierOptions: { label: string; value: SubscriptionTier | null }[] = [
    { label: "Off", value: null },
    { label: "Free", value: "free" },
    { label: "Pro", value: "advanced" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/70 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300",
        isAdvanced
          ? "border-pro/20 shadow-[0_1px_12px_-2px_hsl(var(--pro)/0.15)]"
          : "border-border/60"
      )}
    >
      <div className="mx-auto flex h-12 max-w-[390px] items-center justify-between px-4 md:max-w-none md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-base font-bold tracking-tight text-foreground">LVRG</span>
          {isAdvanced && (
            <span className="ml-0.5 rounded-md pro-gradient px-1.5 py-0.5 text-[9px] font-bold text-pro-foreground tracking-wider animate-pro-glow">
              PRO
            </span>
          )}
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const locked = !hasAccess(item.minTier);
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={locked ? "/pricing" : item.path}
                className={cn(
                  "relative rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                  isActive && !locked && item.proOnly
                    ? "pro-gradient text-pro-foreground shadow-sm"
                    : isActive && !locked
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : locked
                    ? "text-muted-foreground/40 cursor-default"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                )}
              >
                <span className="flex items-center gap-1">
                  {item.proOnly && !locked && <Zap className="h-3 w-3" />}
                  {item.label}
                  {locked && <Lock className="h-3 w-3" />}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* Tier Preview — desktop only */}
          <div className="hidden md:flex items-center gap-0.5 rounded-lg border border-border/60 px-1 py-0.5">
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

          {/* Profile / Auth */}
          {user ? (
            <Link
              to="/profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
            >
              <User className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
