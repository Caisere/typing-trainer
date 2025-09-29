import PartySocket from 'partysocket';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { TypingState } from '../context/typing-context';

/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */

export type RealtimeTypingState = {
  spectatorCount: number;
  isConnected: boolean;
  connectionError: string | null;
  typistId: string | null;
} & TypingState;

type UseRealtimeTypingOptions = {
  roomId: string;
  role: 'typist' | 'spectator';
  userId?: string;
  enabled?: boolean;
  host?: string;
};

type TypingEvent = {
  type: string;
  data?: any;
  timestamp: number;
};

export function useRealtimeTyping(options: UseRealtimeTypingOptions) {
  const {
    roomId,
    role,
    userId = `user-${Date.now()}`,
    enabled = true,
    host = import.meta.env.DEV
      ? 'localhost:1999'
      : 'typing-trainer.oluwasetemi.partykit.dev',
  } = options;

  const [realtimeState, setRealtimeState] = useState<RealtimeTypingState>(
    () => ({
      sourceText: '',
      currentIndex: 0,
      errors: new Set(),
      startTime: null,
      endTime: null,
      finished: false,
      typedText: '',
      spectatorCount: 0,
      isConnected: false,
      connectionError: null,
      typistId: null,
    }),
  );

  const socketRef = useRef<PartySocket | null>(null);
  const isTypist = role === 'typist';

  const connect = useCallback(() => {
    if (!enabled || socketRef.current)
      return;

    try {
      const socket = new PartySocket({
        host,
        room: roomId,
        protocol: 'ws',
        query: {
          role,
          userId,
        },
      });

      socket.addEventListener('open', () => {
        setRealtimeState(prev => ({
          ...prev,
          isConnected: true,
          connectionError: null,
        }));
      });

      socket.addEventListener('message', (event) => {
        try {
          const typingEvent: TypingEvent = JSON.parse(event.data);

          switch (typingEvent.type) {
            case 'SESSION_INIT':
            case 'SPECTATOR_INIT':
              setRealtimeState(prev => ({
                ...prev,
                ...typingEvent.data,
                errors: new Set(typingEvent.data.errors || []),
              }));
              break;

            case 'TYPING_UPDATE':
              if (!isTypist) {
                // Only spectators should update their state from remote typing
                setRealtimeState(prev => ({
                  ...prev,
                  ...typingEvent.data,
                  errors: new Set(typingEvent.data.errors || []),
                }));
              }
              break;

            case 'SESSION_START':
              setRealtimeState(prev => ({
                ...prev,
                typistId: typingEvent.data.typistId,
                isActive: true,
              }));
              break;

            case 'SESSION_END':
              setRealtimeState(prev => ({
                ...prev,
                finished: true,
                endTime: Date.now(),
                isActive: false,
              }));
              break;

            case 'SPECTATOR_JOIN':
            case 'SPECTATOR_LEAVE':
              setRealtimeState(prev => ({
                ...prev,
                spectatorCount: typingEvent.data.spectatorCount,
              }));
              break;

            case 'CONNECTION_REJECTED':
              setRealtimeState(prev => ({
                ...prev,
                connectionError: typingEvent.data.reason,
              }));
              break;
          }
        }
        catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      socket.addEventListener('error', (error) => {
        console.error('Error:', error);
        setRealtimeState(prev => ({
          ...prev,
          isConnected: false,
          connectionError: 'Connection error occurred',
        }));
      });

      socket.addEventListener('close', () => {
        console.error('Socket closed');
        setRealtimeState(prev => ({
          ...prev,
          isConnected: false,
        }));
      });

      socketRef.current = socket;
    }
    catch (error) {
      console.error('Error:', error);
      setRealtimeState(prev => ({
        ...prev,
        connectionError: 'Failed to create connection',
      }));
    }
  }, [enabled, host, roomId, role, userId, isTypist]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setRealtimeState(prev => ({
        ...prev,
        isConnected: false,
      }));
    }
  }, []);

  const broadcastTypingUpdate = useCallback(
    (typingState: TypingState) => {
      if (!socketRef.current || !isTypist)
        return;

      const event: TypingEvent = {
        type: 'TYPING_UPDATE',
        data: {
          ...typingState,
          errors: Array.from(typingState.errors), // Convert Set to Array for JSON
        },
        timestamp: Date.now(),
      };

      socketRef.current.send(JSON.stringify(event));
    },
    [isTypist],
  );

  const broadcastSessionEnd = useCallback(() => {
    if (!socketRef.current || !isTypist)
      return;

    const event: TypingEvent = {
      type: 'SESSION_END',
      data: {},
      timestamp: Date.now(),
    };

    socketRef.current.send(JSON.stringify(event));
  }, [isTypist]);

  // Auto-connect when options change
  useEffect(
    function autoConnectEffect() {
      if (enabled) {
        connect();
      }
      else {
        disconnect();
      }

      return () => {
        disconnect();
      };
    },
    [enabled, connect, disconnect],
  );

  return {
    realtimeState,
    isConnected: realtimeState.isConnected,
    connectionError: realtimeState.connectionError,
    connect,
    disconnect,
    broadcastTypingUpdate,
    broadcastSessionEnd,
  };
}
