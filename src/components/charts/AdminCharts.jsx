import React from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const PLATFORM_COLORS = {
  meta: "#3b82f6",
  google: "#22c55e",
  both: "#e63946",
};

// Build last-30-days generations-over-time from entries list
export function buildGenerationsOverTime(users) {
  const days = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days[key] = { date: key, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), total: 0, meta: 0, google: 0, both: 0 };
  }
  users.forEach(u => {
    // We don't have per-entry data in adminGetMetrics users, so use totalEntries spread evenly
    // This is a best-effort approximation; real chart uses entries directly if passed
  });
  return Object.values(days);
}

export function buildGenerationsFromEntries(entries) {
  const days = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days[key] = { date: key, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), total: 0, meta: 0, google: 0, both: 0 };
  }
  entries.forEach(e => {
    const key = (e.created_date || "").slice(0, 10);
    if (days[key]) {
      days[key].total += 1;
      const pt = e.platform_type || "meta";
      if (days[key][pt] !== undefined) days[key][pt] += 1;
    }
  });
  return Object.values(days);
}

export function GenerationsOverTimeChart({ data }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-semibold text-foreground mb-1">Generations Over Time</h2>
      <p className="text-xs text-muted-foreground mb-4">Last 30 days · by platform</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="gMeta" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gGoogle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gBoth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e63946" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={6} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="meta" name="Meta" stroke="#3b82f6" fill="url(#gMeta)" strokeWidth={2} />
          <Area type="monotone" dataKey="google" name="Google" stroke="#22c55e" fill="url(#gGoogle)" strokeWidth={2} />
          <Area type="monotone" dataKey="both" name="Both" stroke="#e63946" fill="url(#gBoth)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PlatformSplitChart({ meta = 0, google = 0, both = 0 }) {
  const data = [
    { name: "Meta", value: meta, color: "#3b82f6" },
    { name: "Google", value: google, color: "#22c55e" },
    { name: "Both", value: both, color: "#e63946" },
  ].filter(d => d.value > 0);

  const total = meta + google + both;

  if (total === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-5 flex flex-col items-center justify-center h-48 text-center">
        <p className="text-sm text-muted-foreground">No generation data yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-semibold text-foreground mb-1">Platform Usage Split</h2>
      <p className="text-xs text-muted-foreground mb-4">All-time generations by platform</p>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={160}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 flex-1">
          {data.map(d => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-foreground">{d.name}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-foreground">{d.value}</span>
                <span className="text-xs text-muted-foreground ml-1">({Math.round((d.value / total) * 100)}%)</span>
              </div>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between text-xs text-muted-foreground">
            <span>Total</span><span className="font-semibold text-foreground">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopUsersChart({ users = [] }) {
  const top = users
    .filter(u => u.totalEntries > 0)
    .sort((a, b) => b.totalEntries - a.totalEntries)
    .slice(0, 8)
    .map(u => ({ name: u.full_name || u.email?.split("@")[0] || "User", value: u.totalEntries }));

  if (top.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-5 flex flex-col items-center justify-center h-48 text-center">
        <p className="text-sm text-muted-foreground">No generation data yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-semibold text-foreground mb-1">Top Users by Generations</h2>
      <p className="text-xs text-muted-foreground mb-4">All-time entries per user</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={top} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="value" name="Generations" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GoalBreakdownChart({ entries = [] }) {
  const counts = {};
  entries.forEach(e => {
    const g = e.goal || "unknown";
    counts[g] = (counts[g] || 0) + 1;
  });
  const data = Object.entries(counts)
    .map(([goal, value]) => ({ name: goal, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  const COLORS = ["#e63946","#3b82f6","#22c55e","#f59e0b","#8b5cf6","#06b6d4","#ec4899"];

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-5 flex flex-col items-center justify-center h-48 text-center">
        <p className="text-sm text-muted-foreground">No data yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-semibold text-foreground mb-1">Generations by Goal</h2>
      <p className="text-xs text-muted-foreground mb-4">What users are optimizing for</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="value" name="Entries" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}