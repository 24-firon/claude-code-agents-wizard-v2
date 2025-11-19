import Button from '@/components/ui/Button'

export const metadata = {
  title: 'Technology Stack - KI Agentur',
  description: 'Our cutting-edge technology stack: n8n, Claude Code, MCP, Docker, and more. See how we build AI automation that competitors can\'t match.',
}

export default function TechnologyPage() {
  const coretech = [
    {
      name: 'n8n',
      category: 'Workflow Orchestration',
      description: 'Advanced workflow automation platform that goes far beyond simple integrations. We use n8n for sophisticated business logic, error handling, and production-ready automation.',
      why: 'Visual debugging, webhook-driven architecture, self-hostable, and infinitely extensible. Perfect for complex automation.',
      useCases: ['Multi-system integrations', 'Real-time event processing', 'Complex business logic', 'API orchestration']
    },
    {
      name: 'Claude Code',
      category: 'AI Development',
      description: 'Anthropic\'s advanced AI coding assistant that enables autonomous development. We use Claude Code to build sophisticated AI agents and automation.',
      why: 'Long context windows, advanced reasoning, reliable code generation, and strong safety features. Leading edge of AI development.',
      useCases: ['Custom AI agents', 'Code generation', 'Autonomous workflows', 'Intelligent automation']
    },
    {
      name: 'Model Context Protocol (MCP)',
      category: 'Advanced Integration',
      description: 'Cutting-edge protocol for AI system integration. Enables context-aware AI that can access and manipulate data across systems.',
      why: 'Standardized AI integration, context preservation, security-first design. The future of AI tooling.',
      useCases: ['AI data access', 'Context-aware agents', 'System integration', 'Advanced AI capabilities']
    },
    {
      name: 'Docker',
      category: 'Secure Code Execution',
      description: 'Containerization platform for secure, isolated code execution. Critical for production AI systems that execute dynamic code.',
      why: 'Security isolation, reproducible environments, scalability, and production reliability.',
      useCases: ['Secure code execution', 'Environment isolation', 'Scalable deployment', 'Development consistency']
    }
  ]

  const supporting = [
    { name: 'Next.js', use: 'Modern web applications' },
    { name: 'React', use: 'UI development' },
    { name: 'TypeScript', use: 'Type-safe code' },
    { name: 'Python', use: 'AI/ML development' },
    { name: 'Node.js', use: 'Backend services' },
    { name: 'PostgreSQL', use: 'Relational data' },
    { name: 'MongoDB', use: 'Document storage' },
    { name: 'AWS/GCP', use: 'Cloud infrastructure' },
    { name: 'Vercel', use: 'Frontend deployment' },
    { name: 'Railway', use: 'Backend hosting' }
  ]

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-ki-black via-ki-midnight to-ki-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="text-ki-gold">Technology Stack</span>
          </h1>
          <p className="text-xl text-ki-gray max-w-3xl mx-auto mb-12">
            We use advanced tools that most agencies don't even know exist. This is how we deliver capabilities your competitors wish they had.
          </p>
          <Button href="/contact">Discuss your technical requirements</Button>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Our Technology Philosophy</h2>
            <div className="space-y-6 text-ki-gray text-lg">
              <p>
                We don't choose technology because it's popular or because everyone uses it. We choose tools that give our clients competitive advantage—even if they require more expertise to use effectively.
              </p>
              <p>
                Our stack is intentionally cutting-edge. We use n8n instead of Zapier because it enables complex production automation. We use Claude Code and MCP because they unlock AI capabilities that commodity tools can't provide.
              </p>
              <p>
                This approach means our clients get automation systems that competitors can't easily replicate. The technology choices themselves become part of the competitive moat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technologies */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Core Technologies</h2>

          <div className="space-y-12">
            {coretech.map((tech, index) => (
              <div
                key={tech.name}
                className="bg-ki-black/50 rounded-lg p-8 border border-ki-gold/20 hover:border-ki-gold/40 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-3xl font-bold text-ki-gold mb-2">{tech.name}</div>
                    <div className="text-ki-gray mb-4">{tech.category}</div>
                    <p className="text-ki-white">{tech.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-ki-gold mb-3">Why we chose it:</h4>
                    <p className="text-ki-gray">{tech.why}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-ki-gold mb-3">Use cases:</h4>
                    <ul className="space-y-2">
                      {tech.useCases.map((useCase) => (
                        <li key={useCase} className="text-ki-gray flex items-start">
                          <span className="text-ki-gold mr-2">•</span>
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting Stack */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Supporting Stack</h2>
          <p className="text-ki-gray text-center mb-12 max-w-2xl mx-auto">
            Our core technologies are supported by modern, production-ready tools for frontend, backend, and infrastructure.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {supporting.map((tech) => (
              <div key={tech.name} className="bg-ki-midnight p-6 rounded-lg text-center hover:border hover:border-ki-gold transition-all">
                <div className="font-semibold text-ki-gold mb-2">{tech.name}</div>
                <div className="text-sm text-ki-gray">{tech.use}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Approach */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Architecture Approach</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">Design Principles</h3>
              <ul className="space-y-4">
                {[
                  { title: 'Security First', desc: 'Isolated execution, encrypted data, secure authentication' },
                  { title: 'Production Ready', desc: 'Error handling, monitoring, logging, alerting' },
                  { title: 'Scalable', desc: 'Designed to handle growth without re-architecture' },
                  { title: 'Maintainable', desc: 'Clean code, documentation, testable systems' }
                ].map((principle) => (
                  <li key={principle.title}>
                    <div className="font-semibold">{principle.title}</div>
                    <div className="text-ki-gray">{principle.desc}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-ki-gold">Typical Architecture</h3>
              <div className="bg-ki-black/50 p-6 rounded-lg border border-ki-gold/20">
                <div className="space-y-4 font-mono text-sm">
                  <div><span className="text-ki-gold">Frontend</span> → Next.js + React + Tailwind</div>
                  <div><span className="text-ki-gold">API Layer</span> → Node.js + Express / Python + FastAPI</div>
                  <div><span className="text-ki-gold">Automation</span> → n8n workflows + Claude Code agents</div>
                  <div><span className="text-ki-gold">Database</span> → PostgreSQL / MongoDB</div>
                  <div><span className="text-ki-gold">Execution</span> → Docker containers</div>
                  <div><span className="text-ki-gold">Infrastructure</span> → AWS/GCP + Vercel/Railway</div>
                  <div><span className="text-ki-gold">Monitoring</span> → Logging + Alerting + Analytics</div>
                </div>
              </div>
              <p className="text-ki-gray text-sm mt-4">
                *Architecture varies by project requirements. This is a typical pattern, not a rigid template.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to leverage cutting-edge technology?</h2>
          <p className="text-xl text-ki-gray mb-8 max-w-2xl mx-auto">
            Let's discuss how our technology stack can give you competitive advantage.
          </p>
          <Button href="/contact">Schedule a technical discussion</Button>
        </div>
      </section>
    </div>
  )
}
