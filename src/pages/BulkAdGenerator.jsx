import React, { useState } from "react";
import { Layers, Download, RefreshCw, Copy, ChevronDown, ChevronUp, Loader2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const ASPECT_RATIOS = [
  { id: "feed_1x1", label: "Feed 1:1", platform: "Meta", dims: "1080×1080", tag: "meta" },
  { id: "feed_4x5", label: "Feed 4:5", platform: "Meta", dims: "1080×1350", tag: "meta" },
  { id: "story_9x16", label: "Story 9:16", platform: "Meta", dims: "1080×1920", tag: "meta" },
  { id: "reels", label: "Reels", platform: "Meta", dims: "1080×1920", tag: "meta" },
  { id: "google_banner", label: "Leaderboard", platform: "Google", dims: "728×90", tag: "google" },
  { id: "google_rect", label: "Rectangle", platform: "Google", dims: "300×250", tag: "google" },
];

const TONES = ["Professional", "Casual", "Urgent", "Inspirational", "Humorous", "Bold"];
const ANGLES = ["Problem/Solution", "Social Proof", "Benefit-Led", "Fear of Missing Out", "Authority", "Curiosity", "Price/Value"];

const VARIATION_COUNTS = [5, 10, 20, 30];

function VariationCard({ variation, index, onCopy }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/30"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-muted-foreground w-6">#{index + 1}</span>
          <Badge variant="outline" className="text-xs shrink-0">{variation.ratio}</Badge>
          <Badge variant="outline" className="text-xs shrink-0">{variation.tone}</Badge>
          <span className="text-sm text-foreground truncate font-medium">{variation.headline}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={e => { e.stopPropagation(); onCopy(variation); }}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border bg-secondary/10">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Headline</p>
            <p className="text-sm font-semibold text-foreground">{variation.headline}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Primary Text</p>
            <p className="text-sm text-foreground">{variation.primaryText}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">CTA</p>
            <p className="text-sm font-medium text-primary">{variation.cta}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Creative Direction</p>
            <p className="text-sm text-muted-foreground italic">{variation.creativeNote}</p>
          </div>
          <div className="flex gap-2 pt-1">
            <span className="text-xs bg-secondary rounded px-2 py-0.5">{variation.ratio}</span>
            <span className="text-xs bg-secondary rounded px-2 py-0.5">{variation.dims}</span>
            <span className="text-xs bg-secondary rounded px-2 py-0.5">{variation.angle}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BulkAdGenerator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState([]);
  const [selectedRatios, setSelectedRatios] = useState(["feed_1x1", "story_9x16"]);
  const [selectedTones, setSelectedTones] = useState(["Professional", "Casual"]);
  const [selectedAngles, setSelectedAngles] = useState(["Problem/Solution", "Benefit-Led"]);
  const [count, setCount] = useState(20);
  const [form, setForm] = useState({
    businessName: "",
    offer: "",
    audience: "",
    goal: "leads",
  });

  const toggleItem = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleGenerate = async () => {
    if (!form.businessName || !form.offer) {
      toast({ title: "Missing fields", description: "Business name and offer are required." });
      return;
    }
    if (selectedRatios.length === 0) {
      toast({ title: "Select at least one aspect ratio." });
      return;
    }

    setLoading(true);
    setVariations([]);

    try {
      const ratioDetails = ASPECT_RATIOS.filter(r => selectedRatios.includes(r.id));

      const prompt = `You are an expert ad copywriter. Generate exactly ${count} unique ad variations for the following brief.

Business: ${form.businessName}
Offer: ${form.offer}
Audience: ${form.audience || "general audience"}
Goal: ${form.goal}
Tones to use (rotate through): ${selectedTones.join(", ")}
Ad angles to use (rotate through): ${selectedAngles.join(", ")}
Aspect ratios / formats to cover (rotate through): ${ratioDetails.map(r => `${r.label} (${r.dims})`).join(", ")}

Rules:
- Each variation must have a different combination of tone, angle, and format where possible
- Headlines must be punchy and under 40 characters
- Primary text under 125 characters
- CTA must be one of: Learn More, Get Started, Shop Now, Book Now, Claim Offer, Sign Up, Contact Us, Get Quote
- creativeNote is a brief sentence describing the visual concept for this format
- Distribute variations across all provided ratios and tones evenly

Return ONLY valid JSON: { "variations": [ { "headline": "...", "primaryText": "...", "cta": "...", "tone": "...", "angle": "...", "ratio": "...", "dims": "...", "creativeNote": "..." } ] }`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            variations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  headline: { type: "string" },
                  primaryText: { type: "string" },
                  cta: { type: "string" },
                  tone: { type: "string" },
                  angle: { type: "string" },
                  ratio: { type: "string" },
                  dims: { type: "string" },
                  creativeNote: { type: "string" }
                }
              }
            }
          }
        }
      });

      setVariations(result.variations || []);
      toast({ title: `Generated ${result.variations?.length || 0} variations!` });
    } catch (err) {
      toast({ title: "Generation failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyVariation = (v) => {
    const text = `Headline: ${v.headline}\nPrimary Text: ${v.primaryText}\nCTA: ${v.cta}\nFormat: ${v.ratio} (${v.dims})\nTone: ${v.tone}\nAngle: ${v.angle}\nCreative Note: ${v.creativeNote}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  const handleExportCSV = () => {
    if (!variations.length) return;
    const headers = ["#", "Headline", "Primary Text", "CTA", "Format", "Dimensions", "Tone", "Angle", "Creative Note"];
    const rows = variations.map((v, i) => [
      i + 1, v.headline, v.primaryText, v.cta, v.ratio, v.dims, v.tone, v.angle, v.creativeNote
    ].map(val => `"${String(val || "").replace(/"/g, '""')}"`));

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ad-variations-${form.businessName.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = () => {
    const text = variations.map((v, i) =>
      `--- Variation #${i + 1} (${v.ratio} | ${v.tone} | ${v.angle}) ---\nHeadline: ${v.headline}\nText: ${v.primaryText}\nCTA: ${v.cta}\nCreative: ${v.creativeNote}`
    ).join("\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "All variations copied!" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary" /> Bulk Ad Generator
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Generate 20+ ad variations across formats and angles at once. Export as CSV.</p>
      </div>

      {/* Config */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        {/* Business Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Business Name *</label>
            <Input
              placeholder="e.g. City Plumbing Co."
              value={form.businessName}
              onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Offer / Product *</label>
            <Input
              placeholder="e.g. Emergency plumbing repairs"
              value={form.offer}
              onChange={e => setForm(f => ({ ...f, offer: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Target Audience</label>
            <Input
              placeholder="e.g. homeowners aged 30–55"
              value={form.audience}
              onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Campaign Goal</label>
            <select
              value={form.goal}
              onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
              className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm"
            >
              {["leads", "sales", "awareness", "traffic", "engagement"].map(g => (
                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Aspect Ratios */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Aspect Ratios / Formats</label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map(r => (
              <button
                key={r.id}
                onClick={() => toggleItem(selectedRatios, setSelectedRatios, r.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  selectedRatios.includes(r.id)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {r.label} <span className="opacity-60">{r.dims}</span>
                <span className="ml-1 opacity-50">{r.platform}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tones */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Tones</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button
                key={t}
                onClick={() => toggleItem(selectedTones, setSelectedTones, t)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  selectedTones.includes(t)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Angles */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Ad Angles</label>
          <div className="flex flex-wrap gap-2">
            {ANGLES.map(a => (
              <button
                key={a}
                onClick={() => toggleItem(selectedAngles, setSelectedAngles, a)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  selectedAngles.includes(a)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Count + Generate */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Variations:</span>
            {VARIATION_COUNTS.map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                  count === n
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <Button onClick={handleGenerate} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            {loading ? "Generating..." : `Generate ${count} Variations`}
          </Button>
        </div>
      </div>

      {/* Results */}
      {variations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{variations.length} variations generated</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyAll} className="gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Copy All
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5">
                <FileDown className="w-3.5 h-3.5" /> Export CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={handleGenerate} className="gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {variations.map((v, i) => (
              <VariationCard key={i} variation={v} index={i} onCopy={handleCopyVariation} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}