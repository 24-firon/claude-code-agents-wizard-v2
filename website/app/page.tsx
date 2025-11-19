import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-ki-black via-ki-midnight to-ki-black">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            The AI Capabilities Your <span className="text-ki-gold">Competitors</span> Wish They Had
          </h1>
          <p className="text-xl md:text-2xl text-ki-gray max-w-4xl mx-auto mb-12">
            We build cutting-edge AI automation using tools most agencies don't even know exist—n8n, Claude Code, and Model Context Protocol—delivering competitive advantage for tech-forward companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact">Schedule Consultation</Button>
            <Button href="/case-studies" variant="secondary">View Our Work</Button>
          </div>
          <p className="mt-8 text-ki-gray text-sm">Trusted by CTOs and business leaders at growth-stage companies across Europe</p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-ki-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-ki-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">Technical Excellence</h3>
              <ul className="text-ki-gray space-y-2">
                <li>Real depth, not ChatGPT wrappers</li>
                <li>Production-ready code</li>
                <li>Advanced tools and architecture</li>
              </ul>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-ki-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-ki-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">Strategic Partnership</h3>
              <ul className="text-ki-gray space-y-2">
                <li>Long-term focus on your success</li>
                <li>Knowledge transfer included</li>
                <li>Honest advice, transparent approach</li>
              </ul>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-ki-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-ki-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">Business Outcomes</h3>
              <ul className="text-ki-gray space-y-2">
                <li>Measurable ROI from AI</li>
                <li>Competitive advantage</li>
                <li>Time savings & efficiency</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Built with Cutting-Edge Tools</h2>
          <p className="text-ki-gray text-center mb-12 max-w-2xl mx-auto">
            We use advanced technologies that most agencies don't offer, giving our clients real competitive advantage.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { name: 'n8n', desc: 'Workflow Orchestration' },
              { name: 'Claude Code', desc: 'AI Development' },
              { name: 'Docker', desc: 'Secure Execution' },
              { name: 'MCP', desc: 'Advanced Integration' },
            ].map((tech) => (
              <div key={tech.name} className="text-center p-6 bg-ki-midnight rounded-lg hover:border hover:border-ki-gold transition-all">
                <div className="text-3xl font-bold text-ki-gold mb-2">{tech.name}</div>
                <div className="text-ki-gray text-sm">{tech.desc}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button href="/technology" variant="ghost">View Full Technology Stack →</Button>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-ki-black/50 p-8 rounded-lg aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-ki-gold mb-4">95%</div>
                <div className="text-2xl text-ki-white">Time Savings</div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6">
                How Our Client Reduced Manual Work from 22 Hours to 30 Minutes Weekly
              </h2>
              <div className="space-y-4 text-ki-gray mb-8">
                <div>
                  <span className="text-ki-gold font-semibold">Problem:</span> Manual reconciliation consuming 22 hours weekly
                </div>
                <div>
                  <span className="text-ki-gold font-semibold">Solution:</span> Custom n8n workflow with multi-system integration
                </div>
                <div>
                  <span className="text-ki-gold font-semibold">Result:</span> 95% time reduction, zero reconciliation errors
                </div>
              </div>
              <blockquote className="border-l-4 border-ki-gold pl-4 italic mb-8">
                "This completely transformed how our finance team operates. We went from spending entire days on reconciliation to having it done automatically with zero errors."
              </blockquote>
              <div className="flex gap-4">
                <Button href="/case-studies">Read Full Case Study</Button>
                <Button href="/case-studies" variant="secondary">More Cases</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Who We Serve</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-ki-midnight p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">The Technical CTO</h3>
              <ul className="text-ki-gray space-y-2 mb-6">
                <li>• Wants real technical depth</li>
                <li>• Evaluates technology choices</li>
                <li>• Respects advanced tools</li>
              </ul>
              <Button href="/services" variant="ghost">Discuss Tech →</Button>
            </div>

            <div className="bg-ki-midnight p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">The Strategic CEO</h3>
              <ul className="text-ki-gray space-y-2 mb-6">
                <li>• Needs clear ROI & outcomes</li>
                <li>• Values premium quality</li>
                <li>• Seeks strategic partners</li>
              </ul>
              <Button href="/services" variant="ghost">Explore Value →</Button>
            </div>

            <div className="bg-ki-midnight p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">The Product Leader</h3>
              <ul className="text-ki-gray space-y-2 mb-6">
                <li>• Needs unique capabilities</li>
                <li>• Wants fast delivery</li>
                <li>• Requires product thinking</li>
              </ul>
              <Button href="/services" variant="ghost">Speed to Market →</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-ki-midnight to-ki-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build AI Your Competitors Can't Match?
          </h2>
          <p className="text-xl text-ki-gray mb-12 max-w-2xl mx-auto">
            Let's discuss how cutting-edge AI automation can give you competitive advantage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button href="/contact">Schedule Consultation</Button>
            <Button href="/case-studies" variant="secondary">View All Case Studies</Button>
          </div>

          <div className="max-w-md mx-auto">
            <h3 className="text-xl mb-4">Subscribe for cutting-edge insights</h3>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded bg-ki-midnight text-ki-white border border-ki-gray/30 focus:border-ki-gold outline-none"
              />
              <Button variant="primary">Subscribe</Button>
            </form>
            <p className="text-ki-gray text-sm mt-2">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
