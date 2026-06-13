import { AlertTriangle } from 'lucide-react';
import Spinner from './Spinner';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = true,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-slide-up">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDanger ? 'bg-red-100' : 'bg-primary-100'}`}>
          <AlertTriangle className={`w-6 h-6 ${isDanger ? 'text-red-600' : 'text-primary-600'}`} />
        </div>

        <h2 id="confirm-modal-title" className="text-lg font-bold text-slate-800 text-center mb-2">
          {title}
        </h2>
        <p className="text-slate-500 text-sm text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            id="confirm-modal-cancel"
            className="btn-secondary flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            id="confirm-modal-confirm"
            className={`flex-1 btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
