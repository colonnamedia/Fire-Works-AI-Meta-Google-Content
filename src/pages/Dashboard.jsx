import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Zap, Plus, ChevronDown, ChevronUp, Copy, Search, Facebook, Layers, Mail, CheckCircle } from "lucide-react";

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
  if (platform === 'google' || platform === 'google_ads') return <Search className="w-4 h-4 text-green-400" />;
  if (platform === 'meta' || platform === 'meta_ads') return <Facebook className="w-4 h-4 text-blue-400" />;
  return <Layers className="w-4 h-4 text-[#E53E3E]" />;
}

function Label({ text }) {
  return <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-2 mt-4">{text}</p>;
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/40 w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-white/80 flex-1">{value}</span>
    </div>
  );
}

function GenerationResults({ results }) {
  try {
    const r = typeof results === 'string' ? JSON.parse(results) : results;
    return (
      <div className="px-6 pb-6 border-t border-white/10 pt-4 space-y-6">

        {r?.google && (
          <div>
            <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Google Ads Campaign</p>

            <Label text="Campaign Setup" />
            <InfoRow label="Campaign Type" value={r.google.campaign_type} />
            <InfoRow label="Objective" value={r.google.campaign_objective} />
            <InfoRow label="Budget" value={r.google.budget_recommendation} />
            <InfoRow label="Bidding" value={r.google.bidding_strategy} />
            <InfoRow label="Location" value={r.google.location_targeting} />
            <InfoRow label="Exclusions" value={r.google.location_exclusions} />
            <InfoRow label="Audience" value={r.google.audience_targeting} />

            <Label text="Headlines — max 30 chars" />
            {r.google.headlines?.map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-white/30 w-4">{i + 1}</span>
                <span className="text-sm text-white/80 flex-1">{h}</span>
                <span className={`text-xs ${h.length > 30 ? 'text-red-400' : 'text-white/30'}`}>{h.length}/30</span>
                <CopyButton text={h} />
              </div>
            ))}

            <Label text="Descriptions — max 90 chars" />
            {r.google.descriptions?.map((d, i) => (
              <div key={i} className="flex items-start gap-3 py-1.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-white/30 w-4 mt-0.5">{i + 1}</span>
                <span className="text-sm text-white/80 flex-1">{d}</span>
                <span className={`text-xs ${d.length > 90 ? 'text-red-400' : 'text-white/30'}`}>{d.length}/90</span>
                <CopyButton text={d} />
              </div>
            ))}

            {r.google.sitelinks?.length > 0 && (
              <>
                <Label text="Sitelink Extensions" />
                {r.google.sitelinks.map((s, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-white">{s.title}</p>
                      <CopyButton text={`${s.title}\n${s.description1 || ''}\n${s.description2 || s.description || ''}`} />
                    </div>
                    {s.suggested_url && <p className="text-xs text-white/30 mb-1">{s.suggested_url}</p>}
                    {s.description1 && <p className="text-xs text-white/50">{s.description1}</p>}
                    {s.description2 && <p className="text-xs text-white/50">{s.description2}</p>}
                    {!s.description1 && s.description && <p className="text-xs text-white/50">{s.description}</p>}
                  </div>
                ))}
              </>
            )}

            {r.google.callouts?.length > 0 && (
              <>
                <Label text="Callout Extensions" />
                <div className="flex flex-wrap gap-2">
                  {r.google.callouts.map((c, i) => (
                    <div key={i} className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-white/70">{c}</span>
                      <CopyButton text={c} />
                    </div>
                  ))}
                </div>
              </>
            )}

            <Label text="Keywords with Match Types" />
            {r.google.keywords?.map((k, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-white/30 w-4">{i + 1}</span>
                <span className="text-sm text-white/80 flex-1">{typeof k === 'string' ? k : k.keyword}</span>
                {k.match_type && <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded">{k.match_type}</span>}
                {k.intent && <span className="text-xs bg-white/5 text-white/30 px-2 py-0.5 rounded">{k.intent}</span>}
                <CopyButton text={typeof k === 'string' ? k : k.keyword} />
              </div>
            ))}

            {r.google.negative_keywords?.length > 0 && (
              <>
                <Label text="Negative Keywords" />
                <div className="flex flex-wrap gap-2">
                  {r.google.negative_keywords.map((k, i) => (
                    <span key={i} className="bg-red-950/40 border border-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full">−{k}</span>
                  ))}
                </div>
              </>
            )}

            {r.google.campaign_tip && (
              <>
                <Label text="Campaign Tip" />
                <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">{r.google.campaign_tip}</div>
              </>
            )}
          </div>
        )}

        {r?.meta && (
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Meta Ads Campaign</p>

            <Label text="Campaign Setup" />
            <InfoRow label="Objective" value={r.meta.campaign_objective} />
            <InfoRow label="Budget" value={r.meta.budget_recommendation} />
            <InfoRow label="Ad Set Structure" value={r.meta.ad_set_structure} />
            <InfoRow label="Placements" value={r.meta.placement_recommendation} />
            <InfoRow label="Geographic" value={r.meta.geographic_targeting} />
            <InfoRow label="Creative" value={r.meta.creative_direction} />
            <InfoRow label="Format" value={r.meta.creative_format} />

            {r.meta.audience && (
              <>
                <Label text="Audience Targeting" />
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                  <InfoRow label="Age Range" value={r.meta.audience.age_range} />
                  <InfoRow label="Gender" value={r.meta.audience.gender} />
                  <InfoRow label="Exclusions" value={r.meta.audience.exclusions} />
                  {r.meta.audience.interests?.length > 0 && (
                    <div className="py-2 border-t border-white/5">
                      <span className="text-xs text-white/40 block mb-2">Interests</span>
                      <div className="flex flex-wrap gap-2">
                        {r.meta.audience.interests.map((interest, i) => (
                          <span key={i} className="bg-blue-950/40 border border-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full">{interest}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {r.meta.audience.behaviors?.length > 0 && (
                    <div className="py-2 border-t border-white/5">
                      <span className="text-xs text-white/40 block mb-2">Behaviors</span>
                      <div className="flex flex-wrap gap-2">
                        {r.meta.audience.behaviors.map((b, i) => (
                          <span key={i} className="bg-purple-950/40 border border-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full">{b}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <Label text="Primary Text Options" />
            {r.meta.primary_texts?.map((t, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 mb-2">
                <p className="text-xs text-white/30 mb-1">Option {i + 1}</p>
                <p className="text-sm text-white/80">{t}</p>
                <div className="mt-2 flex justify-end"><CopyButton text={t} /></div>
              </div>
            ))}

            <Label text="Headlines" />
            {r.meta.headlines?.map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-white/30 w-4">{i + 1}</span>
                <span className="text-sm text-white/80 flex-1">{h}</span>
                <CopyButton text={h} />
              </div>
            ))}

            <Label text="Hook Ideas" />
            {r.meta.hooks?.map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-white/30 w-4">{i + 1}</span>
                <span className="text-sm text-white/80 italic flex-1">"{h}"</span>
                <CopyButton text={h} />
              </div>
            ))}

            {r.meta.cta_recommendation && (
              <>
                <Label text="CTA Recommendation" />
                <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">{r.meta.cta_recommendation}</div>
              </>
            )}

            {r.meta.creative_angles?.length > 0 && (
              <>
                <Label text="Creative Angles" />
                {r.meta.creative_angles.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white/30 w-4">{i + 1}</span>
                    <span className="text-sm text-white/80 flex-1">{a}</span>
                  </div>
                ))}
              </>
            )}

            {r.meta.retargeting_recommendation && (
              <>
                <Label text="Retargeting Strategy" />
                <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">{r.meta.retargeting_recommendation}</div>
              </>
            )}

            {r.meta.warning && (
              <>
                <Label text="Warning" />
                <div className="bg-red-950/50 border border-red-500/30 rounded-xl p-4 text-sm text-red-300"><strong className="block mb-1">Warning</strong>{r.meta.warning}</div>
              </>
            )}
          </div>
        )}

        {r?.social && (
          <div>
            <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Organic Social Content</p>
            {r.social.content_strategy && (
              <>
                <Label text="Content Strategy" />
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-2">
                  <p className="text-sm text-white/70 leading-relaxed">{r.social.content_strategy}</p>
                </div>
              </>
            )}
            <Label text="Caption Ideas" />
            {r.social.captions?.map((c, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 mb-2">
                <p className="text-xs text-white/30 mb-1">Post {i + 1}</p>
                <p className="text-sm text-white/80">{c}</p>
                <div className="mt-2 flex justify-end"><CopyButton text={c} /></div>
              </div>
            ))}
            <Label text="Hashtags" />
            <div className="flex flex-wrap gap-2 mt-1">
              {r.social.hashtags?.map((h, i) => (
                <span key={i} className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">#{h}</span>
              ))}
            </div>
            {r.social.story_ideas?.length > 0 && (
              <>
                <Label text="Story Ideas" />
                {r.social.story_ideas.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white/30 w-4">{i + 1}</span>
                    <span className="text-sm text-white/80 flex-1">{s}</span>
                  </div>
                ))}
              </>
            )}
            {r.social.reel_concepts?.length > 0 && (
              <>
                <Label text="Reel / Video Concepts" />
                {r.social.reel_concepts.map((rc, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white/30 w-4">{i + 1}</span>
                    <span className="text-sm text-white/80 flex-1">{rc}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {r?.keywords && (
          <div>
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Keyword Research</p>
            <Label text="Primary Keywords" />
            {r.keywords.primary_keywords?.map((k, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-white/30 w-4">{i + 1}</span>
                <span className="text-sm text-white/80 flex-1">{k.keyword}</span>
                <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded">{k.match_type}</span>
                {k.estimated_competition && <span className="text-xs bg-white/5 text-white/30 px-2 py-0.5 rounded">{k.estimated_competition}</span>}
                <CopyButton text={k.keyword} />
              </div>
            ))}
            {r.keywords.long_tail_keywords?.length > 0 && (
              <>
                <Label text="Long-Tail Keywords" />
                {r.keywords.long_tail_keywords.map((k, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white/30 w-4">{i + 1}</span>
                    <span className="text-sm text-white/80 flex-1">{k.keyword}</span>
                    <CopyButton text={k.keyword} />
                  </div>
                ))}
              </>
            )}
            {r.keywords.negative_keywords?.length > 0 && (
              <>
                <Label text="Negative Keywords" />
                <div className="flex flex-wrap gap-2 mt-1">
                  {r.keywords.negative_keywords.map((k, i) => (
                    <span key={i} className="bg-red-950/40 border border-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full">−{k}</span>
                  ))}
                </div>
              </>
            )}
            {r.keywords.keyword_strategy && (
              <>
                <Label text="Keyword Strategy" />
                <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">{r.keywords.keyword_strategy}</div>
              </>
            )}
          </div>
        )}
      </div>
    );
  } catch (err) {
    return (
      <div className="px-6 pb-6 border-t border-white/10 pt-4">
        <p className="text-sm text-white/40">Unable to display this generation. Please check your email for the full results.</p>
      </div>
    );
  }
}

function GenerationCard({ generation }) {
  const [open, setOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const { business_name, platform, content_type, created_at, results, email } = generation;
  const displayPlatform = content_type || platform;
  const date = new Date(created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const platformLabel = {
    google_ads: 'Google Ads Campaign',
    meta_ads: 'Meta Ads Campaign',
    organic_social: 'Organic Social',
    keyword_research: 'Keyword Research',
    google_meta: 'Google + Meta',
    everything: 'Everything',
    both: 'Google + Meta + Social',
    google: 'Google Ads',
    meta: 'Meta + Social',
  }[displayPlatform] || displayPlatform;

  const handleResend = async (e) => {
    e.stopPropagation();
    setResending(true);
    try {
      await fetch('/api/resend-ad-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generation_id: generation.id, email }),
      });
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-4">
      <div className="w-full flex items-center gap-4 px-6 py-4">
        <PlatformIcon platform={displayPlatform} />
        <div className="flex-1 cursor-pointer" onClick={() => setOpen(o => !o)}>
          <p className="font-semibold text-white text-sm">{business_name}</p>
          <p className="text-xs text-white/40 mt-0.5">{platformLabel} · {date}</p>
        </div>
        <button
          onClick={handleResend}
          disabled={resending}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 flex-shrink-0"
        >
          {resent ? <><CheckCircle className="w-3 h-3 text-green-400" />Sent!</> : resending ? 'Sending...' : <><Mail className="w-3 h-3" />Resend Email</>}
        </button>
        <button onClick={() => setOpen(o => !o)} className="flex-shrink-0">
          {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </button>
      </div>
      {open && <GenerationResults results={results} />}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress;
      fetch(`/api/get-user-generations?clerk_user_id=${user.id}&email=${encodeURIComponent(email || '')}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setGenerations(data);
          } else {
            setError('Unexpected response format');
          }
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
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

        {error && (
          <div className="bg-red-950/50 border border-red-500/30 rounded-xl p-4 mb-6 text-sm text-red-300">
            Error loading generations: {error}
          </div>
        )}

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
