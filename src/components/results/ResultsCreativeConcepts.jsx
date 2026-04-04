import React, { useState } from "react";
import { Palette, Image, Layout, Sparkles, CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

function ConceptCard({ concept, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-4 bg-card hover:bg-secondary/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">{index + 1}</span>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{concept.title}</p>
            <p className="text-xs text-muted-foreground">{concept.format} · {concept.mood}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="p-4 space-y-4 bg-card border-t border-border">
          {/* Image Description - most important */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5" /> Image / Visual Description
            </p>
            <p className="text-sm text-foreground leading-relaxed">{concept.imageDescription}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <InfoRow label="Visual Style" value={concept.visualStyle} />
            <InfoRow label="Color Palette" value={concept.colorPalette} />
            <InfoRow label="Layout Idea" value={concept.layoutIdea} />
            <InfoRow label="Text Overlay" value={concept.textOverlay} />
          </div>

          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Best For</p>
            <p className="text-sm text-foreground">{concept.bestFor}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="bg-secondary/40 rounded-lg p-3">
      <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export default function ResultsCreativeConcepts({ entry }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [localConcepts, setLocalConcepts] = useState(null);

  const ai = entry?.ai_response_json || {};
  const concepts = localConcepts || ai.creativeConcepts;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("generateCreativeConcepts", {
        entryId: entry.id,
        businessName: entry.business_name,
        industry: entry.industry,
        businessType: entry.business_type,
        offerType: entry.offer_type,
        goal: entry.goal,
        toneOfVoice: entry.tone_of_voice,
        creativePreference: entry.creative_preference,
        audienceDescription: entry.audience_description,
        platformType: entry.platform_type
      });
      if (res.data?.error) throw new Error(res.data.error);
      setLocalConcepts(res.data.result);
      toast({ title: "Creative concepts generated!" });
    } catch (err) {
      toast({ title: "Failed to generate", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!concepts) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Palette className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Visual Creative Concepts</h3>
        <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
          Generate image descriptions, visual styles, color palettes, and layout ideas tailored to your business and ads.
        </p>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Creative Concepts</>}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Visual Creative Concepts</h3>
        </div>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          <span className="ml-1.5">Regenerate</span>
        </Button>
      </div>

      <div className="p-5 space-y-4">
        {/* Style Guide */}
        {concepts.generalStyleGuide && (
          <div className="bg-secondary/40 rounded-lg p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5" /> Overall Style Direction
            </p>
            <p className="text-sm text-foreground">{concepts.generalStyleGuide}</p>
          </div>
        )}

        {/* Concepts */}
        <div className="space-y-3">
          {(concepts.concepts || []).map((concept, i) => (
            <ConceptCard key={i} concept={concept} index={i} />
          ))}
        </div>

        {/* Dos and Don'ts */}
        {(concepts.dosList?.length || concepts.dontsList?.length) && (
          <div className="grid sm:grid-cols-2 gap-4">
            {concepts.dosList?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-600 mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Visual Do's
                </p>
                <ul className="space-y-1.5">
                  {concepts.dosList.map((item, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {concepts.dontsList?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-destructive mb-2 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Visual Don'ts
                </p>
                <ul className="space-y-1.5">
                  {concepts.dontsList.map((item, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-destructive mt-0.5 shrink-0">✗</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Platform notes */}
        {concepts.platformNotes && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">Platform Format Notes</p>
            <p className="text-sm text-blue-800">{concepts.platformNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}