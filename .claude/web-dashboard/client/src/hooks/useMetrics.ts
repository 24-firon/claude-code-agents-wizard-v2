import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

const API_BASE = '/api';

interface Metrics {
  type: string;
  id: string;
  metrics: any;
  timestamp: string;
}

// Fetch todos
export function useTodos(workspace: string = 'default-project') {
  const queryClient = useQueryClient();
  const { on } = useWebSocket();

  const query = useQuery({
    queryKey: ['todos', workspace],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/todos?workspace=${workspace}`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      return response.json();
    },
  });

  // Listen for real-time updates
  useEffect(() => {
    const unsubscribe = on('todos:updated', (data: any) => {
      if (data.workspace === workspace) {
        queryClient.setQueryData(['todos', workspace], {
          success: true,
          workspace: data.workspace,
          todos: data.todos,
          count: data.todos.length,
        });
      }
    });

    return unsubscribe;
  }, [workspace, on, queryClient]);

  return query;
}

// Fetch session metrics
export function useSessionMetrics(sessionId: string) {
  return useQuery({
    queryKey: ['metrics', 'session', sessionId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/metrics/session/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch session metrics');
      return response.json();
    },
    enabled: !!sessionId,
  });
}

// Fetch daily metrics
export function useDailyMetrics() {
  const queryClient = useQueryClient();
  const { on } = useWebSocket();

  const query = useQuery({
    queryKey: ['metrics', 'daily'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/metrics/daily`);
      if (!response.ok) throw new Error('Failed to fetch daily metrics');
      return response.json();
    },
  });

  // Listen for real-time updates
  useEffect(() => {
    const unsubscribe = on('metrics:updated', (data: Metrics) => {
      if (data.type === 'daily') {
        queryClient.invalidateQueries({ queryKey: ['metrics', 'daily'] });
      }
    });

    return unsubscribe;
  }, [on, queryClient]);

  return query;
}

// Fetch agents
export function useAgents() {
  const queryClient = useQueryClient();
  const { on } = useWebSocket();

  const query = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/agents`);
      if (!response.ok) throw new Error('Failed to fetch agents');
      return response.json();
    },
  });

  // Listen for real-time updates
  useEffect(() => {
    const unsubscribe = on('metrics:updated', (data: Metrics) => {
      if (data.type === 'agent') {
        queryClient.invalidateQueries({ queryKey: ['agents'] });
      }
    });

    return unsubscribe;
  }, [on, queryClient]);

  return query;
}

// Fetch workspaces
export function useWorkspaces() {
  const queryClient = useQueryClient();
  const { on } = useWebSocket();

  const query = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/workspaces`);
      if (!response.ok) throw new Error('Failed to fetch workspaces');
      return response.json();
    },
  });

  // Listen for real-time updates
  useEffect(() => {
    const unsubscribe = on('workspace:changed', () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    });

    return unsubscribe;
  }, [on, queryClient]);

  return query;
}

// Switch workspace
export async function switchWorkspace(workspace: string) {
  const response = await fetch(`${API_BASE}/workspace/switch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workspace }),
  });

  if (!response.ok) throw new Error('Failed to switch workspace');
  return response.json();
}
