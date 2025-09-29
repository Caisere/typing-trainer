import { useEffect, useRef } from 'react';

import { useTyping } from '../../hooks/use-typing';

export default function TextDisplay() {
  const { state } = useTyping();
  const { sourceText, currentIndex, errors } = state;
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to keep current character visible
  useEffect(
    function autoScroll() {
      if (containerRef.current && currentIndex > 0) {
        const container = containerRef.current;
        const currentCharElement = container.children[
          currentIndex
        ] as HTMLElement;

        if (currentCharElement) {
          const containerRect = container.getBoundingClientRect();
          const charRect = currentCharElement.getBoundingClientRect();

          // Check if current character is outside the visible area
          const isOutOfView
            = charRect.left < containerRect.left
              || charRect.right > containerRect.right
              || charRect.top < containerRect.top
              || charRect.bottom > containerRect.bottom;

          if (isOutOfView) {
            // Scroll the character into view
            currentCharElement.scrollIntoView({
              behavior: 'instant',
              block: 'nearest',
              inline: 'center',
            });
          }
        }
      }
    },
    [currentIndex],
  );

  // Reset scroll position when typing is finished
  useEffect(
    function resetScroll() {
      if (state.finished && containerRef.current) {
        containerRef.current.scrollTo({
          top: -10,
          left: 0,
          behavior: 'instant',
        });
      }
    },
    [state.finished],
  );

  const renderCharacter = (char: string, index: number) => {
    let className = 'text-lg font-mono ';

    if (index === currentIndex) {
      // Current character to type
      className += 'bg-blue-300 text-white animate-pulse';
    }
    else if (index < currentIndex) {
      // Already typed character
      if (errors.has(index)) {
        className += 'bg-red-200 text-red-800'; // Incorrect
      }
      else {
        className += 'bg-green-100 text-green-800'; // Correct
      }
    }
    else {
      // Not yet typed
      className += 'text-gray-600';
    }

    return (
      <span
        key={index}
        className={className}
        aria-label={
          index === currentIndex ? `Current character: ${char}` : undefined
        }
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    );
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg border-2 focus-within:border-blue-400 transition-colors">
      <div
        ref={containerRef}
        className="notranslate h-[70px] break-all leading-relaxed select-none text-justify max-h-40 overflow-auto"
        aria-live="polite"
        aria-label="Typing practice text"
        role="textbox"
        aria-readonly="true"
      >
        {sourceText
          .split('')
          .map((char, index) => renderCharacter(char, index))}
      </div>

      {/* Progress indicator */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>
          Progress:
          {' '}
          {currentIndex}
          {' '}
          /
          {' '}
          {sourceText.length}
          {' '}
          characters
        </span>
        <span>
          {Math.round((currentIndex / sourceText.length) * 100)}
          % complete
        </span>
      </div>
    </div>
  );
}
