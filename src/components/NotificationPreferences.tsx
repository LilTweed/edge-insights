import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Moon, Save, Loader2, AlertTriangle, Newspaper, Gamepad2, BarChart3, Users, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface NotifPrefs {
  injuries: boolean;
  news: boolean;
  game_alerts: boolean;
  stat_alerts: boolean;
  lineup_changes: boolean;
  final_scores: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
}

const defaultPrefs: NotifPrefs = {
  injuries: true,
  news: true,
  game_alerts: true,
  stat_alerts: true,
  lineup_changes: true,
  final_scores: true,
  quiet_hours_start: null,
  quiet_hours_end: null,
};

const toggleItems: { key: keyof NotifPrefs; label: string; description: string; icon: React.ElementType }[] = [
  { key: "injuries", label: "Injury Updates", description: "Get alerts when a favorited player's status changes", icon: AlertTriangle },
  { key: "news", label: "News & Headlines", description: "Breaking news for your favorite players and teams", icon: Newspaper },
  { key: "game_alerts", label: "Game Starting Soon", description: "Alert 15 minutes before a favorited team's game", icon: Gamepad2 },
  { key: "stat_alerts", label: "Stat Performance", description: "Alerts like 'LeBron just scored 30+ points'", icon: BarChart3 },
  { key: "lineup_changes", label: "Lineup Changes", description: "Starting lineup or roster changes for your teams", icon: Users },
  { key: "final_scores", label: "Final Score Alerts", description: "Get notified when a favorited team's game ends", icon: Trophy },
];

const NotificationPreferences = () => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotifPrefs>(defaultPrefs);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setPrefs({
            injuries: data.injuries,
            news: data.news,
            game_alerts: data.game_alerts,
            stat_alerts: data.stat_alerts,
            lineup_changes: data.lineup_changes,
            final_scores: data.final_scores,
            quiet_hours_start: data.quiet_hours_start,
            quiet_hours_end: data.quiet_hours_end,
          });
        }
        setLoaded(true);
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("notification_preferences")
      .upsert(
        {
          user_id: user.id,
          ...prefs,
        },
        { onConflict: "user_id" }
      );

    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Notification preferences saved!");
    setSaving(false);
  };

  const togglePref = (key: keyof NotifPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Notification Preferences</h2>
      </div>

      <div className="space-y-2">
        {toggleItems.map(({ key, label, description, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 min-h-[44px]"
          >
            <div className="flex items-center gap-3 flex-1">
              <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{description}</p>
              </div>
            </div>
            <Switch
              checked={prefs[key] as boolean}
              onCheckedChange={() => togglePref(key)}
            />
          </div>
        ))}
      </div>

      {/* Quiet Hours */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs font-semibold text-foreground">Quiet Hours</p>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Mute all notifications during these hours
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Label className="text-[10px] text-muted-foreground">Start</Label>
            <input
              type="time"
              value={prefs.quiet_hours_start || ""}
              onChange={(e) => setPrefs({ ...prefs, quiet_hours_start: e.target.value || null })}
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-xs text-foreground"
            />
          </div>
          <div className="flex-1">
            <Label className="text-[10px] text-muted-foreground">End</Label>
            <input
              type="time"
              value={prefs.quiet_hours_end || ""}
              onChange={(e) => setPrefs({ ...prefs, quiet_hours_end: e.target.value || null })}
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-xs text-foreground"
            />
          </div>
        </div>
      </div>

      <Button onClick={save} disabled={saving} className="w-full min-h-[44px]">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save Notification Settings
      </Button>
    </div>
  );
};

export default NotificationPreferences;
