import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Star, FileText, TrendingUp, Clock } from "lucide-react";
import PlanCard from "@/components/dashboard/PlanCard";
import StatsRow from "@/components/dashboard/StatsRow";

export default function Dashboard() {
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["adPlans"],
    queryFn: () => base44.entities.AdPlan.list("-created_date", 50),
  });

  const recentPlans = plans.slice(0, 6);
  const favoritePlans = plans.filter((p) => p.is_favorite);
  const generatedCount = plans.filter((p) => p.status === "generated").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your ad strategy command center
          </p>
        </div>
        <Button asChild>
          <Link to="/new-plan">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Ad Plan
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <StatsRow
        total={plans.length}
        generated={generatedCount}
        favorites={favoritePlans.length}
      />

      {/* Favorites */}
      {favoritePlans.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground">Favorites</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritePlans.slice(0, 3).map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Plans */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Recent Plans</h2>
          </div>
          {plans.length > 6 && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/saved-plans">View All</Link>
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse h-40" />
            ))}
          </div>
        ) : recentPlans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No ad plans yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first AI-powered ad strategy
            </p>
            <Button asChild>
              <Link to="/new-plan">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Plan
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}