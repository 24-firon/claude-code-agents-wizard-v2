# KI Agentur Client Portal - Frontend

Enterprise client transparency platform for AI automation projects built with Next.js 14, TypeScript, and Tailwind CSS.

## 📋 Overview

The KI Agentur Client Portal is a premium, role-based dashboard that enables enterprise clients (CTOs, CEOs, PMs) to monitor AI automation projects in real-time without status meetings. Features include live n8n workflow tracking, document management, milestone timelines, and automated notifications.

**Key Features:**
- 🎨 Gold (#FFB800) + Black (#0A0A0A) premium design
- 🔐 Role-based dashboards (CEO, CTO, PM, Admin)
- 📊 Real-time health scores with 30-second polling
- 📁 Document management with version control
- 🔔 In-app notifications with preferences
- 🌐 Bilingual support (EN/DE)
- 📱 Fully responsive (mobile/tablet/desktop)
- ♿ WCAG 2.1 AA accessible

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (UI state) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Headless UI + Custom components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom wrapper
- **Internationalization**: next-intl

## 📁 Project Structure

```
client-portal/
├── app/                           # Next.js App Router pages
│   ├── dashboard/                 # Dashboard page (role-based)
│   ├── technical/                 # CTO technical logs
│   ├── documents/                 # Document repository
│   ├── timeline/                  # Milestones timeline
│   ├── notifications/             # Notification center
│   ├── settings/                  # User settings
│   ├── login/                     # Login page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home redirect
│   └── globals.css                # Global styles
│
├── components/                    # React components
│   ├── ui/                        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── layout/                    # Layout components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── features/                  # Feature-specific components
│   └── Providers.tsx              # React Query provider
│
├── lib/                           # Utilities and helpers
│   ├── api/                       # API integration
│   │   ├── client.ts              # HTTP client
│   │   └── queries.ts             # TanStack Query hooks
│   ├── utils.ts                   # Utility functions
│   └── constants.ts               # App constants
│
├── stores/                        # Zustand stores
│   ├── authStore.ts               # Authentication state
│   └── uiStore.ts                 # UI state (sidebar, toasts, language)
│
├── types/                         # TypeScript definitions
│   └── index.ts                   # All type definitions
│
├── public/                        # Static assets
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm
- Backend API running (see backend setup)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   NEXT_PUBLIC_ENVIRONMENT=development
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 🎨 Design System

### Colors

```css
--gold: #FFB800       /* Primary accent */
--black: #0A0A0A      /* Background */
--success: #10B981    /* On-track status */
--warning: #F59E0B    /* At-risk status */
--error: #EF4444      /* Blocked/error status */
--info: #3B82F6       /* Information */
```

### Typography

- **Headings**: Inter (font-sans)
- **Body**: Inter (font-sans)
- **Code**: JetBrains Mono (font-mono)

### Components

All UI components are in `components/ui/`:
- **Button**: Primary, secondary, outline, ghost, danger variants
- **Input**: Text inputs with labels, errors, helper text
- **Card**: Container component with header, content sections
- **Badge**: Status badges (success, warning, error, info)
- **Toast**: Notification toasts with auto-dismiss
- **Skeleton**: Loading placeholders

## 🔐 Authentication

The app uses JWT tokens stored in HTTP-only cookies:

```typescript
// Login
const login = useLogin();
login.mutate({ email, password });

// Logout
const logout = useLogout();
logout.mutate();

// Get current user
const { user } = useAuthStore();
```

Protected routes automatically redirect to `/login` if unauthenticated.

## 📡 API Integration

### TanStack Query Hooks

All API calls use TanStack Query hooks with automatic caching, refetching, and polling:

```typescript
// Dashboard health (polls every 30s)
const { data: health } = useDashboardHealth(projectId);

// Documents
const { data: documents } = useDocuments(projectId);

// Upload document
const upload = useUploadDocument(projectId);
upload.mutate({ name, phase, file });

// Workflows (polls every 30s)
const { data: workflows } = useWorkflows(projectId);

// Notifications (polls every 60s)
const { data: notifications } = useNotifications();
```

### API Client

Custom API client with automatic error handling:

```typescript
import { apiClient } from '@/lib/api/client';

// GET request
const data = await apiClient.get('/endpoint');

// POST request
const result = await apiClient.post('/endpoint', { body });

// Upload file
const uploaded = await apiClient.upload('/endpoint', file, { metadata });
```

## 🌐 Internationalization

Language switching with next-intl:

```typescript
// Get current language
const { language } = useUIStore();

// Switch language
setLanguage('de'); // or 'en'

// Use translations (future)
const t = useTranslations('namespace');
<p>{t('key')}</p>
```

## 🎯 Role-Based Access

Different roles see different views:

| Role  | Dashboard | Technical | Documents | Timeline | Notifications | Settings |
|-------|-----------|-----------|-----------|----------|---------------|----------|
| CEO   | ✅        | ❌        | View      | ✅       | ✅            | ✅       |
| CTO   | ✅        | ✅        | View      | ✅       | ✅            | ✅       |
| PM    | ✅        | ❌        | Full      | ✅       | ✅            | ✅       |
| ADMIN | ✅        | ✅        | Full      | ✅       | ✅            | ✅       |

Permissions are enforced in:
- Sidebar navigation (`components/layout/Sidebar.tsx`)
- Page-level checks
- UI component visibility

## 📊 Real-Time Updates

The app uses polling for real-time updates:

- **Dashboard Health**: 30-second polling
- **Workflows**: 30-second polling
- **Notifications**: 60-second polling

Polling is automatic via TanStack Query `refetchInterval`.

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1
   NEXT_PUBLIC_ENVIRONMENT=production
   ```
4. Deploy

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues

1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Ensure backend is running
3. Check CORS settings on backend
4. Verify network connectivity

### TypeScript Errors

```bash
# Run type checking
npm run type-check

# Generate types from Prisma (backend)
cd ../backend && npx prisma generate
```

## 📈 Performance

- **Bundle Size**: < 200KB initial JS (gzipped)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s

Optimization strategies:
- Route-based code splitting
- Dynamic imports for heavy components
- Image optimization with Next.js Image
- Font subsetting (Inter, JetBrains Mono)
- CSS purging with Tailwind

## ♿ Accessibility

WCAG 2.1 AA compliant:
- Semantic HTML throughout
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators (gold ring)
- Color contrast ratios meet 4.5:1
- Screen reader tested
- prefers-reduced-motion support

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
npm test             # Run tests
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test thoroughly
3. Run linting: `npm run lint`
4. Run type checking: `npm run type-check`
5. Commit with clear message
6. Push and create pull request

## 📄 License

Proprietary - KI Agentur

## 👥 Support

For questions or issues:
- Technical Support: tech@ki-agentur.com
- Product Questions: product@ki-agentur.com

---

**Built with ❤️ by KI Agentur**
