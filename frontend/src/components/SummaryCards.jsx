function SummaryCards({ summary, loading }) {
  const fmt = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);

  if (loading) {
    return (
      <div className="summary-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="summary-card skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="summary-grid">
      <div className="summary-card card-blue">
        <div className="summary-icon">📅</div>
        <div className="summary-body">
          <p className="summary-label">Monthly Spend</p>
          <p className="summary-value">{fmt(summary.monthly_total || 0)}</p>
        </div>
      </div>

      <div className="summary-card card-purple">
        <div className="summary-icon">📊</div>
        <div className="summary-body">
          <p className="summary-label">Annual Spend</p>
          <p className="summary-value">{fmt(summary.annual_total || 0)}</p>
        </div>
      </div>

      <div className="summary-card card-green">
        <div className="summary-icon">✅</div>
        <div className="summary-body">
          <p className="summary-label">Active Subscriptions</p>
          <p className="summary-value">{summary.subscription_count || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
