import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Save, Loader2, Info, Key, Zap } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["apiSettings"],
    queryFn: async () => {
      const user = await base44.auth.me();
      const all = await base44.entities.ApiSetting.filter({ created_by: user.email });
      return all[0] || null;
    },
  });

  const [form, setForm] = useState({
    provider_name: "openrouter",
    api_key: "",
    model_name: "",
    use_free_router: true,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        provider_name: settings.provider_name || "openrouter",
        api_key: settings.api_key || "",
        model_name: settings.model_name || "",
        use_free_router: settings.use_free_router !== false,
      });
    }
  }, [settings]);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settings?.id) {
        await base44.entities.ApiSetting.update(settings.id, form);
      } else {
        await base44.entities.ApiSetting.create(form);
      }
      queryClient.invalidateQueries({ queryKey: ["apiSettings"] });
      toast({ title: "Settings saved" });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your AI provider and API keys</p>
      </div>

      {/* AI Provider Settings */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">AI Provider</h2>
        </div>

        <div className="space-y-2">
          <Label>Provider</Label>
          <Select value={form.provider_name} onValueChange={(v) => setForm({ ...form, provider_name: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="openrouter">OpenRouter</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>API Key</Label>
          <Input
            type="password"
            placeholder={`Enter your ${form.provider_name === "openrouter" ? "OpenRouter" : form.provider_name === "openai" ? "OpenAI" : "Anthropic"} API key`}
            value={form.api_key}
            onChange={(e) => setForm({ ...form, api_key: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            {form.provider_name === "openrouter" && "Get your key at openrouter.ai/keys"}
            {form.provider_name === "openai" && "Get your key at platform.openai.com/api-keys"}
            {form.provider_name === "anthropic" && "Get your key at console.anthropic.com"}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Model Name (optional)</Label>
          <Input
            placeholder={
              form.provider_name === "openrouter"
                ? "e.g. google/gemini-2.0-flash-001"
                : form.provider_name === "openai"
                ? "e.g. gpt-4o-mini"
                : "e.g. claude-sonnet-4-20250514"
            }
            value={form.model_name}
            onChange={(e) => setForm({ ...form, model_name: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Leave blank to use the default model for your provider.
          </p>
        </div>

        {form.provider_name === "openrouter" && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div>
              <p className="text-sm font-medium text-foreground">Use Free Models</p>
              <p className="text-xs text-muted-foreground">Free models may be slower and vary in quality</p>
            </div>
            <Switch
              checked={form.use_free_router}
              onCheckedChange={(v) => setForm({ ...form, use_free_router: v })}
            />
          </div>
        )}

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      {/* Info about no API key */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">No API key? No problem.</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you don't set an API key, the app will use its built-in AI to generate strategies.
              For better results and faster responses, we recommend setting up an OpenRouter account with a paid model.
            </p>
          </div>
        </div>
      </div>

      {/* Future Meta Integration */}
      <div className="bg-card rounded-xl border border-border p-6 opacity-60">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">Meta Marketing API (Coming Soon)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect your Meta ad account to pull real campaign data, compare objectives by cost per result, and create campaign drafts directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}