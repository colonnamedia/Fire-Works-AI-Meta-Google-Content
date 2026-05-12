import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <nav className="border-b border-white/10 h-14 flex items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-sm">
          <div className="w-6 h-6 bg-[#E53E3E] rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          Fire-Works AI
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-white/40 text-sm">Last updated: May 2026 · Fire-Works Eco by Colonna Media</p>
        </div>

        {[
          { title: "1. Information We Collect", body: "When you use Fire-Works AI, we collect information you provide directly: your name, email address, business name, industry, offer details, target audience, and other business information entered into the questionnaire. We also collect payment information processed securely through Stripe — we never store your credit card details directly. If you create an account, we store your profile information to pre-fill future generations." },
          { title: "2. How We Use Your Information", body: "We use your information to generate AI-powered ad copy tailored to your business, deliver your results via email, maintain your account and purchase history, improve the quality of our AI outputs, and communicate with you about your account or purchases. We do not sell your personal information to third parties." },
          { title: "3. AI Processing", body: "Your business information is sent to Groq's AI infrastructure to generate ad copy. This processing is governed by Groq's privacy policy. We do not share your personally identifiable information with Groq beyond what is necessary to generate your content. Generated content is stored in our database associated with your account." },
          { title: "4. Payment Processing", body: "All payments are processed by Stripe. We do not store your credit card number, CVV, or full payment details on our servers. Stripe's privacy policy governs the handling of your payment information. You can review Stripe's privacy policy at stripe.com/privacy." },
          { title: "5. Email Communications", body: "We use Resend to deliver your generated ad copy to your email address. Your email address is used solely to deliver your purchased content and any account-related communications. We do not send unsolicited marketing emails. You may contact us at any time to request removal from our mailing list." },
          { title: "6. Data Storage and Security", body: "Your data is stored securely in our database hosted on Neon (PostgreSQL). We use industry-standard security practices including SSL encryption for all data transmission. We retain your data for as long as your account is active or as needed to provide the Service. You may request deletion of your data at any time." },
          { title: "7. Authentication", body: "Account authentication is handled by Clerk. Your login credentials and session management are governed by Clerk's privacy policy. We do not store passwords directly — authentication is handled via magic link email." },
          { title: "8. Your Rights", body: "You have the right to access the personal information we hold about you, request correction of inaccurate data, request deletion of your account and associated data, and opt out of any non-essential communications. To exercise any of these rights, contact us at colonnamedia@gmail.com." },
          { title: "9. Cookies", body: "We use essential cookies and local storage to maintain your session and improve your experience. We do not use third-party advertising cookies or tracking pixels on our platform." },
          { title: "10. Children's Privacy", body: "The Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately." },
          { title: "11. Changes to This Policy", body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the date at the top of this page. Continued use of the Service after changes constitutes acceptance of the updated policy." },
          { title: "12. Contact Us", body: "For questions about this Privacy Policy or your data, contact Fire-Works Eco by Colonna Media at colonnamedia@gmail.com." },
        ].map((section, i) => (
          <div key={i} className="space-y-2">
            <h2 className="text-base font-bold text-white">{section.title}</h2>
            <p className="text-sm text-white/60 leading-relaxed">{section.body}</p>
          </div>
        ))}

        <div className="pt-8 border-t border-white/10 flex gap-6 text-sm text-white/30">
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );
}
