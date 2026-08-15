import { useState, useEffect, useCallback } from 'react';
import SummaryCards from '../components/SummaryCards';
import SubscriptionList from '../components/SubscriptionList';
import SubscriptionForm from '../components/SubscriptionForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSummary,
} from '../services/api';

function DashboardPage({ onLogout }) {
  const username = localStorage.getItem('username') || 'User';

  const [subscriptions, setSubscriptions]     = useState([]);
  const [summary, setSummary]                 = useState({});
  const [loadingSubs, setLoadingSubs]         = useState(true);
  const [loadingSummary, setLoadingSummary]   = useState(true);
  const [formLoading, setFormLoading]         = useState(false);
  const [deleteLoading, setDeleteLoading]     = useState(false);

  // Modal states
  const [showForm, setShowForm]               = useState(false);
  const [editSub, setEditSub]                 = useState(null);   // subscription being edited
  const [deleteSub, setDeleteSub]             = useState(null);   // subscription to delete

  const [errorMsg, setErrorMsg]               = useState('');

  // ── Fetch subscriptions ─────────────────────────

  const fetchSubscriptions = useCallback(async () => {
    setLoadingSubs(true);
    try {
      const res = await getSubscriptions();
      setSubscriptions(res.data);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoadingSubs(false);
    }
  }, []);

  // ── Fetch summary ────────────────────────────────

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const res = await getSummary();
      setSummary(res.data);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchSubscriptions();
    fetchSummary();
  }, [fetchSubscriptions, fetchSummary]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // ── Auth error helper ────────────────────────────

  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      onLogout();
    } else {
      setErrorMsg(err.response?.data?.detail || 'Something went wrong.');
    }
  };

  // ── CRUD handlers ────────────────────────────────

  const handleAddClick = () => {
    setEditSub(null);
    setShowForm(true);
  };

  const handleEditClick = (sub) => {
    setEditSub(sub);
    setShowForm(true);
  };

  const handleFormSave = async (data) => {
    setFormLoading(true);
    setErrorMsg('');
    try {
      if (editSub) {
        await updateSubscription(editSub.id, data);
      } else {
        await createSubscription(data);
      }
      setShowForm(false);
      setEditSub(null);
      refreshAll();
    } catch (err) {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(' ')
        : 'Failed to save subscription.';
      setErrorMsg(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (sub) => {
    setDeleteSub(sub);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setErrorMsg('');
    try {
      await deleteSubscription(deleteSub.id);
      setDeleteSub(null);
      refreshAll();
    } catch (err) {
      setErrorMsg('Failed to delete subscription.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    onLogout();
  };

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <header className="dash-header">
        <div className="dash-header-left">
          <div className="logo-icon small">₹</div>
          <div>
            <h1 className="dash-title">Subscription Manager</h1>
            <p className="dash-subtitle">Track your recurring subscriptions and monthly commitments.</p>
          </div>
        </div>
        <div className="dash-header-right">
          <span className="welcome-text">Hello, <strong>{username}</strong></span>
          <button id="logout-btn" className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dash-main">
        {errorMsg && (
          <div className="error-banner global-error">
            {errorMsg}
            <button className="close-error" onClick={() => setErrorMsg('')}>×</button>
          </div>
        )}

        {/* ── Summary Cards ── */}
        <section className="section">
          <SummaryCards summary={summary} loading={loadingSummary} />
        </section>

        {/* ── Subscriptions Header ── */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">My Subscriptions</h2>
            <button id="add-subscription-btn" className="btn btn-primary" onClick={handleAddClick}>
              + Add Subscription
            </button>
          </div>

          <SubscriptionList
            subscriptions={subscriptions}
            loading={loadingSubs}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </section>
      </main>

      {/* ── Add/Edit Modal ── */}
      {showForm && (
        <SubscriptionForm
          existing={editSub}
          onSave={handleFormSave}
          onClose={() => { setShowForm(false); setEditSub(null); }}
          loading={formLoading}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteSub && (
        <ConfirmDeleteModal
          subscription={deleteSub}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteSub(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

export default DashboardPage;
