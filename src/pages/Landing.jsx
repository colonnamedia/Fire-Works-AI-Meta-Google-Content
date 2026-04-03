import React from "react";
import { Link } from "react-router-dom";
import { Zap, Check, Target, FileText, Users, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  { icon: Target, title: "Smart Objective Selection", desc: "AI recommends the exact Meta campaign objective based on your goal, audience, and budget." },
  { icon: Zap, title: "Full Strategy Generation", desc: "Get campaign setup, ad set structure, placement recommendations, and audience targeting in one click." },
  { icon: FileText, title: "Ready-to-Use Ad Copy", desc: "Receive hooks, headlines, primary text options, and CTAs you can use directly in Ads Manager." },
];

const steps = [
  { n: "01", title: "Describe your business", desc: "Enter your business type, offer, goal, budget, and audience details." },
  { n: "02", title: "AI builds your strategy", desc: "Our AI analyzes your inputs and generates a complete Meta Ads strategy." },
  { n: "03", title: "Copy and launch", desc: "Use your strategy, hooks, and copy directly in Meta Ads Manager." },
];

const testimonials = [
  { name: "Sarah K.", biz: "Local Med Spa", text: "Saved me hours of research. The hooks it generates are actually good." },
  { name: "Marcus R.", biz: "E-commerce Brand", text: "Generated a full strategy in 30 seconds. Better than what my agency gave me." },
  { name: "Diane L.", biz: "Business Coach", text: "Finally understand which objectives to use. This app is worth every penny." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-foreground">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Meta Ad Strategist AI
          </div>
          <div className="flex items-center gap-2">
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground hidden sm:block mr-2">Pricing</Link>
            <Button variant="ghost" size="sm" onClick={() => { document.location.href="/dashboard"; }}>Log In</Button>
            <Button size="sm" onClick={() => { document.location.href="/dashboard"; }}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Zap className="w-3 h-3" />
            AI-Powered Meta Ads Strategy
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Generate better Facebook &<br className="hidden sm:block" />
            <span className="text-primary"> Instagram ad ideas</span> with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Stop guessing which campaign objective to use. Get a complete Meta Ads strategy — objectives, copy, hooks, and targeting — in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Start for $4.99/month <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">See Pricing</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">5 included ad ideas per month · $1.99 per additional entry · Cancel anytime</p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-secondary/30 border-y border-border py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Everything you need to run better Meta ads</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-card rounded-xl border border-border p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">One submission. A complete ad strategy.</h2>
            <p className="text-muted-foreground mb-6">Fill in your business details and get back a full, ready-to-use Meta Ads playbook — not generic tips.</p>
            <ul className="space-y-2">
              {["Recommended campaign objective & optimization", "Campaign setup and ad set structure", "Audience direction and placement strategy", "3 hook ideas to stop the scroll", "3 headline variations", "2 full primary text options", "CTA suggestions", "Creative angle ideas", "Risk warnings and final recommendation"].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-4">Sample Output Preview</div>
            <div className="space-y-3">
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-xs text-primary font-semibold mb-1">Recommended Objective</p>
                <p className="text-sm text-foreground">Lead Generation — Maximize Conversions</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground font-semibold mb-1">Hook Ideas</p>
                <p className="text-sm text-foreground italic">"Tired of running ads that get clicks but no leads?"</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground font-semibold mb-1">Audience Direction</p>
                <p className="text-sm text-foreground">Target homeowners 35-65 in your service area, layer interests in home improvement...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-secondary/30 border-y border-border py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Get your strategy in 3 steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(s => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-4">{s.n}</div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-10">What users are saying</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-card rounded-xl border border-border p-6">
              <div className="flex gap-0.5 mb-3">
                {Array(5).fill(0).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-foreground mb-4 italic">"{t.text}"</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.biz}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-16 text-center">
        <div className="bg-card rounded-2xl border-2 border-primary p-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Starter Plan</h2>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-4xl font-bold text-foreground">$4.99</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-muted-foreground text-sm mb-6">5 included ad idea entries · $1.99 per additional entry · Credits reset monthly</p>
          <Link to="/dashboard"><Button size="lg" className="w-full sm:w-auto">Get Started Today</Button></Link>
          <p className="text-xs text-muted-foreground mt-3">No long-term commitment. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">Meta Ad Strategist AI</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/support" className="hover:text-foreground">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}