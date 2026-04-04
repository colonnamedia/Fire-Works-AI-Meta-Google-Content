import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Mail, Book, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

const faqs = [
  { q: "How do credits work?", a: "Each month you get 5 included ad idea entries with the Starter Plan. Once you use all 5, each additional entry is $1.99. Credits reset at the start of each new billing period." },
  { q: "Do unused credits roll over?", a: "No. Included credits reset each billing cycle. Only your generated entries and billing history are kept permanently." },
  { q: "What does an 'ad idea entry' include?", a: "Each entry includes: a recommended campaign objective, optimization goal, campaign setup guide, ad set strategy, placements recommendation, audience direction, 3 hook ideas, 3 headlines, 2 primary text options, CTA suggestions, creative angle ideas, risk warnings, and a final recommendation." },
  { q: "Can I use this for any business type?", a: "Yes! The app is designed for local businesses, service businesses, ecommerce stores, coaches, consultants, SaaS companies, and more." },
  { q: "How do I cancel my subscription?", a: "Contact support and we'll cancel your subscription immediately. You'll retain access through the end of your current billing period." },
  { q: "Is my business data secure?", a: "Yes. Your data is encrypted and only accessible by you and platform admins. We do not share your business information with third parties beyond AI processing." },
  { q: "What if the AI output doesn't match my business?", a: "Try adding more detail in the Notes and Audience Description fields. The more context you provide, the more tailored the strategy will be." },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-4">
      <button className="flex items-center justify-between w-full text-left" onClick={() => setOpen(!open)}>
        <span className="font-medium text-white text-sm">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
      </button>
      {open && <p className="text-sm text-white/40 mt-3 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function Support() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <nav className="border-b border-white/10 bg-[#0D1117]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-base text-white hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-[#E53E3E] rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Fire-Works AI
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => base44.auth.redirectToLogin("/dashboard")} className="text-sm text-white/60 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">Log In</button>
            <button onClick={() => base44.auth.redirectToLogin("/billing")} className="text-sm font-semibold bg-[#E53E3E] hover:bg-[#C53030] text-white px-4 py-2 rounded-lg transition-colors">Get Started</button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-white mb-3">How can we help?</h1>
          <p className="text-white/40">Find answers to common questions or reach out to our team.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:border-white/20 transition-colors">
            <div className="w-10 h-10 bg-[#E53E3E]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Mail className="w-5 h-5 text-[#E53E3E]" />
            </div>
            <h3 className="font-semibold text-white mb-1">Email Support</h3>
            <p className="text-sm text-white/40 mb-3">We typically respond within 24 hours.</p>
            <a href="mailto:support@fireworks.ai" className="text-sm text-[#E53E3E] hover:underline">support@fireworks.ai</a>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:border-white/20 transition-colors">
            <div className="w-10 h-10 bg-[#E53E3E]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Book className="w-5 h-5 text-[#E53E3E]" />
            </div>
            <h3 className="font-semibold text-white mb-1">Documentation</h3>
            <p className="text-sm text-white/40 mb-3">Browse FAQs and guides below.</p>
            <span className="text-sm text-white/30">Scroll down ↓</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div>
            {faqs.map(f => <FAQ key={f.q} {...f} />)}
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-[#E53E3E] rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white">Fire-Works AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-xs text-white/30">© 2026 Fire-Works AI</p>
        </div>
      </footer>
    </div>
  );
}