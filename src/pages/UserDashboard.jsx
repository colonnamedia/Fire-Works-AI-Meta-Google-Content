import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Zap, Target, Star, TrendingUp, ArrowRight, AlertCircle, Lock, Facebook, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { UserActivityChart, UserPlatformSplitChart, UserTopBusinesses } from "@/components/charts/UserCharts";

export default function UserDashboard() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["userStatus"],
    queryFn: () => base44.functions.invoke("getUserStatus", {}).then(r => r.data),
  });

  const { data: entries = [] } = useQuery({
    queryKey: ["adIdeaEntries"],
    queryFn: () => base44.entities.AdIdeaEntry.list("-created_date", 50),
  });

  const isAdmin = status?.isAdmin;
  const canGenerate = isAdmin || status?.canGenerate;
  const includedRemaining = status?.includedRemaining ?? 5;
  const includedUsed = status?.includedUsed ?? 0;
  const overageUsed = status?.overageUsed ?? 0;
  const overageAmount = status?.overageAmount ?? 0;
  const favorites = entries.filter(e => e.is_favorite);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ""}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin ? "Admin account — unlimited free access" : "Here's your ad strategy overview."}
          </p>
        </div>
        {canGenerate ? (
          <Link to="/new-idea"><Button><Zap className="w-4 h-4 mr-2" />New Ad Idea</Button></Link>
        ) : (
          <Link to="/billing"><Button><Lock className="w-4 h-4 mr-2" />Subscribe</Button></Link>
        )}
      </div>

      {/* Subscription Gate */}
      {!canGenerate && !statusLoading && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Subscribe to Get Started</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Single Platform (Meta or Google) is $4.99/month. Both Platforms is $8.99/month. Each plan includes 5 entries/month.
          </p>
          <Link to="/billing"><Button>View Plans</Button></Link>
        </div>
      )}

      {/* Plan Info Banner */}
      {!isAdmin && status?.subscription && (
        <div className="bg-secondary/50 border border-border rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {status.planType === 'both' ? <Layers className="w-4 h-4 text-primary" /> : status.planType === 'google' ? <Search className="w-4 h-4 text-green-600" /> : <Facebook className="w-4 h-4 text-blue-600" />}
            <span className="text-sm font-medium text-foreground">
              {status.planType === 'both' ? 'Both Platforms Plan — Meta + Google' : status.planType === 'google' ? 'Google Ads Plan' : 'Meta Ads Plan'}
            </span>
          </div>
          {status.planType !== 'both' && (
            <Link to="/billing" className="text-xs text-primary hover:underline">Upgrade to Both →</Link>
          )}
        </div>
      )}

      {/* Usage Meter */}
      {!isAdmin && status?.subscription && (
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              This Month's Usage
            </h2>
            {status.billingPeriodEnd && (
              <span className="text-xs text-muted-foreground">Resets {format(new Date(status.billingPeriodEnd), "MMM d")}</span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{includedUsed}</p>
              <p className="text-xs text-muted-foreground">Included Used</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className={`text-2xl font-bold ${includedRemaining > 0 ? "text-green-600" : "text-muted-foreground"}`}>{includedRemaining}</p>
              <p className="text-xs text-muted-foreground">Credits Left</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className={`text-2xl font-bold ${overageUsed > 0 ? "text-amber-600" : "text-foreground"}`}>{overageUsed}</p>
              <p className="text-xs text-muted-foreground">Overage Used</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className={`text-2xl font-bold ${overageAmount > 0 ? "text-red-600" : "text-foreground"}`}>${overageAmount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Overage Total</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Included credits</span>
              <span>{includedUsed} / 5 used</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (includedUsed / 5) * 100)}%` }} />
            </div>
          </div>

          {includedRemaining === 0 && (
            <div className="flex items-center gap-2 mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Included credits exhausted. New entries will be charged at $1.99 each.
            </div>
          )}
        </div>
      )}

      {/* Admin Usage Info */}
      {isAdmin && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Admin — Unlimited Free Access</p>
            <p className="text-sm text-muted-foreground">You can generate unlimited ad ideas at no charge.</p>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{entries.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Ideas</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{favorites.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Favorites</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-2xl font-bold text-green-600">{entries.filter(e => e.status === 'generated').length}</p>
          <p className="text-xs text-muted-foreground mt-1">Generated</p>
        </div>
      </div>

      {/* Charts */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <UserActivityChart entries={entries} />
          <div className="grid sm:grid-cols-2 gap-4">
            <UserPlatformSplitChart entries={entries} />
            <UserTopBusinesses entries={entries} />
          </div>
        </div>
      )}

      {/* Recent Entries */}
      {entries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Recent Ad Ideas</h2>
            <Link to="/saved-ideas" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {entries.slice(0, 5).map(entry => (
              <Link key={entry.id} to={`/idea/${entry.id}`} className="flex items-center justify-between bg-card rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-3 min-w-0">
                  {entry.is_favorite && <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">{entry.business_name} · {entry.goal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {entry.was_overage_charge && <Badge variant="secondary" className="text-xs text-amber-600">Overage</Badge>}
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && canGenerate && (
        <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
          <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">No ad ideas yet</h3>
          <p className="text-sm text-muted-foreground mb-5">Generate your first AI-powered Meta Ads strategy.</p>
          <Link to="/new-idea"><Button>Generate First Idea</Button></Link>
        </div>
      )}
    </div>
  );
}