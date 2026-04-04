import React from "react";
import { Search, Target, MessageSquare, Type, AlignLeft, MousePointer, Zap, DollarSign, AlertTriangle, Award, Tag, Link } from "lucide-react";
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

function TagList({ items }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span key={i} className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">{item}</span>
      ))}
    </div>
  );
}

export default function ResultsGoogle({ ai }) {
  const g = ai?.google || ai;
  if (!g) return null;

  return (
    <div className="space-y-5">
      {/* Header badge */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <Search className="w-4 h-4 text-blue-600 shrink-0" />
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Google Ads Strategy</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <SectionCard title="Recommended Campaign Type" icon={Target} copyText={g.recommendedCampaignType}>
          <p className="text-xl font-bold text-primary">{g.recommendedCampaignType}</p>
        </SectionCard>

        <SectionCard title="Campaign Goal" icon={Zap} copyText={g.campaignGoal}>
          <p className="text-xl font-bold text-foreground">{g.campaignGoal}</p>
        </SectionCard>

        <div className="md:col-span-2">
          <SectionCard title="Why This Makes Sense" icon={MessageSquare} copyText={g.whyThisMakesSense}>
            <p className="text-sm text-muted-foreground leading-relaxed">{g.whyThisMakesSense}</p>
          </SectionCard>
        </div>

        <SectionCard title="Campaign Structure" icon={Search} copyText={g.suggestedCampaignStructure}>
          <p className="text-sm text-muted-foreground leading-relaxed">{g.suggestedCampaignStructure}</p>
        </SectionCard>

        <SectionCard title="Bidding Strategy" icon={DollarSign} copyText={g.biddingStrategy}>
          <p className="text-sm text-muted-foreground leading-relaxed">{g.biddingStrategy}</p>
        </SectionCard>
      </div>

      {g.keywordIdeas?.length > 0 && (
        <SectionCard title="Keyword Ideas" icon={Tag} copyText={g.keywordIdeas?.join(", ")}>
          <div className="space-y-3">
            <TagList items={g.keywordIdeas} />
            {g.matchTypeSuggestions && (
              <div className="mt-3 p-3 rounded-lg bg-secondary/50">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Match Type Suggestions</p>
                <p className="text-sm text-foreground">{g.matchTypeSuggestions}</p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {g.audienceSignals && (
        <SectionCard title="Audience Signals" icon={Target} copyText={g.audienceSignals}>
          <p className="text-sm text-muted-foreground leading-relaxed">{g.audienceSignals}</p>
        </SectionCard>
      )}

      <SectionCard title="Search Headlines" icon={Type} copyText={(g.searchHeadlines || []).join("\n")}>
        <ListItems items={g.searchHeadlines} />
      </SectionCard>

      <SectionCard title="Descriptions" icon={AlignLeft} copyText={(g.descriptions || []).join("\n")}>
        <ListItems items={g.descriptions} />
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-5">
        <SectionCard title="CTA Suggestions" icon={MousePointer} copyText={(g.ctaSuggestions || []).join("\n")}>
          <ListItems items={g.ctaSuggestions} />
        </SectionCard>

        {g.extensionsIdeas?.length > 0 && (
          <SectionCard title="Extensions Ideas" icon={Link} copyText={(g.extensionsIdeas || []).join("\n")}>
            <ListItems items={g.extensionsIdeas} />
          </SectionCard>
        )}
      </div>

      {g.budgetGuidance && (
        <SectionCard title="Budget Guidance" icon={DollarSign} copyText={g.budgetGuidance}>
          <p className="text-sm text-muted-foreground leading-relaxed">{g.budgetGuidance}</p>
        </SectionCard>
      )}

      {g.risksWarnings?.length > 0 && (
        <SectionCard title="Risks & Warnings" icon={AlertTriangle}>
          <div className="space-y-2">
            {g.risksWarnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{w}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {g.finalRecommendation && (
        <SectionCard title="Final Recommendation" icon={Award} copyText={g.finalRecommendation}>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-sm text-foreground leading-relaxed font-medium">{g.finalRecommendation}</p>
          </div>
        </SectionCard>
      )}
    </div>
  );
}