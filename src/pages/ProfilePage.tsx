import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Camera, Loader2, Save, User } from "lucide-react";
import { toast } from "sonner";
import type { Sport } from "@/data/mockData";

interface Preferences {
  favoriteSport?: Sport;
  darkMode?: boolean;
  notifications?: boolean;
}

const SPORTS: Sport[] = ["NBA", "NFL", "NCAAB", "NCAAF", "MLB", "NHL", "UFC", "PGA", "WNBA"];

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url, preferences")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || "");
          setAvatarUrl(data.avatar_url);
          setPreferences((data.preferences as Preferences) || {});
        }
        setLoaded(true);
      });
  }, [user]);

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = publicUrl.publicUrl + "?t=" + Date.now();
    setAvatarUrl(url);

    await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", user.id);
    toast.success("Avatar updated!");
    setUploading(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        preferences: preferences as any,
      })
      .eq("user_id", user.id);

    if (error) toast.error("Save failed: " + error.message);
    else toast.success("Profile saved!");
    setSaving(false);
  };

  if (authLoading || !loaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">Profile Settings</h1>

      {/* Avatar */}
      <div className="mb-8 flex items-center gap-5">
        <button
          onClick={() => fileRef.current?.click()}
          className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-secondary/40 transition-colors hover:border-primary/50"
          disabled={uploading}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Camera className="h-5 w-5 text-primary" />
            )}
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
        <div>
          <p className="text-sm font-medium text-foreground">Profile Photo</p>
          <p className="text-xs text-muted-foreground">Click to upload · Max 5MB</p>
        </div>
      </div>

      {/* Display Name */}
      <div className="mb-6 space-y-2">
        <Label htmlFor="name" className="text-xs font-medium">Display Name</Label>
        <Input
          id="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your display name"
          maxLength={50}
        />
      </div>

      {/* Preferences */}
      <div className="mb-6 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Preferences</h2>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Favorite Sport</Label>
          <select
            value={preferences.favoriteSport || ""}
            onChange={(e) => setPreferences({ ...preferences, favoriteSport: (e.target.value || undefined) as Sport | undefined })}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="">None</option>
            {SPORTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground">Get alerts for your favorite teams</p>
          </div>
          <Switch
            checked={preferences.notifications ?? false}
            onCheckedChange={(v) => setPreferences({ ...preferences, notifications: v })}
          />
        </div>
      </div>

      {/* Email (read-only) */}
      <div className="mb-8 space-y-2">
        <Label className="text-xs font-medium">Email</Label>
        <Input value={user?.email || ""} disabled className="opacity-60" />
        <p className="text-[10px] text-muted-foreground">Contact support to change your email</p>
      </div>

      <Button onClick={saveProfile} disabled={saving} className="w-full">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save Changes
      </Button>
    </div>
  );
}
