import React from "react";
import { Layers, Settings, MapPin, Users, Tag, BarChart2 } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";

function TagList({ items }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span key={i} className="text-xs bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border">{item}</span>
      ))}
    </div>
  );
}

export default function ResultsStrategy({ ai }) {
  const targeting = ai.targetingIdeas || {};

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <SectionCard title="Campaign Setup" icon={Layers} copyText={ai.campaignSetup}>
        <p className="text-sm text-muted-foreground leading-relaxed">{ai.campaignSetup}</p>
      </SectionCard>

      <SectionCard title="Ad Set Strategy" icon={Settings} copyText={ai.adSetStrategy}>
        <p className="text-sm text-muted-foreground leading-relaxed">{ai.adSetStrategy}</p>
      </SectionCard>

      <SectionCard title="Placements" icon={MapPin} copyText={ai.placements}>
        <p className="text-sm text-muted-foreground leading-relaxed">{ai.placements}</p>
      </SectionCard>

      {ai.audienceAngles?.length > 0 && (
        <SectionCard title="Audience Angles" icon={Users}>
          <div className="space-y-1.5">
            {ai.audienceAngles.map((angle, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/50">
                <span className="text-xs font-bold text-primary w-4 shrink-0">{i + 1}</span>
                <p className="text-sm text-foreground">{angle}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {(targeting.interests?.length || targeting.behaviors?.length || targeting.demographics?.length) ? (
        <div className="md:col-span-2">
          <SectionCard title="Targeting Ideas" icon={Tag}>
            <div className="space-y-4">
              {targeting.interests?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Interests</p>
                  <TagList items={targeting.interests} />
                </div>
              )}
              {targeting.behaviors?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Behaviors</p>
                  <TagList items={targeting.behaviors} />
                </div>
              )}
              {targeting.demographics?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Demographics</p>
                  <TagList items={targeting.demographics} />
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}