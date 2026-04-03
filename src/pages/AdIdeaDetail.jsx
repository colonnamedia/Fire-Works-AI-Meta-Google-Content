import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import ResultsObjective from "@/components/results/ResultsObjective";
import ResultsStrategy from "@/components/results/ResultsStrategy";
import ResultsCopy from "@/components/results/ResultsCopy";
import ResultsWarnings from "@/components/results/ResultsWarnings";

export default function AdIdeaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    const ai = entry?.ai_response_json;
    if (!ai) return;
    const text = [
      `AD STRATEGY: ${entry.title}`,
      `Business: ${entry.business_name} | Goal: ${entry.goal} | Budget: ${entry.budget}`,
      ``,
      `OBJECTIVE: ${ai.recommendedObjective}`,
      `OPTIMIZATION: ${ai.recommendedOptimizationGoal}`,
      `WHY: ${ai.whyThisMakesSense}`,
      ``,
      `CAMPAIGN SETUP: ${ai.campaignSetup}`,
      `AD SET STRATEGY: ${ai.adSetStrategy}`,
      `PLACEMENTS: ${ai.placements}`,
      `AUDIENCE: ${ai.audienceDirection}`,
      ``,
      `HOOKS:\n${(ai.hooks || []).map((h, i) => `${i + 1}. ${h}`).join('\n')}`,
      `HEADLINES:\n${(ai.headlines || []).map((h, i) => `${i + 1}. ${h}`).join('\n')}`,
      `PRIMARY TEXT:\n${(ai.primaryTextOptions || []).map((t, i) => `${i + 1}. ${t}`).join('\n\n')}`,
      ``,
      `FINAL RECOMMENDATION: ${ai.finalRecommendation}`,
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.title?.replace(/\s+/g, '-')}-strategy.txt`;
    a.click();
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

  const ai = entry.ai_response_json;

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
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-muted-foreground">{entry.business_name}</span>
              {entry.was_overage_charge && <Badge variant="secondary" className="text-xs text-amber-600">Overage $1.99</Badge>}
              {entry.was_included_credit && <Badge variant="secondary" className="text-xs text-green-600">Included Credit</Badge>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => favMutation.mutate()}>
            <Star className={`w-4 h-4 ${entry.is_favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleExport}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate()}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {ai ? (
        <>
          <ResultsObjective ai={ai} />
          <ResultsStrategy ai={ai} />
          <ResultsCopy ai={ai} />
          <ResultsWarnings ai={ai} />
        </>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">No AI strategy found for this entry.</p>
        </div>
      )}
    </div>
  );
}