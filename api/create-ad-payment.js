import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Zap, ChevronRight, ChevronLeft, Loader2, Search, Facebook, Layers, Image, LayoutGrid, Key } from "lucide-react";

const GOALS = [
  { value: "leads", label: "Generate Leads" },
  { value: "sales", label: "Drive Sales" },
  { value: "awareness", label: "Build Awareness" },
  { value: "traffic", label: "Get Website Traffic" },
  { value: "engagement", label: "Boost Engagement" },
  { value: "messaging", label: "Get Messages" },
];

const CONTENT_TYPES = [
  { value: "google_ads", label: "Google Ads Campaign", sub: "Full setup + headlines + keywords", icon: Search, price: "$9.99" },
  { value: "meta_ads", label: "Meta Ads Campaign", sub: "Full setup + copy + audience", icon: Facebook, price: "$9.99" },
  { value: "organic_social", label: "Organic Social", sub: "Captions, hashtags, reel ideas", icon: Image, price: "$4.99" },
  { value: "keyword_research", label: "Keyword Research", sub: "Primary, long-tail, negative + SEO", icon: Key, price: "$4.99" },
  { value: "google_meta", label: "Google + Meta", sub: "Both full ad campaigns", icon: Layers, price: "$16.99" },
  { value: "everything", label: "Everything", sub: "Google + Meta + Social + Keywords", icon: LayoutGrid, price: "$19.99" },
];

const LOCATION_TYPES = [
  { value: "local", label: "Local — serve a specific city/area" },
  { value: "regional", label: "Regional — multiple cities/states" },
  { value: "national", label: "National — anywhere in the country" },
  { value: "online", label: "Online only — no physical location" },
];

const CHALLENGES = [
  { value: "not_enough_traffic", label: "Not enough people finding me" },
  { value: "no_conversions", label: "Traffic but no leads or sales" },
  { value: "no_followup", label: "No follow-up system" },
  { value: "no_strategy", label: "No clear ad strategy" },
  { value: "low_budget", label: "Limited budget" },
  { value: "no_time", label: "No time to manage ads" },
];

const STEPS = ["You", "Business", "Details", "Campaign"];

const INITIAL = {
  fullName: "", email: "",
  businessName: "", industry: "", offerType: "", websiteUrl: "",
  targetAudience: "", locationType: "local", uniqueSellingPoint: "", biggestChallenge: "",
  contentType: "google_ads", goal: "leads", budget: "",
};

const PRICES = {
  google_ads: "$9.99", meta_ads: "$9.99", organic_social: "$4.99",
  keyword_research: "$4.99", google_meta: "$16.99", everything: "$19.99"
};

export default function GetStarted() {
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
      fetch(`/api/get-user-profile?clerk_user_id=${user.id}`)
        .then(r => r.json())
        .then(profile => {
          if (profile && !profile.error) {
            setForm(prev => ({
              ...prev,
              businessName: profile.business_name || "",
              industry: profile.industry || "",
              offerType: profile.offer_type || "",
              websiteUrl: profile.website_url || "",
              targetAudience: profile.target_audience || "",
              locationType: profile.location_type || "local",
              uniqueSellingPoint: profile.unique_selling_point || "",
              biggestChallenge: profile.biggest_challenge || "",
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
    if (step === 2) return form.targetAudience.trim() && form.locationType;
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
          email: form.email,
          full_name: form.fullName,
          business_name: form.businessName,
          industry: form.industry,
          offer_type: form.offerType,
          website_url: form.websiteUrl,
          target_audience: form.targetAudience,
          location_type: form.locationType,
          unique_selling_point: form.uniqueSellingPoint,
          biggest_challenge: form.biggestChallenge,
          content_type: form.contentType,
          goal: form.goal,
          budget: form.budget,
          clerk_user_id: isSignedIn ? user.id : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');

      const paymentRes = await fetch('/api/create-ad-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId: data.id,
          email: form.email,
          content_type: form.contentType,
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

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53E3E]/50";

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
            <h1 className="text-3xl font-black text-white mb-2">Build Your Ad Content</h1>
            <p className="text-white/40 text-sm">Answer a few questions and get AI-generated ad content instantly.</p>
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
                  <input placeholder="Jane Smith" value={form.fullName} onChange={e => update("fullName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Email Address *</label>
                  <input placeholder="jane@company.com" type="email" value={form.email} onChange={e => update("email", e.target.value)} className={inputClass} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-4">About your business</h2>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Business Name *</label>
                  <input placeholder="e.g. City Plumbing Co." value={form.businessName} onChange={e => update("businessName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Industry *</label>
                  <input placeholder="e.g. Home Services, Fitness, Ecommerce" value={form.industry} onChange={e => update("industry", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Main Offer / Product</label>
                  <input placeholder="e.g. Emergency plumbing repairs, Personal training" value={form.offerType} onChange={e => update("offerType", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Website URL</label>
                  <input placeholder="e.g. https://yourwebsite.com" value={form.websiteUrl} onChange={e => update("websiteUrl", e.target.value)} className={inputClass} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-4">Tell us more</h2>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Who is your ideal customer? *</label>
                  <input placeholder="e.g. Homeowners aged 35-60 in Pittsburgh who need plumbing" value={form.targetAudience} onChange={e => update("targetAudience", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Where do you serve customers? *</label>
                  <div className="grid grid-cols-1 gap-2">
                    {LOCATION_TYPES.map(l => (
                      <button key={l.value} onClick={() => update("locationType", l.value)}
                        className={`text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${form.locationType === l.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">What makes you different?</label>
                  <input placeholder="e.g. Same-day service, 20 years experience, lowest price guarantee" value={form.uniqueSellingPoint} onChange={e => update("uniqueSellingPoint", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Biggest marketing challenge</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CHALLENGES.map(c => (
                      <button key={c.value} onClick={() => update("biggestChallenge", c.value)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all ${form.biggestChallenge === c.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"}`}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-semibold text-white mb-4">What do you need?</h2>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Select content type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {CONTENT_TYPES.map(ct => (
                      <button key={ct.value} onClick={() => update("contentType", ct.value)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all ${form.contentType === ct.value ? "border-[#E53E3E] bg-[#E53E3E]/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                        <ct.icon className={`w-4 h-4 flex-shrink-0 ${form.contentType === ct.value ? "text-[#E53E3E]" : "text-white/40"}`} />
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${form.contentType === ct.value ? "text-white" : "text-white/60"}`}>{ct.label}</p>
                          <p className={`text-xs ${form.contentType === ct.value ? "text-white/60" : "text-white/30"}`}>{ct.sub}</p>
                        </div>
                        <span className={`text-sm font-bold flex-shrink-0 ${form.contentType === ct.value ? "text-[#E53E3E]" : "text-white/30"}`}>{ct.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Primary Goal</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GOALS.map(g => (
                      <button key={g.value} onClick={() => update("goal", g.value)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all ${form.goal === g.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"}`}>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Monthly Budget (optional)</label>
                  <input placeholder="e.g. $500/month" value={form.budget} onChange={e => update("budget", e.target.value)} className={inputClass} />
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-[#E53E3E] text-sm mb-4 text-center">{error}</p>}

          <div className="flex items-center justify-between">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="flex items-center gap-1 text-white/40 hover:text-white text-sm disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canAdvance()}
                className="flex items-center gap-1 bg-[#E53E3E] hover:bg-[#C53030] text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || !form.email || !form.businessName}
                className="flex items-center gap-2 bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Zap className="w-4 h-4" />Get My Content — {PRICES[form.contentType]}</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
