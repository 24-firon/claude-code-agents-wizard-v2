// User & Authentication Types
export type UserRole = 'CEO' | 'CTO' | 'PM' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken?: string;
  };
}

// Project Types
export type ProjectStatus = 'ON_TRACK' | 'AT_RISK' | 'BLOCKED';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  healthScore: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

// Document Types
export type DocumentPhase = 'REQUIREMENTS' | 'DESIGN' | 'DEVELOPMENT' | 'TESTING' | 'DEPLOYMENT';

export interface Document {
  id: string;
  projectId: string;
  name: string;
  phase: DocumentPhase;
  filePath: string;
  fileSize: number;
  mimeType: string | null;
  version: number;
  uploaderId: string;
  uploader?: User;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUpload {
  name: string;
  phase: DocumentPhase;
  file: File;
}

// Workflow Types
export type WorkflowStatus = 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'TIMEOUT' | 'ERROR';

export interface WorkflowLog {
  id: string;
  projectId: string;
  n8nWorkflowId: string;
  n8nWorkflowName: string;
  executionId: string;
  status: WorkflowStatus;
  executionTimeMs: number | null;
  errorMessage: string | null;
  executionDetails: Record<string, any> | null;
  inputData: Record<string, any> | null;
  outputData: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export type NotificationType =
  | 'WORKFLOW_COMPLETED'
  | 'WORKFLOW_FAILED'
  | 'MILESTONE_COMPLETED'
  | 'DOCUMENT_UPLOADED'
  | 'BLOCKER_CREATED'
  | 'WEEKLY_SUMMARY'
  | 'ACCESS_REQUEST';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, any> | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  workflowCompleted: boolean;
  workflowFailed: boolean;
  milestoneCompleted: boolean;
  documentUploaded: boolean;
  blockerCreated: boolean;
  weeklySummary: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  emailFrequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'NEVER';
  updatedAt: string;
}

// Dashboard Types
export interface DashboardHealth {
  healthScore: number;
  status: ProjectStatus;
  totalWorkflows: number;
  successfulWorkflows: number;
  failedWorkflows: number;
  successRate: number;
  lastUpdated: string;
}

export interface DashboardMetrics {
  totalDocuments: number;
  documentsByPhase: Record<DocumentPhase, number>;
  recentActivity: ActivityItem[];
  milestones: Milestone[];
}

export interface ActivityItem {
  id: string;
  type: 'workflow' | 'document' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'error' | 'warning';
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  completedDate: string | null;
  status: 'completed' | 'in_progress' | 'pending';
  description: string | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Settings Types
export interface UserSettings {
  language: 'en' | 'de';
  theme: 'dark' | 'light';
  timezone: string;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastSync: string | null;
  errorMessage: string | null;
}
