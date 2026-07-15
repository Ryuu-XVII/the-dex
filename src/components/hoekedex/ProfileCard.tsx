import { cn } from "@/lib/utils";
import { RatingStars } from "./RatingStars";
import { StatusBadge } from "./StatusBadge";
import type { Profile } from "./types";
import { MessageSquareWarning } from "lucide-react";

interface ProfileCardProps {
  profile: Profile;
  onClick?: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-card p-4 text-left transition-all",
        "hover:border-primary/30 hover:bg-card/80 active:scale-[0.98]",
      )}
    >
      {/* Subtle gradient glow on hover */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-start/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name}
              className="h-16 w-16 rounded-xl object-cover ring-2 ring-border/50"
              loading="lazy"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-lg font-bold text-primary-foreground ring-2 ring-border/50">
              {getInitials(profile.name)}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-card text-[10px] shadow-sm ring-1 ring-border">
            {profile.age}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground">
                {profile.name}
              </h3>
              <div className="mt-1">
                <RatingStars rating={profile.rating} size="sm" />
              </div>
            </div>
            <StatusBadge status={profile.status} size="sm" />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {profile.notes}
            </p>
            {profile.lies.length > 0 && (
              <div className="flex shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive-foreground">
                <MessageSquareWarning className="h-3 w-3" />
                <span>{profile.lies.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
