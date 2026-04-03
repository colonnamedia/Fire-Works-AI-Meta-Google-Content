import React from "react";
import { FileText, TrendingUp, Star } from "lucide-react";

export default function StatsRow({ total, generated, favorites }) {
  const stats = [
    { label: "Total Plans", value: total, icon: FileText, color: "text-foreground" },
    { label: "Generated", value: generated, icon: TrendingUp, color: "text-primary" },
    { label: "Favorites", value: favorites, icon: Star, color: "text-amber-500" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card rounded-xl border border-border p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <s.icon className={`w-4 h-4 ${s.color}`} />
            <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{s.value}</p>
        </div>
      ))}
    </div>
  );
}