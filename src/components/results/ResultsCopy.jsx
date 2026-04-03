import React from "react";
import { Sparkles, Type, AlignLeft, MousePointer, Palette } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import CopyButton from "@/components/shared/CopyButton";

function ListItems({ items }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">No suggestions</p>;
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start justify-between gap-2 p-3 rounded-lg bg-secondary/50">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className="text-xs font-bold text-primary mt-0.5">{i + 1}</span>
            <p className="text-sm text-foreground leading-relaxed">{item}</p>
          </div>
          <CopyButton text={item} className="shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function ResultsCopy({ ai }) {
  return (
    <div className="space-y-5">
      <SectionCard title="Hook Ideas" icon={Sparkles} copyText={(ai.hooks || []).join("\n")}>
        <ListItems items={ai.hooks} />
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-5">
        <SectionCard title="Headlines" icon={Type} copyText={(ai.headlines || []).join("\n")}>
          <ListItems items={ai.headlines} />
        </SectionCard>

        <SectionCard title="CTA Suggestions" icon={MousePointer} copyText={(ai.ctaSuggestions || []).join("\n")}>
          <ListItems items={ai.ctaSuggestions} />
        </SectionCard>
      </div>

      <SectionCard title="Primary Text Options" icon={AlignLeft} copyText={(ai.primaryTextOptions || []).join("\n\n")}>
        <ListItems items={ai.primaryTextOptions} />
      </SectionCard>

      <SectionCard title="Creative Angle Ideas" icon={Palette} copyText={(ai.creativeAngleIdeas || []).join("\n")}>
        <ListItems items={ai.creativeAngleIdeas} />
      </SectionCard>
    </div>
  );
}