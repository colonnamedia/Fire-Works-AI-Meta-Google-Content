import React, { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Zap, Lock, Check, ChevronRight, Star, Target, Users, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const PLAN_CARDS = [
  {
    name: "Single Platform",
    price: "$14.99",
    period: "/month",
    desc: "Meta Ads OR Google Ads",
    features: ["5 strategy credits/month", "Full AI ad strategy", "All headlines & copy", "Targeting recommendations", "$1.99 per extra entry"],
    highlighted: false,
  },
  {
    name: "Both Platforms",
    price: "$19.99",
    period: "/month",
    desc: "Meta Ads + Google Ads",
    features: ["5 strategy credits/month", "Meta + Google in one go", "Full AI ad strategy", "All headlines & copy", "$1.99 per extra entry"],
    highlighted: true,
    badge: "Best Value",
  },
];

function LockedCard({ title, icon: Icon, count, label }) {
  return (
    <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-white/30" />
        <span className="text-sm font-semibold text-white/30">{title}</span>
      </div>
      <div className="space-y-2">
        {Array(Math.min(count, 3)).fill(0).map((_, i) => (
          <div key={i} className="h-4 bg-white/10 rounded blur-[2px]" style={{ width: `${70 + Math.random() * 25}%` }} />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/90 via-[#0D1117]/60 to-transparent flex items-end justify-center pb-4">
        <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
          <Lock className="w-3.5 h-3.5 text-white/60" />
          <span className="text-xs text-white/60 font-medium">{label || `${count} more ${title.toLowerCase()}`}</span>
        </div>
      </div>
    </div>
  );
}

export default function FreeSample() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPlans, setShowPlans] = useState(false);

  const freeSample = location.state?.freeSample;
  const form = location.state?.form;

  const handleGetStarted = () => {
    base44.auth.redirectToLogin("/billing");
  };

  if (!freeSample) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center text-white/40">
          <p className="mb-4">No sample data found.</p>
          <Link to="/get-started" className="text-[#E53E3E] hover:underline">Start over</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 h-14 flex items-center justify-between px-4 sm:px-8 shrink-0">
        <Link to="/" className="flex items-center gap-2 font-bold text-sm">
          <div className="w-6 h-6 bg-[#E53E3E] rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          Fire-Works AI
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/pricing" className="text-sm text-white/40 hover:text-white transition-colors">Pricing</Link>
          <Button onClick={handleGetStarted} className="bg-[#E53E3E] hover:bg-[#C53030] text-white text-sm font-semibold h-8 px-4">
            Unlock Full Results
          </Button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-[#E53E3E]/20 to-[#E53E3E]/5 border border-[#E53E3E]/30 rounded-2xl p-6 mb-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="flex gap-0.5">
              {Array(5).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Your Ad Strategy Is Ready</h1>
          <p className="text-white/50 text-sm">
            {form?.businessName && <><span className="text-white font-semibold">{form.businessName}</span> · </>}
            {form?.platformInterest === "meta" ? "Meta Ads" : form?.platformInterest === "google" ? "Google Ads" : "Meta + Google Ads"} · {form?.goal || "Leads"} campaign
          </p>
        </div>

        {/* FREE VISIBLE SECTION */}
        <div className="space-y-4 mb-6">

          {/* Campaign Direction */}
          <div className="bg-[#161B22] border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Campaign Direction</span>
            </div>
            <p className="text-white text-sm leading-relaxed">{freeSample.campaignDirection}</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-[#E53E3E]/10 border border-[#E53E3E]/30 rounded-lg px-3 py-1.5">
              <Target className="w-3.5 h-3.5 text-[#E53E3E]" />
              <span className="text-xs text-[#E53E3E] font-semibold">Recommended: {freeSample.recommendedObjective}</span>
            </div>
          </div>

          {/* Sample Headline */}
          <div className="bg-[#161B22] border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Sample Headline</span>
            </div>
            <p className="text-white font-semibold text-base">"{freeSample.sampleHeadline}"</p>
          </div>

          {/* Sample Description */}
          <div className="bg-[#161B22] border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Sample Ad Copy</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{freeSample.sampleDescription}</p>
          </div>

          {/* Audience Suggestion */}
          <div className="bg-[#161B22] border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Audience Suggestion</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{freeSample.audienceSuggestion}</p>
          </div>
        </div>

        {/* LOCKED SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <div className="flex items-center gap-2 text-white/40 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" /> FULL STRATEGY LOCKED
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <LockedCard title="Headlines" icon={FileText} count={4} label="4 more headlines" />
            <LockedCard title="Hooks" icon={TrendingUp} count={5} label="5 scroll-stopping hooks" />
            <LockedCard title="Audience Angles" icon={Users} count={4} label="4 targeting angles" />
            <LockedCard title="Full Ad Copy" icon={FileText} count={3} label="3 full copy options" />
          </div>

          <div className="mt-3 grid sm:grid-cols-3 gap-3">
            {["Campaign Setup & Structure", "Competitor Insight", "Risk Warnings & What to Avoid"].map(item => (
              <div key={item} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center relative overflow-hidden">
                <p className="text-xs text-white/20 font-medium mb-2">{item}</p>
                <div className="h-3 bg-white/10 rounded mx-auto w-3/4 blur-[2px] mb-1" />
                <div className="h-3 bg-white/10 rounded mx-auto w-1/2 blur-[2px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white/20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAYWALL CTA */}
        <div className="bg-gradient-to-b from-[#161B22] to-[#0D1117] border border-[#E53E3E]/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2">Unlock Your Complete Ad Strategy</h2>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Get all headlines, hooks, full copy options, targeting ideas, campaign setup, competitor analysis, and more.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
            {["5 hooks", "5 headlines", "3 full copy options", "Targeting ideas", "Campaign setup", "Competitor insight"].map(item => (
              <div key={item} className="flex items-center gap-1.5 text-white/70">
                <Check className="w-3.5 h-3.5 text-[#E53E3E]" />
                {item}
              </div>
            ))}
          </div>

          <Button
            onClick={handleGetStarted}
            className="bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold px-8 py-3 text-base h-auto mb-3"
          >
            <Zap className="w-4 h-4 mr-2" /> See My Full Ad Strategy
          </Button>

          <p className="text-xs text-white/30">Create your account to unlock results • Cancel anytime</p>

          <button
            onClick={() => setShowPlans(!showPlans)}
            className="mt-4 text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 mx-auto"
          >
            View pricing plans <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showPlans ? "rotate-90" : ""}`} />
          </button>

          {showPlans && (
            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-left">
              {PLAN_CARDS.map(plan => (
                <div key={plan.name} className={`rounded-xl p-5 border ${plan.highlighted ? "border-[#E53E3E]/60 bg-[#E53E3E]/5" : "border-white/10 bg-white/5"}`}>
                  {plan.badge && <span className="text-xs bg-[#E53E3E] text-white font-bold px-2 py-0.5 rounded-full mb-2 inline-block">{plan.badge}</span>}
                  <h3 className="font-bold text-white mb-0.5">{plan.name}</h3>
                  <p className="text-xs text-white/40 mb-3">{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-black text-white">{plan.price}</span>
                    <span className="text-white/40 text-xs">{plan.period}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                        <Check className="w-3 h-3 text-[#E53E3E] shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}