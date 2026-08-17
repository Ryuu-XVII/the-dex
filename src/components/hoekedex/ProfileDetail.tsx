import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./RatingStars";
import { StatusBadge } from "./StatusBadge";
import { LieItem } from "./LieItem";
import { AddLieForm } from "./AddLieForm";
import { lieSeverityEmoji } from "./types";
import type { Lie, Profile } from "./types";
import { X, MessageSquareWarning, Calendar, PenLine } from "lucide-react";

interface ProfileDetailProps {
  profile: Profile;
  onClose: () => void;
  onAddLie: (lie: Omit<Lie, "id">) => void | Promise<void>;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileDetail({ profile, onClose, onAddLie }: ProfileDetailProps) {
  const [isAddLieOpen, setIsAddLieOpen] = useState(false);
  const lieCounts = {
    white: profile.lies.filter((l) => l.severity === "white").length,
    medium: profile.lies.filter((l) => l.severity === "medium").length,
    big: profile.lies.filter((l) => l.severity === "big").length,
  };

  return (
    <SheetContent
      side="bottom"
      className="h-[92dvh] rounded-t-3xl border-t border-border bg-background px-0 pb-0 pt-2"
    >
      <div className="flex h-full flex-col">
        {/* Drag handle + close */}
        <div className="flex items-center justify-between px-5 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-muted" />
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5">
          {/* Hero */}
          <div className="relative -mx-5 mb-5 h-56 w-[calc(100%+2.5rem)] overflow-hidden">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <span className="text-6xl font-bold text-primary/40">
                  {getInitials(profile.name)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>

          <SheetHeader className="items-start space-y-1 pb-4 text-left">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-2xl font-bold tracking-tight">{profile.name}</SheetTitle>
              {profile.age && <span className="text-lg text-muted-foreground">{profile.age}</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={profile.status} />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Updated {profile.lastUpdated}
              </div>
            </div>
          </SheetHeader>

          {/* Rating & Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/60 bg-card p-4">
              <p className="text-xs text-muted-foreground">Rating</p>
              <div className="mt-1">
                <RatingStars rating={profile.rating} size="lg" />
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-4">
              <p className="text-xs text-muted-foreground">Lies logged</p>
              <div className="mt-1 flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5 text-love" />
                <span className="text-2xl font-bold text-foreground">{profile.lies.length}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {profile.notes && (
            <div className="mb-6 rounded-2xl border border-border/60 bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <PenLine className="h-3.5 w-3.5" />
                Notes
              </div>
              <p className="text-sm leading-relaxed text-foreground">{profile.notes}</p>
            </div>
          )}

          {/* Lie breakdown */}
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">Lies told</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {lieSeverityEmoji.white} {lieCounts.white}
              </span>
              <span>
                {lieSeverityEmoji.medium} {lieCounts.medium}
              </span>
              <span>
                {lieSeverityEmoji.big} {lieCounts.big}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pb-8">
            {profile.lies.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border/60 bg-card py-8 text-center text-sm text-muted-foreground">
                No lies logged yet. Are you sure you are being honest?
              </p>
            ) : (
              profile.lies.map((lie) => <LieItem key={lie.id} lie={lie} />)
            )}
          </div>
        </div>

        {/* Sticky bottom action */}
        <div className="safe-bottom border-t border-border/60 bg-card/80 p-4 backdrop-blur-md">
          <Sheet open={isAddLieOpen} onOpenChange={setIsAddLieOpen}>
            <SheetTrigger asChild>
              <Button className="w-full rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                <PenLine className="mr-2 h-4 w-4" />
                Add a lie
              </Button>
            </SheetTrigger>
            {isAddLieOpen && (
              <AddLieForm onClose={() => setIsAddLieOpen(false)} onSubmit={onAddLie} />
            )}
          </Sheet>
        </div>
      </div>
    </SheetContent>
  );
}
