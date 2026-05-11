import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Zap, ChevronRight, ChevronLeft, Loader2, Facebook, Search, Layers } from "lucide-react";

const GOALS = [
  { value: "leads", label: "Generate Leads" },
  { value: "sales", label: "Drive Sales" },
  { value: "awareness", label: "Build Awareness" },
  { value: "traffic", label: "Get Website Traffic" },
  { value: "engagement", label: "Boost Engagement" },
  { value: "messaging", label: "Get Messages" },
];

const PLATFORMS = [
  { value: "meta", label: "Meta Ads", sub: "Facebook & Instagram + Social Posts", icon: Facebook, color: "text-blue-400", price: "$4.99" },
  { value: "google", label: "Google Ads", sub: "Search Headlines & Keywords", icon: Search, color: "text-green-400", price: "$4.99" },
  { value: "both", label: "Both Platforms", sub: "Google + Meta + Social Posts", icon: Layers, color: "text-[#E53E3E]", price: "$8.99" },
];

const STEPS = ["You", "Business", "Campaign"];

const INITIAL = {
  fullName: "", email: "",
  businessName: "", industry: "", offerType: "",
  platform: "meta", goal: "leads", budget: "",
};

export default function GetStarted() {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSignedIn && user) {
      setForm(prev => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
      // Load saved profile
      fetch(`/api/get-user-profile?clerk_user_id=${user.id}`)
        .then(r => r.json())
        .then(profile => {
          if (profile && !profile.error) {
            setForm(prev => ({
              ...prev,
              businessName: profile.business_name || "",
              industry: profile.industry || "",
              offerType: profile.offer_type || "",
              goal: profile.goal || "leads",
              budget: profile.budget || "",
            }));
          }
        })
        .catch(() => {});
    }
  }, [isSignedIn, user]);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const canAdvance = () => {
    if (step === 0) return form.fullName.trim() && form.email.trim();
    if (step === 1) return form.businessName.trim() && form.industry.trim();
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/generate-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          full_name: form.fullName,
          business_name: form.businessName,
          offer_type: form.offerType,
          clerk_user_id: isSignedIn ? user.id : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');

      // Go to payment
      const paymentRes = await fetch('/api/create-ad-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId: data.id,
          email: form.email,
          platform: form.platform,
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentData.error || 'Payment failed');

      window.location.href = paymentData.url;
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col">
      <nav className="border-b border-white/10 h-14 flex items-center justify-between px-4 sm:px-8 shrink-0">
        <Link to="/" className="flex items-center gap-2 font-bold text-sm">
          <div className="w-6 h-6 bg-[#E53E3E] rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          Fire-Works AI
        </Link>
        {isSignedIn && (
          <Link to="/dashboard" className="text-sm text-white/40 hover:text-white transition-colors">
            My Dashboard
          </Link>
        )}
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Build Your Ad Copy</h1>
            <p className="text-white/40 text-sm">Answer a few questions and get AI-generated ad copy instantly.</p>
          </div>

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

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-4">Tell us about yourself</h2>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Full Name</label>
                  <input
                    placeholder="Jane Smith"
                    value={form.fullName}
                    onChange={e => update("fullName", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53E3E]/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Email Address *</label>
                  <input
                    placeholder="jane@company.com"
                    type="email"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53E3E]/50"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-4">About your business</h2>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Business Name *</label>
                  <input
                    placeholder="e.g. City Plumbing Co."
                    value={form.businessName}
                    onChange={e => update("businessName", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53E3E]/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Industry *</label>
                  <input
                    placeholder="e.g. Home Services, Fitness, Ecommerce"
                    value={form.industry}
                    onChange={e => update("industry", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53E3E]/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Main Offer / Product</label>
                  <input
                    placeholder="e.g. Emergency plumbing repairs, Personal training"
                    value={form.offerType}
                    onChange={e => update("offerType", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53E3E]/50"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-semibold text-white mb-4">Your campaign</h2>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Which platform?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLATFORMS.map(p => (
                      <button
                        key={p.value}
                        onClick={() => update("platform", p.value)}
                        className={`p-3 rounded-xl border text-center transition-all ${form.platform === p.value ? "border-[#E53E3E] bg-[#E53E3E]/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                      >
                        <p.icon className={`w-4 h-4 mx-auto mb-1 ${form.platform === p.value ? "text-[#E53E3E]" : "text-white/40"}`} />
                        <p className={`text-xs font-semibold ${form.platform === p.value ? "text-white" : "text-white/50"}`}>{p.label}</p>
                        <p className={`text-xs mt-0.5 ${form.platform === p.value ? "text-[#E53E3E]" : "text-white/30"}`}>{p.price}</p>
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
                  <input
                    placeholder="e.g. $500/month"
                    value={form.budget}
                    onChange={e => update("budget", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53E3E]/50"
                  />
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-[#E53E3E] text-sm mb-4 text-center">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-1 text-white/40 hover:text-white text-sm disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canAdvance()}
                className="flex items-center gap-1 bg-[#E53E3E] hover:bg-[#C53030] text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !form.email || !form.businessName}
                className="flex items-center gap-2 bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
                ) : (
                  <><Zap className="w-4 h-4" />Get My Ad Copy — {form.platform === 'both' ? '$8.99' : '$4.99'}</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
