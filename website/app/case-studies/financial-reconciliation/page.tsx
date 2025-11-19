import Button from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Financial Reconciliation Automation Case Study - KI Agentur',
  description: 'How we reduced manual reconciliation from 22 hours to 30 minutes weekly using custom n8n workflows.',
}

export default function CaseStudyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-ki-black via-ki-midnight to-ki-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/case-studies" className="text-ki-gold hover:underline mb-4 inline-block">
              ← Back to Case Studies
            </Link>
            <div className="text-sm text-ki-gold mb-4">FINTECH • CASE STUDY</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How We Reduced Manual Reconciliation from 22 Hours to 30 Minutes Weekly
            </h1>
            <div className="flex gap-3 mb-8">
              {['n8n', 'PostgreSQL', 'Docker'].map((tech) => (
                <span key={tech} className="bg-ki-gold/10 text-ki-gold px-4 py-2 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-12 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Executive Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-ki-black p-6 rounded-lg">
                <div className="text-ki-gold font-semibold mb-2">Industry</div>
                <div>FinTech</div>
              </div>
              <div className="bg-ki-black p-6 rounded-lg">
                <div className="text-ki-gold font-semibold mb-2">Challenge</div>
                <div>22 hours/week manual work</div>
              </div>
              <div className="bg-ki-black p-6 rounded-lg">
                <div className="text-ki-gold font-semibold mb-2">Solution</div>
                <div>Custom n8n workflow</div>
              </div>
              <div className="bg-ki-black p-6 rounded-lg">
                <div className="text-ki-gold font-semibold mb-2">Result</div>
                <div className="text-2xl font-bold text-ki-gold">95%</div>
                <div className="text-sm">Time reduction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">The Challenge</h2>
            <div className="prose prose-invert max-w-none text-ki-gray text-lg space-y-4">
              <p>
                Our client, a fast-growing FinTech company, faced a problem common in their industry: financial reconciliation was essential but incredibly time-consuming.
              </p>
              <p>
                Their finance team spent <strong className="text-ki-white">22 hours every week</strong> manually comparing transaction data across three different systems:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Payment processor (Stripe)</li>
                <li>Banking system (proprietary API)</li>
                <li>Internal accounting platform (custom database)</li>
              </ul>
              <p>
                The process involved downloading CSV files, comparing data in Excel, manually flagging discrepancies, and updating records across all systems. It was:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-ki-white">Error-prone:</strong> Manual data entry led to regular mistakes</li>
                <li><strong className="text-ki-white">Frustrating:</strong> The finance team couldn't focus on strategic work</li>
                <li><strong className="text-ki-white">Expensive:</strong> Senior finance staff doing repetitive data entry</li>
                <li><strong className="text-ki-white">Risky:</strong> Delayed detection of discrepancies</li>
              </ul>
              <p>
                They had tried basic automation tools like Zapier, but found them too limited for their complex reconciliation logic and error handling requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Our Solution</h2>
            <div className="prose prose-invert max-w-none text-ki-gray text-lg space-y-6">
              <p>
                We built a production-ready n8n workflow that orchestrates the entire reconciliation process automatically.
              </p>

              <h3 className="text-2xl font-bold text-ki-white">Architecture</h3>
              <div className="bg-ki-black p-6 rounded-lg font-mono text-sm mb-6">
                <div className="space-y-2">
                  <div><span className="text-ki-gold">1. Data Collection</span> → Automated API calls to all 3 systems</div>
                  <div><span className="text-ki-gold">2. Data Normalization</span> → Transform into unified format</div>
                  <div><span className="text-ki-gold">3. Reconciliation Logic</span> → Match transactions, flag discrepancies</div>
                  <div><span className="text-ki-gold">4. Error Handling</span> → Retry logic, fallback mechanisms</div>
                  <div><span className="text-ki-gold">5. Notification</span> → Slack alerts for issues requiring human review</div>
                  <div><span className="text-ki-gold">6. Reporting</span> → Automated daily summary reports</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-ki-white">Key Technical Features</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Multi-system integration:</strong> Connected Stripe API, banking API, PostgreSQL database</li>
                <li><strong>Complex matching logic:</strong> Fuzzy matching for transaction descriptions, tolerance handling for timing differences</li>
                <li><strong>Error handling:</strong> Comprehensive retry logic, fallback mechanisms, detailed logging</li>
                <li><strong>Security:</strong> Encrypted credential storage, audit logging, Docker containerization</li>
                <li><strong>Monitoring:</strong> Real-time alerts, daily summary reports, anomaly detection</li>
              </ul>

              <h3 className="text-2xl font-bold text-ki-white">Why n8n?</h3>
              <p>
                We chose n8n over simpler tools because it enabled:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Visual debugging of complex workflows</li>
                <li>Custom JavaScript nodes for reconciliation logic</li>
                <li>Error handling sophisticated enough for financial data</li>
                <li>Self-hosting for data security compliance</li>
                <li>Team maintainability without developer dependency</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Results & Impact</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-ki-midnight p-8 rounded-lg text-center">
                <div className="text-5xl font-bold text-ki-gold mb-2">95%</div>
                <div className="text-ki-gray">Time Reduction</div>
                <div className="text-sm text-ki-gray mt-2">22h → 30min/week</div>
              </div>
              <div className="bg-ki-midnight p-8 rounded-lg text-center">
                <div className="text-5xl font-bold text-ki-gold mb-2">0</div>
                <div className="text-ki-gray">Errors</div>
                <div className="text-sm text-ki-gray mt-2">Zero manual entry mistakes</div>
              </div>
              <div className="bg-ki-midnight p-8 rounded-lg text-center">
                <div className="text-5xl font-bold text-ki-gold mb-2">6</div>
                <div className="text-ki-gray">Week ROI</div>
                <div className="text-sm text-ki-gray mt-2">Project paid for itself</div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-ki-gray text-lg space-y-4">
              <h3 className="text-2xl font-bold text-ki-white">Quantifiable Outcomes</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-ki-white">Time savings:</strong> 22 hours → 30 minutes per week (21.5 hours saved)</li>
                <li><strong className="text-ki-white">Cost savings:</strong> ~EUR 3,000/month in freed-up senior staff time</li>
                <li><strong className="text-ki-white">Error reduction:</strong> From 2-3 errors per week to zero</li>
                <li><strong className="text-ki-white">Faster detection:</strong> Discrepancies flagged within hours instead of days</li>
                <li><strong className="text-ki-white">ROI:</strong> Project cost recovered in 6 weeks</li>
              </ul>

              <h3 className="text-2xl font-bold text-ki-white">Client Testimonial</h3>
              <blockquote className="border-l-4 border-ki-gold pl-6 italic my-6">
                <p className="text-xl mb-4">
                  "This completely transformed how our finance team operates. We went from spending entire days on reconciliation to having it done automatically with zero errors. Our team can now focus on strategic financial planning instead of data entry."
                </p>
                <footer className="text-ki-gray not-italic">
                  — CFO, FinTech Company
                </footer>
              </blockquote>

              <h3 className="text-2xl font-bold text-ki-white">Long-Term Impact</h3>
              <p>
                Six months after deployment, the workflow continues to run flawlessly. The finance team has expanded the automation to include additional data sources, and the client is exploring similar automation for other manual processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for similar results?</h2>
          <p className="text-xl text-ki-gray mb-8 max-w-2xl mx-auto">
            Let's discuss how we can automate your manual processes and save your team significant time.
          </p>
          <div className="flex gap-4 justify-center">
            <Button href="/contact">Schedule Consultation</Button>
            <Button href="/case-studies" variant="secondary">More Case Studies</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
