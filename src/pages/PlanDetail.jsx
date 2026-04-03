import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft, Star, Copy, Trash2, Download, Loader2
} from "lucide-react";
import ResultsObjective from "@/components/results/ResultsObjective";
import ResultsStrategy from "@/components/results/ResultsStrategy";
import ResultsCopy from "@/components/results/ResultsCopy";
import ResultsWarnings from "@/components/results/ResultsWarnings";

export default function PlanDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split("/");
  const planId = pathParts[pathParts.length - 1];
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plan, isLoading } = useQuery({
    queryKey: ["adPlan", planId],
    queryFn: async () => {
      const plans = await base44.entities.AdPlan.filter({ id: planId });
      return plans[0];
    },
    enabled: !!planId,
  });

  const toggleFavorite = useMutation({
    mutationFn: () => base44.entities.AdPlan.update(planId, { is_favorite: !plan?.is_favorite }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adPlan", planId] });
      queryClient.invalidateQueries({ queryKey: ["adPlans"] });
    },
  });

  const deletePlan = useMutation({
    mutationFn: () => base44.entities.AdPlan.delete(planId),
    onSuccess: () => {
      navigate("/saved-plans");
      toast({ title: "Plan deleted" });
    },
  });

  const duplicatePlan = async () => {
    if (!plan) return;
    const { id, created_date, updated_date, created_by, ...data } = plan;
    const newPlan = await base44.entities.AdPlan.create({
      ...data,
      campaign_name: `${plan.campaign_name} (Copy)`,
    });
    navigate(`/plan/${newPlan.id}`);
    toast({ title: "Plan duplicated" });
  };

  const exportPlan = () => {
    if (!plan?.ai_response) return;
    const ai = plan.ai_response;
    let text = `META AD STRATEGY — ${plan.campaign_name}\n`;
    text += `Business: ${plan.business_name}\n`;
    text += `Generated: ${plan.created_date ? new Date(plan.created_date).toLocaleDateString() : "N/A"}\n\n`;
    text += `═══ RECOMMENDED OBJECTIVE ═══\n${ai.recommendedObjective || ""}\n\n`;
    text += `═══ OPTIMIZATION GOAL ═══\n${ai.recommendedOptimizationGoal || ""}\n\n`;
    text += `═══ WHY THIS MAKES SENSE ═══\n${ai.whyThisMakesSense || ""}\n\n`;
    text += `═══ CAMPAIGN SETUP ═══\n${ai.campaignSetup || ""}\n\n`;
    text += `═══ AD SET STRATEGY ═══\n${ai.adSetStrategy || ""}\n\n`;
    text += `═══ PLACEMENTS ═══\n${ai.placements || ""}\n\n`;
    text += `═══ AUDIENCE ═══\n${ai.audienceDirection || ""}\n\n`;
    text += `═══ HOOKS ═══\n${(ai.hooks || []).map((h, i) => `${i + 1}. ${h}`).join("\n")}\n\n`;
    text += `═══ HEADLINES ═══\n${(ai.headlines || []).map((h, i) => `${i + 1}. ${h}`).join("\n")}\n\n`;
    text += `═══ PRIMARY TEXT ═══\n${(ai.primaryTextOptions || []).map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\n`;
    text += `═══ CTA SUGGESTIONS ═══\n${(ai.ctaSuggestions || []).map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\n`;
    text += `═══ CREATIVE ANGLES ═══\n${(ai.creativeAngleIdeas || []).map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\n`;
    if (ai.risksWarnings?.length) {
      text += `═══ WARNINGS ═══\n${ai.risksWarnings.map((w, i) => `⚠ ${w}`).join("\n")}\n\n`;
    }
    text += `═══ FINAL RECOMMENDATION ═══\n${ai.finalRecommendation || ""}`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${plan.campaign_name.replace(/\s+/g, "-")}-strategy.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Plan not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const ai = plan.ai_response || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{plan.campaign_name}</h1>
            <p className="text-sm text-muted-foreground">{plan.business_name} · {plan.industry}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleFavorite.mutate()}
          >
            <Star className={`w-4 h-4 mr-1.5 ${plan.is_favorite ? "text-amber-500 fill-amber-500" : ""}`} />
            {plan.is_favorite ? "Favorited" : "Favorite"}
          </Button>
          <Button variant="outline" size="sm" onClick={duplicatePlan}>
            <Copy className="w-4 h-4 mr-1.5" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={exportPlan}>
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => deletePlan.mutate()} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Results */}
      {ai.recommendedObjective ? (
        <div className="space-y-5">
          <ResultsObjective ai={ai} />
          <ResultsStrategy ai={ai} />
          <ResultsCopy ai={ai} />
          <ResultsWarnings ai={ai} />
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No AI strategy has been generated for this plan yet.</p>
        </div>
      )}
    </div>
  );
}