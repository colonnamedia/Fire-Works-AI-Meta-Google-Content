import React from "react";
import { Link } from "react-router-dom";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const included = [
  "5 ad idea generations per month",
  "AI campaign objective recommendations",
  "Ad copy, hooks & headlines",
  "Audience targeting direction",
  "Creative angle ideas",
  "Placement & budget guidance",
  "Save & review all past entries",
  "Mobile responsive dashboard",
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
            Meta Ad Strategist
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link to="/signup"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">Everything you need to build better Meta ad campaigns.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Starter Plan */}
          <div className="bg-card rounded-2xl border-2 border-primary shadow-lg p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-1">Starter Plan</h2>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-5xl font-bold text-foreground">$4.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Includes 5 ad idea entries per billing month</p>
            </div>

            <ul className="space-y-3 mb-8">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
              <li className="flex items-center gap-2.5 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground">Additional entries at <strong>$1.99 each</strong></span>
              </li>
            </ul>

            <Link to="/signup" className="block">
              <Button className="w-full" size="lg">Start for $4.99/month</Button>
            </Link>
          </div>

          {/* Overage Info */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">How credits work</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Every billing month, you get <strong className="text-foreground">5 included ad idea entries</strong>. These reset automatically on your billing date.</p>
                <p>Once you use your 5 included entries, each additional entry is charged at <strong className="text-foreground">$1.99</strong>.</p>
                <p>Your usage history and all generated strategies are saved to your account permanently.</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">What you get per entry</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Recommended campaign objective</li>
                <li>• Ad set & audience strategy</li>
                <li>• 3 hook ideas + 3 headlines</li>
                <li>• 2 primary text options</li>
                <li>• Creative angle ideas</li>
                <li>• Risk warnings & final recommendation</li>
              </ul>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">Questions?</h3>
              <p className="text-sm text-muted-foreground mb-3">We're happy to help with any questions about the plan.</p>
              <Link to="/support" className="text-sm text-primary hover:underline">Visit our support page →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}