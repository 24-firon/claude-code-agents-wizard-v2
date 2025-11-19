# System Architecture Document: KI Agentur Marketing Website

**Version**: 1.0
**Date**: 2025-11-19
**Architect**: Software Architect
**Status**: Complete & Ready for Implementation

---

## Executive Summary

KI Agentur's marketing website is a high-performance, content-driven platform designed to convert tech decision-makers (CTOs, CEOs, Product Leaders) into qualified leads for premium AI engineering services. The architecture prioritizes **technical credibility**, **performance excellence**, and **seamless lead conversion** through a modern, scalable technology stack.

### Key Architecture Decisions

- **Frontend**: Next.js 14 (App Router) with React 18, TypeScript, and Tailwind CSS
- **CMS**: Sanity.io (headless) for flexible content management
- **Analytics**: Plausible Analytics (privacy-first, GDPR compliant)
- **Hosting**: Vercel (Next.js optimized, global CDN)
- **Forms & Email**: Resend for transactional emails, n8n for workflow automation
- **Performance Target**: <2 seconds page load time (demonstrates technical excellence)
- **Accessibility**: WCAG 2.1 AA compliance (exceeding to AAA on primary text)

### Related Documents

- **Product Vision**: `/home/user/claude-code-agents-wizard-v2/product-vision-ki-agentur.md`
- **PRD**: `/home/user/claude-code-agents-wizard-v2/prd-ki-agentur.md`
- **Brand Guidelines**: `/home/user/claude-code-agents-wizard-v2/brand-guidelines-ki-agentur.md`
- **UX Design**: `/home/user/claude-code-agents-wizard-v2/ux-design-ki-agentur.md`
- **UI Design**: `/home/user/claude-code-agents-wizard-v2/ui-design-ki-agentur.md`

---

## 1. Architecture Overview

### 1.1 System Type: Static Content Site with Dynamic Forms

**Classification**: Hybrid JAMstack + serverless with real-time data capabilities

This is a **content-first marketing website** with:
- Static pre-rendered pages (case studies, blog, services) for speed
- Dynamic form handling for lead capture
- Real-time CMS integration for content updates
- Integration with external services (CRM, email, analytics)

### 1.2 Architectural Style: Next.js App Router with Headless CMS

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KI AGENTUR WEBSITE ARCHITECTURE                  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                  FRONTEND LAYER (Next.js 14)                 │  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │  │
│  │  │   React      │  │  TypeScript  │  │  Tailwind    │      │  │
│  │  │  Components  │  │   Type       │  │     CSS      │      │  │
│  │  │              │  │   Safety     │  │  Styling     │      │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │  │
│  │                                                              │  │
│  │  App Router (Pages)                                         │  │
│  │  ├─ / (homepage)                                            │  │
│  │  ├─ /services                                               │  │
│  │  ├─ /technology                                             │  │
│  │  ├─ /case-studies + individual case study pages            │  │
│  │  ├─ /about                                                  │  │
│  │  ├─ /blog + individual post pages                          │  │
│  │  ├─ /contact                                                │  │
│  │  └─ Legal pages (/privacy, /impressum, /terms)            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                 ▲                                   │
│                                 │ API Routes                        │
│                                 │ (/api/contact, /api/subscribe)   │
│  ┌──────────────────────────────┴───────────────────────────────┐  │
│  │                    API/MIDDLEWARE LAYER                      │  │
│  │                                                               │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │  │
│  │  │ Form Handler   │  │ CRM Integration│  │  Analytics   │  │  │
│  │  │ Validation &   │  │ Lead creation, │  │  Event       │  │  │
│  │  │ Submission     │  │ scoring        │  │  Tracking    │  │  │
│  │  └────────────────┘  └────────────────┘  └──────────────┘  │  │
│  │                                                               │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │  │
│  │  │ Email Service  │  │ n8n Workflows  │  │ Error        │  │  │
│  │  │ (Resend)       │  │ Orchestration  │  │ Handling     │  │  │
│  │  └────────────────┘  └────────────────┘  └──────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│          ▲                    ▲                    ▲                │
│          │ Content API       │ Webhooks          │ Events          │
│  ┌───────┴────────────────┬──┴────────────┬─────┴────────────┐    │
│  │                        │               │                   │    │
│  │  ┌──────────────┐  ┌──┴──────────┐  ┌┴────────────┐  ┌──────┐ │
│  │  │  Sanity CMS  │  │  Vercel API │  │ Plausible   │  │ Resend
│  │  │              │  │   (Forms)   │  │ Analytics   │  │       │
│  │  │ - Blog posts │  │             │  │             │  │ Email │
│  │  │ - Case       │  │ Next.js     │  │ Privacy-    │  │ Service
│  │  │   Studies    │  │ Serverless  │  │ first GDPR  │  │       │
│  │  │ - Pages      │  │ Functions   │  │ compliant   │  │       │
│  │  │ - Team bios  │  │             │  │             │  │       │
│  │  └──────────────┘  └─────────────┘  └─────────────┘  └──────┘ │
│  └──────────────────────────────────────────────────────────────┘  │
│                                 ▲                                   │
│         ┌───────────────────────┴────────────────────────────┐     │
│         │                                                    │     │
│  ┌──────▼──────────┐  ┌──────────────┐  ┌────────────────┐ │     │
│  │ External APIs   │  │   CRM        │  │  Email Provider│ │     │
│  │ (HubSpot/       │  │  Integration │  │  (ConvertKit)  │ │     │
│  │ Pipedrive/      │  │              │  │                │ │     │
│  │ Airtable)       │  │ Lead mgmt,   │  │ Newsletter     │ │     │
│  │                 │  │ scoring,     │  │ automation     │ │     │
│  │ Optional:       │  │ pipeline     │  │                │ │     │
│  │ - Calendar      │  │              │  │ Double opt-in  │ │     │
│  │ - Payment proc. │  └──────────────┘  │ compliance     │ │     │
│  │ - Auth provider │                    └────────────────┘ │     │
│  └────────────────┘                                        │     │
│                                                             │     │
│  ┌───────────────────────────────────────────────────────┘     │
│  │                                                              │
│  │  ┌──────────────────────────────────────────────────────┐  │
│  │  │          INFRASTRUCTURE LAYER (Vercel)               │  │
│  │  │                                                       │  │
│  │  │  • Next.js on Edge Runtime (fast global serving)   │  │
│  │  │  • Automatic SSL/TLS certificates                  │  │
│  │  │  • CDN for static assets (images, CSS, JS)         │  │
│  │  │  • Automatic scaling based on traffic              │  │
│  │  │  • Build cache & deployment pipeline               │  │
│  │  │  • Environment variable management                 │  │
│  │  │  • Monitoring & analytics                          │  │
│  │  │  • Preview deployments for testing                 │  │
│  │  └──────────────────────────────────────────────────────┘  │
│  │                                                              │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Key Architectural Principles

1. **Performance First**: <2 second load time demonstrates technical excellence
   - Static pre-rendering for content pages
   - Edge caching for global distribution
   - Image optimization pipeline
   - Code splitting by route

2. **Content Flexibility**: Headless CMS enables rapid content updates without code changes
   - Sanity.io for flexible content modeling
   - Preview mode for content team
   - Webhook-triggered rebuilds
   - Version control for content

3. **Lead Conversion Optimization**: Forms and CTAs deeply integrated
   - Zero-friction contact forms
   - Calendar booking integration
   - Automatic lead routing to CRM
   - Email automation sequences

4. **Technical Credibility**: Code quality and architecture reflect positioning
   - TypeScript for type safety
   - Proper error handling and logging
   - Security best practices
   - Accessible, standards-compliant code

5. **Privacy First**: GDPR compliance and privacy-focused analytics
   - Plausible Analytics (no cookies required)
   - Form data encryption
   - Transparent data policies
   - Easy user data access/deletion

6. **Maintainability**: Clear separation of concerns and modular design
   - Component-based architecture
   - Reusable hooks and utilities
   - Consistent patterns throughout
   - Well-documented code

---

## 2. Technology Stack Decisions

### 2.1 Frontend Stack

#### Framework: **Next.js 14 (App Router)**

**Choice**: Next.js 14 with React 18 and App Router

**Rationale**:
- ✅ Built-in image optimization (next/image)
- ✅ Automatic code splitting and tree shaking
- ✅ App Router for modern, intuitive routing
- ✅ Server and Client components (mixed rendering)
- ✅ API routes (serverless functions)
- ✅ Built-in SEO features (metadata, sitemap, robots.txt)
- ✅ Excellent TypeScript support
- ✅ Edge Runtime support for global distribution
- ✅ Vercel deployment optimization (same company)
- ✅ Large ecosystem and community support

**Trade-offs**:
- Learning curve for App Router (if team used Pages Router before)
- Server/Client component boundary requires careful planning
- Initial setup more complex than static site generators

**Alternatives Considered**:
- **Astro**: Excellent performance, less flexible for interactive forms
- **SvelteKit**: Great DX, smaller ecosystem
- **Nuxt/Vue**: More opinionated, not required for this project

#### Type Safety: **TypeScript**

**Rationale**:
- Full type safety for React props and API responses
- Better IDE autocomplete and error catching
- Improved developer experience
- Self-documenting code

**Implementation**:
- Strict mode enabled (`strict: true`)
- No `any` types (use `unknown` if needed)
- Shared type definitions in `/types` directory
- Generated types from Sanity schema

#### Styling: **Tailwind CSS**

**Choice**: Tailwind CSS v3 with PostCSS

**Rationale**:
- ✅ Utility-first approach accelerates development
- ✅ Small bundle size with PurgeCSS
- ✅ Dark mode support (our brand requirement)
- ✅ Excellent responsive design utilities
- ✅ Design tokens align with brand guidelines
- ✅ No CSS-in-JS overhead
- ✅ Works seamlessly with Next.js

**Configuration**:
```tailwind
// tailwind.config.ts
export default {
  darkMode: 'class', // Manual dark mode toggle
  theme: {
    extend: {
      colors: {
        'ki-gold': '#FFB800',
        'ki-black': '#0A0A0A',
        'ki-gray': '#CCCCCC',
        'ki-midnight': '#1F1F1F',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

#### UI Components: **Headless UI + Custom Components**

**Choice**: Headless UI for accessible primitives + custom branded components

**Rationale**:
- Headless UI provides accessible foundations
- Custom components enforce brand consistency
- Full control over styling and behavior
- Lightweight dependencies

**Components Architecture**:
```
src/components/
├── ui/                       # Design system components
│   ├── Button.tsx            # Reusable button with variants
│   ├── Input.tsx             # Form input with validation
│   ├── Card.tsx              # Reusable card component
│   ├── Modal.tsx             # Dialog/modal component
│   ├── Badge.tsx             # Tag/label component
│   └── ...
├── layout/                   # Layout components
│   ├── Header.tsx            # Navigation header
│   ├── Footer.tsx            # Footer with links
│   ├── Navigation.tsx        # Nav menu component
│   └── ...
├── features/                 # Feature-specific components
│   ├── HeroSection.tsx       # Reusable hero
│   ├── CaseStudyCard.tsx     # Case study preview
│   ├── ContactForm.tsx       # Lead capture form
│   ├── BlogCard.tsx          # Blog post preview
│   └── ...
└── common/                   # Shared components
    ├── SEO.tsx               # Meta tags & head
    ├── Image.tsx             # Optimized image wrapper
    └── ...
```

#### State Management: **React Context + TanStack Query**

**Server State** (data from backend/CMS):
- TanStack Query (React Query) for caching and synchronization
- Automatic stale-while-revalidate behavior
- Optimistic updates for forms
- Background refetch of stale data

**Client State** (UI state):
- React's built-in useState for component-level state
- Context API for global state if needed
- Server Components for server-only state

**Example**:
```tsx
// Using TanStack Query for CMS content
const { data: posts, isLoading } = useQuery({
  queryKey: ['blog-posts'],
  queryFn: () => sanityClient.fetch(`*[_type == "post"]`),
  staleTime: 1000 * 60 * 10, // 10 minutes
  gcTime: 1000 * 60 * 30,     // 30 minutes (formerly cacheTime)
})
```

#### Build Tool: **Vercel's Built-in Build System**

**Rationale**:
- Next.js projects deploy seamlessly to Vercel
- Zero-config build optimization
- Automatic environment management
- Built-in monitoring and analytics

---

### 2.2 Backend & API Stack

#### API Routes: **Next.js API Routes (Serverless Functions)**

**Implementation**:
```typescript
// pages/api/contact.ts - Serverless function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validate input
  const { name, email, message } = req.body

  // Send email via Resend
  const result = await resend.emails.send({
    from: 'hello@kiagentur.com',
    to: email,
    subject: 'We received your message',
    react: <ContactConfirmation name={name} />,
  })

  // Create lead in CRM via n8n
  await fetch('https://n8n.kiagentur.com/webhook/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  })

  return res.status(200).json({ success: true })
}
```

#### Form Handling: **React Hook Form + Zod Validation**

**Implementation**:
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message too short'),
  budget: z.enum(['<50k', '50-100k', '100-250k', '250k+']).optional(),
})

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data) => {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields with error display */}
    </form>
  )
}
```

#### Email Service: **Resend**

**Choice**: Resend for transactional emails

**Rationale**:
- ✅ React email templates (type-safe)
- ✅ Developer-friendly API
- ✅ Good deliverability
- ✅ Email preview feature
- ✅ Usage-based pricing
- ✅ GDPR compliant

**Email Types**:
1. **Contact Form Confirmation**: Automatic response to inquiry
2. **Admin Notification**: Alert team of new lead
3. **Newsletter Confirmation**: Double opt-in welcome
4. **Lead Follow-up**: Automated nurture sequences (via ConvertKit)

#### Workflow Automation: **n8n Integration**

**Purpose**: Connect CRM, email, and other systems

**Workflows**:
1. **Contact Form → CRM Lead Creation**
   - Trigger: Contact form submission webhook
   - Actions: Create contact in HubSpot/Pipedrive, tag by source
   - Outcome: Lead automatically added to pipeline

2. **Newsletter Subscription → Email Platform**
   - Trigger: Newsletter signup form
   - Actions: Add to ConvertKit, send welcome email
   - Outcome: Subscriber in email nurture sequence

3. **Calendar Booking → CRM + Calendar**
   - Trigger: Calendly booking webhook
   - Actions: Create activity in CRM, sync to Google Calendar
   - Outcome: Team notified of new meeting

**n8n Setup**:
- Self-hosted or cloud instance
- Webhooks for form submissions
- API connections to external services
- Error handling and notifications

---

### 2.3 CMS Stack

#### Headless CMS: **Sanity.io**

**Choice**: Sanity.io for flexible, API-first content management

**Rationale**:
- ✅ Flexible content modeling with custom types
- ✅ GROQ query language (powerful filtering)
- ✅ Real-time preview in Next.js
- ✅ Webhooks for automatic rebuilds
- ✅ CDN for asset delivery
- ✅ Generous free tier
- ✅ Excellent TypeScript support
- ✅ Collaborative content editing
- ✅ Version history and rollback

**Schema Design** (TypeScript):
```typescript
// schemas/post.ts
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaDescription', type: 'text' },
        { name: 'keywords', type: 'array', of: [{ type: 'string' }] },
      ],
    },
  ],
}
```

**Content Types**:
1. **Pages**: Homepage, Services, Technology, About, Contact
2. **Blog Posts**: Technical content, thought leadership
3. **Case Studies**: Client success stories with metrics
4. **Team Members**: Bio, photo, credentials
5. **Services**: Service descriptions and details
6. **Testimonials**: Client quotes and feedback

**Content Fetching** (in Next.js):
```typescript
// lib/sanity.ts
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
})

// Fetch blog posts
export async function getPosts() {
  return await sanityClient.fetch(`*[_type == "post"] | order(publishedAt desc)`)
}

// Fetch single post
export async function getPostBySlug(slug: string) {
  return await sanityClient.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug })
}
```

**Preview Mode** (for content team):
```typescript
// pages/api/preview.ts
export default function preview(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.secret !== process.env.PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  res.setPreviewData({})
  res.writeHead(307, { Location: '/' })
  res.end()
}
```

---

### 2.4 Analytics & Monitoring

#### Analytics: **Plausible Analytics**

**Choice**: Plausible Analytics (privacy-first)

**Rationale**:
- ✅ GDPR compliant (no cookies required)
- ✅ CCPA compliant
- ✅ Privacy-first (doesn't track individuals)
- ✅ Simple, clean dashboard
- ✅ Event tracking for custom metrics
- ✅ Goal conversions
- ✅ No cookie banner required
- ✅ European hosting option

**Implementation**:
```tsx
// app/layout.tsx
import { Suspense } from 'react'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script
          defer
          data-domain="kiagentur.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Event Tracking**:
```typescript
// lib/analytics.ts
export const trackEvent = (eventName: string, props?: Record<string, any>) => {
  if (window.plausible) {
    window.plausible(eventName, { props })
  }
}

// Usage in components
<button onClick={() => trackEvent('Schedule_Consultation_Clicked')}>
  Schedule Consultation
</button>
```

**Events to Track**:
1. **CTA Clicks**: "Schedule_Consultation", "View_Case_Studies"
2. **Form Interactions**: "Contact_Form_Started", "Contact_Form_Submitted"
3. **Content Engagement**: "Blog_Post_Read", "Case_Study_Read"
4. **Conversions**: "Lead_Captured", "Newsletter_Signup"
5. **Navigation**: "Page_View", "Scroll_Depth"

#### Error Tracking: **Sentry.io** (Optional)

**For production error monitoring**:
- Capture JavaScript errors
- Track API failures
- User session replay
- Performance monitoring
- Release tracking

---

### 2.5 Hosting & Deployment

#### Hosting: **Vercel**

**Choice**: Vercel for Next.js hosting

**Rationale**:
- ✅ Made by Next.js creators, perfectly optimized
- ✅ Edge Network for global distribution
- ✅ Automatic SSL certificates
- ✅ CI/CD built-in (GitHub integration)
- ✅ Automatic deployments on git push
- ✅ Preview deployments for testing
- ✅ Environment variables management
- ✅ Analytics and monitoring
- ✅ Generous free tier for starting
- ✅ Scales automatically with traffic

**Deployment Process**:
1. Push to GitHub `main` branch
2. Vercel detects changes automatically
3. Runs build and tests
4. Creates preview deployment (optional)
5. Deploys to production
6. Automatic SSL and CDN propagation

**Environment Configuration**:

```bash
# .env.local (development)
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx
PLAUSIBLE_DOMAIN=kiagentur.com
RESEND_API_KEY=xxx

# Vercel Environment Variables (via dashboard)
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
PLAUSIBLE_DOMAIN
RESEND_API_KEY
N8N_WEBHOOK_URL
CRM_API_KEY (if using HubSpot/Pipedrive API directly)
```

#### Domain & DNS

**Domain**: `kiagentur.com` (or preferred domain)

**DNS Configuration**:
- A/AAAA records pointing to Vercel nameservers
- MX records for email (if hosting email)
- SPF, DKIM, DMARC records for email authentication

**SSL/HTTPS**: Automatic via Vercel (Let's Encrypt)

---

## 3. Component Architecture

### 3.1 Frontend Component Structure

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Homepage
│   ├── (pages)/                   # Route group for main pages
│   │   ├── services/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx           # /services
│   │   ├── technology/
│   │   │   └── page.tsx           # /technology
│   │   ├── about/
│   │   │   └── page.tsx           # /about
│   │   └── contact/
│   │       └── page.tsx           # /contact
│   ├── (blog)/                    # Blog route group
│   │   ├── blog/
│   │   │   └── page.tsx           # /blog (index)
│   │   └── blog/[slug]/
│   │       └── page.tsx           # /blog/[slug] (individual posts)
│   ├── (case-studies)/
│   │   ├── case-studies/
│   │   │   └── page.tsx           # /case-studies (index)
│   │   └── case-studies/[slug]/
│   │       └── page.tsx           # /case-studies/[slug]
│   ├── api/                       # API routes
│   │   ├── contact/
│   │   │   └── route.ts           # POST /api/contact
│   │   ├── subscribe/
│   │   │   └── route.ts           # POST /api/subscribe
│   │   └── webhooks/
│   │       ├── sanity/
│   │       │   └── route.ts       # Sanity webhook handler
│   │       └── calendly/
│   │           └── route.ts       # Calendly booking webhook
│   ├── (legal)/
│   │   ├── privacy/
│   │   │   └── page.tsx           # /privacy
│   │   ├── impressum/
│   │   │   └── page.tsx           # /impressum
│   │   └── terms/
│   │       └── page.tsx           # /terms
│   └── not-found.tsx              # 404 page
│
├── components/                    # Reusable components
│   ├── ui/                        # Design system
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Tooltip.tsx
│   │   └── [other base components]
│   ├── layout/                    # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── SideNav.tsx
│   │   └── SkipLink.tsx           # Accessibility
│   ├── features/                  # Feature-specific components
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ValueProp.tsx
│   │   │   ├── TechStack.tsx
│   │   │   ├── FeaturedCase.tsx
│   │   │   ├── PersonaCards.tsx
│   │   │   ├── SocialProof.tsx
│   │   │   └── FinalCTA.tsx
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx
│   │   │   ├── BlogGrid.tsx
│   │   │   ├── BlogPostBody.tsx
│   │   │   └── RelatedPosts.tsx
│   │   ├── case-studies/
│   │   │   ├── CaseStudyCard.tsx
│   │   │   ├── CaseStudyGrid.tsx
│   │   │   ├── CaseStudyBody.tsx
│   │   │   └── TechStackBadges.tsx
│   │   ├── forms/
│   │   │   ├── ContactForm.tsx
│   │   │   ├── SubscribeForm.tsx
│   │   │   ├── FormValidation.tsx
│   │   │   └── FormSuccess.tsx
│   │   └── common/
│   │       ├── SEO.tsx
│   │       ├── Image.tsx
│   │       └── TechnicalDiagram.tsx
│   └── shared/
│       ├── Providers.tsx          # React Query, theme
│       └── ClientOnly.tsx         # Client-side only wrapper
│
├── hooks/                         # Custom React hooks
│   ├── useQueryClient.ts          # TanStack Query wrapper
│   ├── useSanity.ts               # Sanity data fetching
│   ├── useIntersectionObserver.ts # Lazy loading
│   ├── useMediaQuery.ts           # Responsive design
│   └── useMounted.ts              # SSR safety
│
├── lib/                           # Utilities & helpers
│   ├── sanity.ts                  # Sanity client setup
│   ├── analytics.ts               # Plausible events
│   ├── api-client.ts              # Fetch wrapper with error handling
│   ├── form-validation.ts         # Zod schemas
│   ├── email-templates.ts         # React email components
│   ├── utils.ts                   # General helpers
│   ├── constants.ts               # Site constants
│   └── types.ts                   # Shared TypeScript types
│
├── types/                         # TypeScript definitions
│   ├── index.ts                   # Exported types
│   ├── sanity.ts                  # Sanity schema types
│   ├── api.ts                     # API request/response types
│   └── models.ts                  # Domain models
│
├── styles/                        # Global styles
│   ├── globals.css                # Tailwind directives
│   ├── typography.css             # Type classes
│   └── animations.css             # Animation definitions
│
├── public/                        # Static assets
│   ├── images/
│   ├── logos/
│   ├── icons/
│   └── fonts/ (if self-hosting)
│
├── .env.example                   # Environment variables template
├── .env.local                     # Local development (git ignored)
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

### 3.2 Component Design Patterns

#### Smart Components (Data-fetching)
```typescript
// components/features/blog/BlogGrid.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { getPosts } from '@/lib/sanity'
import BlogCard from './BlogCard'

export default function BlogGrid() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: getPosts,
    staleTime: 1000 * 60 * 10,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading posts</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts?.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  )
}
```

#### Presentational Components (Pure UI)
```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded transition-colors'
  const variants = {
    primary: 'bg-ki-gold text-black hover:bg-yellow-500',
    secondary: 'border border-ki-gold text-ki-gold hover:bg-ki-gold hover:text-black',
    tertiary: 'text-ki-gold hover:underline',
  }
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span>⟳</span> : props.children}
    </button>
  )
}
```

---

## 4. API Architecture

### 4.1 REST API Endpoints

**Base URL**: `https://kiagentur.com/api`

```
# Contact Form
POST /api/contact
  Body: { name, email, company, message, budget? }
  Response: { success: bool, error?: string, leadId?: string }

# Newsletter Subscription
POST /api/subscribe
  Body: { email, interests?: string[] }
  Response: { success: bool, error?: string }

# Webhooks
POST /api/webhooks/sanity
  - Trigger: Content published in Sanity
  - Action: Rebuild affected pages

POST /api/webhooks/calendly
  - Trigger: Booking confirmed
  - Action: Create CRM activity, send confirmation email
```

### 4.2 Request/Response Format

**Success Response**:
```json
{
  "success": true,
  "data": {
    "contactId": "12345",
    "name": "John Doe",
    "email": "john@company.com"
  },
  "message": "Contact created successfully"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": [
      {
        "field": "email",
        "message": "Email must be valid",
        "code": "EMAIL_INVALID"
      }
    ]
  }
}
```

### 4.3 Authentication

**For public endpoints**: No authentication required (rate limited by IP)

**For internal webhooks**:
- Secret tokens in environment variables
- HMAC signature verification
- IP whitelist (for Sanity, Calendly, etc.)

```typescript
// Example webhook verification
import { createHmac } from 'crypto'

export function verifyWebhook(body: string, signature: string): boolean {
  const secret = process.env.WEBHOOK_SECRET!
  const hash = createHmac('sha256', secret).update(body).digest('hex')
  return hash === signature
}
```

---

## 5. CMS Integration Strategy

### 5.1 Content Modeling

**Entity Relationships**:
```
Post (Blog)
├─ Author (reference to Author)
├─ Category (array of strings)
├─ Tags (array of strings)
├─ Body (BlockContent with code, images, quotes)
└─ SEO (metaDescription, keywords, ogImage)

CaseStudy
├─ Client Name (string)
├─ Industry (string)
├─ Challenge (BlockContent)
├─ Solution (BlockContent)
├─ Results (array of metrics)
├─ TechStack (array of strings)
├─ Testimonial (nested object with quote, attribution)
└─ SEO

Team
├─ Name (string)
├─ Title (string)
├─ Bio (text)
├─ Photo (image)
├─ Social Links (object with LinkedIn, GitHub, Twitter)
└─ Expertise Areas (array)

Service
├─ Title (string)
├─ Description (BlockContent)
├─ Icon (image)
├─ RelatedCaseStudies (array of references)
└─ SEO
```

### 5.2 Content Publishing Workflow

```
1. DRAFT
   ├─ Content team writes/edits in Sanity
   ├─ Preview mode for reviewing
   └─ Comments and feedback in Sanity UI

2. REVIEW
   ├─ Editor approves content
   ├─ SEO check
   └─ Link verification

3. PUBLISH
   ├─ Sanity publishes document
   ├─ Webhook triggers to Vercel
   ├─ Next.js rebuilds relevant pages
   └─ Changes live in 1-2 minutes

4. MONITOR
   ├─ Check live page
   ├─ Monitor Plausible for engagement
   └─ Gather feedback
```

### 5.3 Asset Management

**Image Optimization**:
```typescript
// lib/image-helper.ts
import urlBuilder from '@sanity/image-url'

const builder = urlBuilder(sanityClient)

export function urlFor(source: Image) {
  return builder
    .image(source)
    .width(1200)
    .height(630)
    .fit('crop')
    .auto('format')
}

// Usage in Next.js Image
<Image
  src={urlFor(caseStudy.heroImage).url()}
  alt={caseStudy.title}
  width={1200}
  height={630}
  priority={false}
  placeholder="blur"
/>
```

**CDN Caching**:
- Sanity provides CDN with global distribution
- Images optimized and cached automatically
- WebP with JPEG fallback
- Multiple resolution variants

---

## 6. Data Flow & State Management

### 6.1 Client-Server Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                   DATA FLOW DIAGRAM                     │
│                                                         │
│  ┌──────────┐                                          │
│  │  Browser │                                          │
│  │   User   │                                          │
│  └────┬─────┘                                          │
│       │ (1) User Action                                │
│       v                                                │
│  ┌─────────────────────────┐                          │
│  │  React Component State  │                          │
│  │  (useState)             │                          │
│  └────┬────────────────────┘                          │
│       │ (2) Form Submission                           │
│       v                                                │
│  ┌─────────────────────────┐                          │
│  │  Next.js API Route      │                          │
│  │  (Serverless Function)  │                          │
│  └────┬────────────────────┘                          │
│       │ (3) Process & Validate                        │
│       v                                                │
│  ┌─────────────────────────┐                          │
│  │  External Services      │                          │
│  │  • Resend (Email)       │                          │
│  │  • n8n (Workflows)      │                          │
│  │  • CRM (Lead mgmt)      │                          │
│  │  • Analytics (Tracking) │                          │
│  └────┬────────────────────┘                          │
│       │ (4) Confirmation                              │
│       v                                                │
│  ┌─────────────────────────┐                          │
│  │  Client Response        │                          │
│  └─────────────────────────┘                          │
│                                                         │
└─────────────────────────────────────────────────────────┘

Content Flow (Separate):
┌──────────────────────────────────┐
│  Sanity CMS Content              │
│  (Posts, Case Studies, Pages)    │
└────────────┬─────────────────────┘
             │ (Via GROQ Query)
             v
┌──────────────────────────────────┐
│  getStaticProps / getServerSideProps
│  (Build-time or Request-time)    │
└────────────┬─────────────────────┘
             │ (Pre-render or Cache)
             v
┌──────────────────────────────────┐
│  HTML Page + React Hydration     │
│  (Serve to Browser)              │
└──────────────────────────────────┘
```

### 6.2 State Management Strategy

**Server State** (Content):
- Fetched at build time (static generation)
- Cached by Vercel CDN (immutable)
- Incremental Static Regeneration (ISR) for dynamic updates
- TanStack Query for client-side caching of API responses

**UI State** (Client-side only):
- Form inputs (useState)
- Modal/dialog open state (useState)
- Dropdown menus (useState)
- Loading/error states (useState)

**Global State** (Rarely needed):
- Theme preference (localStorage)
- User authentication (if added)
- Context API for provider-level state

**Example - Blog Post Fetching**:
```typescript
// pages/blog/[slug]/page.tsx
import { getPosts, getPostBySlug } from '@/lib/sanity'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug.current,
  }))
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug)
  return {
    title: post.title,
    description: post.seo.metaDescription,
  }
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug)

  return (
    <article>
      <h1>{post.title}</h1>
      <PostContent body={post.body} />
    </article>
  )
}
```

---

## 7. Performance Architecture

### 7.1 Performance Targets

| Metric | Target | How We Achieve |
|--------|--------|---|
| First Contentful Paint (FCP) | < 1.5s | Inline critical CSS, optimize fonts |
| Largest Contentful Paint (LCP) | < 2.5s | Image optimization, lazy loading |
| Time to Interactive (TTI) | < 3.5s | Code splitting, defer non-critical JS |
| Cumulative Layout Shift (CLS) | < 0.1 | Reserve space for images, no late JS |
| Initial Page Load | < 2s | Static generation, edge caching |
| Lighthouse Performance | 90+ | All optimizations above |

### 7.2 Optimization Strategies

**Image Optimization**:
```tsx
import Image from 'next/image'

// Automatic optimization
<Image
  src="/case-study.jpg"
  alt="Case study illustration"
  width={800}
  height={600}
  placeholder="blur"          // Blur-up effect
  blurDataURL={smallDataUrl}  // Placeholder
  priority={false}            // Lazy load
  quality={80}                // WebP at 80% quality
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
/>
```

**Font Optimization**:
```tsx
// pages/_app.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',            // System font fallback while loading
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
})
```

**Code Splitting**:
```tsx
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const ContactForm = dynamic(
  () => import('@/components/forms/ContactForm'),
  {
    loading: () => <p>Loading form...</p>,
    ssr: true // Pre-render on server
  }
)
```

**CSS Optimization**:
```tailwind
/* tailwind.config.ts - Purge CSS */
export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    // Include all source files
  ],
  // Only used classes are in final CSS
}
```

**Caching Strategy**:
```
Browser Cache (Vercel Edge):
- Static assets: max-age=31536000 (1 year, immutable)
- HTML pages: max-age=3600 (1 hour)
- API responses: max-age=60 (1 minute)

ISR (Incremental Static Regeneration):
- Case studies: revalidate=86400 (24 hours)
- Blog posts: revalidate=86400 (24 hours)
- Homepage: revalidate=3600 (1 hour)
- Contact form: no cache (always fresh)
```

```typescript
// next.config.ts
export default {
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,    // 1 minute
    pagesBufferLength: 5,         // Keep 5 pages warm
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
  },
}
```

---

## 8. Security Architecture

### 8.1 Input Validation & Sanitization

**Form Validation** (Frontend + Backend):
```typescript
// lib/form-validation.ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  company: z.string()
    .min(2, 'Company name required')
    .max(100, 'Company name too long'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long'),
  budget: z.enum(['<50k', '50-100k', '100-250k', '250k+']).optional(),
})

// Validate before API call
const validated = await contactFormSchema.parseAsync(formData)
```

**API Route Validation**:
```typescript
// pages/api/contact.ts
import { contactFormSchema } from '@/lib/form-validation'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Validate input
    const data = await contactFormSchema.parseAsync(req.body)

    // Process (sanitized data)
    await sendEmail(data)

    return res.status(200).json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
```

### 8.2 API Security

**Rate Limiting** (with Vercel Edge):
```typescript
// middleware.ts
import { rateLimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { limit, reset } = await rateLimit(ip)

  if (limit < 1) {
    return new Response('Too many requests', { status: 429 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
```

**CORS Configuration**:
```typescript
// Restrict to known origins
const allowedOrigins = [
  'https://kiagentur.com',
  'https://www.kiagentur.com',
  'https://calendly.com',  // For Calendly webhooks
]

export function setCorsHeaders(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get('origin')

  if (allowedOrigins.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  }

  return res
}
```

### 8.3 Data Protection

**GDPR Compliance**:
```tsx
// Cookie Banner (if needed for Plausible)
'use client'

import { useState } from 'react'

export default function CookieConsent() {
  const [accepted, setAccepted] = useState(false)

  if (accepted) return null

  return (
    <div className="fixed bottom-4 right-4 bg-ki-black p-4 rounded">
      <p className="text-white mb-4">
        We use privacy-respecting analytics. Your data is not tracked individually.
      </p>
      <button
        onClick={() => {
          setAccepted(true)
          localStorage.setItem('cookieConsent', 'true')
        }}
        className="bg-ki-gold text-black px-4 py-2 rounded"
      >
        Accept
      </button>
    </div>
  )
}
```

**Privacy Policy Requirements**:
- Data collection practices
- Third-party services (Sanity, Plausible, Resend, CRM)
- User rights (access, deletion, portability)
- GDPR compliance statement
- Cookie usage (or lack thereof with Plausible)

**Form Data Security**:
- HTTPS/TLS for all communications
- Form data encrypted in transit
- No passwords stored (only needed for signup if implemented)
- Data retention policy (delete form data after 30 days if not converted)

### 8.4 Content Security

**CSP Headers** (via next.config.ts):
```typescript
export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' *.plausible.io; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

---

## 9. Deployment Strategy

### 9.1 CI/CD Pipeline

**Git-based Deployment** (Automatic via Vercel):
```
1. Developer pushes to GitHub `main` branch
2. Vercel detects changes (GitHub integration)
3. Runs build process
   ├─ Install dependencies (npm ci)
   ├─ Lint code (ESLint, Prettier check)
   ├─ Type check (TypeScript)
   ├─ Build Next.js app
   ├─ Optimize images
   └─ Generate static assets
4. Run tests (if configured)
   ├─ Unit tests
   ├─ Integration tests
   └─ E2E tests (Playwright)
5. Create preview deployment (pull requests)
6. Deploy to production (main branch)
   ├─ Invalidate CDN cache
   ├─ Distribute to edge network
   └─ Health checks
7. Monitor deployment
   ├─ Check error rates
   ├─ Monitor performance
   └─ Alert on issues
```

### 9.2 Environments

**Development (Local)**:
```bash
npm run dev          # Hot reload on file changes
npm run build        # Build for testing
npm run start        # Production build locally
```

**Staging (Optional)**:
- Branch: `staging`
- URL: `staging-kiagentur.vercel.app`
- Auto-deployed, isolated environment
- Test before production

**Production**:
- Branch: `main`
- URL: `kiagentur.com`
- Global CDN, edge caching
- Monitoring and alerting

### 9.3 Deployment Configuration

```typescript
// next.config.ts
const config = {
  // Build optimization
  swcMinify: true,
  productionBrowserSourceMaps: false,  // Smaller builds

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true, // 301 redirect
      },
    ]
  },

  // Rewrites (internal routing)
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    }
  },

  // Headers (caching, security)
  async headers() {
    return [/* security headers above */]
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['cdn.sanity.io', 'images.unsplash.com'],
  },
}

export default config
```

---

## 10. File & Folder Structure

### 10.1 Complete Project Structure

```
ki-agentur-website/
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   ├── sitemap.ts               # Dynamic sitemap
│   │   ├── robots.ts                # robots.txt
│   │   ├── (pages)/                 # Route group
│   │   │   ├── services/page.tsx
│   │   │   ├── technology/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── (blog)/
│   │   │   ├── blog/page.tsx
│   │   │   └── blog/[slug]/page.tsx
│   │   ├── (case-studies)/
│   │   │   ├── case-studies/page.tsx
│   │   │   └── case-studies/[slug]/page.tsx
│   │   ├── (legal)/
│   │   │   ├── privacy/page.tsx
│   │   │   ├── impressum/page.tsx
│   │   │   └── terms/page.tsx
│   │   ├── api/                     # API routes
│   │   │   ├── contact/route.ts
│   │   │   ├── subscribe/route.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── sanity/route.ts
│   │   │   │   └── calendly/route.ts
│   │   │   └── health/route.ts      # Health check
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Select.tsx
│   │   │   └── [other components]
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── SkipLink.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── features/
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── ValueProp.tsx
│   │   │   │   ├── TechStack.tsx
│   │   │   │   ├── FeaturedCase.tsx
│   │   │   │   ├── PersonaCards.tsx
│   │   │   │   └── SocialProof.tsx
│   │   │   ├── blog/
│   │   │   │   ├── BlogCard.tsx
│   │   │   │   ├── BlogGrid.tsx
│   │   │   │   └── PostMeta.tsx
│   │   │   ├── case-studies/
│   │   │   │   ├── CaseStudyCard.tsx
│   │   │   │   ├── CaseStudyGrid.tsx
│   │   │   │   └── TechStackBadges.tsx
│   │   │   ├── forms/
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── SubscribeForm.tsx
│   │   │   │   └── FormError.tsx
│   │   │   └── common/
│   │   │       ├── SEO.tsx
│   │   │       ├── Image.tsx
│   │   │       └── RichText.tsx
│   │   └── shared/
│   │       ├── Providers.tsx        # Context, Query Client
│   │       └── CookieConsent.tsx
│   │
│   ├── hooks/
│   │   ├── useQueryClient.ts
│   │   ├── useSanity.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── useMediaQuery.ts
│   │   └── useMounted.ts
│   │
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts            # Sanity client config
│   │   │   ├── queries.ts           # GROQ queries
│   │   │   └── schema.ts            # Type definitions
│   │   ├── api-client.ts            # Fetch wrapper
│   │   ├── form-validation.ts       # Zod schemas
│   │   ├── email-templates.ts       # React Email components
│   │   ├── analytics.ts             # Event tracking
│   │   ├── utils.ts                 # General helpers
│   │   ├── constants.ts             # Site constants
│   │   ├── rate-limit.ts            # Rate limiting
│   │   └── types.ts                 # Shared types
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── sanity.ts
│   │   ├── api.ts
│   │   └── models.ts
│   │
│   ├── styles/
│   │   ├── globals.css              # Tailwind + global styles
│   │   ├── typography.css           # Type utilities
│   │   └── animations.css           # Keyframe animations
│   │
│   └── middleware.ts                # Next.js middleware (rate limit, CORS)
│
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── case-studies/
│   │   ├── team/
│   │   └── [other images]
│   ├── icons/
│   │   ├── services/
│   │   ├── technologies/
│   │   └── [other icons]
│   ├── logos/
│   │   ├── ki-agentur.svg
│   │   └── partners/
│   ├── fonts/
│   │   ├── inter/
│   │   └── jetbrains-mono/
│   ├── favicon.ico
│   └── robots.txt
│
├── content/                         # Sanity schema & seed data
│   ├── schema/
│   │   ├── post.ts
│   │   ├── caseStudy.ts
│   │   ├── team.ts
│   │   └── [other schemas]
│   └── seed-data.js                 # Initial content
│
├── tests/
│   ├── unit/
│   │   ├── utils.test.ts
│   │   └── components.test.tsx
│   ├── integration/
│   │   ├── api.test.ts
│   │   └── forms.test.ts
│   └── e2e/
│       ├── homepage.spec.ts
│       ├── contact-form.spec.ts
│       └── [other tests]
│
├── .github/
│   └── workflows/
│       ├── test.yml                 # Run tests on PR
│       ├── deploy.yml               # Deploy on merge
│       └── performance.yml          # Performance check
│
├── .env.example                     # Template
├── .env.local                       # Local dev (git ignored)
├── .eslintrc.json                   # Linting rules
├── .prettierrc.json                 # Code formatting
├── next.config.ts                   # Next.js config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies
├── package-lock.json
├── README.md
└── .gitignore
```

---

## 11. Technical Standards & Best Practices

### 11.1 Code Quality Standards

**TypeScript**:
- ✅ Strict mode enabled (`strict: true`)
- ✅ No `any` types (use `unknown` when needed)
- ✅ Explicit return types for functions
- ✅ Interfaces over types for object definitions
- ✅ Shared types in `/types` directory

**Naming Conventions**:
```typescript
// Components: PascalCase
export default function HeroSection() {}

// Functions: camelCase
export const fetchBlogPosts = async () => {}

// Constants: UPPER_SNAKE_CASE
export const SITE_URL = 'https://kiagentur.com'

// Types/Interfaces: PascalCase
interface BlogPost {
  title: string
  slug: string
}

// Private functions: _camelCase or private prefix
const _formatDate = (date: Date) => {}
```

**Code Style**:
- Formatter: Prettier (automatic on save)
- Linter: ESLint with Next.js config
- Max line length: 100 characters
- Indentation: 2 spaces
- Quotes: Single quotes for JS, double for HTML/JSX

**Commit Messages** (Conventional Commits):
```
feat: Add contact form validation with Zod
fix: Correct mobile navbar animation timing
docs: Update architecture documentation
refactor: Extract form logic into custom hook
test: Add unit tests for utility functions
chore: Update dependencies
```

### 11.2 React Best Practices

**Component Structure**:
```tsx
'use client'  // Mark client components

import { FC, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

// Props interface
interface MyComponentProps {
  title: string
  children: ReactNode
  onClose?: () => void
}

// Component with proper typing
const MyComponent: FC<MyComponentProps> = ({
  title,
  children,
  onClose,
}) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
      {onClose && <Button onClick={onClose}>Close</Button>}
    </div>
  )
}

// Export with display name for debugging
MyComponent.displayName = 'MyComponent'

export default MyComponent
```

**Hooks Best Practices**:
```typescript
// Custom hooks extracted for reusability
export function useBlogPosts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => sanityClient.fetch('*[_type == "post"]'),
  })

  return { posts: data, isLoading, error }
}

// Usage in components
const MyComponent = () => {
  const { posts, isLoading } = useBlogPosts()
  // ...
}
```

### 11.3 Testing Strategy

**Unit Tests** (Jest + Vitest):
- Test utility functions
- Test component logic
- Aim for 80%+ coverage

**Integration Tests** (React Testing Library):
- Test form submissions
- Test API interactions
- Test component interactions

**E2E Tests** (Playwright):
- Test complete user journeys
- Test critical paths (contact form, navigation)
- Test on mobile and desktop

```typescript
// Example E2E test
test('user can submit contact form', async ({ page }) => {
  await page.goto('https://kiagentur.com/contact')

  // Fill form
  await page.fill('input[name="name"]', 'John Doe')
  await page.fill('input[name="email"]', 'john@example.com')
  await page.fill('textarea[name="message"]', 'Test message')

  // Submit
  await page.click('button:has-text("Submit")')

  // Verify success
  await expect(page.locator('text=Thanks')).toBeVisible()
})
```

---

## 12. Monitoring & Observability

### 12.1 Performance Monitoring

**Vercel Analytics**:
- Built-in Web Vitals collection
- Core Web Vitals tracking
- Edge function performance

**Custom Performance Tracking**:
```typescript
// lib/analytics.ts
export const reportWebVitals = (metric: NextWebVitalsMetric) => {
  if (typeof window === 'undefined') return

  // Send to Vercel Analytics
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
  }).catch(err => console.error(err))
}
```

### 12.2 Error Monitoring

**Error Handling**:
```typescript
// Global error boundary
'use client'

import { useEffect } from 'react'

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log to error tracking service
    console.error(error)
    // Send to Sentry or similar
    // reportError(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### 12.3 Logging Strategy

**Structured Logging**:
```typescript
// lib/logger.ts
const logger = {
  info: (msg: string, data?: any) => {
    console.log(`[INFO] ${msg}`, data)
  },
  error: (msg: string, error: Error) => {
    console.error(`[ERROR] ${msg}`, error)
    // Send to error tracking service
  },
  warn: (msg: string, data?: any) => {
    console.warn(`[WARN] ${msg}`, data)
  },
}
```

---

## 13. Maintenance & Updates

### 13.1 Dependency Management

**Update Strategy**:
- Monthly npm security audit
- Quarterly dependency updates
- Test after updates
- Automated updates with Dependabot

**Critical Dependencies** (to monitor):
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "@sanity/client": "^6.0.0",
  "@tanstack/react-query": "^5.0.0",
  "tailwindcss": "^3.0.0"
}
```

### 13.2 Content Updates

**Blog Post Publishing Workflow**:
1. Draft in Sanity
2. Preview in Next.js
3. Publish in Sanity
4. Webhook triggers rebuild
5. Changes live in 1-2 minutes

**Case Study Updates**:
- Update in Sanity CMS
- Automatic rebuild and cache invalidation
- Same-day publication

---

## 14. Post-Launch Roadmap

### Phase 1 (Weeks 1-4): Core Functionality
- Static pages complete
- Blog platform functioning
- Contact form working
- Basic analytics

### Phase 2 (Weeks 5-8): Content & Optimization
- Blog posts published
- Case studies live
- Performance optimization
- SEO improvements

### Phase 3 (Months 2-3): Automation & Scale
- Lead scoring implementation
- Email nurture sequences
- A/B testing setup
- Advanced analytics

### Phase 4 (Months 3+): Enhancement
- Interactive tools (ROI calculator, assessment)
- Community features (if applicable)
- Multi-language support
- Advanced personalization

---

## 15. Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Sanity CMS configured with content
- [ ] Contact form email service working
- [ ] Analytics tracking verified
- [ ] Performance targets met (<2s load)
- [ ] WCAG 2.1 AA accessibility verified
- [ ] Mobile responsiveness tested
- [ ] Cross-browser testing completed
- [ ] SEO metadata in place
- [ ] 404 error page custom
- [ ] Favicon and app icons set
- [ ] Security headers configured
- [ ] HTTPS working
- [ ] DNS configured for domain
- [ ] SSL certificate valid
- [ ] Monitoring and alerts set up
- [ ] Backup and disaster recovery plan
- [ ] Documentation complete
- [ ] Team trained on CMS
- [ ] Analytics baseline established

---

## Document Control

**Version**: 1.0
**Date**: 2025-11-19
**Architect**: Software Architect
**Status**: ✅ Complete & Ready for Implementation

**Related Documents**:
- Product Vision: `/home/user/claude-code-agents-wizard-v2/product-vision-ki-agentur.md`
- PRD: `/home/user/claude-code-agents-wizard-v2/prd-ki-agentur.md`
- Brand Guidelines: `/home/user/claude-code-agents-wizard-v2/brand-guidelines-ki-agentur.md`
- UX Design: `/home/user/claude-code-agents-wizard-v2/ux-design-ki-agentur.md`
- UI Design: `/home/user/claude-code-agents-wizard-v2/ui-design-ki-agentur.md`

**Handoff Checklist**:
- ✅ Technology stack fully documented with rationale
- ✅ System architecture clearly defined with diagrams
- ✅ Component architecture designed with examples
- ✅ API design specified with endpoints and formats
- ✅ Data flow and state management strategy defined
- ✅ Performance architecture documented with targets
- ✅ Security architecture comprehensive
- ✅ Complete file structure provided
- ✅ Code standards and best practices defined
- ✅ Deployment strategy with CI/CD pipeline
- ✅ Monitoring and observability plan
- ✅ Maintenance and update strategy

**Ready for**:
- Frontend Developer (build React components)
- Backend Engineer (implement API routes & integrations)
- DevOps Engineer (configure Vercel deployment)
- QA Engineer (create test plans)
- Project Manager (establish timelines)

---

**ARCHITECTURE DOCUMENT STATUS: ✅ COMPLETE**

**The system architecture is ready for development team to begin implementation.**

**Key Success Factors**:
1. Maintain <2 second load time throughout development
2. Ensure all forms work reliably with CRM integration
3. Keep Sanity CMS content model flexible for future updates
4. Follow code standards consistently across team
5. Prioritize accessibility and performance from start
6. Monitor and optimize after launch

**Questions? Contact the Software Architect for clarification on any architecture decisions.**
