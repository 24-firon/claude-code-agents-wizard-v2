# Express REST API

A production-ready RESTful API built with Express, TypeScript, Prisma ORM, and comprehensive testing. This example showcases modern backend development practices using the Claude Code Agent System.

## Features

- **RESTful API Design**: Clean, intuitive endpoints following REST principles
- **TypeScript**: Full type safety throughout the codebase
- **Prisma ORM**: Type-safe database access with PostgreSQL
- **Validation**: Request validation with Joi
- **Testing**: Comprehensive test suite with Jest and Supertest
- **Security**: Helmet, CORS, and security best practices
- **Error Handling**: Global error handler with detailed responses
- **Documentation**: Well-documented code and API endpoints

## Tech Stack

- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Database
- **Joi** - Schema validation
- **Jest** - Testing framework
- **Supertest** - HTTP testing

## API Endpoints

### Users

```
GET    /api/v1/users           - Get all users
POST   /api/v1/users           - Create a new user
GET    /api/v1/users/:id       - Get user by ID
PUT    /api/v1/users/:id       - Update user
DELETE /api/v1/users/:id       - Delete user
```

### Posts

```
GET    /api/v1/posts                    - Get all posts
POST   /api/v1/posts                    - Create a new post
GET    /api/v1/posts/:id                - Get post by ID
PUT    /api/v1/posts/:id                - Update post
DELETE /api/v1/posts/:id                - Delete post
GET    /api/v1/posts/author/:authorId   - Get posts by author
POST   /api/v1/posts/:id/publish        - Publish a post
POST   /api/v1/posts/:id/unpublish      - Unpublish a post
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Navigate to directory
cd tests/examples/express-rest-api

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update DATABASE_URL in .env with your PostgreSQL connection string

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The API will be running at `http://localhost:3000`

### Available Scripts

```bash
npm run dev            # Start development server with watch mode
npm run build          # Build for production
npm start              # Start production server
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
npm run prisma:studio  # Open Prisma Studio (database GUI)
```

## Project Structure

```
express-rest-api/
├── src/
│   ├── controllers/
│   │   ├── userController.ts    # User CRUD operations
│   │   └── postController.ts    # Post CRUD operations
│   ├── middleware/
│   │   ├── auth.ts              # Authentication middleware
│   │   └── validation.ts        # Request validation
│   ├── models/
│   │   ├── user.ts              # User model & database queries
│   │   └── post.ts              # Post model & database queries
│   ├── routes/
│   │   ├── users.ts             # User routes
│   │   └── posts.ts             # Post routes
│   └── index.ts                 # Express app setup
├── tests/
│   ├── users.test.ts            # User endpoint tests
│   └── posts.test.ts            # Post endpoint tests
├── prisma/
│   └── schema.prisma            # Database schema
├── package.json
├── tsconfig.json
└── README.md
```

## Example Requests

### Create a User

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe"
  }'
```

### Create a Post

```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content",
    "authorId": "<user-id-here>"
  }'
```

### Get All Posts

```bash
curl http://localhost:3000/api/v1/posts
```

### Filter Published Posts

```bash
curl http://localhost:3000/api/v1/posts?published=true
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "count": 10  // for list endpoints
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message",
  "details": [...]  // for validation errors
}
```

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}
```

### Post Model

```prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(...)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- ✅ User CRUD operations
- ✅ Post CRUD operations
- ✅ Validation errors
- ✅ 404 handling
- ✅ Relationship handling
- ✅ Publish/unpublish functionality

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Security Features

- **Helmet**: Secure HTTP headers
- **CORS**: Configurable cross-origin requests
- **Validation**: All inputs validated with Joi
- **Error Handling**: No sensitive data in error responses
- **UUID**: Unpredictable resource IDs

## Future Enhancements

- [ ] JWT authentication
- [ ] Role-based authorization
- [ ] Rate limiting
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Pagination for list endpoints
- [ ] Search and filtering
- [ ] File upload support
- [ ] WebSocket support

## Built With

Claude Code Agent Orchestration System - https://github.com/IncomeStreamSurfer/claude-code-agents-wizard-v2

## License

MIT
