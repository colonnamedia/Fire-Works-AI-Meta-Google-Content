import React from "react";
import { Eye, CheckCircle } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";

export default function CompetitorInsight({ ai }) {
  const data = ai?.competitorInsight || ai?.competitor_insight;
  if (!data) return null;

  return (
    <SectionCard title="Competitor Insight" icon={Eye}>
      <div className="space-y-4">
        {data.whatCompetitorsDo && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">What Competitors Are Likely Doing</p>
            <p className="text-sm text-foreground leading-relaxed">{data.whatCompetitorsDo}</p>
          </div>
        )}
        {data.commonMessaging && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Common Messaging in This Industry</p>
            <p className="text-sm text-foreground leading-relaxed">{data.commonMessaging}</p>
          </div>
        )}
        {data.howToStandOut && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-primary mb-1">How to Stand Out</p>
                <p className="text-sm text-foreground leading-relaxed">{data.howToStandOut}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}