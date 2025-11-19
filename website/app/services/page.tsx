import Button from '@/components/ui/Button'

export const metadata = {
  title: 'Services - KI Agentur',
  description: 'Premium AI engineering services: workflow automation, AI agent development, custom integrations, and strategic AI consulting.',
}

export default function ServicesPage() {
  const services = [
    {
      id: 'workflow-automation',
      title: 'Workflow Automation Engineering',
      description: 'Most companies use basic automation tools like Zapier. We go deeper. Using n8n\'s advanced workflow orchestration, we build production-ready automation that integrates with any system, handles complex logic, and scales with your business.',
      features: [
        'Multi-system integrations with error handling',
        'Complex conditional logic and branching',
        'Webhook-driven real-time automation',
        'Visual workflows your team can maintain',
        'Production monitoring and alerting'
      ],
      result: '15-25 hours saved per week on average'
    },
    {
      id: 'ai-development',
      title: 'AI Agent Development',
      description: 'Custom AI agents built with Claude Code and Model Context Protocol that provide capabilities your competitors simply don\'t have. We create intelligent systems that integrate with your workflows and data.',
      features: [
        'Custom Claude Code implementations',
        'Model Context Protocol integrations',
        'Context-aware AI automation',
        'API integration and data access',
        'Production-ready deployment'
      ],
      result: 'Unique capabilities that differentiate from competitors'
    },
    {
      id: 'integration',
      title: 'Custom System Integration',
      description: 'Connect legacy systems, modern SaaS tools, and custom applications into a unified automation ecosystem. We handle the complexity so your systems work together seamlessly.',
      features: [
        'API design and implementation',
        'Legacy system modernization',
        'Real-time data synchronization',
        'Authentication and security',
        'Error handling and monitoring'
      ],
      result: 'Unified systems that talk to each other effortlessly'
    },
    {
      id: 'consulting',
      title: 'Strategic AI Consulting',
      description: 'Not every problem needs custom development. We provide strategic guidance on AI capabilities, technology choices, and implementation approaches to ensure you invest wisely.',
      features: [
        'AI readiness assessment',
        'Technology evaluation and selection',
        'Architecture design and planning',
        'Build vs buy recommendations',
        'Implementation roadmap'
      ],
      result: 'Clear strategy and informed decisions'
    }
  ]

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-ki-black via-ki-midnight to-ki-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Services That Deliver <span className="text-ki-gold">Real Results</span>
          </h1>
          <p className="text-xl text-ki-gray max-w-3xl mx-auto">
            Premium AI engineering services using cutting-edge technology to give you competitive advantage
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div>
                  <h2 className="text-4xl font-bold mb-6">{service.title}</h2>
                  <p className="text-ki-gray mb-6 text-lg">{service.description}</p>

                  <h3 className="text-xl font-semibold text-ki-gold mb-4">What we deliver:</h3>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-ki-gray flex items-start">
                        <span className="text-ki-gold mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-ki-midnight p-4 rounded-lg mb-6">
                    <div className="text-sm text-ki-gold mb-1">Result:</div>
                    <div className="text-lg">{service.result}</div>
                  </div>

                  <Button href="/contact">Discuss your needs →</Button>
                </div>

                <div className="bg-ki-midnight rounded-lg p-12 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {index === 0 && '⚡'}
                      {index === 1 && '🤖'}
                      {index === 2 && '🔗'}
                      {index === 3 && '💡'}
                    </div>
                    <div className="text-2xl text-ki-gold font-semibold">{service.title.split(' ')[0]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How We Work</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: '1', title: 'Discovery', desc: 'Deep dive into your needs and technical requirements' },
              { step: '2', title: 'Architecture', desc: 'Design scalable solution with right technology choices' },
              { step: '3', title: 'Implementation', desc: 'Build production-ready systems with clean code' },
              { step: '4', title: 'Deployment', desc: 'Launch with monitoring and error handling' },
              { step: '5', title: 'Support', desc: 'Ongoing optimization and knowledge transfer' }
            ].map((phase) => (
              <div key={phase.step} className="text-center">
                <div className="w-16 h-16 bg-ki-gold/10 border-2 border-ki-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-ki-gold">{phase.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                <p className="text-ki-gray text-sm">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not Right For Everyone */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Not Right For Everyone</h2>
            <p className="text-xl text-ki-gray mb-8">
              We're selective about who we work with. Here's when we're probably NOT the right fit:
            </p>

            <div className="text-left space-y-4 mb-12">
              <div className="bg-ki-midnight p-6 rounded-lg">
                <div className="flex items-start">
                  <span className="text-ki-gold mr-4 text-2xl">✗</span>
                  <div>
                    <div className="font-semibold mb-2">Looking for the cheapest option</div>
                    <div className="text-ki-gray">Premium quality requires premium investment. We're not the budget choice.</div>
                  </div>
                </div>
              </div>

              <div className="bg-ki-midnight p-6 rounded-lg">
                <div className="flex items-start">
                  <span className="text-ki-gold mr-4 text-2xl">✗</span>
                  <div>
                    <div className="font-semibold mb-2">Need it done yesterday</div>
                    <div className="text-ki-gray">Quality takes time. We're fast, but we don't cut corners.</div>
                  </div>
                </div>
              </div>

              <div className="bg-ki-midnight p-6 rounded-lg">
                <div className="flex items-start">
                  <span className="text-ki-gold mr-4 text-2xl">✗</span>
                  <div>
                    <div className="font-semibold mb-2">Just want ChatGPT integration</div>
                    <div className="text-ki-gray">There are cheaper ways to add basic AI. We build advanced capabilities.</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xl mb-8">
              But if you value technical excellence, strategic partnership, and measurable results...
            </p>

            <Button href="/contact">Let's talk</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
