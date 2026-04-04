import React from "react";
import { Link2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";

function CheckItem({ label, verdict, suggestion }) {
  const icon = verdict === 'yes'
    ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
    : verdict === 'no'
    ? <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
    : <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;

  return (
    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-secondary/50">
      {icon}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
        {suggestion && <p className="text-sm text-foreground mt-0.5 leading-relaxed">{suggestion}</p>}
      </div>
    </div>
  );
}

export default function AdConversionCheck({ ai }) {
  const data = ai?.adConversionCheck || ai?.ad_conversion_check;
  if (!data) return null;

  return (
    <SectionCard title="Ad Conversion Check" icon={Link2}>
      <div className="space-y-2">
        <CheckItem
          label="Ad & Page Message Match"
          verdict={data.messageMatch?.verdict}
          suggestion={data.messageMatch?.suggestion}
        />
        <CheckItem
          label="Is the Offer Clear?"
          verdict={data.offerClarity?.verdict}
          suggestion={data.offerClarity?.suggestion}
        />
        <CheckItem
          label="Strong CTA Present"
          verdict={data.strongCTA?.verdict}
          suggestion={data.strongCTA?.suggestion}
        />
        <CheckItem
          label="Would This Page Convert Ad Traffic?"
          verdict={data.wouldConvert?.verdict}
          suggestion={data.wouldConvert?.suggestion}
        />
      </div>
    </SectionCard>
  );
}