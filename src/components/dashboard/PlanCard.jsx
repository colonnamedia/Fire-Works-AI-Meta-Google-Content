import React from "react";
import { Link } from "react-router-dom";
import { Star, Target, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const goalLabels = {
  leads: "Leads",
  sales: "Sales",
  awareness: "Awareness",
  traffic: "Traffic",
  engagement: "Engagement",
  messaging: "Messaging",
  app_installs: "App Installs",
};

export default function PlanCard({ plan }) {
  return (
    <Link
      to={`/plan/${plan.id}`}
      className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all group block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {plan.campaign_name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{plan.business_name}</p>
        </div>
        {plan.is_favorite && (
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 ml-2" />
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {plan.goal && (
          <Badge variant="secondary" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            {goalLabels[plan.goal] || plan.goal}
          </Badge>
        )}
        {plan.recommended_objective && (
          <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/15 border-0">
            AI: {plan.recommended_objective}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          {plan.budget || "N/A"}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {plan.created_date ? format(new Date(plan.created_date), "MMM d") : "—"}
        </div>
      </div>

      {plan.status === "generated" && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-green-600 font-medium">✓ Strategy Generated</span>
        </div>
      )}
    </Link>
  );
}