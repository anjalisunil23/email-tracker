import { createFileRoute, Link } from "@tanstack/react-router";
import { Send, Eye, MousePointerClick, Percent, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { OpensBarChart, ClicksLineChart, DevicePieChart } from "@/components/dashboard/Charts";
import { stats, emails, deviceData, formatDate } from "@/lib/sample-data";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MailTrack" }] }),
  component: DashboardPage,
});

const iconMap = { send: Send, eye: Eye, mouse: MousePointerClick, percent: Percent, activity: Activity };

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="An overview of your email tracking performance."
        action={
          <Button asChild className="rounded-xl bg-gradient-primary shadow-elevated hover:opacity-90">
            <Link to="/send-email">
              <Send className="h-4 w-4" /> Compose Email
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={s.value}
            delta={s.delta}
            trend={s.trend}
            icon={iconMap[s.icon as keyof typeof iconMap]}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl p-6 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Email Opens</h3>
              <p className="text-sm text-muted-foreground">Opens over the last 7 days</p>
            </div>
          </div>
          <OpensBarChart />
        </Card>

        <Card className="rounded-2xl p-6 shadow-card">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Devices</h3>
            <p className="text-sm text-muted-foreground">Where emails are opened</p>
          </div>
          <DevicePieChart />
          <div className="mt-4 space-y-2">
            {deviceData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-semibold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl p-6 shadow-card">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Click Tracking</h3>
            <p className="text-sm text-muted-foreground">Clicks over the last 7 days</p>
          </div>
          <ClicksLineChart />
        </Card>

        <Card className="rounded-2xl p-6 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/email-history">View all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 font-medium">Recipient</th>
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {emails.slice(0, 6).map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-muted/50">
                    <td className="py-3 pr-3">
                      <Link to="/email-history/$id" params={{ id: e.id }} className="font-medium text-foreground hover:text-primary">
                        {e.recipientName}
                      </Link>
                    </td>
                    <td className="max-w-[200px] truncate py-3 pr-3 text-muted-foreground">{e.subject}</td>
                    <td className="py-3 pr-3"><StatusBadge status={e.status} /></td>
                    <td className="py-3 text-right text-muted-foreground">{formatDate(e.sentDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}