import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";

export default function AdResultsPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: request, isLoading } = useQuery({
    queryKey: ["adRequest", id],
    queryFn: () => base44.entities.AdRequest.filter({ id }).then(r => r[0]),
  });

  const handleUnlock = () => {
    navigate("/billing");
  };

  if (isLoading) {
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
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/get-started")}>Start Over</Button>
      </div>
    );
  }

  // Sample preview
  const preview = {
    headline: `Transform Your ${request.industry || 'Business'} Today`,
    description: `Join thousands who trust ${request.business_name} for premium ${request.offer_type || 'solutions'}.`,
    cta: "Learn More"
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/get-started")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{request.business_name}</h1>
          <p className="text-sm text-muted-foreground">Preview for {request.goal} campaign</p>
        </div>
      </div>

      {/* Campaign Summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="font-semibold text-foreground mb-3">Your Campaign</h2>
        <div className="space-y-2">
          <p className="text-sm"><strong>Business:</strong> {request.business_name}</p>
          <p className="text-sm"><strong>Goal:</strong> {request.goal}</p>
          <p className="text-sm"><strong>Platform:</strong> {request.platform_type === 'both' ? 'Meta & Google' : request.platform_type}</p>
          {request.audience_description && <p className="text-sm"><strong>Audience:</strong> {request.audience_description}</p>}
        </div>
      </div>

      {/* Sample Results */}
      <div className="space-y-4">
        <div className="bg-primary/5 rounded-lg border border-primary/20 p-4">
          <p className="text-xs text-primary font-semibold mb-2">SAMPLE HEADLINE</p>
          <p className="text-lg font-semibold text-foreground">{preview.headline}</p>
        </div>

        <div className="bg-primary/5 rounded-lg border border-primary/20 p-4">
          <p className="text-xs text-primary font-semibold mb-2">SAMPLE DESCRIPTION</p>
          <p className="text-sm text-foreground">{preview.description}</p>
        </div>

        <div className="bg-primary/5 rounded-lg border border-primary/20 p-4">
          <p className="text-xs text-primary font-semibold mb-2">SAMPLE CTA</p>
          <p className="text-sm text-foreground font-medium">{preview.cta}</p>
        </div>
      </div>

      {/* Locked Section */}
      <div className="bg-secondary/50 rounded-lg border border-border p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
        <div className="relative space-y-3">
          <div className="h-4 bg-muted/30 rounded w-3/4 blur-sm" />
          <div className="h-4 bg-muted/30 rounded w-full blur-sm" />
          <div className="h-4 bg-muted/30 rounded w-2/3 blur-sm" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Lock className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm font-semibold text-foreground">Full Results Locked</p>
          <p className="text-xs text-muted-foreground mt-1">3 more headlines • 1 more description • 3 CTA options</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-lg border border-primary/20 p-6 text-center">
        <div className="flex justify-center mb-3">
          <Badge className="gap-1.5">
            <Zap className="w-3 h-3" />
            Full Results Require Subscription
          </Badge>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Unlock Your Complete Ad Strategy</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          Get all headlines, descriptions, CTAs, targeting recommendations, and platform-specific guidance.
        </p>
        <Button onClick={handleUnlock} className="gap-2">
          <Zap className="w-4 h-4" /> Unlock Full Results
        </Button>
        <p className="text-xs text-muted-foreground mt-3">Starting at $14.99/month</p>
      </div>
    </div>
  );
}