import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FormStepCreative({ form, update }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Preferred Creative Type</Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { value: "image", label: "Image" },
            { value: "video", label: "Video" },
            { value: "carousel", label: "Carousel" },
            { value: "mixed", label: "Mixed" },
            { value: "unsure", label: "Not Sure" },
          ].map((c) => (
            <button
              key={c.value}
              onClick={() => update("creative_preference", c.value)}
              className={`p-3 rounded-lg border text-center transition-all ${
                form.creative_preference === c.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <p className="text-sm font-medium text-foreground">{c.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tone of Voice</Label>
          <Select value={form.tone_of_voice} onValueChange={(v) => update("tone_of_voice", v)}>
            <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly & Casual</SelectItem>
              <SelectItem value="urgent">Urgent & Direct</SelectItem>
              <SelectItem value="luxury">Premium & Luxury</SelectItem>
              <SelectItem value="fun">Fun & Playful</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="empathetic">Empathetic & Caring</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>CTA Preference</Label>
          <Input
            placeholder="e.g. Book Now, Learn More, Get Quote"
            value={form.cta_preference}
            onChange={(e) => update("cta_preference", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Special Notes</Label>
        <Textarea
          placeholder="Anything else the AI should know about your business, offer, or past ad experience..."
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}