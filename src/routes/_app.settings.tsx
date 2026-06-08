import { createFileRoute } from "@tanstack/react-router";
import { Sun, Moon, User, Lock, Bell } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — MailTrack" }] }),
  component: SettingsPage,
});

const notifications = [
  { id: "opens", label: "Email opens", desc: "Get notified when a recipient opens your email." },
  { id: "clicks", label: "Link clicks", desc: "Get notified when a recipient clicks a link." },
  { id: "digest", label: "Weekly digest", desc: "A summary of your email performance every Monday." },
  { id: "product", label: "Product updates", desc: "News about new features and improvements." },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile, security, and preferences." />

      <Card className="rounded-2xl p-6 shadow-card">
        <SectionTitle icon={User} title="Profile" desc="Update your personal information." />
        <div className="mt-5 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-gradient-primary text-lg font-semibold text-primary-foreground">AJ</AvatarFallback>
          </Avatar>
          <Button variant="outline" className="rounded-xl">Change photo</Button>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" defaultValue="Alex Jordan" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pemail">Email</Label>
            <Input id="pemail" type="email" defaultValue="alex@mailtrack.io" className="h-11 rounded-xl" />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => toast.success("Profile updated")} className="rounded-xl bg-gradient-primary hover:opacity-90">
            Save changes
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl p-6 shadow-card">
        <SectionTitle icon={Lock} title="Change Password" desc="Use a strong, unique password." />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="current">Current</Label>
            <Input id="current" type="password" placeholder="••••••••" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">New</Label>
            <Input id="new" type="password" placeholder="••••••••" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm</Label>
            <Input id="confirm" type="password" placeholder="••••••••" className="h-11 rounded-xl" />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => toast.success("Password updated")} className="rounded-xl bg-gradient-primary hover:opacity-90">
            Update password
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl p-6 shadow-card">
        <SectionTitle icon={Bell} title="Notification Preferences" desc="Choose what you want to be notified about." />
        <div className="mt-5 divide-y">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-foreground">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch defaultChecked={n.id !== "product"} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-2xl p-6 shadow-card">
        <SectionTitle icon={theme === "dark" ? Moon : Sun} title="Appearance" desc="Choose your preferred theme." />
        <div className="mt-5 grid grid-cols-2 gap-4 sm:max-w-md">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all",
                theme === t ? "border-primary shadow-elevated" : "border-border hover:border-primary/40",
              )}
            >
              <div className={cn("mb-3 flex h-16 items-center justify-center rounded-lg", t === "dark" ? "bg-slate-900" : "bg-slate-100")}>
                {t === "dark" ? <Moon className="h-5 w-5 text-slate-300" /> : <Sun className="h-5 w-5 text-amber-500" />}
              </div>
              <p className="text-sm font-medium capitalize text-foreground">{t} mode</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}