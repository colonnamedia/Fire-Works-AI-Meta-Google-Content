import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldAlert, ArrowRight, TrendingUp, MapPin, Loader2, RotateCcw } from "lucide-react";
import { ALL_CAMPAIGN_TYPES } from "./campaignData";
import { Button } from "@/components/ui/button";

function InfoRow({ label, value }) {
  return (
    <div className="flex gap-3 py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground w-40 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function OverrideSelector({ current, onSelect }) {
  const [open, setOpen] = React.useState(false);
  const all = ALL_CAMPAIGN_TYPES;

  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)} className="gap-1.5">
        <RotateCcw className="w-3.5 h-3.5" /> Override Recommendation
      </Button>
      {open && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {all.map(ct => (
            <button
              key={ct.id}
              onClick={() => { onSelect(ct); setOpen(false); }}
              className={`text-left p-3 rounded-lg border text-sm transition-colors hover:border-primary/50 ${
                current?.id === ct.id ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <Badge variant="outline" className="text-xs">{ct.platform}</Badge>
                <span className="font-medium text-foreground text-xs">{ct.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{ct.tagline}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CampaignRecommendation({ recommendation, loading, override, onOverride }) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Analyzing your answers...</p>
      </div>
    );
  }

  if (!recommendation) return null;

  const { primaryRecommendation: primary, backupOption: backup, keyWarning } = recommendation;

  // Find matching campaign type for extra details
  const matchedType = ALL_CAMPAIGN_TYPES.find(
    ct => ct.name.toLowerCase() === (override?.name || primary?.campaignType || "").toLowerCase()
  );
  const displayType = override || matchedType;

  return (
    <div className="space-y-4">
      {/* Primary */}
      <div className="bg-card border-2 border-primary/40 rounded-xl overflow-hidden">
        <div className="bg-primary/5 border-b border-primary/20 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-foreground">Recommended: {override?.name || primary?.campaignType}</span>
            <Badge className="text-xs">{override ? override.platform : primary?.platform}</Badge>
          </div>
          {override && (
            <span className="text-xs text-muted-foreground italic">Manual override active</span>
          )}
        </div>

        <div className="p-5 space-y-4">
          {!override && (
            <p className="text-sm text-foreground leading-relaxed">{primary?.whyBest}</p>
          )}

          {displayType && (
            <div className="bg-secondary/40 rounded-lg p-4 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Campaign Type Details</p>
              <p className="text-sm text-foreground">{displayType.description}</p>
              <div className="grid sm:grid-cols-3 gap-3 mt-3">
                <div className="bg-card rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Best for</p>
                  <p className="text-xs text-foreground">{displayType.bestFor}</p>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Not ideal for</p>
                  <p className="text-xs text-foreground">{displayType.notIdealFor}</p>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Starting budget</p>
                  <p className="text-xs text-foreground font-semibold">{displayType.startingBudget}</p>
                </div>
              </div>
            </div>
          )}

          {!override && (
            <div className="space-y-0">
              <InfoRow label="Suggested budget" value={primary?.suggestedBudget} />
              <InfoRow label="Funnel path" value={primary?.funnelPath} />
              <InfoRow label="First metric to watch" value={primary?.firstMetricToWatch} />
              <InfoRow label="Next step" value={primary?.nextStep} />
            </div>
          )}
        </div>
      </div>

      {/* Backup */}
      {backup && !override && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Backup Option: {backup.campaignType}</span>
            <Badge variant="outline" className="text-xs">{backup.platform}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{backup.whyBackup}</p>
        </div>
      )}

      {/* Warning */}
      {keyWarning && !override && (
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-0.5">Watch out</p>
            <p className="text-sm text-amber-700">{keyWarning}</p>
          </div>
        </div>
      )}

      {/* Override */}
      <OverrideSelector current={override} onSelect={onOverride} />
    </div>
  );
}