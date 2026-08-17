import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isAdminUid } from "@/lib/admin";

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
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleForgotPassword = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("Enter your email above first, then tap Forgot?.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("Password reset email sent — check your inbox.");
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Couldn't send reset email.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const credential = isSignUp
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      // Route admins to the dashboard, everyone else to home
      navigate({ to: isAdminUid(credential.user.uid) ? "/admin" : "/" });
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use. Try logging in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Email/Password auth is NOT enabled in Firebase console!");
      } else {
        setError(err.message || "An unknown error occurred.");
      }
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
        <h1 className="font-display text-3xl font-bold tracking-tight text-gradient">Hoekedex</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSignUp ? "Create a new directory." : "Welcome back. Sign in to your directory."}
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
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
              Password
            </Label>
            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot?
              </button>
            )}
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

        {error && <p className="text-center text-xs text-destructive font-medium">{error}</p>}
        {info && <p className="text-center text-xs font-medium text-primary">{info}</p>}

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
        >
          {isSignUp ? "Sign up" : "Sign in"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-primary hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}
