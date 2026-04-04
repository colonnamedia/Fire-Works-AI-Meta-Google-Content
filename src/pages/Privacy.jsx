import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <nav className="border-b border-white/10 bg-[#0D1117]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-base text-white hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-[#E53E3E] rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Fire-Works AI
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-white/30 text-sm mb-10">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8">
          {[
            { title: "1. Information We Collect", body: "We collect your email address, name, business information you submit in forms, usage data, and billing information. We do not store full payment card numbers — payments are processed securely by our payment provider." },
            { title: "2. How We Use Your Information", body: "We use your data to provide and improve the service, process payments, send billing notifications, and respond to support requests. We do not sell your personal data to third parties." },
            { title: "3. AI-Generated Content", body: "Business information you submit may be sent to AI providers to generate ad strategy recommendations. We do not permanently store your prompts with third-party AI providers beyond the scope of processing your request." },
            { title: "4. Data Retention", body: "Your account data and generated ad ideas are retained while your account is active. You may request deletion of your account and associated data by contacting support." },
            { title: "5. Security", body: "We use industry-standard security practices to protect your data. However, no system is completely secure. Please use a strong, unique password for your account." },
            { title: "6. Cookies", body: "We use session cookies for authentication. We do not use third-party tracking cookies for advertising purposes." },
            { title: "7. Contact", body: null, link: true },
          ].map((section) => (
            <section key={section.title} className="border-b border-white/10 pb-8 last:border-0">
              <h2 className="text-base font-bold text-white mb-2">{section.title}</h2>
              {section.link ? (
                <p className="text-white/40 text-sm leading-relaxed">
                  For privacy inquiries, please{" "}
                  <Link to="/support" className="text-[#E53E3E] hover:underline">contact support</Link>.
                </p>
              ) : (
                <p className="text-white/40 text-sm leading-relaxed">{section.body}</p>
              )}
            </section>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-[#E53E3E] rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white">Fire-Works AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          </div>
          <p className="text-xs text-white/30">© 2026 Fire-Works AI</p>
        </div>
      </footer>
    </div>
  );
}