import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wrench, Zap, StickyNote } from "lucide-react";
import PageDisclaimer from "@/components/PageDisclaimer";
import { useSubscription } from "@/hooks/useSubscription";
import { useSearchParams } from "react-router-dom";
import UpgradeGate from "@/components/UpgradeGate";
import StatNotesPage from "./StatNotesPage";
import PropBuilderPage from "./PropBuilderPage";

export default function EdgePage() {
  const [searchParams] = useSearchParams();
  const { tier, isAdvanced } = useSubscription();
  const defaultTab = searchParams.get("tab") === "notes" ? "notes" : "builder";
  const [tab, setTab] = useState(defaultTab);
  const [legCount, setLegCount] = useState(0);

  if (!isAdvanced) {
    return (
      <div className="container py-10">
        <UpgradeGate requiredTier="advanced" currentTier={tier} feature="Edge Tools">
          <div />
        </UpgradeGate>
      </div>
    );
  }

  return (
    <div className="container flex flex-col py-4 h-[calc(100vh-3.5rem)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Zap size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Edge</h1>
          <p className="text-xs text-muted-foreground">Notes, favorites & prop builder</p>
        </div>
      </div>

      <PageDisclaimer />

      <Tabs value={tab} onValueChange={setTab} className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="w-fit">
          <TabsTrigger value="builder" className="gap-1.5">
            <Wrench size={14} /> Prop Builder
            {legCount > 0 && <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary">{legCount}</span>}
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1.5">
            <StickyNote size={14} /> Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="flex-1 overflow-hidden mt-0">
          <PropBuilderPage embedded onLegCountChange={setLegCount} />
        </TabsContent>
        <TabsContent value="notes" className="flex-1 overflow-hidden mt-0">
          <StatNotesPage embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
}
