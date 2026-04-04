import React from "react";
import { Link } from "react-router-dom";
import { Check, Zap, Facebook, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const singleFeatures = [
  "Choose Meta Ads OR Google Ads",
  "5 ad idea generations per month",
  "Full AI strategy per generation",
  "Save & review all past entries",
  "Additional entries at $1.99 each",
];

const bothFeatures = [
  "Meta Ads AND Google Ads in one generation",
  "5 ad idea generations per month",
  "Full AI strategy for both platforms",
  "Save & review all past entries",
  "Additional entries at $1.99 each",
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Ad Strategist AI
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { document.location.href = "/dashboard"; }}>Log In</Button>
            <Button size="sm" onClick={() => { document.location.href = "/dashboard"; }}>Get Started</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your ad strategy needs.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start mb-14">
          {/* Single Platform Plan */}
          <div className="bg-card rounded-2xl border-2 border-border shadow-sm p-8 relative">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-muted-foreground flex items-center text-xs font-bold">OR</div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">Single Platform Plan</h2>
              <p className="text-sm text-muted-foreground mb-3">Meta Ads OR Google Ads — pick one at signup</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-foreground">$14.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {singleFeatures.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" size="lg" variant="outline" onClick={() => { document.location.href = "/dashboard"; }}>
              Start for $14.99/month
            </Button>
          </div>

          {/* Both Platforms Plan */}
          <div className="bg-card rounded-2xl border-2 border-primary shadow-lg p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">Best Value</span>
            </div>
            <div className="mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">Both Platforms Plan</h2>
              <p className="text-sm text-muted-foreground mb-3">Meta Ads + Google Ads in every generation</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-foreground">$19.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {bothFeatures.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" size="lg" onClick={() => { document.location.href = "/dashboard"; }}>
              Start for $19.99/month
            </Button>
          </div>
        </div>

        {/* Info row */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-3">How credits work</h3>
            <p className="text-sm text-muted-foreground">Every billing month you get 5 included entries. They reset automatically. After 5, each additional entry is <strong className="text-foreground">$1.99</strong>.</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-3">What counts as one entry?</h3>
            <p className="text-sm text-muted-foreground">One generation = one entry, regardless of platform. Selecting "Both" still counts as a single entry, not two.</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-3">Questions?</h3>
            <p className="text-sm text-muted-foreground mb-3">We're happy to help with any questions about the plan.</p>
            <Link to="/support" className="text-sm text-primary hover:underline">Visit support →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}