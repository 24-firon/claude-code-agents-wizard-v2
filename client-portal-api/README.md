# KI Agentur Client Portal - Backend API

Production-ready backend API for the KI Agentur Client Portal, built with Node.js, Express, TypeScript, and Prisma ORM.

## Features

- **Authentication**: JWT-based auth with HTTP-only cookies, refresh tokens, and session management
- **Authorization**: Role-based access control (CEO, CTO, PM, ADMIN)
- **n8n Integration**: Webhook receiver with HMAC-SHA256 verification
- **Email Notifications**: Resend integration for automated notifications
- **File Storage**: AWS S3 integration for document management
- **Audit Logging**: Complete audit trail for compliance
- **Security**: Triple-layer validation (Zod + sanitization + attack detection), rate limiting, Helmet
- **Database**: PostgreSQL with Prisma ORM, optimized indexes, soft deletes

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **Email**: Resend
- **Storage**: AWS S3
- **Security**: Helmet, CORS, rate limiting

## Prerequisites

- Node.js 20+ and npm/yarn
- PostgreSQL 15+
- AWS account (for S3)
- Resend API key (for emails)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ki_client_portal"

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_ACCESS_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# n8n Webhook
WEBHOOK_SECRET=your-webhook-secret-here

# Email (Resend)
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=noreply@ki-agentur.com

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=ki-agentur-documents
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server starts at: http://localhost:3001

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Dashboard

- `GET /api/v1/projects/:projectId/dashboard/health` - Project health score
- `GET /api/v1/projects/:projectId/dashboard/metrics` - Project metrics

### Webhooks

- `POST /api/v1/webhooks/n8n/:projectId` - n8n webhook receiver

## Project Structure

```
client-portal-api/
├── src/
│   ├── config/           # Environment and database config
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── utils/            # Utilities (logger, errors, JWT, password)
│   ├── schemas/          # Zod validation schemas
│   ├── server.ts         # Express app setup
│   └── index.ts          # Server startup
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   └── seed.ts           # Sample data
├── tests/                # Unit and integration tests
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Database Migrations

### Create Migration

```bash
npx prisma migrate dev --name add_feature
```

### Deploy Migration (Production)

```bash
npx prisma migrate deploy
```

### View Database

```bash
npx prisma studio
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test:coverage

# Run tests in watch mode
npm run test:watch
```

## Building for Production

```bash
# Build TypeScript
npm run build

# Run production build
npm start
```

## Security Features

### Authentication
- JWT tokens with short expiration (15 minutes access, 7 days refresh)
- Refresh token rotation on each use
- HTTP-only secure cookies for refresh tokens
- Session management with device tracking
- bcrypt password hashing (12 rounds)

### Authorization
- Role-based access control (RBAC)
- Project-level access control
- Resource ownership verification
- API key authentication for webhooks

### Input Validation
- Zod schema validation on all endpoints
- XSS sanitization with DOMPurify
- SQL injection prevention (Prisma parameterized queries)
- NoSQL injection detection
- Attack pattern detection

### Rate Limiting
- Global: 100 requests/15 minutes
- Auth endpoints: 5 attempts/15 minutes
- Webhooks: 100 requests/minute

### Security Headers
- Helmet.js for HTTP security headers
- CORS with allowlist
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)

### Audit Logging
- All CRUD operations logged
- User authentication events
- Document access tracking
- API key usage

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_ACCESS_SECRET` | JWT access token secret | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Yes |
| `WEBHOOK_SECRET` | n8n webhook HMAC secret | Yes |
| `RESEND_API_KEY` | Resend email API key | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes |
| `AWS_S3_BUCKET` | S3 bucket name | Yes |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | Yes |

## Deployment

### Railway

1. Create new project in Railway
2. Add PostgreSQL database
3. Add environment variables from `.env.example`
4. Connect GitHub repository
5. Deploy automatically

### Docker

```bash
# Build image
docker build -t ki-portal-api .

# Run container
docker run -p 3001:3001 --env-file .env ki-portal-api
```

## Monitoring

- **Logs**: Winston logger with file rotation
- **Errors**: Structured error responses with codes
- **Health Check**: `GET /health`
- **Metrics**: Request logging with Morgan

## Development Workflow

1. Create feature branch
2. Make changes
3. Run linter: `npm run lint:fix`
4. Run type check: `npm run type-check`
5. Run tests: `npm test`
6. Commit and push
7. Create PR for review

## Common Tasks

### Add New Endpoint

1. Create schema in `src/schemas/`
2. Create service in `src/services/`
3. Create controller in `src/controllers/`
4. Create route in `src/routes/`
5. Add route to `src/server.ts`
6. Add tests

### Add Database Table

1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name add_table`
3. Generate Prisma Client: `npm run prisma:generate`
4. Update seed if needed

## Troubleshooting

### Database Connection Errors

```bash
# Check PostgreSQL is running
psql -h localhost -U user -d ki_client_portal

# Test connection
npx prisma db pull
```

### JWT Secret Errors

Generate new secrets:
```bash
openssl rand -base64 32
```

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

## Test Credentials (Development)

After running `npm run prisma:seed`:

- **Admin**: admin@example.com / dev-admin-123
- **CTO**: cto@example.com / dev-cto-123
- **CEO**: ceo@example.com / dev-ceo-123
- **PM**: pm@example.com / dev-pm-123

## License

UNLICENSED - Proprietary software for KI Agentur

## Support

For issues or questions, contact the backend team.
