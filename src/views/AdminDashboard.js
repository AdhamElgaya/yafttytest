'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Eye,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
  Calendar,
  MessageSquare,
  Lock,
  ClipboardList,
  ImageIcon,
  FileText,
  X,
} from 'lucide-react';
import { useTranslations, getTranslation, translations } from '../translations';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { adminFetch, setAdminSecret } from '../lib/adminClient';
import { createLocaleFormatters } from '../lib/localeFormat';
import './AdminDashboard.css';

function statusClass(status) {
  if (status === 'pending') return 'admin-status admin-status--pending';
  if (status === 'approved') return 'admin-status admin-status--approved';
  if (status === 'rejected') return 'admin-status admin-status--rejected';
  return 'admin-status';
}

/** Admin UI is English-only — stable lookup for fetch/error paths */
function adminTr(key) {
  return getTranslation(translations.en, key) || key;
}

const AdminDashboard = () => {
  const { t } = useTranslations('en');
  const locale = useMemo(() => createLocaleFormatters('en'), []);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [needsSecret, setNeedsSecret] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const fetchInFlightRef = useRef(false);
  const initialFetchStartedRef = useRef(false);
  const loadDashboardRef = useRef(null);

  const formatStatusLabel = useCallback(
    (status) => {
      if (!status) return t('admin.statusLabels.unknown');
      const key = `admin.statusLabels.${status}`;
      const label = t(key);
      return label === key ? t('admin.statusLabels.unknown') : label;
    },
    [t]
  );

  const displayOrNa = useCallback(
    (value) => {
      const text = value == null ? '' : String(value).trim();
      return text || t('admin.notAvailable');
    },
    [t]
  );

  const stats = useMemo(() => {
    const counts = { pending: 0, approved: 0, rejected: 0 };
    requests.forEach((r) => {
      if (counts[r.status] !== undefined) counts[r.status] += 1;
    });
    return counts;
  }, [requests]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const error = params.get('error');
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, []);

  useEffect(() => {
    if (!showModal) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showModal]);

  loadDashboardRef.current = async ({ showFullPageLoading = false } = {}) => {
    if (fetchInFlightRef.current) return;
    fetchInFlightRef.current = true;

    if (showFullPageLoading) {
      setLoading(true);
    }
    setLoadError('');

    try {
      const response = await adminFetch('/api/admin/dashboard');
      const data = await response.json();
      if (response.status === 401) {
        setNeedsSecret(true);
        setRequests([]);
        setLoadError(data.error || adminTr('admin.errors.secretRequired'));
        return;
      }
      if (!response.ok || !data.success) {
        setLoadError(data.error || adminTr('admin.errors.loadFailed'));
        setRequests([]);
        return;
      }
      setNeedsSecret(false);
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoadError(adminTr('admin.errors.apiUnreachable'));
    } finally {
      fetchInFlightRef.current = false;
      if (showFullPageLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (initialFetchStartedRef.current) return;
    initialFetchStartedRef.current = true;
    loadDashboardRef.current?.({ showFullPageLoading: true });
  }, []);

  const refreshDashboard = () => {
    loadDashboardRef.current?.({ showFullPageLoading: false });
  };

  const saveSecretAndReload = () => {
    setAdminSecret(secretInput.trim());
    setNeedsSecret(false);
    refreshDashboard();
  };

  const handleApprove = async (requestId) => {
    try {
      const response = await adminFetch(`/api/admin/approve/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(t('messages.requestApprovedSuccessfully'));
        refreshDashboard();
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error(t('messages.errorApprovingRequest'));
    }
  };

  const handleReject = async (requestId) => {
    const reason = prompt(t('admin.rejectReasonPrompt'));
    if (!reason) return;

    try {
      const response = await adminFetch(`/api/admin/reject/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(t('messages.requestRejectedSuccessfully'));
        refreshDashboard();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error(t('messages.errorRejectingRequest'));
    }
  };

  const viewRequestDetails = async (requestId) => {
    try {
      const response = await adminFetch(`/api/admin/request/${requestId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedRequest(data.request);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error(t('admin.loadDetailsFailed'));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" role="status" aria-label="Loading" />
        <p>{t('admin.loading')}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" dir="ltr" lang="en">
      <div className="admin-dashboard-inner">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-header-main">
            <h1>{t('admin.title')}</h1>
            <p>{t('admin.subtitle')}</p>
          </div>
          <nav className="admin-dashboard-nav" aria-label={t('admin.navLabel')}>
              <Link
                href="/admin/banner-management"
                className="admin-dashboard-nav-link admin-dashboard-nav-link--secondary"
              >
                <Calendar size={18} aria-hidden />
                {t('admin.bannerPeriods')}
              </Link>
              <Link
                href="/admin/chat"
                className="admin-dashboard-nav-link admin-dashboard-nav-link--primary"
              >
                <MessageSquare size={18} aria-hidden />
                {t('admin.adminChat')}
              </Link>
          </nav>
        </header>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <strong>{locale.n(requests.length)}</strong>
            <span>{t('admin.statTotal')}</span>
          </div>
          <div className="admin-stat-card admin-stat-card--pending">
            <strong>{locale.n(stats.pending)}</strong>
            <span>{t('admin.statPending')}</span>
          </div>
          <div className="admin-stat-card admin-stat-card--approved">
            <strong>{locale.n(stats.approved)}</strong>
            <span>{t('admin.statApproved')}</span>
          </div>
          <div className="admin-stat-card admin-stat-card--rejected">
            <strong>{locale.n(stats.rejected)}</strong>
            <span>{t('admin.statRejected')}</span>
          </div>
        </div>

        <section className="admin-panel" aria-labelledby="admin-requests-heading">
          <div className="admin-panel-head">
            <h2 id="admin-requests-heading">
              {t('admin.requestsTitle', { count: requests.length })}
            </h2>
          </div>
          <div className="admin-panel-body">
            {loadError && (
              <p className="admin-alert admin-alert--error" role="alert">
                {loadError}
              </p>
            )}

            {needsSecret && (
              <form
                className="admin-secret-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSecretAndReload();
                }}
              >
                <label htmlFor="admin-secret">
                  <Lock size={16} aria-hidden />
                  {t('admin.secretLabel')}
                </label>
                <input
                  id="admin-secret"
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  placeholder={t('admin.secretPlaceholder')}
                  autoComplete="off"
                />
                <button type="submit">{t('admin.unlockDashboard')}</button>
              </form>
            )}

            {requests.length === 0 ? (
              <div className="admin-empty">
                {loadError ? t('admin.emptyFixError') : t('admin.emptyNoRequests')}
              </div>
            ) : (
              <div className="admin-request-list">
                {requests.map((request) => (
                  <article key={request._id} className="admin-request-card">
                    <div className="admin-request-card-top">
                      <div>
                        <h3>{t('admin.requestTitle', { id: request._id.slice(-6) })}</h3>
                        <p className="admin-request-meta">
                          {request.owner?.email || t('admin.unknown')}
                          <br />
                          {t('admin.submitted', {
                            date: locale.dateTime(request.createdAt),
                          })}
                        </p>
                      </div>
                      <span className={statusClass(request.status)}>
                        {formatStatusLabel(request.status)}
                      </span>
                    </div>

                    <dl className="admin-request-details-grid">
                      <div className="admin-request-detail">
                        <dt>{t('admin.location')}</dt>
                        <dd>{request.location}</dd>
                      </div>
                      <div className="admin-request-detail">
                        <dt>{t('admin.size')}</dt>
                        <dd>{request.size}</dd>
                      </div>
                      <div className="admin-request-detail">
                        <dt>{t('admin.type')}</dt>
                        <dd>{request.type}</dd>
                      </div>
                    </dl>

                    <div className="admin-request-actions">
                      <button
                        type="button"
                        onClick={() => viewRequestDetails(request._id)}
                        className="admin-btn admin-btn--primary"
                      >
                        <Eye size={16} aria-hidden />
                        {t('admin.viewDetails')}
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(request._id)}
                            className="admin-btn admin-btn--success"
                          >
                            <CheckCircle size={16} aria-hidden />
                            {t('admin.approve')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(request._id)}
                            className="admin-btn admin-btn--danger"
                          >
                            <XCircle size={16} aria-hidden />
                            {t('admin.reject')}
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {showModal && selectedRequest && (
        <div
          className="admin-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-modal-title"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="admin-modal">
            <header className="admin-modal-header">
              <h2 id="admin-modal-title">
                {t('admin.requestTitle', { id: selectedRequest._id.slice(-6) })}
              </h2>
              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
                aria-label={t('admin.close')}
              >
                <X size={20} />
              </button>
            </header>

            <div className="admin-modal-body">
              <div className="admin-modal-grid">
                <section className="admin-modal-section">
                  <h3>
                    <ClipboardList size={18} aria-hidden />
                    {t('admin.requestInfo')}
                  </h3>
                  <ul className="admin-info-list">
                    <li>
                      <strong>{t('admin.email')}</strong>
                      <span>{displayOrNa(selectedRequest.owner?.email)}</span>
                    </li>
                    <li>
                      <strong>{t('admin.firstName')}</strong>
                      <span>{displayOrNa(selectedRequest.owner?.firstName)}</span>
                    </li>
                    <li>
                      <strong>{t('admin.lastName')}</strong>
                      <span>{displayOrNa(selectedRequest.owner?.lastName)}</span>
                    </li>
                    <li>
                      <strong>{t('admin.companyName')}</strong>
                      <span>{displayOrNa(selectedRequest.owner?.company)}</span>
                    </li>
                    <li>
                      <strong>{t('admin.location')}</strong>
                      <span>{selectedRequest.location}</span>
                    </li>
                    <li>
                      <strong>{t('admin.size')}</strong>
                      <span>{selectedRequest.size}</span>
                    </li>
                    <li>
                      <strong>{t('admin.type')}</strong>
                      <span>{selectedRequest.type}</span>
                    </li>
                    <li>
                      <strong>{t('admin.status')}</strong>
                      <span className={statusClass(selectedRequest.status)}>
                        {formatStatusLabel(selectedRequest.status)}
                      </span>
                    </li>
                    <li>
                      <strong>{t('admin.submittedLabel')}</strong>
                      <span>{locale.dateTime(selectedRequest.createdAt)}</span>
                    </li>
                  </ul>
                </section>

                <section className="admin-modal-section">
                  <h3>
                    <ImageIcon size={18} aria-hidden />
                    {t('admin.bannerImage')}
                  </h3>
                  <div className="admin-banner-preview">
                    <img
                      src={selectedRequest.bannerImageUrl}
                      alt={t('admin.bannerPreviewAlt')}
                    />
                    <a
                      href={selectedRequest.bannerImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn--ghost"
                      style={{ marginTop: 12, width: '100%' }}
                    >
                      <ExternalLink size={16} aria-hidden />
                      {t('admin.viewFullSize')}
                    </a>
                  </div>
                </section>
              </div>

              {selectedRequest.documentUrls?.length > 0 && (
                <section className="admin-modal-section" style={{ marginTop: 24 }}>
                  <h3>
                    <FileText size={18} aria-hidden />
                    {t('admin.documents')}
                  </h3>
                  <div className="admin-doc-grid">
                    {selectedRequest.documentUrls.map((url, index) => (
                      <div key={url} className="admin-doc-card">
                        <span>{t('admin.documentN', { n: index + 1 })}</span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn admin-btn--ghost"
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        >
                          <Download size={14} aria-hidden />
                          {t('admin.view')}
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {selectedRequest.status === 'pending' && (
              <footer className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    handleApprove(selectedRequest._id);
                    closeModal();
                  }}
                  className="admin-btn admin-btn--success"
                >
                  <CheckCircle size={16} aria-hidden />
                  {t('admin.approveRequest')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleReject(selectedRequest._id);
                    closeModal();
                  }}
                  className="admin-btn admin-btn--danger"
                >
                  <XCircle size={16} aria-hidden />
                  {t('admin.rejectRequest')}
                </button>
                <button type="button" onClick={closeModal} className="admin-btn admin-btn--ghost">
                  {t('admin.cancel')}
                </button>
              </footer>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
