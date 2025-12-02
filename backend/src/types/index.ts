export type {
  User,
  Project,
  Document,
  DocumentVersion,
  Workflow,
  WorkflowLog,
  Milestone,
  Notification,
  RefreshToken,
  UserRole,
  ProjectStatus,
  DocumentPhase,
  WorkflowStatus,
  NotificationType,
} from '@prisma/client';

// Re-export Prisma types
import type { User } from '@prisma/client';

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// Auth Types
// ============================================

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  projectId?: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: SafeUser;
  tokens: AuthTokens;
}

// Safe User (without password hash)
export type SafeUser = Omit<User, 'passwordHash'>;

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
  activeWorkflows: number;
  documentsCount: number;
  upcomingMilestones: number;
  unreadNotifications: number;
}

export interface HealthScoreDetails {
  overall: number;
  workflowHealth: number;
  milestoneProgress: number;
  documentCompleteness: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  createdAt: Date;
}

// ============================================
// Webhook Types
// ============================================

export interface N8nWebhookPayload {
  event: 'workflow_started' | 'workflow_completed' | 'workflow_failed';
  workflow: {
    id: string;
    name: string;
  };
  execution: {
    id: string;
    status: 'success' | 'failed' | 'running';
    executionTime?: number;
    errorMessage?: string;
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
  };
  timestamp: string;
}

// ============================================
// Query Types
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentFilters extends PaginationParams {
  phase?: string;
  search?: string;
}

export interface WorkflowFilters extends PaginationParams {
  status?: string;
  isActive?: boolean;
}
