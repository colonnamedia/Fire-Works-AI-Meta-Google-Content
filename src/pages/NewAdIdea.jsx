import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Zap, ChevronRight, ChevronLeft, AlertCircle, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import UpgradeModal from "@/components/results/UpgradeModal";
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
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem("lastAdIdeaForm");
      return saved ? { ...INITIAL_FORM, ...JSON.parse(saved) } : INITIAL_FORM;
    } catch { return INITIAL_FORM; }
  });
  const [loading, setLoading] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(null);

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
      // 1. Save as AdRequest first
      const adRequest = await base44.entities.AdRequest.create({
        user_id: (await base44.auth.me()).id,
        business_name: form.businessName,
        website_url: form.landingPageUrl,
        business_type: form.businessType,
        industry: form.industry,
        offer_type: form.offerType,
        goal: form.goal,
        budget: form.budget,
        local_or_online: form.localOrOnline,
        landing_page_url: form.landingPageUrl,
        lead_form_or_website: form.leadFormOrWebsite,
        geographic_targeting: form.geographicTargeting,
        audience_description: form.audienceDescription,
        traffic_temperature: form.trafficTemperature,
        creative_preference: form.creativePreference,
        tone_of_voice: form.toneOfVoice,
        cta_preference: form.ctaPreference,
        notes: form.notes,
        platform_type: form.platformType,
        generated_status: 'pending'
      });

      // 2. Check entitlement
      const access = await base44.functions.invoke("checkAdGenerationAccess", {}).then(r => r.data);
      
      // 3. Route based on entitlement
      if (access.hasAccess) {
        navigate(`/results/${adRequest.id}`);
      } else {
        navigate(`/results-preview/${adRequest.id}`);
      }
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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

  const hasLastInputs = !!localStorage.getItem("lastAdIdeaForm");

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
      {upgradeModal && <UpgradeModal reason={upgradeModal} onClose={() => setUpgradeModal(null)} />}

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Ad Idea</h1>
          <p className="text-muted-foreground text-sm mt-1">Fill in your details to generate an AI-powered ad strategy.</p>
        </div>
        {hasLastInputs && (
          <Button variant="outline" size="sm" className="shrink-0 gap-2" onClick={() => {
            try {
              const saved = localStorage.getItem("lastAdIdeaForm");
              if (saved) setForm({ ...INITIAL_FORM, ...JSON.parse(saved) });
              setStep(4); // jump to final step
            } catch {}
          }}>
            <RefreshCw className="w-3.5 h-3.5" /> Quick Generate
          </Button>
        )}
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