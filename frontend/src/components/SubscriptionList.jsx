function SubscriptionList({ subscriptions, loading, onEdit, onDelete }) {
  const fmt = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="sub-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="sub-card skeleton" style={{ height: '90px' }} />
        ))}
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No subscriptions yet.</h3>
        <p>Add your first subscription to start tracking your recurring expenses.</p>
      </div>
    );
  }

  return (
    <div className="sub-list">
      {subscriptions.map((sub) => (
        <div key={sub.id} className="sub-card">
          <div className="sub-avatar">
            {sub.service_name.charAt(0).toUpperCase()}
          </div>
          <div className="sub-info">
            <h3 className="sub-name">{sub.service_name}</h3>
            <p className="sub-cost">{fmt(sub.monthly_cost)} <span className="per-month">/ month</span></p>
            <p className="sub-date">Billing Date: {formatDate(sub.billing_date)}</p>
          </div>
          <div className="sub-actions">
            <button
              id={`edit-${sub.id}`}
              className="btn btn-edit"
              onClick={() => onEdit(sub)}
              title="Edit subscription"
            >
              ✏️ Edit
            </button>
            <button
              id={`delete-${sub.id}`}
              className="btn btn-delete"
              onClick={() => onDelete(sub)}
              title="Delete subscription"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubscriptionList;
