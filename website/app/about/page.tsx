import Button from '@/components/ui/Button'

export const metadata = {
  title: 'About Us - KI Agentur',
  description: 'Premium AI engineering agency founded by Robin Bach Firon. Building cutting-edge automation for tech-forward companies.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-ki-black via-ki-midnight to-ki-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="text-ki-gold">KI Agentur</span>
          </h1>
          <p className="text-xl text-ki-gray max-w-3xl mx-auto">
            We're engineers who got tired of seeing great companies limited by mediocre AI implementations. So we built the agency we wish existed.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Our Story</h2>
            <div className="space-y-6 text-ki-gray text-lg">
              <p>
                KI Agentur was founded on a simple observation: most AI consulting delivers commodity solutions that don't provide real competitive advantage. Companies were paying premium prices for ChatGPT wrappers and basic automations they could build themselves.
              </p>
              <p>
                We saw a gap in the market for an engineering-first agency that actually uses cutting-edge tools—n8n for sophisticated workflow orchestration, Claude Code for advanced AI development, Model Context Protocol for integration capabilities most agencies can't deliver.
              </p>
              <p>
                Founded by Robin Bach Firon, KI Agentur brings together engineering expertise with a European sensibility: quality over quantity, precision over speed, long-term partnerships over transactional relationships.
              </p>
              <p>
                Today, we work with CTOs and business leaders at growth-stage companies who understand that premium AI engineering is an investment in competitive advantage, not a commodity purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Team</h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-ki-black rounded-lg p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="aspect-square bg-ki-midnight rounded-lg flex items-center justify-center mb-4">
                    <div className="text-6xl">👤</div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold mb-2">Robin Bach Firon</h3>
                  <div className="text-ki-gold mb-4">Founder & Lead Engineer</div>
                  <p className="text-ki-gray mb-4">
                    Engineering leader with deep expertise in AI automation, workflow orchestration, and system architecture. Built KI Agentur to bring cutting-edge AI capabilities to ambitious companies.
                  </p>
                  <div className="space-y-2 text-ki-gray">
                    <div><strong>Expertise:</strong> n8n, Claude Code, MCP, System Architecture</div>
                    <div><strong>Background:</strong> Implementing AI automation at scale</div>
                    <div><strong>Philosophy:</strong> Quality over quantity, technical excellence without compromise</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-ki-gray">
              We work with a network of specialized engineers and advisors based on project needs.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-ki-midnight p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">Technical Excellence</h3>
              <p className="text-ki-gray">
                We use cutting-edge tools before they're mainstream. Code quality and architecture matter. Production-ready, not prototype quality.
              </p>
            </div>

            <div className="bg-ki-midnight p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">Radical Transparency</h3>
              <p className="text-ki-gray">
                We show our technology stack openly. Honest about when we're NOT the right fit. Clear communication about process and pricing.
              </p>
            </div>

            <div className="bg-ki-midnight p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">Strategic Partnership</h3>
              <p className="text-ki-gray">
                Client success is our success. Knowledge transfer, not dependency. Long-term relationships over one-off projects.
              </p>
            </div>

            <div className="bg-ki-midnight p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">European Craftsmanship</h3>
              <p className="text-ki-gray">
                Attention to detail. Quality over quantity. Precision in execution. Timeless design principles applied to AI engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why KI Agentur */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">How We're Different</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-ki-black p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-ki-gold">Engineering-First Approach</h3>
              <p className="text-ki-gray">
                We're engineers who do AI, not consultants who learned AI. Technical depth is our competitive advantage.
              </p>
            </div>

            <div className="bg-ki-black p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-ki-gold">Cutting-Edge Technology</h3>
              <p className="text-ki-gray">
                We use tools that provide real differentiation—n8n, Claude Code, MCP. Our stack itself is a competitive advantage for clients.
              </p>
            </div>

            <div className="bg-ki-black p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-ki-gold">Partnership Model</h3>
              <p className="text-ki-gray">
                Long-term thinking, knowledge transfer, honest advice even when it costs us revenue. We're selective about who we work with.
              </p>
            </div>

            <div className="bg-ki-black p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-ki-gold">Premium Positioning</h3>
              <p className="text-ki-gray">
                We're not the cheapest option, and that's intentional. Quality AI engineering requires proper investment. We work with clients who value excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to work together?</h2>
          <p className="text-xl text-ki-gray mb-8 max-w-2xl mx-auto">
            Let's discuss how our approach can help your business gain competitive advantage through AI.
          </p>
          <Button href="/contact">Schedule Consultation</Button>
        </div>
      </section>
    </div>
  )
}
