import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sun, Moon, User, Lock, Bell, Mail } from "lucide-react";
import { toast } from "sonner";
import { getProfile, updateProfile, changePassword } from "@/services/authService";
import { getSettings, updateSettings, type NotificationPrefs } from "@/services/settingsService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — MailTrack" }] }),
  component: SettingsPage,
});

const notificationDefs = [
  {
    id: "opens" as const,
    label: "Email opens",
    desc: "Get notified when a recipient opens your email.",
  },
  {
    id: "clicks" as const,
    label: "Link clicks",
    desc: "Get notified when a recipient clicks a link.",
  },
  {
    id: "digest" as const,
    label: "Weekly digest",
    desc: "A summary of your email performance every Monday.",
  },
  {
    id: "product" as const,
    label: "Product updates",
    desc: "News about new features and improvements.",
  },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [smtpEmail, setSmtpEmail] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [hasSmtpPassword, setHasSmtpPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    opens: true,
    clicks: true,
    digest: true,
    product: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then((res) => setProfile({ name: res.data.name, email: res.data.email }))
      .catch(() => {});

    getSettings()
      .then((res) => {
        setSmtpEmail(res.data.smtpEmail);
        setHasSmtpPassword(res.data.hasSmtpPassword);
        if (res.data.notificationPrefs) setNotifPrefs(res.data.notificationPrefs);
      })
      .catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(profile);
      setProfile({ name: res.data.name, email: res.data.email });
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSmtp = async () => {
    try {
      await updateSettings({ smtpEmail, smtpPassword });
      toast.success("Gmail connected successfully!");
      if (smtpPassword) setHasSmtpPassword(true);
      setSmtpPassword("");
    } catch {
      toast.error("Failed to connect Gmail account.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "Failed to update password");
    }
  };

  const handleNotifChange = async (key: keyof NotificationPrefs, value: boolean) => {
    const updated = { ...notifPrefs, [key]: value };
    setNotifPrefs(updated);
    try {
      await updateSettings({ notificationPrefs: { [key]: value } });
    } catch {
      toast.error("Failed to save preference");
      setNotifPrefs(notifPrefs);
    }
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile, security, and preferences." />

      <Card className="rounded-2xl p-6 shadow-card">
        <SectionTitle icon={User} title="Profile" desc="Update your personal information." />
        <div className="mt-5 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-gradient-primary text-lg font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pemail">Email</Label>
            <Input
              id="pemail"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className="h-11 rounded-xl"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={handleSaveProfile} disabled={saving} className="btn-primary-gradient">
            Save changes
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl p-6 shadow-card">
        <SectionTitle
          icon={Mail}
          title="Connect Gmail"
          desc="Send emails through your own Google account."
        />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="smtpEmail">Gmail Address</Label>
            <Input
              id="smtpEmail"
              type="email"
              value={smtpEmail}
              onChange={(e) => setSmtpEmail(e.target.value)}
              placeholder="your.name@gmail.com"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPass">
              App Password{" "}
              {hasSmtpPassword && (
                <span className="text-green-500 text-xs font-semibold">(Saved)</span>
              )}
            </Label>
            <Input
              id="smtpPass"
              type="password"
              value={smtpPassword}
              onChange={(e) => setSmtpPassword(e.target.value)}
              placeholder="16-character app password"
              className="h-11 rounded-xl"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Generate an app password in your Google Account security settings.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={handleSaveSmtp} className="btn-primary-gradient">
            Connect Account
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl p-6 shadow-card">
        <SectionTitle icon={Lock} title="Change Password" desc="Use a strong, unique password." />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="current">Current</Label>
            <Input
              id="current"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">New</Label>
            <Input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm</Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={handleChangePassword} className="btn-primary-gradient">
            Update password
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl p-6 shadow-card">
        <SectionTitle
          icon={Bell}
          title="Notification Preferences"
          desc="Choose what you want to be notified about."
        />
        <div className="mt-5 divide-y">
          {notificationDefs.map((n) => (
            <div key={n.id} className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-foreground">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch
                checked={notifPrefs[n.id]}
                onCheckedChange={(v) => handleNotifChange(n.id, v)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-2xl p-6 shadow-card">
        <SectionTitle
          icon={theme === "dark" ? Moon : Sun}
          title="Appearance"
          desc="Choose your preferred theme."
        />
        <div className="mt-5 grid grid-cols-2 gap-4 sm:max-w-md">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all",
                theme === t
                  ? "border-primary shadow-elevated"
                  : "border-border hover:border-primary/40",
              )}
            >
              <div
                className={cn(
                  "mb-3 flex h-16 items-center justify-center rounded-lg",
                  t === "dark" ? "bg-slate-900" : "bg-slate-100",
                )}
              >
                {t === "dark" ? (
                  <Moon className="h-5 w-5 text-slate-300" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-500" />
                )}
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
