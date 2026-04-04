import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Copy, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function AdResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [access, setAccess] = useState(null);

  const { data: request, isLoading } = useQuery({
    queryKey: ["adRequest", id],
    queryFn: () => base44.entities.AdRequest.filter({ id }).then(r => r[0]),
  });

  // Check access on mount
  React.useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await base44.functions.invoke("checkAdGenerationAccess", {}).then(r => r.data);
        if (!res.hasAccess) {
          navigate(`/results-preview/${id}`);
        } else {
          setAccess(res);
        }
      } catch {
        navigate(`/results-preview/${id}`);
      }
    };
    checkAccess();
  }, [id, navigate]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
  };

  if (isLoading || !access) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Request not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  // Sample full results for now
  const results = {
    campaignSummary: `Create a ${request.platform_type} campaign targeting ${request.audience_description || 'your ideal customers'} with a focus on ${request.goal}.`,
    recommendedPlatform: request.platform_type === 'both' ? 'Meta & Google' : request.platform_type === 'meta' ? 'Meta (Facebook & Instagram)' : 'Google Ads',
    headlines: [
      `Transform Your ${request.industry || 'Business'} Today`,
      `${request.business_name} - Expert ${request.industry || 'Services'}`,
      `Get Results with ${request.business_name}`,
      `Limited Time: ${request.offer_type || 'Special Offer'}`,
    ],
    descriptions: [
      `Join thousands who trust ${request.business_name} for premium ${request.offer_type || 'solutions'}. Learn why we're the best choice.`,
      `Discover how ${request.business_name} delivers results. ${request.notes || 'Contact us today.'}`
    ],
    ctas: [
      "Learn More",
      "Get Started",
      "Claim Offer",
      "Contact Us"
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{request.business_name}</h1>
          <p className="text-sm text-muted-foreground">{request.goal} campaign for {request.platform_type}</p>
        </div>
      </div>

      {/* Campaign Summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="font-semibold text-foreground mb-3">Campaign Summary</h2>
        <p className="text-foreground text-sm leading-relaxed">{results.campaignSummary}</p>
      </div>

      {/* Platform & Audience */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Recommended Platform</p>
          <p className="text-lg font-semibold text-foreground">{results.recommendedPlatform}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Target Audience</p>
          <p className="text-sm text-foreground">{request.audience_description || 'Your ideal customers'}</p>
        </div>
      </div>

      {/* Headlines */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Headline Options</h2>
          <Button variant="ghost" size="sm" onClick={() => handleCopy(results.headlines.join('\n'))}>
            <Copy className="w-4 h-4 mr-1" /> Copy All
          </Button>
        </div>
        <div className="space-y-2">
          {results.headlines.map((h, i) => (
            <div key={i} className="bg-secondary/30 rounded p-3 flex items-start justify-between gap-2">
              <p className="text-sm text-foreground flex-1">{h}</p>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(h)}>
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Descriptions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Primary Text / Descriptions</h2>
          <Button variant="ghost" size="sm" onClick={() => handleCopy(results.descriptions.join('\n\n'))}>
            <Copy className="w-4 h-4 mr-1" /> Copy All
          </Button>
        </div>
        <div className="space-y-2">
          {results.descriptions.map((d, i) => (
            <div key={i} className="bg-secondary/30 rounded p-3 flex items-start justify-between gap-2">
              <p className="text-sm text-foreground flex-1">{d}</p>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(d)}>
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">CTA Options</h2>
          <Button variant="ghost" size="sm" onClick={() => handleCopy(results.ctas.join('\n'))}>
            <Copy className="w-4 h-4 mr-1" /> Copy All
          </Button>
        </div>
        <div className="space-y-2">
          {results.ctas.map((c, i) => (
            <div key={i} className="bg-secondary/30 rounded p-3 flex items-start justify-between gap-2">
              <p className="text-sm text-foreground flex-1">{c}</p>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(c)}>
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1" onClick={() => navigate("/dashboard")}>
          <Download className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Generate Again
        </Button>
      </div>
    </div>
  );
}