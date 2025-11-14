import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { RealtimeTypingTrainer } from '../components/realtime-typing-trainer';
import { SessionManager } from '../components/session-manager';
import { generateSessionOGImageUrl } from '../utils/og-image';

type SessionSearchParams = {
  sessionId?: string;
  userId?: string;
  sessionName?: string;
};

export const Route = createFileRoute('/session')({
  ssr: true,
  validateSearch: (search: Record<string, unknown>): SessionSearchParams => {
    return {
      sessionId: search.sessionId as string | undefined,
      userId: search.userId as string | undefined,
      sessionName: search.sessionName as string | undefined,
    };
  },
  head: ({ match }) => {
    const { sessionId } = match.search;
    if (!sessionId) {
      return {
        title: 'Real-time Typing Sessions',
        meta: [
          {
            name: 'description',
            content: 'Create or join real-time typing sessions with live spectators and collaboration features.',
          },
        ],
      };
    }

    return {
      title: `Typing Session - ${sessionId}`,
      meta: [
        {
          name: 'description',
          content: `Join this real-time typing session (${sessionId}) and improve your typing skills with live collaboration.`,
        },
        {
          property: 'og:title',
          content: `Typing Session - ${sessionId}`,
        },
        {
          property: 'og:description',
          content: 'Real-time typing practice session. Join and start typing to improve your speed and accuracy.',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:image',
          content: generateSessionOGImageUrl(sessionId),
        },
        {
          property: 'og:logo',
          content: 'https://deploy-preview-3--realtime-typing-trainer.netlify.app/favicon.ico',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: `Typing Session - ${sessionId}`,
        },
        {
          name: 'twitter:description',
          content: 'Real-time typing practice session. Join and start typing to improve your speed and accuracy.',
        },
        {
          name: 'twitter:image',
          content: generateSessionOGImageUrl(sessionId),
        },
      ],
      links: [
        {
          rel: 'canonical',
          href: `https://deploy-preview-3--realtime-typing-trainer.netlify.app/session?sessionId=${sessionId}`,
        },
      ],
    };
  },
  component: SessionPage,
});

function SessionPage() {
  const navigate = useNavigate();
  const { sessionId, userId, sessionName } = Route.useSearch();
  const [generatedUserId] = useState(
    () => userId || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  );

  const handleStartSession = (
    newSessionId: string,
    role: 'typist' | 'spectator',
    newSessionName?: string,
  ) => {
    if (role === 'typist') {
      navigate({
        to: '/session',
        search: { sessionId: newSessionId, ...(newSessionName && { sessionName: newSessionName }) },
      });
    }
    else {
      navigate({
        to: '/spectator',
        search: { sessionId: newSessionId, ...(newSessionName && { sessionName: newSessionName }) },
      });
    }
  };

  // Show session manager if no sessionId
  if (!sessionId) {
    return <SessionManager onStartSession={handleStartSession} />;
  }

  // Show typing trainer if sessionId exists
  return <RealtimeTypingTrainer sessionId={sessionId} userId={generatedUserId} sessionName={sessionName} />;
}
