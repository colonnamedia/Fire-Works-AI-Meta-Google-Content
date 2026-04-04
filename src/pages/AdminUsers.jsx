import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, Search, RefreshCw, ChevronDown, ChevronUp, Edit, Facebook, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  past_due: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

function UserRow({ user, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const [creditVal, setCreditVal] = useState(String(user.usage?.included_entries_remaining ?? 5));
  const [acting, setActing] = useState(false);

  const doAction = async (action, value, notes) => {
    setActing(true);
    await onAction(user.id, action, value, notes);
    setActing(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">{(user.full_name || user.email || "?")[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{user.full_name || "No name"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={user.role === "admin" ? "bg-primary/10 text-primary border-0" : "bg-secondary text-secondary-foreground"}>{user.role || "user"}</Badge>
          {user.subscription ? (
            <Badge className={statusColors[user.subscription.status] || ""}>{user.subscription.status}</Badge>
          ) : (
            <Badge variant="outline" className="text-xs">No Sub</Badge>
          )}
          {user.subscription?.plan_type && (
            <Badge variant="secondary" className="text-xs hidden sm:flex">{user.subscription.plan_type}</Badge>
          )}
          <span className="text-xs text-muted-foreground hidden md:block">{user.totalEntries} gen</span>
          {(user.totalOverage || 0) > 0 && (
            <span className="text-xs text-amber-600 font-medium hidden md:block">${user.totalOverage.toFixed(2)} overage</span>
          )}
          <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-5 bg-secondary/10 border-t border-border space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 text-sm">
            <div><p className="text-muted-foreground text-xs">Credits Left</p><p className="font-semibold">{user.usage?.included_entries_remaining ?? "—"}</p></div>
            <div><p className="text-muted-foreground text-xs">Included Used</p><p className="font-semibold">{user.usage?.included_entries_used ?? "—"}</p></div>
            <div><p className="text-muted-foreground text-xs">Overage Entries</p><p className="font-semibold text-amber-600">{user.usage?.overage_entries_used ?? 0}</p></div>
            <div><p className="text-muted-foreground text-xs">Overage $</p><p className="font-semibold text-red-600">${(user.usage?.overage_amount_accrued || 0).toFixed(2)}</p></div>
            <div><p className="text-muted-foreground text-xs">Joined</p><p className="font-semibold">{user.created_date ? format(new Date(user.created_date), "MMM d, yy") : "—"}</p></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Role Change */}
            <div className="bg-card rounded-lg border border-border p-3 space-y-2">
              <Label className="text-xs text-muted-foreground">Change Role</Label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={acting || user.role === 'user'} onClick={() => doAction('set_role', 'user')}>User</Button>
                <Button size="sm" variant="outline" disabled={acting || user.role === 'admin'} onClick={() => doAction('set_role', 'admin')}>Admin</Button>
              </div>
            </div>

            {/* Credits */}
            <div className="bg-card rounded-lg border border-border p-3 space-y-2">
              <Label className="text-xs text-muted-foreground">Set Credits Remaining</Label>
              <div className="flex gap-2">
                <Input type="number" min="0" max="100" value={creditVal} onChange={e => setCreditVal(e.target.value)} className="h-8 text-sm" />
                <Button size="sm" disabled={acting} onClick={() => doAction('adjust_credits', creditVal, `Admin set credits to ${creditVal}`)}>
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Plan Type Override */}
            <div className="bg-card rounded-lg border border-border p-3 space-y-2">
              <Label className="text-xs text-muted-foreground">Override Plan Type</Label>
              <div className="flex gap-2">
                <Select onValueChange={(v) => doAction('set_plan_type', v)} disabled={acting}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder={user.subscription?.plan_type || 'Select'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meta">Meta Only</SelectItem>
                    <SelectItem value="google">Google Only</SelectItem>
                    <SelectItem value="both">Both Platforms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-card rounded-lg border border-border p-3 space-y-2">
              <Label className="text-xs text-muted-foreground">Subscription Status</Label>
              <div className="flex flex-col gap-1.5">
                <Button size="sm" variant="outline" disabled={acting} onClick={() => doAction('set_subscription_status', 'active')}>Set Active</Button>
                <Button size="sm" variant="outline" disabled={acting} onClick={() => doAction('set_subscription_status', 'cancelled')}>Cancel Sub</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: adminData, isLoading, refetch } = useQuery({
    queryKey: ["adminMetrics", search, planFilter, statusFilter],
    queryFn: () => base44.functions.invoke("adminGetMetrics", { search, planFilter, statusFilter }).then(r => r.data),
    enabled: me?.role === "admin",
  });

  if (me && me.role !== "admin") {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
      </div>
    );
  }

  const users = adminData?.users || [];

  const handleAction = async (targetUserId, action, value, notes) => {
    try {
      const res = await base44.functions.invoke("adminAdjustUser", { targetUserId, action, value, notes });
      if (res.data?.error) throw new Error(res.data.error);
      toast({ title: "Action completed", description: `${action} applied successfully.` });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />Admin — User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} users shown</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />Refresh
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by email or name..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="meta">Meta Only</SelectItem>
              <SelectItem value="google">Google Only</SelectItem>
              <SelectItem value="both">Both Platforms</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Subs</SelectItem>
              <SelectItem value="inactive">No Sub</SelectItem>
              <SelectItem value="high_usage">High Usage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" /></div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No users found.</div>
        ) : (
          <div className="divide-y divide-border">
            {users.map(user => (
              <UserRow key={user.id} user={user} onAction={handleAction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}