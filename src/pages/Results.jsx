import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Zap, CheckCircle, Mail, Copy, ChevronDown, ChevronUp } from "lucide-react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs text-white/30 hover:text-white transition-colors">
      <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function Section({ title, color, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <h2 className="font-bold text-base" style={{ color }}>{title}</h2>
        {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

function Label({ text }) {
  return <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-2 mt-4">{text}</p>;
}

function Item({ num, text, maxChars }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50 flex-shrink-0 mt-0.5">{num}</span>
      <span className="text-sm text-white/80 flex-1">{text}</span>
      <div className="flex items-center gap-2 flex-shrink-0">
        {maxChars && <span className={`text-xs ${text.length > maxChars ? 'text-red-400' : 'text-white/30'}`}>{text.length}/{maxChars}</span>}
        <CopyButton text={text} />
      </div>
    </div>
  );
}

function Card({ label, text }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
      {label && <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{label}</p>}
      <p className="text-sm text-white/80 leading-relaxed">{text}</p>
      <div className="mt-2 flex justify-end"><CopyButton text={text} /></div>
    </div>
  );
}

function Tip({ text, variant = "info" }) {
  const styles = variant === "warning"
    ? "bg-red-950/50 border-red-500/30 text-red-300"
    : "bg-blue-950/50 border-blue-500/30 text-blue-300";
  return (
    <div className={`border rounded-xl p-4 text-sm leading-relaxed ${styles}`}>
      {variant === "warning" && <strong className="block mb-1">Warning</strong>}
      {text}
    </div>
  );
}

export default function Results() {
  const { user, isSignedIn } = useUser();
  const [generation, setGeneration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const generationId = params.get("generationId");
    const success = params.get("success");

    if (generationId && success === "true") {
      fetch(`/api/get-ad-generation?id=${generationId}`)
        .then(r => r.json())
        .then(data => {
          setGeneration(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#E53E3E]/30 border-t-[#E53E3E] rounded-full animate-spin mx-auto" />
          <p className="text-white/40 text-sm">Loading your ad copy...</p>
        </div>
      </div>
    );
  }

  if (!generation) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Results not found</h2>
          <p className="text-white/40">Please check your email for your ad copy.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-[#E53E3E] hover:underline text-sm">Back to home</Link>
        </div>
      </div>
    );
  }

  const { business_name, platform, email, results } = generation;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <nav className="border-b border-white/10 h-14 flex items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-sm">
          <div className="w-6 h-6 bg-[#E53E3E] rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          Fire-Works AI
        </Link>
        {isSignedIn && (
          <Link to="/dashboard" className="text-sm text-white/40 hover:text-white transition-colors">
            My Dashboard
          </Link>
        )}
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-300">Payment successful!</h3>
            <p className="text-emerald-400/70 text-sm mt-1">Your ad copy has been emailed to <strong>{email}</strong>. Check your inbox.</p>
          </div>
        </div>

        <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-[#E53E3E] uppercase tracking-widest font-bold mb-1">Your Ad Copy</p>
          <h1 className="text-2xl font-black text-white">{business_name}</h1>
          <p className="text-white/40 text-sm mt-1">{platform === 'both' ? 'Google + Meta + Organic Social' : platform === 'google' ? 'Google Ads' : 'Meta Ads + Organic Social'}</p>
        </div>

        {results?.google && (
          <Section title="Google Ads" color="#34d399">
            <Label text="Headlines (15) — max 30 chars each" />
            {results.google.headlines.map((h, i) => <Item key={i} num={i + 1} text={h} maxChars={30} />)}

            <Label text="Descriptions (4) — max 90 chars each" />
            {results.google.descriptions.map((d, i) => <Item key={i} num={i + 1} text={d} maxChars={90} />)}

            <Label text="Keywords" />
            <div className="flex flex-wrap gap-2 mt-1">
              {results.google.keywords.map((k, i) => (
                <span key={i} className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">{k}</span>
              ))}
            </div>

            <Label text="Match Type Recommendation" />
            <Tip text={results.google.match_type_recommendation} />

            <Label text="Campaign Tip" />
            <Tip text={results.google.campaign_tip} />
          </Section>
        )}

        {results?.meta && (
          <Section title="Meta Ads" color="#60a5fa">
            <Label text="Primary Text Options" />
            {results.meta.primary_texts.map((t, i) => <Card key={i} label={`Option ${i + 1}`} text={t} />)}

            <Label text="Headlines" />
            {results.meta.headlines.map((h, i) => <Item key={i} num={i + 1} text={h} />)}

            <Label text="Hook Ideas" />
            {results.meta.hooks.map((h, i) => <Item key={i} num={i + 1} text={`"${h}"`} />)}

            <Label text="CTA Recommendation" />
            <Tip text={results.meta.cta_recommendation} />

            <Label text="Audience Direction" />
            <Tip text={results.meta.audience_direction} />

            <Label text="Creative Angles" />
            {results.meta.creative_angles.map((a, i) => <Item key={i} num={i + 1} text={a} />)}

            <Label text="Warning" />
            <Tip text={results.meta.warning} variant="warning" />
          </Section>
        )}

        {results?.social && (
          <Section title="Organic Social Posts" color="#f472b6">
            <Label text="Caption Ideas (5)" />
            {results.social.captions.map((c, i) => <Card key={i} label={`Post ${i + 1}`} text={c} />)}

            <Label text="Hashtags" />
            <div className="flex flex-wrap gap-2 mt-1">
              {results.social.hashtags.map((h, i) => (
                <span key={i} className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">#{h}</span>
              ))}
            </div>

            <Label text="Best Time to Post" />
            <Tip text={results.social.best_time_to_post} />

            <Label text="Content Angles" />
            {results.social.content_angles.map((a, i) => <Item key={i} num={i + 1} text={a} />)}
          </Section>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <Mail className="w-5 h-5 text-white/40 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">Full copy emailed to you</p>
            <p className="text-xs text-white/40 mt-0.5">Check <strong>{email}</strong> — check spam if you don't see it.</p>
          </div>
        </div>

        <div className="text-center pb-8">
          <Link to="/get-started">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-sm font-medium text-white/60 hover:border-[#E53E3E]/40 hover:text-white transition-all">
              <Zap className="w-4 h-4" /> Generate More Ad Copy
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
