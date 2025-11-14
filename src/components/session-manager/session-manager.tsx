import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';

import { useNotification } from '../../hooks/use-notification';
import { useTypingSession } from '../../hooks/use-typing-session';
import { Icons } from '../../utils/icons';
import { Notification } from '../common';
import { FormActions, FormField, FormSection } from '../common/form-components';

type SessionManagerProps = {
  onStartSession: (sessionId: string, role: 'typist' | 'spectator', sessionName?: string) => void;
};

export default function SessionManager({
  onStartSession,
}: SessionManagerProps) {
  const { createSession, joinSession, getSessionUrl } = useTypingSession();
  const { notification, hideNotification, showSuccess } = useNotification();
  const [sessionName, setSessionName] = useState('');
  const [joinSessionId, setJoinSessionId] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const handleCreateSession = () => {
    const session = createSession(sessionName || undefined);
    setCurrentSessionId(session.id);
    setShowShareModal(true);
  };

  const handleJoinAsTypist = () => {
    if (currentSessionId) {
      onStartSession(currentSessionId, 'typist', sessionName);
      setShowShareModal(false);
    }
  };

  const handleJoinSession = () => {
    if (joinSessionId.trim()) {
      joinSession(joinSessionId.trim());
      onStartSession(joinSessionId.trim(), 'spectator');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess('Copied to clipboard!', 'The link has been copied successfully.');
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Real-time Typing Sessions
        </h1>
        <p className="text-gray-600">
          Create a session to type or join one to spectate
        </p>
      </header>

      <div className="space-y-6">
        {/* Create Session */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <FormSection
            title="Start a Typing Session"
            description="Create a new session where others can watch you type in real-time"
          >
            <FormField
              label="Session Name"
              id="sessionName"
              value={sessionName}
              onChange={setSessionName}
              placeholder="My Typing Session"
              colSpan="full"
            />
          </FormSection>

          <FormActions
            submitText="Create Session"
            onSubmit={handleCreateSession}
            className="mt-0"
          />
        </div>

        {/* Join Session */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <FormSection
            title="Watch a Session"
            description="Enter a session ID to spectate someone else's typing session"
          >
            <FormField
              label="Session ID"
              id="joinSessionId"
              value={joinSessionId}
              onChange={setJoinSessionId}
              placeholder="Enter session ID"
              colSpan="full"
              required
            />
          </FormSection>

          <FormActions
            submitText="Join as Spectator"
            onSubmit={handleJoinSession}
            submitDisabled={!joinSessionId.trim()}
            className="mt-0"
          />
        </div>
      </div>

      {/* Share Session Modal */}
      <Dialog open={showShareModal && !!currentSessionId} onClose={() => setShowShareModal(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
                  <Icons.Check aria-hidden="true" className="size-6 text-green-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Session Created!
                  </DialogTitle>
                  <div className="mt-4 space-y-4">
                    <div className="text-left">
                      <label
                        htmlFor="sessionId"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Session ID
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="sessionId"
                          type="text"
                          value={currentSessionId || ''}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-black"
                        />
                        <button
                          type="button"
                          onClick={() => currentSessionId && copyToClipboard(currentSessionId)}
                          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="text-left">
                      <label
                        htmlFor="spectatorLink"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Spectator Link
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="spectatorLink"
                          type="text"
                          value={currentSessionId ? getSessionUrl(currentSessionId, 'spectator') : ''}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-xs text-black"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            currentSessionId && copyToClipboard(
                              getSessionUrl(currentSessionId, 'spectator'),
                            )}
                          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-left">
                      <p className="text-sm text-blue-800">
                        <strong>Next steps:</strong>
                      </p>
                      <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                        <li>Share the Session ID or link with spectators</li>
                        <li>Click "Start Typing" to begin your session</li>
                        <li>Spectators will see your typing in real-time!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleJoinAsTypist}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                >
                  Start Typing
                </button>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Notification
        show={notification.show}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </div>
  );
}
