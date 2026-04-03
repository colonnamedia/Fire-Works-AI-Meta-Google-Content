import React from "react";
import { Target, Crosshair, MessageSquare } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";

export default function ResultsObjective({ ai }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <SectionCard title="Recommended Objective" icon={Target} copyText={ai.recommendedObjective}>
        <p className="text-2xl font-bold text-primary">{ai.recommendedObjective}</p>
      </SectionCard>

      <SectionCard title="Optimization Goal" icon={Crosshair} copyText={ai.recommendedOptimizationGoal}>
        <p className="text-2xl font-bold text-foreground">{ai.recommendedOptimizationGoal}</p>
      </SectionCard>

      <div className="md:col-span-2">
        <SectionCard title="Why This Makes Sense" icon={MessageSquare} copyText={ai.whyThisMakesSense}>
          <p className="text-sm text-muted-foreground leading-relaxed">{ai.whyThisMakesSense}</p>
        </SectionCard>
      </div>
    </div>
  );
}