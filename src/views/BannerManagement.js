'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetch, setAdminSecret, getAdminSecret } from '../lib/adminClient';
import { getTranslation, translations } from '../translations';
import './BannerManagement.css';
import './AdminDashboard.css';

function adminTr(key) {
  return getTranslation(translations.en, key) || key;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [needsSecret, setNeedsSecret] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewData, setRenewData] = useState({ startDate: '', endDate: '' });
  const fetchInFlightRef = useRef(false);
  const initialFetchStartedRef = useRef(false);
  const loadDataRef = useRef(null);

  loadDataRef.current = async ({ showFullPageLoading = false } = {}) => {
    if (fetchInFlightRef.current) return;
    fetchInFlightRef.current = true;

    if (showFullPageLoading) setLoading(true);
    setLoadError('');

    try {
      const response = await adminFetch('/api/admin/banner-periods');
      const data = await response.json();

      if (response.status === 401) {
        setNeedsSecret(true);
        setBanners([]);
        setStatusCounts({});
        setLoadError(data.error || adminTr('admin.errors.secretRequired'));
        return;
      }

      if (!response.ok || !data.success) {
        setLoadError(data.error || 'Failed to load banner periods');
        setBanners([]);
        setStatusCounts({});
        return;
      }

      setNeedsSecret(false);
      setBanners(data.banners || []);
      setStatusCounts(data.statusCounts || {});
    } catch (error) {
      console.error('Error fetching banners status:', error);
      setLoadError(adminTr('admin.errors.apiUnreachable'));
    } finally {
      fetchInFlightRef.current = false;
      if (showFullPageLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (initialFetchStartedRef.current) return;
    initialFetchStartedRef.current = true;
    loadDataRef.current?.({ showFullPageLoading: true });
  }, []);

  const refreshData = () => loadDataRef.current?.({ showFullPageLoading: false });

  const saveSecretAndReload = () => {
    setAdminSecret(secretInput.trim());
    setNeedsSecret(false);
    refreshData();
  };

  const handleRenewBanner = async () => {
    if (!selectedBanner) return;
    try {
      const response = await adminFetch(
        `/api/admin/banner-periods/${selectedBanner._id}/renew`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(renewData),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success('Banner contract renewed');
        setShowRenewModal(false);
        refreshData();
      } else {
        toast.error(data.error || 'Failed to renew banner');
      }
    } catch (error) {
      console.error('Error renewing banner:', error);
      toast.error('Error renewing banner');
    }
  };

  const handleUpdateStatus = async (bannerId, newStatus) => {
    try {
      const response = await adminFetch(`/api/admin/banner-periods/${bannerId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner_status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Banner status updated');
        refreshData();
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  const triggerStatusUpdate = async () => {
    try {
      const response = await adminFetch('/api/admin/banner-periods/update-statuses', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        toast.success(
          `Statuses updated (${data.updatedCount || 0} changed, ${data.notificationCount || 0} emails)`
        );
        refreshData();
      } else {
        toast.error(data.error || 'Failed to update statuses');
      }
    } catch (error) {
      console.error('Error updating statuses:', error);
      toast.error('Error updating statuses');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'expiring_soon':
        return '#f59e0b';
      case 'expired':
        return '#ef4444';
      case 'pending_approval':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expiring_soon':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      case 'pending_approval':
        return 'Pending Approval';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="banner-management" dir="ltr" lang="en">
        <div className="loading">Loading banner management…</div>
      </div>
    );
  }

  return (
    <div className="banner-management" dir="ltr" lang="en">
      <div className="banner-management-top-nav">
        <Link href="/admin" className="banner-management-back">
          <ArrowLeft size={18} aria-hidden />
          Back to Admin
        </Link>
      </div>

      {needsSecret && (
        <form
          className="admin-secret-form banner-management-secret"
          onSubmit={(e) => {
            e.preventDefault();
            saveSecretAndReload();
          }}
        >
          <label htmlFor="banner-admin-secret">
            <Lock size={16} aria-hidden />
            {adminTr('admin.secretLabel')}
          </label>
          <input
            id="banner-admin-secret"
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder={adminTr('admin.secretPlaceholder')}
            autoComplete="off"
          />
          <button type="submit">{adminTr('admin.unlockDashboard')}</button>
          {!getAdminSecret() && (
            <p className="banner-management-secret-hint">
              Use the same admin secret as on the main admin dashboard (stored for this browser
              session).
            </p>
          )}
        </form>
      )}

      {loadError && !needsSecret && (
        <p className="admin-alert admin-alert--error" role="alert">
          {loadError}
        </p>
      )}

      {!needsSecret && (
        <>
          <div className="banner-management-header">
            <h1>Banner Period Management</h1>
            <button type="button" onClick={triggerStatusUpdate} className="update-status-btn">
              Update All Statuses
            </button>
          </div>

          <div className="status-overview">
            <div className="status-card">
              <h3>Active</h3>
              <div className="status-count" style={{ color: '#10b981' }}>
                {statusCounts.active || 0}
              </div>
            </div>
            <div className="status-card">
              <h3>Expiring Soon</h3>
              <div className="status-count" style={{ color: '#f59e0b' }}>
                {statusCounts.expiring_soon || 0}
              </div>
            </div>
            <div className="status-card">
              <h3>Expired</h3>
              <div className="status-count" style={{ color: '#ef4444' }}>
                {statusCounts.expired || 0}
              </div>
            </div>
            <div className="status-card">
              <h3>Pending</h3>
              <div className="status-count" style={{ color: '#6b7280' }}>
                {statusCounts.pending_approval || 0}
              </div>
            </div>
          </div>

          <div className="banners-list">
            <h2>All Banners</h2>
            <div className="banners-table">
              <table>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Owner</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner._id}>
                      <td>{banner.location}</td>
                      <td>{banner.ownerName}</td>
                      <td>
                        {banner.start_date
                          ? new Date(banner.start_date).toLocaleDateString()
                          : 'Not set'}
                      </td>
                      <td>
                        {banner.end_date
                          ? new Date(banner.end_date).toLocaleDateString()
                          : 'Not set'}
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(banner.banner_status) }}
                        >
                          {getStatusText(banner.banner_status)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBanner(banner);
                              setRenewData({
                                startDate: banner.start_date
                                  ? new Date(banner.start_date).toISOString().split('T')[0]
                                  : '',
                                endDate: banner.end_date
                                  ? new Date(banner.end_date).toISOString().split('T')[0]
                                  : '',
                              });
                              setShowRenewModal(true);
                            }}
                            className="renew-btn"
                          >
                            Renew
                          </button>
                          <select
                            value={banner.banner_status}
                            onChange={(e) => handleUpdateStatus(banner._id, e.target.value)}
                            className="status-select"
                            aria-label={`Status for ${banner.location}`}
                          >
                            <option value="pending_approval">Pending Approval</option>
                            <option value="active">Active</option>
                            <option value="expiring_soon">Expiring Soon</option>
                            <option value="expired">Expired</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {banners.length === 0 && (
                <p className="banner-management-empty">No banners found.</p>
              )}
            </div>
          </div>

          {showRenewModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Renew Banner Contract</h3>
                <p className="modal-subtitle">{selectedBanner?.location}</p>
                <div className="form-group">
                  <label htmlFor="renew-start">Start Date</label>
                  <input
                    id="renew-start"
                    type="date"
                    value={renewData.startDate}
                    onChange={(e) => setRenewData({ ...renewData, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="renew-end">End Date</label>
                  <input
                    id="renew-end"
                    type="date"
                    value={renewData.endDate}
                    onChange={(e) => setRenewData({ ...renewData, endDate: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={handleRenewBanner} className="confirm-btn">
                    Renew Contract
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRenewModal(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BannerManagement;
