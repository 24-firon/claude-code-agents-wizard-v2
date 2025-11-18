# Claude Code Agent System - Example Projects

This directory contains production-ready example projects showcasing the capabilities of the Claude Code Agent Orchestration System. Each example demonstrates best practices, modern tooling, comprehensive testing, and professional documentation.

## Available Examples

### 1. React Todo App ✅

**Directory**: `react-todo-app/`

A production-ready React application with TypeScript, Vite, and Tailwind CSS.

**Technologies**:
- React 18 with TypeScript
- Vite for blazing-fast development
- Tailwind CSS for styling
- Vitest + Testing Library for testing
- localStorage for persistence

**Features**:
- Add, edit, delete todos
- Toggle completion status
- Filter (all/active/completed)
- Persistent storage
- Comprehensive test coverage

**Quick Start**:
```bash
cd react-todo-app
npm install
npm run dev
```

[Full Documentation](./react-todo-app/README.md)

---

### 2. Express REST API ✅

**Directory**: `express-rest-api/`

A production-ready RESTful API with Express, TypeScript, and Prisma ORM.

**Technologies**:
- Express 4 with TypeScript
- Prisma ORM with PostgreSQL
- Joi validation
- Jest + Supertest for testing
- Security with Helmet & CORS

**Features**:
- RESTful user and post endpoints
- Full CRUD operations
- Input validation
- Error handling
- Comprehensive API tests

**Quick Start**:
```bash
cd express-rest-api
npm install
cp .env.example .env
# Configure DATABASE_URL in .env
npm run prisma:migrate
npm run dev
```

[Full Documentation](./express-rest-api/README.md)

---

### 3. Next.js Full-Stack Blog

**Directory**: `nextjs-blog/`

**Status**: Coming Soon

A modern blog with Next.js 14, TypeScript, Prisma, and NextAuth.

**Technologies**:
- Next.js 14 with App Router
- TypeScript
- Prisma + PostgreSQL
- NextAuth for authentication
- Tailwind CSS

**Features**:
- Blog post listing and detail pages
- User authentication
- Markdown support
- SEO optimized
- Server-side rendering

---

### 4. Python FastAPI Microservice

**Directory**: `fastapi-service/`

**Status**: Coming Soon

A high-performance microservice with FastAPI and SQLAlchemy.

**Technologies**:
- FastAPI
- SQLAlchemy ORM
- Pydantic schemas
- Pytest for testing
- Docker support

**Features**:
- Auto-generated OpenAPI docs
- Fast async endpoints
- Database integration
- Comprehensive tests
- Docker deployment

---

### 5. Landing Page with Deployment

**Directory**: `landing-page-full-stack/`

**Status**: Coming Soon

A modern landing page with multiple deployment configurations.

**Technologies**:
- HTML5, CSS3, JavaScript
- Responsive design
- Form handling
- Docker support
- Multiple deployment options

**Features**:
- Modern, responsive design
- Contact form
- Smooth animations
- Multiple deployment configs (Vercel, Netlify, Docker)
- CI/CD pipeline

---

## What These Examples Demonstrate

### Agent System Workflow

Each project was built using the Claude Code Agent orchestration pattern:

1. **Planning Phase**: Orchestrator analyzed requirements and created detailed todo lists
2. **Development Phase**: Coder agent implemented features one by one
3. **Testing Phase**: Tester agent verified functionality with Playwright
4. **Documentation Phase**: Comprehensive docs and build logs created

### Best Practices

All examples follow production-ready standards:

- **Type Safety**: Full TypeScript (or type hints for Python)
- **Testing**: Comprehensive test suites with high coverage
- **Documentation**: Clear README files and code comments
- **Error Handling**: Proper error handling and validation
- **Security**: Security best practices implemented
- **Performance**: Optimized for production use

### Modern Tooling

Each example uses current industry-standard tools:

- Latest framework versions
- Modern build tools (Vite, Next.js, FastAPI)
- Professional testing frameworks
- Production deployment configurations

## How to Use These Examples

### As Learning Resources

Study the code to understand:
- Project structure and organization
- Component/module patterns
- Testing strategies
- Deployment configurations

### As Starting Points

Use these as templates for your own projects:
1. Copy the example directory
2. Customize for your needs
3. Add your features
4. Deploy to production

### As Demonstrations

Show the power of the Claude Code Agent System:
- Each `.claude-build-log.md` shows the agent workflow
- See how agents collaborated to build production apps
- Understand the orchestration pattern

## Running the Examples

### Prerequisites

Different examples have different requirements:

**React Todo App**:
- Node.js 18+
- npm or yarn

**Express REST API**:
- Node.js 18+
- PostgreSQL database
- npm or yarn

**Next.js Blog** (Coming Soon):
- Node.js 18+
- PostgreSQL database
- npm or yarn

**FastAPI Service** (Coming Soon):
- Python 3.11+
- pip or poetry
- PostgreSQL database

**Landing Page** (Coming Soon):
- Modern web browser
- Optional: Docker for containerized deployment

### General Setup Pattern

```bash
# Navigate to example directory
cd <example-name>

# Install dependencies
npm install  # or pip install -r requirements.txt for Python

# Configure environment (if needed)
cp .env.example .env
# Edit .env with your settings

# Run database migrations (if applicable)
npm run prisma:migrate  # or equivalent

# Start development server
npm run dev  # or npm start, or python main.py
```

## Testing the Examples

Each example includes comprehensive tests:

```bash
# React Todo App
cd react-todo-app
npm test

# Express REST API
cd express-rest-api
npm test

# FastAPI Service (Coming Soon)
cd fastapi-service
pytest

# Landing Page (Coming Soon)
cd landing-page-full-stack
npm test
```

## Deployment

Each example includes deployment configurations:

- **Vercel**: `vercel.json` (Next.js, React)
- **Netlify**: `netlify.toml` (Static sites)
- **Docker**: `Dockerfile` and `docker-compose.yml`
- **CI/CD**: GitHub Actions workflows

See individual README files for detailed deployment instructions.

## Project Statistics

### Completed Examples

| Example | Files | LOC | Components/Routes | Tests | Coverage |
|---------|-------|-----|-------------------|-------|----------|
| React Todo App | 17 | ~900 | 4 components | 11 | 90%+ |
| Express REST API | 15 | ~1200 | 8 routes | 20+ | 80%+ |

### Coming Soon

- Next.js Full-Stack Blog
- Python FastAPI Microservice
- Landing Page with Deployment

## Learning Path

Recommended order for studying these examples:

1. **React Todo App** - Frontend fundamentals
2. **Landing Page** - HTML/CSS/JS basics
3. **Express REST API** - Backend fundamentals
4. **FastAPI Service** - Python backend patterns
5. **Next.js Blog** - Full-stack integration

## Contributing

These examples are part of the Claude Code Agent System repository. To contribute:

1. Test the examples thoroughly
2. Add improvements or fix bugs
3. Update documentation
4. Submit a pull request

## Support & Community

- **GitHub**: [claude-code-agents-wizard-v2](https://github.com/IncomeStreamSurfer/claude-code-agents-wizard-v2)
- **YouTube**: [Income Stream Surfers](https://www.youtube.com/incomestreamsurfers)
- **Community**: [ISS AI Automation School](https://www.skool.com/iss-ai-automation-school-6342/about)

## License

All examples are MIT licensed. Use them freely in your own projects!

---

**Built with the Claude Code Agent Orchestration System** 🚀

Each example demonstrates how specialized agents can collaborate to build production-ready applications with clean code, comprehensive testing, and professional documentation.
