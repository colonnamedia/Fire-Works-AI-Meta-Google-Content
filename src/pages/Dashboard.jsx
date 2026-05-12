import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Zap, Plus, ChevronDown, ChevronUp, Copy, Search, Facebook, Layers } from "lucide-react";

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

function PlatformIcon({ platform }) {
  if (platform === 'google') return <Search className="w-4 h-4 text-green-400" />;
  if (platform === 'meta') return <Facebook className="w-4 h-4 text-blue-400" />;
  return <Layers className="w-4 h-4 text-[#E53E3E]" />;
}

function GenerationCard({ generation }) {
  const [open, setOpen] = useState(false);
  const { business_name, platform, created_at, results } = generation;
  const date = new Date(created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors text-left"
      >
        <PlatformIcon platform={platform} />
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">{business_name}</p>
          <p className="text-xs text-white/40 mt-0.5">
            {platform === 'both' ? 'Google + Meta + Social' : platform === 'google' ? 'Google Ads' : 'Meta + Social'} · {date}
          </p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
      </button>

      {open && results && (
        <div className="px-6 pb-6 border-t border-white/10 pt-4 space-y-6">

          {results.google && (
            <div>
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Google Ads</p>
              <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Headlines</p>
              {results.google.headlines.map((h, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs text-white/30 w-4">{i + 1}</span>
                  <span className="text-sm text-white/80 flex-1">{h}</span>
                  <span className={`text-xs ${h.length > 30 ? 'text-red-400' : 'text-white/30'}`}>{h.length}/30</span>
                  <CopyButton text={h} />
                </div>
              ))}
              <p className="text-xs text-white/40 uppercase tracking-wide mb-2 mt-4">Descriptions</p>
              {results.google.descriptions.map((d, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs text-white/30 w-4 mt-0.5">{i + 1}</span>
                  <span className="text-sm text-white/80 flex-1">{d}</span>
                  <span className={`text-xs ${d.length > 90 ? 'text-red-400' : 'text-white/30'}`}>{d.length}/90</span>
                  <CopyButton text={d} />
                </div>
              ))}
              <p className="text-xs text-white/40 uppercase tracking-wide mb-2 mt-4">Keywords</p>
              <div className="flex flex-wrap gap-2">
                {results.google.keywords.map((k, i) => (
                  <span key={i} className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">{k}</span>
                ))}
              </div>
            </div>
          )}

          {results.meta && (
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Meta Ads</p>
              <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Primary Text Options</p>
              {results.meta.primary_texts.map((t, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 mb-2">
                  <p className="text-xs text-white/30 mb-1">Option {i + 1}</p>
                  <p className="text-sm text-white/80">{t}</p>
                  <div className="mt-2 flex justify-end"><CopyButton text={t} /></div>
                </div>
              ))}
              <p className="text-xs text-white/40 uppercase tracking-wide mb-2 mt-4">Headlines</p>
              {results.meta.headlines.map((h, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs text-white/30 w-4">{i + 1}</span>
                  <span className="text-sm text-white/80 flex-1">{h}</span>
                  <CopyButton text={h} />
                </div>
              ))}
              <p className="text-xs text-white/40 uppercase tracking-wide mb-2 mt-4">Hooks</p>
              {results.meta.hooks.map((h, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs text-white/30 w-4">{i + 1}</span>
                  <span className="text-sm text-white/80 italic flex-1">"{h}"</span>
                  <CopyButton text={h} />
                </div>
              ))}
            </div>
          )}

          {results.social && (
            <div>
              <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Organic Social Posts</p>
              {results.social.captions.map((c, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 mb-2">
                  <p className="text-xs text-white/30 mb-1">Post {i + 1}</p>
                  <p className="text-sm text-white/80">{c}</p>
                  <div className="mt-2 flex justify-end"><CopyButton text={c} /></div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 mt-3">
                {results.social.hashtags.map((h, i) => (
                  <span key={i} className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">#{h}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/get-user-generations?clerk_user_id=${user.id}`)
        .then(r => r.json())
        .then(data => {
          setGenerations(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <nav className="border-b border-white/10 h-14 flex items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-sm">
          <div className="w-6 h-6 bg-[#E53E3E] rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          Fire-Works AI
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/get-started">
            <button className="flex items-center gap-1.5 bg-[#E53E3E] hover:bg-[#C53030] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> New Generation
            </button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">My Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Welcome back, {user?.firstName || 'there'}. All your past ad generations are here.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#E53E3E]/30 border-t-[#E53E3E] rounded-full animate-spin" />
          </div>
        ) : generations.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-white/20" />
            </div>
            <h2 className="text-xl font-bold text-white">No generations yet</h2>
            <p className="text-white/40 text-sm">Create your first ad copy to see it here.</p>
            <Link to="/get-started">
              <button className="inline-flex items-center gap-2 bg-[#E53E3E] hover:bg-[#C53030] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors mt-2">
                <Plus className="w-4 h-4" /> Generate Ad Copy
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-4">{generations.length} generation{generations.length !== 1 ? 's' : ''}</p>
            {generations.map(g => <GenerationCard key={g.id} generation={g} />)}
          </div>
        )}
      </div>
    </div>
  );
}
