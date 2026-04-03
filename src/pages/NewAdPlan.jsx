import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Zap } from "lucide-react";
import FormStepBusiness from "@/components/adplan/FormStepBusiness";
import FormStepStrategy from "@/components/adplan/FormStepStrategy";
import FormStepAudience from "@/components/adplan/FormStepAudience";
import FormStepCreative from "@/components/adplan/FormStepCreative";
import { useToast } from "@/components/ui/use-toast";

const STEPS = ["Business Info", "Strategy & Goals", "Audience", "Creative & Copy"];

export default function NewAdPlan() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    campaign_name: "",
    business_name: "",
    industry: "",
    business_type: "",
    local_or_online: "",
    offer_type: "",
    goal: "",
    budget: "",
    landing_page_url: "",
    lead_form_or_website: "",
    geographic_targeting: "",
    audience_description: "",
    traffic_temperature: "",
    creative_preference: "",
    tone_of_voice: "",
    notes: "",
    cta_preference: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleGenerate = async () => {
    if (!form.campaign_name || !form.business_name || !form.goal) {
      toast({ title: "Missing fields", description: "Please fill in campaign name, business name, and goal.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const aiResponse = await base44.functions.invoke("generateAdStrategy", {
        businessName: form.business_name,
        industry: form.industry,
        businessType: form.business_type,
        localOrOnline: form.local_or_online,
        offerType: form.offer_type,
        goal: form.goal,
        budget: form.budget,
        landingPageUrl: form.landing_page_url,
        leadFormOrWebsite: form.lead_form_or_website,
        geographicTargeting: form.geographic_targeting,
        audienceDescription: form.audience_description,
        trafficTemperature: form.traffic_temperature,
        creativePreference: form.creative_preference,
        toneOfVoice: form.tone_of_voice,
        notes: form.notes,
        ctaPreference: form.cta_preference,
      });

      const result = aiResponse.data;

      if (result.error) {
        toast({ title: "AI Error", description: result.error, variant: "destructive" });
        setLoading(false);
        return;
      }

      const plan = await base44.entities.AdPlan.create({
        ...form,
        ai_response: result,
        recommended_objective: result.recommendedObjective || "",
        recommended_optimization: result.recommendedOptimizationGoal || "",
        status: "generated",
      });

      navigate(`/plan/${plan.id}`);
    } catch (err) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const canGoNext = step < STEPS.length - 1;
  const canGoBack = step > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Ad Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill out the details and let AI build your strategy
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}
              `}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                {i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
          </React.Fragment>
        ))}
      </div>

      {/* Form content */}
      <div className="bg-card rounded-xl border border-border p-6 min-h-[350px]">
        {step === 0 && <FormStepBusiness form={form} update={update} />}
        {step === 1 && <FormStepStrategy form={form} update={update} />}
        {step === 2 && <FormStepAudience form={form} update={update} />}
        {step === 3 && <FormStepCreative form={form} update={update} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={!canGoBack || loading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {canGoNext ? (
          <Button onClick={() => setStep(step + 1)}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleGenerate} disabled={loading} className="min-w-[180px]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Strategy
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}