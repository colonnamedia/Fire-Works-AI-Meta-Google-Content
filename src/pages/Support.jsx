import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, CheckCircle, Mail, MessageSquare, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How does the ad copy generation work?",
    a: "You fill out a short questionnaire about your business, goals, and target audience. Our AI analyzes your inputs and generates customized ad copy for your chosen platforms — Google Ads, Meta Ads, or both — plus organic social post captions."
  },
  {
    q: "What do I get after I pay?",
    a: "You get instant access to your results on screen and a full copy of everything emailed to you. For Google Ads you get 15 headlines, 4 descriptions, 10 keywords, and campaign tips. For Meta you get 3 primary text options, 3 headlines, 3 hooks, audience direction, and creative angles. Social posts include 5 captions and hashtag sets."
  },
  {
    q: "Can I generate copy for the same business again?",
    a: "Yes — every generation is a new purchase. If you create an account your business info is saved so you don't have to re-enter it. You can generate fresh copy anytime for new offers, seasons, or campaigns."
  },
  {
    q: "Are refunds available?",
    a: "Due to the immediate digital delivery of AI-generated content, all sales are final. If you experience a technical issue that prevented delivery, contact us and we'll make it right."
  },
  {
    q: "Do I need an account to use the service?",
    a: "No — you can generate ad copy without an account. However creating a free account lets you save your business profile and view all past purchases in your dashboard."
  },
  {
    q: "How do I log in?",
    a: "We use magic link login — enter your email and we'll send you a secure sign-in link. No password needed."
  },
  {
    q: "Can I edit the generated copy?",
    a: "Absolutely — and we encourage it. The AI output is a strong starting point tailored to your business. Always review, personalize, and test variations before running ads."
  },
  {
    q: "What platforms does the copy work for?",
    a: "Google Ads (Search campaigns), Meta Ads (Facebook and Instagram), and organic social posts for Facebook and Instagram. Each is formatted to the specific character limits and best practices of that platform."
  },
];

export default function Support() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          business_name: form.subject,
          service_needed: "Support",
          message: form.message,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53E3E]/50";

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <nav className="border-b border-white/10 h-14 flex items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-sm">
          <div className="w-6 h-6 bg-[#E53E3E] rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          Fire-Works AI
        </Link>
        <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors">Back to home</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">

        <div className="text-center mb-14">
          <h1 className="text-3xl font-black text-white mb-3">Support Center</h1>
          <p className="text-white/40">Fire-Works Eco by Colonna Media — we're here to help.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <Mail className="w-6 h-6 text-[#E53E3E] mx-auto mb-3" />
            <h3 className="font-bold text-white text-sm mb-1">Email Us</h3>
            <a href="mailto:colonnamedia@gmail.com" className="text-xs text-white/40 hover:text-white transition-colors">colonnamedia@gmail.com</a>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <MessageSquare className="w-6 h-6 text-[#E53E3E] mx-auto mb-3" />
            <h3 className="font-bold text-white text-sm mb-1">Response Time</h3>
            <p className="text-xs text-white/40">Within 24 hours on business days</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <HelpCircle className="w-6 h-6 text-[#E53E3E] mx-auto mb-3" />
            <h3 className="font-bold text-white text-sm mb-1">FAQ Below</h3>
            <p className="text-xs text-white/40">Most answers are in the FAQ</p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-black text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm font-medium text-white">{faq.q}</span>
                  <span className="text-white/30 text-lg ml-4 flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-black text-white mb-2">Still need help?</h2>
          <p className="text-white/40 text-sm mb-6">Send us a message and we'll get back to you within 24 hours.</p>

          {submitted ? (
            <div className="flex items-center gap-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-5">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-emerald-300 text-sm">Message sent!</p>
                <p className="text-emerald-400/70 text-xs mt-0.5">We'll get back to you within 24 hours.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Your Name *</label>
                  <input required placeholder="Jane Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Email Address *</label>
                  <input required type="email" placeholder="jane@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Subject</label>
                <input placeholder="e.g. Issue with my generation, Billing question" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Message *</label>
                <textarea required placeholder="Describe your issue or question..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} className={`${inputClass} resize-none`} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="pt-8 border-t border-white/10 flex gap-6 text-sm text-white/30 mt-8">
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );
}
