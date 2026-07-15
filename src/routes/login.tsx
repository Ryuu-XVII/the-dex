import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — Hoekedex" },
      {
        name: "description",
        content: "Sign in to your private Hoekedex directory.",
      },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only: route admin emails to dashboard, others to home
    if (email.toLowerCase().includes("admin")) {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background px-6 pb-10 pt-16">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-72 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-2xl" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary/40 to-primary/10 text-3xl shadow-lg shadow-primary/20 ring-1 ring-primary/30">
          🪝
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-gradient">
          Hoekedex
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back. Sign in to your directory.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 mt-10 space-y-5 rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl"
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hoekedex.app"
              className="h-12 rounded-xl border-border/60 bg-background/60 pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
              Password
            </Label>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 rounded-xl border-border/60 bg-background/60 pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
        >
          Sign in
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              or
            </span>
          </div>
        </div>

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/40 text-sm font-medium text-foreground hover:bg-background/70"
        >
          <span className="text-base">🔐</span> Continue with passkey
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>

      <p className="relative z-10 mt-6 text-center text-[11px] text-muted-foreground">
        Tip: use an email with "admin" to preview the admin dashboard.
      </p>
    </div>
  );
}
