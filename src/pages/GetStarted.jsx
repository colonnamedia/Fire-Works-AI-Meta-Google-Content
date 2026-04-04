import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, ChevronRight, ChevronLeft, Loader2, Facebook, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";

const GOALS = [
  { value: "leads", label: "Generate Leads" },
  { value: "sales", label: "Drive Sales" },
  { value: "awareness", label: "Build Awareness" },
  { value: "traffic", label: "Get Website Traffic" },
  { value: "engagement", label: "Boost Engagement" },
  { value: "messaging", label: "Get Messages" },
];

const PLATFORMS = [
  { value: "meta", label: "Meta Ads", sub: "Facebook & Instagram", icon: Facebook, color: "text-blue-400" },
  { value: "google", label: "Google Ads", sub: "Search & Display", icon: Search, color: "text-green-400" },
  { value: "both", label: "Both Platforms", sub: "Meta + Google", icon: Layers, color: "text-[#E53E3E]" },
];

const STEPS = ["You", "Business", "Campaign"];

const INITIAL = {
  fullName: "", email: "",
  businessName: "", industry: "", businessType: "", offerType: "",
  platformInterest: "meta", goal: "leads", budget: "", localOrOnline: "local"
};

export default function GetStarted() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved form data on mount
  useEffect(() => {
    const loadSavedForm = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.saved_form_data) {
          setForm(prev => ({ ...prev, ...user.saved_form_data }));
        }
      } catch (err) {
        // User not logged in or no saved data—just use initial form
      }
    };
    loadSavedForm();
  }, []);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const canAdvance = () => {
    if (step === 0) return form.fullName.trim() && form.email.trim();
    if (step === 1) return form.businessName.trim() && form.industry.trim();
    return true;
  };

  const handleSubmit = async () => {
    if (!form.businessName || !form.email) return;
    setLoading(true);
    setError("");
    try {
      // Save form to user profile
      await base44.auth.updateMe({ 
        saved_form_data: form,
        saved_form_timestamp: new Date().toISOString()
      });
      
      const res = await base44.functions.invoke("generateFreeSample", form);
      if (res.data?.error) throw new Error(res.data.error);
      navigate(`/free-sample/${res.data.leadId}`, { state: { freeSample: res.data.freeSample, form } });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col">
      {/* Nav */}
      <nav className="border-b border-white/10 h-14 flex items-center justify-between px-4 sm:px-8 shrink-0">
        <Link to="/" className="flex items-center gap-2 font-bold text-sm">
          <div className="w-6 h-6 bg-[#E53E3E] rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          Fire-Works AI
        </Link>
        <Link to="/pricing" className="text-sm text-white/40 hover:text-white transition-colors">Pricing</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Build Your Ad Strategy</h1>
            <p className="text-white/40 text-sm">Answer a few questions and we'll generate your personalized ad strategy instantly.</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center mb-8">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 text-xs font-semibold ${i === step ? "text-white" : i < step ? "text-white/60" : "text-white/25"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${i === step ? "bg-[#E53E3E] border-[#E53E3E] text-white" : i < step ? "bg-white/20 border-white/20 text-white" : "border-white/20 text-white/30"}`}>
                    {i + 1}
                  </div>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-3 ${i < step ? "bg-white/30" : "bg-white/10"}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-4">Tell us about yourself</h2>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Full Name</label>
                  <Input
                    placeholder="Jane Smith"
                    value={form.fullName}
                    onChange={e => update("fullName", e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Email Address <span className="text-[#E53E3E]">*</span></label>
                  <Input
                    placeholder="jane@company.com"
                    type="email"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-4">About your business</h2>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Business Name <span className="text-[#E53E3E]">*</span></label>
                  <Input
                    placeholder="e.g. City Plumbing Co."
                    value={form.businessName}
                    onChange={e => update("businessName", e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Industry <span className="text-[#E53E3E]">*</span></label>
                  <Input
                    placeholder="e.g. Home Services, Fitness, Ecommerce"
                    value={form.industry}
                    onChange={e => update("industry", e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Main Offer / Product</label>
                  <Input
                    placeholder="e.g. Emergency plumbing repairs, Personal training packages"
                    value={form.offerType}
                    onChange={e => update("offerType", e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-semibold text-white mb-4">Your campaign goals</h2>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Which platform?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLATFORMS.map(p => (
                      <button
                        key={p.value}
                        onClick={() => update("platformInterest", p.value)}
                        className={`p-3 rounded-xl border text-center transition-all ${form.platformInterest === p.value ? "border-[#E53E3E] bg-[#E53E3E]/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                      >
                        <p.icon className={`w-4 h-4 mx-auto mb-1 ${form.platformInterest === p.value ? "text-[#E53E3E]" : "text-white/40"}`} />
                        <p className={`text-xs font-semibold ${form.platformInterest === p.value ? "text-white" : "text-white/50"}`}>{p.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Primary Goal</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GOALS.map(g => (
                      <button
                        key={g.value}
                        onClick={() => update("goal", g.value)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all ${form.goal === g.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"}`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Monthly Budget (optional)</label>
                  <Input
                    placeholder="e.g. $500/month"
                    value={form.budget}
                    onChange={e => update("budget", e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-[#E53E3E] text-sm mb-4 text-center">{error}</p>}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="text-white/40 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canAdvance()}
                className="bg-[#E53E3E] hover:bg-[#C53030] text-white font-semibold"
              >
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !form.email || !form.businessName}
                className="bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold px-6"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Building your strategy...</>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" />Get My Ad Strategy</>
                )}
              </Button>
            )}
          </div>

          <p className="text-center text-xs text-white/20 mt-4">No credit card required. Free preview instantly.</p>
        </div>
      </div>
    </div>
  );
}