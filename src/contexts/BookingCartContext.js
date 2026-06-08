'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const CART_STORAGE_KEY = 'yaftty_booking_cart';

const BookingCartContext = createContext(null);

function sanitizeItemForStorage(item) {
  const { contentPreviewUrl, contentUrls, ...rest } = item;
  return {
    ...rest,
    hasLocalContent: Boolean(item.hasLocalContent || item.contentFileName),
    contentUrls: (contentUrls || []).filter(
      (u) => typeof u === 'string' && !u.startsWith('blob:')
    ),
  };
}

function loadCartFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistCart(items) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(items.map(sanitizeItemForStorage))
  );
}

export function BookingCartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const tempFilesRef = useRef(new Map());
  const previewUrlsRef = useRef(new Map());

  useEffect(() => {
    setItems(loadCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistCart(items);
  }, [items, hydrated]);

  const revokePreview = useCallback((cartItemId) => {
    const url = previewUrlsRef.current.get(cartItemId);
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
    previewUrlsRef.current.delete(cartItemId);
  }, []);

  const addItem = useCallback((item, contentFile = null) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.bannerId === item.bannerId);
      const cartItemId =
        existing?.cartItemId ||
        item.cartItemId ||
        `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      if (existing) revokePreview(existing.cartItemId);

      if (contentFile) {
        tempFilesRef.current.set(cartItemId, contentFile);
        const blobUrl = URL.createObjectURL(contentFile);
        previewUrlsRef.current.set(cartItemId, blobUrl);
        item = {
          ...item,
          cartItemId,
          contentFileName: contentFile.name,
          contentPreviewUrl: blobUrl,
          hasLocalContent: true,
          contentUrls: [],
        };
      } else {
        item = { ...item, cartItemId };
      }

      if (existing) {
        return prev.map((i) => (i.bannerId === item.bannerId ? { ...i, ...item } : i));
      }
      return [...prev, item];
    });
  }, [revokePreview]);

  const removeItem = useCallback(
    (cartItemId) => {
      revokePreview(cartItemId);
      tempFilesRef.current.delete(cartItemId);
      setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    },
    [revokePreview]
  );

  const clearCart = useCallback(() => {
    setItems((prev) => {
      prev.forEach((i) => revokePreview(i.cartItemId));
      return [];
    });
    tempFilesRef.current.clear();
    previewUrlsRef.current.clear();
  }, [revokePreview]);

  const updateItem = useCallback((cartItemId, patch) => {
    setItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, ...patch } : i))
    );
  }, []);

  const getTempContentFile = useCallback((cartItemId) => {
    return tempFilesRef.current.get(cartItemId) || null;
  }, []);

  const getContentPreviewUrl = useCallback((item) => {
    if (!item) return null;
    return (
      previewUrlsRef.current.get(item.cartItemId) ||
      item.contentPreviewUrl ||
      null
    );
  }, []);

  const value = {
    items,
    itemCount: items.length,
    hydrated,
    addItem,
    removeItem,
    clearCart,
    updateItem,
    getTempContentFile,
    getContentPreviewUrl,
  };

  return (
    <BookingCartContext.Provider value={value}>{children}</BookingCartContext.Provider>
  );
}

export function useBookingCart() {
  const ctx = useContext(BookingCartContext);
  if (!ctx) {
    throw new Error('useBookingCart must be used within BookingCartProvider');
  }
  return ctx;
}
