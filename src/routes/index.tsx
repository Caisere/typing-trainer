import { createFileRoute, useNavigate } from '@tanstack/react-router';

import SessionModeSelector from '../components/session-manager/session-mode-selector';

export const Route = createFileRoute('/')({
  ssr: true,
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();

  const handleSelectMode = (mode: 'session' | 'solo' | 'competition') => {
    if (mode === 'solo') {
      navigate({ to: '/solo' });
    }
    else if (mode === 'competition') {
      navigate({ to: '/competition' });
    }
    else if (mode === 'session') {
      navigate({ to: '/session' });
    }
  };

  return <SessionModeSelector onSelectMode={handleSelectMode} />;
}
