import { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Terms of Service — MyMausam 2.0",
  description: "Terms and conditions for using the MyMausam weather intelligence platform.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "August 29, 2026";

  return (
    <div className="min-h-screen bg-[#06345C] text-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black mb-2">Terms of Service</h1>
        <p className="text-sm text-white/50 mb-8">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-sm text-white/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using MyMausam 2.0 (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree, do not use the Service. The Service is operated
              by the MyMausam development team for public weather intelligence in India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Description of Service</h2>
            <p>
              MyMausam provides weather forecasting, alerts, air quality monitoring, agricultural
              advisories, and related meteorological services. Data is sourced from weatherstack,
              IMD (India Meteorological Department), SAFAR, and other official and third-party
              providers. The Service is provided &quot;as is&quot; and may be updated or modified at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. User Accounts</h2>
            <p>
              You may access the Service using demo authentication or by creating an account. You are
              responsible for maintaining the confidentiality of your credentials and for all
              activities under your account. You agree to provide accurate information and notify us
              of any unauthorised use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or its servers</li>
              <li>Scrape, crawl, or use automated tools to extract data without permission</li>
              <li>Redistribute official weather alerts without attribution</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Weather Data Disclaimer</h2>
            <p>
              Weather data displayed by MyMausam is sourced from third-party APIs and official
              agencies. While we strive for accuracy, we <strong>do not guarantee</strong> the
              completeness, reliability, or accuracy of any weather data, forecasts, or alerts.
              MyMausam is <strong>not a substitute</strong> for official IMD warnings. Always refer
              to IMD ({`<a href="https://mausam.imd.gov.in" className="text-[#00DDE5] underline">mausam.imd.gov.in</a>`})
              for authoritative weather information and emergency advisories.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, MyMausam and its contributors shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages, or
              any loss of profits or revenues, arising from your use of or inability to use the
              Service, including but not limited to reliance on weather data for safety-critical
              decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Intellectual Property</h2>
            <p>
              The Service, including its design, code, and original content, is owned by the MyMausam
              development team. Third-party data providers retain ownership of their respective data.
              You may not copy, modify, or distribute any part of the Service without prior written
              consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Changes will be posted on this page with
              an updated &quot;Last updated&quot; date. Your continued use of the Service after changes are
              posted constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <span className="text-[#00DDE5]">support@my-mausam.in</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
