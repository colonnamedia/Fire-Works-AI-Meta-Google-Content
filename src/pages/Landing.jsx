import React from "react";
import { Link } from "react-router-dom";
import { Zap, Check, Target, FileText, BarChart2, ArrowRight, Star, ChevronRight, Shield, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";


const handleGetStarted = () => {
  window.location.href = "/get-started";
};

const handleLogin = () => {
  window.location.href = "/dashboard";
};

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const features = [
  {
    icon: Target,
    title: "AI Picks the Right Objective",
    desc: "Stop guessing between Traffic, Leads, and Conversions. The AI analyzes your business and tells you exactly which Meta objective to use and why.",
  },
  {
    icon: FileText,
    title: "Ready-to-Use Ad Copy",
    desc: "Get scroll-stopping hooks, benefit-driven headlines, full primary text options, and CTAs — all tailored to your offer and tone.",
  },
  {
    icon: BarChart2,
    title: "Full Campaign Strategy",
    desc: "Audience direction, ad set structure, placement recommendations, creative angles — a complete playbook you can execute immediately.",
  },
];

const steps = [
  { n: "01", title: "Describe your business and offer", desc: "Enter your business type, industry, goal, budget, and audience in a simple guided form." },
  { n: "02", title: "AI builds your strategy", desc: "Our AI analyzes your inputs and recommends the best campaign objective, setup, and copy direction." },
  { n: "03", title: "Get hooks, headlines, and copy", desc: "Receive 3 hooks, 3 headlines, 2 primary text options, CTAs, and creative angle ideas — ready to paste into Ads Manager." },
  { n: "04", title: "Save and revisit anytime", desc: "Every strategy is saved to your dashboard so you can reference, export, or build on it later." },
];

const deliverables = [
  "Recommended campaign objective + optimization goal",
  "Why that objective fits your business and goal",
  "Campaign setup and ad set structure",
  "Audience direction and placement strategy",
  "3 scroll-stopping hook ideas",
  "3 headline variations",
  "2 full primary text options",
  "CTA suggestions matched to your destination",
  "Creative angle ideas",
  "Risk warnings and what to watch for",
  "Final recommendation and next steps",
];

const audiences = [
  { label: "Local Service Businesses", desc: "Plumbers, electricians, cleaners, landscapers — find out if leads or messages is the smarter play for your market." },
  { label: "Gyms & Fitness Studios", desc: "Promote trials, memberships, and classes with the right creative angles and audience targeting direction." },
  { label: "Coaches & Consultants", desc: "Lead generation strategy, webinar promotion, and copy that speaks directly to your ideal client's pain points." },
  { label: "Ecommerce Brands", desc: "Product launch strategy, retargeting structures, and copy frameworks that drive purchases." },
  { label: "Agencies & Freelancers", desc: "Use it as a client strategy tool. Generate ad ideas for any business type in seconds." },
  { label: "Restaurants & Retail", desc: "Awareness, reach, and engagement strategies with local targeting logic built in." },
];

const testimonials = [
  { name: "Sarah K.", biz: "Local Med Spa Owner", text: "I used to spend hours researching what objective to use and still felt unsure. This gave me a full strategy in under a minute. The hooks it generated were actually good." },
  { name: "Marcus R.", biz: "Ecommerce Brand Founder", text: "Better strategy output than what my agency gave me last month. The objective recommendation alone saved me from wasting money on Traffic again." },
  { name: "Diane L.", biz: "Business Coach", text: "Finally understand which objectives to use for lead gen vs awareness. The copy it writes is on-point for my audience. Absolutely worth paying for." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">

      {/* Nav */}
      <nav className="border-b border-white/10 bg-[#0D1117]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-base text-white hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-[#E53E3E] rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Fire-Works AI
          </Link>
          <div className="hidden sm:flex items-center gap-1 text-sm text-white/50 font-medium">
            Meta & Google AI Ad Creation
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/get-started" className="text-sm text-white/60 hover:text-white hidden sm:block px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">Pricing</Link>
            <button onClick={handleLogin} className="text-sm text-white/60 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">Log In</button>
            <button
              onClick={handleGetStarted}
              className="text-sm font-semibold bg-[#E53E3E] hover:bg-[#C53030] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Start Generating
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#E53E3E]/25 rounded-full blur-[130px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute top-10 right-20 w-[500px] h-[500px] bg-[#9B2C2C]/40 rounded-full blur-[90px]" />
          <div className="absolute bottom-0 left-1/2 w-[300px] h-[200px] bg-[#E53E3E]/10 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24 relative">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl space-y-6">
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              AI powered ads <span className="text-[#E53E3E]">for</span><br />
              Meta &amp; Google.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/50 max-w-xl leading-relaxed">
              Get AI-powered campaign objective recommendations, hooks, headlines, copy ideas, and full ad setup direction — tailored to your business, offer, and goals.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Generate My Ads <ArrowRight className="w-4 h-4" />
              </button>
              <Link to="/get-started">
                <button className="inline-flex items-center justify-center gap-2 text-white/60 hover:text-white font-semibold px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 transition-colors text-sm w-full sm:w-auto">
                  See Example Results
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Everything you need to run smarter Meta ads</h2>
          <p className="text-white/40">Built for business owners and marketers who want a clear, actionable strategy in minutes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#E53E3E]/30 hover:bg-white/8 transition-all duration-200">
              <div className="w-10 h-10 bg-[#E53E3E]/20 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-[#E53E3E]" />
              </div>
              <h3 className="font-bold text-white mb-2 text-base">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="bg-white/3 border-y border-white/10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[#E53E3E] text-xs font-bold uppercase tracking-widest mb-4">ONE SUBMISSION. A COMPLETE STRATEGY.</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                You don't get vague tips.<br />You get a <span className="text-[#E53E3E]">full ad playbook.</span>
              </h2>
              <p className="text-white/40 mb-6 leading-relaxed text-sm">
                Fill in your business details and receive a structured, expert-level Meta Ads strategy — the kind an experienced media buyer would put together, delivered in seconds.
              </p>
              <ul className="space-y-2.5">
                {deliverables.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-[#E53E3E] shrink-0 mt-0.5" />
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 space-y-3">
              <p className="text-xs text-[#E53E3E] uppercase tracking-widest font-bold mb-4">SAMPLE STRATEGY OUTPUT</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/40 mb-1">Recommended Objective: <span className="text-white">Lead Generation — Maximize Leads</span></p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-white/80 italic">"Still waiting on that plumber? We show up same day."</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1.5">Audience Direction</p>
                  <p className="text-sm text-white/70">Homeowners 30–65 within 15 miles. Broad targeting + strong creative beats stacked interests at this budget. Skip interest layers.</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1.5">Audience Direction</p>
                  <p className="text-sm text-white/70">Homeowners 30–65 with interest events points.</p>
                </div>
                <div className="bg-[#E53E3E]/10 border border-[#E53E3E]/30 rounded-xl p-4">
                  <p className="text-xs text-[#E53E3E] font-semibold mb-1">Warning</p>
                  <p className="text-sm text-white/70">Do not run Traffic if your site has no pixel or conversion event. You'll pay for clicks with no way to measure results.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">From blank page to full strategy</h2>
          <p className="text-white/40">No media buying expertise required.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-9 h-9 bg-[#E53E3E] text-white rounded-xl flex items-center justify-center font-black text-sm mb-4">{s.n}</div>
              <h3 className="font-bold text-white mb-2 text-sm">{s.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white/3 border-y border-white/10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white mb-10">What users are saying</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E53E3E]/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#E53E3E]">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.biz}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for + Pricing combined */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-white mb-2">Built for real businesses running real ads</h2>
          <p className="text-white/40 mb-1">No hidden fees. No complicated tiers. One plan that works for most businesses.</p>
          <Link to="/get-started" className="text-sm text-[#E53E3E] hover:underline flex items-center gap-1 w-fit">
            See plan pricing & features <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pricing + Trust signals row */}
        <div className="grid lg:grid-cols-3 gap-4 items-stretch">
          {/* Trust: Secure */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-[#E53E3E]/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#E53E3E]" />
            </div>
            <h3 className="font-bold text-white text-sm">Secure & First Genuine</h3>
            <p className="text-xs text-white/40 leading-relaxed">Your business data is never shared. Each user sees only their own strategies and cannot access others.</p>
          </div>

          {/* Pricing card — center/featured */}
          <div className="bg-[#161B22] border-2 border-[#E53E3E]/60 rounded-2xl p-7 flex flex-col shadow-2xl shadow-[#E53E3E]/10">
            <p className="text-xs font-bold text-[#E53E3E] uppercase tracking-widest mb-1">Starter Plan</p>
            <p className="text-xs text-white/40 mb-4">Everything you need to start running Meta ads</p>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-4xl font-black text-white">$4.99</span>
              <span className="text-white/40 text-sm">per generation</span>
            </div>
        <ul className="space-y-2 text-sm mb-6 flex-1">
  <li className="flex items-start gap-2 text-white/60 text-xs"><Check className="w-3.5 h-3.5 text-[#E53E3E] shrink-0 mt-0.5" />Google Ads — $4.99 per generation</li>
  <li className="flex items-start gap-2 text-white/60 text-xs"><Check className="w-3.5 h-3.5 text-[#E53E3E] shrink-0 mt-0.5" />Meta Ads + Organic Social — $4.99 per generation</li>
  <li className="flex items-start gap-2 text-white/60 text-xs"><Check className="w-3.5 h-3.5 text-[#E53E3E] shrink-0 mt-0.5" />Google + Meta + Social — $8.99 per generation</li>
  <li className="flex items-start gap-2 text-white/60 text-xs"><Check className="w-3.5 h-3.5 text-[#E53E3E] shrink-0 mt-0.5" />AI-generated headlines, copy, hooks, and keywords</li>
  <li className="flex items-start gap-2 text-white/60 text-xs"><Check className="w-3.5 h-3.5 text-[#E53E3E] shrink-0 mt-0.5" />Full results emailed instantly</li>
  <li className="flex items-start gap-2 text-white/60 text-xs"><Check className="w-3.5 h-3.5 text-[#E53E3E] shrink-0 mt-0.5" />Dashboard to view all past generations</li>
</ul>
            <button
              onClick={handleGetStarted}
              className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              Get My Ad Strategy <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-white/30 text-center mt-3">No commitment. Cancel account settings.</p>
          </div>

          {/* Trust: Built on Real Ad */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-[#E53E3E]/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#E53E3E]" />
            </div>
            <h3 className="font-bold text-white text-sm">Built on Real Ad Experience</h3>
            <p className="text-xs text-white/40 leading-relaxed">Business strategy which ad experience is trained on real advertising best practices for small business media and budgets.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#E53E3E] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Ready to run smarter Meta ads?</h2>
            <p className="text-white/70 text-sm max-w-lg">
              Stop guessing which campaign to run. Get full AI-full business strategy, your business hours of strategy work.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/get-started">
              <button className="bg-white text-[#E53E3E] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors text-sm whitespace-nowrap">
                See Pricing
              </button>
            </Link>
            <button
              onClick={handleGetStarted}
              className="border border-white/40 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm whitespace-nowrap"
            >
              Build My Ads
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0D1117]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-[#E53E3E] rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white">Fire-Works AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
            <Link to="/get-started" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          </div>
          <p className="text-xs text-white/30">© 2026 Fire-Works AI</p>
        </div>
      </footer>
    </div>
  );
}
