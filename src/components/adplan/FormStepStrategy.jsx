import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const goals = [
  { value: "leads", label: "Lead Generation", desc: "Get inquiries, sign-ups, form fills" },
  { value: "sales", label: "Sales / Conversions", desc: "Drive purchases or high-value actions" },
  { value: "awareness", label: "Brand Awareness", desc: "Reach new people, build recognition" },
  { value: "traffic", label: "Website Traffic", desc: "Drive clicks to your website" },
  { value: "engagement", label: "Engagement", desc: "Get likes, comments, shares" },
  { value: "messaging", label: "Messaging", desc: "Start conversations via DMs" },
  { value: "app_installs", label: "App Installs", desc: "Drive mobile app downloads" },
];

export default function FormStepStrategy({ form, update }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Main Goal *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {goals.map((g) => (
            <button
              key={g.value}
              onClick={() => update("goal", g.value)}
              className={`text-left p-3 rounded-lg border transition-all ${
                form.goal === g.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <p className="text-sm font-medium text-foreground">{g.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{g.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Monthly Budget</Label>
          <Input
            placeholder="e.g. $500, $2000"
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Lead Form or Website</Label>
          <Select value={form.lead_form_or_website} onValueChange={(v) => update("lead_form_or_website", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="lead_form">Lead Form (on Facebook)</SelectItem>
              <SelectItem value="website">Website Conversion</SelectItem>
              <SelectItem value="both">Both</SelectItem>
              <SelectItem value="unsure">Not Sure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Landing Page URL</Label>
        <Input
          placeholder="https://your-website.com/landing"
          value={form.landing_page_url}
          onChange={(e) => update("landing_page_url", e.target.value)}
        />
      </div>
    </div>
  );
}