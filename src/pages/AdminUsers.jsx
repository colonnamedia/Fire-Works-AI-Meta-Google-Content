import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, Search, RefreshCw, ChevronDown, ChevronUp, Edit, RotateCcw } from "lucide-react";
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
          <span className="text-xs text-muted-foreground hidden md:block">{user.totalEntries} entries</span>
          <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-5 bg-secondary/10 border-t border-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Credits Left</p>
              <p className="font-semibold">{user.usage?.included_entries_remaining ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Included Used</p>
              <p className="font-semibold">{user.usage?.included_entries_used ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Overage</p>
              <p className="font-semibold text-amber-600">${(user.usage?.overage_amount_accrued || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Joined</p>
              <p className="font-semibold">{user.created_date ? format(new Date(user.created_date), "MMM d, yy") : "—"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Role Change */}
            <div className="bg-card rounded-lg border border-border p-3 space-y-2">
              <Label className="text-xs text-muted-foreground">Change Role</Label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={acting || user.role === 'user'} onClick={() => doAction('set_role', 'user', 'Admin changed role to user')}>User</Button>
                <Button size="sm" variant="outline" disabled={acting || user.role === 'admin'} onClick={() => doAction('set_role', 'admin', 'Admin changed role to admin')}>Admin</Button>
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

            {/* Reset & Sub */}
            <div className="bg-card rounded-lg border border-border p-3 space-y-2">
              <Label className="text-xs text-muted-foreground">Actions</Label>
              <div className="flex flex-col gap-1.5">
                <Button size="sm" variant="outline" disabled={acting} onClick={() => doAction('reset_usage', null, 'Admin reset monthly usage')}>
                  <RotateCcw className="w-3 h-3 mr-1" />Reset Usage
                </Button>
                <Button size="sm" variant="outline" disabled={acting} onClick={() => doAction('set_active', !user.is_active, `Admin ${user.is_active ? 'deactivated' : 'activated'} user`)}>
                  {user.is_active === false ? "Activate" : "Deactivate"}
                </Button>
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
        <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
      </div>
    );
  }

  const users = adminData?.users || [];
  const filtered = users.filter(u => !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase()));

  const handleAction = async (targetUserId, action, value, notes) => {
    try {
      const res = await base44.functions.invoke("adminUpdateUser", { targetUserId, action, value, notes });
      if (res.data?.error) throw new Error(res.data.error);
      toast({ title: "Action completed", description: `${action} applied successfully.` });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
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
          <p className="text-sm text-muted-foreground mt-1">{users.length} total users</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />Refresh
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No users found.</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(user => (
              <UserRow key={user.id} user={user} onAction={handleAction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}