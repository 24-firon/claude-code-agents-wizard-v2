// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Polling Intervals
export const POLLING_INTERVAL = 30000; // 30 seconds
export const NOTIFICATION_POLL_INTERVAL = 60000; // 1 minute

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const DOCUMENTS_PAGE_SIZE = 20;
export const NOTIFICATIONS_PAGE_SIZE = 20;

// File Upload
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
];

// Toast Display Duration
export const TOAST_DURATION = 5000; // 5 seconds

// Health Score Thresholds
export const HEALTH_SCORE_EXCELLENT = 80;
export const HEALTH_SCORE_GOOD = 60;

// Role Permissions
export const ROLE_PERMISSIONS = {
  CEO: ['dashboard:view'],
  CTO: ['dashboard:view', 'technical:view', 'api_keys:manage'],
  PM: ['dashboard:view', 'documents:upload', 'documents:delete'],
  ADMIN: ['*'], // All permissions
} as const;

// Document Phases
export const DOCUMENT_PHASES = [
  'REQUIREMENTS',
  'DESIGN',
  'DEVELOPMENT',
  'TESTING',
  'DEPLOYMENT',
] as const;

// Workflow Statuses
export const WORKFLOW_STATUSES = ['SUCCESS', 'FAILED', 'IN_PROGRESS', 'TIMEOUT', 'ERROR'] as const;

// Notification Types
export const NOTIFICATION_TYPES = [
  'WORKFLOW_COMPLETED',
  'WORKFLOW_FAILED',
  'MILESTONE_COMPLETED',
  'DOCUMENT_UPLOADED',
  'BLOCKER_CREATED',
  'WEEKLY_SUMMARY',
  'ACCESS_REQUEST',
] as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TECHNICAL: '/technical',
  DOCUMENTS: '/documents',
  TIMELINE: '/timeline',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',
  SECURITY: '/settings/security',
  PREFERENCES: '/settings/preferences',
} as const;

// Translation Keys
export const LANGUAGES = {
  EN: 'en',
  DE: 'de',
} as const;
