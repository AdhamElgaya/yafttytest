'use client';

import React, { useEffect, useMemo } from 'react';
import { X, MapPin, Ruler, Calendar, Image as ImageIcon } from 'lucide-react';
import { formatEgpWithCurrency } from '../lib/money';
import { estimateCampaignAmountEgp, monthsBetweenInclusive } from '../lib/cartPricing';
import './CartItemDetailsPanel.css';

export default function CartItemDetailsPanel({
  item,
  isOpen,
  onClose,
  contentPreviewUrl,
  isArabic,
  t,
  onBookIndividual,
  bookingIndividual = false,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape' && !bookingIndividual) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose, bookingIndividual]);

  const periodTotal = useMemo(() => {
    if (!item?.banner?.pricePerMonth || !item.startDate || !item.endDate) return null;
    return estimateCampaignAmountEgp(
      item.banner.pricePerMonth,
      item.startDate,
      item.endDate
    );
  }, [item]);

  const months = useMemo(() => {
    if (!item?.startDate || !item?.endDate) return null;
    return monthsBetweenInclusive(item.startDate, item.endDate);
  }, [item]);

  if (!isOpen || !item) return null;

  const bannerImage =
    item.banner?.bannerImageUrl || item.banner?.image || item.banner?.banner_image_url;

  return (
    <div className="cart-details-overlay" onClick={bookingIndividual ? undefined : onClose} role="presentation">
      <div
        className="cart-details-modal"
        dir={isArabic ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-details-title"
      >
        <header className="cart-details-header">
          <h2 id="cart-details-title">{t('cart.detailsTitle')}</h2>
          <button
            type="button"
            className="cart-details-close"
            onClick={onClose}
            disabled={bookingIndividual}
            aria-label={t('cart.closeDetails')}
          >
            <X size={22} />
          </button>
        </header>

        <div className="cart-details-body">
          <div className="cart-details-location">
            <MapPin size={18} />
            <span>{item.banner?.location || '—'}</span>
          </div>

          <dl className="cart-details-facts">
            <div>
              <dt>{t('cart.size')}</dt>
              <dd>{item.banner?.size || t('map.banner.notAvailable')}</dd>
            </div>
            <div>
              <dt>{t('cart.pricePerMonth')}</dt>
              <dd>
                {item.banner?.pricePerMonth != null
                  ? formatEgpWithCurrency(item.banner.pricePerMonth, isArabic ? 'ar' : 'en')
                  : '—'}
              </dd>
            </div>
            <div>
              <dt>{t('cart.periodTotal')}</dt>
              <dd className="cart-details-total">
                {periodTotal != null
                  ? formatEgpWithCurrency(periodTotal, isArabic ? 'ar' : 'en')
                  : '—'}
                {months != null && (
                  <span className="cart-details-months-hint">
                    {t('cart.monthsCount').replace('{count}', String(months))}
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt>{t('cart.dates')}</dt>
              <dd>
                <Calendar size={14} style={{ verticalAlign: 'middle', marginInlineEnd: 4 }} />
                {item.startDate} → {item.endDate}
              </dd>
            </div>
            {item.campaignDescription ? (
              <div>
                <dt>{t('map.banner.campaignDescription')}</dt>
                <dd>{item.campaignDescription}</dd>
              </div>
            ) : null}
          </dl>

          {bannerImage ? (
            <section className="cart-details-media">
              <h3>{t('cart.bannerPhoto')}</h3>
              <img src={bannerImage} alt="" className="cart-details-banner-img" />
            </section>
          ) : null}

          <section className="cart-details-media">
            <h3>
              <ImageIcon size={16} style={{ verticalAlign: 'middle', marginInlineEnd: 6 }} />
              {t('cart.uploadedContent')}
            </h3>
            {contentPreviewUrl ? (
              <>
                {item.contentFileName ? (
                  <p className="cart-details-filename">{item.contentFileName}</p>
                ) : null}
                {item.contentType === 'video' ||
                /\.(mp4|webm|mov)$/i.test(item.contentFileName || '') ? (
                  <video src={contentPreviewUrl} controls className="cart-details-content-preview" />
                ) : (
                  <img src={contentPreviewUrl} alt="" className="cart-details-content-preview" />
                )}
                <p className="cart-details-temp-note">{t('cart.contentTempNote')}</p>
              </>
            ) : (
              <p className="cart-details-no-content">{t('cart.noUploadedContent')}</p>
            )}
          </section>
        </div>

        <footer className="cart-details-footer">
          <button
            type="button"
            className="cart-details-book-btn"
            disabled={bookingIndividual}
            onClick={() => onBookIndividual?.(item)}
          >
            {bookingIndividual ? t('cart.bookingIndividual') : t('cart.bookIndividually')}
          </button>
          <button
            type="button"
            className="cart-details-cancel-btn"
            disabled={bookingIndividual}
            onClick={onClose}
          >
            {t('cart.closeDetails')}
          </button>
        </footer>
      </div>
    </div>
  );
}
