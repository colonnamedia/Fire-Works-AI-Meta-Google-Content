import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

const QUESTIONS = [
  {
    key: "platform",
    label: "Which platform are you advertising on?",
    options: [
      { value: "Meta", label: "Meta (Facebook & Instagram)" },
      { value: "Google", label: "Google Ads" },
      { value: "Both", label: "Both — help me decide" },
    ],
  },
  {
    key: "businessType",
    label: "What best describes your business?",
    options: [
      { value: "Local service", label: "Local Service Business", sub: "Plumber, cleaner, dentist, etc." },
      { value: "Ecommerce", label: "Ecommerce / Online Store", sub: "Selling physical or digital products" },
      { value: "Coaching / Consulting", label: "Coach or Consultant", sub: "Selling expertise or programs" },
      { value: "SaaS / App", label: "SaaS / App", sub: "Software or app subscriptions" },
      { value: "Restaurant / Retail", label: "Restaurant or Retail", sub: "Physical location with foot traffic" },
      { value: "Agency", label: "Agency / Freelancer", sub: "Selling services to businesses" },
    ],
  },
  {
    key: "objective",
    label: "What is your main objective for this campaign?",
    options: [
      { value: "Generate leads", label: "Generate Leads", sub: "Phone calls, form fills, bookings" },
      { value: "Drive online sales", label: "Drive Online Sales", sub: "Product purchases on a website" },
      { value: "Build brand awareness", label: "Build Brand Awareness", sub: "Get more people to know you exist" },
      { value: "Get website traffic", label: "Get Website Traffic", sub: "Clicks to your site" },
      { value: "Drive store visits", label: "Drive Store Visits", sub: "Foot traffic to a physical location" },
      { value: "Get messages / conversations", label: "Start Conversations", sub: "DMs, WhatsApp, or Messenger" },
      { value: "Re-engage past visitors", label: "Re-engage Past Visitors", sub: "Retargeting warm audiences" },
    ],
  },
  {
    key: "budget",
    label: "What is your monthly ad budget?",
    options: [
      { value: "Under $300/month", label: "Under $300/month" },
      { value: "$300–$750/month", label: "$300–$750/month" },
      { value: "$750–$1,500/month", label: "$750–$1,500/month" },
      { value: "$1,500–$5,000/month", label: "$1,500–$5,000/month" },
      { value: "Over $5,000/month", label: "Over $5,000/month" },
    ],
  },
  {
    key: "conversionPath",
    label: "Where do you want people to convert?",
    options: [
      { value: "On my website", label: "On my website", sub: "Form, purchase, or booking page" },
      { value: "On a Meta lead form", label: "Meta lead form", sub: "Stays inside Facebook/Instagram" },
      { value: "By calling me", label: "By calling me", sub: "Phone call is the conversion" },
      { value: "In Messenger / DMs", label: "Via Messenger or DMs", sub: "Conversation-based conversion" },
      { value: "In-store visit", label: "In-store or in-person", sub: "They show up physically" },
    ],
  },
  {
    key: "urgency",
    label: "How urgent is the buying decision for your customers?",
    options: [
      { value: "Immediate", label: "Immediate need", sub: "They need this right now (emergency plumber, etc.)" },
      { value: "Short-term", label: "Short-term consideration", sub: "Deciding within days or a week" },
      { value: "Research phase", label: "Research phase", sub: "Comparing options over weeks or months" },
      { value: "Impulse", label: "Impulse buy", sub: "Low-cost product, no research needed" },
    ],
  },
  {
    key: "searchIntent",
    label: "Are people actively searching for what you offer?",
    options: [
      { value: "Yes — high search volume", label: "Yes — lots of searches", sub: "People Google this regularly" },
      { value: "Some searches", label: "Some — niche product", sub: "Some searches but not tons" },
      { value: "No — awareness needed", label: "Not really", sub: "People don't know they need it yet" },
      { value: "Mixed", label: "Mixed — both exist", sub: "Some searchers + cold audience potential" },
    ],
  },
  {
    key: "landingPage",
    label: "How would you rate your landing page or website?",
    options: [
      { value: "Strong — optimized with clear CTA", label: "Strong — clear CTA, fast, and optimized" },
      { value: "Average — decent but not great", label: "Average — it works but could be better" },
      { value: "Weak — basic site or no site", label: "Weak — basic or no dedicated landing page" },
      { value: "No site — using lead form", label: "No website — I'll use a platform lead form" },
    ],
  },
  {
    key: "offerType",
    label: "How would you describe your offer?",
    options: [
      { value: "Free consultation or quote", label: "Free consultation / quote / estimate" },
      { value: "Lead magnet or free guide", label: "Free lead magnet, guide, or trial" },
      { value: "Direct product for sale", label: "Product for direct purchase" },
      { value: "Discount or limited-time deal", label: "Discount, promo, or limited-time offer" },
      { value: "Subscription or membership", label: "Subscription or ongoing membership" },
      { value: "Event or webinar", label: "Event, webinar, or live session" },
    ],
  },
];

export default function CampaignQuiz({ onSubmit, loading }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = QUESTIONS[step];
  const selected = answers[q.key];
  const isLast = step === QUESTIONS.length - 1;

  const handleSelect = (val) => {
    setAnswers(prev => ({ ...prev, [q.key]: val }));
  };

  const handleNext = () => {
    if (isLast) {
      onSubmit(answers);
    } else {
      setStep(s => s + 1);
    }
  };

  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {step + 1} of {QUESTIONS.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">{q.label}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                selected === opt.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/40 hover:bg-secondary/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  selected === opt.value ? "border-primary" : "border-muted-foreground/40"
                }`}>
                  {selected === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{opt.label}</p>
                  {opt.sub && <p className="text-xs text-muted-foreground mt-0.5">{opt.sub}</p>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-1">
        <Button variant="outline" size="sm" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button onClick={handleNext} disabled={!selected || loading} size="sm" className="gap-2">
          {isLast ? (
            loading ? "Analyzing..." : <><Zap className="w-4 h-4" /> Get My Recommendation</>
          ) : (
            <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
          )}
        </Button>
      </div>
    </div>
  );
}