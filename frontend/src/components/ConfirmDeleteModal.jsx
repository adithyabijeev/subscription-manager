function ConfirmDeleteModal({ subscription, onConfirm, onCancel, loading }) {
  if (!subscription) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal modal-small">
        <div className="modal-header">
          <h2>Delete Subscription</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          <div className="delete-icon">🗑️</div>
          <p>
            Are you sure you want to delete <strong>{subscription.service_name}</strong>?
          </p>
          <p className="delete-warning">This action cannot be undone.</p>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
