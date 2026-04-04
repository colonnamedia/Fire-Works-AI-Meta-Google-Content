import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Trash2, Facebook, Search, Layers, FileText, Copy, RefreshCw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { exportStrategyPdf } from "@/utils/exportPdf";
import ResultsObjective from "@/components/results/ResultsObjective";
import ResultsStrategy from "@/components/results/ResultsStrategy";
import ResultsCopy from "@/components/results/ResultsCopy";
import ResultsWarnings from "@/components/results/ResultsWarnings";
import ResultsGoogle from "@/components/results/ResultsGoogle";
import AdScoreCard from "@/components/results/AdScoreCard";
import CompetitorInsight from "@/components/results/CompetitorInsight";
import OfferOptimization from "@/components/results/OfferOptimization";
import AdConversionCheck from "@/components/results/AdConversionCheck";

const platformLabels = {
  meta: { label: "Meta Ads", icon: Facebook, color: "text-blue-600 bg-blue-50 border-blue-200" },
  google: { label: "Google Ads", icon: Search, color: "text-green-600 bg-green-50 border-green-200" },
  both: { label: "Meta + Google", icon: Layers, color: "text-primary bg-primary/5 border-primary/20" },
};

export default function AdIdeaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("meta");

  const { data: entry, isLoading } = useQuery({
    queryKey: ["adIdeaEntry", id],
    queryFn: () => base44.entities.AdIdeaEntry.filter({ id }).then(r => r[0]),
  });

  const favMutation = useMutation({
    mutationFn: () => base44.entities.AdIdeaEntry.update(id, { is_favorite: !entry?.is_favorite }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adIdeaEntry", id] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.AdIdeaEntry.delete(id),
    onSuccess: () => { toast({ title: "Deleted" }); navigate("/saved-ideas"); },
  });

  const handleExport = () => {
    if (!entry) return;
    exportStrategyPdf(entry);
  };

  const handleCopyAll = () => {
    if (!entry) return;
    const ai = entry.ai_response_json || {};
    const m = ai.meta || ai;
    const g = ai.google;
    const parts = [];
    if (m?.recommendedObjective) parts.push(`OBJECTIVE: ${m.recommendedObjective}`);
    if (m?.hooks?.length) parts.push(`HOOKS:\n${m.hooks.map((h, i) => `${i + 1}. ${h}`).join("\n")}`);
    if (m?.headlines?.length) parts.push(`HEADLINES:\n${m.headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}`);
    if (m?.primaryTextOptions?.short) parts.push(`PRIMARY TEXT (Short):\n${m.primaryTextOptions.short}`);
    if (g?.searchHeadlines?.length) parts.push(`GOOGLE HEADLINES:\n${g.searchHeadlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}`);
    if (g?.descriptions?.length) parts.push(`GOOGLE DESCRIPTIONS:\n${g.descriptions.map((d, i) => `${i + 1}. ${d}`).join("\n")}`);
    navigator.clipboard.writeText(parts.join("\n\n"));
    toast({ title: "Copied!", description: "All copy elements copied to clipboard." });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
  }

  if (!entry) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Entry not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/saved-ideas")}>Back to Saved Ideas</Button>
      </div>
    );
  }

  const ai = entry.ai_response_json || {};
  const platformType = entry.platform_type || 'meta';
  const hasMeta = !!(ai.meta || (!ai.google && ai.recommendedObjective));
  const hasGoogle = !!(ai.google || (!ai.meta && ai.recommendedCampaignType));
  const isBoth = platformType === 'both' || (hasMeta && hasGoogle);
  const platformInfo = platformLabels[platformType] || platformLabels.meta;
  const PlatformIcon = platformInfo.icon;

  // Normalize legacy single-platform entries
  const metaData = ai.meta || (hasMeta && !ai.google ? ai : null);
  const googleData = ai.google || (hasGoogle && !ai.meta ? ai : null);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate("/saved-ideas")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{entry.title}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm text-muted-foreground">{entry.business_name}</span>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${platformInfo.color}`}>
                <PlatformIcon className="w-3 h-3" />
                {platformInfo.label}
              </span>
              {entry.was_overage_charge && <Badge variant="secondary" className="text-xs text-amber-600">Overage $1.99</Badge>}
              {entry.was_included_credit && <Badge variant="secondary" className="text-xs text-green-600">Included Credit</Badge>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => favMutation.mutate()} title={entry.is_favorite ? "Remove from Winning Ads" : "Add to Winning Ads"}>
            <Star className={`w-4 h-4 ${entry.is_favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyAll} className="gap-1.5">
            <Copy className="w-4 h-4" /> Copy All
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <FileText className="w-4 h-4" /> Export PDF
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate()}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Platform Tabs (only for 'both') */}
      {isBoth && (
        <div className="flex gap-2 border-b border-border pb-0">
          <button
            onClick={() => setActiveTab("meta")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === "meta" ? "border-blue-500 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <Facebook className="w-4 h-4" /> Meta Ads
          </button>
          <button
            onClick={() => setActiveTab("google")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === "google" ? "border-green-500 text-green-600" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <Search className="w-4 h-4" /> Google Ads
          </button>
        </div>
      )}

      {/* Score Card */}
      <AdScoreCard ai={ai} platformType={platformType} />

      {/* Results */}
      {!isBoth && platformType === 'google' ? (
        <>
          <ResultsGoogle ai={googleData} />
          <CompetitorInsight ai={googleData} />
          <OfferOptimization ai={googleData} />
        </>
      ) : !isBoth ? (
        <>
          <ResultsObjective ai={metaData} />
          <ResultsStrategy ai={metaData} />
          <ResultsCopy ai={metaData} />
          <CompetitorInsight ai={metaData} />
          <OfferOptimization ai={metaData} />
          {entry.landing_page_url && <AdConversionCheck ai={metaData} />}
          <ResultsWarnings ai={metaData} />
        </>
      ) : activeTab === "meta" ? (
        <>
          <ResultsObjective ai={metaData} />
          <ResultsStrategy ai={metaData} />
          <ResultsCopy ai={metaData} />
          <CompetitorInsight ai={metaData} />
          <OfferOptimization ai={metaData} />
          {entry.landing_page_url && <AdConversionCheck ai={metaData} />}
          <ResultsWarnings ai={metaData} />
        </>
      ) : (
        <>
          <ResultsGoogle ai={googleData} />
          <CompetitorInsight ai={googleData} />
          <OfferOptimization ai={googleData} />
        </>
      )}
    </div>
  );
}