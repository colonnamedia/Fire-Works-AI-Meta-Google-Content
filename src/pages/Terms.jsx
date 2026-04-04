import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Terms() {
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
        <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
        <p className="text-white/30 text-sm mb-10">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8">
          {[
            { title: "1. Acceptance of Terms", body: "By accessing or using Fire-Works AI, you agree to be bound by these Terms of Service. If you do not agree, do not use the service." },
            { title: "2. Subscription and Billing", body: "The Starter Plan is billed at $14.99 per month and includes 5 ad idea entries per billing cycle. Both Platforms Plan is $19.99 per month. Additional entries are billed at $1.99 each. Credits reset at the start of each new billing period. Payments are non-refundable except where required by law." },
            { title: "3. Use of AI-Generated Content", body: "AI-generated strategies are provided for informational and marketing guidance purposes only. We do not guarantee specific advertising results. You are responsible for reviewing and approving all content before publishing any ads." },
            { title: "4. User Accounts", body: "You are responsible for maintaining the security of your account credentials. Accounts may not be shared or transferred. We reserve the right to suspend or terminate accounts that violate these terms." },
            { title: "5. Prohibited Use", body: "You may not use this service for illegal activities, spam, or to generate content that violates Meta's or Google's advertising policies or any applicable laws." },
            { title: "6. Limitation of Liability", body: "To the maximum extent permitted by law, Fire-Works AI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service." },
            { title: "7. Changes to Terms", body: "We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms." },
            { title: "8. Contact", body: null, link: true },
          ].map((section) => (
            <section key={section.title} className="border-b border-white/10 pb-8 last:border-0">
              <h2 className="text-base font-bold text-white mb-2">{section.title}</h2>
              {section.link ? (
                <p className="text-white/40 text-sm leading-relaxed">
                  For questions about these terms, please{" "}
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
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          </div>
          <p className="text-xs text-white/30">© 2026 Fire-Works AI</p>
        </div>
      </footer>
    </div>
  );
}