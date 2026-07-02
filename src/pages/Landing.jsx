import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Zap, Check, Target, FileText, BarChart2, ArrowRight, Star, Shield, TrendingUp, Search, Facebook, Layers, Key, Image } from "lucide-react";
import { motion } from "framer-motion";

const handleGetStarted = () => { window.location.href = "/get-started"; };
const handleLogin = () => { window.location.href = "/dashboard"; };

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const features = [
  {
    icon: Search,
    title: "Google Ads — Built Right",
    desc: "Get 15 headlines, 4 descriptions, sitelinks, callouts, keywords with match types, and negative keywords — all tailored to your business.",
  },
  {
    icon: Facebook,
    title: "Meta Ads — Full Campaign",
    desc: "Campaign objective, audience targeting, primary text options, hooks, creative direction, retargeting strategy, and risk warnings.",
  },
  {
    icon: BarChart2,
    title: "Keywords + Social Content",
    desc: "Add keyword research or organic social captions, hashtags, story ideas, and reel concepts as affordable add-ons.",
  },
];

const steps = [
  { n: "01", title: "Tell us about your business", desc: "Enter your contact info, select your platform, and answer a few quick questions about your business and goals." },
  { n: "02", title: "AI builds your campaign", desc: "Our AI generates a complete, platform-specific campaign setup tailored to your business, audience, and budget." },
  { n: "03", title: "Get your content instantly", desc: "View results on screen, download, and receive a full PDF report emailed to you immediately after payment." },
  { n: "04", title: "Save and revisit anytime", desc: "Create a free account to save your business info and access all past generations from your dashboard." },
];

const deliverables = [
  "Google Ads — 15 headlines, 4 descriptions, sitelinks",
  "Callout extensions and keyword recommendations",
  "Keywords with match types and search intent",
  "Negative keyword list",
  "Meta Ads — campaign objective recommendation",
  "Audience targeting — age, gender, interests, behaviors",
  "3 primary text options, 3 headlines, 3 hooks",
  "Creative direction and format recommendation",
  "Retargeting strategy",
  "Organic social captions, hashtags, reel concepts (add-on)",
  "Keyword research report (add-on)",
];

const testimonials = [
  { name: "Sarah K.", biz: "Local Med Spa Owner", text: "I used to spend hours researching what objective to use and still felt unsure. This gave me a full strategy in under a minute. The hooks it generated were actually good." },
  { name: "Marcus R.", biz: "Ecommerce Brand Founder", text: "Better strategy output than what my agency gave me last month. The objective recommendation alone saved me from wasting money on Traffic again." },
  { name: "Diane L.", biz: "Business Coach", text: "Finally understand which objectives to use for lead gen vs awareness. The copy it writes is on-point for my audience. Absolutely worth paying for." },
];

function FireworksCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const colors = ['#E53E3E', '#FF6B6B', '#FFA07A', '#FFD700', '#FF4500', '#FF8C00', '#ff6eb4'];
    const particles = [];
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const random = (min, max) => Math.random() * (max - min) + min;

    const createBurst = (x, y) => {
      const count = Math.floor(random(35, 65));
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        const speed = random(1.5, 5.5);
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: random(1.5, 3.5),
          decay: random(0.010, 0.022),
          trail: [],
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
        if (p.trail.length > 5) p.trail.shift();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.99;
        p.alpha -= p.decay;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        p.trail.forEach((t, ti) => {
          ctx.save();
          ctx.globalAlpha = t.alpha * (ti / p.trail.length) * 0.4;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    const burst = () => {
      const x = random(canvas.width * 0.05, canvas.width * 0.95);
      const y = random(canvas.height * 0.03, canvas.height * 0.65);
      createBurst(x, y);
      setTimeout(burst, random(900, 2800));
    };

    burst();
    setTimeout(() => createBurst(random(100, canvas.width - 100), random(50, 200)), 300);
    setTimeout(() => createBurst(random(100, canvas.width - 100), random(50, 200)), 700);
    setTimeout(() => createBurst(random(100, canvas.width - 100), random(50, 200)), 1200);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }} />
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">

      {/* Nav */}
      <nav className="border-b border-white/10 bg-[#0D1117]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-base text-white hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-[#E53E3E] rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Fire-Works AI
          </Link>
          <div className="hidden sm:flex items-center gap-1 text-sm text-white/50 font-medium">
            Google & Meta AI Ad Campaign Builder
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={handleLogin} className="text-sm text-white/60 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">Log In</button>
            <button onClick={handleGetStarted} className="text-sm font-semibold bg-[#E53E3E] hover:bg-[#C53030] text-white px-4 py-2 rounded-lg transition-colors">
              Start Generating
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '520px' }}>
        <div className="absolute inset-0 pointer-events-none">
          <FireworksCanvas />
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#E53E3E]/20 rounded-full blur-[130px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute top-10 right-20 w-[500px] h-[500px] bg-[#9B2C2C]/30 rounded-full blur-[90px]" />
          <div className="absolute bottom-0 left-1/2 w-[300px] h-[200px] bg-[#E53E3E]/10 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24 relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl space-y-6">
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              AI ad campaigns <span className="text-[#E53E3E]">for</span><br />
              Google &amp; Meta.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/50 max-w-xl leading-relaxed">
              Answer a few questions about your business and get a complete, ready-to-launch ad campaign — headlines, keywords, copy, audience targeting, and more. Delivered instantly.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleGetStarted} className="inline-flex items-center justify-center gap-2 bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                Build My Ad Campaign <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
            <motion.p variants={fadeUp} className="text-xs text-white/30">
              Google Ads from $9.99 · Meta Ads from $9.99 · Google + Meta $16.99
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Everything you need to launch smarter ads</h2>
          <p className="text-white/40">Built for business owners who want expert-level campaigns without hiring an agency.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#E53E3E]/30 transition-all duration-200">
              <div className="w-10 h-10 bg-[#E53E3E]/20 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-[#E53E3E]" />
              </div>
              <h3 className="font-bold text-white mb-2 text-base">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="bg-white/3 border-y border-white/10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[#E53E3E] text-xs font-bold uppercase tracking-widest mb-4">A FEW QUESTIONS. A COMPLETE CAMPAIGN.</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                You don't get vague tips.<br />You get a <span className="text-[#E53E3E]">ready-to-launch campaign.</span>
              </h2>
              <p className="text-white/40 mb-6 leading-relaxed text-sm">
                Fill in your business details and receive a structured, expert-level ad campaign — the kind an experienced media buyer would build, delivered in seconds.
              </p>
              <ul className="space-y-2.5">
                {deliverables.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-[#E53E3E] shrink-0 mt-0.5" />
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 space-y-3">
              <p className="text-xs text-[#E53E3E] uppercase tracking-widest font-bold mb-4">SAMPLE OUTPUT</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/40 mb-1">Campaign Objective: <span className="text-white">Lead Generation — Maximize Leads</span></p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1.5">Google Headline Example</p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-sm text-white/80">"Same-Day Plumbing Pittsburgh" <span className="text-white/30 text-xs">· 30/30</span></p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1.5">Meta Hook Example</p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-sm text-white/80 italic">"Still waiting on that plumber? We show up same day."</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1.5">Audience Direction</p>
                  <p className="text-sm text-white/70">Homeowners 30–65 within 15 miles. Broad targeting + strong creative beats stacked interests at this budget.</p>
                </div>
                <div className="bg-[#E53E3E]/10 border border-[#E53E3E]/30 rounded-xl p-4">
                  <p className="text-xs text-[#E53E3E] font-semibold mb-1">Warning</p>
                  <p className="text-sm text-white/70">Do not run Traffic if your site has no pixel or conversion event. You'll pay for clicks with no way to measure results.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">From blank page to full campaign</h2>
          <p className="text-white/40">No media buying expertise required.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map(s => (
            <div key={s.n} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-9 h-9 bg-[#E53E3E] text-white rounded-xl flex items-center justify-center font-black text-sm mb-4">{s.n}</div>
              <h3 className="font-bold text-white mb-2 text-sm">{s.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white/3 border-y border-white/10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white mb-10">What users are saying</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E53E3E]/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#E53E3E]">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.biz}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-2">Simple, transparent pricing</h2>
          <p className="text-white/40">Pay only for what you need. No subscriptions. No monthly fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-bold text-white mb-1">Google Ads</h3>
            <p className="text-white/40 text-xs mb-1">Full campaign setup + copy</p>
            <p className="text-white/30 text-xs mb-4">15 headlines · 4 descriptions · keywords · sitelinks</p>
            <div className="text-3xl font-black text-white mb-4">$9.99</div>
            <button onClick={handleGetStarted} className="w-full border border-white/20 text-white text-sm font-semibold py-2.5 rounded-xl hover:border-white/40 transition-colors">
              Get Started
            </button>
          </div>

          <div className="bg-[#161B22] border-2 border-[#E53E3E]/60 rounded-2xl p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-[#E53E3E] text-white text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</span>
            </div>
            <div className="w-10 h-10 bg-[#E53E3E]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Layers className="w-5 h-5 text-[#E53E3E]" />
            </div>
            <h3 className="font-bold text-white mb-1">Google + Meta</h3>
            <p className="text-white/40 text-xs mb-1">Both full ad campaigns</p>
            <p className="text-white/30 text-xs mb-4">Everything in both platforms in one generation</p>
            <div className="text-3xl font-black text-white mb-1">$16.99</div>
            <p className="text-[#E53E3E] text-xs mb-4">Save $3 vs buying separately</p>
            <button onClick={handleGetStarted} className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
              Get Started
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Facebook className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-white mb-1">Meta Ads</h3>
            <p className="text-white/40 text-xs mb-1">Full campaign setup + copy</p>
            <p className="text-white/30 text-xs mb-4">Audience · hooks · primary text · creative direction</p>
            <div className="text-3xl font-black text-white mb-4">$9.99</div>
            <button onClick={handleGetStarted} className="w-full border border-white/20 text-white text-sm font-semibold py-2.5 rounded-xl hover:border-white/40 transition-colors">
              Get Started
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <Image className="w-5 h-5 text-pink-400 mx-auto mb-2" />
            <h3 className="font-bold text-white text-sm mb-1">Organic Social</h3>
            <p className="text-white/40 text-xs mb-3">Captions · hashtags · reel ideas · story concepts</p>
            <div className="text-2xl font-black text-white">$4.99</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <BarChart2 className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <h3 className="font-bold text-white text-sm mb-1">Everything</h3>
            <p className="text-white/40 text-xs mb-3">Google + Meta + Social + Keyword Research</p>
            <div className="text-2xl font-black text-white">$19.99</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <Key className="w-5 h-5 text-white/40 mx-auto mb-2" />
            <h3 className="font-bold text-white text-sm mb-1">Add-ons</h3>
            <p className="text-white/40 text-xs mb-3">Keyword Research or Social Content — added at checkout</p>
            <div className="text-2xl font-black text-white">+$4.99</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#E53E3E] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Ready to run smarter ads?</h2>
            <p className="text-white/70 text-sm max-w-lg">Stop guessing which campaign to run. Get a complete AI-generated ad campaign tailored to your business in minutes.</p>
          </div>
          <button onClick={handleGetStarted} className="bg-white text-[#E53E3E] font-bold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors text-sm whitespace-nowrap shrink-0">
            Build My Campaign
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0D1117]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-[#E53E3E] rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white">Fire-Works AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          </div>
          <p className="text-xs text-white/30">© 2026 Fire-Works Eco by Colonna Media</p>
        </div>
      </footer>
    </div>
  );
}
