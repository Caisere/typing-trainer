import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Tournament } from '@/components/tournament/tournament';
import TournamentSessionManager from '@/components/tournament/tournament-session-manager';

type SearchParams = {
  tournamentId?: string;
  username?: string;
  userId?: string;
  mode?: 'create' | 'join';
};

export const Route = createFileRoute('/tournament')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      tournamentId: search.tournamentId as string | undefined,
      username: search.username as string | undefined,
      userId: search.userId as string | undefined,
      mode: (search.mode as 'create' | 'join' | undefined) || 'create',
    };
  },
  component: TournamentRoute,
});

function TournamentRoute() {
  const navigate = useNavigate();
  const { tournamentId, username, userId: urlUserId, mode } = Route.useSearch();

  // Use userId from URL if present, otherwise try sessionStorage, otherwise generate new
  const [userId] = useState(() => {
    if (urlUserId) {
      sessionStorage.setItem('typing-tournament-userId', urlUserId);
      return urlUserId;
    }

    const stored = sessionStorage.getItem('typing-tournament-userId');
    if (stored && tournamentId) {
      return stored;
    }

    const newId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('typing-tournament-userId', newId);
    return newId;
  });

  const hasUpdatedUrl = useRef(false);

  // If we're in a tournament but userId is not in URL, add it
  useEffect(() => {
    if (tournamentId && username && !urlUserId && !hasUpdatedUrl.current) {
      hasUpdatedUrl.current = true;
      navigate({
        to: '/tournament',
        search: { tournamentId, username, userId, mode },
        replace: true,
      });
    }
  }, [tournamentId, username, urlUserId, userId, mode, navigate]);

  const handleCreateTournament = (hostUsername: string) => {
    // Generate a unique tournament ID
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let tournamentCode = 'TOUR-';
    for (let i = 0; i < 4; i++) {
      tournamentCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    navigate({
      to: '/tournament',
      search: {
        tournamentId: tournamentCode,
        username: hostUsername,
        userId,
        mode: 'create',
      },
    });
  };

  const handleJoinTournament = (tournamentCode: string, joinUsername: string) => {
    navigate({
      to: '/tournament',
      search: {
        tournamentId: tournamentCode,
        username: joinUsername,
        userId,
        mode: 'join',
      },
    });
  };

  // Show session manager if no tournament ID
  if (!tournamentId || !username) {
    return (
      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        <TournamentSessionManager
          onCreateTournament={handleCreateTournament}
          onJoinTournament={handleJoinTournament}
        />
      </div>
    );
  }

  return (
    <Tournament
      tournamentId={tournamentId}
      userId={userId}
      username={username}
      mode={mode || 'create'}
    />
  );
}
