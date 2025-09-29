import { useCallback } from 'react';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmModalProps) {
  const confirmButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (node && isOpen) {
        // Focus immediately when the ref is attached
        setTimeout(() => {
          node.focus();
        }, 0);
      }
    },
    [isOpen],
  );

  // Handle escape key
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen)
    return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onCancel}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2
          id="modal-title"
          className="text-lg font-semibold text-gray-900 mb-3"
        >
          {title}
        </h2>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            {cancelText}
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200"
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
