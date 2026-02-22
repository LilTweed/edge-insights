import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, BarChart3, User, Newspaper } from "lucide-react";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { useFavoriteTeams } from "@/hooks/useFavoriteTeams";
import { formatDistanceToNow } from "date-fns";

const typeIcon = {
  stats: BarChart3,
  player: User,
  news: Newspaper,
};

const NotificationBell = () => {
  const { favorites } = useFavoriteTeams();
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications(favorites);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
            <span className="text-xs font-bold text-foreground">Notifications</span>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Check className="h-2.5 w-2.5" />
                  Read all
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto h-6 w-6 text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {favorites.length === 0
                    ? "Heart a team to get updates here"
                    : "No notifications yet"}
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <NotificationItem key={notif.id} notif={notif} onRead={markRead} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function NotificationItem({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const Icon = typeIcon[notif.type] || Newspaper;

  return (
    <button
      onClick={() => onRead(notif.id)}
      className={`flex w-full gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-secondary/50 ${
        !notif.read ? "bg-primary/5" : ""
      }`}
    >
      <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg ${
        !notif.read ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
      }`}>
        <Icon className="h-3 w-3" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-secondary px-1 py-0.5 text-[8px] font-bold text-muted-foreground">
            {notif.teamAbbr}
          </span>
          <span className="truncate text-[11px] font-semibold text-foreground">{notif.title}</span>
          {!notif.read && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground line-clamp-2">
          {notif.body}
        </p>
        <span className="mt-1 block text-[9px] text-muted-foreground/60">
          {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
        </span>
      </div>
    </button>
  );
}

export default NotificationBell;
