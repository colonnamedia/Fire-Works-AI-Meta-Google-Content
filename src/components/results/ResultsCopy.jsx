import React from "react";
import { Sparkles, Type, AlignLeft, MousePointer, Palette, Gift } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import CopyButton from "@/components/shared/CopyButton";

function ListItems({ items }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">No suggestions</p>;
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start justify-between gap-2 p-3 rounded-lg bg-secondary/50">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className="text-xs font-bold text-primary mt-0.5 shrink-0">{i + 1}</span>
            <p className="text-sm text-foreground leading-relaxed">{item}</p>
          </div>
          <CopyButton text={item} className="shrink-0" />
        </div>
      ))}
    </div>
  );
}

function PrimaryTextBlock({ label, text, variant }) {
  if (!text) return null;
  const colors = {
    short: "bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
    medium: "bg-secondary/50 border-border",
    long: "bg-primary/5 border-primary/10",
  };
  return (
    <div className={`rounded-lg border p-4 ${colors[variant] || colors.medium}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
        <CopyButton text={text} />
      </div>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

export default function ResultsCopy({ ai }) {
  const primaryText = ai.primaryTextOptions || {};
  const isObject = typeof primaryText === 'object' && !Array.isArray(primaryText);
  const primaryTextArray = Array.isArray(primaryText) ? primaryText : null;

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

      <SectionCard title="Primary Text Options" icon={AlignLeft}>
        {isObject ? (
          <div className="space-y-3">
            <PrimaryTextBlock label="Short" text={primaryText.short} variant="short" />
            <PrimaryTextBlock label="Medium" text={primaryText.medium} variant="medium" />
            <PrimaryTextBlock label="Long" text={primaryText.long} variant="long" />
          </div>
        ) : (
          <ListItems items={primaryTextArray} />
        )}
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-5">
        <SectionCard title="Creative Ideas" icon={Palette} copyText={(ai.creativeIdeas || ai.creativeAngleIdeas || []).join("\n")}>
          <ListItems items={ai.creativeIdeas || ai.creativeAngleIdeas} />
        </SectionCard>

        {(ai.offerPositioningIdeas?.length > 0) && (
          <SectionCard title="Offer Positioning Ideas" icon={Gift} copyText={(ai.offerPositioningIdeas || []).join("\n")}>
            <ListItems items={ai.offerPositioningIdeas} />
          </SectionCard>
        )}
      </div>
    </div>
  );
}