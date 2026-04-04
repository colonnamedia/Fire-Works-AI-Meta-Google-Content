import React from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export function buildUserGenerationsOverTime(entries) {
  const days = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days[key] = { date: key, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count: 0 };
  }
  entries.forEach(e => {
    const key = (e.created_date || "").slice(0, 10);
    if (days[key]) days[key].count += 1;
  });
  return Object.values(days);
}

export function UserActivityChart({ entries = [] }) {
  const data = buildUserGenerationsOverTime(entries);
  const hasAny = data.some(d => d.count > 0);

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-semibold text-foreground mb-1">Your Activity</h2>
      <p className="text-xs text-muted-foreground mb-4">Generations over the last 30 days</p>
      {!hasAny ? (
        <div className="h-36 flex items-center justify-center text-sm text-muted-foreground">No activity yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="uGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={6} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="count" name="Generations" stroke="hsl(var(--primary))" fill="url(#uGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function UserPlatformSplitChart({ entries = [] }) {
  const counts = { meta: 0, google: 0, both: 0 };
  entries.forEach(e => { const pt = e.platform_type || "meta"; if (counts[pt] !== undefined) counts[pt]++; });
  const data = [
    { name: "Meta", value: counts.meta, color: "#3b82f6" },
    { name: "Google", value: counts.google, color: "#22c55e" },
    { name: "Both", value: counts.both, color: "#e63946" },
  ].filter(d => d.value > 0);
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-center h-40">
      <p className="text-sm text-muted-foreground">No data yet</p>
    </div>
  );

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-semibold text-foreground mb-1">Platform Split</h2>
      <p className="text-xs text-muted-foreground mb-4">Your generations by platform</p>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="45%" height={130}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" paddingAngle={3}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 flex-1">
          {data.map(d => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-foreground text-xs">{d.name}</span>
              </div>
              <span className="font-semibold text-foreground text-xs">{d.value} <span className="text-muted-foreground">({Math.round((d.value / total) * 100)}%)</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UserTopBusinesses({ entries = [] }) {
  const counts = {};
  entries.forEach(e => {
    const name = e.business_name || "Unknown";
    counts[name] = (counts[name] || 0) + 1;
  });
  const data = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  if (data.length === 0) return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-center h-40">
      <p className="text-sm text-muted-foreground">No data yet</p>
    </div>
  );

  const COLORS = ["#e63946","#3b82f6","#22c55e","#f59e0b","#8b5cf6","#06b6d4"];

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-semibold text-foreground mb-1">Top Business Profiles</h2>
      <p className="text-xs text-muted-foreground mb-4">Most generated for</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
          <Bar dataKey="value" name="Generations" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}