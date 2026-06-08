'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Trash2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useBookingCart } from '../contexts/BookingCartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { bookingAuthHeaders } from '../lib/bookingClient';
import { uploadBookingContentFile } from '../lib/cartContentUpload';
import { formatEgpWithCurrency } from '../lib/money';
import { estimateCampaignAmountEgp } from '../lib/cartPricing';
import CartItemDetailsPanel from '../components/CartItemDetailsPanel';
import './BookingCart.css';

export default function BookingCartPage() {
  const { user, isAuthenticated } = useAuth();
  const {
    items,
    itemCount,
    removeItem,
    clearCart,
    hydrated,
    getTempContentFile,
    getContentPreviewUrl,
  } = useBookingCart();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [bookingIndividual, setBookingIndividual] = useState(false);
  const [detailsItemId, setDetailsItemId] = useState(null);
  const isArabic = currentLanguage === 'ar';

  const detailsItem = useMemo(
    () => items.find((i) => i.cartItemId === detailsItemId) || null,
    [items, detailsItemId]
  );

  const getPeriodTotal = (item) => {
    if (!item?.banner?.pricePerMonth || !item.startDate || !item.endDate) return null;
    return estimateCampaignAmountEgp(
      item.banner.pricePerMonth,
      item.startDate,
      item.endDate
    );
  };

  const buildPayloadItem = async (item) => {
    const file = getTempContentFile(item.cartItemId);
    let contentUrls = (item.contentUrls || []).filter(
      (u) => typeof u === 'string' && !u.startsWith('blob:')
    );
    if (file) {
      contentUrls = await uploadBookingContentFile(file);
    }
    return {
      bannerId: item.bannerId,
      startDate: item.startDate,
      endDate: item.endDate,
      campaignDescription: item.campaignDescription || '',
      contentType: item.contentType || 'photo',
      contentUrls,
    };
  };

  const handleBookIndividual = async (item) => {
    if (!isAuthenticated || !user?._id) {
      toast.error(t('cart.loginRequired'));
      router.push('/login?next=/cart');
      return;
    }
    if (!item) return;

    setBookingIndividual(true);
    try {
      const headers = await bookingAuthHeaders(true);
      const payloadItems = [await buildPayloadItem(item)];

      const res = await fetch('/api/booking/create-batch', {
        method: 'POST',
        headers,
        body: JSON.stringify({ items: payloadItems }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || t('cart.submitFailed'));
      }

      removeItem(item.cartItemId);
      setDetailsItemId(null);
      toast.success(t('cart.submitSuccess'));
      router.push('/advertiser-dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.message || t('cart.submitFailed'));
    } finally {
      setBookingIndividual(false);
    }
  };

  const handleSubmitAll = async () => {
    if (!isAuthenticated || !user?._id) {
      toast.error(t('cart.loginRequired'));
      router.push('/login?next=/cart');
      return;
    }
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const headers = await bookingAuthHeaders(true);
      const payloadItems = [];

      for (const item of items) {
        payloadItems.push(await buildPayloadItem(item));
      }

      const res = await fetch('/api/booking/create-batch', {
        method: 'POST',
        headers,
        body: JSON.stringify({ items: payloadItems }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || t('cart.submitFailed'));
      }

      clearCart();
      toast.success(t('cart.submitSuccess'));
      router.push('/advertiser-dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.message || t('cart.submitFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="booking-cart-page" dir={isArabic ? 'rtl' : 'ltr'}>
        <p>{t('checkout.loading')}</p>
      </div>
    );
  }

  return (
    <div className="booking-cart-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <h1>{t('cart.title')}</h1>
      <p className="cart-subtitle">{t('cart.subtitle')}</p>
      {itemCount > 0 && (
        <p className="cart-item-count-badge">
          {t('cart.itemCount').replace('{count}', String(itemCount))}
        </p>
      )}

      {itemCount === 0 ? (
        <div className="booking-cart-empty">
          <h2>{t('cart.emptyTitle')}</h2>
          <p>{t('cart.emptyMessage')}</p>
          <Link href="/map" className="booking-cart-btn-primary booking-cart-btn-primary--block">
            {t('cart.browseMap')}
          </Link>
        </div>
      ) : (
        <>
          {items.map((item) => {
            const periodTotal = getPeriodTotal(item);
            return (
              <div key={item.cartItemId} className="booking-cart-item">
                <div className="booking-cart-item-row">
                  <div className="booking-cart-item-main">
                    <h3>
                      <MapPin size={16} className="booking-cart-item-pin" />
                      {item.banner?.location || t('dashboard.unknownBanner')}
                    </h3>
                    <div className="booking-cart-item-meta">
                      <div>
                        {t('cart.dates')}: {item.startDate} → {item.endDate}
                      </div>
                      {periodTotal != null && (
                        <div className="booking-cart-item-price">
                          {t('cart.priceForPeriod')}:{' '}
                          <strong>
                            {formatEgpWithCurrency(periodTotal, currentLanguage)}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="booking-cart-item-actions">
                    <button
                      type="button"
                      className="booking-cart-info-btn"
                      onClick={() => setDetailsItemId(item.cartItemId)}
                      aria-label={t('cart.viewDetails')}
                    >
                      <Info size={20} />
                    </button>
                    <button
                      type="button"
                      className="booking-cart-remove-btn"
                      onClick={() => removeItem(item.cartItemId)}
                      aria-label={t('cart.remove')}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="booking-cart-actions">
            <button
              type="button"
              className="booking-cart-btn-primary"
              disabled={submitting}
              onClick={handleSubmitAll}
            >
              {submitting ? t('cart.submitting') : t('cart.submitAll')}
            </button>
            <Link href="/map" className="booking-cart-btn-secondary">
              {t('cart.continueShopping')}
            </Link>
          </div>
        </>
      )}

      <CartItemDetailsPanel
        item={detailsItem}
        isOpen={Boolean(detailsItem)}
        onClose={() => !bookingIndividual && setDetailsItemId(null)}
        contentPreviewUrl={detailsItem ? getContentPreviewUrl(detailsItem) : null}
        isArabic={isArabic}
        t={t}
        onBookIndividual={handleBookIndividual}
        bookingIndividual={bookingIndividual}
      />
    </div>
  );
}
