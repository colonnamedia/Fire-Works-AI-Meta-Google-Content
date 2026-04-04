import React from "react";
import { Package, TrendingUp, TrendingDown, Lightbulb } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";

export default function OfferOptimization({ ai }) {
  const data = ai?.offerOptimization || ai?.offer_optimization;
  if (!data) return null;

  const isStrong = data.offerStrength?.toLowerCase().includes('strong');

  return (
    <SectionCard title="Offer Optimization" icon={Package}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${isStrong ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {isStrong ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            Offer Strength: {data.offerStrength || "Needs Review"}
          </div>
        </div>

        {data.whyItWorksOrDoesnt && (
          <p className="text-sm text-muted-foreground leading-relaxed">{data.whyItWorksOrDoesnt}</p>
        )}

        {data.improvedOffers?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Improved Offer Variations</p>
            <div className="space-y-2">
              {data.improvedOffers.map((offer, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
                  <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{offer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}