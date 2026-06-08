'use client';

import React, { useState } from 'react';
import { MapPin, X, Calendar, Ruler, Tag, MapPin as LocationIcon } from 'lucide-react';
import { formatEgpPerMonth } from '../lib/money';
import { localizeDigitsInString } from '../lib/localeFormat';
import { useLanguage } from '../contexts/LanguageContext';

const BannerPin = ({ banner, onClick }) => {
  const { currentLanguage } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Get pin color based on banner type
  const getPinColor = (type) => {
    switch (type) {
      case 'RGB':
        return 'linear-gradient(135deg, #123a8f 0%, #123a8f 100%)';
      case 'Paper':
        return 'linear-gradient(135deg, #059669 0%, #047857 100%)';
      default:
        return 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
    }
  };

  // Get pin icon based on banner type
  const getPinIcon = (type) => {
    switch (type) {
      case 'RGB':
        return <MapPin size={18} color="white" />;
      case 'Paper':
        return <MapPin size={18} color="white" />;
      default:
        return <MapPin size={18} color="white" />;
    }
  };

  const getPinBaseColor = (type) => {
    switch (type) {
      case 'RGB':
        return '#123a8f';
      case 'Paper':
        return '#059669';
      default:
        return '#7c3aed';
    }
  };

  const markerSize = isHovered ? 52 : 46;
  const tooltipGap = 10;

  return (
    <div
      style={{ position: 'relative', width: 0, height: 0, cursor: 'pointer', overflow: 'visible' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(banner)}
    >
      {/* Tooltip — above pin; pointer-events off so hover stays on marker */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: markerSize + tooltipGap,
            transform: 'translateX(-50%)',
            background: '#fff',
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
            fontSize: 13,
            fontWeight: 600,
            color: '#1f2937',
            whiteSpace: 'nowrap',
            zIndex: 2,
            textAlign: 'center',
            minWidth: 140,
            pointerEvents: 'none',
            direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{banner.location}</div>
          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>
            {banner.type} • {localizeDigitsInString(banner.size, currentLanguage)}
          </div>
          {typeof banner.pricePerMonth !== 'undefined' && (
            <div style={{ fontSize: 11, color: '#059669', fontWeight: 700, marginTop: 4 }}>
              {formatEgpPerMonth(banner.pricePerMonth, currentLanguage)}
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #fff',
              filter: 'drop-shadow(0 1px 0 #e5e7eb)',
            }}
          />
        </div>
      )}

      {/* Pin bottom sits on map coordinate (matches Marker anchor="bottom") */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          width: markerSize,
          height: markerSize,
          borderRadius: '50%',
          background: getPinColor ? getPinColor(banner.type) : '#123a8f',
          border: '3px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isHovered
            ? '0 12px 28px rgba(18, 58, 143, 0.42)'
            : '0 6px 18px rgba(18, 58, 143, 0.28)',
          transition: 'width 150ms ease, height 150ms ease, box-shadow 150ms ease',
          zIndex: 1,
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', pointerEvents: 'none' }}
        >
          <rect x="3" y="4" width="18" height="11" rx="2" fill="#ffffff" opacity="0.96" />
          <rect x="5" y="7" width="6" height="2" rx="1" fill="#d1d5db" />
          <rect x="12.5" y="7" width="6" height="2" rx="1" fill="#d1d5db" />
          <rect x="5" y="10.5" width="13.5" height="1.8" rx="0.9" fill="#cbd5e1" />
          <rect x="8" y="15.5" width="2" height="4.5" rx="1" fill="#e5e7eb" />
          <rect x="14" y="15.5" width="2" height="4.5" rx="1" fill="#e5e7eb" />
          <rect x="6.5" y="20" width="11" height="1.6" rx="0.8" fill="#e5e7eb" />
        </svg>
      </div>
    </div>
  );
};

export default BannerPin; 