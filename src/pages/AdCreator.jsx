import { useState } from "react";
import { base44 } from "@/api/base44Client";

const PLATFORMS = {
  google: {
    label: "Google Ads",
    icon: "🔍",
    limits: { headline: 30, description: 90, cta: 15 },
    count: { headline: 5, description: 3, cta: 4 },
  },
  meta: {
    label: "Meta Ads",
    icon: "📘",
    limits: { primaryText: 125, headline: 40, description: 30, cta: 20 },
    count: { primaryText: 3, headline: 5, description: 3, cta: 4 },
  },
};

function CharBadge({ text, limit }) {
  const over = text.length > limit;
  return (
    <span style={{ fontSize: 10, fontFamily: "monospace", padding: "2px 6px", borderRadius: 4, background: over ? "#ff6b6b22" : "#00e5a022", color: over ? "#ff6b6b" : "#00e5a0", marginLeft: 8 }}>
      {text.length}/{limit}
    </span>
  );
}

function AdCard({ label, items, limit }) {
  const [copied, setCopied] = useState(null);
  const copy = (text, i) => { navigator.clipboard.writeText(text); setCopied(i); setTimeout(() => setCopied(null), 1500); };
  return (
    <div style={{ background: "#12151c", border: "1px solid #232a38", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7897", marginBottom: 4 }}>{label}</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 12px", background: "#0a0c10", borderRadius: 8, border: "1px solid #1a1f2b" }}>
          <div style={{ flex: 1 }}><span style={{ fontSize: 13 }}>{item}</span><CharBadge text={item} limit={limit} /></div>
          <button onClick={() => copy(item, i)} style={{ background: "transparent", border: "1px solid #232a38", borderRadius: 6, color: "#6b7897", fontSize: 11, padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap" }}>
            {copied === i ? "✓" : "Copy"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdCreator() {
  const [platform, setPlatform] = useState("google");
  const [form, setForm] = useState({ businessName: "", product: "", audience: "", usp: "", tone: "Professional", goal: "Drive conversions" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function generate() {
    if (!form.businessName || !form.product || !form.audience || !form.usp) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true); setResults(null);
    try {
      const res = await base44.functions.invoke("generateAdCreatives", { platform, formData: form });
      setResults(res.data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  const p = PLATFORMS[platform];
  return (
    <div style={{ background: "#0a0c10", color: "#e8ecf4", fontFamily: "sans-serif", minHeight: "100vh", padding: "32px 24px 80px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ fontWeight: 800, fontSize: 20 }}>⚡ Ad Creative Generator</div>
        <div style={{ fontSize: 11, fontFamily: "monospace", color: "#00e5a0", border: "1px solid #00e5a033", padding: "4px 10px", borderRadius: 100 }}>Powered by Claude AI</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        {Object.entries(PLATFORMS).map(([key, val]) => (
          <button key={key} onClick={() => { setPlatform(key); setResults(null); }}
            style={{ flex: 1, padding: "12px 0", border: platform === key ? "1px solid #00e5a0" : "1px solid #232a38", borderRadius: 10, background: platform === key ? "#00e5a011" : "#12151c", color: platform === key ? "#00e5a0" : "#6b7897", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
            {val.icon} {val.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
        {[{ key: "businessName", label: "Business Name", ph: "e.g. Acme Agency" }, { key: "product", label: "Product / Service", ph: "e.g. SEO audit tool" }, { key: "audience", label: "Target Audience", ph: "e.g. Small business owners 30–55" }, { key: "usp", label: "Key Benefit / USP", ph: "e.g. Get more traffic in 30 days" }].map(f => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#6b7897", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.label}</label>
            <input value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.ph} style={{ background: "#12151c", border: "1.5px solid #232a38", borderRadius: 10, padding: "12px 16px", color: "#e8ecf4", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[{ key: "tone", label: "Tone", opts: ["Professional","Friendly","Urgent","Playful","Luxury","Bold","Conversational"] }, { key: "goal", label: "Campaign Goal", opts: ["Drive conversions","Generate leads","Increase brand awareness","Drive website traffic","Promote an offer","App installs"] }].map(f => (
            <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#6b7897", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.label}</label>
              <select value={form[f.key]} onChange={e => set(f.key, e.target.value)} style={{ background: "#12151c", border: "1.5px solid #232a38", borderRadius: 10, padding: "12px 16px", color: "#e8ecf4", fontSize: 14, outline: "none" }}>
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        {error && <div style={{ color: "#ff6b6b", fontSize: 13, fontFamily: "monospace" }}>{error}</div>}
        <button onClick={generate} disabled={loading} style={{ background: "#00e5a0", color: "#000", border: "none", borderRadius: 10, padding: 14, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          {loading ? "Generating..." : `Generate ${p.label} Copy`}
        </button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 20, background: "#12151c", border: "1px solid #00e5a033", borderRadius: 12, marginBottom: 24 }}>
          <div style={{ width: 18, height: 18, border: "2px solid #232a38", borderTopColor: "#00e5a0", borderRadius: "50%" }} />
          <span style={{ color: "#00e5a0", fontFamily: "monospace", fontSize: 13 }}>Claude is writing your ads...</span>
        </div>
      )}

      {results && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>✅ Your {p.label} Creatives</div>
          {results.headlines && <AdCard label="Headlines" items={results.headlines} limit={p.limits.headline} />}
          {results.primaryTexts && <AdCard label="Primary Text" items={results.primaryTexts} limit={p.limits.primaryText} />}
          {results.descriptions && <AdCard label="Descriptions" items={results.descriptions} limit={p.limits.description} />}
          {results.ctas && <AdCard label="Call to Actions" items={results.ctas} limit={p.limits.cta} />}
        </div>
      )}
    </div>
  );
}