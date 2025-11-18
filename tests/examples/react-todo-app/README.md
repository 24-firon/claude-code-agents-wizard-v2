# React Todo App

A production-ready React Todo application built with TypeScript, Vite, and Tailwind CSS. This example showcases the Claude Code Agent System's ability to create fully functional, well-tested applications.

## What This Example Demonstrates

- **Modern React Development**: TypeScript, hooks, and functional components
- **State Management**: Custom hooks with localStorage persistence
- **Styling**: Tailwind CSS with custom theme
- **Testing**: Comprehensive test suite with Vitest and Testing Library
- **Build Tools**: Vite for fast development and optimized production builds
- **Best Practices**: Type safety, accessibility, and clean code architecture

## Features

- **Add Todos**: Create new todo items with a simple form
- **Edit Todos**: Click edit to modify existing todos
- **Complete Todos**: Check off completed items
- **Delete Todos**: Remove todos you no longer need
- **Filter Todos**: View all, active, or completed todos
- **Clear Completed**: Bulk delete all completed todos
- **Persistent Storage**: Todos are saved to localStorage
- **Statistics**: See total, active, and completed counts
- **Responsive Design**: Works on desktop and mobile

## Agent Workflow Used

This project was built using the Claude Code Agent orchestration system:

1. **Planning Phase**: Orchestrator analyzed requirements and created detailed todo list
2. **Setup Phase**: Coder agent created project structure and configuration
3. **Development Phase**: Coder agent implemented components one by one
4. **Testing Phase**: Tester agent verified each component with Playwright
5. **Documentation Phase**: Final README and build log created

See `.claude-build-log.md` for detailed build process.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities

## How to Run

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to this directory
cd tests/examples/react-todo-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Open Vitest UI
npm run lint         # Lint code
```

## Project Structure

```
react-todo-app/
├── src/
│   ├── components/
│   │   ├── AddTodo.tsx      # Form to add new todos
│   │   ├── TodoItem.tsx     # Individual todo item with edit/delete
│   │   └── TodoList.tsx     # List of todos with empty state
│   ├── hooks/
│   │   └── useTodos.ts      # Custom hook for todo state management
│   ├── types/
│   │   └── todo.ts          # TypeScript interfaces
│   ├── test/
│   │   └── setup.ts         # Test configuration
│   ├── App.tsx              # Main application component
│   ├── App.test.tsx         # Application tests
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles with Tailwind
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── README.md                # This file
```

## Architecture Highlights

### State Management

The app uses a custom `useTodos` hook that:
- Manages all todo state in one place
- Persists todos to localStorage automatically
- Provides filtered views (all/active/completed)
- Calculates statistics (total/active/completed counts)
- Exposes simple CRUD operations

### Component Design

Components follow best practices:
- **Single Responsibility**: Each component has one clear purpose
- **Type Safety**: Full TypeScript coverage with interfaces
- **Accessibility**: ARIA labels and semantic HTML
- **Reusability**: Props-based configuration

### Testing Strategy

Comprehensive test coverage including:
- Component rendering
- User interactions (click, type, submit)
- State management
- Filtering logic
- Edge cases (empty todos, validation)

## Test Coverage

The test suite covers:
- ✅ Adding new todos
- ✅ Toggling todo completion
- ✅ Deleting todos
- ✅ Editing todos
- ✅ Canceling edits
- ✅ Filtering (all/active/completed)
- ✅ Clearing completed todos
- ✅ Statistics calculations
- ✅ Empty state handling
- ✅ Input validation

Run tests with `npm test` or `npm run test:watch` for development.

## Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Persistence

The app uses localStorage by default. To use a different storage mechanism, modify the `useTodos` hook in `src/hooks/useTodos.ts`.

## Production Deployment

Build the app for production:

```bash
npm run build
```

The optimized build will be in the `dist/` directory, ready to deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Learning Resources

This example demonstrates:
- React functional components and hooks
- TypeScript in React applications
- Custom hook patterns
- localStorage integration
- Tailwind CSS utility classes
- Component testing with Vitest

## License

MIT - Feel free to use this as a starting point for your own projects!

## Built With

Claude Code Agent Orchestration System - https://github.com/IncomeStreamSurfer/claude-code-agents-wizard-v2
