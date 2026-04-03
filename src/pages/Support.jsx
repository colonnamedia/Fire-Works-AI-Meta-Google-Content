import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, MessageCircle, Mail, Book, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="border-b border-border py-4">
      <button className="flex items-center justify-between w-full text-left" onClick={() => setOpen(!open)}>
        <span className="font-medium text-foreground text-sm">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function Support() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
            Meta Ad Strategist AI
          </Link>
          <div className="flex gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-3">How can we help?</h1>
          <p className="text-muted-foreground">Find answers to common questions or reach out to our team.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-3">We typically respond within 24 hours.</p>
            <a href="mailto:support@metaadstrategist.com" className="text-sm text-primary hover:underline">support@metaadstrategist.com</a>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <Book className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Documentation</h3>
            <p className="text-sm text-muted-foreground mb-3">Browse FAQs and guides below.</p>
            <span className="text-sm text-muted-foreground">Scroll down ↓</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-2">Frequently Asked Questions</h2>
          <div className="divide-y divide-border">
            {faqs.map(f => <FAQ key={f.q} {...f} />)}
          </div>
        </div>
      </div>
    </div>
  );
}