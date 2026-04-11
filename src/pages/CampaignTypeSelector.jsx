import React, { useState } from "react";
import { Target } from "lucide-react";
import CampaignQuiz from "@/components/campaign/CampaignQuiz";
import CampaignLibrary from "@/components/campaign/CampaignLibrary";
import CampaignRecommendation from "@/components/campaign/CampaignRecommendation";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const TABS = ["Get a Recommendation", "Browse Campaign Types"];

export default function CampaignTypeSelector() {
  const { toast } = useToast();
  const [tab, setTab] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [override, setOverride] = useState(null);

  const handleSubmit = async (formAnswers) => {
    setAnswers(formAnswers);
    setLoading(true);
    setRecommendation(null);
    setOverride(null);
    try {
      const prompt = `You are an expert digital advertising strategist. Based on the following business profile, recommend the best campaign type.

Platform: ${formAnswers.platform}
Business Type: ${formAnswers.businessType}
Main Objective: ${formAnswers.objective}
Monthly Budget: ${formAnswers.budget}
Conversion Path: ${formAnswers.conversionPath}
Urgency Level: ${formAnswers.urgency}
Search Intent: ${formAnswers.searchIntent}
Landing Page Strength: ${formAnswers.landingPage}
Offer Type: ${formAnswers.offerType}

Return ONLY valid JSON with this structure:
{
  "primaryRecommendation": {
    "campaignType": "exact campaign type name",
    "platform": "Meta or Google",
    "whyBest": "2-3 sentence explanation tailored to their specific answers",
    "suggestedBudget": "specific budget recommendation based on their stated budget",
    "funnelPath": "describe the user journey from ad to conversion",
    "firstMetricToWatch": "the single most important metric to track first",
    "nextStep": "the immediate first action they should take to set this up"
  },
  "backupOption": {
    "campaignType": "exact campaign type name",
    "platform": "Meta or Google",
    "whyBackup": "1-2 sentence explanation of when to use this instead"
  },
  "keyWarning": "one important thing they should avoid or watch out for given their answers"
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            primaryRecommendation: {
              type: "object",
              properties: {
                campaignType: { type: "string" },
                platform: { type: "string" },
                whyBest: { type: "string" },
                suggestedBudget: { type: "string" },
                funnelPath: { type: "string" },
                firstMetricToWatch: { type: "string" },
                nextStep: { type: "string" }
              }
            },
            backupOption: {
              type: "object",
              properties: {
                campaignType: { type: "string" },
                platform: { type: "string" },
                whyBackup: { type: "string" }
              }
            },
            keyWarning: { type: "string" }
          }
        }
      });
      setRecommendation(result);
    } catch (err) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" /> Campaign Type Selector
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Answer a few questions to get the best campaign type recommendation, or browse all types in plain English.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="space-y-6">
          <CampaignQuiz onSubmit={handleSubmit} loading={loading} />
          {(recommendation || loading) && (
            <CampaignRecommendation
              recommendation={recommendation}
              loading={loading}
              override={override}
              onOverride={setOverride}
            />
          )}
        </div>
      )}

      {tab === 1 && <CampaignLibrary />}
    </div>
  );
}