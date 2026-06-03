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

const REVENUE_RANGES = [
  { value: "under_5k", label: "Under $5,000/mo" },
  { value: "5k_20k", label: "$5,000 – $20,000/mo" },
  { value: "20k_50k", label: "$20,000 – $50,000/mo" },
  { value: "50k_plus", label: "$50,000+/mo" },
  { value: "pre_revenue", label: "Pre-revenue / Just starting" },
];

const TICKET_VALUES = [
  { value: "under_50", label: "Under $50" },
  { value: "50_200", label: "$50 – $200" },
  { value: "200_1000", label: "$200 – $1,000" },
  { value: "1000_5000", label: "$1,000 – $5,000" },
  { value: "5000_plus", label: "$5,000+" },
];

const TRACKING_OPTIONS = [
  { value: "both", label: "Yes — Google Analytics + Meta Pixel" },
  { value: "google_only", label: "Yes — Google Analytics only" },
  { value: "meta_only", label: "Yes — Meta Pixel only" },
  { value: "none", label: "No tracking set up" },
  { value: "not_sure", label: "Not sure" },
];

const CTA_OPTIONS = [
  { value: "call", label: "Call Us" },
  { value: "form", label: "Fill Out a Form" },
  { value: "purchase", label: "Buy Now / Purchase" },
  { value: "book", label: "Book an Appointment" },
  { value: "message", label: "Send a Message" },
  { value: "visit", label: "Visit Our Location" },
];

const STEPS = ["You", "Business", "Details", "Marketing", "Campaign"];

const INITIAL = {
  fullName: "", email: "",
  businessName: "", industry: "", offerType: "", websiteUrl: "",
  targetAudience: "", locationType: "local", uniqueSellingPoint: "", biggestChallenge: "",
  monthlyRevenue: "", avgTicketValue: "", hasTracking: "", mainCta: "",
  hasReviews: "", currentlyRunningAds: "", biggestCompetitor: "",
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
monthlyRevenue: profile.monthly_revenue || "",
avgTicketValue: profile.avg_ticket_value || "",
hasTracking: profile.has_tracking || "",
mainCta: profile.main_cta || "",
hasReviews: profile.has_reviews || "",
currentlyRunningAds: profile.currently_running_ads || "",
biggestCompetitor: profile.biggest_competitor || "",
goal: profile.goal || "leads",
              monthlyRevenue: profile.monthly_revenue || "",
              avgTicketValue: profile.avg_ticket_value || "",
              hasTracking: profile.has_tracking || "",
              mainCta: profile.main_cta || "",
              hasReviews: profile.has_reviews || "",
              currentlyRunningAds: profile.currently_running_ads || "",
              biggestCompetitor: profile.biggest_competitor || "",
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
          monthly_revenue: form.monthlyRevenue,
          avg_ticket_value: form.avgTicketValue,
          has_tracking: form.hasTracking,
          main_cta: form.mainCta,
          has_reviews: form.hasReviews,
          currently_running_ads: form.currentlyRunningAds,
          biggest_competitor: form.biggestCompetitor,
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

  const SelectGrid = ({ options, field, cols = 2 }) => (
    <div className={`grid grid-cols-${cols} gap-2`}>
      {options.map(o => (
        <button key={o.value} onClick={() => update(field, o.value)}
          className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${form[field] === o.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );

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
            <p className="text-white/40 text-sm">The more detail you give, the better your results.</p>
          </div>

          <div className="flex items-center mb-8">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${i === step ? "text-white" : i < step ? "text-white/60" : "text-white/25"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${i === step ? "bg-[#E53E3E] border-[#E53E3E] text-white" : i < step ? "bg-white/20 border-white/20 text-white" : "border-white/20 text-white/30"}`}>
                    {i + 1}
                  </div>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-white/30" : "bg-white/10"}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">

            {/* Step 0 — You */}
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

            {/* Step 1 — Business */}
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
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Biggest Competitor (optional)</label>
                  <input placeholder="e.g. Main competitor name or website" value={form.biggestCompetitor} onChange={e => update("biggestCompetitor", e.target.value)} className={inputClass} />
                </div>
              </div>
            )}

            {/* Step 2 — Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-4">Your customers & market</h2>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Who is your ideal customer? *</label>
                  <input placeholder="e.g. Homeowners aged 35-60 in Pittsburgh who need plumbing" value={form.targetAudience} onChange={e => update("targetAudience", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Where do you serve customers? *</label>
                  <SelectGrid options={LOCATION_TYPES} field="locationType" cols={1} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">What makes you different?</label>
                  <input placeholder="e.g. Same-day service, 20 years experience, lowest price guarantee" value={form.uniqueSellingPoint} onChange={e => update("uniqueSellingPoint", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Biggest marketing challenge</label>
                  <SelectGrid options={CHALLENGES} field="biggestChallenge" cols={2} />
                </div>
              </div>
            )}

            {/* Step 3 — Marketing */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-4">Your marketing details</h2>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Monthly revenue range</label>
                  <SelectGrid options={REVENUE_RANGES} field="monthlyRevenue" cols={1} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Average transaction / ticket value</label>
                  <SelectGrid options={TICKET_VALUES} field="avgTicketValue" cols={2} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Do you have tracking set up?</label>
                  <SelectGrid options={TRACKING_OPTIONS} field="hasTracking" cols={1} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Primary call to action</label>
                  <SelectGrid options={CTA_OPTIONS} field="mainCta" cols={2} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Do you have customer reviews or testimonials?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "yes_many", label: "Yes — many" },
                      { value: "yes_few", label: "Yes — a few" },
                      { value: "no", label: "Not yet" },
                    ].map(o => (
                      <button key={o.value} onClick={() => update("hasReviews", o.value)}
                        className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${form.hasReviews === o.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"}`}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Are you currently running any ads?</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "yes_working", label: "Yes — and they're working" },
                      { value: "yes_not_working", label: "Yes — but not getting results" },
                      { value: "no_never", label: "No — never run ads before" },
                      { value: "no_paused", label: "No — paused previous campaigns" },
                    ].map(o => (
                      <button key={o.value} onClick={() => update("currentlyRunningAds", o.value)}
                        className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${form.currentlyRunningAds === o.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"}`}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 — Campaign */}
            {step === 4 && (
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
                  <label className="text-xs text-white/50 mb-1 block">Monthly Ad Budget (optional)</label>
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
