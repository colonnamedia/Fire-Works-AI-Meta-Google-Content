import React from "react";
import { Layers, Settings, MapPin, Users } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";

export default function ResultsStrategy({ ai }) {
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

      <SectionCard title="Audience Direction" icon={Users} copyText={ai.audienceDirection}>
        <p className="text-sm text-muted-foreground leading-relaxed">{ai.audienceDirection}</p>
      </SectionCard>
    </div>
  );
}