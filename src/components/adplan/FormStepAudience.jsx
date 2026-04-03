import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FormStepAudience({ form, update }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Geographic Targeting</Label>
        <Input
          placeholder="e.g. New York City, United States, Global"
          value={form.geographic_targeting}
          onChange={(e) => update("geographic_targeting", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Audience Description</Label>
        <Textarea
          placeholder="Describe your ideal customer (age, interests, profession, pain points...)"
          value={form.audience_description}
          onChange={(e) => update("audience_description", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Traffic Temperature</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { value: "cold", label: "Cold", desc: "New audience" },
            { value: "warm", label: "Warm", desc: "Engaged before" },
            { value: "hot", label: "Hot", desc: "Ready to buy" },
            { value: "mixed", label: "Mixed", desc: "All types" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => update("traffic_temperature", t.value)}
              className={`p-3 rounded-lg border text-center transition-all ${
                form.traffic_temperature === t.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <p className="text-sm font-medium text-foreground">{t.label}</p>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}