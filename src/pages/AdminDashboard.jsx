import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Users, Target, DollarSign, TrendingUp, Shield, Search, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: adminData, isLoading, refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => base44.functions.invoke("adminGetAllUsers", {}).then(r => r.data),
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

  const users = adminData?.users || [];
  const filteredUsers = users.filter(u =>
    !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalEntries = users.reduce((sum, u) => sum + (u.totalEntries || 0), 0);
  const activeSubscribers = users.filter(u => u.subscription?.status === "active").length;
  const totalOverage = users.reduce((sum, u) => sum + (u.usage?.overage_amount_accrued || 0), 0);

  const statusColors = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    past_due: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-600",
  };

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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={users.length} color="text-foreground" />
        <StatCard icon={Target} label="Total Entries" value={totalEntries} color="text-primary" />
        <StatCard icon={TrendingUp} label="Active Subscribers" value={activeSubscribers} color="text-green-600" />
        <StatCard icon={DollarSign} label="Overage Due" value={`$${totalOverage.toFixed(2)}`} color="text-amber-600" />
      </div>

      {/* User Table */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by email or name..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Link to="/admin/users"><Button variant="outline" size="sm">Full User List</Button></Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="divide-y divide-border">
            {filteredUsers.slice(0, 10).map(user => (
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
                <div className="flex items-center gap-3 shrink-0">
                  <Badge className={user.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}>{user.role || "user"}</Badge>
                  {user.subscription ? (
                    <Badge className={statusColors[user.subscription.status] || "bg-gray-100 text-gray-600"}>{user.subscription.status}</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">No Sub</Badge>
                  )}
                  <span className="text-xs text-muted-foreground hidden sm:block">{user.totalEntries} entries</span>
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/users`)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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