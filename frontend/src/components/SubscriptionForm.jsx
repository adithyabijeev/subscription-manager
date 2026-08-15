import { useState, useEffect } from 'react';

function SubscriptionForm({ existing, onSave, onClose, loading }) {
  const [serviceName, setServiceName] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (existing) {
      setServiceName(existing.service_name || '');
      setMonthlyCost(existing.monthly_cost || '');
      setBillingDate(existing.billing_date || '');
    } else {
      setServiceName('');
      setMonthlyCost('');
      setBillingDate('');
    }
    setErrors({});
  }, [existing]);

  const validate = () => {
    const newErrors = {};
    if (!serviceName.trim()) newErrors.serviceName = 'Service name is required.';
    if (!monthlyCost) {
      newErrors.monthlyCost = 'Monthly cost is required.';
    } else if (isNaN(monthlyCost) || Number(monthlyCost) <= 0) {
      newErrors.monthlyCost = 'Monthly cost must be greater than 0.';
    }
    if (!billingDate) newErrors.billingDate = 'Billing date is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      service_name: serviceName.trim(),
      monthly_cost: parseFloat(monthlyCost).toFixed(2),
      billing_date: billingDate,
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{existing ? 'Edit Subscription' : 'Add Subscription'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="form-service-name">Service Name *</label>
            <input
              id="form-service-name"
              type="text"
              placeholder="e.g. Netflix, Spotify"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
            {errors.serviceName && <span className="field-error">{errors.serviceName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="form-monthly-cost">Monthly Cost (₹) *</label>
            <input
              id="form-monthly-cost"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g. 649.00"
              value={monthlyCost}
              onChange={(e) => setMonthlyCost(e.target.value)}
            />
            {errors.monthlyCost && <span className="field-error">{errors.monthlyCost}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="form-billing-date">Billing Date *</label>
            <input
              id="form-billing-date"
              type="date"
              value={billingDate}
              onChange={(e) => setBillingDate(e.target.value)}
            />
            {errors.billingDate && <span className="field-error">{errors.billingDate}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : (existing ? 'Save Changes' : 'Add Subscription')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubscriptionForm;
