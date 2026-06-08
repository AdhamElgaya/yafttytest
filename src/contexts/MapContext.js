'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchApprovedBanners } from '../lib/banners';
import { isSupabaseConfigured } from '../lib/supabase';

// Helper function to get translations
const getTranslation = (key, language = 'en') => {
  const translations = {
    en: {
      failedToLoadBanners: 'Failed to load banners',
      bannerAddedSuccessfully: 'Banner added successfully!',
      failedToAddBanner: 'Failed to add banner',
      bannerUpdatedSuccessfully: 'Banner updated successfully!',
      failedToUpdateBanner: 'Failed to update banner',
      bannerDeletedSuccessfully: 'Banner deleted successfully!',
      failedToDeleteBanner: 'Failed to delete banner',
      bookingRequestSentSuccessfully: 'Booking request sent successfully!',
      failedToBookBanner: 'Failed to book banner'
    },
    ar: {
      failedToLoadBanners: 'فشل في تحميل اليافطات',
      bannerAddedSuccessfully: 'تم إضافة اليافطة بنجاح!',
      failedToAddBanner: 'فشل في إضافة اليافطة',
      bannerUpdatedSuccessfully: 'تم تحديث اليافطة بنجاح!',
      failedToUpdateBanner: 'فشل في تحديث اليافطة',
      bannerDeletedSuccessfully: 'تم حذف اليافطة بنجاح!',
      failedToDeleteBanner: 'فشل في حذف اليافطة',
      bookingRequestSentSuccessfully: 'تم إرسال طلب الحجز بنجاح!',
      failedToBookBanner: 'فشل في حجز اليافطة'
    }
  };
  
  return translations[language]?.[key] || translations.en[key] || key;
};

const MapContext = createContext();

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export const MapProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [mapCenter, setMapCenter] = useState([30.139035505435686, 26.95373148935866]); // Egypt center
  const [mapZoom, setMapZoom] = useState(6);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    bannerType: '',
    priceRange: '',
    location: '',
  });
  
  // Get current language from localStorage or default to 'en'
  const getCurrentLanguage = () => {
    return localStorage.getItem('language') || 'en';
  };

  const loadBanners = async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured — add keys to .env');
        setBanners([]);
        return;
      }
      const data = await fetchApprovedBanners();
      setBanners(data.success && Array.isArray(data.banners) ? data.banners : []);
    } catch (error) {
      console.error('Error loading banners:', error);
      toast.error(getTranslation('failedToLoadBanners', getCurrentLanguage()));
    } finally {
      setLoading(false);
    }
  };

  // Add new banner
  const addBanner = async (bannerData) => {
    try {
      setLoading(true);
      
      // Simulate API call for frontend-only demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBanner = {
        id: Date.now().toString(),
        ...bannerData,
        owner: {
          name: 'Demo Owner',
          rating: 4.5,
          verified: true,
        },
        availability: {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          bookedDates: [],
        },
      };
      
      setBanners(prev => [...prev, newBanner]);
      toast.success(getTranslation('bannerAddedSuccessfully', getCurrentLanguage()));
      
    } catch (error) {
      console.error('Error adding banner:', error);
      toast.error(getTranslation('failedToAddBanner', getCurrentLanguage()));
    } finally {
      setLoading(false);
    }
  };

  // Update banner
  const updateBanner = async (bannerId, updateData) => {
    try {
      setLoading(true);
      
      // Simulate API call for frontend-only demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBanners(prev => prev.map(banner => 
        banner.id === bannerId ? { ...banner, ...updateData } : banner
      ));
      toast.success(getTranslation('bannerUpdatedSuccessfully', getCurrentLanguage()));
      
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error(getTranslation('failedToUpdateBanner', getCurrentLanguage()));
    } finally {
      setLoading(false);
    }
  };

  // Delete banner
  const deleteBanner = async (bannerId) => {
    try {
      setLoading(true);
      
      // Simulate API call for frontend-only demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBanners(prev => prev.filter(banner => banner.id !== bannerId));
      toast.success(getTranslation('bannerDeletedSuccessfully', getCurrentLanguage()));
      
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error(getTranslation('failedToDeleteBanner', getCurrentLanguage()));
    } finally {
      setLoading(false);
    }
  };

  // Book banner
  const bookBanner = async (bannerId, bookingData) => {
    try {
      setLoading(true);
      
      // Simulate API call for frontend-only demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const booking = {
        id: Date.now().toString(),
        bannerId,
        ...bookingData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      
      toast.success(getTranslation('bookingRequestSentSuccessfully', getCurrentLanguage()));
      return booking;
      
    } catch (error) {
      console.error('Error booking banner:', error);
      toast.error(getTranslation('failedToBookBanner', getCurrentLanguage()));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Filter banners (supports both API shape (pricePerMonth) and legacy shape (price))
  const filteredBanners = banners.filter(banner => {
    if (filters.bannerType && banner.type !== filters.bannerType) {
      return false;
    }
    const price = banner.pricePerMonth ?? banner.price;
    if (filters.priceRange && price != null) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (price < min || price > max) return false;
    }
    if (filters.location && banner.location && !banner.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      bannerType: '',
      priceRange: '',
      location: '',
    });
  };

  // Load banners on mount
  useEffect(() => {
    loadBanners();
  }, []);

  const value = {
    banners: filteredBanners,
    selectedBanner,
    setSelectedBanner,
    mapCenter,
    setMapCenter,
    mapZoom,
    setMapZoom,
    loading,
    filters,
    addBanner,
    updateBanner,
    deleteBanner,
    bookBanner,
    updateFilters,
    clearFilters,
    loadBanners,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
}; 