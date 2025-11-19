'use client'

import Button from '@/components/ui/Button'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to your CRM/email service
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-ki-black via-ki-midnight to-ki-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Let's <span className="text-ki-gold">Talk</span>
          </h1>
          <p className="text-xl text-ki-gray max-w-3xl mx-auto">
            Ready to discuss how cutting-edge AI automation can give you competitive advantage? Let's start with a conversation.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send us a message</h2>

              {submitted && (
                <div className="bg-ki-gold/10 border border-ki-gold text-ki-gold p-4 rounded mb-6">
                  Thanks for reaching out! We'll get back to you within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded bg-ki-midnight text-ki-white border border-ki-gray/30 focus:border-ki-gold outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded bg-ki-midnight text-ki-white border border-ki-gray/30 focus:border-ki-gold outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded bg-ki-midnight text-ki-white border border-ki-gray/30 focus:border-ki-gold outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Tell us about your project *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded bg-ki-midnight text-ki-white border border-ki-gray/30 focus:border-ki-gold outline-none resize-none"
                  />
                </div>

                <Button variant="primary">Send Message</Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Other ways to reach us</h2>

              <div className="space-y-6 mb-12">
                <div className="bg-ki-midnight p-6 rounded-lg">
                  <h3 className="font-semibold text-ki-gold mb-2">Schedule a Call</h3>
                  <p className="text-ki-gray mb-4">
                    Prefer to jump straight into a conversation? Book a 30-minute consultation.
                  </p>
                  <Button href="https://calendly.com" variant="ghost">
                    View Calendar →
                  </Button>
                </div>

                <div className="bg-ki-midnight p-6 rounded-lg">
                  <h3 className="font-semibold text-ki-gold mb-2">Email</h3>
                  <p className="text-ki-gray">
                    <a href="mailto:hello@kiagentur.com" className="hover:text-ki-gold transition-colors">
                      hello@kiagentur.com
                    </a>
                  </p>
                </div>

                <div className="bg-ki-midnight p-6 rounded-lg">
                  <h3 className="font-semibold text-ki-gold mb-2">LinkedIn</h3>
                  <p className="text-ki-gray mb-2">Connect with us professionally</p>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ki-gold hover:underline"
                  >
                    Follow KI Agentur →
                  </a>
                </div>
              </div>

              <div className="bg-ki-midnight p-6 rounded-lg">
                <h3 className="font-semibold mb-4">What to expect:</h3>
                <ul className="space-y-3 text-ki-gray">
                  <li className="flex items-start">
                    <span className="text-ki-gold mr-2">✓</span>
                    <span>Response within 24 hours on business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ki-gold mr-2">✓</span>
                    <span>Discovery call to understand your needs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ki-gold mr-2">✓</span>
                    <span>Honest assessment of fit</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ki-gold mr-2">✓</span>
                    <span>No high-pressure sales tactics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ki-gold mr-2">✓</span>
                    <span>Confidentiality assured</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: 'What types of projects do you take on?',
                a: 'We focus on custom AI automation and workflow orchestration projects for growth-stage companies ($5M-$500M revenue). Typical projects range from EUR 50K-500K depending on scope.'
              },
              {
                q: 'How long does a typical project take?',
                a: 'Discovery to deployment: 6-12 weeks for most projects. We can move faster for urgent needs, but we never compromise on quality.'
              },
              {
                q: 'Do you work with companies outside Europe?',
                a: 'Yes! We serve clients globally, though we're based in Germany. Time zone coordination has never been an issue.'
              },
              {
                q: 'What's your pricing structure?',
                a: 'Project-based or retainer engagements. We provide transparent pricing after understanding your requirements. We're premium-positioned—not the cheapest, but excellent value for quality delivered.'
              },
              {
                q: 'Can you work with our existing systems?',
                a: 'Absolutely. We specialize in integration—connecting legacy systems, modern SaaS tools, and custom applications into unified automation.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-ki-black p-6 rounded-lg">
                <h3 className="font-semibold text-ki-gold mb-2">{faq.q}</h3>
                <p className="text-ki-gray">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
