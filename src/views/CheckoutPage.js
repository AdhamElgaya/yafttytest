'use client';

import React, { useEffect, useState, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { bookingAuthHeaders } from '../lib/bookingClient';
import { formatEgpAmount, formatEgpWithCurrency } from '../lib/money';
import YafttyLogo from '../components/YafttyLogo';
import './Checkout.css';

const INSTAPAY_NUMBER = '+201222524672';
const BANK_ACCOUNT = '0890001080892';

function CheckoutBackButton({ label, isArabic }) {
  return (
    <Link
      href="/cart"
      className="checkout-back-btn"
      dir="ltr"
    >
      {isArabic ? (
        <>
          <ArrowLeft size={18} strokeWidth={2} aria-hidden />
          <span dir="auto">{label}</span>
        </>
      ) : (
        <>
          <span dir="auto">{label}</span>
          <ArrowRight size={18} strokeWidth={2} aria-hidden />
        </>
      )}
    </Link>
  );
}

function CheckoutShell({ children, isArabic, backLabel }) {
  return (
    <div className="checkout-shell" dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="checkout-header">
        <Link href="/" className="checkout-logo">
          <YafttyLogo variant="checkout" isArabic={isArabic} />
        </Link>
        {backLabel ? (
          <CheckoutBackButton label={backLabel} isArabic={isArabic} />
        ) : (
          <span />
        )}
      </header>
      {children}
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const isArabic = currentLanguage === 'ar';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('instapay');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError(t('checkout.notFound'));
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const headers = await bookingAuthHeaders();
        const res = await fetch(`/api/booking/order/${orderId}`, { headers });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.success) {
          setError(data.message || t('checkout.notFound'));
          return;
        }
        setOrder(data.order);
        setBookings(data.bookings || []);
      } catch (err) {
        if (!cancelled) setError(err.message || t('checkout.notFound'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId, t]);

  const platformFee = order?.platformFeeEgp ?? 0;
  const campaignTotal = order?.campaignTotalEgp ?? 0;
  const totalDue = campaignTotal + platformFee;

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success(t('checkout.copied'));
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handlePayNow = () => {
    toast(t('checkout.paymentComingSoon'), { icon: 'ℹ️' });
  };

  const summaryBlock = useMemo(() => {
    if (!order) return null;
    return (
      <aside className="checkout-summary">
        <div className="checkout-summary-inner">
        <div className="checkout-summary-items">
          {bookings.map((b) => (
            <div key={b._id} className="checkout-summary-item">
              <div className="checkout-summary-thumb">
                <MapPin size={28} strokeWidth={1.5} />
                <span className="checkout-summary-qty">1</span>
              </div>
              <div className="checkout-summary-item-info">
                <p className="checkout-summary-item-title">
                  {b.banner?.location || t('checkout.bannerBooking')}
                </p>
                <p className="checkout-summary-item-meta">
                  {b.startDate} → {b.endDate}
                </p>
              </div>
              <span className="checkout-summary-item-price">
                {b.totalPrice != null
                  ? formatEgpWithCurrency(b.totalPrice, currentLanguage)
                  : '—'}
              </span>
            </div>
          ))}
        </div>

        <div className="checkout-discount-row">
          <input
            type="text"
            className="checkout-input"
            placeholder={t('checkout.discountCode')}
            disabled
          />
          <button type="button" className="checkout-discount-apply" disabled>
            {t('checkout.apply')}
          </button>
        </div>

        <div className="checkout-summary-lines">
          <div className="checkout-summary-line">
            <span>{t('checkout.subtotal')}</span>
            <span>{formatEgpAmount(campaignTotal, currentLanguage)}</span>
          </div>
          <div className="checkout-summary-line">
            <span>{t('checkout.platformFee')}</span>
            <span>{formatEgpAmount(platformFee, currentLanguage)}</span>
          </div>
        </div>

        <div className="checkout-summary-total">
          <span className="checkout-summary-total-label">{t('checkout.totalDue')}</span>
          <span className="checkout-summary-total-value">
            <span className="checkout-summary-total-currency">EGP</span>
            {formatEgpAmount(totalDue, currentLanguage)}
          </span>
        </div>
        </div>
      </aside>
    );
  }, [order, bookings, platformFee, campaignTotal, totalDue, currentLanguage, t]);

  if (loading) {
    return (
      <CheckoutShell isArabic={isArabic} backLabel={t('checkout.backToCart')}>
        <div className="checkout-loading">{t('checkout.loading')}</div>
      </CheckoutShell>
    );
  }

  if (error || !order) {
    return (
      <CheckoutShell isArabic={isArabic} backLabel={t('checkout.backToCart')}>
        <div className="checkout-state-page">
          <h1>{t('checkout.title')}</h1>
          <p style={{ color: '#dc2626' }}>{error || t('checkout.notFound')}</p>
        </div>
      </CheckoutShell>
    );
  }

  if (order.status === 'pending') {
    return (
      <CheckoutShell isArabic={isArabic} backLabel={t('checkout.backToCart')}>
        <div className="checkout-layout">
          {summaryBlock}
          <main className="checkout-main">
            <div className="checkout-state-page" style={{ padding: '20px 0', textAlign: 'start' }}>
              <h1>{t('checkout.title')}</h1>
              <p className="checkout-awaiting">{t('checkout.awaitingOwnerApproval')}</p>
            </div>
          </main>
        </div>
      </CheckoutShell>
    );
  }

  if (order.status === 'cancelled') {
    return (
      <CheckoutShell isArabic={isArabic} backLabel={t('checkout.backToCart')}>
        <div className="checkout-state-page">
          <h1>{t('checkout.title')}</h1>
          <p style={{ color: '#dc2626' }}>{t('checkout.orderCancelled')}</p>
        </div>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell isArabic={isArabic} backLabel={t('checkout.backToCart')}>
      <div className="checkout-layout">
        {summaryBlock}
        <main className="checkout-main">
          <section className="checkout-section">
            <h2 className="checkout-section-title">{t('checkout.payment')}</h2>
            <p className="checkout-payment-note">{t('checkout.secureNote')}</p>
            <div className="checkout-payment-options">
              <div className="checkout-payment-option">
                <label className="checkout-payment-radio">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'instapay'}
                    onChange={() => setPaymentMethod('instapay')}
                  />
                  <span className="checkout-payment-label">{t('checkout.instapay')}</span>
                  <span className="checkout-payment-icons">📱</span>
                </label>
                {paymentMethod === 'instapay' && (
                  <div className="checkout-payment-details">
                    <p>{t('checkout.instapayHint')}</p>
                    <div className="checkout-copy-row">
                      <code dir="ltr">{INSTAPAY_NUMBER}</code>
                      <button
                        type="button"
                        className="checkout-copy-btn"
                        onClick={() => copyToClipboard(INSTAPAY_NUMBER, 'instapay')}
                      >
                        {copied === 'instapay' ? t('checkout.copied') : t('checkout.copy')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="checkout-payment-option">
                <label className="checkout-payment-radio">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                  />
                  <span className="checkout-payment-label">{t('checkout.bankTransfer')}</span>
                  <span className="checkout-payment-icons">🏦</span>
                </label>
                {paymentMethod === 'bank' && (
                  <div className="checkout-payment-details">
                    <p>{t('checkout.bankHint')}</p>
                    <div className="checkout-copy-row">
                      <code dir="ltr">{BANK_ACCOUNT}</code>
                      <button
                        type="button"
                        className="checkout-copy-btn"
                        onClick={() => copyToClipboard(BANK_ACCOUNT, 'bank')}
                      >
                        {copied === 'bank' ? t('checkout.copied') : t('checkout.copy')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <button type="button" className="checkout-pay-btn" onClick={handlePayNow}>
            {t('checkout.payNow')}
          </button>
          <p className="checkout-pay-note">{t('checkout.paymentComingSoon')}</p>
        </main>
      </div>
    </CheckoutShell>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="checkout-loading" style={{ minHeight: '100vh' }}>
          …
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
