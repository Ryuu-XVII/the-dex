import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/hoekedex/ProfileCard";
import { ProfileDetail } from "@/components/hoekedex/ProfileDetail";
import { AddProfileForm } from "@/components/hoekedex/AddProfileForm";
import { mockProfiles } from "@/components/hoekedex/data";
import {
  type Profile,
  type RelationshipStatus,
  statusLabels,
  statusEmoji,
} from "@/components/hoekedex/types";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      {
        title: "Hoekedex — Your private dating directory",
      },
      {
        name: "description",
        content:
          "Track names, ratings, relationship status, and the little lies you tell along the way.",
      },
    ],
  }),
});

const filters: (RelationshipStatus | "all")[] = [
  "all",
  "talking",
  "situationship",
  "taken",
  "ex",
  "backup",
];

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5">
        <span className="text-4xl">🪝</span>
      </div>
      <h3 className="text-lg font-semibold text-foreground">No entries yet</h3>
      <p className="mt-1 max-w-[260px] text-sm text-muted-foreground">
        Start building your Hoekedex by adding someone new.
      </p>
      <Button
        onClick={onAdd}
        className="mt-6 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add first entry
      </Button>
    </div>
  );
}

function Index() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<RelationshipStatus | "all">(
    "all",
  );

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter = activeFilter === "all" || p.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [profiles, search, activeFilter]);

  const stats = {
    total: profiles.length,
    lies: profiles.reduce((acc, p) => acc + p.lies.length, 0),
    avgRating:
      profiles.length > 0
        ? profiles.reduce((acc, p) => acc + p.rating, 0) / profiles.length
        : 0,
  };

  const handleAddProfile = (data: {
    name: string;
    age: string;
    status: RelationshipStatus;
    rating: number;
    notes: string;
  }) => {
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: data.name,
      age: data.age ? Number(data.age) : undefined,
      status: data.status,
      rating: data.rating,
      notes: data.notes,
      lastUpdated: new Date().toISOString().split("T")[0],
      lies: [],
    };
    setProfiles((prev) => [newProfile, ...prev]);
    setIsAddOpen(false);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background shadow-2xl sm:max-w-md">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/95 px-5 py-4 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-gradient">
              Hoekedex
            </h1>
            <p className="text-xs text-muted-foreground">
              Your private dating directory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Lies</p>
              <p className="font-display text-lg font-bold leading-none text-foreground">
                {stats.lies}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Avg</p>
              <p className="font-display text-lg font-bold leading-none text-gold">
                {stats.avgRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Search & filters */}
      <div className="space-y-3 px-5 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="h-12 rounded-full border-border/60 bg-card pl-10 pr-10 text-base"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-2 pr-1">
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  activeFilter === filter
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {filter === "all" ? "All" : statusEmoji[filter]}
                <span className="ml-1">
                  {filter === "all" ? "" : statusLabels[filter]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-5 py-4">
        {filteredProfiles.length === 0 ? (
          <EmptyState onAdd={() => setIsAddOpen(true)} />
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              {filteredProfiles.length} {filteredProfiles.length === 1 ? "entry" : "entries"}
            </p>
            {filteredProfiles.map((profile) => (
              <Sheet
                key={profile.id}
                open={selectedProfile?.id === profile.id}
                onOpenChange={(open) => {
                  if (!open) setSelectedProfile(null);
                }}
              >
                <SheetTrigger asChild>
                  <div>
                    <ProfileCard
                      profile={profile}
                      onClick={() => setSelectedProfile(profile)}
                    />
                  </div>
                </SheetTrigger>
                {selectedProfile?.id === profile.id && (
                  <ProfileDetail
                    profile={profile}
                    onClose={() => setSelectedProfile(null)}
                  />
                )}
              </Sheet>
            ))}
          </div>
        )}
      </main>

      {/* Floating add button */}
      <div className="fixed bottom-6 left-0 right-0 z-30 flex justify-center sm:fixed">
        <div className="mx-auto w-full max-w-md px-5">
          <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
            <SheetTrigger asChild>
              <Button
                size="lg"
                className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-95"
              >
                <Plus className="h-6 w-6" />
                <span className="sr-only">Add new entry</span>
              </Button>
            </SheetTrigger>
            {isAddOpen && (
              <AddProfileForm
                onClose={() => setIsAddOpen(false)}
                onSubmit={handleAddProfile}
              />
            )}
          </Sheet>
        </div>
      </div>

      {/* Bottom safe-area spacer */}
      <div className="h-24 shrink-0" />
    </div>
  );
}
