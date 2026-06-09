import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, MousePointerClick, TrendingUp, Mail, Send, Percent, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrendAreaChart, OpensBarChart, ClicksLineChart, DevicePieChart } from "@/components/dashboard/Charts";
import {
  getDashboardStats,
  getTimeseries,
  getRecentActivity,
  getTopEmails,
  getDeviceBreakdown,
} from "@/services/analyticsService";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — MailTrack" }] }),
  component: AnalyticsPage,
});

const iconMap = {
  send: Send,
  eye: Eye,
  "mouse-pointer": MousePointerClick,
  mouse: MousePointerClick,
  percent: Percent,
  activity: Activity,
  mail: Mail,
};

function AnalyticsPage() {
  const [summary, setSummary] = useState<any[]>([]);
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topEmails, setTopEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getTimeseries(),
      getDeviceBreakdown(),
      getRecentActivity(),
      getTopEmails(),
    ])
      .then(([statsRes, tsRes, devRes, activityRes, topRes]) => {
        setSummary(statsRes.data);
        setTimeseries(tsRes.data);
        setDevices(devRes.data);
        setRecentActivity(activityRes.data);
        setTopEmails(topRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Deep insights into your email engagement." />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {summary.map((s) => {
              const Icon = iconMap[s.icon as keyof typeof iconMap] ?? Mail;
              return (
                <Card key={s.key} className="rounded-2xl p-5 shadow-card">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{s.label}</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="rounded-2xl p-6 shadow-card lg:col-span-2">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">Open & Click Trends</h3>
                <p className="text-sm text-muted-foreground">Engagement over the last 7 days</p>
              </div>
              <TrendAreaChart data={timeseries} />
            </Card>

            <Card className="rounded-2xl p-6 shadow-card">
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl p-6 shadow-card">
              <h3 className="mb-4 font-semibold text-foreground">Weekly Opens</h3>
              <OpensBarChart data={timeseries} />
            </Card>

            <Card className="rounded-2xl p-6 shadow-card">
              <h3 className="mb-4 font-semibold text-foreground">Weekly Clicks</h3>
              <ClicksLineChart data={timeseries} />
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl p-6 shadow-card">
              <h3 className="mb-4 font-semibold text-foreground">Top Performing Emails</h3>
              {topEmails.length === 0 ? (
                <p className="text-sm text-muted-foreground">No emails sent yet.</p>
              ) : (
                <div className="space-y-3">
                  {topEmails.map((e, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border bg-background p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{e.subject}</p>
                        <p className="text-xs text-muted-foreground">{e.recipient}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{e.opens} opens</p>
                        <p className="text-xs text-muted-foreground">{e.clicks} clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="rounded-2xl p-6 shadow-card">
              <h3 className="mb-4 font-semibold text-foreground">Recent Tracking Events</h3>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tracking events yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((ev) => (
                    <div key={ev.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${ev.type === "click" ? "bg-success/15 text-success" : "bg-chart-2/15 text-chart-2"}`}>
                          {ev.type === "click" ? <MousePointerClick className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{ev.label}</p>
                          <p className="text-xs text-muted-foreground">{ev.location} · {ev.device}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(ev.time)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
