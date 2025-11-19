export const metadata = {
  title: 'Terms of Service - KI Agentur',
  description: 'Terms of service for using the KI Agentur website.',
}

export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
        <p className="text-ki-gray mb-12">Last updated: January 19, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">Acceptance of Terms</h2>
            <p className="text-ki-gray">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Use of Website</h2>
            <p className="text-ki-gray mb-4">
              This website is provided for informational and marketing purposes. You may use this website for lawful purposes only.
            </p>
            <p className="text-ki-gray mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-ki-gray space-y-2">
              <li>Use the website in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to any part of the website</li>
              <li>Use automated systems or software to extract data (scraping)</li>
              <li>Transmit any viruses, malware, or other harmful code</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with the proper functioning of the website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Intellectual Property</h2>
            <p className="text-ki-gray mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the property of KI Agentur or its content suppliers and is protected by international copyright laws.
            </p>
            <p className="text-ki-gray">
              You may not reproduce, distribute, modify, or create derivative works of any content without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Third-Party Links</h2>
            <p className="text-ki-gray">
              Our website may contain links to third-party websites or services that are not owned or controlled by KI Agentur. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Disclaimer of Warranties</h2>
            <p className="text-ki-gray mb-4">
              This website is provided "as is" without any representations or warranties, express or implied. KI Agentur makes no representations or warranties in relation to this website or the information and materials provided on this website.
            </p>
            <p className="text-ki-gray">
              Without prejudice to the generality of the foregoing paragraph, KI Agentur does not warrant that:
            </p>
            <ul className="list-disc list-inside text-ki-gray space-y-2">
              <li>This website will be constantly available, or available at all</li>
              <li>The information on this website is complete, true, accurate, or non-misleading</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Limitations of Liability</h2>
            <p className="text-ki-gray">
              KI Agentur will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special, or consequential loss or damage. Our liability for direct damages is limited to the fullest extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Service Terms</h2>
            <p className="text-ki-gray mb-4">
              These website Terms of Service are separate from any service agreements for professional services. Professional services are provided under separate written agreements that include specific terms, pricing, deliverables, and warranties.
            </p>
            <p className="text-ki-gray">
              Information provided on this website about services is for general informational purposes and does not constitute a binding offer or contract.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Modifications</h2>
            <p className="text-ki-gray">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this website. Your continued use of the website after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Governing Law</h2>
            <p className="text-ki-gray">
              These Terms of Service shall be governed by and construed in accordance with the laws of Germany. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of Germany.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
            <p className="text-ki-gray mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="text-ki-gray">
              <p>Email: <a href="mailto:hello@kiagentur.com" className="text-ki-gold hover:underline">hello@kiagentur.com</a></p>
              <p>Website: <a href="/contact" className="text-ki-gold hover:underline">Contact Form</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
