import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axisStyle = { fontSize: 12, fill: "var(--color-muted-foreground)" };

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  background: "var(--color-popover)",
  color: "var(--color-popover-foreground)",
  boxShadow: "var(--shadow-card)",
  fontSize: 13,
};

const emptyWeek = [
  { name: "Mon", opens: 0, clicks: 0 },
  { name: "Tue", opens: 0, clicks: 0 },
  { name: "Wed", opens: 0, clicks: 0 },
  { name: "Thu", opens: 0, clicks: 0 },
  { name: "Fri", opens: 0, clicks: 0 },
  { name: "Sat", opens: 0, clicks: 0 },
  { name: "Sun", opens: 0, clicks: 0 },
];

const defaultDevices = [
  { name: "Desktop", value: 0, color: "var(--color-chart-1)" },
  { name: "Mobile", value: 0, color: "var(--color-chart-2)" },
  { name: "Tablet", value: 0, color: "var(--color-chart-3)" },
];

type ChartPoint = { name: string; opens?: number; clicks?: number; openRate?: number; clickRate?: number };
type DevicePoint = { name: string; value: number; color: string };

export function OpensBarChart({ data = emptyWeek }: { data?: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={6}>
        <defs>
          <linearGradient id="opensGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.95} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={axisStyle} />
        <YAxis tickLine={false} axisLine={false} tick={axisStyle} width={32} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} />
        <Bar dataKey="opens" fill="url(#opensGrad)" radius={[8, 8, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ClicksLineChart({ data = emptyWeek }: { data?: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={axisStyle} />
        <YAxis tickLine={false} axisLine={false} tick={axisStyle} width={32} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--color-border)" }} />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="var(--color-chart-3)"
          strokeWidth={3}
          dot={{ r: 4, fill: "var(--color-chart-3)" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TrendAreaChart({ data = emptyWeek }: { data?: ChartPoint[] }) {
  const trendData = data.map((d) => ({
    name: d.name,
    openRate: d.opens ?? 0,
    clickRate: d.clicks ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={trendData}>
        <defs>
          <linearGradient id="openArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="clickArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={axisStyle} />
        <YAxis tickLine={false} axisLine={false} tick={axisStyle} width={32} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="openRate" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#openArea)" name="Opens" />
        <Area type="monotone" dataKey="clickRate" stroke="var(--color-chart-3)" strokeWidth={2.5} fill="url(#clickArea)" name="Clicks" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DevicePieChart({ data = defaultDevices }: { data?: DevicePoint[] }) {
  const chartData = data.some((d) => d.value > 0) ? data : defaultDevices;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={92}
          paddingAngle={4}
          stroke="none"
        >
          {chartData.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}
