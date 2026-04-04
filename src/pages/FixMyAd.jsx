import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Zap, AlertTriangle, CheckCircle, ArrowRight, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import CopyButton from "@/components/shared/CopyButton";

function ListItems({ items, accent }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start justify-between gap-2 p-3 rounded-lg bg-secondary/50">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className={`text-xs font-bold mt-0.5 shrink-0 ${accent || "text-primary"}`}>{i + 1}</span>
            <p className="text-sm text-foreground leading-relaxed">{item}</p>
          </div>
          <CopyButton text={item} className="shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function FixMyAd() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adCopy, setAdCopy] = useState("");
  const [platform, setPlatform] = useState("Meta");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleAnalyze = async () => {
    if (!adCopy.trim() || adCopy.trim().length < 10) {
      toast({ title: "Paste your ad copy", description: "Enter at least 10 characters of ad copy to analyze.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await base44.functions.invoke("fixMyAd", { adCopy, platform, context });
      if (res.data?.error === 'SUBSCRIPTION_REQUIRED') {
        toast({ title: "Subscription required", description: "Fix My Ad requires an active plan.", variant: "destructive" });
        navigate("/billing");
        return;
      }
      if (res.data?.error) throw new Error(res.data.error);
      setResult(res.data.result);
      toast({ title: "Analysis complete!", description: "Your ad has been analyzed and saved." });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result ? (result.overallScore >= 70 ? "text-green-600" : result.overallScore >= 45 ? "text-amber-600" : "text-red-600") : "";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Wrench className="w-6 h-6 text-primary" /> Fix My Ad
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Paste an existing ad. Get a full breakdown of what's weak and an improved version — ready to run.</p>
      </div>

      {/* Input Card */}
      {!result && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          {/* Platform selector */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Platform</label>
            <div className="flex gap-2">
              {["Meta", "Google"].map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${platform === p ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
                >
                  {p} Ads
                </button>
              ))}
            </div>
          </div>

          {/* Ad copy */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Paste Your Ad Copy</label>
            <textarea
              value={adCopy}
              onChange={e => setAdCopy(e.target.value)}
              rows={6}
              placeholder={`Paste your ${platform} ad here — hook, body copy, headline, CTA, or full ad...`}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{adCopy.length} characters</p>
          </div>

          {/* Optional context */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">Business / Offer Context <span className="font-normal text-muted-foreground">(optional)</span></label>
            <input
              type="text"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. Local plumber, $99 drain clearing offer, targeting homeowners"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <Button onClick={handleAnalyze} disabled={loading} className="w-full sm:w-auto">
            {loading ? <><Zap className="w-4 h-4 mr-2 animate-pulse" />Analyzing...</> : <><Wrench className="w-4 h-4 mr-2" />Analyze & Fix My Ad</>}
          </Button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Score header */}
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Ad Quality Score</p>
              <p className={`text-4xl font-black ${scoreColor}`}>{result.overallScore}<span className="text-base text-muted-foreground font-normal"> / 100</span></p>
              <p className={`text-sm font-semibold mt-1 ${scoreColor}`}>
                {result.overallScore >= 70 ? "Decent — still room to improve" : result.overallScore >= 45 ? "Needs Work" : "Poor — significant issues found"}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">{platform} Ads</Badge>
              <Button variant="outline" size="sm" onClick={() => { setResult(null); setAdCopy(""); }}>Analyze Another</Button>
            </div>
          </div>

          {/* Why it underperforms */}
          {result.whyItUnderperforms && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Why It Underperforms</p>
              <p className="text-sm text-foreground leading-relaxed">{result.whyItUnderperforms}</p>
            </div>
          )}

          {/* What is weak */}
          {result.whatIsWeak?.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <p className="font-semibold text-foreground text-sm">What's Weak</p>
              </div>
              <div className="space-y-2">
                {result.whatIsWeak.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-foreground">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Fixes */}
          {result.keyFixes?.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="font-semibold text-foreground text-sm">Key Fixes to Make</p>
              </div>
              <div className="space-y-2">
                {result.keyFixes.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-foreground">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improved version */}
          {result.improvedVersion && (
            <div className="bg-card border border-primary/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Improved Ad Version
                </p>
                <CopyButton text={result.improvedVersion} />
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{result.improvedVersion}</p>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Stronger Hooks */}
            {result.strongerHooks?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="font-semibold text-foreground text-sm mb-3">Stronger Hooks</p>
                <ListItems items={result.strongerHooks} />
              </div>
            )}

            {/* Stronger Headlines */}
            {result.strongerHeadlines?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="font-semibold text-foreground text-sm mb-3">Stronger Headlines</p>
                <ListItems items={result.strongerHeadlines} />
              </div>
            )}

            {/* Better CTA */}
            {result.betterCTA?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="font-semibold text-foreground text-sm mb-3">Better CTAs</p>
                <ListItems items={result.betterCTA} />
              </div>
            )}
          </div>

          {/* Final note */}
          {result.finalNote && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <p className="text-sm text-foreground leading-relaxed font-medium">{result.finalNote}</p>
            </div>
          )}

          {/* Show original */}
          <button
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowOriginal(!showOriginal)}
          >
            {showOriginal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showOriginal ? "Hide" : "Show"} original ad
          </button>
          {showOriginal && (
            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground italic whitespace-pre-wrap">{adCopy}</div>
          )}
        </div>
      )}
    </div>
  );
}