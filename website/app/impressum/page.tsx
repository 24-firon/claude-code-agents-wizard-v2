export const metadata = {
  title: 'Impressum - KI Agentur',
  description: 'Legal notice and company information for KI Agentur.',
}

export default function ImpressumPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-12">Impressum</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-ki-gold">Company Information</h2>
            <div className="text-ki-gray space-y-2">
              <p><strong>Company Name:</strong> KI Agentur</p>
              <p><strong>Represented by:</strong> Robin Bach Firon</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-ki-gold">Contact</h2>
            <div className="text-ki-gray space-y-2">
              <p><strong>Email:</strong> <a href="mailto:hello@kiagentur.com" className="text-ki-gold hover:underline">hello@kiagentur.com</a></p>
              <p><strong>Website:</strong> <a href="https://kiagentur.com" className="text-ki-gold hover:underline">kiagentur.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-ki-gold">Address</h2>
            <div className="text-ki-gray">
              <p>[Company Address]</p>
              <p>[City, Postal Code]</p>
              <p>Germany</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-ki-gold">VAT Identification Number</h2>
            <div className="text-ki-gray">
              <p>VAT ID: [VAT Number] (if applicable)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-ki-gold">Responsible for Content</h2>
            <div className="text-ki-gray">
              <p>Robin Bach Firon</p>
              <p>Responsible for content according to § 55 Abs. 2 RStV</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-ki-gold">Dispute Resolution</h2>
            <div className="text-ki-gray">
              <p className="mb-4">
                The European Commission provides a platform for online dispute resolution (OS):
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-ki-gold hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>
                We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-ki-gold">Liability for Content</h2>
            <div className="text-ki-gray">
              <p className="mb-4">
                As a service provider, we are responsible for our own content on these pages in accordance with general law. However, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
              </p>
              <p>
                Obligations to remove or block the use of information under general law remain unaffected. Liability in this regard is only possible from the time of knowledge of a specific legal violation. Upon becoming aware of such violations, we will remove this content immediately.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-ki-gold">Liability for Links</h2>
            <div className="text-ki-gray">
              <p className="mb-4">
                Our website contains links to external websites over which we have no control. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.
              </p>
              <p>
                The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking. However, permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of a legal violation. Upon becoming aware of legal violations, we will remove such links immediately.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-ki-gold">Copyright</h2>
            <div className="text-ki-gray">
              <p className="mb-4">
                The content and works created by the site operators on these pages are subject to German copyright law. The duplication, processing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.
              </p>
              <p>
                Downloads and copies of this site are only permitted for private, non-commercial use. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, we ask that you notify us accordingly. Upon becoming aware of legal violations, we will remove such content immediately.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
