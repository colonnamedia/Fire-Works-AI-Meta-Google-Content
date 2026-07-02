import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Zap, ChevronRight, ChevronLeft, Loader2, Search, Facebook, Layers, Image, LayoutGrid, Key } from "lucide-react";

const STEPS = ["Contact", "Platform", "Business", "Campaign", "Review"];

const CONTENT_TYPES = [
  { value: "google_ads", label: "Google Ads", sub: "Search campaign setup + copy", price: 999, display: "$9.99" },
  { value: "meta_ads", label: "Meta Ads", sub: "Facebook & Instagram campaign", price: 999, display: "$9.99" },
  { value: "organic_social", label: "Organic Social", sub: "Captions, hashtags, reel ideas", price: 499, display: "$4.99" },
  { value: "google_meta", label: "Google + Meta", sub: "Both ad campaigns — best value", price: 1699, display: "$16.99", featured: true },
  { value: "everything", label: "Everything", sub: "Google + Meta + Social + Keywords", price: 1999, display: "$19.99" },
];

const LOCATION_TYPES = [
  { value: "local", label: "Local — specific city/area" },
  { value: "regional", label: "Regional — multiple cities/states" },
  { value: "national", label: "National — anywhere in the country" },
  { value: "online", label: "Online only" },
];

const CAMPAIGN_TYPES = [
  { value: "search", label: "Search Ads — show when people search Google" },
  { value: "local", label: "Local Services Ads — pay per lead" },
  { value: "performance_max", label: "Performance Max — AI-driven across all Google" },
  { value: "not_sure", label: "Not sure — recommend one for me" },
];

const CTA_OPTIONS = [
  { value: "call", label: "Call Us" },
  { value: "form", label: "Fill Out a Form" },
  { value: "purchase", label: "Buy Now" },
  { value: "book", label: "Book Appointment" },
  { value: "message", label: "Send a Message" },
  { value: "visit", label: "Visit Our Location" },
];

const META_OBJECTIVES = [
  { value: "leads", label: "Generate Leads — collect contact info" },
  { value: "sales", label: "Drive Sales — purchases or bookings" },
  { value: "traffic", label: "Website Traffic — send people to my site" },
  { value: "awareness", label: "Brand Awareness — get seen by more people" },
  { value: "messages", label: "Get Messages — DMs on Facebook/Instagram" },
];

const CREATIVE_PREFS = [
  { value: "image", label: "Single Image" },
  { value: "video", label: "Video" },
  { value: "carousel", label: "Carousel (multiple images)" },
  { value: "not_sure", label: "Not sure — recommend one" },
];

const SOCIAL_PLATFORMS = [
  { value: "both", label: "Facebook + Instagram" },
  { value: "facebook", label: "Facebook only" },
  { value: "instagram", label: "Instagram only" },
];

const CONTENT_STYLES = [
  { value: "educational", label: "Educational — tips and how-tos" },
  { value: "promotional", label: "Promotional — offers and deals" },
  { value: "behind_scenes", label: "Behind the scenes" },
  { value: "mixed", label: "Mixed — variety of content" },
];

const TICKET_VALUES = [
  { value: "under_50", label: "Under $50" },
  { value: "50_200", label: "$50 – $200" },
  { value: "200_1000", label: "$200 – $1,000" },
  { value: "1000_5000", label: "$1,000 – $5,000" },
  { value: "5000_plus", label: "$5,000+" },
];

const INITIAL = {
  fullName: "", email: "", businessName: "", websiteUrl: "",
  contentType: "",
  industry: "", offerType: "", targetAudience: "", uniqueSellingPoint: "", locationType: "local",
  monthlyRevenue: "", avgTicketValue: "", mainCta: "", biggestCompetitor: "",
  campaignType: "", hasLandingPage: "", hasTracking: "", googleBudget: "",
  metaObjective: "", hasPixel: "", audienceTemperature: "", creativePreference: "", metaBudget: "",
  socialPlatforms: "", postingFrequency: "", contentStyle: "",
  addOnKeywords: false,
  addOnSocial: false,
};

export default function GetStarted() {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abandonSent = useRef(false);

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
              websiteUrl: profile.website_url || "",
              industry: profile.industry || "",
              offerType: profile.offer_type || "",
              targetAudience: profile.target_audience || "",
              uniqueSellingPoint: profile.unique_selling_point || "",
              locationType: profile.location_type || "local",
              monthlyRevenue: profile.monthly_revenue || "",
              avgTicketValue: profile.avg_ticket_value || "",
              mainCta: profile.main_cta || "",
              biggestCompetitor: profile.biggest_competitor || "",
            }));
          }
        })
        .catch(() => {});
    }
  }, [isSignedIn, user]);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const sendAbandon = async () => {
    if (abandonSent.current || !form.email || !form.businessName) return;
    abandonSent.current = true;
    try {
      await fetch('/api/abandon-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          full_name: form.fullName,
          business_name: form.businessName,
          website_url: form.websiteUrl,
        }),
      });
    } catch {}
  };

  useEffect(() => {
    if (step > 0 && form.email && form.businessName) {
      window.addEventListener('beforeunload', sendAbandon);
      return () => window.removeEventListener('beforeunload', sendAbandon);
    }
  }, [step, form.email, form.businessName]);

  const canAdvance = () => {
    if (step === 0) return form.fullName.trim() && form.email.trim() && form.businessName.trim();
    if (step === 1) return !!form.contentType;
    if (step === 2) return form.industry.trim() && form.targetAudience.trim();
    return true;
  };

  const isGoogle = form.contentType === 'google_ads' || form.contentType === 'google_meta' || form.contentType === 'everything';
  const isMeta = form.contentType === 'meta_ads' || form.contentType === 'google_meta' || form.contentType === 'everything';
  const isSocial = form.contentType === 'organic_social' || form.contentType === 'everything';
  const showKeywordsAddon = isGoogle && form.contentType !== 'everything';
  const showSocialAddon = (isGoogle || isMeta) && !isSocial && form.contentType !== 'everything';

  const getBasePrice = () => {
    const ct = CONTENT_TYPES.find(c => c.value === form.contentType);
    return ct ? ct.price : 0;
  };

  const getTotalPrice = () => {
    let total = getBasePrice();
    if (form.addOnKeywords) total += 499;
    if (form.addOnSocial) total += 499;
    return total;
  };

  const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

  const handleBack = () => {
    if (step === 0) {
      navigate('/');
    } else {
      setStep(s => s - 1);
    }
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
          website_url: form.websiteUrl,
          industry: form.industry,
          offer_type: form.offerType,
          target_audience: form.targetAudience,
          unique_selling_point: form.uniqueSellingPoint,
          location_type: form.locationType,
          monthly_revenue: form.monthlyRevenue,
          avg_ticket_value: form.avgTicketValue,
          main_cta: form.mainCta,
          biggest_competitor: form.biggestCompetitor,
          content_type: form.contentType,
          campaign_type: form.campaignType,
          has_landing_page: form.hasLandingPage,
          has_tracking: form.hasTracking,
          google_budget: form.googleBudget,
          meta_objective: form.metaObjective,
          has_pixel: form.hasPixel,
          audience_temperature: form.audienceTemperature,
          creative_preference: form.creativePreference,
          meta_budget: form.metaBudget,
          social_platforms: form.socialPlatforms,
          posting_frequency: form.postingFrequency,
          content_style: form.contentStyle,
          add_on_keywords: form.addOnKeywords,
          add_on_social: form.addOnSocial,
          goal: form.metaObjective || 'leads',
          budget: form.googleBudget || form.metaBudget,
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
          add_on_keywords: form.addOnKeywords,
          add_on_social: form.addOnSocial,
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentData.error || 'Payment failed');

      window.location.href = paymentData.url;
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53E3E]/50";

  const OptionGrid = ({ options, field, cols = 1 }) => (
    <div className={`grid grid-cols-${cols} gap-2`}>
      {options.map(o => (
        <button key={o.value} onClick={() => update(field, o.value)}
          className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${form[field] === o.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>
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
          <Link to="/dashboard" className="text-sm text-white/40 hover:text-white transition-colors">My Dashboard</Link>
        )}
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Build Your Ad Campaign</h1>
            <p className="text-white/40 text-sm">Answer a few questions and get a complete AI-generated campaign.</p>
          </div>

          {/* Stepper */}
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

            {/* Step 0 — Contact */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-4">Let's get started</h2>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Full Name</label>
                  <input placeholder="Jane Smith" value={form.fullName} onChange={e => update("fullName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Email Address *</label>
                  <input placeholder="jane@company.com" type="email" value={form.email} onChange={e => update("email", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Business Name *</label>
                  <input placeholder="e.g. City Plumbing Co." value={form.businessName} onChange={e => update("businessName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Website URL</label>
                  <input placeholder="https://yourwebsite.com" value={form.websiteUrl} onChange={e => update("websiteUrl", e.target.value)} className={inputClass} />
                </div>
              </div>
            )}

            {step === 1 && (
  <div className="space-y-4">
    <h2 className="font-semibold text-white mb-2">What do you need?</h2>
    <p className="text-xs text-white/30 mb-4">Select your platform — add-ons can be added below</p>

    {/* Main 3 */}
    <div className="grid grid-cols-3 gap-2">
      {[
        { value: "google_ads", label: "Google Ads", price: "$9.99", icon: Search, color: "text-green-400", items: ["15 headlines", "4 descriptions", "Sitelinks", "Keywords", "Negative keywords"] },
        { value: "google_meta", label: "Google + Meta", price: "$16.99", icon: Layers, color: "text-[#E53E3E]", featured: true, items: ["Everything in Google", "Everything in Meta", "Best value — save $3"] },
        { value: "meta_ads", label: "Meta Ads", price: "$9.99", icon: Facebook, color: "text-blue-400", items: ["Campaign objective", "Audience targeting", "3 primary texts", "Hooks & headlines", "Creative direction"] },
      ].map(ct => (
        <button key={ct.value} onClick={() => update("contentType", ct.value)}
          className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border text-center transition-all relative ${form.contentType === ct.value ? "border-[#E53E3E] bg-[#E53E3E]/10" : ct.featured ? "border-yellow-500/40 bg-white/5 hover:border-yellow-500/60" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
          {ct.featured && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs bg-yellow-500 text-black font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Best Value</span>}
          <ct.icon className={`w-5 h-5 ${form.contentType === ct.value ? "text-[#E53E3E]" : ct.color}`} />
          <p className={`text-xs font-bold ${form.contentType === ct.value ? "text-white" : "text-white/70"}`}>{ct.label}</p>
          <p className={`text-sm font-black ${form.contentType === ct.value ? "text-[#E53E3E]" : "text-white/60"}`}>{ct.price}</p>
          <ul className="space-y-1 mt-1">
            {ct.items.map(item => (
              <li key={item} className="text-xs text-white/30 text-left">· {item}</li>
            ))}
          </ul>
        </button>
      ))}
    </div>

    {/* Add-ons */}
    <div>
      <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-2 mt-4">Add-ons — +$4.99 each</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => update("addOnKeywords", !form.addOnKeywords)}
          className={`flex flex-col gap-2 px-4 py-3 rounded-xl border text-left transition-all ${form.addOnKeywords ? "border-[#E53E3E] bg-[#E53E3E]/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Key className={`w-4 h-4 ${form.addOnKeywords ? "text-[#E53E3E]" : "text-white/40"}`} />
              <p className={`text-xs font-bold ${form.addOnKeywords ? "text-white" : "text-white/60"}`}>Keywords</p>
            </div>
            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${form.addOnKeywords ? "bg-[#E53E3E] border-[#E53E3E]" : "border-white/30"}`}>
              {form.addOnKeywords && <span className="text-white text-xs font-bold">✓</span>}
            </div>
          </div>
          <ul className="space-y-0.5">
            {["Primary keywords", "Long-tail keywords", "Negative keywords", "Competitor terms", "SEO opportunities"].map(i => (
              <li key={i} className="text-xs text-white/30">· {i}</li>
            ))}
          </ul>
          <p className="text-xs font-bold text-[#E53E3E]">+$4.99</p>
        </button>

        <button onClick={() => update("addOnSocial", !form.addOnSocial)}
          className={`flex flex-col gap-2 px-4 py-3 rounded-xl border text-left transition-all ${form.addOnSocial ? "border-[#E53E3E] bg-[#E53E3E]/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Image className={`w-4 h-4 ${form.addOnSocial ? "text-[#E53E3E]" : "text-white/40"}`} />
              <p className={`text-xs font-bold ${form.addOnSocial ? "text-white" : "text-white/60"}`}>Organic Social</p>
            </div>
            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${form.addOnSocial ? "bg-[#E53E3E] border-[#E53E3E]" : "border-white/30"}`}>
              {form.addOnSocial && <span className="text-white text-xs font-bold">✓</span>}
            </div>
          </div>
          <ul className="space-y-0.5">
            {["5 post captions", "Hashtag sets", "Story ideas", "Reel concepts", "Best time to post"].map(i => (
              <li key={i} className="text-xs text-white/30">· {i}</li>
            ))}
          </ul>
          <p className="text-xs font-bold text-[#E53E3E]">+$4.99</p>
        </button>
      </div>
    </div>

    {/* Everything */}
    <button onClick={() => { update("contentType", "everything"); update("addOnKeywords", false); update("addOnSocial", false); }}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all ${form.contentType === "everything" ? "border-[#E53E3E] bg-[#E53E3E]/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
      <LayoutGrid className={`w-5 h-5 flex-shrink-0 ${form.contentType === "everything" ? "text-[#E53E3E]" : "text-white/40"}`} />
      <div className="flex-1">
        <p className={`text-sm font-bold ${form.contentType === "everything" ? "text-white" : "text-white/70"}`}>Everything</p>
        <p className="text-xs text-white/30">Google Ads + Meta Ads + Organic Social + Keyword Research — all included</p>
      </div>
      <span className={`text-sm font-black flex-shrink-0 ${form.contentType === "everything" ? "text-[#E53E3E]" : "text-white/40"}`}>$19.99</span>
    </button>

    {/* Account storage message */}
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3">
      <Zap className="w-4 h-4 text-[#E53E3E] flex-shrink-0 mt-0.5" />
      <p className="text-xs text-white/50">Create a free account after checkout to save your content, re-download anytime, and skip re-entering your business info on future orders.</p>
    </div>
  </div>
)}

            {/* Step 2 — Business Info */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-4">About your business</h2>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Industry *</label>
                  <input placeholder="e.g. Home Services, Fitness, Ecommerce" value={form.industry} onChange={e => update("industry", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Main Offer / Product</label>
                  <input placeholder="e.g. Emergency plumbing repairs, Personal training" value={form.offerType} onChange={e => update("offerType", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Who is your ideal customer? *</label>
                  <input placeholder="e.g. Homeowners aged 35-60 in Pittsburgh" value={form.targetAudience} onChange={e => update("targetAudience", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">What makes you different?</label>
                  <input placeholder="e.g. Same-day service, 20 years experience" value={form.uniqueSellingPoint} onChange={e => update("uniqueSellingPoint", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Biggest competitor (optional)</label>
                  <input placeholder="e.g. competitor name or website" value={form.biggestCompetitor} onChange={e => update("biggestCompetitor", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Where do you serve customers?</label>
                  <OptionGrid options={LOCATION_TYPES} field="locationType" />
                </div>
              </div>
            )}

            {/* Step 3 — Platform Questions */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-semibold text-white mb-2">Campaign details</h2>

                {isGoogle && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Google Ads</p>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Campaign type</label>
                      <OptionGrid options={CAMPAIGN_TYPES} field="campaignType" />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Primary call to action</label>
                      <div className="grid grid-cols-2 gap-2">
                        {CTA_OPTIONS.map(o => (
                          <button key={o.value} onClick={() => update("mainCta", o.value)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${form.mainCta === o.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Do you have a landing page or website?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "in_progress", label: "In progress" }].map(o => (
                          <button key={o.value} onClick={() => update("hasLandingPage", o.value)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${form.hasLandingPage === o.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Do you have Google Analytics or conversion tracking?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "not_sure", label: "Not sure" }].map(o => (
                          <button key={o.value} onClick={() => update("hasTracking", o.value)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${form.hasTracking === o.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Monthly Google Ads budget</label>
                      <input placeholder="e.g. $500/month" value={form.googleBudget} onChange={e => update("googleBudget", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Average ticket / sale value</label>
                      <div className="grid grid-cols-2 gap-2">
                        {TICKET_VALUES.map(o => (
                          <button key={o.value} onClick={() => update("avgTicketValue", o.value)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${form.avgTicketValue === o.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {isMeta && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Meta Ads</p>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Campaign objective</label>
                      <OptionGrid options={META_OBJECTIVES} field="metaObjective" />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Do you have a Meta Pixel installed?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "not_sure", label: "Not sure" }].map(o => (
                          <button key={o.value} onClick={() => update("hasPixel", o.value)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${form.hasPixel === o.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Who are you targeting?</label>
                      <OptionGrid options={[
                        { value: "cold", label: "Cold audience — people who don't know me yet" },
                        { value: "warm", label: "Warm audience — people who've seen my content" },
                        { value: "retargeting", label: "Retargeting — people who visited my website" },
                        { value: "mixed", label: "Mixed — both cold and warm" },
                      ]} field="audienceTemperature" />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Creative preference</label>
                      <div className="grid grid-cols-2 gap-2">
                        {CREATIVE_PREFS.map(o => (
                          <button key={o.value} onClick={() => update("creativePreference", o.value)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${form.creativePreference === o.value ? "border-[#E53E3E] bg-[#E53E3E]/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Monthly Meta Ads budget</label>
                      <input placeholder="e.g. $300/month" value={form.metaBudget} onChange={e => update("metaBudget", e.target.value)} className={inputClass} />
                    </div>
                  </div>
                )}

                {isSocial && !isGoogle && !isMeta && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-widest">Organic Social</p>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Which platforms?</label>
                      <OptionGrid options={SOCIAL_PLATFORMS} field="socialPlatforms" />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">How often do you want to post?</label>
                      <input placeholder="e.g. 3x per week, daily" value={form.postingFrequency} onChange={e => update("postingFrequency", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Content style</label>
                      <OptionGrid options={CONTENT_STYLES} field="contentStyle" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4 — Add-ons + Review */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="font-semibold text-white mb-2">Review & add-ons</h2>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-3">Order Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">{CONTENT_TYPES.find(c => c.value === form.contentType)?.label}</span>
                    <span className="text-white">{CONTENT_TYPES.find(c => c.value === form.contentType)?.display}</span>
                  </div>
                  {form.addOnKeywords && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Keyword Research Add-on</span>
                      <span className="text-white">$4.99</span>
                    </div>
                  )}
                  {form.addOnSocial && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Social Content Add-on</span>
                      <span className="text-white">$4.99</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold border-t border-white/10 pt-2 mt-2">
                    <span className="text-white">Total</span>
                    <span className="text-[#E53E3E]">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Business</span><span className="text-white">{form.businessName}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Email</span><span className="text-white">{form.email}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Platform</span><span className="text-white">{CONTENT_TYPES.find(c => c.value === form.contentType)?.label}</span></div>
                  {form.websiteUrl && <div className="flex justify-between"><span className="text-white/40">Website</span><span className="text-white/70 text-xs">{form.websiteUrl}</span></div>}
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-[#E53E3E] text-sm mb-4 text-center">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-white/40 hover:text-white text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 0 ? "Home" : "Back"}
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => { if (step === 0) sendAbandon(); setStep(s => s + 1); }}
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
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Zap className="w-4 h-4" />Pay {formatPrice(getTotalPrice())}</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
