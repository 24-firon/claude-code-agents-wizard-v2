import Button from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Blog - KI Agentur',
  description: 'Technical insights, AI automation best practices, and thought leadership from our engineering team.',
}

export default function BlogPage() {
  const posts = [
    {
      slug: 'production-ready-n8n',
      title: 'Building Production-Ready n8n Workflows: 5 Advanced Patterns',
      excerpt: 'There's a big gap between a working demo and a production-ready workflow. Here are the five patterns we use on every project to build n8n automation that doesn't break at 2am.',
      category: 'Technical Deep Dive',
      readTime: '12 min read',
      date: '2025-01-15',
      featured: true
    },
    {
      slug: 'why-not-chatgpt',
      title: 'Why Most "AI Consultants" Just Rebrand ChatGPT (And Why That's Not Enough)',
      excerpt: 'The harsh truth about commodity AI consulting and what it takes to build capabilities that actually provide competitive advantage.',
      category: 'Thought Leadership',
      readTime: '8 min read',
      date: '2025-01-10',
      featured: true
    },
    {
      slug: 'claude-code-mcp',
      title: 'Claude Code + Model Context Protocol: The Future of AI Development',
      excerpt: 'How we use cutting-edge tools to build AI agents that competitors can't easily replicate. A technical guide to MCP integration.',
      category: 'Technical Deep Dive',
      readTime: '15 min read',
      date: '2025-01-05',
      featured: false
    },
    {
      slug: 'roi-calculation',
      title: 'Calculating Real ROI from AI Automation: A Framework',
      excerpt: 'Beyond "time saved" — how to measure the full business impact of AI investments including opportunity cost, error reduction, and strategic value.',
      category: 'Business Strategy',
      readTime: '10 min read',
      date: '2024-12-28',
      featured: false
    }
  ]

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-ki-black via-ki-midnight to-ki-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Insights on <span className="text-ki-gold">AI Engineering</span>
          </h1>
          <p className="text-xl text-ki-gray max-w-3xl mx-auto mb-12">
            Technical deep dives, thought leadership, and honest insights from engineers building cutting-edge AI automation.
          </p>

          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto bg-ki-midnight p-8 rounded-lg">
            <h3 className="text-xl mb-4">Subscribe for weekly insights</h3>
            <form className="flex gap-2 mb-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded bg-ki-black text-ki-white border border-ki-gray/30 focus:border-ki-gold outline-none"
              />
              <Button variant="primary">Subscribe</Button>
            </form>
            <p className="text-ki-gray text-sm">Technical content, no marketing fluff. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {posts.filter(p => p.featured).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-ki-midnight p-8 rounded-lg hover:border hover:border-ki-gold transition-all group"
              >
                <div className="text-sm text-ki-gold mb-2">{post.category}</div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-ki-gold transition-colors">
                  {post.title}
                </h3>
                <p className="text-ki-gray mb-6">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-ki-gray">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-20 bg-ki-midnight">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">All Articles</h2>

          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-ki-black p-6 rounded-lg hover:border hover:border-ki-gold transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-ki-gold mb-2">{post.category}</div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-ki-gold transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-ki-gray">{post.excerpt}</p>
                  </div>
                  <div className="text-sm text-ki-gray md:text-right">
                    <div>{post.date}</div>
                    <div>{post.readTime}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Technical Deep Dives', count: 8 },
              { name: 'Business Strategy', count: 5 },
              { name: 'Thought Leadership', count: 6 },
              { name: 'Case Studies', count: 4 }
            ].map((category) => (
              <div
                key={category.name}
                className="bg-ki-midnight p-6 rounded-lg text-center hover:border hover:border-ki-gold transition-all cursor-pointer"
              >
                <div className="font-semibold mb-2">{category.name}</div>
                <div className="text-ki-gray text-sm">{category.count} articles</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
