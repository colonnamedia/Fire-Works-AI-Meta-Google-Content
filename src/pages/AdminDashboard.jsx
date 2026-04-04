import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  Users, Target, DollarSign, TrendingUp, Shield, Search,
  ChevronRight, RefreshCw, Activity, Facebook, Search as SearchIcon, Layers, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import {
  GenerationsOverTimeChart, PlatformSplitChart, TopUsersChart, GoalBreakdownChart, buildGenerationsFromEntries
} from "@/components/charts/AdminCharts";

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  past_due: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: adminData, isLoading, refetch } = useQuery({
    queryKey: ["adminMetrics"],
    queryFn: () => base44.functions.invoke("adminGetMetrics", {}).then(r => r.data),
    enabled: me?.role === "admin",
  });

  if (me && me.role !== "admin") {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  const metrics = adminData?.metrics || {};
  const users = adminData?.users || [];
  const recentActivity = adminData?.recentActivity || [];
  const allEntries = adminData?.allEntries || [];
  const chartData = buildGenerationsFromEntries(allEntries);

  const filteredUsers = users.filter(u =>
    !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const planDist = metrics.planDistribution || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Platform overview and user management.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />Refresh
        </Button>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={metrics.totalUsers ?? 0} color="text-foreground" />
        <StatCard icon={Target} label="Total Generations" value={metrics.totalGenerations ?? 0} color="text-primary" />
        <StatCard icon={TrendingUp} label="Active Subscribers" value={metrics.activeSubscriptions ?? 0} color="text-green-600" />
        <StatCard icon={DollarSign} label="Total Overage" value={`$${(metrics.totalOverage || 0).toFixed(2)}`} color="text-amber-600" />
      </div>

      {/* Plan Distribution */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" /> Plan Distribution
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <Facebook className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-700">{planDist.meta || 0}</p>
            <p className="text-xs text-blue-600">Meta Only</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <SearchIcon className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-700">{planDist.google || 0}</p>
            <p className="text-xs text-green-600">Google Only</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-primary">{planDist.both || 0}</p>
            <p className="text-xs text-primary">Both Platforms</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <GenerationsOverTimeChart data={chartData} />

      <div className="grid sm:grid-cols-2 gap-6">
        <PlatformSplitChart
          meta={allEntries.filter(e => e.platform_type === 'meta').length}
          google={allEntries.filter(e => e.platform_type === 'google').length}
          both={allEntries.filter(e => e.platform_type === 'both').length}
        />
        <GoalBreakdownChart entries={allEntries} />
      </div>

      <TopUsersChart users={users} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Link to="/admin/users"><Button variant="outline" size="sm">Manage All</Button></Link>
          </div>

          {isLoading ? (
            <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" /></div>
          ) : (
            <div className="divide-y divide-border">
              {filteredUsers.slice(0, 8).map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">{(user.full_name || user.email || "?")[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.full_name || "—"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={user.role === "admin" ? "bg-primary/10 text-primary border-0" : "bg-secondary text-secondary-foreground"}>{user.role || "user"}</Badge>
                    {user.subscription ? (
                      <Badge className={statusColors[user.subscription.status] || "bg-gray-100 text-gray-600"}>{user.subscription.plan_type || user.subscription.status}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">No Sub</Badge>
                    )}
                    <span className="text-xs text-muted-foreground hidden sm:block">{user.totalEntries} gen</span>
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Recent Activity
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity logs yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 12).map(log => (
                <div key={log.id} className="text-xs">
                  <div className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${log.status === 'warning' ? 'bg-amber-400' : log.status === 'failure' ? 'bg-red-400' : 'bg-green-400'}`} />
                    <div>
                      <p className="text-foreground font-medium">{log.action_type?.replace(/_/g, ' ')}</p>
                      <p className="text-muted-foreground truncate">{log.details || '—'}</p>
                      <p className="text-muted-foreground/70">{log.created_date ? format(new Date(log.created_date), "MMM d, h:mm a") : "—"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}