import React, { useState } from "react";
import { Sparkles, Wand2, Save, RefreshCw, Loader2, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ASPECT_RATIOS = [
  { id: "1:1", label: "Feed 1:1", dims: "1080×1080", platform: "Meta", promptNote: "square format, suitable for Facebook and Instagram feed" },
  { id: "4:5", label: "Feed 4:5", dims: "1080×1350", platform: "Meta", promptNote: "portrait format, Facebook and Instagram feed" },
  { id: "9:16", label: "Story / Reels", dims: "1080×1920", platform: "Meta", promptNote: "vertical full-screen story or Reels format" },
  { id: "1.91:1", label: "Landscape", dims: "1200×628", platform: "Meta", promptNote: "landscape format, Facebook link preview" },
  { id: "16:9", label: "YouTube / Display", dims: "1280×720", platform: "Google", promptNote: "widescreen YouTube or Google Display banner" },
  { id: "300:250", label: "Rectangle", dims: "300×250", platform: "Google", promptNote: "Google Display rectangle banner" },
];

const VISUAL_STYLES = [
  {
    id: "lifestyle",
    label: "Lifestyle",
    desc: "Real people using the product/service in natural settings",
    promptTemplate: (copy, business) => `Lifestyle advertising photography for ${business}. ${copy}. Real people in authentic everyday settings, warm natural lighting, editorial style, aspirational but relatable, cinematic composition, professional photography quality. No text overlay.`,
  },
  {
    id: "product",
    label: "Product-Focused",
    desc: "Clean product shot with minimal background",
    promptTemplate: (copy, business) => `Clean product-focused commercial photography for ${business}. ${copy}. Minimal white or gradient background, professional studio lighting, sharp detail, premium feel, hero product shot, advertising quality. No text overlay.`,
  },
  {
    id: "graphic",
    label: "Graphic Overlay",
    desc: "Bold graphic design with space for text and CTA",
    promptTemplate: (copy, business) => `Bold graphic advertisement design for ${business}. ${copy}. Modern graphic design, strong color contrast, geometric elements, space reserved for text overlay at bottom third, professional advertising layout, high visual impact. Brand-appropriate color palette.`,
  },
  {
    id: "abstract",
    label: "Abstract / Brand",
    desc: "Abstract visuals that evoke emotion and brand feeling",
    promptTemplate: (copy, business) => `Abstract brand-focused advertising visual for ${business}. ${copy}. Artistic, evocative composition, strong mood and atmosphere, cinematic color grading, no people required, conceptual advertising imagery, professional quality.`,
  },
];

function SuggestionRow({ suggestion, onUse }) {
  return (
    <div className="flex items-start justify-between gap-3 p-3 bg-secondary/40 rounded-lg border border-border">
      <p className="text-sm text-foreground flex-1">{suggestion}</p>
      <Button variant="outline" size="sm" className="shrink-0 text-xs h-7" onClick={() => onUse(suggestion)}>
        Use
      </Button>
    </div>
  );
}

function GeneratedImageCard({ image, onSave, saving }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="relative aspect-square bg-secondary">
        <img src={image.url} alt={image.style} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className="text-xs">{image.style}</Badge>
          <Badge variant="outline" className="text-xs bg-black/40 text-white border-white/20">{image.ratio}</Badge>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-xs text-muted-foreground line-clamp-2">{image.promptUsed}</p>
        <Button
          size="sm"
          className="w-full gap-1.5"
          onClick={() => onSave(image)}
          disabled={saving || image.saved}
        >
          {image.saved ? (
            <><Save className="w-3.5 h-3.5" /> Saved to Assets</>
          ) : saving ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-3.5 h-3.5" /> Save to Assets</>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function AIImageGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const [adCopy, setAdCopy] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [selectedStyles, setSelectedStyles] = useState(["lifestyle", "product"]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [savingId, setSavingId] = useState(null);

  const ratio = ASPECT_RATIOS.find(r => r.id === selectedRatio);

  const toggleStyle = (id) => {
    setSelectedStyles(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGetSuggestions = async () => {
    if (!adCopy && !businessName) {
      toast({ title: "Enter your ad copy or business name first." });
      return;
    }
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert ad creative director. Based on the following, suggest 5 specific, vivid visual concepts for an ad image.

Business: ${businessName || "the business"}
Ad Copy: ${adCopy || "N/A"}
Platform Format: ${ratio?.label} (${ratio?.dims})

Rules:
- Each suggestion should be a specific, detailed visual scene or concept (1-2 sentences)
- Focus on what would look great as an ad image
- Be specific about setting, mood, lighting, and subject
- Vary across: lifestyle, product, graphic, conceptual approaches

Return ONLY valid JSON: { "suggestions": ["...", "...", "...", "...", "..."] }`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: { type: "array", items: { type: "string" } }
          }
        }
      });
      setSuggestions(result.suggestions || []);
      setShowSuggestions(true);
    } catch (err) {
      toast({ title: "Failed to get suggestions", description: err.message });
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleGenerate = async () => {
    if (!adCopy && !businessName && !customPrompt) {
      toast({ title: "Enter ad copy or a custom prompt to generate images." });
      return;
    }
    if (selectedStyles.length === 0 && !useCustom) {
      toast({ title: "Select at least one visual style." });
      return;
    }

    setGenerating(true);
    const stylesToGenerate = useCustom
      ? [{ id: "custom", label: "Custom", promptTemplate: () => customPrompt }]
      : VISUAL_STYLES.filter(s => selectedStyles.includes(s.id));

    const newImages = [];
    try {
      await Promise.all(
        stylesToGenerate.map(async (style) => {
          const finalPrompt = style.promptTemplate(adCopy, businessName || "the business") +
            `. Aspect ratio: ${ratio?.promptNote || "standard"}.`;
          const result = await base44.integrations.Core.GenerateImage({ prompt: finalPrompt });
          newImages.push({
            url: result.url,
            style: style.label,
            ratio: selectedRatio,
            promptUsed: finalPrompt,
            saved: false,
            id: `${style.id}_${Date.now()}`,
          });
        })
      );
      setGeneratedImages(prev => [...newImages, ...prev]);
      toast({ title: `${newImages.length} image${newImages.length > 1 ? "s" : ""} generated!` });
    } catch (err) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (image) => {
    if (!user) return;
    setSavingId(image.id);
    try {
      // Fetch image as blob and upload
      const res = await fetch(image.url);
      const blob = await res.blob();
      const file = new File([blob], `ai-ad-${image.style.toLowerCase().replace(/\s+/g, "-")}-${image.ratio.replace(/:/g, "x")}.png`, { type: "image/png" });

      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.AdAsset.create({
        user_id: user.id,
        file_url,
        file_name: file.name,
        file_type: "image",
        platform: ratio?.platform?.toLowerCase() || "general",
        notes: `AI generated — ${image.style} style. Copy: "${adCopy.slice(0, 80)}"`,
        tags: ["ai-generated", image.style.toLowerCase(), image.ratio.replace(/:/g, "x")],
      });

      queryClient.invalidateQueries({ queryKey: ["adAssets"] });
      setGeneratedImages(prev => prev.map(img => img.id === image.id ? { ...img, saved: true } : img));
      toast({ title: "Saved to Ad Assets!" });
    } catch (err) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Config Panel */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground text-sm">AI Image Generator</h2>
          <Badge className="text-xs gap-1"><Sparkles className="w-3 h-3" /> Powered by AI</Badge>
        </div>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Business Name</label>
            <Input
              placeholder="e.g. City Plumbing Co."
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Ad Copy / Headline</label>
            <Input
              placeholder="e.g. Same-day plumbing — no call-out fee"
              value={adCopy}
              onChange={e => setAdCopy(e.target.value)}
            />
          </div>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Aspect Ratio</label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRatio(r.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  selectedRatio === r.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {r.label} <span className="opacity-60">{r.dims}</span>
                <span className={`ml-1 text-xs ${r.platform === "Meta" ? "text-blue-500" : "text-green-500"}`}>{r.platform}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Styles */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground">Visual Styles</label>
            <button
              onClick={() => setUseCustom(!useCustom)}
              className="text-xs text-primary hover:underline"
            >
              {useCustom ? "← Use style presets" : "Custom prompt →"}
            </button>
          </div>

          {useCustom ? (
            <textarea
              rows={3}
              placeholder="Describe exactly what you want the AI to generate..."
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground resize-none"
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {VISUAL_STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleStyle(s.id)}
                  className={`text-left p-3 rounded-xl border transition-colors ${
                    selectedStyles.includes(s.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedStyles.includes(s.id) ? "border-primary bg-primary" : "border-muted-foreground/40"
                    }`}>
                      {selectedStyles.includes(s.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <span className="text-sm font-medium text-foreground">{s.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">{s.desc}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI Suggestions */}
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm font-medium text-foreground"
            onClick={() => showSuggestions ? setShowSuggestions(false) : handleGetSuggestions()}
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              AI Visual Suggestions
              {loadingSuggestions && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
            </span>
            {showSuggestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <div className="p-3 space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Click "Use" to paste a suggestion as your custom prompt:</p>
              {suggestions.map((s, i) => (
                <SuggestionRow
                  key={i}
                  suggestion={s}
                  onUse={(val) => { setCustomPrompt(val); setUseCustom(true); setShowSuggestions(false); }}
                />
              ))}
              <Button variant="ghost" size="sm" onClick={handleGetSuggestions} className="gap-1.5 mt-1">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh suggestions
              </Button>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="flex items-center gap-3">
          <Button onClick={handleGenerate} disabled={generating} className="gap-2">
            {generating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              : <><Sparkles className="w-4 h-4" /> Generate {useCustom ? "1" : selectedStyles.length} Image{(!useCustom && selectedStyles.length > 1) ? "s" : ""}</>
            }
          </Button>
          {generating && (
            <p className="text-xs text-muted-foreground">This takes ~5–10 seconds per image…</p>
          )}
        </div>
      </div>

      {/* Results */}
      {generatedImages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground text-sm">{generatedImages.length} Generated Image{generatedImages.length > 1 ? "s" : ""}</h3>
            <Button variant="ghost" size="sm" onClick={() => setGeneratedImages([])} className="text-xs text-muted-foreground">
              Clear all
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedImages.map(img => (
              <GeneratedImageCard
                key={img.id}
                image={img}
                onSave={handleSave}
                saving={savingId === img.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}