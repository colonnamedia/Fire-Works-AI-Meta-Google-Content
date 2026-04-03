import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Privacy() {
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="space-y-6 text-foreground">
          <section><h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2><p className="text-muted-foreground">We collect your email address, name, business information you submit in forms, usage data, and billing information. We do not store full payment card numbers — payments are processed securely by our payment provider.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2><p className="text-muted-foreground">We use your data to provide and improve the service, process payments, send billing notifications, and respond to support requests. We do not sell your personal data to third parties.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">3. AI-Generated Content</h2><p className="text-muted-foreground">Business information you submit may be sent to AI providers to generate ad strategy recommendations. We do not permanently store your prompts with third-party AI providers beyond the scope of processing your request.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">4. Data Retention</h2><p className="text-muted-foreground">Your account data and generated ad ideas are retained while your account is active. You may request deletion of your account and associated data by contacting support.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">5. Security</h2><p className="text-muted-foreground">We use industry-standard security practices to protect your data. However, no system is completely secure. Please use a strong, unique password for your account.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">6. Cookies</h2><p className="text-muted-foreground">We use session cookies for authentication. We do not use third-party tracking cookies for advertising purposes.</p></section>
          <section><h2 className="text-lg font-semibold mb-2">7. Contact</h2><p className="text-muted-foreground">For privacy inquiries, please <Link to="/support" className="text-primary hover:underline">contact support</Link>.</p></section>
        </div>
      </div>
    </div>
  );
}