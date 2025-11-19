import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ki-black border-t border-ki-midnight">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-ki-gold font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-ki-gray hover:text-ki-gold transition-colors">About</Link></li>
              <li><Link href="/about#team" className="text-ki-gray hover:text-ki-gold transition-colors">Team</Link></li>
              <li><Link href="/contact" className="text-ki-gray hover:text-ki-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-ki-gold font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services#workflow-automation" className="text-ki-gray hover:text-ki-gold transition-colors">Workflow Automation</Link></li>
              <li><Link href="/services#ai-development" className="text-ki-gray hover:text-ki-gold transition-colors">AI Agent Development</Link></li>
              <li><Link href="/services#integration" className="text-ki-gray hover:text-ki-gold transition-colors">Custom Integration</Link></li>
              <li><Link href="/services" className="text-ki-gray hover:text-ki-gold transition-colors">View All Services</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-ki-gold font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/case-studies" className="text-ki-gray hover:text-ki-gold transition-colors">Case Studies</Link></li>
              <li><Link href="/blog" className="text-ki-gray hover:text-ki-gold transition-colors">Blog</Link></li>
              <li><Link href="/technology" className="text-ki-gray hover:text-ki-gold transition-colors">Technology Stack</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-ki-gold font-semibold mb-4">Legal & Social</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-ki-gray hover:text-ki-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/impressum" className="text-ki-gray hover:text-ki-gold transition-colors">Impressum</Link></li>
              <li><Link href="/terms" className="text-ki-gray hover:text-ki-gold transition-colors">Terms of Service</Link></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-ki-gray hover:text-ki-gold transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ki-midnight text-center text-ki-gray text-sm">
          <p>&copy; 2025 KI Agentur. All rights reserved.</p>
          <p className="mt-2">Built with n8n, Claude Code, and Docker</p>
        </div>
      </div>
    </footer>
  )
}
