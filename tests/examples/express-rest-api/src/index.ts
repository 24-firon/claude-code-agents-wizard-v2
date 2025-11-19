import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/posts`, postRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Express REST API - Claude Code Agent System Example',
    version: API_VERSION,
    endpoints: {
      health: '/health',
      users: `/api/${API_VERSION}/users`,
      posts: `/api/${API_VERSION}/posts`,
    },
    documentation: 'See README.md for full API documentation',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  const statusCode = (err as any).statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: err.name || 'Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server is running!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📝 API Version: ${API_VERSION}
🔗 Health Check: http://localhost:${PORT}/health
📚 API Base: http://localhost:${PORT}/api/${API_VERSION}

Available endpoints:
  GET    /api/${API_VERSION}/users
  POST   /api/${API_VERSION}/users
  GET    /api/${API_VERSION}/users/:id
  PUT    /api/${API_VERSION}/users/:id
  DELETE /api/${API_VERSION}/users/:id

  GET    /api/${API_VERSION}/posts
  POST   /api/${API_VERSION}/posts
  GET    /api/${API_VERSION}/posts/:id
  PUT    /api/${API_VERSION}/posts/:id
  DELETE /api/${API_VERSION}/posts/:id
  GET    /api/${API_VERSION}/posts/author/:authorId
  POST   /api/${API_VERSION}/posts/:id/publish
  POST   /api/${API_VERSION}/posts/:id/unpublish
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
