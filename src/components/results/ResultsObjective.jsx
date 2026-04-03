import React from "react";
import { Target, Crosshair, MessageSquare, GitBranch, DollarSign } from "lucide-react";
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

      {ai.alternativeObjectives?.length > 0 && (
        <SectionCard title="Alternative Objectives" icon={GitBranch}>
          <div className="space-y-2">
            {ai.alternativeObjectives.map((alt, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/50 space-y-0.5">
                <p className="text-sm font-semibold text-foreground">{alt.objective}</p>
                <p className="text-xs text-muted-foreground">{alt.when}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {ai.budgetGuidance && (
        <SectionCard title="Budget Guidance" icon={DollarSign} copyText={ai.budgetGuidance}>
          <p className="text-sm text-muted-foreground leading-relaxed">{ai.budgetGuidance}</p>
        </SectionCard>
      )}

      <div className="md:col-span-2">
        <SectionCard title="Why This Makes Sense" icon={MessageSquare} copyText={ai.whyThisMakesSense}>
          <p className="text-sm text-muted-foreground leading-relaxed">{ai.whyThisMakesSense}</p>
        </SectionCard>
      </div>
    </div>
  );
}