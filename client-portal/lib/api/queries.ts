import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type {
  User,
  LoginCredentials,
  Document,
  DocumentUpload,
  WorkflowLog,
  Notification,
  DashboardHealth,
  DashboardMetrics,
} from '@/types';

// Query Keys
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  projects: {
    list: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
  },
  dashboard: {
    health: (projectId: string) => ['dashboard', 'health', projectId] as const,
    metrics: (projectId: string) => ['dashboard', 'metrics', projectId] as const,
  },
  documents: {
    list: (projectId: string) => ['documents', projectId] as const,
    detail: (id: string) => ['documents', 'detail', id] as const,
  },
  workflows: {
    list: (projectId: string) => ['workflows', projectId] as const,
    logs: (projectId: string, workflowId: string) => ['workflows', projectId, workflowId] as const,
  },
  notifications: {
    list: ['notifications'] as const,
    unread: ['notifications', 'unread'] as const,
  },
};

// Auth Hooks
export function useLogin() {
  const { login } = useAuthStore();
  const { addToast } = useUIStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiClient.post<{ user: User }>('/auth/login', credentials),
    onSuccess: (data) => {
      login(data.user);
      addToast({ title: 'Login successful', type: 'success' });
    },
    onError: (error: any) => {
      addToast({ title: 'Login failed', description: error.message, type: 'error' });
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => apiClient.get<User>('/auth/me'),
    enabled: !!user,
  });
}

// Dashboard Hooks
export function useDashboardHealth(projectId: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.health(projectId),
    queryFn: () => apiClient.get<DashboardHealth>(`/projects/${projectId}/dashboard/health`),
    refetchInterval: 30000, // Poll every 30 seconds
    enabled: !!projectId,
  });
}

export function useDashboardMetrics(projectId: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics(projectId),
    queryFn: () => apiClient.get<DashboardMetrics>(`/projects/${projectId}/dashboard/metrics`),
    enabled: !!projectId,
  });
}

// Documents Hooks
export function useDocuments(projectId: string) {
  return useQuery({
    queryKey: queryKeys.documents.list(projectId),
    queryFn: () => apiClient.get<Document[]>(`/projects/${projectId}/documents`),
    enabled: !!projectId,
  });
}

export function useUploadDocument(projectId: string) {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  return useMutation({
    mutationFn: (upload: DocumentUpload) =>
      apiClient.upload(`/projects/${projectId}/documents`, upload.file, {
        name: upload.name,
        phase: upload.phase,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.list(projectId) });
      addToast({ title: 'Document uploaded successfully', type: 'success' });
    },
    onError: (error: any) => {
      addToast({ title: 'Upload failed', description: error.message, type: 'error' });
    },
  });
}

// Workflows Hooks
export function useWorkflows(projectId: string) {
  return useQuery({
    queryKey: queryKeys.workflows.list(projectId),
    queryFn: () => apiClient.get<WorkflowLog[]>(`/projects/${projectId}/workflows`),
    refetchInterval: 30000, // Poll every 30 seconds
    enabled: !!projectId,
  });
}

// Notifications Hooks
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list,
    queryFn: () => apiClient.get<Notification[]>('/notifications/center'),
    refetchInterval: 60000, // Poll every minute
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => apiClient.put(`/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list });
    },
  });
}
