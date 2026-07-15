import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockProfiles } from "@/components/hoekedex/data";
import { StatusBadge } from "@/components/hoekedex/StatusBadge";
import { RatingStars } from "@/components/hoekedex/RatingStars";
import {
  lieSeverityEmoji,
  lieSeverityLabels,
  type Profile,
} from "@/components/hoekedex/types";
import {
  Search,
  Users,
  MessageSquareWarning,
  Star,
  LogOut,
  Shield,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Admin — Hoekedex" },
      { name: "description", content: "Admin dashboard for Hoekedex." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

// Mock: pretend each profile belongs to a different user
const mockUsers = [
  { id: "u1", name: "Jordan K.", email: "jordan@hoekedex.app", avatar: "🦊" },
  { id: "u2", name: "Marcus L.", email: "marcus@hoekedex.app", avatar: "🐺" },
  { id: "u3", name: "Devon P.", email: "devon@hoekedex.app", avatar: "🦉" },
  { id: "u4", name: "Riley S.", email: "riley@hoekedex.app", avatar: "🐻" },
];

const usersWithPosts = mockUsers.map((user, idx) => {
  const profiles = mockProfiles.filter((_, i) => i % mockUsers.length === idx);
  return { ...user, profiles };
});

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className={cn("grid h-8 w-8 place-items-center rounded-lg", accent)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    usersWithPosts[0]?.id ?? null,
  );

  const filteredUsers = useMemo(() => {
    if (!search) return usersWithPosts;
    const q = search.toLowerCase();
    return usersWithPosts.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.profiles.some((p) => p.name.toLowerCase().includes(q)),
    );
  }, [search]);

  const selectedUser =
    usersWithPosts.find((u) => u.id === selectedUserId) ?? null;

  const totalPosts = mockProfiles.length;
  const totalLies = mockProfiles.reduce((a, p) => a + p.lies.length, 0);
  const avgRating = (
    mockProfiles.reduce((a, p) => a + p.rating, 0) / mockProfiles.length
  ).toFixed(1);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background pb-10">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/95 px-5 py-4 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/40 to-primary/10 ring-1 ring-primary/30">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">
                Admin
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Hoekedex control room
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Link>
        </div>
      </header>

      <main className="flex-1 space-y-5 px-5 pt-5">
        {/* Stats */}
        <section className="grid grid-cols-3 gap-3">
          <StatCard
            label="Users"
            value={mockUsers.length}
            icon={Users}
            accent="bg-primary/15 text-primary-foreground"
          />
          <StatCard
            label="Posts"
            value={totalPosts}
            icon={TrendingUp}
            accent="bg-status-talking/20 text-status-talking-foreground"
          />
          <StatCard
            label="Lies"
            value={totalLies}
            icon={MessageSquareWarning}
            accent="bg-destructive/20 text-destructive-foreground"
          />
        </section>

        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-gold" />
            <span className="text-xs text-muted-foreground">
              Platform avg rating
            </span>
          </div>
          <span className="font-display text-lg font-bold text-gold">
            {avgRating}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users or entries..."
            className="h-11 rounded-full border-border/60 bg-card pl-10"
          />
        </div>

        {/* Users list */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Users ({filteredUsers.length})
            </h2>
          </div>
          <div className="space-y-2">
            {filteredUsers.map((user) => {
              const isActive = user.id === selectedUserId;
              const userLies = user.profiles.reduce(
                (a, p) => a + p.lies.length,
                0,
              );
              return (
                <button
                  key={user.id}
                  onClick={() =>
                    setSelectedUserId(isActive ? null : user.id)
                  }
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all",
                    isActive
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/60 bg-card hover:border-primary/30",
                  )}
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 text-xl">
                    {user.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{user.profiles.length} posts</span>
                      <span className="text-destructive-foreground">
                        {userLies} lies
                      </span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isActive && "rotate-90 text-primary",
                      )}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected user's posts */}
        {selectedUser && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {selectedUser.name}'s entries
              </h2>
              <span className="text-[11px] text-muted-foreground">
                {selectedUser.profiles.length}
              </span>
            </div>

            {selectedUser.profiles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-6 text-center text-sm text-muted-foreground">
                No entries yet.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedUser.profiles.map((profile) => (
                  <AdminProfileRow key={profile.id} profile={profile} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function AdminProfileRow({ profile }: { profile: Profile }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={profile.name}
            className="h-12 w-12 rounded-xl object-cover ring-1 ring-border/50"
          />
        ) : (
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/20 text-sm font-bold">
            {profile.name.slice(0, 2)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {profile.name}
            </p>
            {profile.age && (
              <span className="text-[11px] text-muted-foreground">
                {profile.age}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={profile.status} size="sm" />
            <RatingStars rating={profile.rating} size="sm" />
          </div>
        </div>
        {profile.lies.length > 0 && (
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-destructive/15 px-2 py-1 text-[11px] font-medium text-destructive-foreground">
            <MessageSquareWarning className="h-3 w-3" />
            {profile.lies.length}
          </div>
        )}
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-border/60 bg-background/40 p-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Notes
            </p>
            <p className="mt-1 text-sm text-foreground">{profile.notes}</p>
          </div>

          {profile.lies.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Lies logged ({profile.lies.length})
              </p>
              <ul className="mt-1 space-y-2">
                {profile.lies.map((lie) => (
                  <li
                    key={lie.id}
                    className="rounded-xl border border-border/50 bg-card/70 p-2.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span>{lieSeverityEmoji[lie.severity]}</span>
                        <span>{lieSeverityLabels[lie.severity]}</span>
                      </span>
                      <span>{lie.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{lie.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-lg border-border/60 text-xs"
            >
              Hide entry
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 rounded-lg text-xs"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
