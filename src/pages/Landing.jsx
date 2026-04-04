import React from "react";
import { Link } from "react-router-dom";
import { Zap, Check, Target, FileText, BarChart2, ArrowRight, Star, ChevronRight, Shield, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

const handleGetStarted = () => {
  base44.auth.redirectToLogin("/billing");
};

const handleLogin = () => {
  base44.auth.redirectToLogin("/dashboard");
};

// Note: admins are redirected from /billing → /dashboard automatically in BillingPage

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
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <nav className="border-b border-border bg-card/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-base text-foreground hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Fire-Works AI
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground hidden sm:block px-3 py-1.5 rounded-md hover:bg-secondary transition-colors">Pricing</Link>
            <Button variant="ghost" size="sm" onClick={handleLogin}>Log In</Button>
            <Button size="sm" className="hidden sm:inline-flex" onClick={handleGetStarted}>
              Get Started <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-20 text-center relative">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-primary/20">
                <Zap className="w-3 h-3" />
                Meta & Google AI Ad Creation
              </div>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
              AI-powered ads for<br className="hidden sm:block" />
              <span className="text-primary"> Meta &amp; Google.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get AI-powered campaign objective recommendations, hooks, headlines, copy ideas, and full ad setup direction — tailored to your business, offer, and goals.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 h-12 shadow-lg shadow-primary/20" onClick={handleGetStarted}>
                Start Generating Ad Ideas <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 h-12">
                  See Pricing
                </Button>
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="text-xs text-muted-foreground">
              From $4.99/month · Meta or Google Ads · Both Platforms $8.99/month · 5 entries included · Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="border-y border-border bg-secondary/20 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-6 sm:gap-10 text-sm text-muted-foreground">
          {["Local Service Businesses", "Coaches & Consultants", "Ecommerce Brands", "Marketing Agencies", "Gyms & Studios"].map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Everything you need to run smarter Meta ads</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Built for business owners and marketers who are tired of guessing and want a clear, actionable strategy in minutes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-base">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="bg-secondary/20 border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-3">One submission. A complete strategy.</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 leading-tight">You don't get vague tips.<br />You get a full ad playbook.</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Fill in your business details and receive a structured, expert-level Meta Ads strategy — the kind an experienced media buyer would put together, delivered in seconds.
              </p>
              <ul className="space-y-2.5">
                {deliverables.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Sample Strategy Output</p>
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                <p className="text-xs text-primary font-semibold mb-1">✓ Recommended Objective</p>
                <p className="text-sm text-foreground font-medium">Lead Generation — Maximize Leads</p>
                <p className="text-xs text-muted-foreground mt-1">Traffic would get clicks but not inquiries. Lead Gen with an instant form is the right call for a local service business at this budget.</p>
              </div>
              <div className="bg-secondary/60 rounded-xl p-4">
                <p className="text-xs text-muted-foreground font-semibold mb-2">Hook Ideas</p>
                <p className="text-sm text-foreground italic mb-1">"Still waiting on that plumber? We show up same day."</p>
                <p className="text-sm text-muted-foreground italic">"Your neighbors are getting it fixed. Are you?"</p>
              </div>
              <div className="bg-secondary/60 rounded-xl p-4">
                <p className="text-xs text-muted-foreground font-semibold mb-2">Audience Direction</p>
                <p className="text-sm text-foreground">Homeowners 30–65 within 15 miles. Broad targeting + strong creative beats stacked interests at this budget. Skip interest layers.</p>
              </div>
              <div className="bg-secondary/60 rounded-xl p-4">
                <p className="text-xs text-muted-foreground font-semibold mb-2">Risk Warning</p>
                <p className="text-sm text-foreground">⚠️ Do not run Traffic if your site has no pixel or conversion event. You'll pay for clicks with no way to measure results.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">From blank page to full strategy in minutes</h2>
          <p className="text-muted-foreground">No media buying expertise required.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(100%-1rem)] w-8 border-t-2 border-dashed border-border z-0" />
              )}
              <div className="bg-card rounded-2xl border border-border p-5 relative z-10">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-sm mb-4">{s.n}</div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-secondary/20 border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Built for real businesses running real ads</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Whether you're a business owner managing your own ads or an agency handling client campaigns, this tool saves hours of strategy work.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {audiences.map(a => (
              <div key={a.label} className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors">
                <h3 className="font-semibold text-foreground mb-1.5 text-sm">{a.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">What users are saying</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-card rounded-2xl border border-border p-6">
              <div className="flex gap-0.5 mb-4">
                {Array(5).fill(0).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.biz}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-secondary/20 border-y border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <p className="font-semibold text-foreground text-sm">Secure & Private</p>
              <p className="text-xs text-muted-foreground">Your business data is never shared. Each user sees only their own strategies.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              <p className="font-semibold text-foreground text-sm">Strategy in Under 60 Seconds</p>
              <p className="text-xs text-muted-foreground">Fill in the form, submit, and get a complete ad playbook in under a minute.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <p className="font-semibold text-foreground text-sm">Built on Real Ad Experience</p>
              <p className="text-xs text-muted-foreground">Strategy logic trained on real Meta advertising best practices for small business budgets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Simple, honest pricing</h2>
        <p className="text-muted-foreground mb-10">No hidden fees. No complicated tiers. One plan that works for most businesses.</p>
        <div className="bg-card rounded-2xl border-2 border-primary shadow-xl shadow-primary/10 p-8 sm:p-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Starter Plan
          </div>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-bold text-foreground">$4.99</span>
            <span className="text-muted-foreground text-lg">/month</span>
          </div>
          <p className="text-muted-foreground mb-6">Everything you need to start running smarter Meta ads.</p>
          <ul className="space-y-2.5 text-sm text-left max-w-sm mx-auto mb-8">
            {[
              "5 included ad strategy entries per month",
              "Full AI strategy for every entry",
              "Hooks, headlines, copy, and CTAs included",
              "Campaign objective + optimization recommendation",
              "Save and manage all your strategies",
              "$1.99 per additional entry after your 5 monthly credits",
              "Credits reset every billing month",
              "Cancel anytime",
            ].map(f => (
              <li key={f} className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground">{f}</span>
              </li>
            ))}
          </ul>
          <Button size="lg" className="w-full sm:w-auto px-10 h-12 text-base shadow-lg shadow-primary/20" onClick={handleGetStarted}>
            Start Generating Ad Ideas <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <p className="text-xs text-muted-foreground mt-4">No commitment. Cancel anytime from your account settings.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to run smarter Meta ads?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Stop guessing which campaign to run. Get a full AI-generated strategy tailored to your business in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8 h-12 font-semibold" onClick={handleGetStarted}>
              Create My First Ad Strategy <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 h-12 border-white/30 text-white hover:bg-white/10 hover:text-white">
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-foreground">Fire-Works AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Fire-Works AI</p>
        </div>
      </footer>
    </div>
  );
}