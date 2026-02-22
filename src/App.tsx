import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
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
import TermsPage from "./pages/TermsPage";
import DisclaimerModal from "./components/DisclaimerModal";
import InstallPage from "./pages/InstallPage";
import ResearchDashboard from "./pages/ResearchDashboard";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SportsRadarTestPage from "./pages/SportsRadarTestPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DisclaimerModal />
        <OnboardingTour />
        <AppHeader />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/props" element={<PropsPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/player/:id" element={<PlayerDetailPage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/team/:id" element={<TeamDetailPage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/builder" element={<PropBuilderPage />} />
          <Route path="/notes" element={<StatNotesPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/research" element={<ResearchDashboard />} />
          {/* Legacy redirect */}
          <Route path="/ai-props" element={<AIChatPage />} />
          <Route path="/install" element={<InstallPage />} />
          <Route path="/sr-test" element={<SportsRadarTestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
