import React, { useState } from "react";
import { Calendar, Loader2, RefreshCw, Copy, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const CHANNELS = [
  { id: "meta", label: "Meta (Facebook/Instagram)", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "google", label: "Google Ads", color: "bg-green-100 text-green-700 border-green-200" },
  { id: "instagram", label: "Instagram Organic", color: "bg-pink-100 text-pink-700 border-pink-200" },
  { id: "facebook", label: "Facebook Organic", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "email", label: "Email Marketing", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "tiktok", label: "TikTok", color: "bg-rose-100 text-rose-700 border-rose-200" },
];

const OBJECTIVES = ["Lead Generation", "Brand Awareness", "Sales / Conversions", "Engagement", "Traffic", "Retention"];
const HOURS_OPTIONS = ["1–2 hrs/week", "3–5 hrs/week", "5–10 hrs/week", "10+ hrs/week"];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const channelColorMap = {
  meta: "bg-blue-100 text-blue-700",
  google: "bg-green-100 text-green-700",
  instagram: "bg-pink-100 text-pink-700",
  facebook: "bg-blue-100 text-blue-600",
  email: "bg-amber-100 text-amber-700",
  tiktok: "bg-rose-100 text-rose-700",
  general: "bg-secondary text-secondary-foreground",
};

function DayCard({ day, posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-secondary/30 rounded-lg p-3 min-h-[80px]">
        <p className="text-xs font-bold text-muted-foreground mb-2">{day}</p>
        <p className="text-xs text-muted-foreground italic">Rest day</p>
      </div>
    );
  }
  return (
    <div className="bg-card border border-border rounded-lg p-3 min-h-[80px]">
      <p className="text-xs font-bold text-muted-foreground mb-2">{day}</p>
      <div className="space-y-1.5">
        {posts.map((post, i) => (
          <div key={i} className="space-y-0.5">
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${channelColorMap[post.channel] || channelColorMap.general}`}>
              {post.channel}
            </span>
            <p className="text-xs text-foreground leading-snug">{post.idea}</p>
            {post.format && <p className="text-xs text-muted-foreground">{post.format}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekView({ week, weekNumber }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">{weekNumber}</span>
        Week {weekNumber} — {week.theme}
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {DAY_LABELS.map(day => (
          <DayCard key={day} day={day} posts={week.days?.[day] || []} />
        ))}
      </div>
      {week.tips && (
        <div className="mt-2 bg-secondary/40 rounded-lg p-3">
          <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Pro tip:</span> {week.tips}</p>
        </div>
      )}
    </div>
  );
}

export default function ContentCalendar() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedChannels, setSelectedChannels] = useState(["meta", "instagram"]);
  const [selectedObjectives, setSelectedObjectives] = useState(["Lead Generation"]);
  const [hoursPerWeek, setHoursPerWeek] = useState("3–5 hrs/week");
  const [form, setForm] = useState({
    businessName: "",
    industry: "",
    offer: "",
    audience: "",
  });

  const toggleItem = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleGenerate = async () => {
    if (!form.businessName || selectedChannels.length === 0) {
      toast({ title: "Fill in business name and select at least one channel." });
      return;
    }
    setLoading(true);
    setCalendar(null);

    try {
      const prompt = `You are an expert content strategist. Create a detailed 4-week content calendar for this business.

Business: ${form.businessName}
Industry: ${form.industry || "general"}
Offer: ${form.offer || "products/services"}
Target Audience: ${form.audience || "general audience"}
Marketing Channels: ${selectedChannels.join(", ")}
Primary Objectives: ${selectedObjectives.join(", ")}
Weekly Time Available: ${hoursPerWeek}

Rules:
- Generate exactly 4 weeks
- Each week has a different theme/focus
- For each week, assign posts to each day (Mon–Sun)
- Only assign posts on days that make sense for the time budget
- Each post has: channel (one of: ${selectedChannels.join(", ")}), idea (short punchy content idea, under 15 words), format (e.g. "Carousel", "Reel", "Story", "Single Image", "Email", "Search Ad")
- Rest days should have no posts
- Include a concise weekly "tips" tip
- Distribute channels based on priority and time budget
- Make ideas specific to the business and audience

Return ONLY valid JSON:
{
  "weeks": [
    {
      "theme": "string",
      "tips": "string",
      "days": {
        "Mon": [ { "channel": "...", "idea": "...", "format": "..." } ],
        "Tue": [],
        "Wed": [ ... ],
        "Thu": [],
        "Fri": [ ... ],
        "Sat": [],
        "Sun": []
      }
    }
  ],
  "frequencySchedule": "string summarizing posting frequency per channel",
  "overallStrategy": "string, 2 sentences"
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            weeks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  theme: { type: "string" },
                  tips: { type: "string" },
                  days: { type: "object" }
                }
              }
            },
            frequencySchedule: { type: "string" },
            overallStrategy: { type: "string" }
          }
        }
      });

      setCalendar(result);
      setSelectedWeek(0);
      toast({ title: "4-week calendar generated!" });
    } catch (err) {
      toast({ title: "Generation failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!calendar) return;
    const rows = [["Week", "Theme", "Day", "Channel", "Idea", "Format"]];
    calendar.weeks.forEach((week, wi) => {
      DAY_LABELS.forEach(day => {
        const posts = week.days?.[day] || [];
        if (posts.length === 0) {
          rows.push([wi + 1, week.theme, day, "—", "Rest day", "—"]);
        } else {
          posts.forEach(p => {
            rows.push([wi + 1, week.theme, day, p.channel, p.idea, p.format]);
          });
        }
      });
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-calendar-${form.businessName.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyWeek = () => {
    if (!calendar) return;
    const week = calendar.weeks[selectedWeek];
    const text = DAY_LABELS.map(day => {
      const posts = week.days?.[day] || [];
      if (!posts.length) return `${day}: Rest`;
      return `${day}:\n${posts.map(p => `  [${p.channel}] ${p.idea} (${p.format})`).join("\n")}`;
    }).join("\n");
    navigator.clipboard.writeText(`Week ${selectedWeek + 1}: ${week.theme}\n\n${text}`);
    toast({ title: "Week copied to clipboard!" });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" /> Content Calendar
        </h1>
        <p className="text-muted-foreground text-sm mt-1">AI-generated 4-week content plan tailored to your channels, goals, and time availability.</p>
      </div>

      {/* Config */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        {/* Business */}
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
            <label className="text-xs text-muted-foreground mb-1 block">Industry</label>
            <Input
              placeholder="e.g. Home Services, Fitness"
              value={form.industry}
              onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Offer / Product</label>
            <Input
              placeholder="e.g. Personal training packages"
              value={form.offer}
              onChange={e => setForm(f => ({ ...f, offer: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Target Audience</label>
            <Input
              placeholder="e.g. Homeowners aged 30–55"
              value={form.audience}
              onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
            />
          </div>
        </div>

        {/* Channels */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Marketing Channels *</label>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map(c => (
              <button
                key={c.id}
                onClick={() => toggleItem(selectedChannels, setSelectedChannels, c.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  selectedChannels.includes(c.id)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Objectives */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Primary Objectives</label>
          <div className="flex flex-wrap gap-2">
            {OBJECTIVES.map(o => (
              <button
                key={o}
                onClick={() => toggleItem(selectedObjectives, setSelectedObjectives, o)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  selectedObjectives.includes(o)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Time + Generate */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Weekly time:</span>
            {HOURS_OPTIONS.map(h => (
              <button
                key={h}
                onClick={() => setHoursPerWeek(h)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  hoursPerWeek === h
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <Button onClick={handleGenerate} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
            {loading ? "Generating calendar..." : "Generate 4-Week Calendar"}
          </Button>
        </div>
      </div>

      {/* Results */}
      {calendar && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-foreground">Strategy Overview</h2>
            <p className="text-sm text-muted-foreground">{calendar.overallStrategy}</p>
            {calendar.frequencySchedule && (
              <div className="bg-secondary/40 rounded-lg p-3">
                <p className="text-xs font-semibold text-foreground mb-1">Frequency Schedule</p>
                <p className="text-xs text-muted-foreground">{calendar.frequencySchedule}</p>
              </div>
            )}
          </div>

          {/* Week Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {calendar.weeks.map((w, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedWeek(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    selectedWeek === i
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Week {i + 1}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyWeek} className="gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Copy Week
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={handleGenerate} className="gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </Button>
            </div>
          </div>

          {/* Week View */}
          {calendar.weeks[selectedWeek] && (
            <WeekView week={calendar.weeks[selectedWeek]} weekNumber={selectedWeek + 1} />
          )}
        </div>
      )}
    </div>
  );
}