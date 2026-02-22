import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import OnboardingTour from "@/components/OnboardingTour";
import Index from "./pages/Index";
import PropsPage from "./pages/PropsPage";
import PlayersPage from "./pages/PlayersPage";
import PlayerDetailPage from "./pages/PlayerDetailPage";
import GameDetailPage from "./pages/GameDetailPage";
import TeamsPage from "./pages/TeamsPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import AIChatPage from "./pages/AIChatPage";
import PropBuilderPage from "./pages/PropBuilderPage";
import StatNotesPage from "./pages/StatNotesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OnboardingTour />
        <AppHeader />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/props" element={<PropsPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/player/:id" element={<PlayerDetailPage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/team/:id" element={<TeamDetailPage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/builder" element={<PropBuilderPage />} />
          <Route path="/notes" element={<StatNotesPage />} />
          {/* Legacy redirect */}
          <Route path="/ai-props" element={<AIChatPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
