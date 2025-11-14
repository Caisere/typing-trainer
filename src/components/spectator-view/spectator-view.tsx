import { useEffect, useMemo, useRef } from 'react';

import { useRealtimeTyping } from '../../hooks/use-realtime-typing';
import { Icons } from '../../utils/icons';
import { calcAccuracy, calcWPM, formatTime } from '../../utils/metrics';
import { StatCard } from '../stats-panel';

type SpectatorViewProps = {
  sessionId: string;
  userId?: string;
  sessionName?: string;
};

export default function SpectatorView({
  sessionId,
  userId,
  sessionName,
}: SpectatorViewProps) {
  const { realtimeState, isConnected, connectionError } = useRealtimeTyping({
    roomId: sessionId,
    role: 'spectator',
    userId,
    sessionName,
    enabled: true,
  });

  const textContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to follow the current typing position
  useEffect(
    function autoScrollEffect() {
      if (!textContainerRef.current || !realtimeState.sourceText)
        return;

      const currentCharIndex = realtimeState.currentIndex;

      // Only scroll if we have a valid current index
      if (
        currentCharIndex >= 0
        && currentCharIndex < realtimeState.sourceText.length
      ) {
        // Find the current character element
        const currentCharElement = textContainerRef.current.querySelector(
          `[data-char-index="${currentCharIndex}"]`,
        );

        if (currentCharElement) {
          // Scroll the character into view with smooth behavior
          currentCharElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }
      }
    },
    [realtimeState.currentIndex, realtimeState.sourceText],
  );

  // Calculate stats directly from realtime state (no context dependency)
  const stats = useMemo(
    function calculateStats() {
      let elapsedTime = 0;

      if (realtimeState.startTime) {
        if (realtimeState.finished && realtimeState.endTime) {
          // For finished tests, use the stored end time
          elapsedTime = realtimeState.endTime - realtimeState.startTime;
        }
        else {
          // For active tests, calculate current elapsed time
          elapsedTime = Date.now() - realtimeState.startTime;
        }
      }

      return {
        wpm: calcWPM(realtimeState.currentIndex, elapsedTime),
        accuracy: calcAccuracy(
          realtimeState.errors.size,
          realtimeState.currentIndex,
        ),
        elapsedTime,
        errorCount: realtimeState.errors.size,
        charactersTyped: realtimeState.currentIndex,
      };
    },
    [realtimeState],
  );

  const renderText = () => {
    const words = realtimeState.sourceText.split(' ');
    let charIndex = 0;

    return words.map((word, wordIndex) => {
      const wordSpans = word.split('').map((char, charPos) => {
        const globalIndex = charIndex + charPos;
        let className = 'text-xl font-mono ';

        if (globalIndex === realtimeState.currentIndex) {
          // Current character being typed
          className += 'bg-blue-500 text-white animate-pulse';
        }
        else if (globalIndex < realtimeState.currentIndex) {
          // Already typed character
          if (realtimeState.errors.has(globalIndex)) {
            className += 'bg-red-300 text-red-900'; // Incorrect
          }
          else {
            className += 'bg-green-200 text-green-900'; // Correct
          }
        }
        else {
          // Not yet typed
          className += 'text-gray-600';
        }

        return (
          <span
            key={globalIndex}
            className={className}
            data-char-index={globalIndex}
          >
            {char}
          </span>
        );
      });

      charIndex = charIndex + word.length + 1; // +1 for the space

      return (
        <span key={crypto.randomUUID()} className="whitespace-nowrap">
          {wordSpans}
          {wordIndex < words.length - 1 && (
            <span className="text-xl font-mono"> </span>
          )}
        </span>
      );
    });
  };

  if (connectionError) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Connection Error
          </h1>
          <p className="text-gray-600 mb-4">{connectionError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Connecting to Session...
          </h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!realtimeState.sourceText) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6 dark:border-white/10 -mx-6 -mt-6 mb-6">
          <div className="-mt-4 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="mt-4 ml-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icons.Eye size={24} />
                {realtimeState.sessionName || 'Spectator Mode'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Waiting for the typing session to begin
              </p>
            </div>
            <div className="mt-4 ml-4 shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-50 border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-green-700">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 pb-12">
          <h3 className="text-sm font-semibold text-blue-800 mb-4">Session Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {/* Connection Event */}
              <li>
                <div className="relative pb-8">
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-blue-200" aria-hidden="true" />
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="flex size-8 items-center justify-center rounded-full bg-green-100 ring-8 ring-white">
                        <Icons.Check className="size-5 text-green-600" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-900">
                          Connected to session
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time>Just now</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Viewer Count Event */}
              <li>
                <div className="relative pb-8">
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-blue-200" aria-hidden="true" />
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="flex size-8 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
                        <Icons.Person className="size-5 text-blue-600" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-900">
                          {realtimeState.spectatorCount}
                          {' '}
                          {realtimeState.spectatorCount === 1 ? 'viewer' : 'viewers'}
                          {' '}
                          watching
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time>Now</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Waiting Status */}
              <li>
                <div className="relative pb-0">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="flex size-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                        <Icons.Timer className="size-5 text-gray-600 animate-pulse" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-900">
                          Waiting for typist to start...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            The session will begin when the typist starts typing. You'll see their progress in real-time!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Icons.Eye size={28} />
          {realtimeState.sessionName || 'Spectator Mode'}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Live Session</span>
          </div>
          <span>•</span>
          <span>
            {realtimeState.spectatorCount}
            {' '}
            viewers
          </span>
          {realtimeState.typistId && (
            <>
              <span>•</span>
              <span>
                Typist:
                {realtimeState.typistId}
              </span>
            </>
          )}
          {realtimeState.sessionName && (
            <>
              <span>•</span>
              <span>
                Session:
                {realtimeState.sessionName}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {Math.round(
                (realtimeState.currentIndex / realtimeState.sourceText.length)
                * 100,
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${
                realtimeState.finished ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.max((realtimeState.currentIndex / realtimeState.sourceText.length) * 100, 0)}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Display */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-blue-200">
            <div
              ref={textContainerRef}
              className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] break-all leading-relaxed overflow-y-auto"
            >
              {renderText()}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>
                Progress:
                {' '}
                {realtimeState.currentIndex}
                {' '}
                /
                {' '}
                {realtimeState.sourceText.length}
                {' '}
                characters
              </span>
            </div>
          </div>

          {realtimeState.finished && (
            <div className="mt-4 text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center justify-center gap-2">
                  <Icons.Celebrate size={24} />
                  Session Complete!
                </h3>
                <p className="text-green-600">
                  The typist has finished this session.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Icons.Stats size={24} />
              Live Stats
            </h2>
            <div className="space-y-3">
              <StatCard
                label="Words Per Minute"
                value={stats.wpm}
                unit="WPM"
                icon="Lightning"
                color="blue"
              />
              <StatCard
                label="Accuracy"
                value={stats.accuracy}
                unit="%"
                icon="Target"
                color={
                  stats.accuracy >= 95
                    ? 'green'
                    : stats.accuracy >= 85
                      ? 'yellow'
                      : 'red'
                }
              />
              <StatCard
                label="Time Elapsed"
                value={formatTime(stats.elapsedTime)}
                icon="Timer"
                color="blue"
              />
              <StatCard
                label="Errors Made"
                value={stats.errorCount}
                icon="Close"
                color={
                  stats.errorCount === 0
                    ? 'green'
                    : stats.errorCount <= 5
                      ? 'yellow'
                      : 'red'
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          You are viewing this session in real-time. The typist's progress
          updates live!
        </p>
      </div>
    </div>
  );
}
