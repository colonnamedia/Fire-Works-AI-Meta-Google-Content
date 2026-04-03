import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Star, Target, Calendar, DollarSign, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";

const GOAL_LABELS = { leads: "Leads", sales: "Sales", awareness: "Awareness", traffic: "Traffic", engagement: "Engagement", messaging: "Messaging", app_installs: "App Installs" };

function IdeaCard({ entry }) {
  return (
    <Link to={`/idea/${entry.id}`} className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all group block">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{entry.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{entry.business_name}</p>
        </div>
        {entry.is_favorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 ml-2" />}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {entry.goal && <Badge variant="secondary" className="text-xs"><Target className="w-3 h-3 mr-1" />{GOAL_LABELS[entry.goal] || entry.goal}</Badge>}
        {entry.recommended_objective && <Badge className="text-xs bg-primary/10 text-primary border-0">AI: {entry.recommended_objective}</Badge>}
        {entry.was_overage_charge && <Badge variant="secondary" className="text-xs text-amber-600">Overage</Badge>}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{entry.budget || "N/A"}</div>
        <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{entry.created_date ? format(new Date(entry.created_date), "MMM d") : "—"}</div>
      </div>
    </Link>
  );
}

export default function SavedIdeas() {
  const [search, setSearch] = useState("");
  const [goalFilter, setGoalFilter] = useState("all");
  const [favOnly, setFavOnly] = useState(false);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["adIdeaEntries"],
    queryFn: () => base44.entities.AdIdeaEntry.list("-created_date", 100),
  });

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.business_name?.toLowerCase().includes(search.toLowerCase());
      const matchGoal = goalFilter === "all" || e.goal === goalFilter;
      const matchFav = !favOnly || e.is_favorite;
      return matchSearch && matchGoal && matchFav;
    });
  }, [entries, search, goalFilter, favOnly]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Saved Ad Ideas</h1>
          <p className="text-muted-foreground text-sm mt-1">{entries.length} total {entries.length === 1 ? 'entry' : 'entries'}</p>
        </div>
        <Link to="/new-idea"><Button><Target className="w-4 h-4 mr-2" />New Idea</Button></Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search entries..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={goalFilter} onValueChange={setGoalFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Goals</SelectItem>
            {Object.entries(GOAL_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant={favOnly ? "default" : "outline"} size="sm" onClick={() => setFavOnly(!favOnly)}>
          <Star className={`w-4 h-4 mr-1 ${favOnly ? "fill-white" : ""}`} />Favorites
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse h-36" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">No entries found</h3>
          <p className="text-sm text-muted-foreground mb-5">{entries.length === 0 ? "Generate your first ad idea to get started." : "Try adjusting your filters."}</p>
          {entries.length === 0 && <Link to="/new-idea"><Button>Generate Ad Idea</Button></Link>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(e => <IdeaCard key={e.id} entry={e} />)}
        </div>
      )}
    </div>
  );
}