import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Zap, ChevronRight, ChevronLeft, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import FormStepBusiness from "@/components/adplan/FormStepBusiness";
import FormStepStrategy from "@/components/adplan/FormStepStrategy";
import FormStepAudience from "@/components/adplan/FormStepAudience";
import FormStepCreative from "@/components/adplan/FormStepCreative";
import PlatformSelector from "@/components/adplan/PlatformSelector";

const STEPS = ["Platform", "Business", "Strategy", "Audience", "Creative"];

const INITIAL_FORM = {
  platformType: "meta",
  title: "", businessName: "", industry: "", businessType: "",
  localOrOnline: "local", offerType: "", goal: "leads", budget: "",
  landingPageUrl: "", leadFormOrWebsite: "lead_form",
  geographicTargeting: "", audienceDescription: "", trafficTemperature: "cold",
  creativePreference: "image", toneOfVoice: "professional", notes: "", ctaPreference: ""
};

export default function NewAdIdea() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const { data: status } = useQuery({
    queryKey: ["userStatus"],
    queryFn: () => base44.functions.invoke("getUserStatus", {}).then(r => r.data),
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const canGenerate = status?.isAdmin || status?.canGenerate;
  const isOverage = !status?.isAdmin && (status?.includedRemaining || 0) <= 0;
  const planType = status?.planType || 'meta';
  const needsUpgrade = !status?.isAdmin && form.platformType === 'both' && planType !== 'both';

  const handleGenerate = async () => {
    if (!form.businessName || !form.goal) {
      toast({ title: "Missing fields", description: "Please fill in business name and goal.", variant: "destructive" });
      return;
    }
    if (needsUpgrade) {
      navigate("/billing");
      return;
    }
    setLoading(true);
    try {
      const entryTitle = form.title || `${form.businessName} - ${form.goal}`;
      const res = await base44.functions.invoke("generateAdIdea", { ...form, title: entryTitle });
      if (res.data?.error) throw new Error(res.data.error || res.data.message);
      
      queryClient.invalidateQueries({ queryKey: ["userStatus"] });
      queryClient.invalidateQueries({ queryKey: ["adIdeaEntries"] });
      toast({ title: "Strategy generated!", description: "Your ad idea has been saved." });
      navigate(`/idea/${res.data.entry.id}`);
    } catch (err) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const stepComponents = [
    <div className="space-y-4"><PlatformSelector value={form.platformType} onChange={(v) => update("platformType", v)} /></div>,
    <FormStepBusiness form={form} update={update} />,
    <FormStepStrategy form={form} update={update} />,
    <FormStepAudience form={form} update={update} />,
    <FormStepCreative form={form} update={update} />,
  ];

  if (!canGenerate && status !== undefined) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Subscription Required</h2>
        <p className="text-muted-foreground mb-6">You need an active subscription to generate ad ideas. The Starter Plan is $4.99/month and includes 5 entries.</p>
        <Button onClick={() => navigate("/billing")}>View Plans</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">New Ad Idea</h1>
        <p className="text-muted-foreground text-sm mt-1">Fill in your details to generate an AI-powered ad strategy.</p>
      </div>

      {/* Overage Warning */}
      {isOverage && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">No included credits remaining</p>
            <p className="text-sm text-amber-700">This entry will be charged at $1.99 (overage rate).</p>
          </div>
        </div>
      )}

      {/* Upgrade Warning */}
      {needsUpgrade && (
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl mb-5">
          <AlertCircle className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Upgrade required for Both Platforms</p>
            <p className="text-sm text-muted-foreground">The Both Platforms plan is $8.99/month and generates Meta + Google strategies in one go.</p>
          </div>
          <Button size="sm" onClick={() => navigate("/billing")}>Upgrade</Button>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-1.5 text-xs font-medium px-1 ${i === step ? "text-primary" : i < step ? "text-foreground cursor-pointer" : "text-muted-foreground cursor-default"}`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${i === step ? "bg-primary text-white border-primary" : i < step ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"}`}>
                {i + 1}
              </div>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-foreground" : "bg-border"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Title */}
      <div className="bg-card rounded-xl border border-border p-6 mb-4">
        <h2 className="font-semibold text-foreground mb-4 text-base">{STEPS[step]} Details</h2>
        {stepComponents[step]}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <><Zap className="w-4 h-4 mr-2 animate-pulse" />Generating...</>
            ) : needsUpgrade ? (
              <>Upgrade to Generate Both</>
            ) : (
              <><Zap className="w-4 h-4 mr-2" />Generate Strategy{isOverage ? " ($1.99)" : ""}</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}