'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Printer, CheckCircle, AlertCircle, Calendar, MapPin, Eye, Clock, Trash2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import toast from 'react-hot-toast';
import './Dashboard.css';
import { useLocaleFormat } from '../hooks/useLocaleFormat';
import { bookingAuthHeaders } from '../lib/bookingClient';

const AdvertiserDashboard = () => {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const locale = useLocaleFormat();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showDeleteBookingModal, setShowDeleteBookingModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const fetchAdvertiserBookings = async () => {
    try {
      const headers = await bookingAuthHeaders();
      const response = await fetch(`/api/booking/advertiser/${user._id}`, { headers });
      if (response.ok) {
        const data = await response.json();
        return data.bookings || [];
      } else {
        console.error('Failed to fetch bookings');
        return [];
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  };

  useEffect(() => {
    const getBookings = async () => {
      setLoading(true);
      const data = await fetchAdvertiserBookings();
      setBookings(data);
      setLoading(false);
    };
    getBookings();
  }, [user._id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#6b7280';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} color="#10b981" />;
      case 'rejected':
        return <AlertCircle size={16} color="#ef4444" />;
      case 'pending':
        return <Clock size={16} color="#f59e0b" />;
      case 'cancelled':
        return <AlertCircle size={16} color="#6b7280" />;
      default:
        return <AlertCircle size={16} color="#64748b" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return t('dashboard.approved');
      case 'rejected':
        return t('dashboard.rejected');
      case 'pending':
        return t('dashboard.pending');
      case 'cancelled':
        return t('dashboard.cancelled');
      default:
        return t('dashboard.pending');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const proceedToPayment = async (booking) => {
    if (booking.orderId) {
      window.location.href = `/checkout?orderId=${encodeURIComponent(booking.orderId)}`;
      return;
    }
    try {
      await fetch(`/api/payments/initiate/${booking._id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    } catch (_) {}
    window.location.href = `/payment/${booking._id}`;
  };

  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteBookingModal(true);
  };

  const handleConfirmDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      const headers = await bookingAuthHeaders();
      const response = await fetch(`/api/booking/delete/${bookingToDelete._id}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (data.success) {
        setBookings(bookings.filter(booking => booking._id !== bookingToDelete._id));
        setShowBookingDetails(false);
        setSelectedBooking(null);
        toast.success(t('messages.bookingRequestDeletedSuccessfully'));
      } else {
        toast.error(data.message || t('messages.failedToDeleteBookingRequest'));
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
              toast.error(t('messages.failedToDeleteBookingRequest'));
    } finally {
      setShowDeleteBookingModal(false);
      setBookingToDelete(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/booking/cancel/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          advertiserId: user._id
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove the booking from the local state
        setBookings(bookings.filter(booking => booking._id !== bookingId));
        toast.success(t('messages.bookingRequestRemovedSuccessfully'));
      } else {
        toast.error(data.message || t('messages.failedToCancelBookingRequest'));
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
              toast.error(t('messages.failedToCancelBookingRequest'));
    }
  };

  return (
    <>
      <motion.div
        className="advertiser-dashboard-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.h1
          className="dashboard-page-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          {t('dashboard.advertiserDashboard')}
        </motion.h1>
        <motion.p
          className="dashboard-page-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {t('dashboard.manageBannerBookings')}
        </motion.p>
        
        {loading ? (
          <motion.div
            className="dashboard-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginTop: 60 }}
          >
            <motion.div
              className="spinner"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              style={{ margin: '0 auto', width: 60, height: 60, border: '4px solid #e0e7ef', borderTop: '4px solid #123a8f', borderRadius: '50%' }}
            />
            <p style={{ color: '#64748b', marginTop: 18 }}>{t('dashboard.loadingYourBookings')}</p>
          </motion.div>
        ) : bookings.length === 0 ? (
          <motion.div
            className="dashboard-empty-state-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="dashboard-welcome-banner">
              <h3>{t('dashboard.welcomeToYaftty')} 🎉</h3>
              <p>{t('dashboard.startAdvertisingJourney')}</p>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              style={{ display: 'inline-block', marginBottom: 20 }}
            >
              <FileText size={56} color="#123a8f" style={{ filter: 'drop-shadow(0 4px 16px rgba(18, 58, 143, 0.12))' }} />
            </motion.div>
            <h2 style={{ color: '#123a8f', fontWeight: 800, fontSize: '1.35rem', marginBottom: 10 }}>
              {t('dashboard.noBookingsYet')}
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: 24, lineHeight: 1.55 }}>
              {t('dashboard.noBookingsMessage')}
            </p>
            <motion.a
              href="/map"
              className="btn-primary-new"
              whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(18, 58, 143, 0.15)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 10,
                background: '#123a8f',
                color: '#fff',
                textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(18, 58, 143, 0.15)',
              }}
            >
              <Plus size={20} />
              {t('dashboard.bookYourFirstBanner')}
            </motion.a>
          </motion.div>
        ) : (
          <motion.div
            className="dashboard-bookings-table dashboard-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="dashboard-section-header">
              <div className="dashboard-section-header-main">
                <div className="dashboard-section-icon">
                  <Calendar size={24} color="#ffffff" />
                </div>
                <div>
                  <h2 className="dashboard-section-title">
                    {t('dashboard.yourBookingRequests')}
                  </h2>
                  <p className="dashboard-section-subtitle">
                    {t('dashboard.trackBookingRequests')}
                  </p>
                </div>
              </div>
              <div className="dashboard-section-count">
                {locale.n(bookings.length)} {bookings.length === 1 ? t('dashboard.request') : t('dashboard.requests')}
              </div>
            </div>
            <div className="dashboard-table-wrap">
                <table className="dashboard-table bookings-table dashboard-table-responsive">
                  <thead>
                    <tr style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderBottom: '2px solid #e2e8f0'
                    }}>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#374151',
                        borderBottom: '2px solid #e2e8f0'
                      }}>{t('dashboard.tableHeaders.banner')}</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#374151',
                        borderBottom: '2px solid #e2e8f0'
                      }}>{t('dashboard.tableHeaders.location')}</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#374151',
                        borderBottom: '2px solid #e2e8f0'
                      }}>{t('dashboard.tableHeaders.startDate')}</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#374151',
                        borderBottom: '2px solid #e2e8f0'
                      }}>{t('dashboard.tableHeaders.endDate')}</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#374151',
                        borderBottom: '2px solid #e2e8f0'
                      }}>{t('dashboard.tableHeaders.status')}</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#374151',
                        borderBottom: '2px solid #e2e8f0'
                      }}>{t('dashboard.tableHeaders.actions')}</th>
                    </tr>
                  </thead>
                <tbody>
                  {bookings.map((booking, idx) => (
                    <motion.tr
                      key={booking._id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                      whileHover={{ 
                        scale: 1.01, 
                        backgroundColor: '#f8fafc',
                        boxShadow: '0 2px 8px rgba(18, 58, 143, 0.1)'
                      }}
                      style={{ 
                        borderBottom: idx === bookings.length - 1 ? 'none' : '1px solid #f1f5f9',
                        background: idx % 2 === 0 ? '#ffffff' : '#fafbfc',
                        cursor: 'pointer'
                      }}
                    >
                      <td
                        data-label={t('dashboard.tableHeaders.banner')}
                        className="dashboard-td-primary"
                      >
                        {booking.banner?.location || t('dashboard.unknownBanner')}
                      </td>
                      <td data-label={t('dashboard.tableHeaders.location')}>
                        <MapPin size={16} className="dashboard-td-icon" aria-hidden />
                        {booking.banner?.location || '-'}
                      </td>
                      <td data-label={t('dashboard.tableHeaders.startDate')}>
                        <Calendar size={16} className="dashboard-td-icon" aria-hidden />
                        {booking.startDate ? formatDate(booking.startDate) : '-'}
                      </td>
                      <td data-label={t('dashboard.tableHeaders.endDate')}>
                        <Calendar size={16} className="dashboard-td-icon" aria-hidden />
                        {booking.endDate ? formatDate(booking.endDate) : '-'}
                      </td>
                      <td
                        data-label={t('dashboard.tableHeaders.status')}
                        className="dashboard-td-status"
                      >
                        <div className="dashboard-status-cell">
                          {getStatusIcon(booking.status)}
                          <span style={{ color: getStatusColor(booking.status) }}>
                            {booking.status ? getStatusText(booking.status) : t('dashboard.pending')}
                          </span>
                        </div>
                      </td>
                      <td
                        data-label={t('dashboard.tableHeaders.actions')}
                        className="dashboard-td-actions"
                      >
                        <button
                          type="button"
                          className="booking-btn primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(booking);
                          }}
                        >
                          <Eye size={14} color="#ffffff" />
                          {t('dashboard.view')}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowBookingDetails(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '18px' }}>
              📋 {t('dashboard.bookingDetails')}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px',
              }}>
                <MapPin size={16} color="#64748b" />
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                    {t('dashboard.bannerLocation')}
                  </div>
                  <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                    {selectedBooking.banner?.location || 'Unknown'}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px',
              }}>
                <Calendar size={16} color="#64748b" />
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                    {t('dashboard.campaignPeriod')}
                  </div>
                  <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                    {selectedBooking.startDate ? formatDate(selectedBooking.startDate) : 'Not set'} - {selectedBooking.endDate ? formatDate(selectedBooking.endDate) : 'Not set'}
                  </div>
                </div>
              </div>

              {selectedBooking.campaignDescription && (
                <div style={{
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>
                    {t('dashboard.campaignDescription')}
                  </div>
                  <div style={{ fontSize: '14px', color: '#1f2937' }}>
                    {selectedBooking.campaignDescription}
                  </div>
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px',
              }}>
                                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                    {t('dashboard.tableHeaders.status')}
                  </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getStatusIcon(selectedBooking.status)}
                  <span style={{ color: getStatusColor(selectedBooking.status), fontWeight: '600' }}>
                    {selectedBooking.status ? getStatusText(selectedBooking.status) : t('dashboard.pending')}
                  </span>
                </div>
              </div>

              {selectedBooking.status === 'rejected' && selectedBooking.rejectionNote && (
                <div style={{
                  padding: '12px',
                  background: '#fef2f2',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>
                    {t('dashboard.rejectionReason')}
                  </div>
                  <div style={{ fontSize: '14px', color: '#dc2626' }}>
                    {selectedBooking.rejectionNote}
                  </div>
                </div>
              )}
              
              {selectedBooking.status === 'approved' && selectedBooking.ownerResponse && (
                <div style={{
                  padding: '12px',
                  background: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0',
                }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>
                    {t('dashboard.ownerResponse')}
                  </div>
                  <div style={{ fontSize: '14px', color: '#166534' }}>
                    {selectedBooking.ownerResponse}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginTop: '24px',
              justifyContent: 'center'
            }}>
              {selectedBooking.status === 'approved' && (
                <button
                  onClick={() => proceedToPayment(selectedBooking)}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #123a8f 0%, #123a8f 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(18, 58, 143, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(18, 58, 143, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(18, 58, 143, 0.25)';
                  }}
                >
                  {t('dashboard.proceedToPayment')}
                </button>
              )}
              {selectedBooking.status === 'pending' && (
                <button
                  onClick={() => {
                    handleCancelBooking(selectedBooking._id);
                    setShowBookingDetails(false);
                  }}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.2)';
                  }}
                >
                  <AlertCircle size={16} />
                  {t('dashboard.cancelBooking')}
                </button>
              )}
              
              {selectedBooking.status === 'rejected' && (
                <button
                  onClick={() => handleDeleteBooking(selectedBooking)}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(107, 114, 128, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.2)';
                  }}
                >
                  <Trash2 size={16} />
                  {t('dashboard.deleteBooking')}
                </button>
              )}
              
              <button
                onClick={() => setShowBookingDetails(false)}
                style={{
                  padding: '12px 24px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f3f4f6';
                }}
              >
                {t('dashboard.close')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Booking Confirmation Modal */}
      {showDeleteBookingModal && bookingToDelete && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowDeleteBookingModal(false)}
        >
          <motion.div
            className="dashboard-modal-content dashboard-delete-modal"
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="dashboard-modal-close"
              onClick={() => setShowDeleteBookingModal(false)}
              aria-label={t('dashboard.close')}
            >
              <X size={20} />
            </button>
            <div className="dashboard-delete-icon-wrap">
              <Trash2 size={48} color="#dc2626" />
            </div>
            <h3 className="dashboard-delete-title">
              {t('dashboard.deleteBookingRequest')}
            </h3>
            <div className="dashboard-delete-body">
              <p>{t('dashboard.deleteBookingConfirmation')}</p>
              <p className="dashboard-delete-warning">
                <span className="dashboard-delete-warning-icon" aria-hidden="true">⚠️</span>
                {t('dashboard.deleteBookingWarningFull')}
              </p>
              <ul className="dashboard-delete-meta">
                <li>
                  <strong>{t('dashboard.tableHeaders.banner')}:</strong>{' '}
                  <span dir="auto">{bookingToDelete.banner?.location || t('dashboard.unknownBanner')}</span>
                </li>
                <li>
                  <strong>{t('dashboard.tableHeaders.status')}:</strong>{' '}
                  <span dir="auto">{bookingToDelete.status ? getStatusText(bookingToDelete.status) : t('dashboard.pending')}</span>
                </li>
              </ul>
            </div>
            <div className="dashboard-delete-actions">
              <button
                type="button"
                className="dashboard-delete-btn dashboard-delete-btn--confirm"
                onClick={handleConfirmDeleteBooking}
              >
                {t('dashboard.deleteBooking')}
              </button>
              <button
                type="button"
                className="dashboard-delete-btn dashboard-delete-btn--cancel"
                onClick={() => setShowDeleteBookingModal(false)}
              >
                {t('dashboard.cancel')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdvertiserDashboard; 