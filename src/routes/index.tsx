import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, BarChart3, MousePointerClick, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import loginIllustration from "@/assets/login-illustration.jpg";
import { login } from "@/services/authService";
import { isAuthenticated, setToken } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Sign In — MailTrack" },
      {
        name: "description",
        content: "Sign in to MailTrack to track email opens, clicks, and engagement analytics.",
      },
      { property: "og:title", content: "Sign In — MailTrack" },
      {
        property: "og:description",
        content: "Sign in to MailTrack to track email opens, clicks, and engagement analytics.",
      },
    ],
  }),
  component: LoginPage,
});

const features = [
  { icon: Send, label: "Real-time send tracking" },
  { icon: BarChart3, label: "Open & engagement analytics" },
  { icon: MousePointerClick, label: "Click-level insights" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = (e.target as any).email.value;
      const password = (e.target as any).password.value;
      const res = await login({ email, password, rememberMe });
      setToken(res.data.token);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Illustration side */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
            <Mail className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Mail-Tracker</span>
        </div>

        <div className="relative z-10">
          <img
            src={loginIllustration}
            alt="Email tracking analytics illustration"
            width={520}
            height={520}
            className="mx-auto w-full max-w-md rounded-3xl"
          />
          <h2 className="mt-8 text-3xl font-bold leading-tight">
            Know the moment your emails get read.
          </h2>
          <p className="mt-3 max-w-md text-primary-foreground/80">
            Track opens, clicks, and engagement in real time with beautiful, actionable analytics.
          </p>
          <ul className="mt-8 space-y-3">
            {features.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <f.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-primary-foreground/90">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Mail className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Mail-Tracker</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to your account to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="anjali@mailtrack.io"
                  placeholder="you@company.com"
                  className="h-11 rounded-xl pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  defaultValue="password"
                  placeholder="••••••••"
                  className="h-11 rounded-xl px-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(v === true)}
              />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="btn-primary-gradient h-11 w-full text-base"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Demo: anjali@mailtrack.io / password
          </p>
        </div>
      </div>
    </div>
  );
}
