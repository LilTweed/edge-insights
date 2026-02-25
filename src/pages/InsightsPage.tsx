import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, BarChart3, Lightbulb } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeGate from "@/components/UpgradeGate";
import PropExplorerPage from "./PropExplorerPage";
import ResearchDashboard from "./ResearchDashboard";

export default function InsightsPage() {
  const { tier, isAdvanced } = useSubscription();
  const [tab, setTab] = useState("explore");

  if (!isAdvanced) {
    return (
      <div className="container py-10">
        <UpgradeGate requiredTier="advanced" currentTier={tier} feature="Insights">
          <div />
        </UpgradeGate>
      </div>
    );
  }

  return (
    <div className={`container flex flex-col py-4 min-h-[calc(100vh-3.5rem)] animate-pro-shimmer`}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Lightbulb size={20} className="text-primary-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">Insights</h1>
            <span className="rounded-md pro-gradient px-2 py-0.5 text-[9px] font-bold text-pro-foreground tracking-wider">
              PRO
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Explore props & research players, teams, and trends</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="w-fit">
          <TabsTrigger value="explore" className="gap-1.5">
            <Search size={14} /> Explore
          </TabsTrigger>
          <TabsTrigger value="research" className="gap-1.5">
            <BarChart3 size={14} /> Research
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="flex-1 overflow-auto mt-0">
          <PropExplorerPage embedded />
        </TabsContent>
        <TabsContent value="research" className="flex-1 overflow-auto mt-0">
          <ResearchDashboard embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
}
