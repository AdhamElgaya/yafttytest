'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, FileText, CheckCircle, AlertCircle, Plus, X, MoreHorizontal, Eye, Trash2, Edit3, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import toast from 'react-hot-toast';
import { fetchUserBanners as fetchUserBannersApi, deleteUserBanner } from '../lib/banners';
import { formatEgpAmount } from '../lib/money';
import { useLocaleFormat } from '../hooks/useLocaleFormat';
import { localizeDigitsInString } from '../lib/localeFormat';
import { bookingAuthHeaders } from '../lib/bookingClient';

import './Dashboard.css';

// Add mock content to booking requests
const mockBookingRequests = [
  {
    id: 'BR-001',
    banner: 'Downtown Cairo Billboard',
    advertiser: 'Tech Solutions Egypt',
    date: '2024-06-01',
    status: 'pending',
    contentType: 'photo',
    contentUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    description: 'A vibrant ad for a new tech product launch.',
  },
  {
    id: 'BR-002',
    banner: 'Alexandria Coastal Banner',
    advertiser: 'Luxury Hotels Group',
    date: '2024-06-03',
    status: 'approved',
    contentType: 'video',
    contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'A luxury hotel summer campaign.',
  },
  {
    id: 'BR-003',
    banner: 'Giza Pyramids Road Banner',
    advertiser: 'TravelX Agency',
    date: '2024-06-05',
    status: 'rejected',
    contentType: 'photo',
    contentUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    description: 'Rejected: Banner for a travel agency with outdated branding.',
  },
];

const Dashboard = () => {
  const { user, accountType } = useAuth();
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const locale = useLocaleFormat();
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'approve'|'reject', booking }
  const [bookingRequests, setBookingRequests] = useState([]); // Empty for new users
  const [userBanners, setUserBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDeleteBookingModal, setShowDeleteBookingModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Fetch user's approved banners
  useEffect(() => {
    const loadUserBanners = async () => {
      if (!user) {
        setUserBanners([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const banners = await fetchUserBannersApi(user._id || user.id);
        setUserBanners(Array.isArray(banners) ? banners : []);
      } catch (error) {
        console.error('Error fetching user banners:', error);
        setUserBanners([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserBanners();
  }, [user]);

  // Fetch booking requests for banner owners
  useEffect(() => {
    const fetchBookingRequests = async () => {
      console.log('User account type:', user?.accountType);
      if (!user || (user.accountType !== 'bannerOwner' && user.accountType !== 'banner_owner')) {
        // Not a banner owner: ensure the loader stops
        setLoadingBookings(false);
        return;
      }
      
      try {
        setLoadingBookings(true);
        console.log('Fetching booking requests for user:', user._id);
        const headers = await bookingAuthHeaders();
        const response = await fetch(`/api/booking/owner/${user._id}`, { headers });
        const data = await response.json();
        
        console.log('Booking requests response:', data);
        
        if (data.success) {
          setBookingRequests(Array.isArray(data.bookings) ? data.bookings : []);
        } else {
          console.error('Failed to fetch booking requests:', data.message);
          setBookingRequests([]);
        }
      } catch (error) {
        console.error('Error fetching booking requests:', error);
        setBookingRequests([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookingRequests();
  }, [user]);

  // Handler for viewing banner details
  const handleViewDetails = (banner) => {
    setSelectedBanner(banner);
    setShowBannerModal(true);
  };

  // Handler for closing modals
  const handleCloseModal = () => {
    setShowBannerModal(false);
    setSelectedBanner(null);
    setShowAddModal(false);
    setShowBookingModal(false);
    setSelectedBooking(null);
    setConfirmAction(null);
    setRejectionNote('');
    setShowRejectionInput(false);
    setShowContentModal(false);
    setSelectedContent(null);
    setShowDeleteBookingModal(false);
    setBookingToDelete(null);
  };

  // Handler for 'More Info' on booking
  const handleMoreInfo = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  // Handler for viewing content
  const handleViewContent = (contentUrl, contentType) => {
    setSelectedContent({ url: contentUrl, type: contentType });
    setShowContentModal(true);
  };

  // Handler for deleting booking
  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteBookingModal(true);
  };

  // Handler for confirming booking deletion
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
        setBookingRequests((prev) =>
          (prev || []).filter((booking) => booking._id !== bookingToDelete._id)
        );
        setShowBookingModal(false);
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

  // Handler for responding to booking requests
  const handleBookingResponse = async (bookingId, response) => {
    try {
      const requestBody = { response };
      if (response === 'rejected') {
        if (!rejectionNote.trim()) {
          toast.error(t('messages.pleaseProvideRejectionReason'));
          return;
        }
        requestBody.rejectionNote = rejectionNote.trim();
      }

      const headers = await bookingAuthHeaders(true);
      const res = await fetch(`/api/booking/respond/${bookingId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (data.success) {
        // Update the booking in the local state
        setBookingRequests(prev => 
          prev.map(booking => 
            booking._id === bookingId 
              ? { ...booking, ownerResponse: response, status: response === 'accepted' ? 'approved' : 'rejected' }
              : booking
          )
        );
        
        // Close the modal
        handleCloseModal();
        
        // Reset rejection note
        setRejectionNote('');
        setShowRejectionInput(false);
        
        // Show success message
        toast.success(response === 'accepted' ? t('messages.bookingRequestApproved') : t('messages.bookingRequestRejected'));
      } else {
        toast.error(t('messages.failedToRespondToBookingRequest', { message: data.message }));
      }
    } catch (error) {
      console.error('Error responding to booking:', error);
              toast.error(t('messages.errorRespondingToBookingRequest'));
    }
  };

  // Handler for approve/reject confirmation
  const handleAction = (type) => {
    setConfirmAction({ type, booking: selectedBooking });
  };

  // Handler for showing rejection input
  const handleRejectClick = () => {
    setShowRejectionInput(true);
  };

  // Handler for confirming approve/reject
  const handleConfirmAction = () => {
    if (confirmAction && confirmAction.booking) {
      setBookingRequests((prev) =>
        (prev || []).map((b) =>
          b.id === confirmAction.booking.id
            ? { ...b, status: confirmAction.type === 'approve' ? 'approved' : 'rejected' }
            : b
        )
      );
    }
    handleCloseModal();
    // Optionally show a toast/notification
  };

  // Handler for deleting a banner
  const handleDeleteBanner = async (banner) => {
    setBannerToDelete(banner);
    setShowDeleteConfirm(true);
  };

  // Handler for confirming banner deletion
  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;

    try {
      await deleteUserBanner(bannerToDelete._id || bannerToDelete.id);
      setUserBanners((prev) =>
        (prev || []).filter(
          (banner) => (banner._id || banner.id) !== (bannerToDelete._id || bannerToDelete.id)
        )
      );
      toast.success(t('messages.bannerDeletedSuccessfully'));
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error(t('messages.errorDeletingBanner'));
    } finally {
      setShowDeleteConfirm(false);
      setBannerToDelete(null);
    }
  };

  // Handler for canceling banner deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setBannerToDelete(null);
  };



  const getBookingStatusLabel = (status) => {
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
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    const localeTag = currentLanguage === 'ar' ? 'ar-EG' : 'en-GB';
    return new Intl.DateTimeFormat(localeTag, {
      numberingSystem: currentLanguage === 'ar' ? 'arab' : 'latn',
      dateStyle: 'medium',
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return { color: '#22c55e', background: '#e7fbe9' };
      case 'pending': return { color: '#f59e0b', background: '#fef3c7' };
      case 'rejected': return { color: '#ef4444', background: '#fde7e9' };
      default: return { color: '#64748b', background: '#f1f5f9' };
    }
  };

  const getTrafficColor = (traffic) => {
    switch (traffic) {
      case 'low':
        return '#10b981'; // Green
      case 'moderate':
        return '#f59e0b'; // Orange
      case 'high':
        return '#ef4444'; // Red
      default:
        return '#64748b'; // Gray
    }
  };

  const getBannerStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return { color: '#ffffff', background: '#10b981' };
      case 'expiring_soon':
        return { color: '#ffffff', background: '#f59e0b' };
      case 'expired':
        return { color: '#ffffff', background: '#ef4444' };
      case 'pending_approval':
        return { color: '#ffffff', background: '#6b7280' };
      default:
        return { color: '#ffffff', background: '#6b7280' };
    }
  };

  const getBannerStatusText = (status) => {
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

  return (
    <div className="banner-owner-dashboard">
      <motion.h1
        className="dashboard-page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {t('dashboard.bannerOwnerDashboard')}
      </motion.h1>
      

      {/* Booking Requests Section */}
      <motion.section
        className="dashboard-section dashboard-panel"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-section-header">
          <div className="dashboard-section-header-main">
            <div className="dashboard-section-icon">
              <FileText size={24} color="#ffffff" />
            </div>
            <div>
              <h2 className="dashboard-section-title">
                {t('dashboard.bookingRequests')}
              </h2>
              <p className="dashboard-section-subtitle">
                {t('dashboard.manageRequests')}
              </p>
            </div>
          </div>
          <div className="dashboard-section-count">
            {locale.n(bookingRequests.length)} {bookingRequests.length === 1 ? t('dashboard.request') : t('dashboard.requests')}
          </div>
        </div>
                <div className="dashboard-table-container">
          {loadingBookings ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                margin: '20px 0'
              }}
            >
              <div style={{ display: 'inline-block', marginBottom: 24 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #e2e8f0',
                  borderTop: '4px solid #123a8f',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }} />
              </div>
              <h3 style={{ color: '#123a8f', fontWeight: 800, fontSize: '1.3rem', marginBottom: 10 }}>
                {t('dashboard.loadingBookingRequests')}
              </h3>
              <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
                {t('dashboard.fetchingBookingRequests')}
              </p>
            </motion.div>
          ) : bookingRequests.length === 0 ? (
            <motion.div
              className="dashboard-empty-requests"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                margin: '20px 0'
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                style={{ display: 'inline-block', marginBottom: 20 }}
              >
                <FileText size={48} color="#123a8f" style={{ filter: 'drop-shadow(0 4px 24px #123a8f22)' }} />
              </motion.div>
              <h3 style={{ color: '#123a8f', fontWeight: 800, fontSize: '1.3rem', marginBottom: 10 }}>
                {t('dashboard.noBookingRequestsYet')}
              </h3>
              <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: 0, maxWidth: 400, margin: '0 auto' }}>
                {t('dashboard.noBookingRequestsMessage')}
              </p>
            </motion.div>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table dashboard-table-responsive">
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
                    }}>{t('dashboard.tableHeaders.id')}</th>
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
                    }}>{t('dashboard.tableHeaders.advertiser')}</th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#374151',
                      borderBottom: '2px solid #e2e8f0'
                    }}>{t('dashboard.tableHeaders.date')}</th>
                    <th style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#374151',
                      borderBottom: '2px solid #e2e8f0'
                    }}>{t('dashboard.tableHeaders.status')}</th>
                  </tr>
                </thead>
              <tbody>
                {bookingRequests.map((req, index) => (
                  <motion.tr
                    key={req._id}
                    whileHover={{ 
                      scale: 1.01, 
                      backgroundColor: '#f8fafc',
                      boxShadow: '0 2px 8px rgba(18, 58, 143, 0.1)'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{ 
                      cursor: 'pointer',
                      borderBottom: index === bookingRequests.length - 1 ? 'none' : '1px solid #f1f5f9',
                      background: index % 2 === 0 ? '#ffffff' : '#fafbfc'
                    }}
                    onClick={() => handleMoreInfo(req)}
                  >
                    <td data-label={t('dashboard.tableHeaders.id')}>{req._id.slice(-8)}</td>
                    <td
                      data-label={t('dashboard.tableHeaders.banner')}
                      className="dashboard-td-primary"
                    >
                      {req.banner?.location || t('dashboard.unknownBanner')}
                    </td>
                    <td data-label={t('dashboard.tableHeaders.advertiser')}>
                      {req.advertiser?.fullName || req.advertiser?.email || t('dashboard.unknownAdvertiser')}
                    </td>
                    <td data-label={t('dashboard.tableHeaders.date')}>{formatDate(req.createdAt)}</td>
                    <td
                      data-label={t('dashboard.tableHeaders.status')}
                      className="dashboard-td-status"
                    >
                        {req.status === 'approved' ? (
                          <span style={{ 
                            color: '#22c55e', 
                            fontWeight: 700, 
                            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', 
                            borderRadius: 20, 
                            padding: '6px 16px', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: 6,
                            border: '1px solid #bbf7d0',
                            boxShadow: '0 2px 4px rgba(34,197,94,0.1)'
                          }}>
                            <CheckCircle size={16} style={{ verticalAlign: 'middle' }} /> 
                            {t('dashboard.approved')}
                          </span>
                        ) : req.status === 'pending' ? (
                          <span style={{
                            color: '#f59e0b',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            borderRadius: 20,
                            padding: '6px 16px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            border: '1px solid #fde68a',
                            boxShadow: '0 2px 4px rgba(245,158,11,0.1)',
                          }}>
                            <Clock size={16} style={{ verticalAlign: 'middle' }} />
                            {t('dashboard.pending')}
                          </span>
                        ) : (
                          <span style={{ 
                            color: '#ef4444', 
                            fontWeight: 700, 
                            background: 'linear-gradient(135deg, #fde7e9 0%, #fecaca 100%)', 
                            borderRadius: 20, 
                            padding: '6px 16px', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: 6,
                            border: '1px solid #fecaca',
                            boxShadow: '0 2px 4px rgba(239,68,68,0.1)'
                          }}>
                            <X size={16} style={{ verticalAlign: 'middle' }} />
                            {t('dashboard.rejected')}
                          </span>
                        )}
                      </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </motion.section>

      {/* Your Banners Section */}
      <motion.section
        className="dashboard-section dashboard-panel"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="dashboard-section-header">
          <div className="dashboard-section-header-main">
            <div className="dashboard-section-icon dashboard-section-icon--green">
              <MapPin size={24} color="#ffffff" />
            </div>
            <div>
              <h2 className="dashboard-section-title">
                {t('dashboard.yourBanners')}
              </h2>
              <p className="dashboard-section-subtitle">
                {t('dashboard.manageAndTrackBanners')}
              </p>
            </div>
          </div>
          <div className="dashboard-section-count dashboard-section-count--green">
            {locale.n(userBanners.length)} {userBanners.length === 1 ? t('dashboard.banner') : t('dashboard.banners')}
          </div>
        </div>
        {accountType === 'bannerOwner' && (
          <div className="dashboard-add-banner-row">
            <motion.button
              className="dashboard-add-banner-btn"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                background: 'linear-gradient(90deg, #059669 0%, #047857 100%)'
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: 10, 
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', 
                color: '#fff', 
                fontWeight: 700, 
                fontSize: 16, 
                borderRadius: 12, 
                border: 'none', 
                boxShadow: '0 2px 12px rgba(16,185,129,0.2)', 
                padding: '14px 28px', 
                cursor: 'pointer', 
                transition: 'all 0.2s ease', 
                marginLeft: 'auto'
              }}
              onClick={() => router.push('/banner-verification')}
            >
              <Plus size={22} style={{ marginRight: 6, verticalAlign: 'middle' }} /> 
              {t('dashboard.addNewBanner')}
            </motion.button>
          </div>
        )}
        <div className="dashboard-banners-list">
          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                margin: '20px 0'
              }}
            >
              <div style={{ display: 'inline-block', marginBottom: 24 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #e2e8f0',
                  borderTop: '4px solid #123a8f',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }} />
              </div>
              <h3 style={{ color: '#123a8f', fontWeight: 800, fontSize: '1.3rem', marginBottom: 10 }}>
                {t('dashboard.loadingYourBanners')}
              </h3>
              <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
                {t('dashboard.fetchingBannerInformation')}
              </p>
            </motion.div>
          ) : userBanners.length === 0 ? (
            <motion.div
              className="dashboard-empty-state-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="dashboard-welcome-banner">
                <h3>{t('dashboard.welcomeToYaftty')} 🎉</h3>
                <p>{t('dashboard.getStartedMessage')}</p>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                style={{ display: 'inline-block', marginBottom: 20 }}
              >
                <MapPin size={56} color="#123a8f" style={{ filter: 'drop-shadow(0 4px 16px rgba(18, 58, 143, 0.12))' }} />
              </motion.div>
              <h3 style={{ color: '#123a8f', fontWeight: 800, fontSize: '1.35rem', marginBottom: 10 }}>
                {t('dashboard.noBannersYet')}
              </h3>
              <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: 24, lineHeight: 1.55 }}>
                {t('dashboard.noBannersMessage')}
              </p>
              <motion.button
                className="dashboard-add-banner-btn"
                whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(18, 58, 143, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'linear-gradient(90deg, #123a8f 0%, #123a8f 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 10,
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(18, 58, 143, 0.10)',
                  padding: '14px 28px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => router.push('/banner-verification')}
              >
                <Plus size={22} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                {t('dashboard.addYourFirstBanner')}
              </motion.button>
            </motion.div>
          ) : (
            <div className="dashboard-banners-grid">
              {userBanners.map((banner, index) => (
                <motion.div
                  key={banner._id}
                  className="dashboard-banner-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: '0 8px 32px rgba(16,185,129,0.15)',
                    borderColor: '#10b981'
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(18, 58, 143, 0.08)',
                    border: '2px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => handleViewDetails(banner)}
                >
                  {/* Status Indicator - Only show for pending and rejected */}
                  {banner.status !== 'approved' && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      zIndex: 2
                    }}>
                      <span style={{
                        ...getStatusColor(banner.status),
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(10px)',
                        background: banner.status === 'pending'
                          ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                          : 'linear-gradient(135deg, #fde7e9 0%, #fecaca 100%)'
                      }}>
                        {banner.status === 'pending' && <AlertCircle size={12} />}
                        {banner.status === 'rejected' && <X size={12} />}
                        {banner.status.charAt(0).toUpperCase() + banner.status.slice(1)}
                      </span>
                    </div>
                  )}
                  {/* Banner Image */}
                  <div style={{ 
                    marginBottom: '20px',
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}>
                    <img
                      src={banner.bannerImageUrl}
                      alt={banner.location}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '16px',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '12px'
                    }}>
                      <MapPin size={16} color="#ffffff" style={{ marginRight: 4 }} />
                      <span style={{ 
                        color: '#ffffff', 
                        fontSize: '12px', 
                        fontWeight: 600,
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}>
                        {locale.decimal(banner.coordinates.latitude, 4)}, {locale.decimal(banner.coordinates.longitude, 4)}
                      </span>
                    </div>
                  </div>

                  {/* Banner Info */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: '800', 
                      color: '#1e293b', 
                      marginBottom: '12px',
                      marginTop: 0,
                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {banner.location}
                    </h3>
                    
                    <div className="dashboard-banner-stats">
                      <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ 
                          color: '#64748b', 
                          fontSize: '11px', 
                          fontWeight: '600',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Size
                        </div>
                        <div style={{ 
                          color: '#1e293b', 
                          fontSize: '14px', 
                          fontWeight: '700'
                        }}>
                          {localizeDigitsInString(banner.size, currentLanguage)}
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ 
                          color: '#64748b', 
                          fontSize: '11px', 
                          fontWeight: '600',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Type
                        </div>
                        <div style={{ 
                          color: '#1e293b', 
                          fontSize: '14px', 
                          fontWeight: '700'
                        }}>
                          {banner.type}
                        </div>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ 
                          color: '#64748b', 
                          fontSize: '11px', 
                          fontWeight: '600',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Traffic
                        </div>
                        <div style={{ 
                          color: getTrafficColor(banner.traffic), 
                          fontSize: '14px', 
                          fontWeight: '700',
                          textTransform: 'capitalize'
                        }}>
                          {banner.traffic || 'N/A'}
                        </div>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ 
                          color: '#64748b', 
                          fontSize: '11px', 
                          fontWeight: '600',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Price/Month
                        </div>
                        <div style={{ 
                          color: '#10b981', 
                          fontSize: '14px', 
                          fontWeight: '700'
                        }}>
                          EGP {formatEgpAmount(banner.pricePerMonth, currentLanguage)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #bbf7d0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={14} color="#059669" />
                        <div>
                          <div style={{ 
                            color: '#059669', 
                            fontSize: '11px', 
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Added
                          </div>
                          <div style={{ 
                            color: '#065f46', 
                            fontSize: '13px', 
                            fontWeight: '700'
                          }}>
                            {formatDate(banner.createdAt)}
                          </div>
                        </div>
                      </div>
                      {banner.start_date && banner.end_date && (
                        <div style={{ marginTop: 4 }}>
                          <div style={{ 
                            color: '#059669', 
                            fontSize: '11px', 
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: 2
                          }}>
                            Contract duration
                          </div>
                          <div style={{ 
                            color: '#065f46', 
                            fontSize: '12px', 
                            fontWeight: '600'
                          }}>
                            {formatDate(banner.start_date)} – {formatDate(banner.end_date)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Banner Status and Contract Information */}
                  {banner.banner_status && (
                    <div style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          color: '#64748b',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Contract Status
                        </div>
                        <span style={{
                          ...getBannerStatusStyle(banner.banner_status),
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase'
                        }}>
                          {getBannerStatusText(banner.banner_status)}
                        </span>
                      </div>
                      
                      {banner.start_date && banner.end_date && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                          marginTop: '8px'
                        }}>
                          <div>
                            <div style={{
                              color: '#64748b',
                              fontSize: '10px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              marginBottom: '4px'
                            }}>
                              Start Date
                            </div>
                            <div style={{
                              color: '#1e293b',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {new Date(banner.start_date).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div style={{
                              color: '#64748b',
                              fontSize: '10px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              marginBottom: '4px'
                            }}>
                              End Date
                            </div>
                            <div style={{
                              color: banner.banner_status === 'expired' ? '#ef4444' : '#1e293b',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {new Date(banner.end_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      )}

                      {banner.banner_status === 'expiring_soon' && banner.end_date && (
                        <div style={{
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          border: '1px solid #f59e0b',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          marginTop: '8px'
                        }}>
                          <div style={{
                            color: '#92400e',
                            fontSize: '11px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <AlertCircle size={12} />
                            Expires in {Math.ceil((new Date(banner.end_date) - new Date()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        </div>
                      )}

                      {banner.banner_status === 'expired' && (
                        <div style={{
                          background: 'linear-gradient(135deg, #fde7e9 0%, #fecaca 100%)',
                          border: '1px solid #ef4444',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          marginTop: '8px'
                        }}>
                          <div style={{
                            color: '#dc2626',
                            fontSize: '11px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <X size={12} />
                            Contract expired - Contact admin to renew
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <motion.button
                      onClick={e => { e.stopPropagation(); handleViewDetails(banner); }}
                      whileHover={{ 
                        scale: 1.02,
                        background: 'linear-gradient(135deg, #123a8f 0%, #123a8f 100%)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flex: 1,
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Eye size={14} />
                      View
                    </motion.button>



                    <motion.button
                      onClick={e => { e.stopPropagation(); handleDeleteBanner(banner); }}
                      whileHover={{ 
                        scale: 1.02,
                        background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flex: 1,
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Banner Details Modal */}
      {showBannerModal && selectedBanner && (
        <div className="dashboard-modal-overlay" onClick={handleCloseModal}>
          <motion.div
            className="dashboard-modal-content"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.22 }}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '500px', width: '90%' }}
          >
            <button type="button" className="dashboard-modal-close" onClick={handleCloseModal} aria-label="Close"><X size={20} /></button>
            
            {/* Banner Image */}
            <div style={{ marginBottom: '20px' }}>
              <img
                src={selectedBanner.bannerImageUrl}
                alt={selectedBanner.location}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            </div>

            <h2 style={{ color: '#123a8f', fontWeight: 800, marginBottom: 16, fontSize: '20px' }}>
              {selectedBanner.location}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#64748b" />
                <span style={{ color: '#64748b', fontSize: '14px' }}>
                  {locale.decimal(selectedBanner.coordinates.latitude, 6)}, {locale.decimal(selectedBanner.coordinates.longitude, 6)}
                </span>
              </div>
              <div style={{ color: '#475569', fontSize: '14px' }}>
                Size: <b>{selectedBanner.size}</b>
              </div>
              <div style={{ color: '#475569', fontSize: '14px' }}>
                Type: <b>{selectedBanner.type}</b>
              </div>
              <div style={{ color: '#475569', fontSize: '14px' }}>
                Added: <b>{formatDate(selectedBanner.createdAt)}</b>
              </div>
              <div style={{ color: '#475569', fontSize: '14px' }}>
                Status: <b style={{ ...getStatusColor(selectedBanner.status) }}>
                  {selectedBanner.status.charAt(0).toUpperCase() + selectedBanner.status.slice(1)}
                </b>
              </div>
            </div>

            <div style={{ 
              padding: '12px', 
              background: '#f8fafc', 
              borderRadius: '8px',
              fontSize: '13px',
              color: '#64748b'
            }}>
              <strong>Banner ID:</strong> {selectedBanner._id}
            </div>
          </motion.div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="dashboard-modal-overlay" onClick={handleCloseModal}>
          <motion.div
            className="dashboard-modal-content dashboard-booking-details-modal"
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
          >
            <button type="button" className="dashboard-modal-close" onClick={handleCloseModal} aria-label={t('dashboard.close')}><X size={20} /></button>
            <h3 className="dashboard-booking-details-title">
              📋 {t('dashboard.bookingRequestDetails')}
            </h3>
            
            <div className="dashboard-booking-details-section">
              <h4 className="dashboard-booking-details-heading">
                {t('dashboard.bannerInformation')}
              </h4>
              <ul className="dashboard-booking-details-meta">
                <li>
                  <strong>{t('dashboard.tableHeaders.location')}:</strong>{' '}
                  <span dir="auto">{selectedBooking.banner?.location || t('dashboard.unknown')}</span>
                </li>
                <li>
                  <strong>{t('dashboard.size')}:</strong>{' '}
                  <span dir="auto">
                    {selectedBooking.banner?.size
                      ? localizeDigitsInString(selectedBooking.banner.size, currentLanguage)
                      : t('dashboard.unknown')}
                  </span>
                </li>
                <li>
                  <strong>{t('dashboard.type')}:</strong>{' '}
                  <span dir="auto">{selectedBooking.banner?.type || t('dashboard.unknown')}</span>
                </li>
              </ul>
            </div>

            <div className="dashboard-booking-details-section">
              <h4 className="dashboard-booking-details-heading">
                {t('dashboard.advertiserInformation')}
              </h4>
              <ul className="dashboard-booking-details-meta">
                <li>
                  <strong>{t('dashboard.name')}:</strong>{' '}
                  <span dir="auto">{selectedBooking.advertiser?.fullName || t('dashboard.unknown')}</span>
                </li>
                <li>
                  <strong>{t('dashboard.email')}:</strong>{' '}
                  <span dir="auto">{selectedBooking.advertiser?.email || t('dashboard.unknown')}</span>
                </li>
              </ul>
            </div>

            <div className="dashboard-booking-details-section">
              <h4 className="dashboard-booking-details-heading">
                {t('dashboard.campaignDetails')}
              </h4>
              <ul className="dashboard-booking-details-meta">
                <li>
                  <strong>{t('dashboard.tableHeaders.startDate')}:</strong>{' '}
                  <span dir="auto">{formatDate(selectedBooking.startDate)}</span>
                </li>
                <li>
                  <strong>{t('dashboard.tableHeaders.endDate')}:</strong>{' '}
                  <span dir="auto">{formatDate(selectedBooking.endDate)}</span>
                </li>
                <li>
                  <strong>{t('dashboard.tableHeaders.status')}:</strong>{' '}
                  <span
                    className="dashboard-booking-status-badge"
                    style={getStatusColor(selectedBooking.status)}
                  >
                    {getBookingStatusLabel(selectedBooking.status)}
                  </span>
                </li>
              </ul>
              <div className="dashboard-booking-description">
                <strong>{t('dashboard.campaignDescription')}:</strong>
                <div className="dashboard-booking-description-box" dir="auto">
                  {selectedBooking.campaignDescription}
                </div>
              </div>
                
                {/* Content Files */}
                {selectedBooking.contentFiles && selectedBooking.contentFiles.length > 0 && (
                  <div className="dashboard-booking-content-files">
                    <strong>{t('dashboard.contentFiles')}:</strong>
                    <div style={{ 
                      marginTop: '8px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '8px'
                    }}>
                      {selectedBooking.contentFiles.map((url, index) => {
                        const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i);
                        const isVideo = url.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i);
                        const contentType = isImage ? 'image' : isVideo ? 'video' : 'file';
                        
                        return (
                          <div key={index} style={{
                            padding: '8px',
                            background: 'white',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center',
                            position: 'relative'
                          }}>
                            {isImage ? (
                              <img 
                                src={url} 
                                alt={`Content ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '80px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  marginBottom: '4px'
                                }}
                              />
                            ) : isVideo ? (
                              <video 
                                src={url}
                                style={{
                                  width: '100%',
                                  height: '80px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  marginBottom: '4px'
                                }}
                                controls
                              />
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '80px',
                                background: '#f3f4f6',
                                borderRadius: '4px',
                                marginBottom: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                color: '#6b7280'
                              }}>
                                📄
                              </div>
                            )}
                            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>
                              {t('dashboard.fileN', { n: index + 1 })}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleViewContent(url, contentType)}
                              style={{
                                padding: '4px 8px',
                                background: 'linear-gradient(135deg, #123a8f 0%, #123a8f 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 2px 4px rgba(18, 58, 143, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                              }}
                            >
                              {t('dashboard.viewFull')}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>

            {/* Action Buttons for Pending Requests */}
            {selectedBooking.status === 'pending' && (
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'center',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => handleBookingResponse(selectedBooking._id, 'accepted')}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <CheckCircle size={16} />
                  {t('dashboard.approveRequest')}
                </button>
                
                {!showRejectionInput ? (
                  <button
                    onClick={handleRejectClick}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <X size={16} />
                    {t('dashboard.rejectRequest')}
                  </button>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    width: '100%'
                  }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#374151' 
                      }}>
                        {t('dashboard.reasonForRejection')} <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <textarea
                        value={rejectionNote}
                        onChange={(e) => setRejectionNote(e.target.value)}
                        placeholder={t('dashboard.rejectionPlaceholder')}
                        rows="4"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          resize: 'vertical',
                          outline: 'none',
                          transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleBookingResponse(selectedBooking._id, 'rejected')}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                          flex: 1
                        }}
                      >
                        {t('dashboard.confirmRejection')}
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectionInput(false);
                          setRejectionNote('');
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#f3f4f6',
                          color: '#374151',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                          flex: 1
                        }}
                      >
                        {t('dashboard.cancel')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delete Button for Accepted/Rejected Bookings Only */}
            {(selectedBooking.status === 'approved' || selectedBooking.status === 'rejected') && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => handleDeleteBooking(selectedBooking)}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Trash2 size={16} />
                  {t('dashboard.deleteBooking')}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="dashboard-modal-overlay" onClick={handleCloseModal}>
          <motion.div
            className="dashboard-modal-content"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
            style={{ minWidth: 280, maxWidth: 340, textAlign: 'center' }}
          >
            <button type="button" className="dashboard-modal-close" onClick={handleCloseModal} aria-label="Close"><X size={20} /></button>
            <h3 style={{ color: confirmAction.type === 'approve' ? '#22c55e' : '#ef4444', fontWeight: 800, marginBottom: 16 }}>
              {confirmAction.type === 'approve' ? 'Approve Booking?' : 'Reject Booking?'}
            </h3>
            <div style={{ color: '#64748b', fontSize: 15, marginBottom: 18 }}>
              Are you sure you want to {confirmAction.type} this booking?
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                style={{
                  background: confirmAction.type === 'approve' ? '#22c55e' : '#ef4444',
                  color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                }}
                onClick={handleConfirmAction}
              >
                Yes
              </button>
              <button
                style={{
                  background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                }}
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && bannerToDelete && (
        <div className="dashboard-modal-overlay" onClick={handleCancelDelete}>
          <motion.div
            className="dashboard-modal-content"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
            style={{ minWidth: 320, maxWidth: 400, textAlign: 'center' }}
          >
            <button type="button" className="dashboard-modal-close" onClick={handleCancelDelete} aria-label="Close"><X size={20} /></button>
            <div style={{ marginBottom: '20px' }}>
              <Trash2 size={48} color="#dc2626" style={{ marginBottom: '16px' }} />
            </div>
            <h3 style={{ color: '#dc2626', fontWeight: 800, marginBottom: 16, fontSize: '18px' }}>
              Delete Banner?
            </h3>
            <div style={{ color: '#64748b', fontSize: 15, marginBottom: 20, lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>"{bannerToDelete.location}"</strong>? 
              This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onClick={handleConfirmDelete}
                onMouseEnter={(e) => e.target.style.background = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.background = '#dc2626'}
              >
                Delete Banner
              </button>
              <button
                style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onClick={handleCancelDelete}
                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Content Viewing Modal */}
      {showContentModal && selectedContent && (
        <div className="dashboard-modal-overlay" onClick={handleCloseModal}>
          <motion.div
            className="dashboard-modal-content dashboard-content-preview-modal"
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
          >
            <button type="button" className="dashboard-modal-close" onClick={handleCloseModal} aria-label={t('dashboard.close')}><X size={20} /></button>
            <h3 className="dashboard-content-preview-title">
              📎 {t('dashboard.contentPreview')}
            </h3>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '300px',
              maxHeight: '70vh',
              overflow: 'auto'
            }}>
              {selectedContent.type === 'image' ? (
                <img 
                  src={selectedContent.url} 
                  alt={t('dashboard.contentPreview')}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
              ) : selectedContent.type === 'video' ? (
                <video 
                  src={selectedContent.url}
                  controls
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
              ) : (
                <div style={{
                  padding: '40px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '2px dashed #cbd5e0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    {t('dashboard.filePreview')}
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                    {t('dashboard.cannotPreviewFile')}
                  </div>
                  <a 
                    href={selectedContent.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #123a8f 0%, #123a8f 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '14px',
                      display: 'inline-block'
                    }}
                  >
                    {t('dashboard.downloadFile')}
                  </a>
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="dashboard-delete-btn dashboard-delete-btn--cancel"
                onClick={handleCloseModal}
              >
                {t('dashboard.close')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Booking Confirmation Modal */}
      {showDeleteBookingModal && bookingToDelete && (
        <div className="dashboard-modal-overlay" onClick={() => setShowDeleteBookingModal(false)}>
          <motion.div
            className="dashboard-modal-content dashboard-delete-modal"
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
          >
            <button type="button" className="dashboard-modal-close" onClick={() => setShowDeleteBookingModal(false)} aria-label={t('dashboard.close')}><X size={20} /></button>
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
                  <strong>{t('dashboard.tableHeaders.advertiser')}:</strong>{' '}
                  <span dir="auto">{bookingToDelete.advertiser?.fullName || bookingToDelete.advertiser?.email || t('dashboard.unknownAdvertiser')}</span>
                </li>
                <li>
                  <strong>{t('dashboard.tableHeaders.status')}:</strong>{' '}
                  <span dir="auto">{getBookingStatusLabel(bookingToDelete.status)}</span>
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


    </div>
  );
};

export default Dashboard;
