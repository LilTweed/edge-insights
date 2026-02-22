import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { label: "Games", path: "/" },
  { label: "Props", path: "/props" },
  { label: "Builder", path: "/builder" },
  { label: "AI Chat", path: "/ai-chat" },
  { label: "Notes", path: "/notes" },
  { label: "Players", path: "/players" },
  { label: "Teams", path: "/teams" },
];

const AppHeader = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">LV</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">LVRG</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.dispatchEvent(new Event("lvrg-restart-tour"))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
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
