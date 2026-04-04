import React from "react";
import { Zap, TrendingUp, Target } from "lucide-react";

function getConversionPotential(score) {
  if (score >= 75) return { label: "High", color: "text-green-600", bg: "bg-green-100" };
  if (score >= 50) return { label: "Medium", color: "text-amber-600", bg: "bg-amber-100" };
  return { label: "Low", color: "text-red-600", bg: "bg-red-100" };
}

function getFunnelFit(ai) {
  // Score based on presence of key strategy elements
  let points = 0;
  if (ai?.recommendedObjective || ai?.recommendedCampaignType) points += 2;
  if (ai?.targetingIdeas?.interests?.length > 3 || ai?.keywordIdeas?.length > 8) points += 2;
  if (ai?.hooks?.length >= 3 || ai?.searchHeadlines?.length >= 5) points += 2;
  if (ai?.audienceAngles?.length >= 2 || ai?.audienceSignals) points += 2;
  if (ai?.finalRecommendation) points += 2;
  if (points >= 8) return { label: "Strong", color: "text-green-600", bg: "bg-green-100" };
  if (points >= 5) return { label: "Moderate", color: "text-amber-600", bg: "bg-amber-100" };
  return { label: "Weak", color: "text-red-600", bg: "bg-red-100" };
}

function calculateScore(ai, platformType) {
  if (!ai) return 60;
  let score = 50;
  const m = ai.meta || ai;
  const g = ai.google || ai;

  if (platformType === 'meta' || platformType === 'both') {
    if (m.recommendedObjective) score += 5;
    if (m.hooks?.length >= 3) score += 8;
    if (m.headlines?.length >= 3) score += 5;
    if (m.primaryTextOptions?.short) score += 5;
    if (m.targetingIdeas?.interests?.length >= 4) score += 7;
    if (m.audienceAngles?.length >= 3) score += 5;
    if (m.creativeIdeas?.length >= 2) score += 5;
    if (m.offerPositioningIdeas?.length >= 2) score += 5;
  }
  if (platformType === 'google' || platformType === 'both') {
    if (g.recommendedCampaignType) score += 5;
    if (g.keywordIdeas?.length >= 10) score += 8;
    if (g.searchHeadlines?.length >= 5) score += 5;
    if (g.descriptions?.length >= 3) score += 5;
    if (g.biddingStrategy) score += 2;
  }
  return Math.min(99, score);
}

export default function AdScoreCard({ ai, platformType }) {
  const score = calculateScore(ai, platformType);
  const conversion = getConversionPotential(score);
  const funnel = getFunnelFit(ai?.meta || ai?.google || ai);

  const scoreColor = score >= 75 ? "text-green-600" : score >= 55 ? "text-amber-600" : "text-red-600";
  const scoreRingColor = score >= 75 ? "#16a34a" : score >= 55 ? "#d97706" : "#dc2626";
  const circumference = 2 * Math.PI * 30;
  const dash = (score / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5">
      {/* Score Ring */}
      <div className="relative shrink-0">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="30" fill="none" stroke="hsl(var(--border))" strokeWidth="7" />
          <circle
            cx="40" cy="40" r="30" fill="none"
            stroke={scoreRingColor} strokeWidth="7"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-black ${scoreColor}`}>{score}</span>
          <span className="text-xs text-muted-foreground leading-none">/ 100</span>
        </div>
      </div>

      {/* Labels */}
      <div className="flex-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Ad Strategy Score</p>
        <p className={`text-xl font-black mb-3 ${scoreColor}`}>
          {score >= 80 ? "Excellent Strategy" : score >= 65 ? "Solid Strategy" : score >= 50 ? "Needs Refinement" : "Weak — Review Inputs"}
        </p>
        <div className="flex flex-wrap gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${conversion.bg} ${conversion.color}`}>
            <TrendingUp className="w-3 h-3" />
            Conversion Potential: {conversion.label}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${funnel.bg} ${funnel.color}`}>
            <Target className="w-3 h-3" />
            Funnel Fit: {funnel.label}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Zap className="w-3 h-3" />
            {platformType === 'both' ? 'Meta + Google' : platformType === 'google' ? 'Google Ads' : 'Meta Ads'}
          </div>
        </div>
      </div>
    </div>
  );
}