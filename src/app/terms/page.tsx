import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Leadprospectrr Training Hub",
  description: "Terms of Service for Leadprospectrr Training Hub",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: June 28, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              Welcome to Leadprospectrr Training Hub. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Leadprospectrr Training Hub provides online training courses, educational content, and related services to help users develop skills in lead generation and business development. Our services include video lessons, downloadable materials, quizzes, and community features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To access certain features of our platform, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide accurate and complete information when creating your account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Be responsible for all activities that occur under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Payment and Subscription Terms</h2>
            <p className="mb-4">
              Some of our services require payment. By purchasing a subscription or course:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>You agree to pay all fees associated with your selected plan</li>
              <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
              <li>Refunds are provided in accordance with our refund policy</li>
              <li>We reserve the right to change pricing with notice to users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="mb-4">
              All content on Leadprospectrr Training Hub, including videos, text, graphics, logos, and course materials, is owned by us or our licensors and is protected by copyright and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Copy, distribute, or modify any content without our written permission</li>
              <li>Use our content for commercial purposes without authorization</li>
              <li>Remove any copyright or proprietary notices from our materials</li>
              <li>Share your account access with others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. User Conduct</h2>
            <p className="mb-4">
              You agree not to use our platform to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Upload or transmit harmful code or malware</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Engage in any activity that disrupts our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="mb-4">
              We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our discretion. Upon termination, your right to use our services will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
            <p className="mb-4">
              Our services are provided &quot;as is&quot; without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, Leadprospectrr Training Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="mb-4">
              We may update these Terms of Service from time to time. We will notify you of any material changes by posting the new terms on this page. Your continued use of our services after such changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p className="mb-4">
              These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which Leadprospectrr operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mb-4">
              Email: support@leadprospectrr.com<br />
              Website: https://hub.leadprospectrr.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
