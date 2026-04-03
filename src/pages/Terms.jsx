import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
            Meta Ad Strategist AI
          </Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <section><h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2><p className="text-muted-foreground">By accessing or using Meta Ad Strategist AI, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">2. Subscription and Billing</h2><p className="text-muted-foreground">The Starter Plan is billed at $4.99 per month and includes 5 ad idea entries per billing cycle. Additional entries are billed at $1.99 each. Credits reset at the start of each new billing period. Payments are non-refundable except where required by law.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">3. Use of AI-Generated Content</h2><p className="text-muted-foreground">AI-generated strategies are provided for informational and marketing guidance purposes only. We do not guarantee specific advertising results. You are responsible for reviewing and approving all content before publishing any ads.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">4. User Accounts</h2><p className="text-muted-foreground">You are responsible for maintaining the security of your account credentials. Accounts may not be shared or transferred. We reserve the right to suspend or terminate accounts that violate these terms.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">5. Prohibited Use</h2><p className="text-muted-foreground">You may not use this service for illegal activities, spam, or to generate content that violates Meta's advertising policies or any applicable laws.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">6. Limitation of Liability</h2><p className="text-muted-foreground">To the maximum extent permitted by law, Meta Ad Strategist AI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">7. Changes to Terms</h2><p className="text-muted-foreground">We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">8. Contact</h2><p className="text-muted-foreground">For questions about these terms, please <Link to="/support" className="text-primary hover:underline">contact support</Link>.</p></section>
        </div>
      </div>
    </div>
  );
}