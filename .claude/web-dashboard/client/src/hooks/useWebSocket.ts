import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

interface WebSocketState {
  isConnected: boolean;
  error: Error | null;
  lastMessage: any;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = 'http://localhost:4000',
    autoConnect = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    error: null,
    lastMessage: null,
  });

  const listeners = useRef<Map<string, Set<Function>>>(new Map());

  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    const socket = io(url, {
      reconnectionAttempts,
      reconnectionDelay,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setState(prev => ({ ...prev, isConnected: true, error: null }));
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setState(prev => ({ ...prev, isConnected: false }));
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setState(prev => ({ ...prev, error, isConnected: false }));
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      setState(prev => ({ ...prev, error }));
    });

    // Generic message handler
    socket.onAny((event, data) => {
      setState(prev => ({ ...prev, lastMessage: { event, data } }));

      // Call registered listeners
      const eventListeners = listeners.current.get(event);
      if (eventListeners) {
        eventListeners.forEach(callback => callback(data));
      }
    });

    socketRef.current = socket;
  }, [url, reconnectionAttempts, reconnectionDelay]);

  // Disconnect from WebSocket server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  // Subscribe to event
  const on = useCallback((event: string, callback: Function) => {
    if (!listeners.current.has(event)) {
      listeners.current.set(event, new Set());
    }
    listeners.current.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = listeners.current.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
      }
    };
  }, []);

  // Emit event
  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Cannot emit event: socket not connected');
    }
  }, []);

  // Subscribe to data streams
  const subscribe = useCallback((streams: string[]) => {
    emit('subscribe', { streams });
  }, [emit]);

  // Unsubscribe from data streams
  const unsubscribe = useCallback((streams: string[]) => {
    emit('unsubscribe', { streams });
  }, [emit]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    on,
    emit,
    subscribe,
    unsubscribe,
    socket: socketRef.current,
  };
}
