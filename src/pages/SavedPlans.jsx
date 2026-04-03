import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FolderOpen, Star } from "lucide-react";
import PlanCard from "@/components/dashboard/PlanCard";

export default function SavedPlans() {
  const [search, setSearch] = useState("");
  const [goalFilter, setGoalFilter] = useState("all");
  const [favFilter, setFavFilter] = useState("all");

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["adPlans"],
    queryFn: () => base44.entities.AdPlan.list("-created_date", 200),
  });

  const filtered = useMemo(() => {
    return plans.filter((p) => {
      const matchSearch =
        !search ||
        p.campaign_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.business_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.industry?.toLowerCase().includes(search.toLowerCase());
      const matchGoal = goalFilter === "all" || p.goal === goalFilter;
      const matchFav = favFilter === "all" || (favFilter === "favorites" && p.is_favorite);
      return matchSearch && matchGoal && matchFav;
    });
  }, [plans, search, goalFilter, favFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saved Plans</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {plans.length} plan{plans.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, business, or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={goalFilter} onValueChange={setGoalFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Goals</SelectItem>
            <SelectItem value="leads">Leads</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="awareness">Awareness</SelectItem>
            <SelectItem value="traffic">Traffic</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
            <SelectItem value="messaging">Messaging</SelectItem>
          </SelectContent>
        </Select>
        <Select value={favFilter} onValueChange={setFavFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="favorites">Favorites Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Plans grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse h-40" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <FolderOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">
            {plans.length === 0 ? "No saved plans yet" : "No plans match your filters"}
          </p>
        </div>
      )}
    </div>
  );
}