import { useState, useEffect, useCallback } from "react";
import { onTrackingEvent } from "@/services/socketClient";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Send, Eye, MousePointerClick, Percent, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { OpensBarChart, ClicksLineChart, DevicePieChart } from "@/components/dashboard/Charts";
import {
  getDashboardStats,
  getTimeseries,
  getDeviceBreakdown,
  getRecentActivity,
} from "@/services/analyticsService";
import { listEmails } from "@/services/emailService";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MailTrack" }] }),
  component: DashboardPage,
});

const iconMap = {
  send: Send,
  eye: Eye,
  mouse: MousePointerClick,
  percent: Percent,
  activity: Activity,
};

function DashboardPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [recentEmails, setRecentEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(() => {
    Promise.all([
      getDashboardStats(),
      getTimeseries(),
      getDeviceBreakdown(),
      listEmails({ limit: 6 }),
    ])
      .then(([statsRes, tsRes, devRes, emailsRes]) => {
        setStats(statsRes.data);
        setTimeseries(tsRes.data);
        setDevices(devRes.data);
        setRecentEmails(emailsRes.data.items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadDashboard();
    const unsub = onTrackingEvent(() => loadDashboard());
    return unsub;
  }, [loadDashboard]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="An overview of your email tracking performance."
        action={
          <Button asChild>
            <Link to="/send-email">
              <Send className="mr-2 h-4 w-4" />
              Compose Email
            </Link>
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      ) : (
        <>
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
            <Card className="rounded-xl p-6 lg:col-span-2">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">Email Opens</h3>
                <p className="text-sm text-muted-foreground">Opens over the last 7 days</p>
              </div>
              <OpensBarChart data={timeseries} />
            </Card>

            <Card className="rounded-xl p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">Devices</h3>
                <p className="text-sm text-muted-foreground">Where emails are opened</p>
              </div>
              <DevicePieChart data={devices} />
              <div className="mt-4 space-y-2">
                {devices.map((d) => (
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
            <Card className="rounded-xl p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">Click Tracking</h3>
                <p className="text-sm text-muted-foreground">Clicks over the last 7 days</p>
              </div>
              <ClicksLineChart data={timeseries} />
            </Card>

            <Card className="rounded-xl p-6 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Recent Emails</h3>
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
                    {recentEmails.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-muted-foreground">
                          No emails sent yet.{" "}
                          <Link to="/send-email" className="text-primary hover:underline">
                            Send your first email
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      recentEmails.map((e) => (
                        <tr key={e.id} className="transition-colors hover:bg-muted/50">
                          <td className="py-3 pr-3">
                            <Link
                              to="/email-history/$id"
                              params={{ id: e.id }}
                              className="font-medium text-foreground hover:text-primary"
                            >
                              {e.recipientName}
                            </Link>
                          </td>
                          <td className="max-w-[200px] truncate py-3 pr-3 text-muted-foreground">
                            {e.subject}
                          </td>
                          <td className="py-3 pr-3">
                            <StatusBadge status={e.status} />
                          </td>
                          <td className="py-3 text-right text-muted-foreground">
                            {formatDate(e.sentDate)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
