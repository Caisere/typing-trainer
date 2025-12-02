import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTournament } from '@/hooks/use-tournament';
import type { Match, MatchResult, TournamentSettings } from '@/types/tournament.types';
import { TournamentCreator } from './tournament-creator';
import { TournamentLobby } from './tournament-lobby';
import { TournamentBracket } from './tournament-bracket';
import { TournamentMatch } from './tournament-match';
import { TournamentResults } from './tournament-results';
import { Loader2 } from 'lucide-react';

interface TournamentProps {
  tournamentId: string;
  userId: string;
  username: string;
  mode: 'create' | 'join';
}

export function Tournament({ tournamentId, userId, username, mode }: TournamentProps) {
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const {
    tournament,
    error,
    isConnected,
    createTournament,
    joinTournament,
    startTournament,
    readyForMatch,
    matchComplete,
    leaveTournament,
  } = useTournament(tournamentId, userId);

  // Auto-join when entering join mode
  useEffect(() => {
    if (mode === 'join' && isConnected && !tournament) {
      joinTournament(username);
    }
  }, [mode, isConnected, tournament, joinTournament, username]);

  // Auto-select and update user's active or ready match
  useEffect(() => {
    if (!tournament)
      return;

    // Find a match that the user is in and is ready or active
    for (const round of tournament.rounds) {
      for (const match of round.matches) {
        if (
          match.participants.includes(userId)
          && (match.state === 'ready' || match.state === 'active')
        ) {
          // Update selected match if it's the same match but state changed
          if (selectedMatch?.id === match.id) {
            setSelectedMatch(match);
          }
          // Auto-select if no match selected
          else if (!selectedMatch) {
            setSelectedMatch(match);
          }
          return;
        }
      }
    }
  }, [tournament, userId, selectedMatch]);

  const handleCreateTournament = (settings: TournamentSettings, name: string, hostUsername: string) => {
    createTournament(settings, name, hostUsername);
  };

  const handleStartTournament = () => {
    startTournament();
  };

  const handleLeaveTournament = () => {
    leaveTournament();
    navigate({ to: '/' });
  };

  const handleMatchClick = (match: Match) => {
    // Only allow clicking on matches the user is in
    if (match.participants.includes(userId)) {
      setSelectedMatch(match);
    }
  };

  const handleBackToBracket = () => {
    setSelectedMatch(null);
  };

  const handleMatchComplete = (matchId: string, results: MatchResult[]) => {
    matchComplete(matchId, results);
    // Stay on match view to see results
  };

  const handleReadyForMatch = (matchId: string) => {
    readyForMatch(matchId);
  };

  const handleBackToHome = () => {
    navigate({ to: '/' });
  };

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-300">Error</h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={handleBackToHome}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Connecting to tournament...</p>
        </div>
      </div>
    );
  }

  // Create mode - show creator only if tournament not created yet
  if (mode === 'create' && !tournament) {
    return (
      <TournamentCreator
        userId={userId}
        username={username}
        onCreateTournament={handleCreateTournament}
      />
    );
  }

  // No tournament loaded yet
  if (!tournament) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading tournament...</p>
        </div>
      </div>
    );
  }

  const isHost = tournament.hostUserId === userId;

  // Tournament completed - show results
  if (tournament.state === 'completed') {
    return (
      <TournamentResults
        tournament={tournament}
        userId={userId}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Selected match view
  if (selectedMatch) {
    return (
      <TournamentMatch
        tournament={tournament}
        match={selectedMatch}
        userId={userId}
        username={username}
        onMatchComplete={handleMatchComplete}
        onReadyForMatch={handleReadyForMatch}
        onBackToBracket={handleBackToBracket}
      />
    );
  }

  // Registration/Lobby state
  if (tournament.state === 'registration' || tournament.state === 'ready') {
    return (
      <TournamentLobby
        tournament={tournament}
        userId={userId}
        isHost={isHost}
        onStartTournament={handleStartTournament}
        onLeaveTournament={handleLeaveTournament}
      />
    );
  }

  // In-progress - show bracket
  if (tournament.state === 'in-progress') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {tournament.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Round
              {' '}
              {tournament.currentRound}
              {' '}
              of
              {' '}
              {tournament.rounds.filter(r => r.bracket === 'winners').length}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLeaveTournament}
            className="rounded-md bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
          >
            Leave Tournament
          </button>
        </div>

        <TournamentBracket
          tournament={tournament}
          userId={userId}
          onMatchClick={handleMatchClick}
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Unknown tournament state</p>
      </div>
    </div>
  );
}
