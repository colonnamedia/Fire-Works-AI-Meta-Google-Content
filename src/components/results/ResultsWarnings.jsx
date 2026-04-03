import React from "react";
import { AlertTriangle, Award } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import CopyButton from "@/components/shared/CopyButton";

export default function ResultsWarnings({ ai }) {
  return (
    <div className="space-y-5">
      {ai.risksWarnings?.length > 0 && (
        <SectionCard title="Risks & Warnings" icon={AlertTriangle}>
          <div className="space-y-2">
            {ai.risksWarnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{w}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {ai.finalRecommendation && (
        <SectionCard title="Final Recommendation" icon={Award} copyText={ai.finalRecommendation}>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-sm text-foreground leading-relaxed font-medium">{ai.finalRecommendation}</p>
          </div>
        </SectionCard>
      )}
    </div>
  );
}