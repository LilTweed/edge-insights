import { useState } from "react";
import { cn } from "@/lib/utils";
import { getPlayerProfile, getInitials } from "@/data/playerProfiles";

interface PlayerAvatarProps {
  playerId?: string;
  playerName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-10 w-10 text-[11px]",   // 40px — list cards
  md: "h-12 w-12 text-xs",       // 48px — prop cards
  lg: "h-20 w-20 text-lg",       // 80px — profile screens
};

const imgSizeMap = {
  sm: 40,
  md: 48,
  lg: 80,
};

const PlayerAvatar = ({ playerId, playerName, size = "md", className }: PlayerAvatarProps) => {
  const [imgError, setImgError] = useState(false);
  const profile = playerId ? getPlayerProfile(playerId) : undefined;
  const avatarUrl = profile?.avatarUrl;
  const initials = getInitials(playerName);

  return (
    <div
      className={cn(
        "relative flex-shrink-0 overflow-hidden rounded-full bg-secondary border border-border/50",
        sizeMap[size],
        className
      )}
    >
      {avatarUrl && !imgError ? (
        <img
          src={avatarUrl}
          alt={playerName}
          width={imgSizeMap[size]}
          height={imgSizeMap[size]}
          className="h-full w-full object-cover object-top"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <span className="font-bold text-muted-foreground">{initials}</span>
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar;
