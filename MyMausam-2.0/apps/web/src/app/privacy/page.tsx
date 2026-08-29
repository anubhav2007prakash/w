import { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Privacy Policy — MyMausam 2.0",
  description: "How MyMausam collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 29, 2026";

  return (
    <div className="min-h-screen bg-[#06345C] text-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
        <p className="text-sm text-white/50 mb-8">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-sm text-white/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Introduction</h2>
            <p>
              This Privacy Policy explains how MyMausam 2.0 (&quot;the Service&quot;) collects, uses, and
              protects your personal information. We are committed to safeguarding your privacy and
              handling your data in compliance with applicable Indian data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-2"><strong>Account Information:</strong></p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Name and email address (when you create an account)</li>
              <li>Phone number (if provided)</li>
              <li>Selected persona and default location</li>
              <li>Avatar and display preferences</li>
            </ul>
            <p className="mb-2"><strong>Usage Data:</strong></p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Pages visited and features used</li>
              <li>Location searches and weather queries</li>
              <li>Device type, browser, and operating system</li>
              <li>IP address (for analytics and security)</li>
            </ul>
            <p className="mb-2"><strong>Community Contributions:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Weather observations you voluntarily submit</li>
              <li>Location and timestamp of observations</li>
              <li>Descriptions and images you upload</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide personalised weather alerts and forecasts</li>
              <li>Display relevant content based on your persona (farmer, commuter, etc.)</li>
              <li>Improve the Service and develop new features</li>
              <li>Send important weather alerts for your saved locations</li>
              <li>Ensure security and prevent abuse</li>
              <li>Generate anonymised community weather reports</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Data Sharing</h2>
            <p>
              We do <strong>not sell</strong> your personal data to third parties. We may share
              anonymised, aggregated data for research or public weather analysis. Your community
              weather observations may be displayed publicly with your chosen display name but
              never with your email or phone number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Data Storage &amp; Security</h2>
            <p>
              Your account data is stored locally in your browser (localStorage) and, if you
              create an account, on our backend servers. We implement reasonable security
              measures including encrypted transmission (HTTPS). However, no method of
              transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Location Data</h2>
            <p>
              MyMausam uses your location to provide relevant weather data. You may choose to
              share your device&apos;s precise GPS location or manually enter a city name. Location
              data is used only to fetch weather information and is not stored permanently unless
              you save it as your default location.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Cookies &amp; Local Storage</h2>
            <p>
              We use localStorage to save your preferences, authentication session, and theme
              settings. We do not use tracking cookies. Some third-party analytics tools may
              use standard cookies for anonymous usage statistics.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of non-essential data collection</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              MyMausam is not directed at children under 13. We do not knowingly collect
              personal information from children. If you believe a child has provided us with
              personal data, please contact us and we will promptly delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page
              with an updated date. Significant changes will be communicated through in-app
              notifications.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">11. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your data rights, contact us at{" "}
              <span className="text-[#00DDE5]">privacy@my-mausam.in</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
