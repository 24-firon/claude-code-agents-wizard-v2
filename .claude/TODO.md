# Example Projects TODO List

## Example 1: React Todo App

### Setup & Configuration
- [ ] Create react-todo-app directory structure
- [ ] Create package.json with React, TypeScript, Vite, Tailwind, Vitest
- [ ] Create vite.config.ts with proper configuration
- [ ] Create tsconfig.json for TypeScript
- [ ] Create tailwind.config.js with theme setup
- [ ] Create index.html entry point

### Source Files
- [ ] Create src/types/todo.ts with TypeScript interfaces
- [ ] Create src/hooks/useTodos.ts with state management logic
- [ ] Create src/components/TodoItem.tsx component
- [ ] Create src/components/AddTodo.tsx form component
- [ ] Create src/components/TodoList.tsx main list component
- [ ] Create src/App.tsx main application
- [ ] Create src/main.tsx entry point
- [ ] Create src/index.css with Tailwind directives

### Testing & Documentation
- [ ] Create src/App.test.tsx with comprehensive tests
- [ ] Create README.md with overview, setup, and usage
- [ ] Create .claude-build-log.md documenting agent workflow
- [ ] Create .gitignore for React project

## Example 2: Express REST API

### Setup & Configuration
- [ ] Create express-rest-api directory structure
- [ ] Create package.json with Express, TypeScript, Prisma, Jest
- [ ] Create tsconfig.json for Node/Express
- [ ] Create jest.config.js for testing
- [ ] Create .env.example with environment variables
- [ ] Create prisma/schema.prisma with database models

### Source Files
- [ ] Create src/models/user.ts user model
- [ ] Create src/models/post.ts post model
- [ ] Create src/middleware/auth.ts authentication middleware
- [ ] Create src/middleware/validation.ts validation middleware
- [ ] Create src/controllers/userController.ts user CRUD operations
- [ ] Create src/controllers/postController.ts post CRUD operations
- [ ] Create src/routes/users.ts user routes
- [ ] Create src/routes/posts.ts post routes
- [ ] Create src/index.ts Express server setup

### Testing & Documentation
- [ ] Create tests/users.test.ts user API tests
- [ ] Create tests/posts.test.ts post API tests
- [ ] Create README.md with API documentation
- [ ] Create .claude-build-log.md documenting build process
- [ ] Create .gitignore for Node project

## Example 3: Next.js Full-Stack Blog

### Setup & Configuration
- [ ] Create nextjs-blog directory structure
- [ ] Create package.json with Next.js 14, TypeScript, Prisma, NextAuth
- [ ] Create next.config.js configuration
- [ ] Create tsconfig.json for Next.js
- [ ] Create tailwind.config.ts with theme
- [ ] Create prisma/schema.prisma blog database schema
- [ ] Create .env.example with all required variables

### Components & UI
- [ ] Create components/Header.tsx navigation header
- [ ] Create components/Footer.tsx site footer
- [ ] Create components/BlogCard.tsx blog post card
- [ ] Create app/layout.tsx root layout
- [ ] Create app/page.tsx home page
- [ ] Create app/blog/page.tsx blog listing page
- [ ] Create app/blog/[slug]/page.tsx individual blog post page

### API & Auth
- [ ] Create lib/db.ts Prisma database client
- [ ] Create lib/auth.ts NextAuth configuration
- [ ] Create app/api/auth/[...nextauth]/route.ts auth routes
- [ ] Create app/api/posts/route.ts posts API endpoints

### Styling & Documentation
- [ ] Create app/globals.css with Tailwind and custom styles
- [ ] Create README.md with comprehensive documentation
- [ ] Create .claude-build-log.md build process log
- [ ] Create .gitignore for Next.js project

## Example 4: Python FastAPI Microservice

### Setup & Configuration
- [ ] Create fastapi-service directory structure
- [ ] Create requirements.txt with all Python dependencies
- [ ] Create config.py application configuration
- [ ] Create database.py SQLAlchemy setup
- [ ] Create Dockerfile for containerization
- [ ] Create .env.example environment template

### Models & Schemas
- [ ] Create models/user.py SQLAlchemy user model
- [ ] Create models/item.py SQLAlchemy item model
- [ ] Create schemas/user.py Pydantic user schemas
- [ ] Create schemas/item.py Pydantic item schemas

### Routers & Main App
- [ ] Create routers/users.py user endpoints
- [ ] Create routers/items.py item endpoints
- [ ] Create main.py FastAPI application setup

### Testing & Documentation
- [ ] Create tests/test_users.py user endpoint tests
- [ ] Create tests/test_items.py item endpoint tests
- [ ] Create README.md with API documentation
- [ ] Create .claude-build-log.md build log
- [ ] Create .gitignore for Python project

## Example 5: Landing Page with Deployment

### Setup & Structure
- [ ] Create landing-page-full-stack directory structure
- [ ] Create index.html semantic HTML5 structure
- [ ] Create css/style.css modern responsive styles
- [ ] Create css/animations.css smooth animations
- [ ] Create js/main.js core JavaScript functionality
- [ ] Create js/form-handler.js form validation and submission

### Assets & Resources
- [ ] Create images/hero-bg.svg hero background image
- [ ] Create images/feature-1.svg feature icon 1
- [ ] Create images/feature-2.svg feature icon 2
- [ ] Create images/feature-3.svg feature icon 3

### Deployment Configurations
- [ ] Create Dockerfile for Docker deployment
- [ ] Create docker-compose.yml multi-container setup
- [ ] Create vercel.json Vercel configuration
- [ ] Create netlify.toml Netlify configuration
- [ ] Create .github/workflows/deploy.yml CI/CD pipeline

### Documentation
- [ ] Create README.md with deployment instructions
- [ ] Create .claude-build-log.md documenting agent workflow
- [ ] Create .gitignore for static site

## Cross-Project Tasks

- [ ] Create master README.md in /tests/examples/ explaining all examples
- [ ] Verify all examples follow best practices
- [ ] Ensure all examples are production-ready
- [ ] Validate all deployment configurations
