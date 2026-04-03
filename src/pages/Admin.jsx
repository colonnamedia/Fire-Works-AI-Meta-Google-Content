import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, FileText, Shield } from "lucide-react";
import { format } from "date-fns";

export default function Admin() {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => base44.entities.User.list(),
    enabled: user?.role === "admin",
  });

  const { data: plans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ["allAdPlans"],
    queryFn: () => base44.entities.AdPlan.list("-created_date", 100),
    enabled: user?.role === "admin",
  });

  if (user && user.role !== "admin") {
    return (
      <div className="text-center py-20">
        <Shield className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <h2 className="font-semibold text-foreground mb-1">Admin Access Required</h2>
        <p className="text-sm text-muted-foreground">You need admin privileges to view this page.</p>
      </div>
    );
  }

  const isLoading = loadingUsers || loadingPlans;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview and user management</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Total Users</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{users.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Total Plans</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{plans.length}</p>
            </div>
          </div>

          {/* Users list */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-5 border-b border-border">
              <h2 className="font-semibold text-foreground">Users</h2>
            </div>
            <div className="divide-y divide-border">
              {users.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{u.full_name || u.email}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      u.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    }`}>
                      {u.role || "user"}
                    </span>
                    {u.created_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined {format(new Date(u.created_date), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent plans */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-5 border-b border-border">
              <h2 className="font-semibold text-foreground">Recent Plans (All Users)</h2>
            </div>
            <div className="divide-y divide-border">
              {plans.slice(0, 20).map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.campaign_name}</p>
                    <p className="text-xs text-muted-foreground">{p.business_name} · {p.created_by}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      p.status === "generated" ? "bg-green-50 text-green-700" : "bg-secondary text-muted-foreground"
                    }`}>
                      {p.status || "draft"}
                    </span>
                    {p.created_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(p.created_date), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {plans.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">No plans yet</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}