import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const industries = [
  "Real Estate", "Healthcare", "Legal", "Finance", "E-commerce", "SaaS", 
  "Restaurant", "Fitness", "Beauty", "Education", "Marketing", "Construction",
  "Automotive", "Home Services", "Travel", "Retail", "Other"
];

const businessTypes = [
  { value: "product", label: "Product-based" },
  { value: "service", label: "Service-based" },
  { value: "saas", label: "SaaS / Software" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "agency", label: "Agency" },
  { value: "coaching", label: "Coaching / Consulting" },
  { value: "restaurant", label: "Restaurant / Food" },
  { value: "healthcare", label: "Healthcare" },
  { value: "real_estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

export default function FormStepBusiness({ form, update }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Campaign Name *</Label>
        <Input
          placeholder="e.g. Spring Lead Gen Campaign"
          value={form.campaign_name}
          onChange={(e) => update("campaign_name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Business Name *</Label>
        <Input
          placeholder="Your business name"
          value={form.business_name}
          onChange={(e) => update("business_name", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select value={form.industry} onValueChange={(v) => update("industry", v)}>
            <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
            <SelectContent>
              {industries.map((i) => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Business Type</Label>
          <Select value={form.business_type} onValueChange={(v) => update("business_type", v)}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {businessTypes.map((b) => (
                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Local or Online</Label>
          <Select value={form.local_or_online} onValueChange={(v) => update("local_or_online", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Offer Type</Label>
          <Input
            placeholder="e.g. Free consultation, 20% off"
            value={form.offer_type}
            onChange={(e) => update("offer_type", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}