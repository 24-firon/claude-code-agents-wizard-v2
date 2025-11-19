export const metadata = {
  title: 'Privacy Policy - KI Agentur',
  description: 'Privacy policy and data protection information for KI Agentur.',
}

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-ki-gray mb-12">Last updated: January 19, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">Overview</h2>
            <p className="text-ki-gray mb-4">
              KI Agentur ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or use our services.
            </p>
            <p className="text-ki-gray">
              We are GDPR compliant and respect your rights regarding your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Information We Collect</h2>

            <h3 className="text-2xl font-semibold mb-3 text-ki-gold">Information you provide to us:</h3>
            <ul className="list-disc list-inside text-ki-gray space-y-2 mb-4">
              <li>Contact information (name, email address, company name)</li>
              <li>Messages and inquiries you send through our contact form</li>
              <li>Newsletter subscription email addresses</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 text-ki-gold">Information collected automatically:</h3>
            <ul className="list-disc list-inside text-ki-gray space-y-2">
              <li>Website usage data (pages visited, time spent, navigation paths)</li>
              <li>Device information (browser type, operating system)</li>
              <li>IP address (anonymized)</li>
              <li>Referral source</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-ki-gray space-y-2">
              <li>To respond to your inquiries and provide requested information</li>
              <li>To send newsletters and updates (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To analyze website usage and performance</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Analytics & Cookies</h2>
            <p className="text-ki-gray mb-4">
              We use privacy-focused analytics (Plausible Analytics) that do not use cookies and do not track users across websites. This service provides us with anonymous, aggregated statistics about website usage.
            </p>
            <p className="text-ki-gray">
              We do not use third-party advertising cookies or tracking pixels.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Data Sharing & Third Parties</h2>
            <p className="text-ki-gray mb-4">
              We do not sell, rent, or share your personal information with third parties for their marketing purposes.
            </p>
            <p className="text-ki-gray mb-4">We may share data with:</p>
            <ul className="list-disc list-inside text-ki-gray space-y-2">
              <li>Service providers who help us operate our website (hosting, email services)</li>
              <li>Analytics providers (privacy-focused, anonymized data only)</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Your Rights (GDPR)</h2>
            <p className="text-ki-gray mb-4">Under GDPR, you have the right to:</p>
            <ul className="list-disc list-inside text-ki-gray space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Request your data in a portable format</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Withdraw consent:</strong> Unsubscribe from communications at any time</li>
            </ul>
            <p className="text-ki-gray mt-4">
              To exercise these rights, contact us at: <a href="mailto:privacy@kiagentur.com" className="text-ki-gold hover:underline">privacy@kiagentur.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Data Security</h2>
            <p className="text-ki-gray">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure hosting, and access controls.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Data Retention</h2>
            <p className="text-ki-gray">
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-ki-gray">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-ki-gray mb-4">
              For questions about this Privacy Policy or our data practices, contact us:
            </p>
            <div className="text-ki-gray">
              <p>Email: <a href="mailto:privacy@kiagentur.com" className="text-ki-gold hover:underline">privacy@kiagentur.com</a></p>
              <p>Website: <a href="/contact" className="text-ki-gold hover:underline">Contact Form</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
