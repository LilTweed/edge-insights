import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bot, Wrench, Zap } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useSearchParams } from "react-router-dom";
import AIChatPage from "./AIChatPage";
import PropBuilderPage from "./PropBuilderPage";

export default function EdgePage() {
  const [searchParams] = useSearchParams();
  const { isAdvanced } = useSubscription();
  const defaultTab = searchParams.get("tab") === "builder" ? "builder" : "chat";
  const [tab, setTab] = useState(defaultTab);

  return (
    <div className="container flex flex-col py-4 h-[calc(100vh-3.5rem)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Zap size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Edge</h1>
          <p className="text-xs text-muted-foreground">AI-powered tools to find your betting edge</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="w-fit">
          <TabsTrigger value="chat" className="gap-1.5">
            <Bot size={14} /> AI Chat
          </TabsTrigger>
          {isAdvanced && (
            <TabsTrigger value="builder" className="gap-1.5">
              <Wrench size={14} /> Prop Builder
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
          <AIChatPage embedded />
        </TabsContent>
        {isAdvanced && (
          <TabsContent value="builder" className="flex-1 overflow-hidden mt-0">
            <PropBuilderPage embedded />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
