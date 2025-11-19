import Button from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Case Studies - KI Agentur',
  description: 'Real results from real clients. See how we deliver measurable ROI through advanced AI automation.',
}

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      slug: 'financial-reconciliation',
      title: 'Financial Reconciliation Automation',
      industry: 'FinTech',
      challenge: 'Manual reconciliation consuming 22 hours weekly',
      solution: 'Custom n8n workflow with multi-system integration',
      result: '95% time reduction, zero errors',
      impact: '22 hours → 30 minutes per week',
      tech: ['n8n', 'PostgreSQL', 'Docker'],
      featured: true
    },
    {
      slug: 'ai-customer-support',
      title: 'AI-Powered Customer Support Agent',
      industry: 'SaaS',
      challenge: 'Support team overwhelmed, slow response times',
      solution: 'Claude Code agent with MCP integration',
      result: '60% faster response times, 40% cost reduction',
      impact: 'First-response time: 4h → 1.5h',
      tech: ['Claude Code', 'MCP', 'n8n'],
      featured: true
    },
    {
      slug: 'legacy-modernization',
      title: 'Legacy System Modernization',
      industry: 'Manufacturing',
      challenge: 'Outdated systems preventing automation',
      solution: 'API integration layer + modern automation',
      result: 'Connected legacy systems to modern workflow',
      impact: '15 hours/week saved in manual data entry',
      tech: ['n8n', 'Node.js', 'Docker'],
      featured: false
    }
  ]

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-ki-black via-ki-midnight to-ki-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-ki-gold">Real Results</span> from Real Clients
          </h1>
          <p className="text-xl text-ki-gray max-w-3xl mx-auto">
            See how we deliver measurable ROI through advanced AI automation. Every case study includes technical details, business outcomes, and honest lessons learned.
          </p>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-ki-midnight to-ki-black p-12 rounded-lg border border-ki-gold">
            <div className="text-sm text-ki-gold mb-2">FEATURED CASE STUDY</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-4xl font-bold mb-4">{caseStudies[0].title}</h2>
                <div className="text-ki-gray mb-6">{caseStudies[0].industry}</div>

                <div className="space-y-4 mb-8">
                  <div>
                    <div className="text-ki-gold font-semibold mb-1">Challenge</div>
                    <div>{caseStudies[0].challenge}</div>
                  </div>
                  <div>
                    <div className="text-ki-gold font-semibold mb-1">Solution</div>
                    <div>{caseStudies[0].solution}</div>
                  </div>
                  <div>
                    <div className="text-ki-gold font-semibold mb-1">Result</div>
                    <div>{caseStudies[0].result}</div>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  {caseStudies[0].tech.map((tech) => (
                    <span key={tech} className="bg-ki-gold/10 text-ki-gold px-3 py-1 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>

                <Button href={`/case-studies/${caseStudies[0].slug}`}>Read Full Case Study →</Button>
              </div>

              <div className="flex items-center justify-center bg-ki-black/50 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-7xl font-bold text-ki-gold mb-4">95%</div>
                  <div className="text-2xl mb-2">Time Savings</div>
                  <div className="text-ki-gray">{caseStudies[0].impact}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Case Studies */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">All Case Studies</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <div key={study.slug} className="bg-ki-black rounded-lg p-8 border border-ki-gray/20 hover:border-ki-gold transition-colors">
                <div className="text-sm text-ki-gold mb-2">{study.industry}</div>
                <h3 className="text-2xl font-bold mb-4">{study.title}</h3>

                <div className="space-y-3 mb-6 text-ki-gray">
                  <div className="flex items-start">
                    <span className="text-ki-gold mr-2">•</span>
                    <span><strong>Challenge:</strong> {study.challenge}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-ki-gold mr-2">•</span>
                    <span><strong>Result:</strong> {study.result}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-ki-gold mr-2">•</span>
                    <span><strong>Impact:</strong> {study.impact}</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  {study.tech.map((tech) => (
                    <span key={tech} className="bg-ki-gold/10 text-ki-gold px-3 py-1 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>

                <Button href={`/case-studies/${study.slug}`} variant="ghost">
                  Read case study →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to create your own success story?</h2>
          <p className="text-xl text-ki-gray mb-8 max-w-2xl mx-auto">
            Let's discuss how we can deliver similar results for your business
          </p>
          <Button href="/contact">Schedule Consultation</Button>
        </div>
      </section>
    </div>
  )
}
