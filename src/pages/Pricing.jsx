import React from "react";
import { Link } from "react-router-dom";
import { Check, Zap, Facebook, Search, Layers } from "lucide-react";
import { base44 } from "@/api/base44Client";

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

const handleGetStarted = () => { window.location.href = "/get-started"; };
const handleLogin = () => base44.auth.redirectToLogin("/dashboard");

export default function Pricing() {
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
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={handleLogin} className="text-sm text-white/60 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">Log In</button>
            <button onClick={handleGetStarted} className="text-sm font-semibold bg-[#E53E3E] hover:bg-[#C53030] text-white px-4 py-2 rounded-lg transition-colors">Get Started</button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-white/40">Choose the plan that fits your ad strategy needs.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start mb-12">
          {/* Single Platform Plan */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative hover:border-white/20 transition-colors">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Facebook className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white/30 text-xs font-bold">OR</span>
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Single Platform Plan</h2>
              <p className="text-sm text-white/40 mb-4">Meta Ads OR Google Ads — pick one at signup</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">$14.99</span>
                <span className="text-white/40">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {singleFeatures.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-[#E53E3E] shrink-0" />
                  <span className="text-white/70">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleGetStarted} className="w-full border border-white/20 text-white font-semibold py-3 rounded-xl hover:border-white/40 hover:bg-white/5 transition-colors text-sm">
              Build My Ads
            </button>
          </div>

          {/* Both Platforms Plan */}
          <div className="bg-white/5 border-2 border-[#E53E3E]/60 rounded-2xl p-8 relative shadow-2xl shadow-[#E53E3E]/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-[#E53E3E] text-white text-xs font-bold px-3 py-1 rounded-full">Best Value</span>
            </div>
            <div className="mb-6">
              <div className="w-10 h-10 bg-[#E53E3E]/20 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-[#E53E3E]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Both Platforms Plan</h2>
              <p className="text-sm text-white/40 mb-4">Meta Ads + Google Ads in every generation</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">$19.99</span>
                <span className="text-white/40">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {bothFeatures.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-[#E53E3E] shrink-0" />
                  <span className="text-white/70">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleGetStarted} className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold py-3 rounded-xl transition-colors text-sm">
              Get My Ad Strategy
            </button>
          </div>
        </div>

        {/* Info row */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">How credits work</h3>
            <p className="text-sm text-white/40">Every billing month you get 5 included entries. They reset automatically. After 5, each additional entry is <strong className="text-white">$1.99</strong>.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">What counts as one entry?</h3>
            <p className="text-sm text-white/40">One generation = one entry, regardless of platform. Selecting "Both" still counts as a single entry, not two.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">Questions?</h3>
            <p className="text-sm text-white/40 mb-3">We're happy to help with any questions about the plan.</p>
            <Link to="/support" className="text-sm text-[#E53E3E] hover:underline">Visit support →</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-[#E53E3E] rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white">Fire-Works AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
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