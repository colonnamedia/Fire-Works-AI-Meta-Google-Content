import React from "react";
import { Facebook, Search, Layers } from "lucide-react";
import { Label } from "@/components/ui/label";

const platforms = [
  {
    value: "meta",
    label: "Meta Ads",
    sub: "Facebook & Instagram",
    icon: Facebook,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    value: "google",
    label: "Google Ads",
    sub: "Search, Display & YouTube",
    icon: Search,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
  },
  {
    value: "both",
    label: "Both Platforms",
    sub: "Meta + Google (requires $8.99 plan)",
    icon: Layers,
    color: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
  },
];

export default function PlatformSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label>Ad Platform *</Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {platforms.map((p) => {
          const selected = value === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(p.value)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                selected
                  ? `${p.bg} ${p.border} ring-2 ring-offset-1 ${p.value === "both" ? "ring-primary" : p.value === "meta" ? "ring-blue-400" : "ring-green-400"}`
                  : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <p.icon className={`w-5 h-5 mb-2 ${selected ? p.color : "text-muted-foreground"}`} />
              <p className={`text-sm font-semibold ${selected ? "text-foreground" : "text-muted-foreground"}`}>{p.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{p.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}