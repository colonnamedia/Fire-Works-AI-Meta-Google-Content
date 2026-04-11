import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Facebook, Search } from "lucide-react";
import { ALL_CAMPAIGN_TYPES } from "./campaignData";

const PLATFORM_FILTERS = ["All", "Meta", "Google"];

function CampaignCard({ ct }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-secondary/30 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            ct.platform === "Meta" ? "bg-blue-100" : "bg-green-100"
          }`}>
            {ct.platform === "Meta"
              ? <Facebook className="w-4 h-4 text-blue-600" />
              : <Search className="w-4 h-4 text-green-600" />
            }
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-semibold text-sm text-foreground">{ct.name}</span>
              <Badge variant="outline" className="text-xs">{ct.platform}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{ct.tagline}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-border space-y-4">
          <p className="text-sm text-foreground leading-relaxed">{ct.description}</p>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">When to use</p>
            <p className="text-sm text-foreground">{ct.whenToUse}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-700 mb-1">✓ Best for</p>
              <p className="text-xs text-green-800">{ct.bestFor}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-700 mb-1">✗ Not ideal for</p>
              <p className="text-xs text-red-800">{ct.notIdealFor}</p>
            </div>
            <div className="bg-secondary border border-border rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">💰 Starting budget</p>
              <p className="text-xs font-bold text-foreground">{ct.startingBudget}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CampaignLibrary() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? ALL_CAMPAIGN_TYPES
    : ALL_CAMPAIGN_TYPES.filter(ct => ct.platform === filter);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Filter by platform:</span>
        {PLATFORM_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} campaign types</span>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {filtered.map(ct => <CampaignCard key={ct.id} ct={ct} />)}
      </div>
    </div>
  );
}