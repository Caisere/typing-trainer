import { useEffect, useMemo, useState } from 'react';

import { calcAccuracy, calcWPM } from '../utils/metrics';
import { useTyping } from './use-typing';

export type TypingStats = {
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  errorCount: number;
  charactersTyped: number;
};

export function useTypingStats(): TypingStats {
  const { state } = useTyping();
  const [, forceUpdate] = useState({});

  // Calculate elapsed time during render
  const elapsedTime = useMemo(() => {
    if (!state.startTime) {
      return 0;
    }

    if (state.finished && state.endTime) {
      // For finished tests, use the stored end time
      return state.endTime - state.startTime;
    }

    // For active tests, calculate current elapsed time
    return Date.now() - state.startTime;
  }, [state.startTime, state.endTime, state.finished]);

  // Force re-render every 100ms for smooth updates when typing is active(watching startTime and finished for changes)
  useEffect(
    function forceRenderEffect() {
      if (!state.startTime || state.finished) {
        return;
      }

      const interval = setInterval(() => {
        forceUpdate({});
      }, 100);

      return () => clearInterval(interval);
    },
    [state.startTime, state.finished],
  );

  return {
    wpm: calcWPM(state.currentIndex, elapsedTime),
    accuracy: calcAccuracy(state.errors.size, state.currentIndex),
    elapsedTime,
    errorCount: state.errors.size,
    charactersTyped: state.currentIndex,
  };
}
