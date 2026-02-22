import { useState } from "react";
import { Link } from "react-router-dom";
import { type Sport } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import { useSubscription } from "@/hooks/useSubscription";
import { Zap, TrendingUp, MessageCircle, Search as SearchIcon, ArrowRight } from "lucide-react";

const GamesPage = () => {
  const [sport, setSport] = useState<Sport>("NBA");
  const { isBasicOrAbove, isAdvanced: hasAdvanced } = useSubscription();

  return (
    <div className="container py-6 max-w-4xl">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Today's Games
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Live scores, lines & odds across every sport. Your starting point for smarter bets.
        </p>
      </div>

      <div className="mb-6">
        <SportFilter active={sport} onChange={setSport} />
      </div>

      {/* Empty state with helpful direction */}
      <div className="rounded-2xl border border-border bg-card p-8 text-center mb-8">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-secondary mb-4">
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold text-foreground mb-1">
          No {sport} games scheduled today
        </p>
        <p className="text-sm text-muted-foreground">
          Check back when games are live for scores and odds
        </p>
      </div>

      {/* Quick action cards — adapt to tier */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isBasicOrAbove && (
          <Link to="/props" className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Browse Props</h3>
            <p className="text-xs text-muted-foreground">View player props and hit rates</p>
            <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 group-hover:text-primary transition-colors" />
          </Link>
        )}

        {isBasicOrAbove && (
          <Link to="/ai-chat" className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">AI Chat</h3>
            <p className="text-xs text-muted-foreground">Get quick picks and betting advice</p>
            <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 group-hover:text-primary transition-colors" />
          </Link>
        )}

        {hasAdvanced && (
          <Link to="/builder" className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Prop Builder</h3>
            <p className="text-xs text-muted-foreground">Build slips with edge detection</p>
            <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 group-hover:text-primary transition-colors" />
          </Link>
        )}

        {!isBasicOrAbove && (
          <Link to="/pricing" className="group rounded-xl border border-primary/20 bg-primary/5 p-5 transition-all hover:border-primary/40 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-primary mb-1">Unlock More</h3>
            <p className="text-xs text-muted-foreground">Get props, AI chat & research tools</p>
            <ArrowRight className="h-4 w-4 text-primary mt-2" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default GamesPage;