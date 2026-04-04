import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, AlertCircle, RefreshCw, Zap, Calendar, TrendingUp, Facebook, Search, Layers, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const PLANS = [
  { type: "meta", name: "Single Platform — Meta", price: 4.99, icon: Facebook, iconColor: "text-blue-600", desc: "Facebook & Instagram Ads only" },
  { type: "google", name: "Single Platform — Google", price: 4.99, icon: Search, iconColor: "text-green-600", desc: "Google Search, Display & YouTube only" },
  { type: "both", name: "Both Platforms", price: 8.99, icon: Layers, iconColor: "text-primary", desc: "Meta + Google Ads in every generation" },
];

export default function BillingPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [subscribing, setSubscribing] = useState(false);

  const { data: status, isLoading } = useQuery({
    queryKey: ["userStatus"],
    queryFn: () => base44.functions.invoke("getUserStatus", {}).then(r => r.data),
  });

  const { data: billingEvents = [] } = useQuery({
    queryKey: ["billingEvents"],
    queryFn: () => base44.entities.BillingEvent.list("-created_date", 20),
  });

  const [selectedPlanType, setSelectedPlanType] = useState("meta");

  const handleSubscribe = async (planType) => {
    setSubscribing(true);
    try {
      const pt = planType || selectedPlanType;
      const res = await base44.functions.invoke("createSubscription", { planType: pt });
      if (res.data?.subscription) {
        const plan = PLANS.find(p => p.type === pt);
        toast({ title: "Subscribed!", description: `Welcome to the ${plan?.name}. You have 5 credits to use this month.` });
        queryClient.invalidateQueries({ queryKey: ["userStatus"] });
        queryClient.invalidateQueries({ queryKey: ["billingEvents"] });
      }
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const sub = status?.subscription;
  const usage = status?.usage;
  const isAdmin = status?.isAdmin;

  const statusColors = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    past_due: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your plan and view usage history.</p>
      </div>

      {isAdmin && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Admin Account — Free Access</p>
            <p className="text-sm text-muted-foreground">Admin accounts bypass all subscription and billing requirements.</p>
          </div>
        </div>
      )}

      {!isAdmin && (
        <>
          {/* Plan Card */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  {sub ? (sub.plan_name || "Active Plan") : "No Active Plan"}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {sub ? `$${sub.monthly_price?.toFixed(2) || "4.99"}/month · 5 included entries` : "Choose a plan to get started"}
                </p>
              </div>
              {sub && (
                <Badge className={statusColors[sub.status] || "bg-gray-100 text-gray-600"}>
                  {sub.status}
                </Badge>
              )}
            </div>

            {sub ? (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Billing Period</p>
                    <p className="font-medium text-foreground">
                      {sub.billing_period_start ? format(new Date(sub.billing_period_start), "MMM d") : "—"} – {sub.billing_period_end ? format(new Date(sub.billing_period_end), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Platform Access</p>
                    <p className="font-medium text-foreground capitalize">{sub.plan_type === 'both' ? 'Meta + Google' : sub.plan_type === 'google' ? 'Google Ads' : 'Meta Ads'}</p>
                  </div>
                </div>
                {sub.plan_type !== 'both' && (
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => handleSubscribe('both')} disabled={subscribing}>
                    <ArrowUp className="w-3.5 h-3.5" /> Upgrade to Both Platforms — $8.99/month
                  </Button>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Select a plan to start generating AI ad strategies.</p>
                <div className="grid gap-3">
                  {PLANS.map(plan => {
                    const Icon = plan.icon;
                    return (
                      <button
                        key={plan.type}
                        onClick={() => setSelectedPlanType(plan.type)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${selectedPlanType === plan.type ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${plan.iconColor}`} />
                            <span className="font-medium text-sm text-foreground">{plan.name}</span>
                          </div>
                          <span className="font-bold text-foreground">${plan.price}/mo</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 ml-6">{plan.desc}</p>
                      </button>
                    );
                  })}
                </div>
                <Button onClick={() => handleSubscribe()} disabled={subscribing} className="w-full sm:w-auto">
                  {subscribing ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Processing...</> : `Subscribe — $${PLANS.find(p => p.type === selectedPlanType)?.price}/month`}
                </Button>
              </div>
            )}
          </div>

          {/* Usage Stats */}
          {sub && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                This Month's Usage
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatBox label="Included Used" value={usage?.included_entries_used ?? 0} color="text-foreground" />
                <StatBox label="Included Left" value={usage?.included_entries_remaining ?? 5} color="text-green-600" />
                <StatBox label="Overage Entries" value={usage?.overage_entries_used ?? 0} color="text-amber-600" />
                <StatBox label="Overage Total" value={`$${(usage?.overage_amount_accrued ?? 0).toFixed(2)}`} color="text-red-600" />
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Included credits used</span>
                  <span>{usage?.included_entries_used ?? 0} / 5</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((usage?.included_entries_used ?? 0) / 5) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Overage Notice */}
          {(usage?.overage_amount_accrued || 0) > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">Overage Balance Due</p>
                <p className="text-sm text-amber-700 mt-1">
                  You have used {usage?.overage_entries_used} overage entries this month, totaling{" "}
                  <strong>${(usage?.overage_amount_accrued || 0).toFixed(2)}</strong> in additional charges.
                  This will be collected at the end of your billing period.
                </p>
              </div>
            </div>
          )}

          {/* Pricing Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-3">Plan Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Single Platform (Meta or Google)</span>
                <span className="font-medium">$4.99/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Both Platforms (Meta + Google)</span>
                <span className="font-medium">$8.99/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Included entries per month</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Additional entry price</span>
                <span className="font-medium">$1.99 each</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits reset</span>
                <span className="font-medium">Monthly on billing date</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Billing History */}
      {!isAdmin && billingEvents.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Billing History
          </h2>
          <div className="space-y-2">
            {billingEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground capitalize">{event.type?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">{event.created_date ? format(new Date(event.created_date), "MMM d, yyyy") : "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">${(event.amount || 0).toFixed(2)}</p>
                  <Badge variant="secondary" className="text-xs">{event.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}