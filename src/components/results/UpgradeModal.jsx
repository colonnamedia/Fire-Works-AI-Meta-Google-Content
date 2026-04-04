import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Zap, Check, Layers, Facebook, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpgradeModal({ reason, onClose }) {
  const navigate = useNavigate();

  const reasons = {
    both_platforms: {
      title: "Unlock Both Platforms",
      desc: "You selected Meta + Google but your current plan only covers one platform.",
      plans: [
        { name: "Single Platform", price: "$14.99", icon: Facebook, features: ["Meta OR Google", "5 entries/month", "$1.99 overage"], highlight: false },
        { name: "Both Platforms", price: "$19.99", icon: Layers, features: ["Meta AND Google", "5 entries/month", "$1.99 overage", "Unlimited strategies"], highlight: true },
      ]
    },
    credits_exhausted: {
      title: "Credits Exhausted",
      desc: "You've used all 5 included entries this month. Continuing will charge $1.99 per entry.",
      plans: null
    },
    fix_my_ad: {
      title: "Subscription Required",
      desc: "Fix My Ad is a premium feature that requires an active plan.",
      plans: [
        { name: "Single Platform", price: "$14.99", icon: Search, features: ["Fix My Ad", "5 entries/month", "Full AI strategy"], highlight: false },
        { name: "Both Platforms", price: "$19.99", icon: Layers, features: ["Fix My Ad", "Meta + Google", "Unlimited strategies"], highlight: true },
      ]
    }
  };

  const config = reasons[reason] || reasons.both_platforms;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-bold text-foreground">{config.title}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">{config.desc}</p>

          {config.plans && (
            <div className="grid grid-cols-2 gap-3">
              {config.plans.map(plan => {
                const Icon = plan.icon;
                return (
                  <div key={plan.name} className={`rounded-xl border p-4 ${plan.highlight ? "border-primary bg-primary/5" : "border-border"}`}>
                    {plan.highlight && (
                      <span className="text-xs bg-primary text-white font-bold px-2 py-0.5 rounded-full mb-2 inline-block">Recommended</span>
                    )}
                    <Icon className={`w-5 h-5 mb-2 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="font-bold text-foreground text-sm">{plan.name}</p>
                    <p className="text-lg font-black text-foreground">{plan.price}<span className="text-xs text-muted-foreground">/mo</span></p>
                    <ul className="mt-2 space-y-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Check className="w-3 h-3 text-primary shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button className="flex-1" onClick={() => { navigate("/billing"); onClose(); }}>
              View Plans
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {reason === 'credits_exhausted' ? 'Continue ($1.99)' : 'Cancel'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}