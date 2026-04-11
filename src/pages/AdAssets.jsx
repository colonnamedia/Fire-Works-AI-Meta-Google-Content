import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, Image, Video, File, Tag, X, Plus, Filter, Sparkles } from "lucide-react";
import AIImageGenerator from "@/components/assets/AIImageGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const PLATFORM_FILTERS = [
  { value: "all", label: "All" },
  { value: "meta", label: "Meta" },
  { value: "google", label: "Google" },
  { value: "both", label: "Both" },
  { value: "general", label: "General" },
];

function AssetCard({ asset, onDelete }) {
  const isImage = asset.file_type === "image";
  const isVideo = asset.file_type === "video";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all">
      {/* Preview */}
      <div className="relative aspect-video bg-secondary flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img src={asset.file_url} alt={asset.file_name} className="w-full h-full object-cover" />
        ) : isVideo ? (
          <video src={asset.file_url} className="w-full h-full object-cover" muted />
        ) : (
          <File className="w-10 h-10 text-muted-foreground" />
        )}
        <button
          onClick={() => onDelete(asset.id)}
          className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <div className="absolute bottom-2 left-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            asset.platform === "meta" ? "bg-blue-100 text-blue-700" :
            asset.platform === "google" ? "bg-green-100 text-green-700" :
            asset.platform === "both" ? "bg-primary/10 text-primary" :
            "bg-secondary text-muted-foreground"
          }`}>{asset.platform}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-foreground truncate">{asset.file_name}</p>
        {asset.notes && <p className="text-xs text-muted-foreground mt-0.5 truncate">{asset.notes}</p>}
        {asset.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.map(t => (
              <span key={t} className="text-xs bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const TABS = ["My Assets", "AI Generate"];

export default function AdAssets() {
  const [activeTab, setActiveTab] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [form, setForm] = useState({ platform: "general", notes: "", tags: "" });

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["adAssets"],
    queryFn: () => base44.entities.AdAsset.list("-created_date", 100),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AdAsset.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adAssets"] });
      toast({ title: "Asset deleted" });
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setShowUploadForm(true);
  };

  const handleUpload = async () => {
    if (!pendingFile || !user) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: pendingFile });
      const fileType = pendingFile.type.startsWith("video") ? "video" : pendingFile.type.startsWith("image") ? "image" : "other";
      const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);

      await base44.entities.AdAsset.create({
        user_id: user.id,
        file_url,
        file_name: pendingFile.name,
        file_type: fileType,
        platform: form.platform,
        notes: form.notes,
        tags,
      });

      queryClient.invalidateQueries({ queryKey: ["adAssets"] });
      toast({ title: "Asset uploaded!" });
      setPendingFile(null);
      setShowUploadForm(false);
      setForm({ platform: "general", notes: "", tags: "" });
      fileInputRef.current.value = "";
    } catch (err) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const filtered = platformFilter === "all" ? assets : assets.filter(a => a.platform === platformFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ad Assets</h1>
          <p className="text-muted-foreground text-sm mt-1">Upload and organize your ad images and videos, or generate visuals with AI.</p>
        </div>
        {activeTab === 0 && (
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" /> Upload Asset
          </Button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {i === 1 && <Sparkles className="w-3.5 h-3.5" />}
            {t}
          </button>
        ))}
      </div>

      {activeTab === 1 && <AIImageGenerator />}

      {activeTab === 0 && (<>
      {/* Upload Form */}
      {showUploadForm && pendingFile && (
        <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-foreground">Uploading: {pendingFile.name}</p>
            <button onClick={() => { setShowUploadForm(false); setPendingFile(null); fileInputRef.current.value = ""; }}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Platform</label>
              <select
                value={form.platform}
                onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="general">General</option>
                <option value="meta">Meta</option>
                <option value="google">Google</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
              <Input placeholder="e.g. Summer promo hero image" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags (comma separated)</label>
              <Input placeholder="e.g. summer, promo, video" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
          </div>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : <><Plus className="w-4 h-4 mr-2" />Save Asset</>}
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {PLATFORM_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setPlatformFilter(f.value)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              platformFilter === f.value ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} asset{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
          <Image className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-1">No assets yet</p>
          <p className="text-sm text-muted-foreground mb-5">Upload images or videos to reference when building your ad strategies.</p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Upload First Asset
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(asset => (
            <AssetCard key={asset.id} asset={asset} onDelete={(id) => deleteMutation.mutate(id)} />
          ))}
        </div>
      )}
      </>)}
    </div>
  );
}