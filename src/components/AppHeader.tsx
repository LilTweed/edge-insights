import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";

const navItems = [
  { label: "Games", path: "/" },
  { label: "Props", path: "/props" },
  { label: "Research", path: "/research" },
  { label: "AI Chat", path: "/ai-chat" },
];

const AppHeader = () => {
  const location = useLocation();

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
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <NotificationBell />
          <button
            onClick={() => window.dispatchEvent(new Event("lvrg-restart-tour"))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
            aria-label="Restart onboarding tour"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
